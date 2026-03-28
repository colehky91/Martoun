const CLAUDE_MODEL = 'claude-sonnet-4-20250514';
const API_URL = 'https://api.anthropic.com/v1/messages';

export type IngredientRating = 'good' | 'neutral' | 'bad';

export type AnalyzedIngredient = {
  name: string;
  rating: IngredientRating;
  reason: string;
};

export type ScanAnalysisResult = {
  productName: string;
  healthScore: number;
  ingredients: AnalyzedIngredient[];
  warnings: string[];
  summary: string;
};

const SYSTEM_PROMPT =
  'You are a food ingredient analyst. Analyze the ingredient label in this image. Return a JSON object with: productName, healthScore (0-100), ingredients (array of objects with name, rating: good/neutral/bad, reason), warnings (array of strings), summary (2 sentence plain English verdict)';

function extractJsonObject(input: string): string {
  const trimmed = input.trim();
  if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
    return trimmed;
  }

  const match = trimmed.match(/\{[\s\S]*\}/);
  if (!match) {
    throw new Error('Claude response did not include JSON output.');
  }
  return match[0];
}

function normalizeResult(raw: Record<string, unknown>): ScanAnalysisResult {
  const rawIngredients = Array.isArray(raw.ingredients) ? raw.ingredients : [];
  const safeIngredients: AnalyzedIngredient[] = rawIngredients.map((item) => {
    const typed = item as Record<string, unknown>;
    const rating = typed.rating;
    const normalizedRating: IngredientRating =
      rating === 'good' || rating === 'bad' || rating === 'neutral' ? rating : 'neutral';
    return {
      name: String(typed.name ?? 'Unknown ingredient'),
      rating: normalizedRating,
      reason: String(typed.reason ?? 'No reason provided.'),
    };
  });

  const rawWarnings = Array.isArray(raw.warnings) ? raw.warnings : [];
  const safeWarnings = rawWarnings.map((warning) => String(warning));

  const parsedHealthScore = Number(raw.healthScore);

  return {
    productName: String(raw.productName ?? 'Unknown product'),
    healthScore: Number.isFinite(parsedHealthScore) ? Math.min(100, Math.max(0, parsedHealthScore)) : 0,
    ingredients: safeIngredients,
    warnings: safeWarnings,
    summary: String(raw.summary ?? 'No summary available.'),
  };
}

type ClaudeMessageResponse = {
  content?: Array<{ type?: string; text?: string }>;
};

export async function analyzeIngredientsImage(base64Image: string): Promise<ScanAnalysisResult> {
  const apiKey = process.env.EXPO_PUBLIC_CLAUDE_API_KEY;
  if (!apiKey) {
    throw new Error('Missing EXPO_PUBLIC_CLAUDE_API_KEY in environment variables.');
  }

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: CLAUDE_MODEL,
      max_tokens: 1200,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Analyze this ingredient label image and return only valid JSON.',
            },
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: 'image/jpeg',
                data: base64Image,
              },
            },
          ],
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Claude API request failed (${response.status}): ${errorBody}`);
  }

  const data = (await response.json()) as ClaudeMessageResponse;
  const textBlocks = Array.isArray(data.content) ? data.content : [];
  const joinedText = textBlocks
    .map((block) => (block.type === 'text' ? String(block.text ?? '') : ''))
    .join('\n')
    .trim();

  if (!joinedText) {
    throw new Error('Claude response was empty.');
  }

  const jsonString = extractJsonObject(joinedText);
  const parsed = JSON.parse(jsonString) as Record<string, unknown>;
  return normalizeResult(parsed);
}
