import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

/** GET → current playbook state for the signed-in member. */
export async function GET() {
  const supabase = await supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { data } = await supabase
    .from("playbook_state").select("state, updated_at").eq("user_id", user.id).maybeSingle();

  return NextResponse.json({ state: data?.state ?? { done: {}, checks: {} } });
}

/** POST { state } → upsert current state + append an immutable event. */
export async function POST(req: Request) {
  const supabase = await supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  let body: { state?: { done?: Record<string, boolean>; checks?: Record<string, unknown> } };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad json" }, { status: 400 });
  }
  const state = body.state;
  if (!state || typeof state !== "object") {
    return NextResponse.json({ error: "missing state" }, { status: 400 });
  }

  const clean = { done: state.done ?? {}, checks: state.checks ?? {} };

  const { error } = await supabase.from("playbook_state").upsert({
    user_id: user.id,
    state: clean,
    updated_at: new Date().toISOString(),
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // append-only history — powers the progress export
  await supabase.from("progress_events").insert({
    user_id: user.id,
    kind: "playbook_sync",
    payload: { sections_done: Object.values(clean.done).filter(Boolean).length },
  });

  return NextResponse.json({ ok: true });
}
