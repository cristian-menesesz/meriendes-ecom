# Cart Feature

## Purpose

Provides shopping cart functionality for both authenticated and unauthenticated users with localStorage persistence. Supports dual interface (sidebar + dedicated page) for optimal user experience.

## Key Components

- **CartButton.tsx**: Header cart icon with item count badge
- **CartSidebar.tsx**: Slide-over panel for quick cart review
- **CartItem.tsx**: Reusable cart item display with quantity controls
- **CartSummary.tsx**: Order summary with checkout CTA
- **EmptyCart.tsx**: Empty state with call-to-action
- **page.tsx**: Full cart page with detailed view
- **Header.tsx**: Site navigation header

## Storage Strategy

### Guest Users (Current)

- **localStorage persistence** (key: `meriendes-cart`)
- Survives page refreshes and browser restarts
- Device/browser-specific
- No authentication required

### Authenticated Users (Future Phase 2)

- Dual storage: localStorage + Supabase database
- Automatic sync on login/logout
- Cart recovery across devices
- Merge strategy for multi-device usage

## Features

### Dual Interface

**CartSidebar** (Quick View):

- Slides in from right (400px desktop, full-width mobile)
- Click backdrop or press Esc to close
- Scrollable item list with fixed summary
- Lightweight controls for quick actions

**Cart Page** (Detailed View):

- Two-column layout (items | summary)
- Expanded details (SKU, price breakdowns)
- Breadcrumb navigation
- Clear cart functionality

### State Management

**Enhanced Zustand Store**:

```typescript
interface CartStore {
  items: CartItem[];
  isSidebarOpen: boolean;
  addItem(product, variant, quantity): void;
  removeItem(variantId): void;
  updateQuantity(variantId, quantity): void;
  incrementQuantity(variantId): void;
  decrementQuantity(variantId): void;
  clearCart(): void;
  getTotalItems(): number;
  getTotalPrice(): number;
  openSidebar(): void;
  closeSidebar(): void;
  toggleSidebar(): void;
}
```

**Persistence**: Only `items` array persists to localStorage, UI state is ephemeral

## User Experience

✅ Instant cart operations (localStorage-based)  
✅ Optimistic UI updates  
✅ Toast notifications for feedback  
✅ Real-time badge updates  
✅ Empty states with CTAs  
✅ Fully responsive  
✅ Keyboard accessible

## Technologies

- Zustand (state + persistence)
- Headless UI (Dialog/Transition)
- Next.js 16 Client Components
- TypeScript strict mode
- Tailwind CSS
- Sonner (toast notifications)

## Testing (To Be Implemented)

### Unit Tests

- Cart store operations
- localStorage persistence
- Computed values

### Component Tests

- CartButton (badge, click)
- CartSidebar (open/close, items)
- CartItem (quantity, remove)
- CartSummary (totals, links)
- EmptyCart (state, CTA)

### Integration Tests

- Add to cart flow
- Persistence across refreshes
- Navigation between interfaces

## Future Enhancements (Phase 2)

- Database synchronization
- Stock validation
- Save for later
- Discount codes
- Shipping estimates
- Price change notifications
