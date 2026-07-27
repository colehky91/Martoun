import { NextResponse } from "next/server";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { getAccess } from "@/lib/access";
import { supabaseAdmin } from "@/lib/supabase/admin";

const TOTAL_SECTIONS = 14; // panels p0–pd in the playbook

/**
 * GET /api/admin/export — admin-only. Generates a PDF report of every
 * member's progress: sections complete, last activity, subscription status.
 * Archived members are included (nothing is ever dropped from reporting).
 */
export async function GET() {
  const access = await getAccess();
  if (!access.isAdmin) return NextResponse.json({ error: "admins only" }, { status: 403 });

  const db = supabaseAdmin();
  const { data: profiles } = await db
    .from("profiles")
    .select("id, email, created_at, archived_at, comp_access")
    .order("created_at");
  const { data: states } = await db.from("playbook_state").select("user_id, state, updated_at");
  const { data: subs } = await db.from("subscriptions").select("user_id, status");

  const stateBy = new Map((states ?? []).map((s) => [s.user_id, s]));
  const subBy = new Map((subs ?? []).map((s) => [s.user_id, s.status]));

  const pdf = await PDFDocument.create();
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);

  let page = pdf.addPage([842, 595]); // A4 landscape
  const ink = rgb(0.03, 0.1, 0.09);
  const sun = rgb(1, 0.48, 0.1);
  let y = 545;

  const header = () => {
    page.drawText("THE NOVEMBER WINDOW — MEMBER PROGRESS", { x: 40, y, size: 16, font: bold, color: ink });
    page.drawText(new Date().toISOString().slice(0, 10), { x: 700, y, size: 10, font, color: ink });
    y -= 26;
    const cols = ["Email", "Joined", "Sections", "Last activity", "Subscription", "Status"];
    const xs = [40, 260, 360, 440, 580, 700];
    cols.forEach((c, i) => page.drawText(c, { x: xs[i], y, size: 9, font: bold, color: sun }));
    y -= 6;
    page.drawLine({ start: { x: 40, y }, end: { x: 802, y }, thickness: 0.5, color: ink });
    y -= 14;
  };
  header();

  for (const p of profiles ?? []) {
    if (y < 50) { page = pdf.addPage([842, 595]); y = 545; header(); }
    const st = stateBy.get(p.id);
    const done = st ? Object.values((st.state?.done ?? {}) as Record<string, boolean>).filter(Boolean).length : 0;
    const row = [
      p.email ?? "—",
      (p.created_at ?? "").slice(0, 10),
      `${done} / ${TOTAL_SECTIONS}`,
      st?.updated_at ? st.updated_at.slice(0, 10) : "no activity",
      p.comp_access ? "comp" : (subBy.get(p.id) ?? "none"),
      p.archived_at ? "archived" : "active",
    ];
    const xs = [40, 260, 360, 440, 580, 700];
    row.forEach((c, i) => page.drawText(String(c), { x: xs[i], y, size: 9, font, color: ink }));
    y -= 16;
  }

  const bytes = await pdf.save();
  return new NextResponse(Buffer.from(bytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="november-window-progress-${Date.now()}.pdf"`,
    },
  });
}
