/**
 * Core type definitions for the ecommerce application.
 * These types represent the main entities in our system and their relationships.
 * All types match the exact database schema in database-schema.sql
 */

/**
 * Customer entity for authentication and user management.
 * Corresponds to the 'customers' table in Supabase.
 */
export interface Customer {
  id: string;
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  emailVerified: boolean;
  emailNotifications: boolean;
  marketingOptIn: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt: string | null;
  isActive: boolean;
}

/**
 * Customer address for delivery.
 * Corresponds to the 'customer_addresses' table in Supabase.
 */
export interface CustomerAddress {
  id: string;
  customerId: string;
  addressLabel: string | null;
  streetAddress1: string;
  streetAddress2: string | null;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
  deliveryInstructions: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Product category for organizing products.
 * Corresponds to the 'product_categories' table in Supabase.
 */
export interface ProductCategory {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
}

/**
 * Product entity representing an item available for purchase.
 * Corresponds to the 'products' table in Supabase.
 */
export interface Product {
  id: string;
  categoryId: number | null;
  name: string;
  slug: string;
  description: string | null;
  shortDescription: string | null;
  imageUrl: string | null;
  /** Indicates if the product is active and available for purchase. */
  isActive: boolean;
  isSeasonal: boolean;
  isFeatured: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Product variant representing different options (e.g., sizes).
 * Corresponds to the 'product_variants' table in Supabase.
 */
export interface ProductVariant {
  id: string;
  productId: string;
  sku: string;
  variantName: string;
  /** Price in dollars (not cents). Displayed to users as-is. */
  price: number;
  compareAtPrice: number | null;
  cost: number | null;
  weightGrams: number | null;
  isActive: boolean;
  displayOrder: number;
  /** The corresponding Price ID in Stripe for payment processing. */
  stripePriceId: string | null;
  /** The corresponding Product ID in Stripe. Multiple variants share the same Stripe Product. */
  stripeProductId: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Tag entity for product categorization and filtering.
 * Corresponds to the 'tags' table in Supabase.
 */
export interface Tag {
  id: number;
  name: string;
  slug: string;
  tagType: TagType;
  description: string | null;
  isActive: boolean;
  createdAt: string;
}

/**
 * Tag types for organizing product tags.
 */
export type TagType = 'dietary' | 'ingredient' | 'cuisine' | 'meal_type' | 'allergen' | 'feature';

/**
 * Junction table linking products to tags.
 * Corresponds to the 'product_tags' table in Supabase.
 */
export interface ProductTag {
  productId: string;
  tagId: number;
  createdAt: string;
}

/**
 * Comprehensive nutrition information for product variants.
 * Corresponds to the 'nutrition_info' table in Supabase.
 */
export interface NutritionInfo {
  id: string;
  variantId: string;

  // Serving information
  servingSize: string | null;
  servingSizeGrams: number | null;
  servingsPerContainer: number | null;

  // Core macronutrients (required)
  calories: number;
  proteinGrams: number;
  carbohydratesGrams: number;
  fatGrams: number;

  // Detailed fats
  saturatedFatGrams: number | null;
  transFatGrams: number | null;
  polyunsaturatedFatGrams: number | null;
  monounsaturatedFatGrams: number | null;

  // Detailed carbohydrates
  dietaryFiberGrams: number | null;
  sugarsGrams: number | null;
  addedSugarsGrams: number | null;
  sugarAlcoholsGrams: number | null;

  // Minerals & Electrolytes
  sodiumMg: number | null;
  potassiumMg: number | null;
  cholesterolMg: number | null;
  calciumMg: number | null;
  ironMg: number | null;
  magnesiumMg: number | null;
  zincMg: number | null;

  // Vitamins
  vitaminAMcg: number | null;
  vitaminCMg: number | null;
  vitaminDMcg: number | null;
  vitaminEMg: number | null;
  vitaminKMcg: number | null;
  vitaminB6Mg: number | null;
  vitaminB12Mcg: number | null;
  folateMcg: number | null;

