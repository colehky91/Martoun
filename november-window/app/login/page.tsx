"use client";

import { useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";

export default function Login() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errMsg, setErrMsg] = useState<string | null>(null);

  async function sendLink(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    const supabase = supabaseBrowser();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: false, // membership comes from purchase or admin invite
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/course`,
      },
    });
    // "Signups not allowed" = the address has no account → genuine not-a-member.
    // Anything else (rate limit, bad key, SMTP trouble) — show the real reason.
    setErrMsg(error && !/signup/i.test(error.message) ? error.message : null);
    setStatus(error ? "error" : "sent");
  }

  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 420, background: "var(--ink-2)", border: "1px solid var(--line)", borderRadius: 3, padding: "38px 34px" }}>
        <div className="eyebrow">Member access</div>
        <h1 style={{ fontSize: "2.2rem", marginBottom: 10 }}>Log in</h1>
        <p style={{ color: "var(--sand-dim)", fontSize: 14.5, marginBottom: 24 }}>
          Enter the email you purchased with. A one-click sign-in link lands in your inbox — no password.
        </p>

        {status === "sent" ? (
          <div style={{ background: "var(--surface)", borderLeft: "3px solid var(--pool)", padding: "16px 20px", fontSize: 14.5 }}>
            Link sent. Check your inbox (and spam, once) — it signs you straight in.
          </div>
        ) : (
          <form onSubmit={sendLink} style={{ display: "grid", gap: 12 }}>
            <input
              className="field" type="email" required placeholder="you@example.com"
              value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email"
            />
            <button className="btn" disabled={status === "sending"}>
              {status === "sending" ? "Sending…" : "Email me a login link"}
            </button>
            {status === "error" && (
              <p style={{ color: "var(--alarm)", fontSize: 13.5 }}>
                {errMsg ? (
                  <>Couldn&rsquo;t send the link — {errMsg}</>
                ) : (
                  <>
                    That email isn&rsquo;t on the member list. Use the address from your purchase, or{" "}
                    <a href="/#pricing">get access here</a>.
                  </>
                )}
              </p>
            )}
          </form>
        )}

        <p className="mono" style={{ marginTop: 26, fontSize: 10.5, color: "var(--sand-dim)" }}>
          NOT A MEMBER YET? <a href="/#pricing">GET ACCESS →</a>
        </p>
      </div>
    </main>
  );
}
