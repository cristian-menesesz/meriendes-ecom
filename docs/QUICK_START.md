# Quick Start Guide

Welcome to Meriendes E-commerce! This guide will help you get up and running quickly.

## Prerequisites Checklist

- [ ] Node.js 18+ installed
- [ ] npm installed
- [ ] Supabase account created
- [ ] Stripe account created
- [ ] Git initialized (already done by create-next-app)

## Step-by-Step Setup

### 1. Install Dependencies

```bash
npm install
```

✅ Dependencies are already installed!

### 2. Configure Environment Variables

1. Copy `.env.example` to `.env.local`:

   ```bash
   cp .env.example .env.local
   ```

2. Fill in your credentials in `.env.local`:
   - **Supabase**: Get from https://app.supabase.com/project/_/settings/api
   - **Stripe**: Get from https://dashboard.stripe.com/apikeys

### 3. Set Up Supabase Database

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy the contents of `docs/database-schema.sql`
4. Paste and execute the SQL script
5. Verify tables are created in the Table Editor

### 4. Configure Stripe Products (Optional)

To test payments:

1. Go to Stripe Dashboard → Products
2. Create a few test products
3. Copy the Price ID and Product ID
4. Insert products into Supabase using those IDs

### 5. Run the Development Server

```bash
npm run dev
```

Visit http://localhost:3000 🎉

## Next Steps

### Build Your First Feature

1. **Add Product Display**

   - Create `app/(shop)/products/page.tsx`
   - Fetch products from Supabase
   - Display in a grid

2. **Add Product Details**

   - Create `app/(shop)/products/[id]/page.tsx`
   - Show single product with add-to-cart

3. **Implement Cart**

   - Create `app/(shop)/cart/page.tsx`
   - Use `useCartStore` hook
   - Display cart items and totals

4. **Build Checkout**
   - Create `app/(shop)/checkout/page.tsx`
   - Integrate Stripe Elements
   - Create Server Actions for payment processing

### Recommended Reading

- [Project Overview](OVERVIEW.md) - Architecture and conventions
- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Stripe Integration Guide](https://stripe.com/docs/payments/accept-a-payment)
- [TanStack Query Guide](https://tanstack.com/query/latest/docs/framework/react/overview)

## Common Tasks

### Adding a New Component

```bash
# Create in appropriate directory
touch components/ui/YourComponent.tsx
```

Use JSDoc and follow naming conventions:

- PascalCase for components
- camelCase for utilities
- kebab-case for routes

### Creating a Server Action

```typescript
// app/(shop)/feature/actions.ts
"use server";

import { createClient } from "@/lib/supabase/server";

export async function yourAction() {
  const supabase = await createClient();
  // Your logic here
}
```

### Fetching Data with Server Components

```typescript
// app/(shop)/feature/page.tsx
import { createClient } from "@/lib/supabase/server";

export default async function Page() {
  const supabase = await createClient();
  const { data } = await supabase.from("products").select("*");

  return <div>{/* Render data */}</div>;
}
```

### Using TanStack Query in Client Components

```typescript
"use client";

import { useQuery } from "@tanstack/react-query";

export function YourComponent() {
  const { data, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await fetch("/api/products");
      return response.json();
    },
  });

  if (isLoading) return <LoadingSpinner />;
  return <div>{/* Render data */}</div>;
}
```

## Troubleshooting

### Build Errors

```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Rebuild
npm run build
```

### Type Errors

Ensure your Supabase types are up to date:

```bash
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > types/supabase.ts
```

### Environment Variables Not Working

- Restart dev server after changing `.env.local`
- Ensure variables start with `NEXT_PUBLIC_` for client-side access
- Check for typos in variable names

## Resources

- **Documentation**: Check `docs/` folder
- **Feature READMEs**: Each feature has a `README.md` in its directory
- **Type Definitions**: See `types/index.ts`
- **Validation Schemas**: See `lib/validations/schemas.ts`

## Getting Help

1. Check documentation in `docs/` folder
2. Review feature-specific READMEs
3. Consult official docs (Next.js, Supabase, Stripe)
4. Check GitHub issues for similar problems

Happy coding! 🚀
