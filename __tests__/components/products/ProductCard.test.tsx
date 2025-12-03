import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProductCard } from '@/components/products/ProductCard';
import type { Product, ProductVariant, Inventory } from '@/types';

// Mock data factory
const createMockProduct = (overrides?: Partial<Product>): Product => ({
  id: 'prod-1',
  categoryId: 1,
  name: 'Test Product',
  slug: 'test-product',
  description: 'A test product description',
  shortDescription: 'Test short description',
  imageUrl: 'https://example.com/test.jpg',
  isActive: true,
  isSeasonal: false,
  isFeatured: false,
  displayOrder: 0,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides,
});

const createMockVariant = (
  overrides?: Partial<ProductVariant>,
  inventory?: Inventory | null
): ProductVariant & { inventory: Inventory | null } => {
  // Default inventory object
  const defaultInventory: Inventory = {
    id: 'inv-1',
    variantId: 'var-1',
    quantityAvailable: 10,
    quantityReserved: 0,
    lowStockThreshold: 5,
    updatedAt: new Date().toISOString(),
  };

  return {
    id: 'var-1',
    productId: 'prod-1',
    sku: 'TEST-SKU-1',
    variantName: 'Small',
    price: 29.99,
    compareAtPrice: null,
    cost: null,
    weightGrams: null,
    isActive: true,
    displayOrder: 0,
    stripePriceId: null,
    stripeProductId: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    // Use inventory parameter if provided (even if null), otherwise use default
    inventory: inventory !== undefined ? inventory : defaultInventory,
    ...overrides,
  };
};

