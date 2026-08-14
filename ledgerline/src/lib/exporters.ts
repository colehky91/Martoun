import type { ExtractionResult } from '../types';

function csvEscape(value: string): string {
  return /[",\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
}

export function toCsv(result: ExtractionResult): string {
  const lines: string[] = [];
  lines.push('Field,Value,Confidence,Note');
  lines.push(['Document Type', result.documentType, result.documentTypeConfidence, ''].map(csvEscape).join(','));
  for (const field of result.fields) {
    lines.push(
      [field.label, field.value ?? '(not found — needs review)', field.confidence, field.note ?? '']
        .map(csvEscape)
        .join(','),
    );
  }
  for (const warning of result.warnings) {
    lines.push(['Warning', warning, '', ''].map(csvEscape).join(','));
  }
  lines.push('');
  lines.push(csvEscape('Extracted by LedgerLine (AI-assisted). Review low-confidence fields before use.'));
  return lines.join('\r\n');
}

export function toJson(result: ExtractionResult): string {
  return JSON.stringify(
    {
      ...result,
      _meta: {
        exportedAt: new Date().toISOString(),
        source: 'LedgerLine demo',
        disclaimer: 'AI-assisted extraction. Review low-confidence fields before use.',
      },
    },
    null,
    2,
  );
}

export function downloadFile(filename: string, content: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function exportBaseName(documentType: string): string {
  const slug = documentType
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40);
  return `ledgerline-${slug || 'extraction'}`;
}
