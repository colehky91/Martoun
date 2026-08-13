import type { ReactNode } from "react";

/** Shared shell for the legal pages — same palette as the rest of the funnel. */
export default function LegalPage({
  eyebrow,
  title,
  updated,
  children,
}: {
  eyebrow: string;
  title: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <main>
      <header
        style={{
          height: 60, display: "flex", alignItems: "center", padding: "0 24px",
          borderBottom: "1px solid var(--line-soft)", background: "var(--ink-2)",
        }}
      >
        <a href="/" style={{ textDecoration: "none" }}>
          <span className="display" style={{ fontWeight: 900, fontSize: "1.1rem", color: "var(--sand)" }}>
            THE NOVEMBER <span style={{ color: "var(--sun)" }}>WINDOW</span>
          </span>
        </a>
      </header>

      <article className="wrap" style={{ maxWidth: 760, padding: "70px 28px 90px" }}>
        <div className="eyebrow">{eyebrow}</div>
        <h1 style={{ fontSize: "clamp(2.2rem,6vw,3.4rem)", marginBottom: 8 }}>{title}</h1>
        <p className="mono" style={{ fontSize: 11, color: "var(--sand-dim)", marginBottom: 40 }}>
          LAST UPDATED: {updated}
        </p>
        <div className="legal-body">{children}</div>
        <p style={{ marginTop: 50 }}>
          <a href="/">← Back to the site</a>
        </p>
      </article>

      <footer style={{ borderTop: "1px solid var(--line-soft)", padding: "26px 0", textAlign: "center" }}>
        <span className="mono" style={{ fontSize: 11, color: "var(--sand-dim)" }}>
          <a href="/terms">Terms</a> · <a href="/privacy">Privacy</a> · <a href="/refunds">Refunds</a> ·{" "}
          <a href="mailto:access@thenovemberwindow.com">Contact</a>
        </span>
      </footer>
    </main>
  );
}

/** Consistent styling for section headers + paragraphs inside legal copy. */
export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section style={{ marginBottom: 34 }}>
      <h2 style={{ fontSize: "1.35rem", marginBottom: 12, color: "var(--sand)" }}>{title}</h2>
      <div style={{ color: "var(--sand-dim)", display: "grid", gap: 12 }}>{children}</div>
    </section>
  );
}
