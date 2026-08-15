# Chip In — Lovable build prompts

Paste these into Lovable **in order**. Check the preview after each one before
moving on. If something breaks, tell Lovable exactly what you saw on screen —
don't stack a new prompt on top of a broken one.

---

## Step 0 — set the Knowledge first (do this before anything else)

In Lovable, open **Project Settings → Knowledge** and paste the block below.
Lovable re-reads Knowledge on every message, so this is what stops it drifting
five prompts from now. It is not a build instruction — it's the standing brief.

```
CHIP IN — STANDING BRIEF

WHAT IT IS
A public feed of tiny, specific money asks. Someone posts "$5 for a coffee at
Starbucks." The post carries a live progress bar and a Chip In button. Other
people send the money. After the ask is funded, the asker must post a photo
receipt proving they actually bought the thing.

Think Twitter, but every post is a small ask with a price on it.

WHO IT'S FOR
The giver, not the asker. People asking for money are infinite and free; people
willing to send it are scarce. When a design decision is ambiguous, resolve it
in favour of the person giving.

THE THREE THINGS THAT MAKE IT DIFFERENT
1. THE RECEIPT. Proof of purchase, posted after funding, public and permanent.
   An ask that never posts one is publicly marked as such, forever.
2. GIVING BUYS REACH. The more you give, the higher your own asks rank in the
   feed. Generosity is the ranking signal. This is the engine of the whole app.
3. THE LEADERBOARD. Global ranking of who has given the most. Status is the
   product.
Never bury these behind the progress bar.

HARD RULES — DO NOT VIOLATE
1. Never hold user funds. Money moves donor → recipient directly, through the
   recipient's own payment link. No wallets, no stored value, no "Chip In
   balance." Holding a balance makes us a money services business.
2. 100% of a donation reaches the recipient. Platform revenue is a separate
   optional tip charged on top, defaulting to 5%, adjustable to 0. Never a cut
   of the donation itself.
3. Web only. No iOS or Android build, ever. No app store wrappers.
4. Asks are capped at $50. Enforce server-side, not just in the form.
5. A payment handle must be verified before that person can post an ask.
   Verification is what we're actually selling.
6. Never trust the client for money, ranking, or state. Amounts, caps, funded
   status, giver scores and feed ranking are all computed server-side.
7. Only recipient-confirmed donations count toward anything — goals, the
   leaderboard, or feed ranking. Never raw sums.

DON'T BUILD
Native apps. Chat or DMs. Comments threads. Follows. Push notifications.
Recurring memberships. Our own payment processing. An admin panel. Stories.
Video. Anything that turns this into a social network instead of a market.

TONE
Plain and slightly dry. "Chip in," not "Support my journey." Never sentimental —
this is wants, not needs. The product is funny by being matter-of-fact about
someone wanting a coffee.

DESIGN
Every ask is styled as a paper receipt. That's the concept, because we sell
proof. Mobile first — nearly all traffic is on a phone.

Colors:
  paper   #EDEBE3     mustard #E8B33C
  card    #FDFCF8     forest  #16332B
  ink     #17170F     stamp   #D8321F
  soft    #75736A     go      #2F8F5B
  rule    #D6D3C7

Fonts:
  Archivo Black  — headlines, amounts, the FUNDED stamp
  Courier Prime  — ALL figures, labels, line items, meta text
  Inter          — body copy

Signature elements, never remove: perforated top and bottom edges on receipt
cards, dashed rules between line-item blocks, the rotated red FUNDED stamp,
and every number set in Courier Prime.
```

---

## Step 1 — the flagship prompt (this is the one that matters)

Paste this as your first message in a **new Lovable project**.

