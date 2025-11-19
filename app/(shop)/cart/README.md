# Cart Feature

## Purpose

Manages shopping cart with add/remove/update quantity operations and displays cart summary.

## Key Components

- **`page.tsx`** - Cart page displaying all cart items with quantity controls
- **`CartItem.tsx`** (in `/components/cart`) - Individual cart item component
- **`CartSummary.tsx`** (in `/components/cart`) - Cart total and checkout button

## Data Flow

1. Zustand store (`useCartStore`) manages cart state on the client
2. Cart state is persisted to localStorage for session continuity
3. Product data is cross-referenced with Supabase for current prices and availability
4. User proceeds to checkout when ready, passing cart data to checkout flow
