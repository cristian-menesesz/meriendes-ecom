'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui';
import { formatCurrency } from '@/lib/utils/currency';
import type { Product, ProductVariant, Inventory } from '@/types';

export interface ProductCardProps {
  product: Product;
  variants: (ProductVariant & { inventory: Inventory | null })[];
  onAddToCart?: (product: Product, variant: ProductVariant) => void;
}

/**
 * Displays a single product card with image, name, price range, and quick add-to-cart.
 * Optimized for SEO and LCP by using next/image with priority loading.
 * Follows separation of concerns: purely presentational component.
 *
 * @param {ProductCardProps} props - Product data and callback.
 */
export function ProductCard({ product, variants, onAddToCart }: ProductCardProps) {
  // Get active variants with available inventory
  const activeVariants = variants.filter(
    (v) => v.isActive && (v.inventory ? v.inventory.quantityAvailable > 0 : false)
  );

  // Calculate price range
  const prices = activeVariants.map((v) => v.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  const priceDisplay =
    minPrice === maxPrice
      ? formatCurrency(minPrice)
      : `${formatCurrency(minPrice)} - ${formatCurrency(maxPrice)}`;

  const hasStock = activeVariants.length > 0;

  // Get the lowest-priced active variant for quick add
  const defaultVariant = activeVariants.sort((a, b) => a.price - b.price)[0];

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onAddToCart && defaultVariant) {
      onAddToCart(product, defaultVariant);
    }
  };

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block overflow-hidden rounded-lg border border-gray-200 bg-white transition-shadow hover:shadow-lg"
    >
      {/* Product Image */}
      <div className="relative aspect-square w-full overflow-hidden bg-gray-100">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform group-hover:scale-105"
            priority={product.isFeatured}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-400">No Image</div>
        )}

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.isFeatured && (
            <span className="rounded-full bg-yellow-400 px-2 py-1 text-xs font-semibold text-black">
              Featured
            </span>
          )}
          {product.isSeasonal && (
            <span className="rounded-full bg-green-500 px-2 py-1 text-xs font-semibold text-white">
              Seasonal
            </span>
          )}
          {!hasStock && (
            <span className="rounded-full bg-red-500 px-2 py-1 text-xs font-semibold text-white">
              Out of Stock
            </span>
          )}
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-black">
          {product.name}
        </h3>

        {product.shortDescription && (
          <p className="mt-1 line-clamp-2 text-sm text-gray-600">{product.shortDescription}</p>
        )}

        <div className="mt-3 flex items-center justify-between">
          <p className="text-lg font-bold text-gray-900">{priceDisplay}</p>

          {hasStock && onAddToCart && (
            <Button
              size="sm"
              onClick={handleQuickAdd}
              className="opacity-0 transition-opacity group-hover:opacity-100"
              aria-label={`Add ${product.name} to cart`}
            >
              Quick Add
            </Button>
          )}
        </div>

        {/* Variant count */}
        {activeVariants.length > 1 && (
          <p className="mt-2 text-xs text-gray-500">{activeVariants.length} sizes available</p>
        )}
      </div>
    </Link>
  );
}
