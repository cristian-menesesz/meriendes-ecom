import { z } from 'zod';

/**
 * Zod validation schemas for the application.
 * These schemas provide runtime validation and type inference.
 *
 * Docs: https://zod.dev
 */

export const productSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, 'Product name is required').max(200),
  description: z.string().nullable(),
  price: z.number().positive('Price must be positive'),
  stripePriceId: z.string().min(1, 'Stripe Price ID is required'),
  stripeProductId: z.string().min(1, 'Stripe Product ID is required'),
  inventoryCount: z.number().int().nonnegative('Inventory cannot be negative'),
  imageUrl: z.string().url().nullable(),
  isActive: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const cartItemSchema = z.object({
  product: productSchema,
  quantity: z.number().int().positive('Quantity must be at least 1'),
});

export const checkoutFormSchema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  address: z.object({
    line1: z.string().min(5, 'Address is required'),
    line2: z.string().optional(),
    city: z.string().min(2, 'City is required'),
    state: z.string().min(2, 'State is required'),
    postalCode: z.string().min(5, 'Postal code is required'),
    country: z.string().length(2, 'Country code must be 2 characters'),
  }),
});

export const orderSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid().nullable(),
  total: z.number().positive(),
  status: z.enum(['pending', 'processing', 'completed', 'cancelled', 'refunded']),
  stripePaymentIntentId: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const createPaymentIntentSchema = z.object({
  items: z.array(cartItemSchema).min(1, 'Cart cannot be empty'),
});

// Type exports for use throughout the application
export type ProductInput = z.infer<typeof productSchema>;
export type CartItemInput = z.infer<typeof cartItemSchema>;
export type CheckoutFormInput = z.infer<typeof checkoutFormSchema>;
export type OrderInput = z.infer<typeof orderSchema>;
export type CreatePaymentIntentInput = z.infer<typeof createPaymentIntentSchema>;
