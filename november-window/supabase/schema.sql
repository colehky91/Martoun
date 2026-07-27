-- ═══════════════════════════════════════════════════════════════════
-- THE NOVEMBER WINDOW — Supabase schema
-- Run this in the Supabase SQL Editor (Dashboard → SQL → New query).
-- Design rules:
--   • Nothing is hard-deleted. Rows are archived via archived_at.
--   • progress_events is APPEND-ONLY — it is the audit trail behind
--     the PDF export. State tables hold "current", events hold history.
-- ═══════════════════════════════════════════════════════════════════

-- ── 1. Profiles ────────────────────────────────────────────────────
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id),
  email       text not null,
  full_name   text,
  role        text not null default 'member' check (role in ('member','admin')),
  comp_access boolean not null default false,   -- manual/free access granted by admin
  created_at  timestamptz not null default now(),
  archived_at timestamptz                        -- soft delete only
);

-- auto-create a profile whenever a user signs up / is invited
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ── 2. Subscriptions (mirrored from Stripe via webhook) ────────────
create table if not exists public.subscriptions (
  id                     uuid primary key default gen_random_uuid(),
  user_id                uuid not null references public.profiles(id),
  stripe_customer_id     text,
  stripe_subscription_id text unique,
  status                 text not null,          -- active | trialing | past_due | canceled | ...
  current_period_end     timestamptz,
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now(),
  archived_at            timestamptz             -- set when canceled; never delete
);
create index if not exists subscriptions_user_idx on public.subscriptions(user_id);

-- ── 3. Playbook progress — current state ───────────────────────────
-- Mirrors the playbook's in-page state object: { done:{}, checks:{} }
create table if not exists public.playbook_state (
  user_id    uuid primary key references public.profiles(id),
  state      jsonb not null default '{"done":{},"checks":{}}'::jsonb,
  updated_at timestamptz not null default now()
);

-- ── 4. Progress events — append-only history ───────────────────────
create table if not exists public.progress_events (
  id         bigint generated always as identity primary key,
  user_id    uuid not null references public.profiles(id),
  kind       text not null,          -- 'playbook_sync' | 'video_progress' | 'login' | ...
  payload    jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists progress_events_user_idx on public.progress_events(user_id, created_at);

-- ── 5. Video modules (Mux) ─────────────────────────────────────────
create table if not exists public.modules (
  id              uuid primary key default gen_random_uuid(),
  position        int not null,
  title           text not null,
  description     text,
  mux_playback_id text,               -- fill in after uploading to Mux
  duration_secs   int,
  published       boolean not null default false,
  created_at      timestamptz not null default now(),
  archived_at     timestamptz
);

create table if not exists public.video_progress (
  user_id         uuid not null references public.profiles(id),
  module_id       uuid not null references public.modules(id),
  seconds_watched numeric not null default 0,
  pct_complete    numeric not null default 0,
  updated_at      timestamptz not null default now(),
  primary key (user_id, module_id)
);

-- Seed placeholder modules (edit titles / add mux_playback_id later)
insert into public.modules (position, title, description, published) values
  (1, 'Orientation — how to run the playbook', 'Watch before Section 00.', false),
  (2, 'The pipeline, on screen', 'Full walkthrough of the content machine from Section 06.', false),
  (3, 'Launch week, live', 'Recorded during the Nov 12 window.', false)
on conflict do nothing;

-- ── 6. Row Level Security ──────────────────────────────────────────
alter table public.profiles        enable row level security;
alter table public.subscriptions   enable row level security;
alter table public.playbook_state  enable row level security;
alter table public.progress_events enable row level security;
alter table public.modules         enable row level security;
alter table public.video_progress  enable row level security;

-- members: read own profile
create policy "read own profile" on public.profiles
  for select using (auth.uid() = id);

-- members: read own subscription
create policy "read own subscription" on public.subscriptions
  for select using (auth.uid() = user_id);

-- members: read/write own playbook state
create policy "read own state"  on public.playbook_state
  for select using (auth.uid() = user_id);
create policy "write own state" on public.playbook_state
  for insert with check (auth.uid() = user_id);
create policy "update own state" on public.playbook_state
  for update using (auth.uid() = user_id);

-- members: append own events, read own events. No update, no delete — ever.
create policy "append own events" on public.progress_events
  for insert with check (auth.uid() = user_id);
create policy "read own events" on public.progress_events
  for select using (auth.uid() = user_id);

-- members: read published modules, track own video progress
create policy "read published modules" on public.modules
  for select using (published = true and archived_at is null);
create policy "read own video progress" on public.video_progress
  for select using (auth.uid() = user_id);
create policy "write own video progress" on public.video_progress
  for insert with check (auth.uid() = user_id);
create policy "update own video progress" on public.video_progress
  for update using (auth.uid() = user_id);

-- Admin dashboard reads/writes go through the service-role key in API
-- routes (service role bypasses RLS), so no admin policies are needed here.

-- Belt & suspenders: revoke DELETE from client roles entirely.
revoke delete on public.profiles, public.subscriptions, public.playbook_state,
                 public.progress_events, public.modules, public.video_progress
  from anon, authenticated;
