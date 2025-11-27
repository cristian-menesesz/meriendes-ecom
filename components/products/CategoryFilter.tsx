'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import type { ProductCategory } from '@/types';

export interface CategoryFilterProps {
  categories: ProductCategory[];
  currentCategory?: string;
}

/**
 * Displays a horizontal list of category filters for product navigation.
 * Highlights the currently selected category.
 *
 * @param {CategoryFilterProps} props - Categories and current selection.
 */
export function CategoryFilter({ categories, currentCategory }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <Link
        href="/products"
        className={cn(
          'rounded-full px-4 py-2 text-sm font-medium transition-colors',
          !currentCategory ? 'bg-black text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        )}
      >
        All Products
      </Link>

      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/products?category=${category.slug}`}
          className={cn(
            'rounded-full px-4 py-2 text-sm font-medium transition-colors',
            currentCategory === category.slug
              ? 'bg-black text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          )}
        >
          {category.name}
        </Link>
      ))}
    </div>
  );
}
