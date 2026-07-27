import { supabaseServer } from "@/lib/supabase/server";
import { getAccess } from "@/lib/access";
import { MuxVideo } from "@/components/MuxVideo";
import { SignOutButton } from "@/components/SignOutButton";

const TOTAL_SECTIONS = 14;

export default async function CourseHome() {
  const access = await getAccess();
  const supabase = await supabaseServer();

  const [{ data: st }, { data: modules }] = await Promise.all([
    supabase.from("playbook_state").select("state").eq("user_id", access.userId!).maybeSingle(),
    supabase.from("modules").select("*").is("archived_at", null).eq("published", true).order("position"),
  ]);

  const done = st
    ? Object.values((st.state?.done ?? {}) as Record<string, boolean>).filter(Boolean).length
    : 0;
  const pct = Math.round((done / TOTAL_SECTIONS) * 100);

  return (
    <main style={{ minHeight: "100vh" }}>
      <header
        style={{
          height: 60, borderBottom: "1px solid var(--line)", display: "flex",
          alignItems: "center", padding: "0 24px", gap: 18,
          background: "rgba(7,25,22,.96)",
        }}
      >
        <span className="display" style={{ fontWeight: 900, fontSize: "1.2rem" }}>
          THE NOVEMBER <span style={{ color: "var(--sun)" }}>WINDOW</span>
        </span>
        <div style={{ marginLeft: "auto", display: "flex", gap: 18, alignItems: "center" }}>
          <span className="mono" style={{ fontSize: 11, color: "var(--sand-dim)" }}>{access.email}</span>
          {access.isAdmin && <a href="/admin" className="mono" style={{ fontSize: 11 }}>ADMIN</a>}
          <SignOutButton />
        </div>
      </header>

      <div className="wrap" style={{ padding: "50px 28px 90px" }}>
        <div className="eyebrow">Member dashboard</div>
        <h1 style={{ fontSize: "clamp(2.2rem,5vw,3.2rem)", marginBottom: 30 }}>
          Pick up where you left off
        </h1>

        {/* Playbook card */}
        <a
          href="/course/playbook"
          style={{
            display: "block", textDecoration: "none", color: "var(--sand)",
            background: "var(--surface)", border: "1px solid var(--sun)",
            borderRadius: 3, padding: "30px 32px", marginBottom: 40,
          }}
        >
          <div className="mono" style={{ fontSize: 10, letterSpacing: "0.18em", color: "var(--sun)", textTransform: "uppercase", marginBottom: 8 }}>
            The interactive playbook
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 18, flexWrap: "wrap" }}>
            <span className="display" style={{ fontSize: "1.7rem" }}>
              {done === 0 ? "Start Section 00 →" : done >= TOTAL_SECTIONS ? "All 14 sections complete" : `Continue — ${done} of ${TOTAL_SECTIONS} sections done →`}
            </span>
            <span className="mono" style={{ marginLeft: "auto", color: "var(--pool)", fontSize: 13 }}>{pct}%</span>
          </div>
          <div style={{ height: 3, background: "var(--line-soft)", marginTop: 16, borderRadius: 2 }}>
            <div style={{ height: "100%", width: `${pct}%`, background: "var(--sun)", borderRadius: 2 }} />
          </div>
        </a>

        {/* Video modules */}
        <div className="eyebrow">Video modules</div>
        {modules?.length ? (
          <div style={{ display: "grid", gap: 26 }}>
            {modules.map((m) => (
              <div key={m.id} style={{ background: "var(--ink-2)", border: "1px solid var(--line-soft)", borderRadius: 3, padding: 22 }}>
                <h3 style={{ fontSize: "1.2rem", marginBottom: 6 }}>{m.title}</h3>
                {m.description && <p style={{ color: "var(--sand-dim)", fontSize: 14.5, marginBottom: 14 }}>{m.description}</p>}
                {m.mux_playback_id ? (
                  <MuxVideo moduleId={m.id} playbackId={m.mux_playback_id} title={m.title} />
                ) : (
                  <p className="mono" style={{ fontSize: 12, color: "var(--sand-dim)" }}>Video processing — check back soon.</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: "var(--sand-dim)", fontSize: 15 }}>
            Video modules drop here as they&rsquo;re published. The playbook is the core — start there.
          </p>
        )}
      </div>
    </main>
  );
}
