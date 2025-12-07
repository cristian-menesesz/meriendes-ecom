'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui';
import { formatCurrency } from '@/lib/utils/currency';
import type { CartItem as CartItemType } from '@/types';

export interface CartItemProps {
  item: CartItemType;
  onIncrement: () => void;
  onDecrement: () => void;
  onRemove: () => void;
  variant?: 'sidebar' | 'page';
}

/**
 * Cart item display component with quantity controls and remove button.
 * Supports both sidebar and full page display variants.
 *
 * Features:
 * - Product image with link to product page
 * - Variant name and price display
 * - Quantity increment/decrement controls
 * - Remove item button
 * - Subtotal calculation
 *
 * @param {CartItemProps} props - Cart item data and action handlers.
 */
export function CartItem({
  item,
  onIncrement,
  onDecrement,
  onRemove,
  variant = 'page',
}: CartItemProps) {
  const { product, variant: productVariant, quantity } = item;
  const subtotal = productVariant.price * quantity;
  const isSidebar = variant === 'sidebar';

  return (
    <div
      className={`flex gap-4 ${
        isSidebar ? 'py-4' : 'py-6'
      } border-b border-gray-200 last:border-b-0`}
    >
      {/* Product Image */}
      <Link
        href={`/products/${product.slug}`}
        className="shrink-0 overflow-hidden rounded-lg bg-gray-100"
      >
        <Image
          src={product.imageUrl || '/placeholder-product.png'}
          alt={product.name}
          width={isSidebar ? 80 : 120}
          height={isSidebar ? 80 : 120}
          className="h-20 w-20 object-cover object-center sm:h-24 sm:w-24"
        />
      </Link>

      {/* Product Details */}
      <div className="flex flex-1 flex-col">
        <div className="flex justify-between">
          <div className="flex-1">
            {/* Product Name */}
            <Link
              href={`/products/${product.slug}`}
              className="text-sm font-medium text-gray-900 hover:text-gray-700"
            >
              {product.name}
            </Link>

            {/* Variant Name */}
            <p className="mt-1 text-xs text-gray-600">{productVariant.variantName}</p>

            {/* SKU - Page view only */}
            {!isSidebar && <p className="mt-1 text-xs text-gray-500">SKU: {productVariant.sku}</p>}

            {/* Price per unit */}
            <p className="mt-1 text-sm font-medium text-gray-900">
              {formatCurrency(productVariant.price)}
              {!isSidebar && <span className="text-gray-500"> each</span>}
            </p>
          </div>

          {/* Remove Button - Sidebar */}
          {isSidebar && (
            <button
              type="button"
              onClick={onRemove}
              className="text-gray-400 transition-colors hover:text-red-500"
              aria-label={`Remove ${product.name} from cart`}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Quantity Controls and Subtotal */}
        <div className="mt-3 flex items-center justify-between">
          {/* Quantity Controls */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onDecrement}
              aria-label="Decrease quantity"
              className="h-8 w-8 p-0"
            >
              {quantity === 1 ? (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              ) : (
                <span className="text-lg">−</span>
              )}
            </Button>

            <span className="min-w-8 text-center text-sm font-medium text-gray-900">
              {quantity}
            </span>

            <Button
              variant="outline"
              size="sm"
              onClick={onIncrement}
              aria-label="Increase quantity"
              className="h-8 w-8 p-0"
            >
              <span className="text-lg">+</span>
            </Button>
          </div>

          {/* Subtotal */}
          <div className="text-right">
            <p className="text-sm font-semibold text-gray-900">{formatCurrency(subtotal)}</p>
            {!isSidebar && quantity > 1 && (
              <p className="text-xs text-gray-500">
                {quantity} × {formatCurrency(productVariant.price)}
              </p>
            )}
          </div>
        </div>

        {/* Remove Button - Page view */}
        {!isSidebar && (
          <div className="mt-3">
            <button
              type="button"
              onClick={onRemove}
              className="text-sm font-medium text-red-600 hover:text-red-500"
            >
              Remove
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
