import type { Confidence, ExtractionResult } from '../types';
import { downloadFile, exportBaseName, toCsv, toJson } from '../lib/exporters';

const CONFIDENCE_LABEL: Record<Confidence, string> = {
  high: 'High',
  medium: 'Medium',
  low: 'Low',
};

function ConfidenceBadge({ level }: { level: Confidence }) {
  return (
    <span className={`conf conf-${level}`}>
      <span className="conf-dot" aria-hidden="true" />
      {CONFIDENCE_LABEL[level]}
    </span>
  );
}

interface Props {
  result: ExtractionResult;
  sourceLabel: string;
  isSample: boolean;
}

export function ResultsPanel({ result, sourceLabel, isSample }: Props) {
  const reviewCount = result.fields.filter((f) => f.confidence === 'low' || f.value === null).length;
  const base = exportBaseName(result.documentType);

  return (
    <section className="results" aria-label="Extraction results">
      <div className="results-head">
        <div>
          <div className="results-doctype">
            <h3>{result.documentType}</h3>
            <ConfidenceBadge level={result.documentTypeConfidence} />
          </div>
          <p className="results-source">
            {sourceLabel}
            {isSample && <span className="sample-tag"> · fictional sample data</span>}
          </p>
        </div>
        <div className="export-buttons">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => downloadFile(`${base}.csv`, toCsv(result), 'text/csv;charset=utf-8')}
          >
            Export CSV
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => downloadFile(`${base}.json`, toJson(result), 'application/json')}
          >
            Export JSON
          </button>
        </div>
      </div>

      <p className="results-summary">{result.summary}</p>

      {result.warnings.length > 0 && (
        <div className="warnings" role="note">
          <strong>Document warnings</strong>
          <ul>
            {result.warnings.map((w, i) => (
              <li key={i}>{w}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="review-banner" role="note">
        <strong>AI-assisted extraction — human review required.</strong>{' '}
        {reviewCount > 0
          ? `${reviewCount} field${reviewCount === 1 ? '' : 's'} below ${reviewCount === 1 ? 'is' : 'are'} flagged for review. `
          : 'No fields were flagged low-confidence in this document. '}
        LedgerLine surfaces uncertainty instead of hiding it — it does not replace a licensed
        professional's review, and flagged values should be verified before use.
      </div>

      <div className="table-wrap">
        <table className="fields-table">
          <thead>
            <tr>
              <th scope="col">Field</th>
              <th scope="col">Value</th>
              <th scope="col">Confidence</th>
            </tr>
          </thead>
          <tbody>
            {result.fields.map((field, i) => {
              const needsReview = field.confidence === 'low' || field.value === null;
              return (
                <tr key={i} className={needsReview ? 'row-review' : undefined}>
                  <td className="cell-label">{field.label}</td>
                  <td className="cell-value">
                    {field.value ?? <em className="not-found">Not found — needs review</em>}
                    {field.note && <div className="field-note">{field.note}</div>}
                  </td>
                  <td className="cell-conf">
                    <ConfidenceBadge level={field.confidence} />
                    {needsReview && <div className="review-flag">⚠ Review</div>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
