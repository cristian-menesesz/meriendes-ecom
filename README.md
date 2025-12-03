# Meriendes E-commerce Platform

![CI](https://github.com/cristian-menesesz/meriendes-ecom/actions/workflows/ci.yml/badge.svg)

A modern, full-stack e-commerce platform built with Next.js 16, featuring secure payment processing via Stripe, real-time data management with Supabase, and a polished user experience.

## 🚀 Tech Stack

### Core Technologies

- **Next.js 16** - React framework with App Router, Server Components, Server Actions, and Turbopack
- **TypeScript** - Type-safe development with strict mode enabled
- **React 19** - Latest React with concurrent features
- **Tailwind CSS 4** - Utility-first CSS with modern features

### Backend & Database

- **Supabase** - PostgreSQL database with authentication, Row-Level Security (RLS), and real-time subscriptions
- **Stripe** - Secure payment processing with Payment Intents and webhooks

### State Management & Data Fetching

- **Zustand** - Lightweight state management for client-side cart state
- **TanStack Query (React Query)** - Server state management with intelligent caching and background updates

### Validation & Forms

- **Zod** - Schema validation with TypeScript type inference
- **React Hook Form** - Performant form handling with minimal re-renders

### UI & Utilities

- **Lucide React** - Modern icon library
- **Sonner** - Beautiful toast notifications
- **Class Variance Authority (CVA)** - Type-safe component variants
- **clsx + tailwind-merge** - Intelligent CSS class composition
- **date-fns** - Modern date utility library

## 📁 Project Structure

```
meriendes-ecom/
├── app/                        # Next.js App Router
│   ├── (shop)/                # Shop route group
│   │   ├── products/          # Product catalog
│   │   │   ├── [id]/          # Product detail pages
│   │   │   └── README.md      # Feature documentation
│   │   ├── cart/              # Shopping cart
│   │   │   └── README.md
│   │   └── checkout/          # Checkout flow
│   │       └── README.md
│   ├── api/                   # API routes
│   │   └── webhooks/          # External service webhooks
│   │       └── stripe/        # Stripe webhook handlers
│   ├── layout.tsx             # Root layout with providers
│   ├── page.tsx               # Home page
│   └── globals.css            # Global styles
├── components/                # React components
│   ├── ui/                    # Base UI components
│   │   ├── Button.tsx
│   │   └── LoadingSpinner.tsx
│   ├── products/              # Product-specific components
│   ├── cart/                  # Cart-specific components
│   └── checkout/              # Checkout-specific components
├── lib/                       # Core utilities and configurations
│   ├── supabase/              # Supabase client setup
│   │   ├── server.ts          # Server-side client
│   │   ├── client.ts          # Client-side client
│   │   └── middleware.ts      # Middleware client
│   ├── stripe/                # Stripe client setup
│   │   ├── server.ts          # Server-side Stripe
│   │   └── client.ts          # Client-side Stripe
│   ├── providers/             # React context providers
│   │   └── QueryProvider.tsx  # TanStack Query provider
│   ├── utils/                 # Utility functions
│   │   ├── cn.ts              # Class name utilities
│   │   ├── currency.ts        # Currency formatting
│   │   └── index.ts
│   └── validations/           # Zod schemas
│       └── schemas.ts
├── store/                     # Zustand stores
│   └── cartStore.ts           # Shopping cart state
├── types/                     # TypeScript types
│   └── index.ts               # Core type definitions
├── docs/                      # Documentation
│   └── OVERVIEW.md            # Project overview
├── public/                    # Static assets
├── .env.example               # Environment variables template
├── .env.local                 # Local environment variables (gitignored)
└── package.json
```

## 🛠️ Setup Instructions

### Prerequisites

- Node.js 18+ and npm
- Supabase account ([supabase.com](https://supabase.com))
- Stripe account ([stripe.com](https://stripe.com))

### Installation

1. **Clone and install dependencies**

```bash
npm install
```

2. **Configure environment variables**

Copy `.env.example` to `.env.local` and fill in your credentials:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key_here
STRIPE_SECRET_KEY=your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret_here

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

3. **Set up Supabase database**

Create the following tables in your Supabase project:

```sql
-- Products table
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  stripe_price_id TEXT NOT NULL,
  stripe_product_id TEXT NOT NULL,
  inventory_count INTEGER NOT NULL DEFAULT 0,
  image_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  total DECIMAL(10, 2) NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'processing', 'completed', 'cancelled', 'refunded')),
  stripe_payment_intent_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order items table
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id),
  quantity INTEGER NOT NULL,
  price_at_purchase DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies (adjust as needed)
CREATE POLICY "Products are viewable by everyone" ON products FOR SELECT USING (is_active = true);
CREATE POLICY "Users can view their own orders" ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view their own order items" ON order_items FOR SELECT USING (
  order_id IN (SELECT id FROM orders WHERE user_id = auth.uid())
);
```

4. **Run the development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your application.

## 📝 Code Conventions

This project follows strict code conventions to ensure maintainability and readability. See [`docs/OVERVIEW.md`](docs/OVERVIEW.md) for detailed guidelines.

### Key Principles

1. **Self-Documenting Code** - Descriptive names, small focused functions
2. **Feature-Based Structure** - Organize by feature, not by type
3. **TypeScript as Documentation** - Leverage types and interfaces
4. **JSDoc for Components** - Document React components and utilities
5. **Comment the "Why"** - Explain reasoning, not obvious code

### Example

```typescript
/**
 * Fetches an active product by its ID from Supabase.
 * Enforces RLS policies; will only return products where `is_active` is true.
 *
 * @param {string} productId - The UUID of the product to fetch.
 * @returns {Promise<Product | null>} The product object or null if not found/inactive.
 */
export async function getActiveProduct(productId: string): Promise<Product | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', productId)
    .eq('is_active', true)
    .single();

  if (error) throw new Error(`Failed to fetch product: ${error.message}`);

  return data;
}
```

## 🧪 Available Scripts

```bash
# Development
npm run dev          # Start development server with Turbopack
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run lint:fix     # Fix auto-fixable ESLint errors
npm run type-check   # Run TypeScript type checking
npm run format       # Format code with Prettier
npm run format:check # Check code formatting

# Testing
npm run test         # Run Jest tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage report
```

## 🔐 Environment Variables

| Variable                             | Description                             | Required |
| ------------------------------------ | --------------------------------------- | -------- |
| `NEXT_PUBLIC_SUPABASE_URL`           | Supabase project URL                    | Yes      |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`      | Supabase anonymous key                  | Yes      |
| `SUPABASE_SERVICE_ROLE_KEY`          | Supabase service role key (server-only) | Yes      |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key                  | Yes      |
| `STRIPE_SECRET_KEY`                  | Stripe secret key (server-only)         | Yes      |
| `STRIPE_WEBHOOK_SECRET`              | Stripe webhook signing secret           | Yes      |
| `NEXT_PUBLIC_APP_URL`                | Application base URL                    | Yes      |

## 📚 Documentation

- **[Project Overview](docs/OVERVIEW.md)** - Architecture and tech stack details
- **[Products Feature](<app/(shop)/products/README.md>)** - Product catalog documentation
- **[Cart Feature](<app/(shop)/cart/README.md>)** - Shopping cart documentation
- **[Checkout Feature](<app/(shop)/checkout/README.md>)** - Checkout flow documentation

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Platforms

This app can be deployed on any platform supporting Next.js:

- Netlify
- AWS Amplify
- Railway
- Render

Ensure to set all environment variables and configure Stripe webhooks with your production URL.

## 🔒 Security Considerations

- Environment variables containing secrets are never committed (see `.gitignore`)
- Supabase Row-Level Security (RLS) policies protect data access
- Stripe webhook signatures are verified before processing
- Server Actions validate all inputs with Zod schemas
- Authentication tokens are httpOnly cookies managed by Supabase

## 📄 License

Private - All rights reserved

## 🤝 Contributing

This is a private project. If you have suggestions or find issues, please reach out to the project maintainers.

---

Built with ❤️ using Next.js, Supabase, and Stripe
