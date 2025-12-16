import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/server';
import { createServiceClient } from '@/lib/supabase/server';
import type Stripe from 'stripe';

/**
 * Stripe Webhook Handler
 * Processes checkout.session.completed events for order fulfillment.
 *
 * SECURITY: Verifies Stripe signature to prevent fake orders.
 * Uses service client to bypass RLS (webhooks process guest orders).
 *
 * Docs: https://docs.stripe.com/webhooks
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Get raw body for signature verification
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      console.error('Missing stripe-signature header');
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
    }

    // 2. Verify webhook signature (CRITICAL SECURITY)
    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error('⚠️ Webhook signature verification failed:', errorMessage);
      return NextResponse.json(
        { error: `Webhook signature verification failed: ${errorMessage}` },
        { status: 400 }
      );
    }

    console.log('✅ Webhook signature verified:', event.type);

    // 3. Handle checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;

      // 3a. Verify payment status
      if (session.payment_status !== 'paid') {
        console.log('⚠️ Session not paid, skipping fulfillment:', session.id);
        return NextResponse.json({ received: true });
      }

      // 3b. Extract order_id from metadata
      const orderId = session.metadata?.order_id;

      if (!orderId) {
        console.error('❌ Missing order_id in session metadata:', session.id);
        return NextResponse.json({ error: 'Missing order_id in metadata' }, { status: 400 });
      }

      console.log('📦 Processing order fulfillment:', orderId);

      // 3c. Fulfill order
      const result = await fulfillOrder(orderId, session);

      if (!result.success) {
        console.error('❌ Order fulfillment failed:', result.error);
        // Return 500 so Stripe retries
        return NextResponse.json({ error: result.error }, { status: 500 });
      }

      console.log('✅ Order fulfilled successfully:', orderId);
    }

    // 4. Return 200 to acknowledge receipt
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('❌ Webhook error:', error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}

/**
 * Fulfills an order after successful payment.
 * Updates order status, creates payment record, and updates inventory.
 *
 * @param orderId - UUID of the order to fulfill
 * @param session - Stripe Checkout Session
 * @returns Success status
 */
async function fulfillOrder(
  orderId: string,
  session: Stripe.Checkout.Session
): Promise<{ success: boolean; error?: string }> {
  // Use service client to bypass RLS (processing guest orders)
  const supabase = createServiceClient();

  try {
    // 1. Check if order already processed (idempotency)
    const { data: existingOrder, error: fetchError } = await supabase
      .from('orders')
      .select('status')
      .eq('id', orderId)
      .single();

    if (fetchError) {
      return { success: false, error: 'Failed to fetch order' };
    }

    if (existingOrder.status === 'paid' || existingOrder.status === 'processing') {
      console.log('ℹ️ Order already processed:', orderId);
      return { success: true }; // Already processed, return success
    }

    // 2. Update order status to 'paid'
    const { error: orderUpdateError } = await supabase
      .from('orders')
      .update({
        status: 'paid',
        payment_status: 'succeeded',
        paid_at: new Date().toISOString(),
      })
      .eq('id', orderId);

    if (orderUpdateError) {
      console.error('Failed to update order:', orderUpdateError);
      return { success: false, error: 'Failed to update order status' };
    }

    // 3. Create payment record (NO card details - PCI compliance)
    const { error: paymentError } = await supabase.from('payments').insert({
      order_id: orderId,
      stripe_payment_intent_id: session.payment_intent as string,
      stripe_customer_id: session.customer as string | null,
      amount: (session.amount_total ?? 0) / 100, // Convert cents to dollars
      currency: session.currency || 'usd',
      status: 'succeeded',
      payment_method_type: 'card', // Stripe Checkout default
      succeeded_at: new Date().toISOString(),
    });

    if (paymentError) {
      console.error('Failed to create payment record:', paymentError);
      // Continue despite payment record failure (order is still valid)
    }

    // 4. Fetch order items to update inventory
    const { data: orderItems, error: itemsError } = await supabase
      .from('order_items')
      .select('variant_id, quantity')
      .eq('order_id', orderId);

    if (itemsError || !orderItems) {
      console.error('Failed to fetch order items:', itemsError);
      return { success: false, error: 'Failed to fetch order items' };
    }

    // 5. Fulfill inventory (decrement reserved only)
    for (const item of orderItems) {
      if (!item.variant_id) continue; // Skip bundle items for MVP

      // Use database function to fulfill inventory
      const { error: fulfillError } = await supabase.rpc('fulfill_order_inventory', {
        p_variant_id: item.variant_id,
        p_quantity: item.quantity,
      });

      if (fulfillError) {
        console.error('Failed to fulfill inventory:', fulfillError);
        return { success: false, error: 'Failed to update inventory' };
      }
    }

    // 6. Delete/mark inventory reservations as fulfilled
    const { error: reservationError } = await supabase
      .from('inventory_reservations')
      .delete()
      .eq('order_id', orderId);

    if (reservationError) {
      console.error('Failed to delete reservations:', reservationError);
      // Continue despite reservation cleanup failure
    }

    // 7. Send confirmation emails (async, don't block webhook)
    sendConfirmationEmails(orderId, session).catch((err) => {
      console.error('Failed to send confirmation emails:', err);
      // Don't fail webhook if emails fail
    });

    return { success: true };
  } catch (error) {
    console.error('Order fulfillment error:', error);
    return { success: false, error: 'Unexpected error during fulfillment' };
  }
}

/**
 * Sends confirmation emails to customer and admin.
 * Runs asynchronously and doesn't block webhook response.
 *
 * @param orderId - UUID of the order
 * @param session - Stripe Checkout Session
 */
async function sendConfirmationEmails(
  orderId: string,
  session: Stripe.Checkout.Session
): Promise<void> {
  // TODO: Implement email sending
  // For MVP, just log the action
  console.log('📧 [TODO] Send confirmation email for order:', orderId);
  console.log('Customer email:', session.customer_email);

  // Future implementation:
  // - Use Resend, SendGrid, or AWS SES
  // - Send customer confirmation with order details
  // - Send admin notification
  // - Use Promise.allSettled to send both concurrently
}
