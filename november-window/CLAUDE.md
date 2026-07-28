# CLAUDE.md — project rules

Membership site for "The November Window" ($97.99 one-time, lifetime access). Next.js App Router + Supabase + Stripe + Resend + Mux on Vercel.

## Non-negotiables
- **Never hard-delete data.** Removals set `archived_at`. `progress_events` is append-only (no UPDATE/DELETE — RLS + revoked grants enforce this; don't work around it with the service role).
- **`content/playbook.html` is the product.** It's a self-contained page with its own inline CSS/JS. Don't port it to React, reformat it, or rename its element IDs (`p0`–`pd`, checklist `data-ck` keys) — member progress in `playbook_state.state` is keyed to them.
- **Service-role key is server-only.** Only `lib/supabase/admin.ts` may use it; never import that file from a client component.
- **Access rule lives in one place:** `lib/access.ts` (`admin || comp_access || an active row in subscriptions` — one-time purchases are recorded there as permanently-active rows). Change it there only.

## How progress works
1. `app/course/playbook/route.ts` gates the request, loads the member's `playbook_state`, injects it as `window.__NW_STATE__`, serves the HTML.
2. The playbook's `save()` debounces 600ms and POSTs `{state}` to `/api/progress`.
3. `/api/progress` upserts `playbook_state` and appends a `progress_events` row.
4. Video: `components/MuxVideo.tsx` POSTs to `/api/video-progress` every ~10s of playback.
5. `/api/admin/export` renders all of it to PDF (pdf-lib), archived members included.

## Money flow
Landing CTA → `GET /api/checkout` (Stripe Checkout, one-time payment) → webhook `checkout.session.completed` → create/find Supabase user → record the purchase in `subscriptions` (status stays active forever) → Resend welcome email containing an admin-generated magic link → `/auth/callback` → `/course`.

## Env
See `.env.example`. All secrets go in Vercel project env vars; `NEXT_PUBLIC_*` are the only browser-safe ones.