  // Additional health metrics
  glycemicIndex: number | null;
  glycemicLoad: number | null;
  omega3Grams: number | null;
  omega6Grams: number | null;

  // Allergen flags
  containsGluten: boolean;
  containsDairy: boolean;
  containsEggs: boolean;
  containsFish: boolean;
  containsShellfish: boolean;
  containsTreeNuts: boolean;
  containsPeanuts: boolean;
  containsSoy: boolean;
  containsWheat: boolean;
  containsSesame: boolean;

  // Ingredients & certifications
  ingredientsList: string | null;
  allergenWarnings: string | null;
  isOrganic: boolean;
  isNonGmo: boolean;
  isGlutenFree: boolean;
  isDairyFree: boolean;
  isVegan: boolean;
  isVegetarian: boolean;
  isKosher: boolean;
  isHalal: boolean;

  // Metadata
  nutritionDataSource: string | null;
  lastVerifiedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Inventory tracking for product variants.
 * Corresponds to the 'inventory' table in Supabase.
 */
export interface Inventory {
  id: string;
  variantId: string;
  quantityAvailable: number;
  quantityReserved: number;
  lowStockThreshold: number;
  updatedAt: string;
}

/**
 * Inventory movement tracking for audit.
 * Corresponds to the 'inventory_movements' table in Supabase.
 */
export interface InventoryMovement {
  id: string;
  variantId: string;
  movementType: 'restock' | 'sale' | 'reservation' | 'release' | 'adjustment';
  quantity: number;
  referenceType: string | null;
  referenceId: string | null;
  notes: string | null;
  createdAt: string;
  createdBy: string | null;
}

/**
 * Promotional code for discounts.
 * Corresponds to the 'promo_codes' table in Supabase.
 */
export interface PromoCode {
  id: string;
  code: string;
  description: string | null;
  discountType: 'percentage' | 'fixed_amount';
  discountValue: number;
  minimumOrderAmount: number;
  maxUses: number | null;
  timesUsed: number;
  validFrom: string;
  validUntil: string;
  isActive: boolean;
  createdAt: string;
}

/**
 * Bundle of products at a discounted price.
 * Corresponds to the 'bundles' table in Supabase.
 */
export interface Bundle {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  price: number;
  savingsAmount: number | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Bundle composition - items in a bundle.
 * Corresponds to the 'bundle_items' table in Supabase.
 */
export interface BundleItem {
  id: string;
  bundleId: string;
  variantId: string;
  quantity: number;
  createdAt: string;
}

/**
 * Cart item representing a product added to the shopping cart.
 * Used in client-side state management.
 */
export interface CartItem {
  product: Product;
  variant: ProductVariant;
  quantity: number;
}

/**
 * Possible order statuses throughout the order lifecycle.
 */
export type OrderStatus =
  | 'draft'
  | 'awaiting_payment'
  | 'paid'
  | 'processing'
  | 'ready_for_delivery'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

/**
 * Payment status for payments.
 */
export type PaymentStatus = 'pending' | 'succeeded' | 'failed' | 'refunded';

/**
 * Order entity representing a customer purchase.
 * Corresponds to the 'orders' table in Supabase.
 */
export interface Order {
  id: string;
  orderNumber: string;
  customerId: string | null;
  status: OrderStatus;

  // Pricing
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  deliveryFee: number;
  total: number;

  // Promo code
  promoCodeId: string | null;

  // Delivery information (snapshot at order time)
  deliveryStreetAddress1: string;
  deliveryStreetAddress2: string | null;
  deliveryCity: string;
  deliveryState: string;
  deliveryZipCode: string;
  deliveryCountry: string;
  deliveryInstructions: string | null;

  // Contact information (required for all orders, especially guest checkout)
  customerEmail: string;
  customerPhone: string | null;
  customerFirstName: string;
  customerLastName: string;

  // Payment
  paymentStatus: string | null;
  paymentMethod: string | null;

  // Timestamps
  createdAt: string;
  updatedAt: string;
  paidAt: string | null;
  processingAt: string | null;
  readyAt: string | null;
  outForDeliveryAt: string | null;
  deliveredAt: string | null;
  cancelledAt: string | null;

