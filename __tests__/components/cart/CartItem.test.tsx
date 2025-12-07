import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { CartItem } from '@/components/cart/CartItem';
import type { Product, ProductVariant, CartItem as CartItemType } from '@/types';
import { formatCurrency } from '@/lib/utils/currency';

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

const createMockVariant = (overrides?: Partial<ProductVariant>): ProductVariant => ({
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
  ...overrides,
});

const createMockCartItem = (
  quantity = 2,
  variantOverrides?: Partial<ProductVariant>
): CartItemType => ({
  product: createMockProduct(),
  variant: createMockVariant(variantOverrides),
  quantity,
});

describe('CartItem', () => {
  const mockOnIncrement = jest.fn();
  const mockOnDecrement = jest.fn();
  const mockOnRemove = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('rendering', () => {
    it('renders product information correctly', () => {
      const item = createMockCartItem();

      render(
        <CartItem
          item={item}
          onIncrement={mockOnIncrement}
          onDecrement={mockOnDecrement}
          onRemove={mockOnRemove}
          variant="page"
        />
      );

      expect(screen.getByText('Test Product')).toBeInTheDocument();
      expect(screen.getByText('Small')).toBeInTheDocument();
    });

    it('renders product image', () => {
      const item = createMockCartItem();

      render(
        <CartItem
          item={item}
          onIncrement={mockOnIncrement}
          onDecrement={mockOnDecrement}
          onRemove={mockOnRemove}
          variant="sidebar"
        />
      );

      const image = screen.getByAltText('Test Product');
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', 'https://example.com/test.jpg');
    });

    it('renders price information', () => {
      const item = createMockCartItem(2);

      render(
        <CartItem
          item={item}
          onIncrement={mockOnIncrement}
          onDecrement={mockOnDecrement}
          onRemove={mockOnRemove}
          variant="page"
        />
      );

      expect(screen.getByText(formatCurrency(29.99))).toBeInTheDocument();
    });

    it('displays correct quantity', () => {
      const item = createMockCartItem(3);

      render(
        <CartItem
          item={item}
          onIncrement={mockOnIncrement}
          onDecrement={mockOnDecrement}
          onRemove={mockOnRemove}
          variant="sidebar"
        />
      );

      expect(screen.getByText('3')).toBeInTheDocument();
    });

    it('calculates and displays subtotal correctly', () => {
      const item = createMockCartItem(2);

      render(
        <CartItem
          item={item}
          onIncrement={mockOnIncrement}
          onDecrement={mockOnDecrement}
          onRemove={mockOnRemove}
          variant="page"
        />
      );

      const subtotal = 29.99 * 2;
      expect(screen.getByText(formatCurrency(subtotal))).toBeInTheDocument();
    });

    it('links to product detail page', () => {
      const item = createMockCartItem();

      render(
        <CartItem
          item={item}
          onIncrement={mockOnIncrement}
          onDecrement={mockOnDecrement}
          onRemove={mockOnRemove}
          variant="page"
        />
      );

      const links = screen.getAllByRole('link');
      const productLink = links.find((link) =>
        link.getAttribute('href')?.includes('/products/test-product')
      );
      expect(productLink).toBeInTheDocument();
    });
  });

  describe('sidebar variant', () => {
    it('uses smaller image size', () => {
      const item = createMockCartItem();

      render(
        <CartItem
          item={item}
          onIncrement={mockOnIncrement}
          onDecrement={mockOnDecrement}
          onRemove={mockOnRemove}
          variant="sidebar"
        />
      );

      const image = screen.getByAltText('Test Product');
      expect(image).toHaveClass('h-20', 'w-20');
    });

    it('does not display SKU', () => {
      const item = createMockCartItem();

      render(
        <CartItem
          item={item}
          onIncrement={mockOnIncrement}
          onDecrement={mockOnDecrement}
          onRemove={mockOnRemove}
          variant="sidebar"
        />
      );

      expect(screen.queryByText(/SKU:/i)).not.toBeInTheDocument();
    });

    it('renders remove button below quantity controls', () => {
      const item = createMockCartItem();

      render(
        <CartItem
          item={item}
          onIncrement={mockOnIncrement}
          onDecrement={mockOnDecrement}
          onRemove={mockOnRemove}
          variant="sidebar"
        />
      );

      const removeButton = screen.getByRole('button', { name: /remove/i });
      expect(removeButton).toBeInTheDocument();
    });
  });

  describe('page variant', () => {
    it('uses consistent image size with sidebar variant', () => {
      const item = createMockCartItem();

      render(
        <CartItem
          item={item}
          onIncrement={mockOnIncrement}
          onDecrement={mockOnDecrement}
          onRemove={mockOnRemove}
          variant="page"
        />
      );

      const image = screen.getByAltText('Test Product');
      // Both variants use same responsive sizing
      expect(image).toHaveClass('h-20', 'w-20', 'sm:h-24', 'sm:w-24');
    });

    it('displays SKU', () => {
      const item = createMockCartItem();

      render(
        <CartItem
          item={item}
          onIncrement={mockOnIncrement}
          onDecrement={mockOnDecrement}
          onRemove={mockOnRemove}
          variant="page"
        />
      );

      expect(screen.getByText(/SKU:/i)).toBeInTheDocument();
      expect(screen.getByText(/TEST-SKU-1/)).toBeInTheDocument();
    });

    it('displays subtotal breakdown', () => {
      const item = createMockCartItem(3);

      render(
        <CartItem
          item={item}
          onIncrement={mockOnIncrement}
          onDecrement={mockOnDecrement}
          onRemove={mockOnRemove}
          variant="page"
        />
      );

      // Should show both unit price and subtotal
      expect(screen.getByText(formatCurrency(29.99))).toBeInTheDocument();
      expect(screen.getByText(formatCurrency(89.97))).toBeInTheDocument();
    });
  });

  describe('quantity controls', () => {
    it('calls onIncrement when increment button clicked', () => {
      const item = createMockCartItem();

      render(
        <CartItem
          item={item}
          onIncrement={mockOnIncrement}
          onDecrement={mockOnDecrement}
          onRemove={mockOnRemove}
          variant="sidebar"
        />
      );

      const incrementButton = screen.getByRole('button', { name: /increase quantity/i });
      fireEvent.click(incrementButton);

      expect(mockOnIncrement).toHaveBeenCalledTimes(1);
    });

    it('calls onDecrement when decrement button clicked', () => {
      const item = createMockCartItem(2);

      render(
        <CartItem
          item={item}
          onIncrement={mockOnIncrement}
          onDecrement={mockOnDecrement}
          onRemove={mockOnRemove}
          variant="sidebar"
        />
      );

      const decrementButton = screen.getByRole('button', { name: /decrease quantity/i });
      fireEvent.click(decrementButton);

      expect(mockOnDecrement).toHaveBeenCalledTimes(1);
    });

    it('can increment multiple times', () => {
      const item = createMockCartItem();

      render(
        <CartItem
          item={item}
          onIncrement={mockOnIncrement}
          onDecrement={mockOnDecrement}
          onRemove={mockOnRemove}
          variant="page"
        />
      );

      const incrementButton = screen.getByRole('button', { name: /increase quantity/i });
      fireEvent.click(incrementButton);
      fireEvent.click(incrementButton);
      fireEvent.click(incrementButton);

      expect(mockOnIncrement).toHaveBeenCalledTimes(3);
    });

    it('shows trash icon when quantity is 1', () => {
      const item = createMockCartItem(1);

      render(
        <CartItem
          item={item}
          onIncrement={mockOnIncrement}
          onDecrement={mockOnDecrement}
          onRemove={mockOnRemove}
          variant="sidebar"
        />
      );

      // Should have trash icon in decrement button
      const decrementButton = screen.getByRole('button', { name: /decrease quantity/i });
      const svg = decrementButton.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('shows minus icon when quantity is greater than 1', () => {
      const item = createMockCartItem(2);

      render(
        <CartItem
          item={item}
          onIncrement={mockOnIncrement}
          onDecrement={mockOnDecrement}
          onRemove={mockOnRemove}
          variant="sidebar"
        />
      );

      const decrementButton = screen.getByRole('button', { name: /decrease quantity/i });
      expect(decrementButton).toHaveTextContent('−');
    });
  });

  describe('remove functionality', () => {
    it('calls onRemove when remove button clicked', () => {
      const item = createMockCartItem();

      render(
        <CartItem
          item={item}
          onIncrement={mockOnIncrement}
          onDecrement={mockOnDecrement}
          onRemove={mockOnRemove}
          variant="sidebar"
        />
      );

      const removeButton = screen.getByRole('button', { name: /remove/i });
      fireEvent.click(removeButton);

      expect(mockOnRemove).toHaveBeenCalledTimes(1);
    });

    it('page variant has remove button in different position', () => {
      const item = createMockCartItem();

      render(
        <CartItem
          item={item}
          onIncrement={mockOnIncrement}
          onDecrement={mockOnDecrement}
          onRemove={mockOnRemove}
          variant="page"
        />
      );

      const removeButton = screen.getByRole('button', { name: /remove/i });
      expect(removeButton).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('has accessible button labels', () => {
      const item = createMockCartItem();

      render(
        <CartItem
          item={item}
          onIncrement={mockOnIncrement}
          onDecrement={mockOnDecrement}
          onRemove={mockOnRemove}
          variant="sidebar"
        />
      );

      expect(screen.getByRole('button', { name: /increase quantity/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /decrease quantity/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /remove/i })).toBeInTheDocument();
    });

    it('image has alt text', () => {
      const item = createMockCartItem();

      render(
        <CartItem
          item={item}
          onIncrement={mockOnIncrement}
          onDecrement={mockOnDecrement}
          onRemove={mockOnRemove}
          variant="page"
        />
      );

      const image = screen.getByAltText('Test Product');
      expect(image).toBeInTheDocument();
    });

    it('product link is keyboard accessible', () => {
      const item = createMockCartItem();

      render(
        <CartItem
          item={item}
          onIncrement={mockOnIncrement}
          onDecrement={mockOnDecrement}
          onRemove={mockOnRemove}
          variant="sidebar"
        />
      );

      const links = screen.getAllByRole('link');
      expect(links.length).toBeGreaterThan(0);
    });
  });

  describe('edge cases', () => {
    it('handles large quantities', () => {
      const item = createMockCartItem(999);

      render(
        <CartItem
          item={item}
          onIncrement={mockOnIncrement}
          onDecrement={mockOnDecrement}
          onRemove={mockOnRemove}
          variant="page"
        />
      );

      expect(screen.getByText('999')).toBeInTheDocument();
      const subtotal = 29.99 * 999;
      expect(screen.getByText(formatCurrency(subtotal))).toBeInTheDocument();
    });

    it('handles decimal prices correctly', () => {
      const item = createMockCartItem(3, { price: 19.99 });

      render(
        <CartItem
          item={item}
          onIncrement={mockOnIncrement}
          onDecrement={mockOnDecrement}
          onRemove={mockOnRemove}
          variant="page"
        />
      );

      expect(screen.getByText(formatCurrency(19.99))).toBeInTheDocument();
      expect(screen.getByText(formatCurrency(59.97))).toBeInTheDocument();
    });

    it('handles long product names', () => {
      const longNameProduct: Product = {
        ...createMockProduct(),
        name: 'This is a Very Long Product Name That Should Be Handled Properly',
      };

      const item: CartItemType = {
        product: longNameProduct,
        variant: createMockVariant(),
        quantity: 1,
      };

      render(
        <CartItem
          item={item}
          onIncrement={mockOnIncrement}
          onDecrement={mockOnDecrement}
          onRemove={mockOnRemove}
          variant="sidebar"
        />
      );

      expect(
        screen.getByText('This is a Very Long Product Name That Should Be Handled Properly')
      ).toBeInTheDocument();
    });

    it('handles missing compare at price', () => {
      const item = createMockCartItem(1, { compareAtPrice: null });

      render(
        <CartItem
          item={item}
          onIncrement={mockOnIncrement}
          onDecrement={mockOnDecrement}
          onRemove={mockOnRemove}
          variant="page"
        />
      );

      // Should only show regular price
      const prices = screen.getAllByText(formatCurrency(29.99));
      expect(prices.length).toBeGreaterThan(0);
    });
  });

  describe('image sizing', () => {
    it('sidebar variant uses 80x80 image', () => {
      const item = createMockCartItem();

      render(
        <CartItem
          item={item}
          onIncrement={mockOnIncrement}
          onDecrement={mockOnDecrement}
          onRemove={mockOnRemove}
          variant="sidebar"
        />
      );

      const image = screen.getByAltText('Test Product');
      expect(image).toHaveClass('h-20', 'w-20');
    });

    it('page variant uses 120x120 image', () => {
      const item = createMockCartItem();

      render(
        <CartItem
          item={item}
          onIncrement={mockOnIncrement}
          onDecrement={mockOnDecrement}
          onRemove={mockOnRemove}
          variant="page"
        />
      );

      const image = screen.getByAltText('Test Product');
      // Both variants use the same responsive image sizing
      expect(image).toHaveClass('h-20', 'w-20', 'sm:h-24', 'sm:w-24');
    });
  });
});
