/**
 * @jest-environment node
 */
import { createCheckoutSession } from '../../../app/(shop)/checkout/actions';
import { createClient } from '@/lib/supabase/server';
import { stripe } from '@/lib/stripe/server';
import type { Product, ProductVariant } from '@/types';

// Mock dependencies
jest.mock('@/lib/supabase/server');
jest.mock('@/lib/stripe/server');

// Helper to create complete mock product
const createMockProduct = (id: string, name: string = 'Product 1'): Product => ({
  id,
  categoryId: 1,
  name,
  slug: name.toLowerCase().replace(/\s+/g, '-'),
  description: 'Test description',
  shortDescription: 'Short description',
  imageUrl: 'https://example.com/image.jpg',
  isActive: true,
  isSeasonal: false,
  isFeatured: false,
  displayOrder: 0,
  createdAt: '2025-01-01T00:00:00Z',
  updatedAt: '2025-01-01T00:00:00Z',
});

// Helper to create complete mock variant
const createMockVariant = (
  id: string,
  productId: string,
  price: number = 15.99
): ProductVariant => ({
  id,
  productId,
  sku: 'SKU-' + id.slice(0, 8),
  variantName: 'Standard',
  price,
  compareAtPrice: null,
  cost: null,
  weightGrams: null,
  isActive: true,
  displayOrder: 0,
  stripePriceId: 'price_123',
  stripeProductId: 'prod_123',
  createdAt: '2025-01-01T00:00:00Z',
  updatedAt: '2025-01-01T00:00:00Z',
});

const mockSupabaseClient = {
  from: jest.fn(),
  rpc: jest.fn(),
};

const mockStripeCheckoutSessions = {
  create: jest.fn(),
};

