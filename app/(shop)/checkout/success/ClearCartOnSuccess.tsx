'use client';

import { useEffect } from 'react';
import { useCartStore } from '@/store/cartStore';

/**
 * Client Component to clear cart after successful order.
 * Runs immediately on mount to ensure cart is empty after purchase.
 * Also closes the cart sidebar if it was open.
 */
export function ClearCartOnSuccess() {
  const clearCart = useCartStore((state) => state.clearCart);
  const closeSidebar = useCartStore((state) => state.closeSidebar);

  useEffect(() => {
    // Clear cart immediately on successful order
    clearCart();
    // Also close sidebar if it was open
    closeSidebar();
  }, [clearCart, closeSidebar]);

  return null;
}
