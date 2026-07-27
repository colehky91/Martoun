import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { getAccess } from "@/lib/access";
import { supabaseServer } from "@/lib/supabase/server";

/**
 * Serves the interactive playbook — but only to paying / comped members.
 * The member's saved state is injected as window.__NW_STATE__ so the page
 * boots exactly where they left off; edits sync back via /api/progress.
 */
export async function GET() {
  const access = await getAccess();
  if (!access.userId) return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/login`);
  if (!access.hasCourseAccess)
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/#pricing`);

  const supabase = await supabaseServer();
  const { data } = await supabase
    .from("playbook_state").select("state").eq("user_id", access.userId).maybeSingle();
  const state = data?.state ?? { done: {}, checks: {} };

  const file = path.join(process.cwd(), "content", "playbook.html");
  let html = await fs.readFile(file, "utf8");

  // </script> can't appear inside an inline script — harmless here, but be safe
  const safeState = JSON.stringify(state).replace(/</g, "\\u003c");
  html = html.replace(
    "</head>",
    `<script>window.__NW_STATE__ = ${safeState};</script>\n</head>`
  );

  return new NextResponse(html, {
    headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" },
  });
}
