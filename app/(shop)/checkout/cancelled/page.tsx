import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Payment Cancelled',
  robots: 'noindex',
};

/**
 * Cancellation page displayed when user cancels Stripe Checkout.
 * Cart remains intact so user can return to checkout if desired.
 *
 * Note: Inventory reservations will auto-expire after 30 minutes.
 */
export default function CheckoutCancelledPage() {
  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <div className="mb-8 text-center">
        {/* Cancel Icon */}
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100">
          <svg
            className="h-8 w-8 text-yellow-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        <h1 className="mb-2 text-3xl font-bold text-gray-900">Payment Cancelled</h1>
        <p className="mb-8 text-gray-600">
          Your payment was not processed. Your cart items are still saved.
        </p>
      </div>

      {/* Information Card */}
      <div className="mb-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">What happened?</h2>
        <p className="mb-4 text-gray-700">
          You cancelled the payment process before it was completed. This could happen if:
        </p>
        <ul className="mb-6 list-inside list-disc space-y-2 text-gray-700">
          <li>You clicked the back button or closed the payment window</li>
          <li>The payment session timed out</li>
          <li>There was an issue with your payment method</li>
        </ul>

        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
          <div className="flex gap-3">
            <svg
              className="mt-0.5 h-5 w-5 shrink-0 text-blue-600"
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <h3 className="mb-1 font-semibold text-gray-900">Your cart is safe</h3>
              <p className="text-sm text-gray-700">
                All items remain in your cart. You can return to checkout whenever you&apos;re
                ready. Any inventory reservations will be automatically released after 30 minutes.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <Link
          href="/checkout"
          className="block w-full rounded-lg bg-gray-900 px-6 py-3 text-center font-semibold text-white transition-colors hover:bg-gray-800"
        >
          Return to Checkout
        </Link>
        <Link
          href="/products"
          className="block w-full rounded-lg border border-gray-300 px-6 py-3 text-center font-semibold text-gray-700 transition-colors hover:bg-gray-50"
        >
          Continue Shopping
        </Link>
      </div>

      {/* Help Section */}
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-600">
          Need help?{' '}
          <a href="mailto:support@meriendes.com" className="text-blue-600 hover:underline">
            Contact our support team
          </a>
        </p>
      </div>
    </div>
  );
}
