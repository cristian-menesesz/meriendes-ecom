import { loadStripe, Stripe } from '@stripe/stripe-js';

/**
 * Stripe client-side instance for Client Components.
 * Lazily loads Stripe.js for optimal performance.
 *
 * Docs: https://docs.stripe.com/stripe-js
 */
let stripePromise: Promise<Stripe | null>;

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
  }
  return stripePromise;
};
