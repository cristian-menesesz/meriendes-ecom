/**
 * Checkout utility functions for order processing.
 * Includes order number generation, tax calculation, and delivery fee logic.
 */

/**
 * Generates a unique, human-readable order number.
 * Format: ORD-YYYY-NNNNNN (e.g., ORD-2025-000001)
 *
 * @returns A unique order number string
 */
export function generateOrderNumber(): string {
  const year = new Date().getFullYear();
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, '0');
  const sequence = timestamp.toString().slice(-3) + random;

  return `ORD-${year}-${sequence}`;
}

/**
 * Calculates tax amount based on subtotal and delivery state.
 * MVP: Uses a simple flat rate. Can be enhanced with state-specific rates.
 *
 * @param subtotal - Order subtotal before tax
 * @param state - Delivery state (for future state-specific tax rates)
 * @returns Tax amount in dollars
 */
export function calculateTax(subtotal: number, state: string): number {
  // MVP: Simple flat tax rate of 8.5%
  // TODO: Implement state-specific tax rates or integrate with TaxJar/Avalara
  const TAX_RATE = 0.085;

  // Some states have no sales tax
  const TAX_EXEMPT_STATES = ['OR', 'NH', 'DE', 'MT', 'AK'];

  if (TAX_EXEMPT_STATES.includes(state.toUpperCase())) {
    return 0;
  }

  const taxAmount = subtotal * TAX_RATE;
  return Math.round(taxAmount * 100) / 100; // Round to 2 decimal places
}

/**
 * Calculates delivery fee based on order subtotal.
 * MVP: Flat rate with free delivery threshold.
 *
 * @param subtotal - Order subtotal before delivery fee
 * @returns Delivery fee in dollars
 */
export function calculateDeliveryFee(subtotal: number): number {
  const FLAT_DELIVERY_FEE = 5.99;
  const FREE_DELIVERY_THRESHOLD = 50.0;

  // Free delivery for orders above threshold
  if (subtotal >= FREE_DELIVERY_THRESHOLD) {
    return 0;
  }

  return FLAT_DELIVERY_FEE;
}

/**
 * Calculates total order amount including tax and delivery fee.
 *
 * @param subtotal - Order subtotal
 * @param state - Delivery state for tax calculation
 * @returns Object with subtotal, tax, delivery fee, and total
 */
export function calculateOrderTotal(
  subtotal: number,
  state: string
): {
  subtotal: number;
  taxAmount: number;
  deliveryFee: number;
  total: number;
} {
  const taxAmount = calculateTax(subtotal, state);
  const deliveryFee = calculateDeliveryFee(subtotal);
  const total = subtotal + taxAmount + deliveryFee;

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    taxAmount: Math.round(taxAmount * 100) / 100,
    deliveryFee: Math.round(deliveryFee * 100) / 100,
    total: Math.round(total * 100) / 100,
  };
}

/**
 * Validates that cart items are ready for checkout.
 * Checks for empty cart and minimum order amount.
 *
 * @param items - Cart items
 * @param subtotal - Cart subtotal
 * @returns Validation result
 */
export function validateCheckoutCart(
  items: unknown[],
  subtotal: number
): { valid: boolean; error?: string } {
  const MINIMUM_ORDER_AMOUNT = 10.0;

  if (!items || items.length === 0) {
    return { valid: false, error: 'Cart is empty' };
  }

  if (subtotal < MINIMUM_ORDER_AMOUNT) {
    return {
      valid: false,
      error: `Minimum order amount is $${MINIMUM_ORDER_AMOUNT.toFixed(2)}`,
    };
  }

  return { valid: true };
}
