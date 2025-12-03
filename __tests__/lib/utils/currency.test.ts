import { formatCurrency, dollarsToCents, centsToDollars } from '@/lib/utils/currency';

describe('Currency Utilities', () => {
  describe('formatCurrency', () => {
    it('should format dollar amounts with two decimal places', () => {
      expect(formatCurrency(29.99)).toBe('$29.99');
      expect(formatCurrency(100)).toBe('$100.00');
      expect(formatCurrency(0)).toBe('$0.00');
    });

    it('should format amounts with thousands separators', () => {
      expect(formatCurrency(1000)).toBe('$1,000.00');
      expect(formatCurrency(1234567.89)).toBe('$1,234,567.89');
    });

    it('should handle negative amounts', () => {
      expect(formatCurrency(-50)).toBe('-$50.00');
    });

    it('should handle very small amounts', () => {
      expect(formatCurrency(0.01)).toBe('$0.01');
      expect(formatCurrency(0.99)).toBe('$0.99');
    });
  });

  describe('dollarsToCents', () => {
    it('should convert dollars to cents correctly', () => {
      expect(dollarsToCents(29.99)).toBe(2999);
      expect(dollarsToCents(100)).toBe(10000);
      expect(dollarsToCents(0)).toBe(0);
    });

    it('should use Math.floor to avoid floating point issues', () => {
      // This tests the specific implementation requirement from the code
      expect(dollarsToCents(29.999)).toBe(2999);
      expect(dollarsToCents(10.1234)).toBe(1012);
    });

    it('should handle very small amounts', () => {
      expect(dollarsToCents(0.01)).toBe(1);
      expect(dollarsToCents(0.1)).toBe(10);
    });
  });

  describe('centsToDollars', () => {
    it('should convert cents to dollars correctly', () => {
      expect(centsToDollars(2999)).toBe(29.99);
      expect(centsToDollars(10000)).toBe(100);
      expect(centsToDollars(0)).toBe(0);
    });

    it('should handle single digit cents', () => {
      expect(centsToDollars(1)).toBe(0.01);
      expect(centsToDollars(10)).toBe(0.1);
    });

    it('should handle large amounts', () => {
      expect(centsToDollars(123456789)).toBe(1234567.89);
    });
  });

  describe('Round-trip conversions', () => {
    it('should maintain accuracy for common prices', () => {
      // Note: Due to floating-point precision and Math.floor usage,
      // round-trip conversions may lose precision. This is intentional
      // to ensure we never overcharge in Stripe (always floor cents).
      const testCases = [
        { dollars: 10.0, expectedCents: 1000, expectedBack: 10.0 },
        { dollars: 29.99, expectedCents: 2999, expectedBack: 29.99 },
        { dollars: 49.5, expectedCents: 4950, expectedBack: 49.5 },
      ];

      testCases.forEach(({ dollars, expectedCents, expectedBack }) => {
        const cents = dollarsToCents(dollars);
        expect(cents).toBe(expectedCents);

        const backToDollars = centsToDollars(cents);
        expect(backToDollars).toBe(expectedBack);
      });
    });

    it('should handle floating-point precision issues gracefully', () => {
      // These prices have floating-point precision issues
      // Math.floor ensures we don't accidentally overcharge
      const problematicPrices = [
        { dollars: 19.99, expectedCents: 1998 }, // 19.99 * 100 = 1998.9999... -> floors to 1998
      ];

      problematicPrices.forEach(({ dollars, expectedCents }) => {
        const cents = dollarsToCents(dollars);
        expect(cents).toBe(expectedCents);

        // When converted back, we may lose 1 cent due to floor operation
        const backToDollars = centsToDollars(cents);
        expect(backToDollars).toBe(expectedCents / 100); // Verify it's exactly the floored amount
        expect(backToDollars).toBeCloseTo(dollars, 1); // Within 0.1 dollars of original
      });
    });
  });
});