  // Metadata
  customerNotes: string | null;
  internalNotes: string | null;
  cancellationReason: string | null;
}

/**
 * Order item representing a product or bundle within an order.
 * Corresponds to the 'order_items' table in Supabase.
 */
export interface OrderItem {
  id: string;
  orderId: string;
  itemType: 'product' | 'bundle';
  variantId: string | null;
  bundleId: string | null;
  productName: string;
  variantName: string | null;
  sku: string | null;
  quantity: number;
  /** Price at the time of purchase, in dollars. */
  unitPrice: number;
  lineTotal: number;
  createdAt: string;
}

/**
 * Cart entity for registered users (optional server-side storage).
 * Corresponds to the 'carts' table in Supabase.
 */
export interface Cart {
  id: string;
  customerId: string;
  expiresAt: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Cart item in server-side cart storage.
 * Corresponds to the 'cart_items' table in Supabase.
 */
export interface ServerCartItem {
  id: string;
  cartId: string;
  itemType: 'product' | 'bundle';
  variantId: string | null;
  bundleId: string | null;
  quantity: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Payment processing record.
 * Corresponds to the 'payments' table in Supabase.
 */
export interface Payment {
  id: string;
  orderId: string;

  // Stripe integration
  stripePaymentIntentId: string | null;
  stripePaymentMethodId: string | null;
  stripeCustomerId: string | null;

  // Payment details
  amount: number;
  currency: string;
  status: PaymentStatus;
  paymentMethodType: string | null;

  // Card details (last 4 digits only)
  cardBrand: string | null;
  cardLast4: string | null;

  // Timestamps
  createdAt: string;
  succeededAt: string | null;
  failedAt: string | null;

  // Error handling
  failureCode: string | null;
  failureMessage: string | null;

