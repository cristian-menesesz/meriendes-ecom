import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { CartSidebar } from '@/components/cart/CartSidebar';
import { useCartStore, type CartStore } from '@/store/cartStore';
import type { CartItem, Product, ProductVariant } from '@/types';

// Mock Zustand store
jest.mock('@/store/cartStore', () => ({
  useCartStore: jest.fn(),
}));

// Mock Next.js components
jest.mock('next/link', () => {
  const Link = ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  };
  Link.displayName = 'Link';
  return Link;
});

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

// Mock Headless UI Dialog for testing
interface DialogProps {
  children: React.ReactNode;
  onClose: () => void;
}

interface TransitionProps {
  show: boolean;
  children: React.ReactNode;
}

interface SimpleProps {
  children: React.ReactNode;
}

jest.mock('@headlessui/react', () => ({
  Dialog: ({ children, onClose }: DialogProps) => (
    <div data-testid="dialog" role="dialog" onClick={onClose}>
      {children}
    </div>
  ),
  DialogPanel: ({ children }: SimpleProps) => <div data-testid="dialog-panel">{children}</div>,
  DialogTitle: ({ children }: SimpleProps) => <h2>{children}</h2>,
  Transition: ({ show, children }: TransitionProps) => (
    <div data-testid="transition" data-show={show}>
      {show && children}
    </div>
  ),
  TransitionChild: ({ children }: SimpleProps) => <div>{children}</div>,
  Fragment: ({ children }: SimpleProps) => <>{children}</>,
}));

const mockUseCartStore = useCartStore as jest.MockedFunction<typeof useCartStore>;

