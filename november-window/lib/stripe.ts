import Stripe from "stripe";

// lazy singleton: the constructor throws without a key, which breaks `next build`
let client: Stripe | null = null;

export function getStripe(): Stripe {
  client ??= new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2024-12-18.acacia" as Stripe.LatestApiVersion,
  });
  return client;
}
