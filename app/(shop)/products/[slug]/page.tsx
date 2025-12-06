import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getProductBySlug, getActiveProducts } from '@/lib/supabase/queries/products';
import { ProductDetail } from '@/components/products/ProductDetail';
import { LoadingSpinner } from '@/components/ui';

/**
 * Product detail page with dynamic routing by slug.
 * Implements:
 * - Server-side data fetching with error handling
 * - SEO optimization with dynamic metadata
 * - Incremental Static Regeneration (ISR)
 * - Static path generation for build-time optimization
 * - Structured data (JSON-LD) for search engines
 */

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

// Enable ISR with 1 hour revalidation
export const revalidate = 3600;

// Generate static paths at build time for active products
export async function generateStaticParams() {
  try {
    const products = await getActiveProducts();
    return products.map((product) => ({
      slug: product.slug,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const product = await getProductBySlug(slug);

    if (!product) {
      return {
        title: 'Product Not Found',
        description: 'The product you are looking for does not exist.',
      };
    }

    // Calculate price range for description
    const prices = product.variants.filter((v) => v.isActive).map((v) => v.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const priceText =
      minPrice === maxPrice
        ? `$${minPrice.toFixed(2)}`
        : `$${minPrice.toFixed(2)} - $${maxPrice.toFixed(2)}`;

    const description =
      product.shortDescription ||
      product.description ||
      `Buy ${product.name} starting at ${priceText}. Fresh, delicious, and ready to enjoy.`;

    return {
      title: `${product.name} | Meriendes E-commerce`,
      description: description.substring(0, 160), // SEO optimal length
      keywords: [product.name, product.category?.name || '', 'meal', 'food delivery'],
      openGraph: {
        title: product.name,
        description,
        images: product.imageUrl ? [{ url: product.imageUrl, alt: product.name }] : [],
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: product.name,
        description,
        images: product.imageUrl ? [product.imageUrl] : [],
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Product | Meriendes E-commerce',
      description: 'View product details',
    };
  }
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params;

  let product;
  try {
    product = await getProductBySlug(slug);
  } catch (error) {
    console.error('Error fetching product:', error);
    notFound();
  }

  if (!product) {
    notFound();
  }

  // Generate JSON-LD structured data for SEO
  const activeVariants = product.variants.filter((v) => v.isActive);
  const prices = activeVariants.map((v) => v.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description || product.shortDescription,
    image: product.imageUrl || '',
    brand: {
      '@type': 'Brand',
      name: 'Meriendes',
    },
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'USD',
      lowPrice: minPrice,
      highPrice: maxPrice,
      availability:
        activeVariants.length > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    },
  };

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-white">
        <Suspense
          fallback={
            <div className="flex min-h-screen items-center justify-center">
              <LoadingSpinner />
            </div>
          }
        >
          <ProductDetail product={product} />
        </Suspense>
      </div>
    </>
  );
}
