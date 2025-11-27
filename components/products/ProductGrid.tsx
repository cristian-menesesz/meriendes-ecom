import { ProductCard } from './ProductCard';
import type { ProductWithDetails } from '@/lib/supabase/queries/products';
import type { Product, ProductVariant } from '@/types';

export interface ProductGridProps {
  products: ProductWithDetails[];
  onAddToCart?: (product: Product, variant: ProductVariant) => void;
}

/**
 * Displays a responsive grid of product cards.
 * Server component that renders the product catalog.
 *
 * @param {ProductGridProps} props - Products array and add-to-cart callback.
 */
export function ProductGrid({ products, onAddToCart }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-lg text-gray-600">No products found</p>
        <p className="mt-2 text-sm text-gray-500">Check back soon for new items!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          variants={product.variants}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
}