  // Metadata
  metadata: Record<string, any> | null;
}

/**
 * Refund record for payments.
 * Corresponds to the 'refunds' table in Supabase.
 */
export interface Refund {
  id: string;
  paymentId: string;
  orderId: string;
  stripeRefundId: string | null;
  amount: number;
  reason: string | null;
  notes: string | null;
  status: string;
  createdAt: string;
  processedAt: string | null;
  createdBy: string | null;
}

/**
 * Inventory reservation during checkout.
 * Corresponds to the 'inventory_reservations' table in Supabase.
 */
export interface InventoryReservation {
  id: string;
  variantId: string;
  orderId: string;
  quantity: number;
  expiresAt: string;
  releasedAt: string | null;
  createdAt: string;
}

/**
 * Email notification record.
 * Corresponds to the 'email_notifications' table in Supabase.
 */
export interface EmailNotification {
  id: string;
  customerId: string | null;
  orderId: string | null;
  recipientEmail: string;
  templateName: string;
  subject: string;
  status: 'pending' | 'sent' | 'failed';
  externalId: string | null;
  createdAt: string;
  sentAt: string | null;
  failedAt: string | null;
  errorMessage: string | null;
  retryCount: number;
}

/**
 * Audit log for compliance.
 * Corresponds to the 'audit_log' table in Supabase.
 */
export interface AuditLog {
  id: string;
  tableName: string;
  recordId: string;
  action: 'INSERT' | 'UPDATE' | 'DELETE';
  oldValues: Record<string, any> | null;
  newValues: Record<string, any> | null;
  changedBy: string | null;
  changedAt: string;
  ipAddress: string | null;
}

/**
 * Stripe Payment Intent metadata for tracking in our system.
 */
export interface PaymentIntentMetadata {
  orderId: string;
  customerId?: string;
}

/**
 * Database tables type map for type-safe Supabase queries.
 */
export interface Database {
  public: {
    Tables: {
      customers: {
        Row: Customer;
        Insert: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>;
        Update: Partial<Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>>;
      };
      customer_addresses: {
        Row: CustomerAddress;
        Insert: Omit<CustomerAddress, 'id' | 'createdAt' | 'updatedAt'>;
        Update: Partial<Omit<CustomerAddress, 'id' | 'createdAt' | 'updatedAt'>>;
      };
      product_categories: {
        Row: ProductCategory;
        Insert: Omit<ProductCategory, 'id' | 'createdAt'>;
        Update: Partial<Omit<ProductCategory, 'id' | 'createdAt'>>;
      };
      products: {
        Row: Product;
        Insert: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>;
        Update: Partial<Omit<Product, 'id' | 'createdAt' | 'updatedAt'>>;
      };
      product_variants: {
        Row: ProductVariant;
        Insert: Omit<ProductVariant, 'id' | 'createdAt' | 'updatedAt'>;
        Update: Partial<Omit<ProductVariant, 'id' | 'createdAt' | 'updatedAt'>>;
      };
      tags: {
        Row: Tag;
        Insert: Omit<Tag, 'id' | 'createdAt'>;
        Update: Partial<Omit<Tag, 'id' | 'createdAt'>>;
      };
      product_tags: {
        Row: ProductTag;
        Insert: ProductTag;
        Update: never;
      };
      nutrition_info: {
        Row: NutritionInfo;
        Insert: Omit<NutritionInfo, 'id' | 'createdAt' | 'updatedAt'>;
        Update: Partial<Omit<NutritionInfo, 'id' | 'createdAt' | 'updatedAt'>>;
      };
      inventory: {
        Row: Inventory;
        Insert: Omit<Inventory, 'id' | 'updatedAt'>;
        Update: Partial<Omit<Inventory, 'id'>>;
      };
      inventory_movements: {
        Row: InventoryMovement;
        Insert: Omit<InventoryMovement, 'id' | 'createdAt'>;
        Update: never;
      };
      promo_codes: {
        Row: PromoCode;
        Insert: Omit<PromoCode, 'id' | 'createdAt'>;
        Update: Partial<Omit<PromoCode, 'id' | 'createdAt'>>;
      };
      bundles: {
        Row: Bundle;
        Insert: Omit<Bundle, 'id' | 'createdAt' | 'updatedAt'>;
        Update: Partial<Omit<Bundle, 'id' | 'createdAt' | 'updatedAt'>>;
      };
      bundle_items: {
        Row: BundleItem;
        Insert: Omit<BundleItem, 'id' | 'createdAt'>;
        Update: never;
      };
      orders: {
        Row: Order;
        Insert: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>;
        Update: Partial<Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>>;
      };
      order_items: {
        Row: OrderItem;
        Insert: Omit<OrderItem, 'id' | 'createdAt'>;
        Update: Partial<Omit<OrderItem, 'id' | 'createdAt'>>;
      };
      carts: {
        Row: Cart;
        Insert: Omit<Cart, 'id' | 'createdAt' | 'updatedAt'>;
        Update: Partial<Omit<Cart, 'id' | 'createdAt' | 'updatedAt'>>;
      };
      cart_items: {
        Row: ServerCartItem;
        Insert: Omit<ServerCartItem, 'id' | 'createdAt' | 'updatedAt'>;
        Update: Partial<Omit<ServerCartItem, 'id' | 'createdAt' | 'updatedAt'>>;
      };
      payments: {
        Row: Payment;
        Insert: Omit<Payment, 'id' | 'createdAt'>;
        Update: Partial<Omit<Payment, 'id' | 'createdAt'>>;
      };
      refunds: {
        Row: Refund;
        Insert: Omit<Refund, 'id' | 'createdAt'>;
        Update: Partial<Omit<Refund, 'id' | 'createdAt'>>;
      };
      inventory_reservations: {
        Row: InventoryReservation;
        Insert: Omit<InventoryReservation, 'id' | 'createdAt'>;
        Update: Partial<Omit<InventoryReservation, 'id' | 'createdAt'>>;
      };
      email_notifications: {
        Row: EmailNotification;
        Insert: Omit<EmailNotification, 'id' | 'createdAt'>;
        Update: Partial<Omit<EmailNotification, 'id' | 'createdAt'>>;
      };
      audit_log: {
        Row: AuditLog;
        Insert: Omit<AuditLog, 'id' | 'changedAt'>;
        Update: never;
      };
    };
  };
}
