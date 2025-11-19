# Meriendes E-commerce Platform

## Overview

A modern, full-stack e-commerce platform built with Next.js, featuring real-time inventory management, secure payment processing, and a seamless shopping experience. The application leverages cutting-edge technologies to provide a scalable, performant, and maintainable codebase.

## Purpose

This platform enables customers to browse products, manage their shopping cart, and complete secure purchases through Stripe. It provides real-time inventory updates, order tracking, and a responsive user interface optimized for all devices.

## Core Tech Stack

- **Next.js 16** - React framework with App Router, Server Components, and Server Actions
- **Supabase** - Backend-as-a-Service for authentication, database (PostgreSQL), and real-time subscriptions
- **Stripe** - Payment processing and subscription management
- **Zod** - Schema validation for type-safe data handling
- **Zustand** - Lightweight state management for client-side cart and UI state
- **TanStack Query** - Server state management with caching, background updates, and optimistic UI
- **TypeScript** - Type safety across the entire application
- **Tailwind CSS** - Utility-first CSS framework for rapid UI development

## Additional Technologies

- **React Hook Form** - Performant form handling with minimal re-renders
- **Sonner** - Toast notifications for user feedback
- **Lucide React** - Icon library
- **date-fns** - Date manipulation and formatting
- **Class Variance Authority (CVA)** - Type-safe component variants

## Architecture & Data Flow

### High-Level Flow

```
User Interface (Next.js Client)
        ↓
Server Components & Actions (Next.js Server)
        ↓
    ┌───────┴───────┐
    ↓               ↓
Supabase         Stripe
(Database)      (Payments)
```

### Detailed Data Flow

1. **Product Display**: Server Components fetch products from Supabase using Row-Level Security (RLS) policies
2. **Cart Management**: Zustand manages cart state on the client, persisted to localStorage
3. **Checkout Process**:
   - Client submits cart via Server Action
   - Server validates cart and creates Stripe Payment Intent
   - Client displays Stripe Elements for payment collection
   - Server confirms payment and creates order in Supabase
4. **Webhooks**: Stripe webhooks notify server of payment events for order status updates
5. **Real-time Updates**: TanStack Query invalidates caches, and Supabase subscriptions push inventory changes

## Project Structure

```
meriendes-ecom/
├── app/                      # Next.js App Router
│   ├── (shop)/              # Shop route group
│   │   ├── products/        # Product listing and details
│   │   ├── cart/            # Shopping cart
│   │   └── checkout/        # Checkout flow
│   ├── api/                 # API routes
│   │   └── webhooks/        # External service webhooks
│   ├── layout.tsx           # Root layout with providers
│   └── page.tsx             # Home page
├── components/              # Reusable React components
│   ├── ui/                  # Base UI components
│   ├── products/            # Product-specific components
│   ├── cart/                # Cart-specific components
│   └── checkout/            # Checkout-specific components
├── lib/                     # Core utilities and configurations
│   ├── supabase/            # Supabase client and helpers
│   ├── stripe/              # Stripe client and helpers
│   ├── utils/               # General utilities
│   └── validations/         # Zod schemas
├── store/                   # Zustand stores
├── types/                   # TypeScript type definitions
├── docs/                    # Documentation
└── public/                  # Static assets
```

## Environment Setup

1. Copy `.env.example` to `.env.local`
2. Fill in Supabase credentials from your Supabase project settings
3. Fill in Stripe credentials from your Stripe dashboard
4. Update `NEXT_PUBLIC_APP_URL` for production deployments

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Code Conventions

This project follows strict code conventions to ensure maintainability and readability:

- **Self-documenting code**: Descriptive names over comments
- **Small, focused functions**: Each function does one thing well
- **Feature-based structure**: Organize by feature, not by type
- **TypeScript as documentation**: Leverage types and interfaces
- **JSDoc for components**: Document React components and utility functions

See individual feature `README.md` files for detailed feature documentation.

## Key Features

- 🛍️ Product browsing with filtering and search
- 🛒 Real-time cart management with persistence
- 💳 Secure checkout with Stripe Elements
- 📦 Order tracking and history
- 🔐 Authentication via Supabase Auth
- 📱 Responsive design for all devices
- ⚡ Optimized performance with Next.js Image and Server Components
- 🔄 Real-time inventory updates
- 🎨 Accessible UI components

## License

Private - All rights reserved
