# The November Window — course platform

Membership site wrapping the interactive playbook (`content/playbook.html`).
**Stack:** Next.js (App Router) · Vercel · Supabase (auth + DB) · Stripe ($47/mo sub) · Resend (onboarding email) · Mux (video + watch tracking).

## What's already built

| Piece | Where | Status |
|---|---|---|
| Sales/landing page (countdown hero, curriculum, $47/mo pricing) | `app/page.tsx` | ✅ done |
| Magic-link login (no passwords) | `app/login/`, `app/auth/callback/` | ✅ done |
| Paywall — playbook + dashboard gated to active subs / comps / admin | `app/course/layout.tsx`, `lib/access.ts` | ✅ done |
| The playbook itself, served gated, **progress synced to Supabase** (was localStorage stubs) | `app/course/playbook/route.ts`, `content/playbook.html` | ✅ done |
| Member dashboard: resume bar + Mux video modules | `app/course/page.tsx`, `components/MuxVideo.tsx` | ✅ done |
| Stripe checkout + webhook (provisions user, records sub, sends welcome email) | `app/api/checkout/`, `app/api/stripe/webhook/` | ✅ done |
| Resend welcome email (magic sign-in link, branded) | `emails/welcome.ts`, `lib/resend.ts` | ✅ done |
| Admin: manual member invite + **PDF progress export** | `app/admin/`, `app/api/admin/` | ✅ done |
| Database schema — append-only events, archive-not-delete everywhere | `supabase/schema.sql` | ✅ run it yourself (step 2) |
| Mux webhook — signature verified, `video.asset.ready` auto-fills playback IDs | `app/api/mux/webhook/route.ts` | ✅ done |

Nothing in the DB is ever hard-deleted: cancellations and removals set `archived_at`, and `progress_events` is an append-only audit log. The PDF export includes archived members.

---

## Setup — do these in order

### 1. GitHub + local
```bash
npm install
cp .env.example .env.local     # fill it in as you complete the steps below
git init && git add -A && git commit -m "initial"
# create a repo on github.com, then:
git remote add origin <your-repo-url> && git push -u origin main
```

### 2. Supabase
1. Create a project at supabase.com.
2. **SQL Editor → New query** → paste all of `supabase/schema.sql` → Run.
3. **Project Settings → API**: copy the URL, `anon` key, and `service_role` key into `.env.local`.
4. **Authentication → URL Configuration**: set Site URL to your domain, add `https://yourdomain.com/auth/callback` (and `http://localhost:3000/auth/callback`) to Redirect URLs.
5. Make yourself admin: sign in once via the login page (invite yourself first via SQL: it's easiest to just run
   `insert into auth.users` is fiddly — instead use **Authentication → Users → Add user** with your email, then run:
   ```sql
   update public.profiles set role = 'admin', comp_access = true where email = 'you@example.com';
   ```

### 3. Stripe
1. **Products → Add product**: "The November Window", recurring, **$47.00 USD / month**. Copy the `price_...` id → `STRIPE_PRICE_ID`.
2. **Developers → API keys**: secret key → `STRIPE_SECRET_KEY`.
3. **Developers → Webhooks → Add endpoint**: `https://yourdomain.com/api/stripe/webhook`, events:
   `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`.
   Copy the signing secret → `STRIPE_WEBHOOK_SECRET`.
4. Local testing: `stripe listen --forward-to localhost:3000/api/stripe/webhook` (use the secret it prints).

### 4. Resend
1. Add + verify your domain (DNS records) at resend.com.
2. API key → `RESEND_API_KEY`. Set `RESEND_FROM` to a verified address, e.g. `The November Window <access@yourdomain.com>`.
3. Optional but recommended: point Supabase's own auth emails at Resend too (Supabase → Authentication → SMTP) so login links match your domain.

### 5. Mux
1. Create an environment at mux.com → **Settings → API Access Tokens** → `MUX_TOKEN_ID` / `MUX_TOKEN_SECRET`.
2. Upload course videos (dashboard is fine to start). For each asset, copy its **playback ID** into the `modules` table:
   ```sql
   update public.modules set mux_playback_id = 'YOUR_PLAYBACK_ID', published = true
   where title = 'Orientation — how to run the playbook';
   ```
3. **Settings → Webhooks** → `https://yourdomain.com/api/mux/webhook`, copy secret → `MUX_WEBHOOK_SECRET`. When an asset finishes processing, the webhook fills `modules.mux_playback_id` + `duration_secs` automatically — it targets the module whose UUID you put in the asset's `passthrough` field, or (if no passthrough) the first unfilled module by position. You still flip `published = true` yourself.
4. Note: playback IDs here are public-playback. If you want tighter security later, switch to Mux **signed playback** — that's a TODO.

### 6. Vercel
1. Buy the domain (Vercel, Namecheap, wherever) and point it at Vercel.
2. Import the GitHub repo into Vercel. Add **every** variable from `.env.local` in Project → Settings → Environment Variables (set `NEXT_PUBLIC_SITE_URL` to the real domain).
3. Deploy. Then update the Stripe + Mux webhook URLs and Supabase redirect URLs to the live domain.

### 7. Smoke test (in order)
- [ ] Landing page loads, countdown ticks.
- [ ] Buy with Stripe test card `4242 4242 4242 4242` → lands on `/welcome` → welcome email arrives → link opens `/course`.
- [ ] Open the playbook, mark two sections complete, tick a checklist → refresh in a different browser after logging in → state persists.
- [ ] `/admin` → invite a test email → onboarding email arrives, member has access.
- [ ] `/admin` → Download PDF → shows both members with correct section counts.
- [ ] Cancel the test sub in Stripe → member loses `/course` access; their row is archived, not deleted.

---

## TODO (good Claude Code tasks)
- ~~Mux webhook signature verification + `video.asset.ready` → auto-fill `modules.mux_playback_id`.~~ ✅ done
- Stripe Customer Portal link on the dashboard (self-serve cancel/update card).
- Admin members table UI (list, search, archive button) — API/data layer already supports it.
- Rate-limit `/api/progress` (e.g. Vercel firewall or upstash) — low priority.
- Legal pages: Terms, Privacy, refund policy — required before running paid traffic; ad platforms check for these.
- Switch Mux to signed playback URLs if piracy becomes a problem.

## Prompt for Claude Code

Paste this after opening the repo:

> Read README.md and CLAUDE.md in full before touching anything. This is a Next.js App Router membership site; the product content is `content/playbook.html` — do not restructure or rewrite that file beyond what a task requires; its inline script syncs state via `window.__NW_STATE__` (injected by `app/course/playbook/route.ts`) and POSTs to `/api/progress`. Database rules: never hard-delete rows — archive via `archived_at`; `progress_events` is append-only. First, run `npm install` and `npm run build` and fix any build errors. Then walk me through the setup checklist in README.md step by step, telling me exactly what to click/copy in each dashboard (Supabase, Stripe, Resend, Mux, Vercel) and verifying each env var with me before moving on. After the smoke test passes, work through the TODO list in README.md in order, starting with Mux webhook signature verification.
