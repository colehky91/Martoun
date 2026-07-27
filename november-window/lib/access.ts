import { supabaseServer } from "@/lib/supabase/server";

export type Access = {
  userId: string | null;
  email: string | null;
  isAdmin: boolean;
  hasCourseAccess: boolean;
};

/** Course access = admin, comp_access, or an active/trialing Stripe subscription. */
export async function getAccess(): Promise<Access> {
  const supabase = await supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { userId: null, email: null, isAdmin: false, hasCourseAccess: false };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, comp_access, archived_at")
    .eq("id", user.id)
    .single();

  const isAdmin = profile?.role === "admin";
  if (profile?.archived_at) {
    return { userId: user.id, email: user.email ?? null, isAdmin, hasCourseAccess: false };
  }

  let hasSub = false;
  if (!isAdmin && !profile?.comp_access) {
    const { data: subs } = await supabase
      .from("subscriptions")
      .select("status")
      .eq("user_id", user.id)
      .in("status", ["active", "trialing"])
      .limit(1);
    hasSub = !!subs?.length;
  }

  return {
    userId: user.id,
    email: user.email ?? null,
    isAdmin,
    hasCourseAccess: isAdmin || !!profile?.comp_access || hasSub,
  };
}
