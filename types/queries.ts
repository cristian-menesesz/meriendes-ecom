/**
 * Type definitions for Supabase queries with relations.
 * These types help TypeScript understand the shape of joined/nested query results.
 */

import type { Order, OrderItem, ProductVariant, Product, Inventory } from './index';

/**
 * Order with nested order_items and product details for success page display.
 */
export type OrderWithItems = Order & {
  order_items: Array<
    OrderItem & {
      product_variants: ProductVariant & {
        products: Product;
      };
    }
  >;
};

/**
 * Product variant with nested inventory for availability checking.
 */
export type VariantWithInventory = ProductVariant & {
  inventory: Inventory[];
};

/**
 * Product variant with product details for cart display.
 */
export type VariantWithProduct = ProductVariant & {
  products: Product;
};
