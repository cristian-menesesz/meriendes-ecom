import Stripe from 'stripe';

/**
 * Stripe server-side client initialization.
 * Used in Server Components, Server Actions, and API routes.
 *
 * Docs: https://docs.stripe.com/api
 */
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-11-17.clover',
  typescript: true,
  appInfo: {
    name: 'Meriendes E-commerce',
    version: '0.1.0',
  },
});
