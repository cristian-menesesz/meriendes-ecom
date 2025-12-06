'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui';
import { formatCurrency } from '@/lib/utils/currency';
import { useCartStore } from '@/store/cartStore';
import { toast } from 'sonner';
import { ProductImageGallery } from './ProductImageGallery';
import { VariantSelector } from './VariantSelector';
import type { ProductWithDetails } from '@/lib/supabase/queries/products';
import type { ProductVariant } from '@/types';

export interface ProductDetailProps {
  product: ProductWithDetails;
}

/**
 * Product detail view component with full product information and purchase options.
 * Implements container pattern: manages state and business logic for variant selection and cart operations.
 *
 * Features:
 * - Variant selection with stock validation
 * - Quantity management
 * - Add to cart functionality
 * - Breadcrumb navigation
 * - Product specifications display
 * - Stock availability indicators
 *
 * @param {ProductDetailProps} props - Product with full details including variants and inventory.
 */
export function ProductDetail({ product }: ProductDetailProps) {
  const addItem = useCartStore((state) => state.addItem);

  // Get active variants with inventory
  const activeVariants = product.variants.filter(
    (v) => v.isActive && (v.inventory ? v.inventory.quantityAvailable > 0 : false)
  );

  // State management - use the extended variant type with inventory
  type VariantWithInventory = ProductVariant & {
    inventory: { quantityAvailable: number; lowStockThreshold: number } | null;
  };
  const [selectedVariant, setSelectedVariant] = useState<VariantWithInventory | null>(
    activeVariants[0] || null
  );
  const [quantity, setQuantity] = useState(1);

  const maxQuantity = selectedVariant?.inventory?.quantityAvailable || 0;
  const isLowStock =
    maxQuantity > 0 && maxQuantity <= (selectedVariant?.inventory?.lowStockThreshold || 5);

  // Handlers
  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= maxQuantity) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    if (!selectedVariant) {
      toast.error('Please select a variant');
      return;
    }

    if (quantity > maxQuantity) {
      toast.error(`Only ${maxQuantity} items available in stock`);
      return;
    }

    addItem(product, selectedVariant, quantity);
    toast.success(`Added ${quantity}x ${product.name} (${selectedVariant.variantName}) to cart`);

    // Reset quantity after adding
    setQuantity(1);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb Navigation */}
      <nav className="mb-8 flex items-center space-x-2 text-sm text-gray-600">
        <Link href="/products" className="hover:text-gray-900">
          Products
        </Link>
        <span>/</span>
        {product.category && (
          <>
            <Link
              href={`/products?category=${product.category.slug}`}
              className="hover:text-gray-900"
            >
              {product.category.name}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="text-gray-900">{product.name}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Left Column: Images */}
        <div>
          <ProductImageGallery
            images={product.imageUrl ? [{ url: product.imageUrl, alt: product.name }] : []}
            productName={product.name}
          />
        </div>

        {/* Right Column: Product Info */}
        <div className="flex flex-col">
          {/* Title & Category */}
          <div className="mb-4">
            {product.category && (
              <Link
                href={`/products?category=${product.category.slug}`}
                className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
              >
                {product.category.name}
              </Link>
            )}
            <h1 className="mt-2 text-3xl font-bold text-gray-900">{product.name}</h1>
          </div>

          {/* Price */}
          <div className="mb-6">
            <p className="text-3xl font-bold text-gray-900">
              {selectedVariant ? formatCurrency(selectedVariant.price) : '—'}
            </p>
            {selectedVariant?.compareAtPrice &&
              selectedVariant.compareAtPrice > selectedVariant.price && (
                <p className="mt-1 text-sm text-gray-500">
                  <span className="line-through">
                    {formatCurrency(selectedVariant.compareAtPrice)}
                  </span>
                  <span className="ml-2 text-red-600">
                    Save {formatCurrency(selectedVariant.compareAtPrice - selectedVariant.price)}
                  </span>
                </p>
              )}
          </div>

          {/* Description */}
          {product.description && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Description</h2>
              <p className="mt-2 whitespace-pre-line text-gray-600">{product.description}</p>
            </div>
          )}

          {/* Variant Selector */}
          {activeVariants.length > 1 && (
            <div className="mb-6">
              <VariantSelector
                variants={activeVariants}
                selectedVariant={selectedVariant}
                onVariantChange={setSelectedVariant}
              />
            </div>
          )}

          {/* Stock Status */}
          {selectedVariant && (
            <div className="mb-6">
              {maxQuantity === 0 && (
                <p className="text-sm font-semibold text-red-600">Out of Stock</p>
              )}
              {isLowStock && maxQuantity > 0 && (
                <p className="text-sm font-semibold text-orange-600">
                  Only {maxQuantity} left in stock!
                </p>
              )}
              {!isLowStock && maxQuantity > 0 && (
                <p className="text-sm font-semibold text-green-600">In Stock</p>
              )}
            </div>
          )}

          {/* Quantity Selector */}
          {selectedVariant && maxQuantity > 0 && (
            <div className="mb-6">
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-900">
                Quantity
              </label>
              <div className="mt-2 flex items-center space-x-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                >
                  −
                </Button>
                <input
                  id="quantity"
                  type="number"
                  min="1"
                  max={maxQuantity}
                  value={quantity}
                  onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                  className="w-20 rounded-md border border-gray-300 px-3 py-2 text-center focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= maxQuantity}
                  aria-label="Increase quantity"
                >
                  +
                </Button>
                <span className="text-sm text-gray-600">of {maxQuantity} available</span>
              </div>
            </div>
          )}

          {/* Add to Cart Button */}
          <div className="mb-8">
            <Button
              size="lg"
              onClick={handleAddToCart}
              disabled={!selectedVariant || maxQuantity === 0}
              className="w-full"
            >
              {!selectedVariant
                ? 'Select a variant'
                : maxQuantity === 0
                  ? 'Out of Stock'
                  : 'Add to Cart'}
            </Button>
          </div>

          {/* Product Features/Badges */}
          <div className="flex flex-wrap gap-2 border-t border-gray-200 pt-6">
            {product.isFeatured && (
              <span className="inline-flex items-center rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-800">
                ⭐ Featured
              </span>
            )}
            {product.isSeasonal && (
              <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
                🌿 Seasonal
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
