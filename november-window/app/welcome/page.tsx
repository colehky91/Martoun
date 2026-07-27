export default function Welcome() {
  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24, textAlign: "center" }}>
      <div style={{ maxWidth: 520 }}>
        <div className="eyebrow">Payment confirmed</div>
        <h1 style={{ fontSize: "clamp(2.4rem,6vw,3.6rem)", marginBottom: 16 }}>
          You&rsquo;re <span style={{ color: "var(--sun)" }}>in.</span>
        </h1>
        <p style={{ color: "var(--sand-dim)", marginBottom: 12 }}>
          Your access email is on its way — it contains a one-click link that signs you
          into the playbook. It usually lands within a minute or two.
        </p>
        <p style={{ color: "var(--sand-dim)", fontSize: 14.5 }}>
          Nothing arriving? Check spam, then use <a href="/login">the login page</a> with
          the same email you paid with.
        </p>
      </div>
    </main>
  );
}
