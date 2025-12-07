import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, Product, ProductVariant } from '@/types';

interface CartStore {
  items: CartItem[];
  isSidebarOpen: boolean;

  // Cart operations
  addItem: (product: Product, variant: ProductVariant, quantity?: number) => void;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  incrementQuantity: (variantId: string) => void;
  decrementQuantity: (variantId: string) => void;
  clearCart: () => void;

  // Getters
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getItemByVariantId: (variantId: string) => CartItem | undefined;

  // Sidebar UI state
  openSidebar: () => void;
  closeSidebar: () => void;
  toggleSidebar: () => void;
}

/**
 * Cart state management using Zustand with localStorage persistence.
 * Manages shopping cart items, quantities, and calculations.
 *
 * Docs: https://github.com/pmndrs/zustand
 */
export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isSidebarOpen: false,

      addItem: (product, variant, quantity = 1) => {
        set((state) => {
          const existingItem = state.items.find((item) => item.variant.id === variant.id);

          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.variant.id === variant.id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            };
          }

          return {
            items: [...state.items, { product, variant, quantity }],
          };
        });
      },

      removeItem: (variantId) => {
        set((state) => ({
          items: state.items.filter((item) => item.variant.id !== variantId),
        }));
      },

      updateQuantity: (variantId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(variantId);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.variant.id === variantId ? { ...item, quantity } : item
          ),
        }));
      },

      incrementQuantity: (variantId) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.variant.id === variantId ? { ...item, quantity: item.quantity + 1 } : item
          ),
        }));
      },

      decrementQuantity: (variantId) => {
        const item = get().items.find((item) => item.variant.id === variantId);
        if (!item) return;

        if (item.quantity <= 1) {
          get().removeItem(variantId);
        } else {
          set((state) => ({
            items: state.items.map((item) =>
              item.variant.id === variantId ? { ...item, quantity: item.quantity - 1 } : item
            ),
          }));
        }
      },

      clearCart: () => {
        set({ items: [] });
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce((total, item) => {
          return total + item.variant.price * item.quantity;
        }, 0);
      },

      getItemByVariantId: (variantId) => {
        return get().items.find((item) => item.variant.id === variantId);
      },

      openSidebar: () => {
        set({ isSidebarOpen: true });
      },

      closeSidebar: () => {
        set({ isSidebarOpen: false });
      },

      toggleSidebar: () => {
        set((state) => ({ isSidebarOpen: !state.isSidebarOpen }));
      },
    }),
    {
      name: 'meriendes-cart',
      // Only persist cart items, not UI state
      partialize: (state) => ({ items: state.items }),
    }
  )
);
