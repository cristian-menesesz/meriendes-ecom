/**
 * Core type definitions for the ecommerce application.
 * These types represent the main entities in our system and their relationships.
 */

/**
 * Product entity representing an item available for purchase.
 * Corresponds to the 'products' table in Supabase.
 */
export interface Product {
  id: string;
  name: string;
  description: string | null;
  /** Price in dollars (not cents). Displayed to users as-is. */
  price: number;
  /** The corresponding Price ID in Stripe for payment processing. */
  stripePriceId: string;
  /** The corresponding Product ID in Stripe. */
  stripeProductId: string;
  /** Available inventory count. */
  inventoryCount: number;
  imageUrl: string | null;
  /** Indicates if the product is active and available for purchase. */
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Cart item representing a product added to the shopping cart.
 * Used in client-side state management.
 */
export interface CartItem {
  product: Product;
  quantity: number;
}

/**
 * Order entity representing a completed purchase.
 * Corresponds to the 'orders' table in Supabase.
 */
export interface Order {
  id: string;
  userId: string | null;
  /** Total amount in dollars. */
  total: number;
  status: OrderStatus;
  stripePaymentIntentId: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Order item representing a product within an order.
 * Corresponds to the 'order_items' table in Supabase.
 */
export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  /** Price at the time of purchase, in dollars. */
  priceAtPurchase: number;
  createdAt: string;
}

/**
 * Possible order statuses throughout the order lifecycle.
 */
export type OrderStatus =
  | "pending"
  | "processing"
  | "completed"
  | "cancelled"
  | "refunded";

/**
 * User profile information.
 * Corresponds to the 'profiles' table in Supabase.
 */
export interface UserProfile {
  id: string;
  email: string;
  fullName: string | null;
  avatarUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Stripe Payment Intent metadata for tracking in our system.
 */
export interface PaymentIntentMetadata {
  orderId: string;
  userId?: string;
}

/**
 * Database tables type map for type-safe Supabase queries.
 */
export interface Database {
  public: {
    Tables: {
      products: {
        Row: Product;
        Insert: Omit<Product, "id" | "createdAt" | "updatedAt">;
        Update: Partial<Omit<Product, "id" | "createdAt" | "updatedAt">>;
      };
      orders: {
        Row: Order;
        Insert: Omit<Order, "id" | "createdAt" | "updatedAt">;
        Update: Partial<Omit<Order, "id" | "createdAt" | "updatedAt">>;
      };
      order_items: {
        Row: OrderItem;
        Insert: Omit<OrderItem, "id" | "createdAt">;
        Update: Partial<Omit<OrderItem, "id" | "createdAt">>;
      };
      profiles: {
        Row: UserProfile;
        Insert: Omit<UserProfile, "createdAt" | "updatedAt">;
        Update: Partial<Omit<UserProfile, "id" | "createdAt" | "updatedAt">>;
      };
    };
  };
}
