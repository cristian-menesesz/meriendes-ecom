/**
 * Formats a number as a currency string in USD.
 *
 * @param {number} amount - The amount to format (in dollars, not cents).
 * @returns {string} Formatted currency string.
 *
 * @example
 * formatCurrency(29.99) // => "$29.99"
 * formatCurrency(1000) // => "$1,000.00"
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

/**
 * Converts a dollar amount to cents for Stripe API.
 * Uses Math.floor to avoid floating point precision issues.
 *
 * @param {number} dollars - Amount in dollars.
 * @returns {number} Amount in cents.
 *
 * @example
 * dollarsToCents(29.99) // => 2999
 */
export function dollarsToCents(dollars: number): number {
  return Math.floor(dollars * 100);
}

/**
 * Converts a cent amount to dollars.
 *
 * @param {number} cents - Amount in cents.
 * @returns {number} Amount in dollars.
 *
 * @example
 * centsToDollars(2999) // => 29.99
 */
export function centsToDollars(cents: number): number {
  return cents / 100;
}
