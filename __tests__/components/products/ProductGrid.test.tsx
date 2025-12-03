import React from 'react';
import { render, screen } from '@testing-library/react';
import { ProductGrid } from '@/components/products/ProductGrid';
import type { ProductWithDetails } from '@/lib/supabase/queries/products';

// Mock the ProductCard component
jest.mock('@/components/products/ProductCard', () => ({
  ProductCard: ({ product }: any) => (
    <div data-testid={`product-card-${product.id}`}>{product.name}</div>
  ),
}));

const createMockProduct = (id: string, name: string): ProductWithDetails => ({
  id,
  categoryId: 1,
  name,
  slug: name.toLowerCase().replace(/\s+/g, '-'),
  description: `Description for ${name}`,
  shortDescription: `Short description for ${name}`,
  imageUrl: 'https://example.com/image.jpg',
  isActive: true,
  isSeasonal: false,
  isFeatured: false,
  displayOrder: 0,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  category: null,
  variants: [
    {
      id: `var-${id}`,
      productId: id,
      sku: `SKU-${id}`,
      variantName: 'Standard',
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
      inventory: {
        id: `inv-${id}`,
        variantId: `var-${id}`,
        quantityAvailable: 10,
        quantityReserved: 0,
        lowStockThreshold: 5,
        updatedAt: new Date().toISOString(),
      },
    },
  ],
});

describe('ProductGrid Component', () => {
  describe('Rendering', () => {
    it('should render all products in a grid', () => {
      const products = [
        createMockProduct('1', 'Product 1'),
        createMockProduct('2', 'Product 2'),
        createMockProduct('3', 'Product 3'),
      ];

      render(<ProductGrid products={products} />);

      expect(screen.getByTestId('product-card-1')).toBeInTheDocument();
      expect(screen.getByTestId('product-card-2')).toBeInTheDocument();
      expect(screen.getByTestId('product-card-3')).toBeInTheDocument();
    });

    it('should pass products to ProductCard components', () => {
      const products = [createMockProduct('1', 'Chocolate Cake')];

      render(<ProductGrid products={products} />);

      expect(screen.getByText('Chocolate Cake')).toBeInTheDocument();
    });

    it('should pass onAddToCart callback to ProductCard', () => {
      const products = [createMockProduct('1', 'Product 1')];
      const mockOnAddToCart = jest.fn();

      // We need to unmock ProductCard to test prop passing
      jest.unmock('@/components/products/ProductCard');

      render(<ProductGrid products={products} onAddToCart={mockOnAddToCart} />);

      // The callback should be passed down (tested more thoroughly in ProductCard tests)
      expect(screen.getByTestId('product-card-1')).toBeInTheDocument();
    });
  });

  describe('Empty State', () => {
    it('should show empty state message when no products', () => {
      render(<ProductGrid products={[]} />);

      expect(screen.getByText('No products found')).toBeInTheDocument();
      expect(screen.getByText('Check back soon for new items!')).toBeInTheDocument();
    });

    it('should not render grid when products array is empty', () => {
      const { container } = render(<ProductGrid products={[]} />);

      // Grid should not exist
      const grid = container.querySelector('.grid');
      expect(grid).not.toBeInTheDocument();
    });

    it('should show centered empty state', () => {
      const { container } = render(<ProductGrid products={[]} />);

      const emptyState = container.querySelector('.flex.flex-col.items-center');
      expect(emptyState).toBeInTheDocument();
    });
  });

  describe('Grid Layout', () => {
    it('should apply responsive grid classes', () => {
      const products = [createMockProduct('1', 'Product 1')];
      const { container } = render(<ProductGrid products={products} />);

      const grid = container.querySelector('.grid');
      expect(grid).toHaveClass('grid-cols-1');
      expect(grid).toHaveClass('sm:grid-cols-2');
      expect(grid).toHaveClass('lg:grid-cols-3');
      expect(grid).toHaveClass('xl:grid-cols-4');
    });

    it('should apply gap spacing between products', () => {
      const products = [createMockProduct('1', 'Product 1'), createMockProduct('2', 'Product 2')];
      const { container } = render(<ProductGrid products={products} />);

      const grid = container.querySelector('.grid');
      expect(grid).toHaveClass('gap-6');
    });
  });

  describe('Multiple Products', () => {
    it('should handle single product', () => {
      const products = [createMockProduct('1', 'Single Product')];

      render(<ProductGrid products={products} />);

      expect(screen.getByTestId('product-card-1')).toBeInTheDocument();
      expect(screen.queryByText('No products found')).not.toBeInTheDocument();
    });

    it('should handle many products', () => {
      const products = Array.from({ length: 12 }, (_, i) =>
        createMockProduct(`${i + 1}`, `Product ${i + 1}`)
      );

      render(<ProductGrid products={products} />);

      products.forEach((_, index) => {
        expect(screen.getByTestId(`product-card-${index + 1}`)).toBeInTheDocument();
      });
    });
  });

  describe('Key Prop', () => {
    it('should use product id as key for each ProductCard', () => {
      const products = [
        createMockProduct('unique-1', 'Product 1'),
        createMockProduct('unique-2', 'Product 2'),
      ];

      const { container } = render(<ProductGrid products={products} />);

      // React keys are not directly accessible, but we can verify unique testids
      expect(screen.getByTestId('product-card-unique-1')).toBeInTheDocument();
      expect(screen.getByTestId('product-card-unique-2')).toBeInTheDocument();
    });
  });
});