describe('ProductCard Component', () => {
  describe('Rendering', () => {
    it('should render product name and image', () => {
      const product = createMockProduct();
      const variants = [createMockVariant()];

      render(<ProductCard product={product} variants={variants} />);

      expect(screen.getByText('Test Product')).toBeInTheDocument();
      expect(screen.getByAltText('Test Product')).toBeInTheDocument();
    });

    it('should render short description when provided', () => {
      const product = createMockProduct({ shortDescription: 'A great product!' });
      const variants = [createMockVariant()];

      render(<ProductCard product={product} variants={variants} />);

      expect(screen.getByText('A great product!')).toBeInTheDocument();
    });

    it('should show placeholder when no image URL provided', () => {
      const product = createMockProduct({ imageUrl: null });
      const variants = [createMockVariant()];

      render(<ProductCard product={product} variants={variants} />);

      expect(screen.getByText('No Image')).toBeInTheDocument();
    });

    it('should link to product detail page', () => {
      const product = createMockProduct({ slug: 'chocolate-cake' });
      const variants = [createMockVariant()];

      render(<ProductCard product={product} variants={variants} />);

      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', '/products/chocolate-cake');
    });
  });

  describe('Price Display', () => {
    it('should display single price when all variants have same price', () => {
      const product = createMockProduct();
      const variants = [
        createMockVariant({ id: 'var-1', price: 29.99 }),
        createMockVariant({ id: 'var-2', price: 29.99 }),
      ];

      render(<ProductCard product={product} variants={variants} />);

      expect(screen.getByText('$29.99')).toBeInTheDocument();
    });

    it('should display price range when variants have different prices', () => {
      const product = createMockProduct();
      const variants = [
        createMockVariant({ id: 'var-1', price: 19.99 }),
        createMockVariant({ id: 'var-2', price: 29.99 }),
      ];

      render(<ProductCard product={product} variants={variants} />);

      expect(screen.getByText('$19.99 - $29.99')).toBeInTheDocument();
    });

    it('should handle empty variants array gracefully', () => {
      const product = createMockProduct();
      const variants: (ProductVariant & { inventory: Inventory | null })[] = [];

      render(<ProductCard product={product} variants={variants} />);

      // Should not crash, component should still render
      expect(screen.getByText('Test Product')).toBeInTheDocument();
    });

    it('should not display NaN or Infinity when no variants with stock', () => {
      const product = createMockProduct();
      const variants = [
        createMockVariant(
          { id: 'var-1', price: 29.99 },
          {
            id: 'inv-1',
            variantId: 'var-1',
            quantityAvailable: 0,
            quantityReserved: 0,
            lowStockThreshold: 5,
            updatedAt: new Date().toISOString(),
          }
        ),
      ];

      const { container } = render(<ProductCard product={product} variants={variants} />);

      // Should not contain NaN or Infinity in the text
      expect(container.textContent).not.toMatch(/NaN|Infinity/);
    });
  });

  describe('Stock Status & Badges', () => {
    it('should show "Out of Stock" badge when no variants have inventory', () => {
      const product = createMockProduct();
      const variants = [
        createMockVariant(
          { id: 'var-1' },
          {
            id: 'inv-1',
            variantId: 'var-1',
            quantityAvailable: 0,
            quantityReserved: 0,
            lowStockThreshold: 5,
            updatedAt: new Date().toISOString(),
          }
        ),
      ];

      render(<ProductCard product={product} variants={variants} />);

      expect(screen.getByText('Out of Stock')).toBeInTheDocument();
    });

    it('should not show "Out of Stock" badge when variants have inventory', () => {
      const product = createMockProduct();
      const variants = [createMockVariant()];

      render(<ProductCard product={product} variants={variants} />);

      expect(screen.queryByText('Out of Stock')).not.toBeInTheDocument();
    });

    it('should show "Featured" badge when product is featured', () => {
      const product = createMockProduct({ isFeatured: true });
      const variants = [createMockVariant()];

      render(<ProductCard product={product} variants={variants} />);

      expect(screen.getByText('Featured')).toBeInTheDocument();
    });

    it('should show "Seasonal" badge when product is seasonal', () => {
      const product = createMockProduct({ isSeasonal: true });
      const variants = [createMockVariant()];

      render(<ProductCard product={product} variants={variants} />);

      expect(screen.getByText('Seasonal')).toBeInTheDocument();
    });

    it('should show multiple badges when applicable', () => {
      const product = createMockProduct({ isFeatured: true, isSeasonal: true });
      const variants = [createMockVariant()];

      render(<ProductCard product={product} variants={variants} />);

      expect(screen.getByText('Featured')).toBeInTheDocument();
      expect(screen.getByText('Seasonal')).toBeInTheDocument();
    });
  });

  describe('Variant Information', () => {
    it('should show variant count when multiple sizes available', () => {
      const product = createMockProduct();
      const variants = [
        createMockVariant({ id: 'var-1', variantName: 'Small' }),
        createMockVariant({ id: 'var-2', variantName: 'Large' }),
      ];

      render(<ProductCard product={product} variants={variants} />);

      expect(screen.getByText('2 sizes available')).toBeInTheDocument();
    });

    it('should not show variant count when only one variant', () => {
      const product = createMockProduct();
      const variants = [createMockVariant()];

      render(<ProductCard product={product} variants={variants} />);

      expect(screen.queryByText(/sizes available/)).not.toBeInTheDocument();
    });

    it('should only count active variants with stock', () => {
      const product = createMockProduct();
      const variants = [
        createMockVariant({ id: 'var-1', variantName: 'Small' }),
        createMockVariant({ id: 'var-2', variantName: 'Medium' }),
        createMockVariant({ id: 'var-3', variantName: 'Large', isActive: false }),
      ];

      render(<ProductCard product={product} variants={variants} />);

      expect(screen.getByText('2 sizes available')).toBeInTheDocument();
    });
  });

  describe('Quick Add Button', () => {
    it('should show Quick Add button when onAddToCart is provided and has stock', () => {
      const product = createMockProduct();
      const variants = [createMockVariant()];
      const mockAddToCart = jest.fn();

      render(<ProductCard product={product} variants={variants} onAddToCart={mockAddToCart} />);

      expect(screen.getByRole('button', { name: /add test product to cart/i })).toBeInTheDocument();
    });

    it('should not show Quick Add button when no stock available', () => {
      const product = createMockProduct();
      const variants = [
        createMockVariant(
          { id: 'var-1' },
          {
            id: 'inv-1',
            variantId: 'var-1',
            quantityAvailable: 0,
            quantityReserved: 0,
            lowStockThreshold: 5,
            updatedAt: new Date().toISOString(),
          }
        ),
      ];
      const mockAddToCart = jest.fn();

      render(<ProductCard product={product} variants={variants} onAddToCart={mockAddToCart} />);

      expect(screen.queryByRole('button', { name: /add/i })).not.toBeInTheDocument();
    });

    it('should not show Quick Add button when onAddToCart is not provided', () => {
      const product = createMockProduct();
      const variants = [createMockVariant()];

      render(<ProductCard product={product} variants={variants} />);

      expect(screen.queryByRole('button', { name: /add/i })).not.toBeInTheDocument();
    });

    it('should call onAddToCart with correct product and lowest-priced variant', () => {
      const product = createMockProduct();
      const lowPriceVariant = createMockVariant({
        id: 'var-1',
        price: 19.99,
        variantName: 'Small',
      });
      const highPriceVariant = createMockVariant({
        id: 'var-2',
        price: 29.99,
        variantName: 'Large',
      });
      const variants = [highPriceVariant, lowPriceVariant]; // Order matters for the test
      const mockAddToCart = jest.fn();

      render(<ProductCard product={product} variants={variants} onAddToCart={mockAddToCart} />);

      const button = screen.getByRole('button', { name: /add test product to cart/i });
      fireEvent.click(button);

      expect(mockAddToCart).toHaveBeenCalledTimes(1);
      expect(mockAddToCart).toHaveBeenCalledWith(
        product,
        expect.objectContaining({
          id: 'var-1',
          price: 19.99,
          variantName: 'Small',
        })
      );
    });

    it('should prevent navigation when Quick Add is clicked', () => {
      const product = createMockProduct();
      const variants = [createMockVariant()];
      const mockAddToCart = jest.fn();

      render(<ProductCard product={product} variants={variants} onAddToCart={mockAddToCart} />);

      const button = screen.getByRole('button', { name: /add test product to cart/i });
      const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true });
      const preventDefaultSpy = jest.spyOn(clickEvent, 'preventDefault');

      fireEvent(button, clickEvent);

      expect(preventDefaultSpy).toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('should have accessible link with product name', () => {
      const product = createMockProduct({ name: 'Chocolate Cake' });
      const variants = [createMockVariant()];

      render(<ProductCard product={product} variants={variants} />);

      const link = screen.getByRole('link');
      expect(link).toBeInTheDocument();
      expect(screen.getByText('Chocolate Cake')).toBeInTheDocument();
    });

    it('should have alt text for product image', () => {
      const product = createMockProduct({ name: 'Strawberry Tart' });
      const variants = [createMockVariant()];

      render(<ProductCard product={product} variants={variants} />);

      const image = screen.getByAltText('Strawberry Tart');
      expect(image).toBeInTheDocument();
    });

    it('should have aria-label for Quick Add button', () => {
      const product = createMockProduct({ name: 'Vanilla Cupcake' });
      const variants = [createMockVariant()];
      const mockAddToCart = jest.fn();

      render(<ProductCard product={product} variants={variants} onAddToCart={mockAddToCart} />);

      const button = screen.getByRole('button', { name: 'Add Vanilla Cupcake to cart' });
      expect(button).toBeInTheDocument();
    });
  });

  describe('Image Optimization', () => {
    it('should set priority loading for featured products', () => {
      const product = createMockProduct({ isFeatured: true });
      const variants = [createMockVariant()];

      render(<ProductCard product={product} variants={variants} />);

      const image = screen.getByAltText('Test Product');
      expect(image).toHaveAttribute('data-priority', 'true');
    });

    it('should not set priority loading for non-featured products', () => {
      const product = createMockProduct({ isFeatured: false });
      const variants = [createMockVariant()];

      render(<ProductCard product={product} variants={variants} />);

      const image = screen.getByAltText('Test Product');
      expect(image).toHaveAttribute('data-priority', 'false');
    });
  });

  describe('Edge Cases', () => {
    it('should handle variant with null inventory gracefully', () => {
      const product = createMockProduct();
      const variants = [createMockVariant({}, null)];

      render(<ProductCard product={product} variants={variants} />);

      // Should show out of stock since null inventory means no available stock
      // (null inventory is filtered out by activeVariants logic)
      expect(screen.getByText('Out of Stock')).toBeInTheDocument();

      // Quick Add button should not be visible
      expect(screen.queryByText('Quick Add')).not.toBeInTheDocument();
    });

    it('should handle inactive variants correctly', () => {
      const product = createMockProduct();
      const variants = [
        createMockVariant({ id: 'var-1', isActive: true }),
        createMockVariant({ id: 'var-2', isActive: false }),
      ];

      render(<ProductCard product={product} variants={variants} />);

      // Should not show "2 sizes available" because one is inactive
      expect(screen.queryByText('2 sizes available')).not.toBeInTheDocument();
    });

    it('should handle very long product names', () => {
      const product = createMockProduct({
        name: 'This is a Very Long Product Name That Should Still Render Properly',
      });
      const variants = [createMockVariant()];

      render(<ProductCard product={product} variants={variants} />);

      expect(
        screen.getByText('This is a Very Long Product Name That Should Still Render Properly')
      ).toBeInTheDocument();
    });

    it('should handle zero-priced variants', () => {
      const product = createMockProduct();
      const variants = [createMockVariant({ price: 0 })];

      render(<ProductCard product={product} variants={variants} />);

      expect(screen.getByText('$0.00')).toBeInTheDocument();
    });
  });
});
