export function DataNotice() {
  return (
    <section className="data-notice" id="data-handling" aria-label="Data handling">
      <h2>How your documents are handled</h2>
      <ul>
        <li>
          <strong>Processed in-session.</strong> Your document is sent once to our extraction
          endpoint, processed, and returned. Results live only in your browser tab — refresh or
          close it and they're gone.
        </li>
        <li>
          <strong>Never stored.</strong> LedgerLine has no database, no user accounts, and no file
          storage. The server does not write or log document contents.
        </li>
        <li>
          <strong>Never used for training.</strong> Extraction runs on the Anthropic API, which does
          not train models on API inputs or outputs by default. LedgerLine does not use your
          documents for training either.
        </li>
        <li>
          <strong>Sample documents are fictional.</strong> Every name, carrier, policy number, and
          dollar amount in the built-in samples is invented.
        </li>
      </ul>
      <p className="data-notice-fineprint">
        For a pilot we're happy to walk through the data flow line by line, sign an NDA, or run
        against redacted documents first.
      </p>
    </section>
  );
}
