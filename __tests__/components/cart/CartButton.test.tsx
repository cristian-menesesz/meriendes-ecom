import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { CartButton } from '@/components/cart/CartButton';
import { useCartStore } from '@/store/cartStore';
import type { Product, ProductVariant } from '@/types';

// Mock Zustand store
jest.mock('@/store/cartStore', () => ({
  useCartStore: jest.fn(),
}));

const mockUseCartStore = useCartStore as jest.MockedFunction<typeof useCartStore>;

// Mock data factory
const createMockProduct = (): Product => ({
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
});

const createMockVariant = (): ProductVariant => ({
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
});

describe('CartButton', () => {
  const mockOpenSidebar = jest.fn();

  // Helper to setup Zustand store mock with selector pattern
  const setupMockStore = (totalItems: number) => {
    mockUseCartStore.mockImplementation((selector: any) => {
      const state = {
        items: [],
        isSidebarOpen: false,
        addItem: jest.fn(),
        removeItem: jest.fn(),
        updateQuantity: jest.fn(),
        incrementQuantity: jest.fn(),
        decrementQuantity: jest.fn(),
        clearCart: jest.fn(),
        getTotalItems: () => totalItems,
        getTotalPrice: () => 0,
        getItemByVariantId: () => undefined,
        openSidebar: mockOpenSidebar,
        closeSidebar: jest.fn(),
        toggleSidebar: jest.fn(),
      };
      return selector(state);
    });
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('rendering', () => {
    it('renders cart icon', () => {
      setupMockStore(0);

      render(<CartButton />);

      const button = screen.getByRole('button', { name: /shopping cart/i });
      expect(button).toBeInTheDocument();
    });

    it('shows badge when cart has items', () => {
      setupMockStore(2);

      render(<CartButton />);

      const badge = screen.getByText('2');
      expect(badge).toBeInTheDocument();
    });
  });

  describe('interactions', () => {
    it('opens sidebar when clicked', () => {
      setupMockStore(0);

      render(<CartButton />);

      const button = screen.getByRole('button', { name: /shopping cart/i });
      fireEvent.click(button);

      expect(mockOpenSidebar).toHaveBeenCalledTimes(1);
    });

    it('can be clicked multiple times', () => {
      setupMockStore(0);

      render(<CartButton />);

      const button = screen.getByRole('button', { name: /shopping cart/i });
      fireEvent.click(button);
      fireEvent.click(button);
      fireEvent.click(button);

      expect(mockOpenSidebar).toHaveBeenCalledTimes(3);
    });
  });

  describe('accessibility', () => {
    it('has accessible label with item count', () => {
      setupMockStore(3);

      render(<CartButton />);

      const button = screen.getByRole('button', {
        name: /shopping cart with 3 items/i,
      });
      expect(button).toBeInTheDocument();
    });

    it('updates accessible label when count changes', () => {
      const { rerender } = render(<CartButton />);

      // Empty cart
      setupMockStore(0);
      rerender(<CartButton />);
      expect(
        screen.getByRole('button', { name: /shopping cart with 0 items/i })
      ).toBeInTheDocument();

      // Cart with items
      setupMockStore(5);
      rerender(<CartButton />);
      expect(
        screen.getByRole('button', { name: /shopping cart with 5 items/i })
      ).toBeInTheDocument();
    });
  });

  describe('badge styling', () => {
    it('applies correct classes for badge visibility', () => {
      setupMockStore(1);

      const { container } = render(<CartButton />);

      const badge = container.querySelector('span[class*="bg-indigo"][class*="text-white"]');
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveTextContent('1');
    });
  });
});
