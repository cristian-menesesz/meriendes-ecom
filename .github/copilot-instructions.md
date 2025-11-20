# 1. Security (!)

Security is the highest priority. An e-commerce platform handles sensitive user data and financial transactions. All code must adhere to the following principles.

## Authentication & Authorization (Supabase):

- Use Supabase Auth for all user management.
- Implement Row Level Security (RLS) on every single table in the database without exception.
- For each table, write precise RLS policies. Examples:
  - **profiles table**: Users can SELECT and UPDATE only their own row.
  - **products table**: An is_active boolean column must exist. Only active products should be visible to the public (SELECT policy for authenticated and anon roles where is_active = true). Only admin users (as defined by a role column in the profiles table) can INSERT, UPDATE, or DELETE.
  - **orders table**: Users can SELECT only their own orders. Admins can SELECT all.
- Never use the service role key on the client-side. It must only be used in Next.js API Routes or Server Actions for privileged admin operations.
- Use secure password policies and consider OAuth providers (Google, GitHub) for ease of access.

## Data Validation & Sanitization:

- **On the Client**: Use Zod for all form validation and data parsing before sending to the server. This includes product creation, user registration, and checkout forms.
- **On the Server**: Never trust client-side input. Re-validate all data received in Next.js API Routes, Server Actions, or Route Handlers using the same Zod schemas. This prevents malicious payloads even if client-side validation is bypassed.

## Payment Processing (Stripe):

- Never handle raw PCI data. All payment information must be collected by Stripe Elements on the client-side or via a Stripe Payment Link.
- Perform all monetary actions (charge creation, confirmation) on the server in Next.js API Routes.
- Use Stripe's idempotency keys on all payment-related API calls to prevent duplicate charges from network retries.
- Validate the success of a payment before updating the order status in our database. The flow must be: Create Payment Intent -> Client confirms -> Server verifies payment success via webhook -> Then, and only then, update order status to confirmed.

## Environment Security:

- All secrets (Supabase keys, Stripe secrets, JWT secrets) must be stored in environment variables (.env.local). They must never be hard-coded or exposed to the client.
- The Supabase client must be configured with the public anon key on the client, and the private service_role key must be used exclusively in server-side contexts.

# 2. Performance (!)

Performance is a core feature. A fast e-commerce site directly correlates to user retention and conversion.

## Next.js App Router & React:

- Use the App Router exclusively. Structure the app using the app/ directory.
- Leverage React Server Components (RSCs) by default for all data-fetching. This reduces the JavaScript bundle sent to the client and improves initial page load.
- Use next/dynamic with { ssr: false } for heavy client-side components (e.g., a complex product image gallery). Lazy load these components.
- Implement Server-Side Rendering (SSR) for public, SEO-critical pages like the product listing and individual product pages. This ensures content is crawlable and loads instantly.
- Use Static Generation for pages that rarely change (e.g., "About Us", "Terms of Service").

## Caching & Data Fetching:

- Use Supabase's built-in caching where appropriate.
- Implement Incremental Static Regeneration (ISR) on the product pages. Set a revalidate time of 3600 seconds (1 hour). This means the page is fast like a static page but will update in the background if a product changes.
- For data that changes frequently but is not critical (e.g., "users also viewed"), use client-side fetching with SWR or TanStack Query after the initial page load.

## Image & Asset Optimization:

- Use the next/image component for all images. Specify sizes and priority props for the Largest Contentful Paint (LCP) image on a page (e.g., the main product image).
- Serve product images from an optimized CDN. Supabase Storage is suitable for this; ensure images are resized and formatted correctly (WebP).

## Code Splitting & Bundling:

- Next.js automatically code-splits by page. Ensure that third-party libraries are only imported in the components that use them.

# 3. Testing (!)

A tested codebase is a maintainable codebase. For an MVP, we focus on the most critical paths.

## Unit Testing:

- Use Jest and React Testing Library.
- Write unit tests for all utility functions (e.g., price formatters, validation helpers), and complex business logic (e.g., shopping cart calculation, discount application).

## Component Testing:

- Test critical React components in isolation. Focus on behavior, not implementation.
- **Key Components to Test**:
  - **AddToCartButton**: Test that it calls the correct function with the correct product ID when clicked.
  - **ShoppingCart**: Test that it correctly displays the list of items, calculates the total, and allows item removal.
  - **ProductListing**: Test that it renders a list of products based on the props it receives.