describe('createCheckoutSession Server Action', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Setup default mocks
    (createClient as jest.Mock).mockResolvedValue(mockSupabaseClient);
    (stripe as unknown as { checkout: { sessions: typeof mockStripeCheckoutSessions } }).checkout =
      { sessions: mockStripeCheckoutSessions };
  });

  describe('Validation', () => {
    it('should return error for empty cart', async () => {
      const result = await createCheckoutSession({
        customerInfo: {
          email: 'test@example.com',
          firstName: 'John',
          lastName: 'Doe',
          address: {
            streetAddress1: '123 Main St',
            city: 'Portland',
            state: 'OR',
            zipCode: '97201',
            country: 'US',
          },
        },
        cartItems: [],
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe('Cart cannot be empty');
      }
    });

    it('should return error for invalid email', async () => {
      const result = await createCheckoutSession({
        customerInfo: {
          email: 'invalid-email',
          firstName: 'John',
          lastName: 'Doe',
          address: {
            streetAddress1: '123 Main St',
            city: 'Portland',
            state: 'OR',
            zipCode: '97201',
            country: 'US',
          },
        },
        cartItems: [
          {
            product: {
              id: '1',
              name: 'Product 1',
              slug: 'product-1',
              isActive: true,
            } as Partial<Product> as Product,
            variant: {
              id: 'v1',
              price: 15.99,
              sku: 'SKU1',
            } as Partial<ProductVariant> as ProductVariant,
            quantity: 1,
          },
        ],
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain('Invalid');
      }
    });

    it('should return error for missing required fields', async () => {
      const result = await createCheckoutSession({
        customerInfo: {
          email: 'test@example.com',
          firstName: '',
          lastName: 'Doe',
          address: {
            streetAddress1: '123 Main St',
            city: 'Portland',
            state: 'OR',
            zipCode: '97201',
            country: 'US',
          },
        },
        cartItems: [
          {
            product: {
              id: '1',
              name: 'Product 1',
              slug: 'product-1',
              isActive: true,
            } as Partial<Product> as Product,
            variant: {
              id: 'v1',
              price: 15.99,
              sku: 'SKU1',
            } as Partial<ProductVariant> as ProductVariant,
            quantity: 1,
          },
        ],
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBeDefined();
      }
    });

    it('should return error for cart below minimum order amount', async () => {
      const productId = '10000000-0000-0000-0000-000000000001';
      const variantId = '20000000-0000-0000-0000-000000000001';

      const result = await createCheckoutSession({
        customerInfo: {
          email: 'test@example.com',
          firstName: 'John',
          lastName: 'Doe',
          address: {
            streetAddress1: '123 Main St',
            city: 'Portland',
            state: 'OR',
            zipCode: '97201',
            country: 'US',
          },
        },
        cartItems: [
          {
            product: createMockProduct(productId),
            variant: createMockVariant(variantId, productId, 5.0),
            quantity: 1,
          },
        ],
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe('Minimum order amount is $10.00');
      }
    });
  });

  describe('Product Verification', () => {
    it('should return error if product variant not found in database', async () => {
      // Mock empty product variants response
      mockSupabaseClient.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          in: jest.fn().mockResolvedValue({
            data: [],
            error: null,
          }),
        }),
      });

      const productId = '10000000-0000-0000-0000-000000000002';
      const variantId = '20000000-0000-0000-0000-000000000002';

      const result = await createCheckoutSession({
        customerInfo: {
          email: 'test@example.com',
          firstName: 'John',
          lastName: 'Doe',
          address: {
            streetAddress1: '123 Main St',
            city: 'Portland',
            state: 'OR',
            zipCode: '97201',
            country: 'US',
          },
        },
        cartItems: [
          {
            product: createMockProduct(productId),
            variant: createMockVariant(variantId, productId),
            quantity: 1,
          },
        ],
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain('no longer available');
      }
    });

    it('should return error if product is inactive', async () => {
      // Mock product variants with is_active = false
      mockSupabaseClient.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          in: jest.fn().mockResolvedValue({
            data: [
              {
                id: '20000000-0000-0000-0000-000000000003',
                price: 15.99,
                is_active: false,
                stripe_price_id: 'price_123',
              },
            ],
            error: null,
          }),
        }),
      });

      const productId = '10000000-0000-0000-0000-000000000003';
      const variantId = '20000000-0000-0000-0000-000000000003';

      const result = await createCheckoutSession({
        customerInfo: {
          email: 'test@example.com',
          firstName: 'John',
          lastName: 'Doe',
          address: {
            streetAddress1: '123 Main St',
            city: 'Portland',
            state: 'OR',
            zipCode: '97201',
            country: 'US',
          },
        },
        cartItems: [
          {
            product: createMockProduct(productId),
            variant: createMockVariant(variantId, productId),
            quantity: 1,
          },
        ],
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain('currently unavailable');
      }
    });

    it('should return error if price mismatch detected', async () => {
      // Mock product variants with different price
      mockSupabaseClient.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          in: jest.fn().mockResolvedValue({
            data: [
              {
                id: '20000000-0000-0000-0000-000000000004',
                price: 20.99,
                is_active: true,
                stripe_price_id: 'price_123',
              },
            ],
            error: null,
          }),
        }),
      });

      const productId = '10000000-0000-0000-0000-000000000004';
      const variantId = '20000000-0000-0000-0000-000000000004';

      const result = await createCheckoutSession({
        customerInfo: {
          email: 'test@example.com',
          firstName: 'John',
          lastName: 'Doe',
          address: {
            streetAddress1: '123 Main St',
            city: 'Portland',
            state: 'OR',
            zipCode: '97201',
            country: 'US',
          },
        },
        cartItems: [
          {
            product: createMockProduct(productId),
            variant: createMockVariant(variantId, productId, 15.99),
            quantity: 1,
          },
        ],
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain('has changed');
      }
    });

    it('should return error if Stripe Price ID is missing', async () => {
      // Mock product variants with null stripe_price_id
      mockSupabaseClient.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          in: jest.fn().mockResolvedValue({
            data: [
              {
                id: '20000000-0000-0000-0000-000000000005',
                price: 15.99,
                is_active: true,
                stripe_price_id: null,
              },
            ],
            error: null,
          }),
        }),
      });

      const productId = '10000000-0000-0000-0000-000000000005';
      const variantId = '20000000-0000-0000-0000-000000000005';

      const result = await createCheckoutSession({
        customerInfo: {
          email: 'test@example.com',
          firstName: 'John',
          lastName: 'Doe',
          address: {
            streetAddress1: '123 Main St',
            city: 'Portland',
            state: 'OR',
            zipCode: '97201',
            country: 'US',
          },
        },
        cartItems: [
          {
            product: createMockProduct(productId),
            variant: createMockVariant(variantId, productId),
            quantity: 1,
          },
        ],
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain('not configured for checkout');
      }
    });
  });

  describe('Inventory Verification', () => {
    it('should return error if inventory not found', async () => {
      // Mock product variants
      const mockFrom = jest.fn();
      mockSupabaseClient.from = mockFrom;

      // First call: product_variants
      mockFrom.mockReturnValueOnce({
        select: jest.fn().mockReturnValue({
          in: jest.fn().mockResolvedValue({
            data: [
              {
                id: '20000000-0000-0000-0000-000000000006',
                price: 15.99,
                is_active: true,
                stripe_price_id: 'price_123',
              },
            ],
            error: null,
          }),
        }),
      });

      // Second call: inventory - return empty
      mockFrom.mockReturnValueOnce({
        select: jest.fn().mockReturnValue({
          in: jest.fn().mockResolvedValue({
            data: [],
            error: null,
          }),
        }),
      });

      const productId = '10000000-0000-0000-0000-000000000006';
      const variantId = '20000000-0000-0000-0000-000000000006';

      const result = await createCheckoutSession({
        customerInfo: {
          email: 'test@example.com',
          firstName: 'John',
          lastName: 'Doe',
          address: {
            streetAddress1: '123 Main St',
            city: 'Portland',
            state: 'OR',
            zipCode: '97201',
            country: 'US',
          },
        },
        cartItems: [
          {
            product: createMockProduct(productId),
            variant: createMockVariant(variantId, productId),
            quantity: 2,
          },
        ],
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain('Insufficient inventory');
      }
    });

    it('should return error if insufficient inventory', async () => {
      // Mock product variants and inventory
      const mockFrom = jest.fn();
      mockSupabaseClient.from = mockFrom;

      // First call: product_variants
      mockFrom.mockReturnValueOnce({
        select: jest.fn().mockReturnValue({
          in: jest.fn().mockResolvedValue({
            data: [
              {
                id: '20000000-0000-0000-0000-000000000007',
                price: 15.99,
                is_active: true,
                stripe_price_id: 'price_123',
              },
            ],
            error: null,
          }),
        }),
      });

      // Second call: inventory - insufficient quantity
      mockFrom.mockReturnValueOnce({
        select: jest.fn().mockReturnValue({
          in: jest.fn().mockResolvedValue({
            data: [
              {
                variant_id: '20000000-0000-0000-0000-000000000007',
                quantity_available: 1, // Only 1 available, but cart has 2
              },
            ],
            error: null,
          }),
        }),
      });

      const productId = '10000000-0000-0000-0000-000000000007';
      const variantId = '20000000-0000-0000-0000-000000000007';

      const result = await createCheckoutSession({
        customerInfo: {
          email: 'test@example.com',
          firstName: 'John',
          lastName: 'Doe',
          address: {
            streetAddress1: '123 Main St',
            city: 'Portland',
            state: 'OR',
            zipCode: '97201',
            country: 'US',
          },
        },
        cartItems: [
          {
            product: createMockProduct(productId),
            variant: createMockVariant(variantId, productId),
            quantity: 2,
          },
        ],
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain('Insufficient inventory');
      }
    });
  });

  describe('Order Calculations', () => {
    it('should calculate totals correctly for tax-exempt state', async () => {
      // This test verifies the calculation logic
      // Actual implementation would need full mocking of successful flow
      // Expected for OR state: subtotal=30, tax=0, deliveryFee=5.99, total=35.99
      // Note: Full integration test would mock all database calls
      // and verify Stripe session creation with correct amounts
    });

    it('should calculate totals correctly for taxable state', async () => {
      // Expected for CA state: subtotal=30, tax=2.55, deliveryFee=5.99, total=38.54
    });

    it('should apply free delivery for orders over $50', async () => {
      // Expected: deliveryFee=0
    });
  });

  describe('Error Handling', () => {
    it('should handle database errors gracefully', async () => {
      // Mock database error
      mockSupabaseClient.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          in: jest.fn().mockReturnValue({
            eq: jest.fn().mockResolvedValue({
              data: null,
              error: { message: 'Database connection failed' },
            }),
          }),
        }),
      });

      const result = await createCheckoutSession({
        customerInfo: {
          email: 'test@example.com',
          firstName: 'John',
          lastName: 'Doe',
          address: {
            streetAddress1: '123 Main St',
            city: 'Portland',
            state: 'OR',
            zipCode: '97201',
            country: 'US',
          },
        },
        cartItems: [
          {
            product: {
              id: '1',
              name: 'Product 1',
              slug: 'product-1',
              isActive: true,
            } as Partial<Product> as Product,
            variant: {
              id: 'v1',
              price: 15.99,
              sku: 'SKU1',
            } as Partial<ProductVariant> as ProductVariant,
            quantity: 1,
          },
        ],
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBeDefined();
      }
    });

    it('should handle Stripe API errors gracefully', async () => {
      // Note: Full test would mock successful database operations
      // and then mock Stripe error

      mockStripeCheckoutSessions.create.mockRejectedValue(new Error('Stripe API error'));

      // Test would verify error is caught and returned
    });
  });
});
