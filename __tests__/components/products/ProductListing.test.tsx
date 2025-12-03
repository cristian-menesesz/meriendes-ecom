import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProductListing } from '@/components/products/ProductListing';
import { useCartStore } from '@/store/cartStore';
import type { ProductWithDetails } from '@/lib/supabase/queries/products';
import type { Product, ProductVariant } from '@/types';

// Mock dependencies
jest.mock('@/store/cartStore');
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock('@/components/products/ProductGrid', () => ({
  ProductGrid: ({ products, onAddToCart }: any) => (
    <div data-testid="product-grid">
      {products.map((product: ProductWithDetails) => (
        <div key={product.id} data-testid={`grid-product-${product.id}`}>
          {product.name}
          {onAddToCart && (
            <button
              onClick={() => onAddToCart(product, product.variants[0])}
              data-testid={`add-button-${product.id}`}
            >
              Add
            </button>
          )}
        </div>
      ))}
    </div>
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

describe('ProductListing Component', () => {
  let mockAddItem: jest.Mock;

  beforeEach(() => {
    mockAddItem = jest.fn();
    // Mock Zustand's selector pattern
    (useCartStore as unknown as jest.Mock).mockImplementation((selector) =>
      selector({ addItem: mockAddItem })
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render ProductGrid with products', () => {
      const products = [
        createMockProduct('1', 'Chocolate Cake'),
        createMockProduct('2', 'Vanilla Cake'),
      ];

      render(<ProductListing products={products} />);

      expect(screen.getByTestId('product-grid')).toBeInTheDocument();
      expect(screen.getByTestId('grid-product-1')).toBeInTheDocument();
      expect(screen.getByTestId('grid-product-2')).toBeInTheDocument();
    });

    it('should pass products to ProductGrid', () => {
      const products = [createMockProduct('1', 'Strawberry Tart')];

      render(<ProductListing products={products} />);

      expect(screen.getByText('Strawberry Tart')).toBeInTheDocument();
    });

    it('should pass onAddToCart callback to ProductGrid', () => {
      const products = [createMockProduct('1', 'Test Product')];

      render(<ProductListing products={products} />);

      const addButton = screen.getByTestId('add-button-1');
      expect(addButton).toBeInTheDocument();
    });
  });

  describe('Add to Cart Functionality', () => {
    it('should call cart store addItem when handleAddToCart is triggered', () => {
      const products = [createMockProduct('1', 'Chocolate Cake')];

      render(<ProductListing products={products} />);

      const addButton = screen.getByTestId('add-button-1');
      fireEvent.click(addButton);

      expect(mockAddItem).toHaveBeenCalledTimes(1);
      expect(mockAddItem).toHaveBeenCalledWith(
        expect.objectContaining({
          id: '1',
          name: 'Chocolate Cake',
        }),
        expect.objectContaining({
          id: 'var-1',
          variantName: 'Standard',
          price: 29.99,
        }),
        1
      );
    });

    it('should show success toast when item is added to cart', () => {
      const { toast } = require('sonner');
      const products = [createMockProduct('1', 'Vanilla Cupcake')];

      render(<ProductListing products={products} />);

      const addButton = screen.getByTestId('add-button-1');
      fireEvent.click(addButton);

      expect(toast.success).toHaveBeenCalledWith('Added Vanilla Cupcake (Standard) to cart');
    });

    it('should include variant name in success message', () => {
      const { toast } = require('sonner');
      const products = [createMockProduct('1', 'Product')];
      products[0].variants[0].variantName = 'Large Size';

      render(<ProductListing products={products} />);

      const addButton = screen.getByTestId('add-button-1');
      fireEvent.click(addButton);

      expect(toast.success).toHaveBeenCalledWith('Added Product (Large Size) to cart');
    });

    it('should always add quantity of 1', () => {
      const products = [createMockProduct('1', 'Test Product')];

      render(<ProductListing products={products} />);

      const addButton = screen.getByTestId('add-button-1');
      fireEvent.click(addButton);

      expect(mockAddItem).toHaveBeenCalledWith(expect.any(Object), expect.any(Object), 1);
    });
  });

  describe('Container/Presenter Pattern', () => {
    it('should separate business logic from presentation', () => {
      const products = [createMockProduct('1', 'Test Product')];

      render(<ProductListing products={products} />);

      // ProductListing (Container) handles cart logic
      // ProductGrid (Presenter) handles display
      expect(screen.getByTestId('product-grid')).toBeInTheDocument();
    });

    it('should not directly manipulate DOM or UI', () => {
      const products = [createMockProduct('1', 'Test Product')];
      const { container } = render(<ProductListing products={products} />);

      // ProductListing should only wrap ProductGrid
      expect(container.firstChild).toEqual(screen.getByTestId('product-grid'));
    });
  });

  describe('Multiple Products', () => {
    it('should handle adding different products to cart', () => {
      const products = [createMockProduct('1', 'Product 1'), createMockProduct('2', 'Product 2')];

      render(<ProductListing products={products} />);

      fireEvent.click(screen.getByTestId('add-button-1'));
      fireEvent.click(screen.getByTestId('add-button-2'));

      expect(mockAddItem).toHaveBeenCalledTimes(2);
      expect(mockAddItem).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({ id: '1' }),
        expect.any(Object),
        1
      );
      expect(mockAddItem).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({ id: '2' }),
        expect.any(Object),
        1
      );
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty products array', () => {
      render(<ProductListing products={[]} />);

      expect(screen.getByTestId('product-grid')).toBeInTheDocument();
    });

    it('should handle products without variants gracefully', () => {
      const products = [createMockProduct('1', 'Test Product')];
      products[0].variants = [];

      render(<ProductListing products={products} />);

      // Should still render, even though clicking Add would fail
      expect(screen.getByTestId('grid-product-1')).toBeInTheDocument();
    });
  });

  describe('Zustand Integration', () => {
    it('should use cart store from Zustand', () => {
      const products = [createMockProduct('1', 'Test Product')];

      render(<ProductListing products={products} />);

      expect(useCartStore).toHaveBeenCalled();
    });

    it('should call the correct Zustand action', () => {
      const products = [createMockProduct('1', 'Test Product')];

      render(<ProductListing products={products} />);

      const addButton = screen.getByTestId('add-button-1');
      fireEvent.click(addButton);

      // Verify we're using the addItem action from the store
      expect(mockAddItem).toHaveBeenCalled();
    });
  });
});