```
Build the first version of Chip In, a mobile-first web app. Read the project
Knowledge before you start — the standing brief, the hard rules and the design
system are all there, and they override anything you'd normally reach for.

For this first pass use realistic seeded demo data. No auth, no database, no
payments yet — I want to see and feel the feed before we wire anything up.

BUILD THESE THREE SCREENS

1. THE FEED (home, "/")
A single scrolling column of ask cards, max width 480px, centred. This is the
heart of the app, so it gets the real attention.

Each ask card is a paper receipt:
- Perforated top and bottom edges (CSS mask with repeating radial-gradients —
  do not fake this with a border)
- Header row: display name in Inter semibold, then either a green "HANDLE
  VERIFIED" pill or a red outlined "UNVERIFIED" pill, then the time posted in
  Courier Prime, right-aligned and muted
- Under that, their payment handle in Courier Prime, muted — e.g.
  "paypal.me/mayacooks"
- The ask itself in Archivo Black, about 20px, tight leading. Keep it short —
  these are one-liners like "Large iced coffee before my 8am shift"
- A thin progress bar: mustard fill on a rule-coloured track, 8px tall, square
  corners. It turns green the moment the goal is hit
- One line under the bar in Courier Prime: "60% — $3.00 of $5.00"
- A dashed-rule line-item block, all Courier Prime, label left and figure right:
  Goal / Raised / Givers / and a bolder "Still short" line separated by a solid
  rule above it
- A full-width "Chip in" button in Archivo Black on ink-black. When the ask is
  fully funded it becomes a disabled green button reading "Fully funded"
- When funded, a red "FUNDED" stamp sits rotated about -11 degrees in the top
  right of the card, with a 3px red border, slightly transparent, and it
  animates in with a quick scale-down "thud" on first render
- When funded AND a receipt photo exists, show the photo at the bottom of the
  card under a Courier Prime caption reading "PROOF OF PURCHASE", with a line
  below it: "Posted by {name} after funding."
- When funded more than 7 days ago with NO receipt, show a red-bordered block
  reading "NO RECEIPT POSTED" instead. This mark is permanent and it should
  feel like a stain

Above the feed, a compose box, always visible at the top, styled like a blank
receipt waiting to be filled in:
- A single-line input: "What do you need?"
- A small amount input beside it with a "$" prefix, capped at 50
- A "Post the ask" button in Archivo Black
For now it just optimistically prepends a card to the feed.

Also at the top of the feed, two tabs in Courier Prime uppercase: "TOP" and
"NEW". TOP is the default and is the ranked feed. NEW is plain reverse
chronological. Make TOP visibly the main event.

Seed the feed with about 12 asks that sell the concept — all small, specific,
slightly funny, matter-of-fact. Examples of the right register:
  "Large iced coffee before my 8am shift" — $5
  "One (1) bus fare so I don't walk 40 minutes in the rain" — $3
  "Steak and sweet potato for my roommate's birthday" — $30
  "The good conditioner, not the cheap one" — $12
  "Printer ink. That's it. That's the ask." — $22
Mix the states: most partly funded, two fully funded with a receipt photo
showing, one funded long ago with the NO RECEIPT POSTED mark, one at zero.

2. THE LEADERBOARD ("/givers")
A global ranking of people by total confirmed money given. Style it as one long
receipt — a line-item list, not cards:
- Rank number in Archivo Black, muted, except rank 1 which is mustard
- Display name in Inter medium
- Total given in Courier Prime bold, right-aligned
- A thin solid rule between rows
- The top 3 get slightly more vertical room and a subtle mustard left edge
At the top of the page, a short dry explainer panel: giving is ranked here, and
giving is also what gets your own asks seen. Seed ~20 givers with believable
handles and amounts.

3. A PROFILE ("/u/:slug")
A header block: display name, verified pill, payment handle, and three figures
in Courier Prime — total given, total raised, and receipts posted vs receipts
owed. Under the header, that person's own ask cards in the same style as the
feed. Seed two or three profiles so the links from the feed actually go
somewhere.

NAVIGATION
A slim forest-green top bar, fixed, on every page: "CHIP" in paper white and
"IN" in mustard, both Archivo Black. On the right, three Courier Prime uppercase
links: FEED, GIVERS, and a placeholder profile link. That's the whole nav.

CRAFT NOTES — these are what will make or break it
- Every single number on screen is Courier Prime. No exceptions.
- Nothing has a large border radius. 2-3px maximum. This is paper, not glass.
- No gradients, no glassmorphism, no drop shadows beyond a single soft one under
  each receipt card. No emoji anywhere in the UI.
- Generous vertical space between cards so each ask reads as its own slip of
  paper on a desk.
- Respect prefers-reduced-motion: kill the stamp animation and all transitions.
- Everything must look right at 390px wide first. Desktop is just the same
  column, centred, with more air around it.
```

