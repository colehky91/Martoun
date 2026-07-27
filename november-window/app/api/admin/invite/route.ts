import { NextResponse } from "next/server";
import { getAccess } from "@/lib/access";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { sendWelcomeEmail } from "@/lib/resend";

/**
 * POST { email } — admin-only. Manually add a member (comp access) and
 * send them the same Resend onboarding email paying customers get.
 * Set your own profile to role='admin' in Supabase first (see README).
 */
export async function POST(req: Request) {
  const access = await getAccess();
  if (!access.isAdmin) return NextResponse.json({ error: "admins only" }, { status: 403 });

  const { email } = await req.json().catch(() => ({}));
  if (!email || typeof email !== "string") {
    return NextResponse.json({ error: "email required" }, { status: 400 });
  }

  const db = supabaseAdmin();

  // find-or-create the user
  let userId: string;
  const { data: existing } = await db.from("profiles").select("id").eq("email", email).maybeSingle();
  if (existing) {
    userId = existing.id;
  } else {
    const { data: created, error } = await db.auth.admin.createUser({ email, email_confirm: true });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    userId = created.user.id;
    await db.from("profiles").upsert({ id: userId, email }, { onConflict: "id" });
  }

  await db.from("profiles").update({ comp_access: true }).eq("id", userId);

  const { data: linkData, error: linkErr } = await db.auth.admin.generateLink({
    type: "magiclink",
    email,
    options: { redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?next=/course` },
  });
  if (linkErr) return NextResponse.json({ error: linkErr.message }, { status: 500 });

  await sendWelcomeEmail(email, linkData.properties.action_link);
  await db.from("progress_events").insert({
    user_id: userId, kind: "manual_invite", payload: { invited_by: access.email },
  });

  return NextResponse.json({ ok: true, userId });
}
