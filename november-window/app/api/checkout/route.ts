import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";

/**
 * Creates a Stripe Checkout session for the $47/mo subscription.
 * GET so the landing-page CTA can be a plain link.
 */
export async function GET(req: Request) {
  const site = process.env.NEXT_PUBLIC_SITE_URL!;
  try {
    const session = await getStripe().checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: process.env.STRIPE_PRICE_ID!, quantity: 1 }],
      success_url: `${site}/welcome?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${site}/#pricing`,
      allow_promotion_codes: true,
    });
    return NextResponse.redirect(session.url!, { status: 303 });
  } catch (err) {
    console.error("checkout error", err);
    return NextResponse.redirect(`${site}/?checkout=error`, { status: 303 });
  }
}