**Check:** it looks like a stack of paper receipts, the FUNDED stamp is rotated
and red, every figure is typewriter font, and it reads well on your phone. Get
this right before moving on — every later step inherits this look.

---

## Step 2 — accounts and real data

```
Now make it real. Add Supabase auth (email and password, plus magic link) and
replace all seeded data with real tables.

Tables:
  profiles    id, slug (unique, lowercase, letters/numbers/dots/dashes/
              underscores only), display_name, avatar_url, rail, handle,
              handle_verified, verify_code, created_at
  asks        id, profile_id, body (max 90 chars), goal_cents (max 5000),
              photo_url, funded_at, receipt_url, created_at
  donations   id, ask_id, giver_profile_id, giver_display_name, is_anonymous,
              amount_cents, tip_cents, confirmed_by_recipient, confirmed_at,
              created_at

Row level security:
- profiles and asks are publicly readable; writable only by their owner
- donations are publicly readable; insertable by any signed-in user; the
  confirmed_by_recipient flag is updatable ONLY by the owner of the ask being
  donated to, and never by the giver
- nobody can update amount_cents after insert

After signup, a user picks their slug and their payment rail (PayPal, Cash App,
Venmo or Interac) and enters their handle. Validate the slug is unique. When
they pick a rail, show the warning for it inline, at the moment they pick:
  Cash App — only works in the US and UK. Everyone else sees a dead link.
  Venmo — US only. Also shows your real name and friend list to anyone who
    looks you up.
  Interac — has no payment link at all. Givers must copy your email and send it
    manually. Expect most of them to drop off.

Enforce the $50 cap in a database constraint AND in an edge function, not just
in the form. Never trust the client with money.
```

---

## Step 3 — verification, the thing we're actually selling

```
Generate a random 6-character code per profile at signup (uppercase letters and
digits, no ambiguous characters like O/0 or I/1).

Build a verification screen: show the code big, in Archivo Black on forest
green with mustard text, and tell the user to paste it into their payment app's
profile bio. An "I've added it" button marks handle_verified true.

For now, trust the click — but isolate it behind a single server-side function
called verifyHandle() so a real check can be dropped in later without touching
any UI.

Hard rule: an unverified profile CANNOT post an ask. The compose box is visible
but disabled for them, with a one-line prompt to verify. Show the verified or
unverified pill on every card and profile.
```

---

## Step 4 — chipping in

```
Wire up the Chip In button. It opens a bottom sheet:
- Amount picker: $1 / $3 / $5 / $10, plus a custom amount
- A tip slider labelled "Tip to keep Chip In running", defaulting to 5%,
  draggable to 0
- A plain Courier Prime breakdown with dashed rules above and below:
    {Name} gets     $5.00
    Tip to Chip In  $0.25
    You pay         $5.25
- Under the slider, one dry line: "Optional. Slide it to zero if you'd rather
  not — it changes nothing for {Name}."
- An optional display name field and an "Give anonymously" checkbox

On confirm, open the recipient's payment deep link in a new tab with the amount
prefilled:
  PayPal    https://paypal.me/{handle}/{amount}
  Cash App  https://cash.app/${handle}/{amount}
  Venmo     https://venmo.com/{handle}?txn=pay&amount={amount}&note=Chip%20In
  Interac   no link exists — copy the email to the clipboard and say so plainly

Record the donation with confirmed_by_recipient = false.

The recipient sees pending donations on their dashboard and confirms each one.
Only confirmed donations count toward the goal, the leaderboard, or feed
ranking. An ask flips to funded when confirmed donations reach the goal —
computed server-side, never in the browser.
```

---

## Step 5 — the receipt, which is the whole point

```
When an ask hits its goal, unlock a receipt upload for its owner: a photo of
what they actually bought, stored in Supabase Storage, displayed publicly on
the ask card forever.

Rules:
- A receipt cannot be uploaded before the ask is funded. Enforce server-side.
- A receipt cannot be deleted or swapped once posted.
- An ask funded more than 7 days ago with no receipt gets a permanent public
  "NO RECEIPT POSTED" mark on the card and on the owner's profile.
- Every profile shows a receipt record: "7 of 8 receipts posted". This number
  is the reputation of the entire app. Put it somewhere people will see it.
```

