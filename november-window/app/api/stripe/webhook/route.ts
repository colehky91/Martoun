import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { sendWelcomeEmail } from "@/lib/resend";

export const runtime = "nodejs"; // raw body needed for signature verification

/**
 * checkout.session.completed  → find-or-create the Supabase user, record the
 *                               subscription, email a magic sign-in link (Resend).
 * customer.subscription.*     → keep the mirrored status current.
 *                               Cancellations ARCHIVE (archived_at) — never delete.
 */
export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    console.error("bad stripe signature", err);
    return NextResponse.json({ error: "invalid signature" }, { status: 400 });
  }

  const db = supabaseAdmin();

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const email = session.customer_details?.email;
        if (!email) break;

        // 1. Find or create the auth user
        let userId: string | null = null;
        const { data: existing } = await db
          .from("profiles").select("id").eq("email", email).maybeSingle();

        if (existing) {
          userId = existing.id;
        } else {
          const { data: created, error } = await db.auth.admin.createUser({
            email,
            email_confirm: true,
          });
          if (error) throw error;
          userId = created.user.id;
          // trigger creates the profile row; small upsert covers race
          await db.from("profiles").upsert({ id: userId, email }, { onConflict: "id" });
        }

        // 2. Record the subscription
        await db.from("subscriptions").upsert(
          {
            user_id: userId,
            stripe_customer_id: String(session.customer ?? ""),
            stripe_subscription_id: String(session.subscription ?? ""),
            status: "active",
            updated_at: new Date().toISOString(),
          },
          { onConflict: "stripe_subscription_id" }
        );

        // 3. Onboard via Resend with a one-click magic link
        const { data: linkData, error: linkErr } = await db.auth.admin.generateLink({
          type: "magiclink",
          email,
          options: { redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?next=/course` },
        });
        if (linkErr) throw linkErr;
        await sendWelcomeEmail(email, linkData.properties.action_link);

        // 4. Audit trail
        await db.from("progress_events").insert({
          user_id: userId,
          kind: "purchase",
          payload: { stripe_session: session.id },
        });
        break;
      }

      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        const canceled = event.type === "customer.subscription.deleted" || sub.status === "canceled";
        await db
          .from("subscriptions")
          .update({
            status: sub.status,
            current_period_end: sub.current_period_end
              ? new Date(sub.current_period_end * 1000).toISOString()
              : null,
            updated_at: new Date().toISOString(),
            ...(canceled ? { archived_at: new Date().toISOString() } : {}),
          })
          .eq("stripe_subscription_id", sub.id);
        break;
      }
    }
  } catch (err) {
    console.error(`webhook handler failed for ${event.type}`, err);
    return NextResponse.json({ error: "handler failure" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
