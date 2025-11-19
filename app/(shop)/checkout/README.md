# Checkout Feature

## Purpose

Handles the complete checkout flow including payment collection, order creation, and confirmation.

## Key Components

- **`page.tsx`** - Checkout page orchestrating the payment flow with Server Actions
- **`CheckoutForm.tsx`** (in `/components/checkout`) - Form using Stripe Elements for payment details
- **`actions.ts`** - Server Actions for creating Payment Intents and confirming orders

## Data Flow

1. `page.tsx` uses Server Action `createPaymentIntent` to initialize Stripe Payment Intent with cart items
2. `CheckoutForm` displays Stripe Elements (Card Element) for secure payment input
3. On form submission, `handlePaymentSubmission` calls Server Action to confirm payment with Stripe
4. Server Action validates payment success, then creates order and order_items in Supabase
5. Inventory is decremented atomically in database
6. User is redirected to order confirmation page
7. Stripe webhook handles async payment status updates for edge cases
