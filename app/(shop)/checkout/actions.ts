'use server';

import { z } from 'zod';
import { stripe } from '@/lib/stripe/server';
import { createClient, createServiceClient } from '@/lib/supabase/server';
import { checkoutFormSchema, cartItemSchema } from '@/lib/validations/schemas';
import {
  generateOrderNumber,
  calculateOrderTotal,
  validateCheckoutCart,
} from '@/lib/utils/checkout';

/**
 * Server Action return type for checkout session creation.
 */
type CheckoutSessionResult =
  | { success: true; sessionUrl: string; sessionId: string }
  | { success: false; error: string };

/**
 * Input schema for checkout session creation.
 * Combines customer/address info with cart items.
 */
const createCheckoutSessionSchema = z.object({
  customerInfo: checkoutFormSchema,
  cartItems: z.array(cartItemSchema).min(1, 'Cart cannot be empty'),
});

/**
 * Creates a Stripe Checkout Session and draft order in database.
 * Implements inventory reservation and transaction safety.
 *
 * @param formData - Customer information and cart items
 * @returns Success with session URL or error message
 */
export async function createCheckoutSession(
  formData: z.infer<typeof createCheckoutSessionSchema>
): Promise<CheckoutSessionResult> {
  try {
    // 1. Validate input (server-side validation - never trust client)
    const validationResult = createCheckoutSessionSchema.safeParse(formData);

    if (!validationResult.success) {
      return {
        success: false,
        error: validationResult.error.issues[0]?.message || 'Invalid form data',
      };
    }

    const { customerInfo, cartItems } = validationResult.data;

    // Use regular client for product validation (respects RLS)
    const supabase = await createClient();

    // Use service client for order creation (bypasses RLS for guest checkout)
    const supabaseAdmin = createServiceClient();

    // 2. Calculate subtotal from cart items
    const subtotal = cartItems.reduce((sum, item) => sum + item.variant.price * item.quantity, 0);

    // 3. Validate cart
    const cartValidation = validateCheckoutCart(cartItems, subtotal);
    if (!cartValidation.valid) {
      return { success: false, error: cartValidation.error || 'Invalid cart' };
    }

    // 4. Verify cart items in database (exist, active, price matches)
    const variantIds = cartItems.map((item) => item.variant.id);
    const { data: variants, error: variantsError } = await supabase
      .from('product_variants')
      .select('id, price, is_active, stripe_price_id')
      .in('id', variantIds);

    if (variantsError || !variants) {
      return { success: false, error: 'Failed to verify cart items' };
    }

    // Verify each item
    for (const item of cartItems) {
      const dbVariant = variants.find((v) => v.id === item.variant.id);

      if (!dbVariant) {
        return {
          success: false,
          error: `Product "${item.product.name}" is no longer available`,
        };
      }

      if (!dbVariant.is_active) {
        return {
          success: false,
          error: `Product "${item.product.name}" is currently unavailable`,
        };
      }

      // Prevent price manipulation
      if (Math.abs(dbVariant.price - item.variant.price) > 0.01) {
        return {
          success: false,
          error: `Price for "${item.product.name}" has changed. Please refresh your cart.`,
        };
      }

      if (!dbVariant.stripe_price_id) {
        return {
          success: false,
          error: `Product "${item.product.name}" is not configured for checkout`,
        };
      }
    }

    // 5. Check inventory availability
    const { data: inventory, error: inventoryError } = await supabase
      .from('inventory')
      .select('variant_id, quantity_available')
      .in('variant_id', variantIds);

    if (inventoryError || !inventory) {
      return { success: false, error: 'Failed to check inventory' };
    }

    for (const item of cartItems) {
      const stock = inventory.find((inv) => inv.variant_id === item.variant.id);

      if (!stock || stock.quantity_available < item.quantity) {
        return {
          success: false,
          error: `Insufficient inventory for "${item.product.name}"`,
        };
      }
    }

    // 6. Calculate totals (server-side)
    const { taxAmount, deliveryFee, total } = calculateOrderTotal(
      subtotal,
      customerInfo.address.state
    );

    // 7. Generate unique order number
    const orderNumber = generateOrderNumber();
    const orderId = crypto.randomUUID();

    // 8. Start PostgreSQL transaction (using Supabase RPC or multiple operations)
    // Note: For true atomicity, consider using a Supabase Edge Function with BEGIN/COMMIT

    // 8a. Create draft order (using service client to bypass RLS for guest checkout)
    const { error: orderError } = await supabaseAdmin.from('orders').insert({
      id: orderId,
      order_number: orderNumber,
      customer_id: null, // Guest checkout for MVP
      status: 'draft',
      subtotal,
      discount_amount: 0,
      tax_amount: taxAmount,
      delivery_fee: deliveryFee,
      total,
      promo_code_id: null,
      delivery_street_address_1: customerInfo.address.streetAddress1,
      delivery_street_address_2: customerInfo.address.streetAddress2 || null,
      delivery_city: customerInfo.address.city,
      delivery_state: customerInfo.address.state,
      delivery_zip_code: customerInfo.address.zipCode,
      delivery_country: customerInfo.address.country,
      delivery_instructions: customerInfo.address.deliveryInstructions || null,
      customer_email: customerInfo.email,
      customer_phone: customerInfo.phone || null,
      customer_first_name: customerInfo.firstName,
      customer_last_name: customerInfo.lastName,
      payment_status: null,
      payment_method: null,
    });

    if (orderError) {
      console.error('Failed to create order:', orderError);
      return { success: false, error: 'Failed to create order' };
    }

    // 8b. Create order items (using service client to bypass RLS)
    const orderItems = cartItems.map((item) => ({
      order_id: orderId,
      item_type: 'product' as const,
      variant_id: item.variant.id,
      bundle_id: null,
      product_name: item.product.name,
      variant_name: item.variant.variantName,
      sku: item.variant.sku,
      quantity: item.quantity,
      unit_price: item.variant.price,
      line_total: item.variant.price * item.quantity,
    }));

    const { error: itemsError } = await supabaseAdmin.from('order_items').insert(orderItems);

    if (itemsError) {
      console.error('Failed to create order items:', itemsError);
      // Rollback: Delete the order (using service client)
      await supabaseAdmin.from('orders').delete().eq('id', orderId);
      return { success: false, error: 'Failed to create order items' };
    }

    // 8c. Reserve inventory (using service client to bypass RLS)
    const reservationExpiry = new Date();
    reservationExpiry.setMinutes(reservationExpiry.getMinutes() + 30); // 30 min expiration

    for (const item of cartItems) {
      // Insert reservation
      const { error: reservationError } = await supabaseAdmin
        .from('inventory_reservations')
        .insert({
          variant_id: item.variant.id,
          order_id: orderId,
          quantity: item.quantity,
          expires_at: reservationExpiry.toISOString(),
        });

      if (reservationError) {
        console.error('Failed to create reservation:', reservationError);
        // Rollback: Delete order and items (using service client)
        await supabaseAdmin.from('orders').delete().eq('id', orderId);
        return { success: false, error: 'Failed to reserve inventory' };
      }

      // Update inventory (decrement available, increment reserved)
      // Use service client because inventory table has RLS enabled
      const { error: updateError } = await supabaseAdmin.rpc('reserve_inventory', {
        p_variant_id: item.variant.id,
        p_quantity: item.quantity,
      });

      if (updateError) {
        console.error('Failed to update inventory:', updateError);
        // Rollback (using service client)
        await supabaseAdmin.from('orders').delete().eq('id', orderId);
        return { success: false, error: 'Failed to reserve inventory' };
      }
    }

    // 9. Create Stripe Checkout Session
    const lineItems = cartItems.map((item) => {
      const dbVariant = variants.find((v) => v.id === item.variant.id);
      return {
        price: dbVariant!.stripe_price_id!,
        quantity: item.quantity,
      };
    });

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    try {
      const session = await stripe.checkout.sessions.create(
        {
          mode: 'payment',
          line_items: lineItems,
          success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${baseUrl}/checkout/cancelled`,
          metadata: {
            order_id: orderId,
          },
          payment_intent_data: {
            metadata: {
              order_id: orderId,
            },
          },
        },
        {
          idempotencyKey: `checkout_${orderId}`, // Prevent duplicate sessions
        }
      );

      if (!session.url) {
        throw new Error('No session URL returned from Stripe');
      }

      // 10. Return success with session URL
      return {
        success: true,
        sessionUrl: session.url,
        sessionId: session.id,
      };
    } catch (stripeError) {
      console.error('Stripe error:', stripeError);

      // Rollback: Release reservations and delete order
      await supabase.from('orders').delete().eq('id', orderId);

      for (const item of cartItems) {
        await supabase.rpc('release_inventory', {
          p_variant_id: item.variant.id,
          p_quantity: item.quantity,
        });
      }

      return {
        success: false,
        error: 'Failed to create payment session. Please try again.',
      };
    }
  } catch (error) {
    console.error('Checkout session error:', error);
    return {
      success: false,
      error: 'An unexpected error occurred. Please try again.',
    };
  }
}
