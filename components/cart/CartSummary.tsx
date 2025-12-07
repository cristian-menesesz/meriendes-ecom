'use client';

import Link from 'next/link';
import { Button } from '@/components/ui';
import { formatCurrency } from '@/lib/utils/currency';

export interface CartSummaryProps {
  subtotal: number;
  totalItems: number;
  variant?: 'sidebar' | 'page';
}

/**
 * Cart order summary component displaying totals and checkout CTA.
 * Supports both sidebar and full page display variants.
 *
 * Features:
 * - Subtotal display
 * - Item count
 * - Checkout button (links to checkout page)
 * - Continue shopping link (page variant only)
 * - Future: Shipping estimate, tax calculation, discount codes
 *
 * @param {CartSummaryProps} props - Cart totals and display variant.
 */
export function CartSummary({ subtotal, totalItems, variant = 'page' }: CartSummaryProps) {
  const isSidebar = variant === 'sidebar';

  return (
    <div
      className={`${
        isSidebar
          ? 'border-t border-gray-200 pt-4'
          : 'rounded-lg border border-gray-200 bg-gray-50 p-6'
      }`}
    >
      {/* Header - Page view only */}
      {!isSidebar && <h2 className="mb-4 text-lg font-semibold text-gray-900">Order Summary</h2>}

      {/* Summary Details */}
      <div className="space-y-3">
        {/* Item Count */}
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Items ({totalItems})</span>
          <span className="font-medium text-gray-900">{formatCurrency(subtotal)}</span>
        </div>

        {/* Subtotal */}
        <div className="flex justify-between border-t border-gray-200 pt-3 text-base font-semibold">
          <span className="text-gray-900">Subtotal</span>
          <span className="text-gray-900">{formatCurrency(subtotal)}</span>
        </div>

        {/* Shipping Note - Page view only */}
        {!isSidebar && (
          <p className="pt-2 text-xs text-gray-500">Shipping and taxes calculated at checkout</p>
        )}
      </div>

      {/* Action Buttons */}
      <div className={`${isSidebar ? 'mt-4 space-y-2' : 'mt-6 space-y-3'}`}>
        {/* Checkout Button */}
        <Link href="/checkout" className="block">
          <Button size={isSidebar ? 'default' : 'lg'} className="w-full">
            {isSidebar ? 'Checkout' : 'Proceed to Checkout'}
          </Button>
        </Link>

        {/* Continue Shopping - Sidebar view */}
        {isSidebar && (
          <Link href="/products" className="block">
            <Button variant="outline" size="default" className="w-full">
              Continue Shopping
            </Button>
          </Link>
        )}

        {/* View Full Cart - Sidebar view */}
        {isSidebar && (
          <Link
            href="/cart"
            className="block text-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
          >
            View Full Cart
          </Link>
        )}
      </div>

      {/* Continue Shopping - Page view */}
      {!isSidebar && (
        <div className="mt-6 text-center">
          <Link
            href="/products"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
          >
            Continue Shopping →
          </Link>
        </div>
      )}

      {/* Security Badge */}
      <div
        className={`${isSidebar ? 'mt-4' : 'mt-6'} flex items-center justify-center gap-2 text-xs text-gray-500`}
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
        <span>Secure checkout</span>
      </div>
    </div>
  );
}
