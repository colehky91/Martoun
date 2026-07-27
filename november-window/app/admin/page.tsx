import { redirect } from "next/navigation";
import { getAccess } from "@/lib/access";
import { InviteForm } from "@/components/InviteForm";

export default async function Admin() {
  const access = await getAccess();
  if (!access.isAdmin) redirect("/course");

  return (
    <main className="wrap" style={{ padding: "60px 28px" }}>
      <div className="eyebrow">Admin</div>
      <h1 style={{ fontSize: "2.6rem", marginBottom: 34 }}>Members</h1>

      <section style={{ background: "var(--ink-2)", border: "1px solid var(--line-soft)", borderRadius: 3, padding: "26px 28px", marginBottom: 22, maxWidth: 560 }}>
        <h3 style={{ fontSize: "1.15rem", marginBottom: 6 }}>Add a member manually</h3>
        <p style={{ color: "var(--sand-dim)", fontSize: 14, marginBottom: 16 }}>
          Grants free access and sends the same onboarding email paying members get.
        </p>
        <InviteForm />
      </section>

      <section style={{ background: "var(--ink-2)", border: "1px solid var(--line-soft)", borderRadius: 3, padding: "26px 28px", maxWidth: 560 }}>
        <h3 style={{ fontSize: "1.15rem", marginBottom: 6 }}>Progress report</h3>
        <p style={{ color: "var(--sand-dim)", fontSize: 14, marginBottom: 16 }}>
          Every member&rsquo;s section count, last activity, and subscription status —
          archived members included.
        </p>
        <a href="/api/admin/export" className="btn" style={{ fontSize: 13, padding: "11px 22px" }}>
          Download PDF
        </a>
      </section>
    </main>
  );
}
