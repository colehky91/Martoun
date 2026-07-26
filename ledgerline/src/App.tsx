import { useEffect, useRef, useState } from 'react';
import { samples } from './samples';
import type { ExtractionResult, SampleDocument } from './types';
import { extractDocument } from './lib/extract';
import { ResultsPanel } from './components/ResultsPanel';
import { UploadZone } from './components/UploadZone';
import { RoiCalculator } from './components/RoiCalculator';
import { DataNotice } from './components/DataNotice';

type Status =
  | { kind: 'idle' }
  | { kind: 'processing'; label: string; step: string }
  | {
      kind: 'done';
      result: ExtractionResult;
      sourceLabel: string;
      isSample: boolean;
      docText: string | null;
    }
  | { kind: 'error'; message: string };

const SAMPLE_STEPS = ['Reading document…', 'Identifying document type…', 'Extracting fields…'];
const UPLOAD_STEPS = [
  'Uploading securely…',
  'Reading document…',
  'Identifying document type…',
  'Extracting fields…',
  'Scoring confidence…',
  'Still working — complex scans take a little longer…',
];

export default function App() {
  const [status, setStatus] = useState<Status>({ kind: 'idle' });
  const [showSource, setShowSource] = useState(false);
  const timersRef = useRef<number[]>([]);
  const resultsRef = useRef<HTMLDivElement>(null);

  const clearTimers = () => {
    timersRef.current.forEach((t) => window.clearTimeout(t));
    timersRef.current = [];
  };
  useEffect(() => clearTimers, []);

  const startSteps = (label: string, steps: string[], intervalMs: number) => {
    setStatus({ kind: 'processing', label, step: steps[0] });
    steps.slice(1).forEach((step, i) => {
      timersRef.current.push(
        window.setTimeout(
          () => setStatus((s) => (s.kind === 'processing' ? { ...s, step } : s)),
          intervalMs * (i + 1),
        ),
      );
    });
  };

  const runSample = (sample: SampleDocument) => {
    clearTimers();
    setShowSource(false);
    startSteps(sample.title, SAMPLE_STEPS, 550);
    timersRef.current.push(
      window.setTimeout(() => {
        setStatus({
          kind: 'done',
          result: sample.result,
          sourceLabel: `Sample: ${sample.title}`,
          isSample: true,
          docText: sample.docText,
        });
      }, 1700),
    );
  };

  const runUpload = async (file: File) => {
    clearTimers();
    setShowSource(false);
    startSteps(file.name, UPLOAD_STEPS, 6000);
    const outcome = await extractDocument(file);
    clearTimers();
    if (outcome.ok) {
      setStatus({
        kind: 'done',
        result: outcome.result,
        sourceLabel: file.name,
        isSample: false,
        docText: null,
      });
    } else {
      setStatus({ kind: 'error', message: outcome.message });
    }
  };

  useEffect(() => {
    if (status.kind === 'done') {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [status.kind]);

  const busy = status.kind === 'processing';

  return (
    <div className="page">
      <header className="site-header">
        <div className="wrap header-inner">
          <span className="logo">
            Ledger<span className="logo-accent">Line</span>
          </span>
          <a className="header-link" href="#data-handling">
            Data handling
          </a>
        </div>
      </header>

      <main className="wrap">
        <section className="hero">
          <h1>
            Insurance documents in.
            <br />
            Structured data out.
          </h1>
          <p className="hero-sub">
            LedgerLine reads dec pages, ACORD forms, COIs, and loss runs, extracts every field with a
            confidence score, and flags anything a human should double-check — in about a minute,
            not twenty.
          </p>
        </section>

        <section className="try" aria-label="Try LedgerLine">
          <div className="try-samples">
            <h2>Try a sample — no upload needed</h2>
            <div className="sample-buttons">
              {samples.map((sample) => (
                <button
                  key={sample.id}
                  type="button"
                  className="sample-card"
                  disabled={busy}
                  onClick={() => runSample(sample)}
                >
                  <span className="sample-card-title">{sample.title}</span>
                  <span className="sample-card-sub">{sample.subtitle}</span>
                </button>
              ))}
            </div>
            <p className="sample-fineprint">
              Samples are fictional documents with precomputed results, so the demo is instant and
              works even offline.
            </p>
          </div>
          <UploadZone disabled={busy} onFile={runUpload} />
        </section>

        <div ref={resultsRef}>
          {status.kind === 'processing' && (
            <section className="processing" role="status" aria-live="polite">
              <div className="spinner" aria-hidden="true" />
              <div>
                <p className="processing-label">{status.label}</p>
                <p className="processing-step">{status.step}</p>
              </div>
            </section>
          )}

          {status.kind === 'error' && (
            <section className="error-box" role="alert">
              <h3>That didn't work — but nothing broke.</h3>
              <p>{status.message}</p>
              <div className="error-actions">
                <button type="button" className="btn btn-primary" onClick={() => runSample(samples[0])}>
                  Try a sample instead
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setStatus({ kind: 'idle' })}
                >
                  Dismiss
                </button>
              </div>
            </section>
          )}

          {status.kind === 'done' && (
            <>
              <ResultsPanel
                result={status.result}
                sourceLabel={status.sourceLabel}
                isSample={status.isSample}
              />
              {status.docText && (
                <div className="source-toggle">
                  <button type="button" className="btn btn-ghost" onClick={() => setShowSource((v) => !v)}>
                    {showSource ? 'Hide source document' : 'View source document'}
                  </button>
                  {showSource && <pre className="source-doc">{status.docText}</pre>}
                </div>
              )}
              <div className="clear-row">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => {
                    setStatus({ kind: 'idle' });
                    setShowSource(false);
                  }}
                >
                  Clear results
                </button>
              </div>
            </>
          )}
        </div>

        <RoiCalculator />
        <DataNotice />
      </main>

      <footer className="site-footer">
        <div className="wrap">
          <p>
            LedgerLine · AI-assisted document intake for independent brokerages. Documents are
            processed in-session, never stored, never used for training.
          </p>
          <p className="footer-fineprint">
            Extracted data is AI-generated and requires human review before use in any policy,
            certificate, or client communication.
          </p>
        </div>
      </footer>
    </div>
  );
}
