'use client';

import Link from 'next/link';
import { useCartStore } from '@/store/cartStore';
import { CartItem, CartSummary, EmptyCart } from '@/components/cart';

/**
 * Full cart page with comprehensive cart management.
 * Server-rendered page with client-side interactivity.
 *
 * Features:
 * - Detailed cart item display
 * - Quantity management
 * - Remove items
 * - Order summary with totals
 * - Empty state with CTA
 * - Breadcrumb navigation
 * - Responsive layout (two-column desktop, single-column mobile)
 *
 * Route: /cart
 */
export default function CartPage() {
  const items = useCartStore((state) => state.items);
  const incrementQuantity = useCartStore((state) => state.incrementQuantity);
  const decrementQuantity = useCartStore((state) => state.decrementQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const clearCart = useCartStore((state) => state.clearCart);
  const getTotalItems = useCartStore((state) => state.getTotalItems);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);

  const totalItems = getTotalItems();
  const subtotal = getTotalPrice();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb Navigation */}
      <nav className="mb-8 flex items-center space-x-2 text-sm text-gray-600">
        <Link href="/" className="hover:text-gray-900">
          Home
        </Link>
        <span>/</span>
        <span className="text-gray-900">Shopping Cart</span>
      </nav>

      {/* Page Title */}
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
        {items.length > 0 && (
          <button
            type="button"
            onClick={clearCart}
            className="text-sm font-medium text-red-600 hover:text-red-500"
          >
            Clear Cart
          </button>
        )}
      </div>

      {/* Empty State */}
      {items.length === 0 ? (
        <EmptyCart variant="page" />
      ) : (
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Cart Items - Left Column (2/3 width) */}
          <div className="lg:col-span-2">
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              {/* Header */}
              <div className="mb-4 flex items-center justify-between border-b border-gray-200 pb-4">
                <h2 className="text-lg font-semibold text-gray-900">Cart Items ({totalItems})</h2>
              </div>

              {/* Cart Items List */}
              <div className="divide-y divide-gray-200">
                {items.map((item) => (
                  <CartItem
                    key={item.variant.id}
                    item={item}
                    onIncrement={() => incrementQuantity(item.variant.id)}
                    onDecrement={() => decrementQuantity(item.variant.id)}
                    onRemove={() => removeItem(item.variant.id)}
                    variant="page"
                  />
                ))}
              </div>
            </div>

            {/* Continue Shopping Link */}
            <div className="mt-6">
              <Link
                href="/products"
                className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
              >
                <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Continue Shopping
              </Link>
            </div>
          </div>

          {/* Order Summary - Right Column (1/3 width) */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <CartSummary subtotal={subtotal} totalItems={totalItems} variant="page" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
