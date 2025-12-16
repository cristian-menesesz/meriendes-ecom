import { Metadata } from 'next/types';
import Link from 'next/link';
import Image from 'next/image';
import { notFound, redirect } from 'next/navigation';
import { createServiceClient } from '@/lib/supabase/server';
import { stripe } from '@/lib/stripe/server';
import { formatCurrency } from '@/lib/utils/currency';
import { ClearCartOnSuccess } from './ClearCartOnSuccess';
import { PrintOrderButton } from './PrintOrderButton';
import type { OrderWithItems } from '@/types/queries';

export const metadata: Metadata = {
  title: 'Order Confirmed',
  robots: 'noindex', // Don't index success pages
};

interface Props {
  searchParams: Promise<{ session_id?: string }>;
}

/**
 * Success page displayed after successful Stripe Checkout.
 * Verifies the session, fetches order details, and displays confirmation.
 *
 * Security: Validates session_id with Stripe before displaying order.
 * SEO: Noindex to prevent indexing of order confirmations.
 */
export default async function CheckoutSuccessPage({ searchParams }: Props) {
  const params = await searchParams;
  const sessionId = params.session_id;

  if (!sessionId) {
    redirect('/products');
  }

  // Verify session with Stripe
  let session;
  try {
    session = await stripe.checkout.sessions.retrieve(sessionId);
  } catch (error) {
    console.error('❌ Failed to retrieve checkout session:', error);
    notFound();
  }

  // Validate payment was successful
  if (session.payment_status !== 'paid') {
    redirect('/checkout/cancelled');
  }

  // Get order ID from metadata
  const orderId = session.metadata?.order_id;
  if (!orderId) {
    console.error('❌ Order ID missing from session metadata');
    notFound();
  }

  // Fetch order details
  // Use service client to bypass RLS for guest orders (customer_id IS NULL)
  const supabase = createServiceClient();
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .select(
      `
      *,
      order_items (
        id,
        quantity,
        unit_price,
        line_total,
        product_variants (
          id,
          sku,
          products (
            id,
            name,
            image_url
          )
        )
      )
    `
    )
    .eq('id', orderId)
    .single();

  if (orderError || !order) {
    console.error('❌ Failed to fetch order:', orderError);
    notFound();
  }

  // Type cast to properly typed order with relations
  const typedOrder = order as unknown as OrderWithItems;

  // Format order number for display
  const orderNumber = typedOrder.order_number;
  const estimatedDeliveryDate = new Date();
  estimatedDeliveryDate.setDate(estimatedDeliveryDate.getDate() + 5); // 5 business days

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      {/* Success Header */}
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <svg
            className="h-8 w-8 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="mb-2 text-3xl font-bold text-gray-900">Order Confirmed!</h1>
        <p className="text-gray-600">
          Thank you for your order. We&apos;ll send you a confirmation email shortly.
        </p>
      </div>

      {/* Order Details Card */}
      <div className="mb-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h2 className="text-sm font-medium text-gray-500">Order Number</h2>
            <p className="text-lg font-semibold text-gray-900">{orderNumber}</p>
          </div>
          <div className="text-right">
            <h2 className="text-sm font-medium text-gray-500">Status</h2>
            <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
              {typedOrder.status === 'paid' ? 'Confirmed' : 'Processing'}
            </span>
          </div>
        </div>

        {/* Order Items */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">Order Items</h3>
          <div className="space-y-4">
            {typedOrder.order_items?.map((item) => (
              <div key={item.id} className="flex gap-4">
                {item.product_variants?.products?.image_url && (
                  <Image
                    src={item.product_variants.products.image_url}
                    alt={item.product_variants.products.name || 'Product'}
                    width={80}
                    height={80}
                    className="h-20 w-20 rounded-lg object-cover"
                  />
                )}
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">
                    {item.product_variants?.products?.name || 'Product'}
                  </h4>
                  <p className="text-sm text-gray-500">SKU: {item.product_variants?.sku}</p>
                  <p className="text-sm text-gray-600">
                    Quantity: {item.quantity} × {formatCurrency(item.unit_price)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{formatCurrency(item.line_total)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery Address */}
        {typedOrder.delivery_street_address_1 && (
          <div className="mt-6 border-t border-gray-200 pt-6">
            <h3 className="mb-2 text-lg font-semibold text-gray-900">Delivery Address</h3>
            <div className="text-gray-700">
              <p>
                {typedOrder.customer_first_name} {typedOrder.customer_last_name}
              </p>
              <p>{typedOrder.delivery_street_address_1}</p>
              {typedOrder.delivery_street_address_2 && (
                <p>{typedOrder.delivery_street_address_2}</p>
              )}
              <p>
                {typedOrder.delivery_city}, {typedOrder.delivery_state}{' '}
                {typedOrder.delivery_zip_code}
              </p>
              {typedOrder.customer_phone && (
                <p className="mt-2">Phone: {typedOrder.customer_phone}</p>
              )}
            </div>
          </div>
        )}

        {/* Order Summary */}
        <div className="mt-6 border-t border-gray-200 pt-6">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">Order Summary</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-gray-700">
              <span>Subtotal</span>
              <span>{formatCurrency(typedOrder.subtotal)}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Tax</span>
              <span>{formatCurrency(typedOrder.tax_amount)}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Delivery Fee</span>
              <span>
                {typedOrder.delivery_fee > 0 ? formatCurrency(typedOrder.delivery_fee) : 'FREE'}
              </span>
            </div>
            <div className="flex justify-between border-t border-gray-200 pt-2 text-lg font-semibold text-gray-900">
              <span>Total</span>
              <span>{formatCurrency(typedOrder.total)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* What's Next Section */}
      <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-6">
        <h3 className="mb-3 text-lg font-semibold text-gray-900">What&apos;s Next?</h3>
        <ul className="space-y-2 text-gray-700">
          <li className="flex items-start gap-2">
            <svg
              className="mt-0.5 h-5 w-5 shrink-0 text-blue-600"
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span>
              You&apos;ll receive a confirmation email at{' '}
              <strong>{typedOrder.customer_email}</strong>
            </span>
          </li>
          <li className="flex items-start gap-2">
            <svg
              className="mt-0.5 h-5 w-5 shrink-0 text-blue-600"
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span>Your order will be prepared and shipped within 1-2 business days</span>
          </li>
          <li className="flex items-start gap-2">
            <svg
              className="mt-0.5 h-5 w-5 shrink-0 text-blue-600"
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span>
              Estimated delivery:{' '}
              <strong>
                {estimatedDeliveryDate.toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                })}
              </strong>
            </span>
          </li>
        </ul>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Link
          href="/products"
          className="flex-1 rounded-lg bg-gray-900 px-6 py-3 text-center font-semibold text-white transition-colors hover:bg-gray-800"
        >
          Continue Shopping
        </Link>
        <PrintOrderButton />
      </div>

      {/* Client-side cart clearing */}
      <ClearCartOnSuccess />
    </div>
  );
}
