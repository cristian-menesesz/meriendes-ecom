/**
 * @jest-environment node
 */
import {
  generateOrderNumber,
  calculateTax,
  calculateDeliveryFee,
  calculateOrderTotal,
  validateCheckoutCart,
} from '@/lib/utils/checkout';

describe('Checkout Utilities', () => {
  describe('generateOrderNumber', () => {
    it('should generate order number with correct format ORD-YYYY-NNNNNN', () => {
      const orderNumber = generateOrderNumber();

      expect(orderNumber).toMatch(/^ORD-\d{4}-\d{6}$/);
    });

    it('should include current year', () => {
      const orderNumber = generateOrderNumber();
      const currentYear = new Date().getFullYear();

      expect(orderNumber).toContain(`ORD-${currentYear}-`);
    });

    it('should generate unique order numbers', () => {
      const orderNumbers = new Set();

      // Generate 100 order numbers
      for (let i = 0; i < 100; i++) {
        orderNumbers.add(generateOrderNumber());
      }

      // Should have high uniqueness (allow for occasional collision in random generation)
      expect(orderNumbers.size).toBeGreaterThanOrEqual(92);
    });

    it('should have 6-digit suffix', () => {
      const orderNumber = generateOrderNumber();
      const suffix = orderNumber.split('-')[2];

      expect(suffix).toHaveLength(6);
      expect(Number(suffix)).toBeGreaterThanOrEqual(0);
      expect(Number(suffix)).toBeLessThanOrEqual(999999);
    });
  });

  describe('calculateTax', () => {
    const TAX_RATE = 0.085; // 8.5%

    it('should calculate 8.5% tax for taxable states', () => {
      const subtotal = 100;
      const tax = calculateTax(subtotal, 'CA');

      expect(tax).toBe(8.5);
    });

    it('should return 0 tax for Oregon (OR)', () => {
      const subtotal = 100;
      const tax = calculateTax(subtotal, 'OR');

      expect(tax).toBe(0);
    });

    it('should return 0 tax for New Hampshire (NH)', () => {
      const subtotal = 100;
      const tax = calculateTax(subtotal, 'NH');

      expect(tax).toBe(0);
    });

    it('should return 0 tax for Delaware (DE)', () => {
      const subtotal = 100;
      const tax = calculateTax(subtotal, 'DE');

      expect(tax).toBe(0);
    });

    it('should return 0 tax for Montana (MT)', () => {
      const subtotal = 100;
      const tax = calculateTax(subtotal, 'MT');

      expect(tax).toBe(0);
    });

    it('should return 0 tax for Alaska (AK)', () => {
      const subtotal = 100;
      const tax = calculateTax(subtotal, 'AK');

      expect(tax).toBe(0);
    });

    it('should handle lowercase state codes', () => {
      const subtotal = 100;
      const tax = calculateTax(subtotal, 'or');

      expect(tax).toBe(0);
    });

    it('should round to 2 decimal places', () => {
      const subtotal = 123.45;
      const tax = calculateTax(subtotal, 'CA');
      const expected = Math.round(123.45 * TAX_RATE * 100) / 100;

      expect(tax).toBe(expected);
      expect(tax.toString().split('.')[1]?.length || 0).toBeLessThanOrEqual(2);
    });

    it('should handle zero subtotal', () => {
      const tax = calculateTax(0, 'CA');

      expect(tax).toBe(0);
    });

    it('should handle large subtotals correctly', () => {
      const subtotal = 10000;
      const tax = calculateTax(subtotal, 'NY');

      expect(tax).toBe(850);
    });
  });

  describe('calculateDeliveryFee', () => {
    const DELIVERY_FEE = 5.99;
    const FREE_DELIVERY_THRESHOLD = 50;

    it('should charge delivery fee for subtotal under threshold', () => {
      const fee = calculateDeliveryFee(49.99);

      expect(fee).toBe(DELIVERY_FEE);
    });

    it('should charge delivery fee for subtotal exactly at threshold minus 0.01', () => {
      const fee = calculateDeliveryFee(49.99);

      expect(fee).toBe(DELIVERY_FEE);
    });

    it('should provide free delivery for subtotal at threshold', () => {
      const fee = calculateDeliveryFee(50);

      expect(fee).toBe(0);
    });

    it('should provide free delivery for subtotal over threshold', () => {
      const fee = calculateDeliveryFee(100);

      expect(fee).toBe(0);
    });

    it('should provide free delivery for large orders', () => {
      const fee = calculateDeliveryFee(500);

      expect(fee).toBe(0);
    });

    it('should charge delivery fee for zero subtotal', () => {
      const fee = calculateDeliveryFee(0);

      expect(fee).toBe(DELIVERY_FEE);
    });

    it('should charge delivery fee for small orders', () => {
      const fee = calculateDeliveryFee(10);

      expect(fee).toBe(DELIVERY_FEE);
    });
  });

  describe('calculateOrderTotal', () => {
    it('should calculate total correctly for taxable state with delivery fee', () => {
      const subtotal = 30;
      const state = 'CA';

      const result = calculateOrderTotal(subtotal, state);

      expect(result.subtotal).toBe(30);
      expect(result.taxAmount).toBe(2.55); // 30 * 0.085
      expect(result.deliveryFee).toBe(5.99);
      expect(result.total).toBe(38.54); // 30 + 2.55 + 5.99
    });

    it('should calculate total correctly for tax-exempt state with delivery fee', () => {
      const subtotal = 30;
      const state = 'OR';

      const result = calculateOrderTotal(subtotal, state);

      expect(result.subtotal).toBe(30);
      expect(result.taxAmount).toBe(0);
      expect(result.deliveryFee).toBe(5.99);
      expect(result.total).toBe(35.99); // 30 + 0 + 5.99
    });

    it('should calculate total correctly for taxable state with free delivery', () => {
      const subtotal = 100;
      const state = 'CA';

      const result = calculateOrderTotal(subtotal, state);

      expect(result.subtotal).toBe(100);
      expect(result.taxAmount).toBe(8.5); // 100 * 0.085
      expect(result.deliveryFee).toBe(0);
      expect(result.total).toBe(108.5); // 100 + 8.5 + 0
    });

    it('should calculate total correctly for tax-exempt state with free delivery', () => {
      const subtotal = 100;
      const state = 'OR';

      const result = calculateOrderTotal(subtotal, state);

      expect(result.subtotal).toBe(100);
      expect(result.taxAmount).toBe(0);
      expect(result.deliveryFee).toBe(0);
      expect(result.total).toBe(100); // 100 + 0 + 0
    });

    it('should handle edge case at free delivery threshold', () => {
      const subtotal = 50;
      const state = 'CA';

      const result = calculateOrderTotal(subtotal, state);

      expect(result.subtotal).toBe(50);
      expect(result.taxAmount).toBe(4.25); // 50 * 0.085
      expect(result.deliveryFee).toBe(0); // Free at $50
      expect(result.total).toBe(54.25); // 50 + 4.25 + 0
    });

    it('should round all values to 2 decimal places', () => {
      const subtotal = 123.456;
      const state = 'NY';

      const result = calculateOrderTotal(subtotal, state);

      // Check all values have at most 2 decimal places
      expect(result.subtotal.toString().split('.')[1]?.length || 0).toBeLessThanOrEqual(2);
      expect(result.taxAmount.toString().split('.')[1]?.length || 0).toBeLessThanOrEqual(2);
      expect(result.deliveryFee.toString().split('.')[1]?.length || 0).toBeLessThanOrEqual(2);
      expect(result.total.toString().split('.')[1]?.length || 0).toBeLessThanOrEqual(2);
    });

    it('should handle zero subtotal', () => {
      const subtotal = 0;
      const state = 'CA';

      const result = calculateOrderTotal(subtotal, state);

      expect(result.subtotal).toBe(0);
      expect(result.taxAmount).toBe(0);
      expect(result.deliveryFee).toBe(5.99);
      expect(result.total).toBe(5.99);
    });
  });

  describe('validateCheckoutCart', () => {
    it('should return valid for non-empty cart above minimum', () => {
      const items = [
        {
          product: { id: '1', name: 'Product 1', slug: 'product-1', isActive: true } as any,
          variant: { id: 'v1', price: 15.99, sku: 'SKU1' } as any,
          quantity: 1,
        },
      ];

      const result = validateCheckoutCart(items, 15.99);

      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should return error for empty cart', () => {
      const result = validateCheckoutCart([], 0);

      expect(result.valid).toBe(false);
      expect(result.error).toBe('Cart is empty');
    });

    it('should return error for cart below minimum order amount', () => {
      const items = [
        {
          product: { id: '1', name: 'Product 1', slug: 'product-1', isActive: true } as any,
          variant: { id: 'v1', price: 5.0, sku: 'SKU1' } as any,
          quantity: 1,
        },
      ];

      const result = validateCheckoutCart(items, 5.0);

      expect(result.valid).toBe(false);
      expect(result.error).toBe('Minimum order amount is $10.00');
    });

    it('should return valid for cart at exactly minimum order amount', () => {
      const items = [
        {
          product: { id: '1', name: 'Product 1', slug: 'product-1', isActive: true } as any,
          variant: { id: 'v1', price: 10.0, sku: 'SKU1' } as any,
          quantity: 1,
        },
      ];

      const result = validateCheckoutCart(items, 10.0);

      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should calculate subtotal correctly for multiple items', () => {
      const items = [
        {
          product: { id: '1', name: 'Product 1', slug: 'product-1', isActive: true } as any,
          variant: { id: 'v1', price: 5.99, sku: 'SKU1' } as any,
          quantity: 2,
        },
        {
          product: { id: '2', name: 'Product 2', slug: 'product-2', isActive: true } as any,
          variant: { id: 'v2', price: 3.5, sku: 'SKU2' } as any,
          quantity: 1,
        },
      ];

      const result = validateCheckoutCart(items, 15.48);

      // Subtotal: (5.99 * 2) + (3.50 * 1) = 15.48
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should handle cart with multiple items totaling below minimum', () => {
      const items = [
        {
          product: { id: '1', name: 'Product 1', slug: 'product-1', isActive: true } as any,
          variant: { id: 'v1', price: 3.0, sku: 'SKU1' } as any,
          quantity: 2,
        },
        {
          product: { id: '2', name: 'Product 2', slug: 'product-2', isActive: true } as any,
          variant: { id: 'v2', price: 2.0, sku: 'SKU2' } as any,
          quantity: 1,
        },
      ];

      const result = validateCheckoutCart(items, 8.0);

      // Subtotal: (3.00 * 2) + (2.00 * 1) = 8.00 (below $10 minimum)
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Minimum order amount is $10.00');
    });

    it('should handle large cart totals', () => {
      const items = [
        {
          product: { id: '1', name: 'Product 1', slug: 'product-1', isActive: true } as any,
          variant: { id: 'v1', price: 99.99, sku: 'SKU1' } as any,
          quantity: 10,
        },
      ];

      const result = validateCheckoutCart(items, 999.9);

      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });
  });
});
