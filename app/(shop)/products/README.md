# Products Feature

## Purpose

Displays product catalog with detailed product information, images, and purchase options.

## Key Components

- **`page.tsx`** - Product listing page using Server Components to fetch products from Supabase
- **`[id]/page.tsx`** - Individual product detail page with add-to-cart functionality
- **`ProductCard.tsx`** (in `/components/products`) - Reusable product card component with optimized images

## Data Flow

1. Server Component fetches active products from Supabase using `getActiveProducts()` or `getProductById()`
2. Products are rendered with Next.js Image optimization for LCP improvement
3. Add-to-cart actions update Zustand cart store
4. TanStack Query caches product data and handles background refetching