---

## Step 6 — the algorithm (build this exactly as written)

```
Build the feed ranking. Giving is what buys reach — that is the engine of this
app, so it gets computed server-side in a Postgres function, refreshed on a
schedule, and cached. Never in the browser.

For every profile, compute a GIVER SCORE:

  giver_score = log10(1 + confirmed_cents_given_in_last_30_days / 100)

Rolling 30 days, so the leaderboard rewards people who keep giving instead of
one person who gave once in March. Log scale, so a whale doesn't permanently
own the entire feed — a $500 giver outranks a $50 giver, but by roughly one
step, not by ten.

For every ask, compute a FEED SCORE:

  recency  = 1 / pow(hours_since_posted + 2, 1.5)
  base     = recency * (1 + giver_score of the ask's owner)

  then multiply by these:
    receipt_history  1.15 if the owner has posted every receipt they owe
                     1.00 if they owe nothing yet (new users aren't punished)
                     0.35 if they owe an overdue receipt — this is severe on
                          purpose, and it is the strongest signal in the system
    near_goal        1.10 if the ask is between 85% and 99% funded
                          (a nudge over the line is the most satisfying dollar
                          a giver can spend)
    fully_funded     0.20 — funded asks sink fast, but stay visible briefly so
                          people see the FUNDED stamp land
    unverified       0.00 — unverified handles never appear in the feed at all

The TOP tab sorts by feed score. The NEW tab is plain reverse chronological.

ANTI-GAMING — build these now, not later. Without them the algorithm is
worthless within a week:
- A donation only counts once confirmed_by_recipient is true. Nothing else
  counts, anywhere, ever.
- Self-donations never count. A profile cannot boost itself.
- RECIPROCAL CAP: between any two people, only the first $20 in each direction
  per rolling 30 days counts toward giver score. Two friends passing $50 back
  and forth get almost nothing for it.
- CONCENTRATION CAP: if more than 60% of a person's giving in the last 30 days
  went to a single recipient, only count it up to that 60% line. Spread giving
  is real; a two-person loop is not.
- NEW ACCOUNT DAMPER: profiles less than 48 hours old get a 0.5 multiplier on
  giver score. Makes throwaway-account farming slow and boring.
- Log every score computation with its inputs to an admin-readable table, so
  when someone games it anyway we can see how.

On each profile and on the leaderboard, show the giver score translated into
plain English — a small Courier Prime line like "GIVING RANK: 412th · YOUR ASKS
GET SEEN 2.3× MORE". People need to feel the loop working or they won't play it.
```

---

## Step 7 — polish and ship

```
- Open Graph images per ask, generated server-side, styled as the receipt card,
  so a pasted link previews properly on TikTok, X and iMessage
- An empty state for the feed that isn't sad
- Skeleton loaders shaped like receipt cards
- Full keyboard accessibility: the compose box, the Chip In sheet, and the tip
  slider all reachable and operable without a mouse. Visible focus rings in
  mustard
- A landing page at "/" for signed-out visitors: what Chip In is in one line,
  the feed preview behind it, one signup call to action, no marketing fluff
- Real page titles and meta descriptions
- Rate limit posting: one active ask per person at a time
```

---

## Before real money moves

One hour with a fintech lawyer, in writing, on one question: **does this flow
make us a money services business under FINTRAC?** The answer hinges on the
fact that we never touch the money — make sure the lawyer sees exactly how the
deep links work.

Ask the same lawyer about step 6 specifically. "Donate and your posts get
promoted" means a donation now buys something of value, and that is a different
legal animal from a gift. Worth ten minutes of their time before it's ten
thousand of yours.

---

## If Lovable goes off the rails

- "Stop. Undo that and do only the thing I asked."
- "Re-read the project Knowledge and tell me which rule that broke."
- "You changed screens I didn't ask about. Show me what changed."
- Use plan mode (discuss before it writes code) for steps 4 and 6 — those two
  are where a wrong guess costs the most.
