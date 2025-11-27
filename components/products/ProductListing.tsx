'use client';

import { toast } from 'sonner';
import { ProductGrid } from '@/components/products';
import { useCartStore } from '@/store/cartStore';
import type { ProductWithDetails } from '@/lib/supabase/queries/products';
import type { Product, ProductVariant } from '@/types';

export interface ProductListingProps {
  products: ProductWithDetails[];
}

/**
 * Client-side wrapper for product listing with cart functionality.
 * Handles add-to-cart interactions and provides user feedback.
 *
 * @param {ProductListingProps} props - Products to display.
 */
export function ProductListing({ products }: ProductListingProps) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (product: Product, variant: ProductVariant) => {
    addItem(product, variant, 1);
    toast.success(`Added ${product.name} (${variant.variantName}) to cart`);
  };

  return <ProductGrid products={products} onAddToCart={handleAddToCart} />;
}
