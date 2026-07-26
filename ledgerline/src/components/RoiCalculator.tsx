import { useState } from 'react';

const MINUTES_WITH_LEDGERLINE = 2; // review + confirm flagged fields

export function RoiCalculator() {
  const [docsPerWeek, setDocsPerWeek] = useState(40);
  const [minutesPerDoc, setMinutesPerDoc] = useState(12);
  const [hourlyCost, setHourlyCost] = useState(32);

  const minutesSavedPerDoc = Math.max(0, minutesPerDoc - MINUTES_WITH_LEDGERLINE);
  const hoursPerYear = (docsPerWeek * minutesSavedPerDoc * 50) / 60;
  const dollarsPerYear = hoursPerYear * hourlyCost;

  const fmt = (n: number) => n.toLocaleString('en-US', { maximumFractionDigits: 0 });

  return (
    <section className="roi" id="roi" aria-label="ROI calculator">
      <h2>What does manual re-keying cost you?</h2>
      <p className="roi-intro">
        An estimate from your own numbers — assuming a reviewed LedgerLine extraction takes about{' '}
        {MINUTES_WITH_LEDGERLINE} minutes instead of typing everything by hand.
      </p>
      <div className="roi-grid">
        <label className="roi-input">
          <span>Documents processed per week</span>
          <input
            type="number"
            min={0}
            max={2000}
            value={docsPerWeek}
            onChange={(e) => setDocsPerWeek(Math.max(0, Number(e.target.value) || 0))}
          />
        </label>
        <label className="roi-input">
          <span>Minutes to key one document today</span>
          <input
            type="number"
            min={0}
            max={240}
            value={minutesPerDoc}
            onChange={(e) => setMinutesPerDoc(Math.max(0, Number(e.target.value) || 0))}
          />
        </label>
        <label className="roi-input">
          <span>Fully-loaded hourly cost ($)</span>
          <input
            type="number"
            min={0}
            max={500}
            value={hourlyCost}
            onChange={(e) => setHourlyCost(Math.max(0, Number(e.target.value) || 0))}
          />
        </label>
      </div>
      <div className="roi-results">
        <div className="roi-stat">
          <div className="roi-number">{fmt(hoursPerYear)} hrs</div>
          <div className="roi-label">staff time freed per year</div>
        </div>
        <div className="roi-stat">
          <div className="roi-number">${fmt(dollarsPerYear)}</div>
          <div className="roi-label">estimated annual value</div>
        </div>
      </div>
      <p className="roi-fineprint">
        Assumes a 50-week year. This is an estimate based on your inputs, not a guarantee.
      </p>
    </section>
  );
}