## End-to-End (E2E) Testing:

- Use Playwright.
- Write E2E tests for the **Critical User Journeys**:
  - User Registration & Login.
  - Product Browse & Search: A user can find a product.
  - Checkout Flow: From adding an item to the cart to completing the payment and seeing an order confirmation. (This can use Stripe's test mode).

# 4. Maintainability

Write code for your future self and other developers.

## Code Structure:

- Follow a clear, feature-based directory structure within the app directory (e.g., app/(shop), app/(auth), app/(dashboard)).
- Colocate files. A component, its styles, and its tests should live close to each other.

## TypeScript:

- Use Strict Mode. There should be no any types.
- Define and use specific interfaces/types for all core domain objects: Product, User, Order, CartItem.
- Use TypeScript with Zod to infer types from validation schemas, ensuring a single source of truth.

## Separation of Concerns:

- **Data Layer**: Supabase queries should be centralized in lib/supabase or similar, not scattered throughout components.
- **Business Logic**: Functions for calculating taxes, shipping, or discounts should be in pure, testable utility files.
- **Presentation Layer**: Components should be focused on rendering and user interaction.

# 5. Reliability

The system must be predictable and handle errors gracefully.

## Error Handling:

- Implement comprehensive error boundaries at the layout and page level to catch and display graceful error messages to the user without crashing the entire app.
- All API calls (to Supabase, Stripe) must be wrapped in try/catch blocks.
- Log errors to a service (e.g., console for now, but structured for a future service like Sentry) and display user-friendly messages.

## State Management:

- For global UI state (e.g., shopping cart, user auth status), use React Context or a state management library like Zustand.
- The state must be persisted (e.g., in localStorage) to survive page refreshes.
- For server state (data from Supabase), rely on React's use hook in RSCs and SWR/TanStack Query on the client.

## Stripe Webhooks:

- Implement a robust webhook endpoint in app/api/webhooks/route.ts.
- Verify the Stripe signature on every webhook request to ensure it's legitimate.
- Handle idempotency by checking if a webhook event with the same ID has already been processed to avoid duplicate operations (e.g., fulfilling an order twice).

# 6. Usability

The application must be intuitive and accessible.

## Accessibility (a11y):

- All interactive elements must be focusable and usable with a keyboard.
- Use semantic HTML (<button>, <nav>, <main>).
- Provide alt text for all images.
- Ensure sufficient color contrast.

## Feedback:

- Provide immediate feedback for user actions: loading spinners on buttons during form submission, success messages after an action, clear error messages if something fails.

# 7. Monitoring & Analytics

- Implement basic console logging for key events: new user registration, order completion, and errors.
- Structure logs to be easily parsed later.
- (For future) Plan for integration with tools like Vercel Analytics or a proper logging service.

# 1. Code Conventions & Clean Code Principles

## Self-Documenting Code as the Default:

**Names are paramount.** Variables, functions, and components must have intention-revealing names.

- **BAD**: `const x = await sb.from('p').select('*').eq('id', pid);`
- **GOOD**: `const product = await supabase.from('products').select('*').eq('id', productId).single();`

Functions should be small and do one thing. If a function's purpose cannot be described in a simple name, it must be broken down.

- **BAD**: A large `handleCheckout` function that validates the cart, creates a Stripe Payment Intent, and updates the inventory.
- **GOOD**: `validateCart`, `createStripePaymentIntent`, `reserveInventory`. Compose these in the main `handleCheckout` function.

Avoid deep nesting. Use early returns and guard clauses to flatten if statements. This enhances readability.

## Commenting Strategy: "Why," not "What":

**DO NOT COMMENT OBVIOUS CODE.** The code itself should explain what it is doing.

- **BAD**: `// Increment i by 1 \n i++;`

**COMMENT THE "WHY."** Explain the reasoning behind a non-obvious implementation, especially when it involves business logic or third-party service quirks.

- **GOOD**:

```javascript
// Stripe requires the amount in cents, hence multiplying by 100.
// Using Math.floor to avoid floating point precision issues.
const amountInCents = Math.floor(productPrice * 100);
```

**COMMENT COMPLEX ALGORITHMS OR WORKAROUNDS.** If you implemented a complex discount calculation or a workaround for a Supabase edge case, document the logic briefly.

## Third-Party Service Integration Comments:

When initializing a client (Supabase, Stripe), add a brief comment with a link to the official docs.

```javascript
// Supabase Client initialization
// Docs: https://supabase.com/docs/reference/javascript/initializing
export const createClient = () => { ... }
```

For API calls, comment on the purpose of the call in the context of our application.

```javascript
// Using Stripe's `expand` to get the latest charge details in a single API call
// for immediate post-payment UI update, avoiding a separate webhook wait.
const paymentIntent = await stripe.paymentIntents.retrieve(pi_id, {
  expand: ['latest_charge'],
});
```

## TypeScript is Documentation:

Leverage TypeScript interfaces and types as a primary form of documentation.

- **BAD**: `const product = { ... } // product object`
- **GOOD**:

```typescript
  interface Product {
    id: string;
    name: string;
    price: number; // Stored in dollars, displayed to user.
    stripePriceId: string; // The corresponding Price ID in Stripe.
    inventoryCount: number;
  }
  const product: Product = { ... };
```

The interface is its own documentation.

# 2. Documentation Strategy (In-Line & MD Files)

## Project-Wide Overview (/docs/OVERVIEW.md):

Create a single, brief OVERVIEW.md file in a /docs directory.

**Content:**

- 1-2 paragraphs on the project's purpose.
- A bulleted list of the core tech stack (Next.js, Supabase, Stripe).
- A high-level diagram or description of the data flow (User -> Next.js -> Supabase/Stripe).

## Feature-Level Documentation (/app/feature/README.md):

For each major feature directory (e.g., /app/cart, /app/checkout, /app/admin), include a README.md file. This file must be concise.

**Its structure:**

- **Purpose**: One sentence describing the feature.
- **Key Components**: A bulleted list of the main components/files in the folder and their one-sentence roles.
- **Data Flow**: A brief description of how data moves through this feature.

**Example for /app/checkout/README.md:**

- page.tsx uses Server Actions to create a Stripe Payment Intent.
- `<CheckoutForm />` uses Stripe Elements to collect payment details.
- On submission, `handlePaymentSubmission` calls a Server Action.
- The Server Action confirms the payment with Stripe and, on success, inserts an order into Supabase.

## Component-Level Documentation (JSDoc):

Use JSDoc comments for all React components and non-trivial utility functions. This keeps documentation close to the code and is easily consumed by IDEs.

**Example for a Component:**

```typescript
/**
 * Displays a single product card with image, name, price, and add-to-cart action.
 * Optimized for SEO and LCP by using next/image with priority loading.
 *
 * @param {Product} product - The product object to display.
 * @param {function} onAddToCart - Callback function invoked when the add-to-cart button is clicked.
 */
export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  ...
}
```

**Example for a Service Function:**

```typescript
/**
 * Fetches an active product by its ID from Supabase.
 * Enforces RLS policies; will only return products where `is_active` is true.
 *
 * @param {string} productId - The UUID of the product to fetch.
 * @returns {Promise<Product | null>} The product object or null if not found/inactive.
 * @throws {Error} If the Supabase query fails for any reason.
 */
export async function getActiveProduct(productId: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', productId)
    .eq('is_active', true)
    .single();

  if (error) {
    throw new Error(`Failed to fetch product ${productId}: ${error.message}`);
  }

  return data;
}
```

# 3. File & Folder Structure Conventions

## Group by Feature, not by Type:

The app/ directory should be structured around features, not technical roles.

**AVOID:**

```text
app/
  components/
    Button.tsx
    ProductCard.tsx
    CheckoutForm.tsx
  lib/
```

**PREFER:**

```text
app/
  (shop)/
    products/
      [id]/
        page.tsx
        ProductCard.tsx
        README.md  # Explains the product display feature.
    layout.tsx
  checkout/
    page.tsx
    CheckoutForm.tsx
    actions.ts  # Server Actions for checkout
    README.md  # Explains the checkout flow.
  lib/  # For truly shared, generic utilities.
```

## Naming Consistency:

- **Files**: Use PascalCase for components (ProductCard.tsx), camelCase for utilities and hooks (formatCurrency.ts, useCart.ts).
- **Folders**: Use kebab-case for route folders ([product-id]) and camelCase or PascalCase for feature folders.