// Mock data factory
const createMockProduct = (id = 'prod-1'): Product => ({
  id,
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

const createMockVariant = (id = 'var-1', price = 29.99): ProductVariant => ({
  id,
  productId: 'prod-1',
  sku: `TEST-SKU-${id}`,
  variantName: 'Small',
  price,
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

describe('CartSidebar', () => {
  const mockCloseSidebar = jest.fn();
  const mockIncrementQuantity = jest.fn();
  const mockDecrementQuantity = jest.fn();
  const mockRemoveItem = jest.fn();

  // Helper to setup Zustand store mock with selector pattern
  const setupMockStore = (
    items: CartItem[] = [],
    isSidebarOpen = false,
    totalItems = 0,
    totalPrice = 0
  ) => {
    mockUseCartStore.mockImplementation((selector: (state: CartStore) => unknown) => {
      const state = {
        items,
        isSidebarOpen,
        addItem: jest.fn(),
        removeItem: mockRemoveItem,
        updateQuantity: jest.fn(),
        incrementQuantity: mockIncrementQuantity,
        decrementQuantity: mockDecrementQuantity,
        clearCart: jest.fn(),
        getTotalItems: () => totalItems,
        getTotalPrice: () => totalPrice,
        getItemByVariantId: () => undefined,
        openSidebar: jest.fn(),
        closeSidebar: mockCloseSidebar,
        toggleSidebar: jest.fn(),
      };
      return selector(state);
    });
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('visibility', () => {
    it('renders when sidebar is open', () => {
      setupMockStore([], true);

      render(<CartSidebar />);

      expect(screen.getByTestId('transition')).toHaveAttribute('data-show', 'true');
    });

    it('does not render content when sidebar is closed', () => {
      setupMockStore([], false);

      render(<CartSidebar />);

      expect(screen.getByTestId('transition')).toHaveAttribute('data-show', 'false');
    });
  });

  describe('empty state', () => {
    it('shows empty cart message when no items', () => {
      setupMockStore([], true);

      render(<CartSidebar />);

      expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();
    });

    it('shows browse products button when empty', () => {
      setupMockStore([], true);

      render(<CartSidebar />);

      expect(screen.getByRole('link', { name: /continue shopping/i })).toBeInTheDocument();
    });
  });

  describe('with items', () => {
    it('displays cart items', () => {
      const product = createMockProduct();
      const variant = createMockVariant();
      const items = [{ product, variant, quantity: 2 }];

      setupMockStore(items, true, 2, 59.98);

      render(<CartSidebar />);

      expect(screen.getByText('Test Product')).toBeInTheDocument();
    });

    it('displays cart summary', () => {
      const product = createMockProduct();
      const variant = createMockVariant();
      const items = [{ product, variant, quantity: 2 }];

      setupMockStore(items, true, 2, 59.98);

      render(<CartSidebar />);

      expect(screen.getByText(/subtotal/i)).toBeInTheDocument();
    });

    it('displays multiple items', () => {
      const product1 = createMockProduct('prod-1');
      const variant1 = createMockVariant('var-1');
      const product2 = { ...createMockProduct('prod-2'), name: 'Product Two' };
      const variant2 = createMockVariant('var-2');

      const items = [
        { product: product1, variant: variant1, quantity: 1 },
        { product: product2, variant: variant2, quantity: 2 },
      ];
      setupMockStore(items, true, 3, 89.97);

      render(<CartSidebar />);

      expect(screen.getByText('Test Product')).toBeInTheDocument();
      expect(screen.getByText('Product Two')).toBeInTheDocument();
    });
  });

  describe('header', () => {
    it('displays title with item count', () => {
      const product = createMockProduct();
      const variant = createMockVariant();
      const items = [{ product, variant, quantity: 3 }];
      setupMockStore(items, true, 3, 89.97);

      render(<CartSidebar />);

      expect(screen.getByText('Shopping Cart')).toBeInTheDocument();
      expect(screen.getByText(/3.*items/i)).toBeInTheDocument();
    });

    it('renders close button', () => {
      setupMockStore([], true);

      render(<CartSidebar />);

      const closeButton = screen.getByRole('button', { name: /close/i });
      expect(closeButton).toBeInTheDocument();
    });

    it('closes sidebar when close button clicked', () => {
      setupMockStore([], true);

      render(<CartSidebar />);

      const closeButton = screen.getByRole('button', { name: /close/i });
      fireEvent.click(closeButton);

      // Called twice: once from button, once from dialog onClose
      expect(mockCloseSidebar).toHaveBeenCalled();
    });
  });

  describe('item interactions', () => {
    it('calls incrementQuantity when increment button clicked', () => {
      const product = createMockProduct();
      const variant = createMockVariant();
      const items = [{ product, variant, quantity: 1 }];
      setupMockStore(items, true, 1, 29.99);

      render(<CartSidebar />);

      const incrementButton = screen.getByRole('button', { name: /increase quantity/i });
      fireEvent.click(incrementButton);

      expect(mockIncrementQuantity).toHaveBeenCalledWith(variant.id);
    });

    it('calls decrementQuantity when decrement button clicked', () => {
      const product = createMockProduct();
      const variant = createMockVariant();
      const items = [{ product, variant, quantity: 2 }];
      setupMockStore(items, true, 2, 59.98);

      render(<CartSidebar />);

      const decrementButton = screen.getByRole('button', { name: /decrease quantity/i });
      fireEvent.click(decrementButton);

      expect(mockDecrementQuantity).toHaveBeenCalledWith(variant.id);
    });

    it('has close button', () => {
      const product = createMockProduct();
      const variant = createMockVariant();
      const items = [{ product, variant, quantity: 1 }];
      setupMockStore(items, true, 1, 29.99);

      render(<CartSidebar />);

      const removeButton = screen.getByRole('button', { name: /remove/i });
      fireEvent.click(removeButton);

      expect(mockRemoveItem).toHaveBeenCalledWith(variant.id);
    });
  });

  describe('accessibility', () => {
    it('has accessible dialog role', () => {
      setupMockStore([], true);

      render(<CartSidebar />);

      expect(screen.getByTestId('dialog')).toBeInTheDocument();
    });

    it('close button has accessible label', () => {
      setupMockStore([], true);

      render(<CartSidebar />);

      expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument();
    });

    it('has semantic heading for title', () => {
      setupMockStore([], true);

      render(<CartSidebar />);

      const title = screen.getByText(/shopping cart/i);
      expect(title.tagName).toBe('H2');
    });
  });

  describe('layout', () => {
    it('renders sidebar variant for cart items', () => {
      const product = createMockProduct();
      const variant = createMockVariant();
      const items = [{ product, variant, quantity: 1 }];
      setupMockStore(items, true, 1, 29.99);

      render(<CartSidebar />);

      // Items should be rendered (verify by product name)
      expect(screen.getByText('Test Product')).toBeInTheDocument();
    });

    it('renders sidebar variant for cart summary', () => {
      const product = createMockProduct();
      const variant = createMockVariant();
      const items = [{ product, variant, quantity: 1 }];
      setupMockStore(items, true, 1, 29.99);

      render(<CartSidebar />);

      // Should show sidebar-specific buttons
      expect(screen.getByRole('link', { name: /continue shopping/i })).toBeInTheDocument();
    });
  });

  describe('edge cases', () => {
    it('handles rapid open/close toggles', () => {
      const { rerender } = render(<CartSidebar />);

      setupMockStore([], true);
      rerender(<CartSidebar />);
      expect(screen.getByTestId('transition')).toHaveAttribute('data-show', 'true');

      setupMockStore([], false);
      rerender(<CartSidebar />);
      expect(screen.getByTestId('transition')).toHaveAttribute('data-show', 'false');
    });

    it('handles large number of items', () => {
      const items = Array.from({ length: 20 }, (_, i) => ({
        product: { ...createMockProduct(`prod-${i}`), name: `Product ${i}` },
        variant: createMockVariant(`var-${i}`),
        quantity: 1,
      }));

      setupMockStore(items, true, 20, 599.8);

      render(<CartSidebar />);

      expect(screen.getByText('Shopping Cart')).toBeInTheDocument();
      expect(screen.getByText(/20.*items/i)).toBeInTheDocument();
    });
  });
});
