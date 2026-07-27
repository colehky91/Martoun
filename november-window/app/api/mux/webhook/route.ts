import { NextResponse } from "next/server";
import crypto from "crypto";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs"; // raw body needed for signature verification

const TOLERANCE_SECS = 300;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Mux signs webhooks like Stripe: `mux-signature: t=<unix>,v1=<hmac>`
 * where v1 = HMAC-SHA256(secret, `${t}.${rawBody}`), hex-encoded.
 */
function verifyMuxSignature(rawBody: string, header: string | null, secret: string): boolean {
  if (!header) return false;
  const parts = Object.fromEntries(header.split(",").map((kv) => kv.split("=", 2)));
  const timestamp = Number(parts.t);
  const signature = parts.v1;
  if (!timestamp || !signature) return false;
  if (Math.abs(Date.now() / 1000 - timestamp) > TOLERANCE_SECS) return false;

  const expected = crypto.createHmac("sha256", secret).update(`${parts.t}.${rawBody}`).digest("hex");
  const a = Buffer.from(expected);
  const b = Buffer.from(signature);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

/**
 * video.asset.ready   → fill modules.mux_playback_id + duration_secs.
 *                       Target module: the asset's `passthrough` (set it to the
 *                       module UUID when creating the asset), else the first
 *                       unarchived module still missing a playback ID.
 *                       `published` is never touched — flip that by hand.
 * video.asset.errored → logged for the admin (visible in Vercel logs).
 */
export async function POST(req: Request) {
  const secret = process.env.MUX_WEBHOOK_SECRET;
  if (!secret) {
    console.error("MUX_WEBHOOK_SECRET is not set — rejecting webhook");
    return NextResponse.json({ error: "webhook not configured" }, { status: 500 });
  }

  const rawBody = await req.text();
  if (!verifyMuxSignature(rawBody, req.headers.get("mux-signature"), secret)) {
    return NextResponse.json({ error: "invalid signature" }, { status: 400 });
  }

  let event: { type?: string; data?: Record<string, unknown> };
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "bad payload" }, { status: 400 });
  }

  switch (event.type) {
    case "video.asset.ready": {
      const asset = event.data ?? {};
      const playbackId = (asset.playback_ids as { id?: string }[] | undefined)?.[0]?.id;
      if (!playbackId) break;
      const duration =
        typeof asset.duration === "number" ? Math.round(asset.duration) : null;

      const db = supabaseAdmin();

      let moduleId =
        typeof asset.passthrough === "string" && UUID_RE.test(asset.passthrough)
          ? asset.passthrough
          : null;
      if (!moduleId) {
        const { data: candidate } = await db
          .from("modules")
          .select("id")
          .is("mux_playback_id", null)
          .is("archived_at", null)
          .order("position")
          .limit(1)
          .maybeSingle();
        moduleId = candidate?.id ?? null;
      }
      if (!moduleId) {
        console.warn(`mux asset ${asset.id} ready but no module to fill — set passthrough or add a module`);
        break;
      }

      const { error } = await db
        .from("modules")
        .update({
          mux_playback_id: playbackId,
          ...(duration !== null ? { duration_secs: duration } : {}),
        })
        .eq("id", moduleId);
      if (error) {
        console.error(`failed to fill module ${moduleId} from mux asset ${asset.id}`, error);
        return NextResponse.json({ error: "db update failed" }, { status: 500 });
      }
      console.log(`module ${moduleId} ← mux playback ${playbackId} (${duration ?? "?"}s)`);
      break;
    }

    case "video.asset.errored": {
      const asset = event.data ?? {};
      console.error(`mux asset ${asset.id} ERRORED:`, JSON.stringify(asset.errors ?? {}));
      break;
    }
  }

  return NextResponse.json({ received: true });
}
