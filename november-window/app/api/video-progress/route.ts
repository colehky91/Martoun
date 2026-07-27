import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

/** POST { moduleId, secondsWatched, pctComplete } — called by the Mux player. */
export async function POST(req: Request) {
  const supabase = await supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { moduleId, secondsWatched, pctComplete } = await req.json();
  if (!moduleId) return NextResponse.json({ error: "missing moduleId" }, { status: 400 });

  const { error } = await supabase.from("video_progress").upsert({
    user_id: user.id,
    module_id: moduleId,
    seconds_watched: Number(secondsWatched) || 0,
    pct_complete: Math.min(100, Number(pctComplete) || 0),
    updated_at: new Date().toISOString(),
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await supabase.from("progress_events").insert({
    user_id: user.id,
    kind: "video_progress",
    payload: { moduleId, pctComplete },
  });

  return NextResponse.json({ ok: true });
}
