# LedgerLine

AI-powered document intake for independent insurance brokerages. Drop in a dec page, ACORD form,
COI, or loss run and get structured, per-field-confidence-scored data back — with anything
uncertain visibly flagged for human review. Built as a live sales demo: a cold prospect can open
the URL on any device, click a sample, and see the value in under a minute.

## What's in the demo

- **Three built-in samples** (commercial dec page, ACORD 25, auto loss run) with precomputed
  extraction results — instant, zero API cost, works even if the extraction backend is down.
  All sample data is fictional.
- **Real uploads** (PDF, JPEG, PNG, WebP up to 3 MB) processed by a serverless function calling
  the Anthropic API. Photos taken on a phone are downscaled in the browser automatically.
- **Per-field confidence** (high / medium / low) with low-confidence and missing fields flagged
  "needs review" — the demo never implies unreviewed output is safe to use.
- **CSV and JSON export** of every extraction, confidence scores included.
- **Graceful failure everywhere**: wrong file types, oversized files, unreadable scans, timeouts,
  rate limits, and refusals all produce a plain-English message and a "try a sample" escape hatch.
  No stack traces, no silent hangs.
- **ROI calculator** driven entirely by the prospect's own inputs.
- **Data handling that is true in the code**: no database, no accounts, no file storage, no
  logging of document contents; results exist only in the browser tab.

## Architecture

```
ledgerline/
├── api/extract.ts        Vercel serverless function — holds the Anthropic API key,
│                         calls claude-opus-5 with structured outputs (schema-enforced JSON)
├── src/
│   ├── App.tsx           Single-page UI
│   ├── samples/          The 3 fictional sample documents + precomputed results
│   ├── lib/extract.ts    Upload validation, image downscaling, timeout, error mapping
│   ├── lib/exporters.ts  CSV / JSON export
│   └── components/       Results table, upload zone, ROI calc, data notice
└── vercel.json           Function timeout config
```

The Anthropic API key lives **only** in the serverless function's environment. It is never bundled
into the browser. Sample documents don't touch the API at all.

## Local development

```sh
cd ledgerline
npm install

# UI only — samples fully work, uploads will show a friendly "not configured" message
npm run dev

# Full stack (uploads too) — requires the Vercel CLI and an API key
cp .env.example .env    # then fill in ANTHROPIC_API_KEY
npx vercel dev
```

## Deploy (Vercel)

1. Push this repo to GitHub.
2. In [Vercel](https://vercel.com), **Add New Project** → import the repo.
3. Set **Root Directory** to `ledgerline/`. Framework preset: Vite (auto-detected).
4. Add an environment variable: `ANTHROPIC_API_KEY` = your key from
   [platform.claude.com](https://platform.claude.com).
5. Deploy. The output URL is the link you send prospects.

Notes:

- `vercel.json` sets the extraction function's `maxDuration` to 300s (complex scans can take a
  couple of minutes). This requires Fluid Compute, which is the default on new Vercel projects;
  if your plan rejects it, lower the value to your plan's limit.
- Uploads are capped at 3 MB because Vercel's request-body limit is 4.5 MB and base64 adds ~33%.
  Larger-file support (direct-to-storage upload) is listed in `FUTURE.md`.

## Environment variables

| Variable            | Where              | Purpose                                    |
| ------------------- | ------------------ | ------------------------------------------ |
| `ANTHROPIC_API_KEY` | Server-side only   | Auth for the extraction call in `api/extract.ts` |

No other configuration is required. There is deliberately no database, auth, or analytics.

## Verify before a demo call

1. Open the deployed URL on your phone and a laptop.
2. Click each of the three samples — results should appear in under 2 seconds.
3. Upload one real (or redacted) PDF to confirm the API path works end to end.
4. Try a nonsense file (a `.docx` or a 10 MB file) — you should see a friendly message, not an error.
