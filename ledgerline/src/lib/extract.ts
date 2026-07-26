import type { ExtractionResult } from '../types';

export const MAX_FILE_BYTES = 3 * 1024 * 1024; // Vercel's 4.5 MB body limit minus base64 overhead
const REQUEST_TIMEOUT_MS = 290_000;
const MAX_IMAGE_EDGE_PX = 2576; // matches the model's maximum useful image resolution

const ACCEPTED_TYPES: Record<string, string> = {
  'application/pdf': 'PDF',
  'image/jpeg': 'JPEG',
  'image/png': 'PNG',
  'image/webp': 'WebP',
};

export type ExtractOutcome =
  | { ok: true; result: ExtractionResult }
  | { ok: false; message: string };

export async function extractDocument(file: File): Promise<ExtractOutcome> {
  let mediaType = file.type;

  if (!mediaType && /\.pdf$/i.test(file.name)) mediaType = 'application/pdf';

  if (!(mediaType in ACCEPTED_TYPES)) {
    return {
      ok: false,
      message:
        'That file type isn’t supported. Upload a PDF or a photo (JPEG, PNG, WebP). ' +
        'Word docs and spreadsheets: export to PDF first.',
    };
  }

  let blob: Blob = file;

  // Phone photos of documents are routinely 5–12 MB; downscale images in the
  // browser so they fit the demo's upload limit without a round-trip failure.
  if (mediaType.startsWith('image/') && (file.size > MAX_FILE_BYTES || mediaType === 'image/png')) {
    try {
      const downscaled = await downscaleImage(file);
      if (downscaled) {
        blob = downscaled;
        mediaType = 'image/jpeg';
      }
    } catch {
      // Fall through to the size check with the original file.
    }
  }

  if (blob.size > MAX_FILE_BYTES) {
    return {
      ok: false,
      message:
        'That file is over the 3 MB limit for this demo. Try a single page, a smaller export, ' +
        'or a photo of the first page.',
    };
  }

  let base64: string;
  try {
    base64 = await blobToBase64(blob);
  } catch {
    return { ok: false, message: 'Could not read that file. It may be corrupted — try re-saving or re-scanning it.' };
  }

  try {
    const response = await fetch('/api/extract', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mediaType, data: base64, fileName: file.name }),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });

    const payload = (await response.json().catch(() => null)) as
      | { result?: ExtractionResult; error?: string }
      | null;

    if (!response.ok || !payload?.result) {
      return {
        ok: false,
        message:
          payload?.error ??
          'The extraction service hit a temporary problem. Please try again in a moment.',
      };
    }
    return { ok: true, result: normalize(payload.result) };
  } catch (error) {
    if (error instanceof DOMException && (error.name === 'TimeoutError' || error.name === 'AbortError')) {
      return {
        ok: false,
        message:
          'This document is taking longer than expected. Try again, or try a shorter document — ' +
          'complex multi-page scans can exceed the demo’s time limit.',
      };
    }
    return {
      ok: false,
      message: 'Could not reach the extraction service. Check your connection and try again.',
    };
  }
}

/** Clamp any odd server values so the UI can never render an inconsistent state. */
function normalize(result: ExtractionResult): ExtractionResult {
  const confidences = new Set(['high', 'medium', 'low']);
  return {
    documentType: String(result.documentType ?? 'Unknown document type'),
    documentTypeConfidence: confidences.has(result.documentTypeConfidence) ? result.documentTypeConfidence : 'low',
    summary: String(result.summary ?? ''),
    warnings: Array.isArray(result.warnings) ? result.warnings.map(String) : [],
    fields: (Array.isArray(result.fields) ? result.fields : []).map((f) => ({
      label: String(f?.label ?? 'Unknown field'),
      value: f?.value == null ? null : String(f.value),
      confidence: confidences.has(f?.confidence) ? f.confidence : 'low',
      note: f?.note == null ? null : String(f.note),
    })),
  };
}

async function downscaleImage(file: File): Promise<Blob | null> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_IMAGE_EDGE_PX / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  return await new Promise<Blob | null>((resolve) => {
    canvas.toBlob((b) => resolve(b), 'image/jpeg', 0.85);
  });
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error);
    reader.onload = () => {
      const dataUrl = reader.result as string;
      resolve(dataUrl.slice(dataUrl.indexOf(',') + 1));
    };
    reader.readAsDataURL(blob);
  });
}
