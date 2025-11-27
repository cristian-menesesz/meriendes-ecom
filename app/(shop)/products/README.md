# Products Feature

## Purpose

Displays product catalog with detailed product information, images, and purchase options.

## Key Components

- **`page.tsx`** - Product listing page using Server Components to fetch products from Supabase with ISR (1 hour revalidation)
- **`ProductListing.tsx`** (in `/components/products`) - Client-side wrapper handling add-to-cart functionality and user feedback
- **`ProductGrid.tsx`** (in `/components/products`) - Responsive grid layout for product cards
- **`ProductCard.tsx`** (in `/components/products`) - Reusable product card component with optimized images, price display, and quick-add functionality
- **`CategoryFilter.tsx`** (in `/components/products`) - Category navigation with active state highlighting
- **`SearchBar.tsx`** (in `/components/products`) - Product search with URL-based state management

## Data Flow

1. Server Component (`page.tsx`) fetches products based on URL search params (category, search query)
2. Data fetching functions in `lib/supabase/queries/products.ts`:
   - `getActiveProducts()` - All active products with variants and inventory
   - `getProductsByCategory(slug)` - Products filtered by category
   - `searchProducts(query)` - Products matching search term
   - `getActiveCategories()` - Categories for filter navigation
3. Products rendered via `ProductGrid` → `ProductCard` with Next.js Image optimization
4. `ProductListing` wraps grid with cart actions using Zustand store
5. Add-to-cart updates client-side state with optimistic UI feedback (toast notifications)

## Features

- **Server-Side Rendering**: Fast initial page load with SEO benefits
- **ISR Caching**: 1-hour revalidation for performance
- **Category Filtering**: URL-based filtering with shareable links
- **Search Functionality**: Real-time search with URL state
- **Inventory Awareness**: Only shows in-stock products
- **Quick Add**: Fast add-to-cart from listing page
- **Responsive Design**: Mobile-first grid layout
- **Image Optimization**: Lazy loading with Next.js Image component
