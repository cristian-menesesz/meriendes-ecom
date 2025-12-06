# Product Detail Page

## Purpose

Displays detailed information for a single product, including variants, pricing, stock availability, and purchase options. Optimized for SEO and performance using Next.js ISR.

## Key Components

- **page.tsx**: Server Component handling dynamic routing, ISR, SEO metadata, and JSON-LD structured data
- **ProductDetail.tsx** (`/components/products`): Client Component container managing variant selection, quantity, and cart operations
- **VariantSelector.tsx** (`/components/products`): Presentational component for choosing product variants with stock indicators
- **ProductImageGallery.tsx** (`/components/products`): Optimized image display with Next.js Image component

## Data Flow

1. **Page Route** (`page.tsx`):
   - Uses `generateStaticParams()` to pre-render product paths at build time
   - Calls `getProductBySlug()` to fetch product data server-side
   - Generates dynamic metadata (title, description, OpenGraph, Twitter cards)
   - Injects JSON-LD structured data for rich search results
   - Implements ISR with 1-hour revalidation (`revalidate: 3600`)

2. **Query Function** (`getProductBySlug`):
   - Fetches single product by slug with variants and inventory
   - Validates product is active and has active variants
   - Returns null for inactive/missing products (triggers 404)
   - Handles PGRST116 error gracefully

3. **ProductDetail Container**:
   - Receives `ProductWithDetails` from server
   - Manages state: `selectedVariant`, `quantity`
   - Filters active variants with available stock
   - Provides handlers: `handleQuantityChange`, `handleAddToCart`
   - Integrates with Zustand cart store
   - Renders child components with proper props

4. **VariantSelector Presentation**:
   - Receives variants array, selected state, onChange callback
   - Displays variant options with prices and stock indicators
   - Disables out-of-stock variants
   - Calls parent's `onVariantChange` on selection

5. **ProductImageGallery Presentation**:
   - Receives images array and product name
   - Displays main image with priority loading (LCP optimization)
   - Renders thumbnail navigation (prepared for multiple images)
   - Shows fallback UI for missing images

## Features

### SEO Optimization

- **Dynamic Metadata**: Title, description, OpenGraph tags, Twitter cards
- **JSON-LD Structured Data**: Product schema with AggregateOffer for price range
- **ISR**: Static generation with hourly revalidation for best of both worlds
- **Canonical URLs**: Proper slug-based routing

### Performance

- **ISR (Incremental Static Regeneration)**: Fast page loads with automatic updates
- **Next.js Image**: Automatic optimization, responsive images, priority loading
- **generateStaticParams**: Pre-render popular products at build time
- **Code Splitting**: Client-side interactivity loaded separately from static content

### User Experience

- **Variant Selection**: Visual indicators for stock status (in stock, low stock, out of stock)
- **Quantity Management**: Min/max validation, increment/decrement buttons
- **Stock Indicators**: Real-time availability with low stock warnings
- **Add to Cart**: Validation, toast notifications, quantity reset
- **Breadcrumb Navigation**: Easy navigation back to category/all products
- **Product Badges**: Featured and seasonal indicators
- **Compare-at-Price**: Displays original price and savings

## Testing

Comprehensive test coverage (42 tests across 3 components):

- **VariantSelector**: 18 tests covering rendering, selection state, stock indicators, user interaction, edge cases, accessibility
- **ProductImageGallery**: 24 tests covering single/multiple images, image switching, fallback UI, alt text handling, accessibility, edge cases

Tests follow professional standards:

- Render testing with React Testing Library
- User interaction simulation with userEvent
- Accessibility verification (ARIA labels, keyboard access)
- Edge case handling (null values, empty arrays)
- Isolated unit testing with mocked dependencies

## Directory Structure

```
app/(shop)/products/[slug]/
  ├── page.tsx          # Server Component with ISR and SEO
  └── README.md         # This file

lib/supabase/queries/
  └── products.ts       # Contains getProductBySlug()

components/products/
  ├── ProductDetail.tsx      # Container component
  ├── VariantSelector.tsx    # Presentation component
  └── ProductImageGallery.tsx # Presentation component

__tests__/components/products/
  ├── VariantSelector.test.tsx      # 18 tests
  └── ProductImageGallery.test.tsx  # 24 tests
```

## Key Technologies

- **Next.js 16 App Router**: Dynamic routing, ISR, Server Components
- **React Server Components**: Fetch data on server, reduce client bundle
- **TypeScript**: Strict type safety across all components
- **Zustand**: Global cart state management
- **Supabase**: Product data with RLS policies
- **Jest + React Testing Library**: Comprehensive test coverage
- **Tailwind CSS**: Responsive styling
- **Next.js Image**: Automatic image optimization

## Future Enhancements

- Product reviews and ratings
- Related products section
- Product comparison feature
- Save to wishlist functionality
- Multiple product images with gallery lightbox
- Product video support
- Size guide modal
- Stock notifications for out-of-stock items
