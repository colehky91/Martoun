import Anthropic from '@anthropic-ai/sdk';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const MODEL = 'claude-opus-5';

// Vercel's request-body limit is 4.5 MB; base64 inflates files by 4/3, so the
// client caps uploads at 3 MB. This is a backstop against direct API calls.
const MAX_BASE64_CHARS = 4_400_000;

const ACCEPTED_MEDIA_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/webp',
] as const;

type AcceptedMediaType = (typeof ACCEPTED_MEDIA_TYPES)[number];

const RESULT_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['documentType', 'documentTypeConfidence', 'summary', 'fields', 'warnings'],
  properties: {
    documentType: {
      type: 'string',
      description:
        'The kind of insurance document, e.g. "Commercial Package Declarations Page", "ACORD 25 Certificate of Liability Insurance", "Loss Run Report". Use "Unknown document type" if unclear.',
    },
    documentTypeConfidence: { type: 'string', enum: ['high', 'medium', 'low'] },
    summary: {
      type: 'string',
      description: 'Two or three plain-English sentences describing the document and anything notable.',
    },
    fields: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['label', 'value', 'confidence', 'note'],
        properties: {
          label: { type: 'string' },
          value: {
            type: ['string', 'null'],
            description: 'The extracted value verbatim, or null if not found / unreadable.',
          },
          confidence: { type: 'string', enum: ['high', 'medium', 'low'] },
          note: {
            type: ['string', 'null'],
            description: 'Short reason when confidence is not high (e.g. "partially illegible", "inferred from context").',
          },
        },
      },
    },
    warnings: {
      type: 'array',
      items: { type: 'string' },
      description: 'Document-level issues: blurry scan, rotated pages, handwriting, truncated pages, not an insurance document, etc.',
    },
  },
} as const;

const SYSTEM_PROMPT = `You are the extraction engine for LedgerLine, a document-intake tool for independent insurance brokerages. You extract structured data from insurance documents: declarations pages, ACORD forms (25, 125, 126, 130, etc.), certificates of insurance, loss runs, policy schedules, endorsements, and quotes.

Rules:
- Extract every materially useful field for a broker: named insured, carrier/insurer, policy numbers, effective/expiration dates, lines of coverage, limits, deductibles/retentions, premiums, locations, producer info, certificate holders, additional-insured and waiver-of-subrogation status, claim rows on loss runs (date, claim number, status, paid, reserved, incurred), and totals.
- Partial extraction always beats failure. If a page is blurry, rotated, handwritten, or cut off, extract what you can read and report the rest as fields with value null and a note.
- Never guess a value you cannot actually read. A wrong policy number or limit is worse than a flagged blank — brokers carry E&O exposure. If a value is partially legible or inferred, set confidence to "medium" or "low" and explain in the note.
- Confidence levels: "high" = clearly legible and unambiguous; "medium" = legible but ambiguous formatting, partially obscured, or inferred from context; "low" = barely legible, handwritten, conflicting, or a guess a human must verify.
- Add document-level problems (image quality, rotation, missing pages, handwriting) to warnings.
- If the document is not an insurance document, still describe what it is in documentType and summary, extract any generally useful fields, and add a warning saying it does not appear to be an insurance document.
- For loss runs, emit one field per claim using labels like "Claim 1 — Date of Loss", "Claim 1 — Amount Paid", plus total fields.
- Keep values verbatim from the document (including formatting like "$1,000,000") rather than normalizing.`;

interface ExtractRequestBody {
  mediaType?: string;
  data?: string;
  fileName?: string;
}

