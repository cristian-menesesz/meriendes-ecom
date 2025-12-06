import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { VariantSelector } from '@/components/products/VariantSelector';
import type { ProductVariant } from '@/types';

describe('VariantSelector', () => {
  const mockVariants: (ProductVariant & { inventory: { quantityAvailable: number } | null })[] = [
    {
      id: '1',
      productId: '1',
      sku: 'VAR-001',
      variantName: 'Small',
      price: 19.99,
      compareAtPrice: null,
      cost: null,
      weightGrams: null,
      isActive: true,
      displayOrder: 1,
      stripePriceId: null,
      stripeProductId: null,
      inventory: { quantityAvailable: 10 },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '2',
      productId: '1',
      sku: 'VAR-002',
      variantName: 'Medium',
      price: 24.99,
      compareAtPrice: null,
      cost: null,
      weightGrams: null,
      isActive: true,
      displayOrder: 2,
      stripePriceId: null,
      stripeProductId: null,
      inventory: { quantityAvailable: 3 }, // Low stock
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '3',
      productId: '1',
      sku: 'VAR-003',
      variantName: 'Large',
      price: 29.99,
      compareAtPrice: null,
      cost: null,
      weightGrams: null,
      isActive: true,
      displayOrder: 3,
      stripePriceId: null,
      stripeProductId: null,
      inventory: { quantityAvailable: 0 }, // Out of stock
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  const mockOnVariantChange = jest.fn();

  beforeEach(() => {
    mockOnVariantChange.mockClear();
  });

  describe('Rendering', () => {
    it('renders all variants with their names and prices', () => {
      render(
        <VariantSelector
          variants={mockVariants}
          selectedVariant={null}
          onVariantChange={mockOnVariantChange}
        />
      );

      expect(screen.getByText('Small')).toBeInTheDocument();
      expect(screen.getByText('$19.99')).toBeInTheDocument();
      expect(screen.getByText('Medium')).toBeInTheDocument();
      expect(screen.getByText('$24.99')).toBeInTheDocument();
      expect(screen.getByText('Large')).toBeInTheDocument();
      expect(screen.getByText('$29.99')).toBeInTheDocument();
    });

    it('renders the section heading', () => {
      render(
        <VariantSelector
          variants={mockVariants}
          selectedVariant={null}
          onVariantChange={mockOnVariantChange}
        />
      );

      expect(screen.getByText('Select Size/Option')).toBeInTheDocument();
    });

    it('renders stock legend', () => {
      render(
        <VariantSelector
          variants={mockVariants}
          selectedVariant={null}
          onVariantChange={mockOnVariantChange}
        />
      );

      expect(screen.getByText('In Stock')).toBeInTheDocument();
      expect(screen.getByText('Low Stock')).toBeInTheDocument();
      expect(screen.getByText('Out of Stock')).toBeInTheDocument();
    });
  });

  describe('Selection State', () => {
    it('highlights the selected variant', () => {
      const selectedVariant = mockVariants[0];
      render(
        <VariantSelector
          variants={mockVariants}
          selectedVariant={selectedVariant}
          onVariantChange={mockOnVariantChange}
        />
      );

      const button = screen.getByRole('button', { name: /select small/i });
      expect(button).toHaveAttribute('aria-pressed', 'true');
      expect(button).toHaveClass('border-indigo-600', 'bg-indigo-50');
    });

    it('does not highlight unselected variants', () => {
      const selectedVariant = mockVariants[0];
      render(
        <VariantSelector
          variants={mockVariants}
          selectedVariant={selectedVariant}
          onVariantChange={mockOnVariantChange}
        />
      );

      const mediumButton = screen.getByRole('button', { name: /select medium/i });
      expect(mediumButton).toHaveAttribute('aria-pressed', 'false');
      expect(mediumButton).not.toHaveClass('border-indigo-600');
    });

    it('shows checkmark on selected variant', () => {
      const selectedVariant = mockVariants[0];
      render(
        <VariantSelector
          variants={mockVariants}
          selectedVariant={selectedVariant}
          onVariantChange={mockOnVariantChange}
        />
      );

      const button = screen.getByRole('button', { name: /select small/i });
      const svg = button.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });
  });

  describe('Stock Indicators', () => {
    it('applies correct styling for in-stock variants', () => {
      render(
        <VariantSelector
          variants={mockVariants}
          selectedVariant={null}
          onVariantChange={mockOnVariantChange}
        />
      );

      const button = screen.getByRole('button', { name: /select small/i });
      expect(button).not.toBeDisabled();
      expect(button).toHaveClass('border-gray-300', 'bg-white');
    });

    it('applies correct styling for low-stock variants', () => {
      render(
        <VariantSelector
          variants={mockVariants}
          selectedVariant={null}
          onVariantChange={mockOnVariantChange}
        />
      );

      const button = screen.getByRole('button', { name: /select medium/i });
      expect(button).not.toBeDisabled();
      // Low stock should still be clickable
    });

    it('disables out-of-stock variants', () => {
      render(
        <VariantSelector
          variants={mockVariants}
          selectedVariant={null}
          onVariantChange={mockOnVariantChange}
        />
      );

      const button = screen.getByRole('button', { name: /select large/i });
      expect(button).toBeDisabled();
      expect(button).toHaveClass('cursor-not-allowed');
    });
  });

  describe('User Interaction', () => {
    it('calls onVariantChange when an available variant is clicked', async () => {
      const user = userEvent.setup();
      render(
        <VariantSelector
          variants={mockVariants}
          selectedVariant={null}
          onVariantChange={mockOnVariantChange}
        />
      );

      const button = screen.getByRole('button', { name: /select small/i });
      await user.click(button);

      expect(mockOnVariantChange).toHaveBeenCalledTimes(1);
      expect(mockOnVariantChange).toHaveBeenCalledWith(mockVariants[0]);
    });

    it('does not call onVariantChange when an out-of-stock variant is clicked', async () => {
      const user = userEvent.setup();
      render(
        <VariantSelector
          variants={mockVariants}
          selectedVariant={null}
          onVariantChange={mockOnVariantChange}
        />
      );

      const button = screen.getByRole('button', { name: /select large/i });
      await user.click(button);

      expect(mockOnVariantChange).not.toHaveBeenCalled();
    });

    it('allows clicking a different variant to change selection', async () => {
      const user = userEvent.setup();
      const { rerender } = render(
        <VariantSelector
          variants={mockVariants}
          selectedVariant={mockVariants[0]}
          onVariantChange={mockOnVariantChange}
        />
      );

      const mediumButton = screen.getByRole('button', { name: /select medium/i });
      await user.click(mediumButton);

      expect(mockOnVariantChange).toHaveBeenCalledWith(mockVariants[1]);

      // Simulate parent updating the selected variant
      rerender(
        <VariantSelector
          variants={mockVariants}
          selectedVariant={mockVariants[1]}
          onVariantChange={mockOnVariantChange}
        />
      );

      expect(mediumButton).toHaveAttribute('aria-pressed', 'true');
    });
  });

  describe('Edge Cases', () => {
    it('handles no selected variant', () => {
      render(
        <VariantSelector
          variants={mockVariants}
          selectedVariant={null}
          onVariantChange={mockOnVariantChange}
        />
      );

      const buttons = screen.getAllByRole('button', { name: /select/i });
      buttons.forEach((button) => {
        if (!button.hasAttribute('disabled')) {
          expect(button).toHaveAttribute('aria-pressed', 'false');
        }
      });
    });

    it('handles single variant', () => {
      const singleVariant = [mockVariants[0]];
      render(
        <VariantSelector
          variants={singleVariant}
          selectedVariant={null}
          onVariantChange={mockOnVariantChange}
        />
      );

      expect(screen.getByText('Small')).toBeInTheDocument();
      expect(screen.queryByText('Medium')).not.toBeInTheDocument();
    });

    it('handles variant with null inventory', () => {
      const variantWithoutInventory: (ProductVariant & {
        inventory: { quantityAvailable: number } | null;
      })[] = [
        {
          ...mockVariants[0],
          inventory: null,
        },
      ];

      render(
        <VariantSelector
          variants={variantWithoutInventory}
          selectedVariant={null}
          onVariantChange={mockOnVariantChange}
        />
      );

      const button = screen.getByRole('button', { name: /select small/i });
      expect(button).toBeDisabled();
    });
  });

  describe('Accessibility', () => {
    it('provides proper ARIA labels for each variant button', () => {
      render(
        <VariantSelector
          variants={mockVariants}
          selectedVariant={null}
          onVariantChange={mockOnVariantChange}
        />
      );

      expect(screen.getByRole('button', { name: /select small for \$19.99/i })).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /select medium for \$24.99/i })
      ).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /select large for \$29.99/i })).toBeInTheDocument();
    });

    it('uses aria-pressed to indicate selection state', () => {
      render(
        <VariantSelector
          variants={mockVariants}
          selectedVariant={mockVariants[0]}
          onVariantChange={mockOnVariantChange}
        />
      );

      const selectedButton = screen.getByRole('button', { name: /select small/i });
      const unselectedButton = screen.getByRole('button', { name: /select medium/i });

      expect(selectedButton).toHaveAttribute('aria-pressed', 'true');
      expect(unselectedButton).toHaveAttribute('aria-pressed', 'false');
    });

    it('makes buttons keyboard accessible', () => {
      render(
        <VariantSelector
          variants={mockVariants}
          selectedVariant={null}
          onVariantChange={mockOnVariantChange}
        />
      );

      const button = screen.getByRole('button', { name: /select small/i });
      expect(button).toHaveAttribute('type', 'button');
    });
  });
});
