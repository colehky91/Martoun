export type Confidence = 'high' | 'medium' | 'low';

export interface ExtractedField {
  label: string;
  value: string | null;
  confidence: Confidence;
  note: string | null;
}

export interface ExtractionResult {
  documentType: string;
  documentTypeConfidence: Confidence;
  summary: string;
  fields: ExtractedField[];
  warnings: string[];
}

export interface SampleDocument {
  id: string;
  title: string;
  subtitle: string;
  /** Plain-text rendering of the fictional source document, shown in the preview pane. */
  docText: string;
  /** Precomputed extraction result so samples are instant and can never fail live. */
  result: ExtractionResult;
}