function fail(res: VercelResponse, status: number, message: string) {
  res.status(status).json({ error: message });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return fail(res, 405, 'Method not allowed.');
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return fail(
      res,
      503,
      'This demo is not fully configured yet (missing server API key). Try one of the built-in sample documents instead.',
    );
  }

  const body = (req.body ?? {}) as ExtractRequestBody;
  const { mediaType, data } = body;

  if (!mediaType || !data || typeof data !== 'string') {
    return fail(res, 400, 'No document received. Please try the upload again.');
  }
  if (!ACCEPTED_MEDIA_TYPES.includes(mediaType as AcceptedMediaType)) {
    return fail(res, 400, 'Unsupported file type. Please upload a PDF, JPEG, PNG, or WebP file.');
  }
  if (data.length > MAX_BASE64_CHARS) {
    return fail(res, 413, 'That file is too large for this demo (3 MB max). Try a smaller file or a single page.');
  }

  const documentBlock =
    mediaType === 'application/pdf'
      ? { type: 'document' as const, source: { type: 'base64' as const, media_type: 'application/pdf' as const, data } }
      : {
          type: 'image' as const,
          source: {
            type: 'base64' as const,
            media_type: mediaType as 'image/jpeg' | 'image/png' | 'image/webp',
            data,
          },
        };

  const client = new Anthropic({ apiKey, timeout: 280_000, maxRetries: 1 });

  try {
    const response = await client.beta.messages.create({
      model: MODEL,
      max_tokens: 16000,
      betas: ['server-side-fallback-2026-07-01'],
      fallbacks: 'default',
      output_config: {
        effort: 'medium',
        format: { type: 'json_schema', schema: RESULT_SCHEMA },
      },
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: [
            documentBlock,
            {
              type: 'text',
              text: 'Extract the structured data from this insurance document. Follow the extraction rules exactly.',
            },
          ],
        },
      ],
    });

    if (response.stop_reason === 'refusal') {
      return fail(
        res,
        422,
        'The AI declined to process this document. This occasionally happens with unusual content — try a different document or one of the samples.',
      );
    }
    if (response.stop_reason === 'max_tokens') {
      return fail(
        res,
        422,
        'This document is too long for a single demo extraction. Try a shorter document or a single page.',
      );
    }

    const text = response.content
      .filter((block): block is Anthropic.Beta.BetaTextBlock => block.type === 'text')
      .map((block) => block.text)
      .join('\n')
      .trim();

    const parsed = parseResult(text);
    if (!parsed) {
      return fail(res, 502, 'The extraction finished but returned an unreadable result. Please try again.');
    }
    return res.status(200).json({ result: parsed });
  } catch (error) {
    if (error instanceof Anthropic.BadRequestError) {
      return fail(
        res,
        422,
        'The AI service could not read this file — it may be corrupted, password-protected, or have too many pages. Try re-exporting it or uploading a single page.',
      );
    }
    if (error instanceof Anthropic.AuthenticationError) {
      return fail(res, 503, 'This demo is temporarily misconfigured (invalid server API key). Try a sample document instead.');
    }
    if (error instanceof Anthropic.RateLimitError) {
      return fail(res, 429, 'The demo is getting a lot of traffic right now. Please wait a few seconds and try again.');
    }
    if (error instanceof Anthropic.APIConnectionError) {
      return fail(res, 502, 'Could not reach the AI service. Please check your connection and try again.');
    }
    if (error instanceof Anthropic.APIError) {
      return fail(res, 502, 'The AI service had a temporary problem. Please try again in a moment.');
    }
    return fail(res, 500, 'Something unexpected went wrong. Please try again, or use a sample document.');
  }
}

/** Structured outputs guarantee schema-shaped JSON, but parse defensively anyway. */
function parseResult(text: string): Record<string, unknown> | null {
  const candidate = text.startsWith('{') ? text : (text.match(/\{[\s\S]*\}/)?.[0] ?? '');
  if (!candidate) return null;
  try {
    const parsed = JSON.parse(candidate) as Record<string, unknown>;
    if (typeof parsed.documentType !== 'string' || !Array.isArray(parsed.fields)) return null;
    return parsed;
  } catch {
    return null;
  }
}
