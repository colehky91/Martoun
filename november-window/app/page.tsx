"use client";

import { useEffect, useState } from "react";

/* Launch target mirrors the playbook's internal clock. */
const TARGET = new Date(2026, 10, 12).getTime(); // Nov 12, 2026

const SECTIONS = [
  ["00", "Read this first"], ["01", "The Window"], ["02", "The Legal Moat"],
  ["03", "Pick Your Lane"], ["04", "The Stack"], ["05", "Hooks & Retention"],
  ["06", "The Machine"], ["07", "The Money"], ["08", "Launch Week War Plan"],
  ["09", "The Pivot"], ["10", "40 Hooks"], ["11", "Prompt Library"],
  ["12", "The 30-Day Calendar"], ["13", "Strike-Proofing"],
];

function useCountdown() {
  const [t, setT] = useState<{ d: number; h: number; m: number; s: number } | null>(null);
  useEffect(() => {
    const tick = () => {
      let diff = TARGET - Date.now();
      if (diff < 0) diff = 0;
      setT({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return t;
}

const pad = (n: number) => String(n).padStart(2, "0");

export default function Landing() {
  const t = useCountdown();

  return (
    <main>
      {/* ── top bar ─────────────────────────────────── */}
      <header
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, height: 60,
          background: "rgba(7,25,22,.96)", backdropFilter: "blur(14px)",
          borderBottom: "1px solid var(--line)",
          display: "flex", alignItems: "center", padding: "0 24px", gap: 18,
        }}
      >
        <span className="display" style={{ fontWeight: 900, fontSize: "1.25rem" }}>
          THE NOVEMBER <span style={{ color: "var(--sun)" }}>WINDOW</span>
        </span>
        <nav style={{ marginLeft: "auto", display: "flex", gap: 22, alignItems: "center" }}>
          <a href="/login" style={{ color: "var(--sand-dim)", textDecoration: "none", fontSize: 14 }}>
            Log in
          </a>
          <a href="#pricing" className="btn" style={{ padding: "9px 20px", fontSize: 13 }}>
            Get access
          </a>
        </nav>
      </header>

      {/* ── hero: the clock IS the pitch ────────────── */}
      <section className="wrap" style={{ padding: "150px 28px 70px", textAlign: "center" }}>
        <div className="eyebrow">A live operating manual · not a video dump</div>
        <h1 style={{ fontSize: "clamp(3rem,8vw,5.6rem)", marginBottom: 22 }}>
          The biggest launch of the decade
          <br />
          <span style={{ color: "var(--sun)" }}>has a closing date.</span>
        </h1>
        <p style={{ maxWidth: 620, margin: "0 auto 34px", color: "var(--sand-dim)", fontSize: "1.12rem" }}>
          A 14-section playbook for building a faceless content channel around the
          November 12 window — picking a lane, running the AI production stack, and
          monetizing before the attention moves on.
        </p>

        <div
          className="mono"
          aria-live="off"
          style={{
            display: "inline-block", background: "var(--ink-2)", border: "1px solid var(--line)",
            borderRadius: 3, padding: "22px 34px", marginBottom: 34,
          }}
        >
          <div style={{ fontSize: 10, letterSpacing: "0.2em", color: "var(--sand-dim)", textTransform: "uppercase", marginBottom: 8 }}>
            Window closes in
          </div>
          <div style={{ fontSize: "clamp(1.9rem,5vw,3rem)", fontWeight: 700, color: "var(--sun)", fontVariantNumeric: "tabular-nums" }}>
            {t ? `${t.d}d ${pad(t.h)}:${pad(t.m)}:${pad(t.s)}` : "———"}
          </div>
        </div>

        <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
          <a href="/api/checkout" className="btn">Get the playbook — $97.99</a>
          <a href="#inside" className="btn ghost">See what&rsquo;s inside</a>
        </div>
      </section>

      {/* ── what's inside ───────────────────────────── */}
      <section id="inside" style={{ background: "var(--ink-2)", borderTop: "1px solid var(--line-soft)", borderBottom: "1px solid var(--line-soft)", padding: "70px 0" }}>
        <div className="wrap">
          <div className="eyebrow">Fourteen sections. One machine.</div>
          <h2 style={{ fontSize: "clamp(1.9rem,4vw,2.6rem)", marginBottom: 30 }}>
            What&rsquo;s inside
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 10 }}>
            {SECTIONS.map(([n, title]) => (
              <div
                key={n}
                style={{
                  display: "flex", gap: 12, alignItems: "baseline",
                  background: "var(--surface)", border: "1px solid var(--line-soft)",
                  padding: "13px 18px", borderRadius: 2,
                }}
              >
                <span className="mono" style={{ color: "var(--sun)", fontSize: 11 }}>{n}</span>
                <span style={{ fontSize: 15 }}>{title}</span>
              </div>
            ))}
          </div>
          <p style={{ marginTop: 26, color: "var(--sand-dim)", fontSize: 15 }}>
            Plus the interactive layer: a format-picker quiz that assigns your lane, 40
            copy-ready hooks with filters, a prompt library, launch-week checklists — and
            your progress saves to your account across every device.
          </p>
        </div>
      </section>

      {/* ── pricing ─────────────────────────────────── */}
      <section id="pricing" className="wrap" style={{ padding: "80px 28px 100px", textAlign: "center" }}>
        <div className="eyebrow">One payment. Yours for good.</div>
        <h2 style={{ fontSize: "clamp(1.9rem,4vw,2.6rem)", marginBottom: 30 }}>Lifetime access</h2>
        <div
          style={{
            maxWidth: 420, margin: "0 auto", background: "var(--surface)",
            border: "1px solid var(--sun)", borderRadius: 3, padding: "38px 34px",
          }}
        >
          <div className="display" style={{ fontSize: "3.4rem", fontWeight: 900 }}>
            $97.99<span style={{ fontSize: "1.2rem", color: "var(--sand-dim)" }}> once</span>
          </div>
          <ul style={{ listStyle: "none", margin: "24px 0 30px", textAlign: "left", color: "var(--sand-dim)", fontSize: 15 }}>
            {[
              "Full 14-section interactive playbook",
              "Video modules as they drop",
              "Progress synced to your account",
              "Updated live through the window and the pivot",
            ].map((li) => (
              <li key={li} style={{ padding: "7px 0", borderBottom: "1px solid var(--line-soft)" }}>
                <span style={{ color: "var(--pool)", marginRight: 10 }}>✓</span>{li}
              </li>
            ))}
          </ul>
          <a href="/api/checkout" className="btn" style={{ width: "100%" }}>Get access</a>
          <p className="mono" style={{ fontSize: 10.5, color: "var(--sand-dim)", marginTop: 16, letterSpacing: "0.08em" }}>
            SECURE CHECKOUT VIA STRIPE · ACCESS EMAILED IN MINUTES
          </p>
        </div>
      </section>

      <footer style={{ borderTop: "1px solid var(--line-soft)", padding: "26px 0", textAlign: "center" }}>
        <span className="mono" style={{ fontSize: 11, color: "var(--sand-dim)" }}>
          © {new Date().getFullYear()} The November Window · <a href="/login">Member login</a>
        </span>
      </footer>
    </main>
  );
}
