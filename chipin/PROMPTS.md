# Build prompts — paste in order

One at a time. Check it works in the browser before moving to the next.
If something breaks, tell Claude Code what you saw — don't move on.

---

## Setup, once

1. Make a folder called `chipin`.
2. Put `CLAUDE.md`, this file, and `chipin-page.html` inside it.
3. Open Claude Code and point it at that folder. It reads `CLAUDE.md` on its own.

---

# Week 1 — make it real

### 1. Scaffold

```
Read CLAUDE.md, then set up a Next.js App Router project with TypeScript
and Tailwind in this folder. Configure the design tokens from CLAUDE.md
as Tailwind theme colors and load Archivo Black, Courier Prime and Inter.
Build one route, /[slug], that renders the same ask page as
chipin-page.html but with hardcoded data. Match the receipt styling
closely — perforated edges, dashed rules, mono figures.
```

Check: `npm run dev`, visit `/maya`, and it should look like the HTML file.

### 2. Database

```
Set up Supabase for this project. Create the profiles, asks and donations
tables exactly as specified in CLAUDE.md, with row level security:
profiles and asks are publicly readable, writable only by their owner.
Add a .env.example. Then make /[slug] load real data from Supabase
instead of the hardcoded values, and return a proper 404 for unknown slugs.
```

Check: add a row by hand in the Supabase dashboard, load its slug.

### 3. Accounts and claiming a handle

```
Add Supabase email auth. Build /signup where a logged-in user claims their
slug, picks a payment rail, and enters their handle. Validate the slug is
unique and lowercase alphanumeric with dots, dashes and underscores.
Show the rail warnings from CLAUDE.md when the user picks Cash App,
Venmo or Interac.
```

Check: make an account, claim a slug, see your page at that URL.

### 4. Handle verification — the important one

```
Generate a random 6-character code per profile on signup. Build a
verification screen telling the user to paste it into their payment app's
profile bio, with an "I've added it" button that marks handle_verified.
For now trust the click, but structure it so a real check can be swapped in.
Asks must not be publishable until handle_verified is true. Show a
verified or unverified badge on the public page.
```

Check: an unverified account cannot publish.

### 5. Creating an ask

```
Build /dashboard where a verified user creates one active ask: title,
goal amount, optional photo. Enforce the $50 cap server-side, not just
in the form. Their /[slug] page shows the active ask with a live
progress bar.
```

### 6. The receipt

```
When confirmed donations reach the goal, mark the ask funded and show the
FUNDED stamp. Unlock a receipt upload on the dashboard that stores the
photo in Supabase Storage and displays it publicly on the ask page.
An ask funded more than 7 days ago with no receipt gets a visible
"no receipt posted" mark. Don't let a receipt be uploaded before funding.
```

Check: this is the payoff loop. Fund an ask manually in the database, upload a photo, see it public.

---

# Week 2 — money and the leaderboard

### 7. Donations, honest version

```
Add a Chip In button opening a sheet: amount picker ($1/$3/$5/$10) and a
tip slider defaulting to 5%, adjustable to 0, with a plain breakdown of
what the recipient gets versus the tip. On confirm, open the recipient's
payment deep link with the amount prefilled, and record the donation as
unconfirmed. The recipient confirms receipt from their dashboard.
Only confirmed donations count toward the goal or the leaderboard.
```

### 8. The leaderboard — do not treat this as optional

```
Build /givers: a global leaderboard ranking people by total confirmed
donations across all asks. Also show a per-ask giver list on each ask
page. Let a giver set a display name and choose to be anonymous.
Style it as a receipt line-item list — mono figures, dashed rules.
This is the main differentiator, so give it a real page, real polish,
and a link in the main nav.
```

### 9. Stripe Connect

```
Integrate Stripe Connect Express so the platform tip is charged through
Stripe while the donation itself goes to the recipient. We must never
hold funds — read the hard rules in CLAUDE.md before designing this.
Handle webhooks to mark donations confirmed automatically, replacing
manual recipient confirmation where Stripe is used.
```

Only after your Stripe Connect application is approved.

### 10. Ship it

```
Prepare this for deployment on Vercel: environment variables, build
checks, a basic OG image on ask pages so the link previews well when
pasted into TikTok, and a simple landing page at / explaining what
Chip In is with a signup call to action.
```

---

## Before real money moves

One hour with a fintech lawyer in Montreal. One question: **does this flow make us a money services business under FINTRAC?** Get it in writing.

---

## If Claude Code goes off the rails

- "Stop. Revert that and do only the thing I asked."
- "You changed files I didn't ask about. Show me the diff."
- "Re-read CLAUDE.md and tell me which rule this breaks."

Commit to git after every step that works. That's your undo button.
