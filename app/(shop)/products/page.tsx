import { Suspense } from 'react';
import {
  getActiveProducts,
  getActiveCategories,
  searchProducts,
  getProductsByCategory,
} from '@/lib/supabase/queries/products';
import { CategoryFilter, SearchBar, ProductListing } from '@/components/products';
import { LoadingSpinner } from '@/components/ui';

/**
 * Product listing page with filtering, search, and category navigation.
 * Uses React Server Components for optimal performance and SEO.
 *
 * Implements:
 * - Server-side data fetching from Supabase
 * - Category-based filtering
 * - Search functionality
 * - Incremental Static Regeneration (ISR) for caching
 */

interface ProductPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

// Enable ISR with 1 hour revalidation
export const revalidate = 3600;

export const metadata = {
  title: 'Products | Meriendes E-commerce',
  description: 'Browse our selection of delicious meal options',
};

export default async function ProductsPage({ searchParams }: ProductPageProps) {
  const params = await searchParams;
  const categorySlug = typeof params.category === 'string' ? params.category : undefined;
  const searchQuery = typeof params.search === 'string' ? params.search : undefined;

  // Fetch categories for filter
  const categories = await getActiveCategories();

  // Fetch products based on filters
  let products: Awaited<ReturnType<typeof getActiveProducts>> = [];
  try {
    if (searchQuery) {
      products = await searchProducts(searchQuery);
    } else if (categorySlug) {
      products = await getProductsByCategory(categorySlug);
    } else {
      products = await getActiveProducts();
    }
  } catch (error) {
    console.error('Error fetching products:', error);
    products = [];
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Our Products</h1>
          <p className="mt-2 text-gray-600">
            Discover delicious, ready-to-eat meals delivered fresh to your door
          </p>
        </div>
      </header>

      {/* Filters & Search */}
      <div className="border-b border-gray-200 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="space-y-4">
            {/* Search Bar */}
            <Suspense fallback={<div className="h-10 animate-pulse rounded-lg bg-gray-200" />}>
              <SearchBar />
            </Suspense>

            {/* Category Filter */}
            <Suspense fallback={<div className="h-10 animate-pulse rounded-full bg-gray-200" />}>
              <CategoryFilter categories={categories} currentCategory={categorySlug} />
            </Suspense>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {searchQuery && (
          <div className="mb-6">
            <p className="text-sm text-gray-600">
              Search results for: <span className="font-semibold text-gray-900">{searchQuery}</span>
            </p>
            <p className="mt-1 text-sm text-gray-500">{products.length} products found</p>
          </div>
        )}

        <Suspense
          fallback={
            <div className="flex items-center justify-center py-12">
              <LoadingSpinner />
            </div>
          }
        >
          <ProductListing products={products} />
        </Suspense>
      </main>
    </div>
  );
}
