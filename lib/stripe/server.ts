import Stripe from 'stripe';

let _stripe: Stripe | null = null;

/**
 * Get Stripe server-side client instance.
 * Uses lazy initialization to avoid errors during build time.
 * Used in Server Components, Server Actions, and API routes.
 *
 * Docs: https://docs.stripe.com/api
 */
export function getStripe(): Stripe {
  if (_stripe) {
    return _stripe;
  }

  const apiKey = process.env.STRIPE_SECRET_KEY;

  if (!apiKey) {
    throw new Error('STRIPE_SECRET_KEY is not set in environment variables');
  }

  _stripe = new Stripe(apiKey, {
    apiVersion: '2025-11-17.clover',
    typescript: true,
    appInfo: {
      name: 'Meriendes E-commerce',
      version: '0.1.0',
    },
  });

  return _stripe;
}

/**
 * Stripe server-side client initialization.
 * @deprecated Use getStripe() instead for better build-time handling
 */
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2025-11-17.clover',
  typescript: true,
  appInfo: {
    name: 'Meriendes E-commerce',
    version: '0.1.0',
  },
});
