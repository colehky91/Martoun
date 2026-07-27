"use client";

import { useState } from "react";

export function InviteForm() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  async function invite(e: React.FormEvent) {
    e.preventDefault();
    setMsg("Sending…");
    const res = await fetch("/api/admin/invite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    setMsg(res.ok ? `Invited ${email} — onboarding email sent.` : `Failed: ${data.error}`);
    if (res.ok) setEmail("");
  }

  return (
    <form onSubmit={invite} style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
      <input
        className="field" style={{ flex: 1, minWidth: 220 }} type="email" required
        placeholder="member@example.com" value={email} onChange={(e) => setEmail(e.target.value)}
      />
      <button className="btn" style={{ fontSize: 13, padding: "11px 22px" }}>Invite</button>
      {msg && <p style={{ width: "100%", fontSize: 13.5, color: "var(--sand-dim)" }}>{msg}</p>}
    </form>
  );
}
