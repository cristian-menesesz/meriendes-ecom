'use client';

import { useEffect, useLayoutEffect, useState } from 'react';
import { useCartStore } from '@/store/cartStore';

// Use useLayoutEffect on client, useEffect on server
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

/**
 * Cart button component for header navigation.
 * Displays shopping cart icon with item count badge.
 * Opens cart sidebar on click.
 *
 * Features:
 * - Badge shows total item count
 * - Badge hidden when cart is empty
 * - Animated badge appearance
 * - Accessible (ARIA label)
 * - Click opens CartSidebar
 * - Hydration-safe (prevents SSR mismatch)
 */
export function CartButton() {
  const openSidebar = useCartStore((state) => state.openSidebar);
  const getTotalItems = useCartStore((state) => state.getTotalItems);

  // Prevent hydration mismatch by only showing count after mount
  const [mounted, setMounted] = useState(false);
  const [totalItems, setTotalItems] = useState(0);

  // Use layout effect to synchronously update before paint
  useIsomorphicLayoutEffect(() => {
    setMounted(true);
    setTotalItems(getTotalItems());
  }, [getTotalItems]);

  useEffect(() => {
    // Subscribe to store changes
    const unsubscribe = useCartStore.subscribe((state) => {
      setTotalItems(state.items.reduce((total, item) => total + item.quantity, 0));
    });

    return unsubscribe;
  }, []);

  return (
    <button
      type="button"
      onClick={openSidebar}
      className="relative p-2 text-gray-700 transition-colors hover:text-gray-900"
      aria-label={`Shopping cart with ${totalItems} items`}
    >
      {/* Shopping Cart Icon */}
      <svg
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
        />
      </svg>

      {/* Badge - Item Count */}
      {mounted && totalItems > 0 && (
        <span className="absolute top-0 right-0 inline-flex h-5 w-5 translate-x-1/2 -translate-y-1/2 transform items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
          {totalItems > 99 ? '99+' : totalItems}
        </span>
      )}
    </button>
  );
}
