# Chip In — project context

Read this before doing anything. It's the standing brief for this project.

---

## What we're building

A link-in-bio page for small money asks, aimed at TikTok.

Someone gets `chipin.co/maya`. The page shows what she's raising for, a live progress bar, her verified payment handle, who chipped in, and — once funded — a photo proving she bought the thing. She pastes that link in her TikTok bio.

**Not** a feed. **Not** a native app. A website.

## Who it's for

The **giver**, not the asker. People asking for money are infinite and free; people willing to send it are scarce. When a design decision is ambiguous, it resolves in favour of the person giving.

## The two things competitors don't have

Ko-fi, Throne, Buy Me a Coffee and GoFundMe all have link-in-bio pages and goal progress bars. They are free and mature. We do not compete on those.

1. **The receipt.** Proof of purchase, uploaded after funding, public and permanent. An ask that never posts one is publicly marked.
2. **The giver leaderboard.** Global ranking of who has given the most. This is status, and status is the product.

These two are the pitch. Never bury them behind the progress bar.

---

## Stack

- **Next.js** (App Router) + TypeScript
- **Supabase** — Postgres, auth, storage for receipt photos
- **Tailwind** for styling
- **Stripe Connect** for payments
- Deploy on **Vercel**

Prefer boring and standard. No state management library, no ORM beyond the Supabase client, no component library.

---

## Hard rules — do not violate

1. **Never hold user funds.** Money moves donor → recipient. Holding a balance makes us a money services business (FINTRAC in Canada, state licensing in the US). No wallets, no stored value, no "Chip In balance."
2. **100% of the donation reaches the recipient.** Our revenue is a separate optional tip charged on top, defaulting to 5%, adjustable to 0. Never a cut of the donation itself.
3. **Web only.** No iOS or Android build. Apple requires 100% of person-to-person gifts to reach the receiver; staying off the App Store sidesteps it.
4. **Asks are capped at $50.** Keeps the tone playful and limits regulatory exposure. Enforce server-side.
5. **A handle must be verified before an ask goes live.** No exceptions — verification is what we're actually selling.
6. **Never trust the client for money or state.** Amounts, caps, and funded status are computed server-side.

## Don't build

Native apps, a swipe feed, chat, comments, follows, notifications, recurring memberships, our own payment processing, an admin panel before there's anything to admin.

---

## Data model

```
profiles     id, slug (unique), display_name, rail, handle,
             handle_verified, verify_code, created_at
asks         id, profile_id, title, goal_cents, funded_at,
             receipt_url, created_at
donations    id, ask_id, giver_name, amount_cents, tip_cents,
             confirmed_by_recipient, stripe_session_id, created_at
```

- An ask is funded when confirmed donations ≥ goal.
- `confirmed_by_recipient` guards the leaderboard. Until Stripe Connect is live, donations are self-reported and must be confirmed by the recipient before counting.
- Leaderboard totals come from confirmed donations only. Never from raw sums.

## Payment rails

Users link their own PayPal, Cash App, Venmo, or Interac. Deep links prefill the amount:

- PayPal — `https://paypal.me/{handle}/{amount}`
- Cash App — `https://cash.app/${handle}/{amount}`
- Venmo — `https://venmo.com/{handle}?txn=pay&amount={amount}`
- Interac — no link exists; copy the email to clipboard

Warn users at selection time: Cash App is US/UK only, Venmo is US-only and exposes real names and friend lists.

---

## Design

The visual reference is `chipin-page.html` in this folder. Match it. The page is styled as a **receipt** — that's the concept, because we sell proof.

```
--paper   #EDEBE3      --mustard #E8B33C
--card    #FDFCF8      --forest  #16332B
--ink     #17170F      --stamp   #D8321F
--soft    #75736A      --go      #2F8F5B
--rule    #D6D3C7
```

- Display: **Archivo Black** — headlines, amounts, the FUNDED stamp
- Mono: **Courier Prime** — all figures, labels, line items, meta text
- Body: **Inter**

Signature elements to preserve: perforated top and bottom edges on the receipt card, dashed rules between line-item blocks, the rotated red FUNDED stamp, and figures always set in mono.

Mobile-first — nearly all traffic arrives from a TikTok bio on a phone.

---

## Tone

Plain and slightly dry. "Chip in," not "Support my journey." Never sentimental — this is wants, not needs. The product is funny by being matter-of-fact about someone wanting steak.

---

## Working agreement

- One feature at a time. Stop and let me check it before starting the next.
- Don't refactor things I didn't ask about.
- If something here conflicts with what I ask for in the moment, say so instead of silently picking one.
