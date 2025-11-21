# E-commerce System Specification - Meal Delivery Business

## 1. Core E-commerce Functionality

### Customer-Facing Features

#### Product Catalog

- Individual meals (small/large sizes)
- Pre-defined meal bundles
- Seasonal and promotional items

#### Shopping Experience

- Browse products by category/type
- Search and filter functionality
- Product detail pages with images/descriptions

#### Cart & Checkout

- Add items to cart (individual and bundles)
- Modify quantities, remove items
- Guest checkout capability
- User account creation/authentication

### Order Management Pipeline

```
Cart → Checkout → Payment Processing → Order Confirmation → Status Updates
```

### Payment Integration

#### Stripe Payment Processing

- Credit/debit card payments
- Digital wallet support (Apple Pay, Google Pay)
- Secure payment data handling
- Refund and dispute management

## 2. User Management System

### Customer Profiles

#### Account Information

- Email authentication
- Personal details (name, contact info)
- Communication preferences

#### Address Management

- Multiple delivery addresses
- Address validation for delivery zones
- Preferred address selection

### Order History

- Complete order tracking
- Reorder functionality
- Invoice access and download

## 3. Product & Inventory System

### Product Structure

```
Product (Meal)
├── Category: Protein Bowls, Pasta, etc.
├── Tags: Dietary (Vegan, Keto), Cuisine (Italian, Mexican), Features (High Protein)
├── Nutrition Info: Macros, micros, allergens, certifications
├── Variant (Small)
│   ├── SKU: MEAL-SM-001
│   ├── Price: $12.99
│   ├── Stripe Product ID: prod_xxx
│   ├── Stripe Price ID: price_xxx
│   └── Inventory: 50
└── Variant (Large)
    ├── SKU: MEAL-LG-001
    ├── Price: $18.99
    ├── Stripe Product ID: prod_xxx (shared)
    ├── Stripe Price ID: price_yyy (unique)
    └── Inventory: 30
```

### Nutrition & Dietary Info

- **Macros**: Calories, protein, carbs, fats, fiber
- **Micros**: Vitamins, minerals (Vitamin A, C, D, Calcium, Iron, etc.)
- **Allergens**: Contains nuts, dairy, soy, eggs, shellfish, etc.
- **Certifications**: Organic, non-GMO, grass-fed, gluten-free certified
- **Filtering**: Tag-based search (dietary preferences, cuisines, meal types)

### Bundle Management

- **Fixed Bundles**: Pre-defined meal combinations
- **Bundle Pricing**: Discounted vs individual items
- **Inventory Impact**: Bundle sales affect component inventory

### Inventory Rules

- Real-time stock levels (available vs reserved)
- Low stock alerts (reorder threshold)
- Out-of-stock product hiding
- Inventory reservation during checkout (15-minute timeout)
- Automatic inventory deduction on order confirmation
- Inventory movement tracking (stock in, sold, adjusted)

## 4. Order Processing Workflow

### Order States

1. **Draft** - Cart in progress
2. **Awaiting Payment** - Checkout initiated
3. **Paid** - Payment confirmed
4. **Processing** - Order sent to kitchen
5. **Ready for Delivery** - Meals prepared
6. **Out for Delivery** - With delivery driver
7. **Delivered** - Customer received
8. **Cancelled** - Order cancelled (pre-delivery)

### Payment Flow

1. Create Stripe Payment Intent (server-side)
2. Client confirms payment with Stripe Elements
3. Stripe webhook confirms successful payment
4. Update order status to "Paid"
5. Deduct inventory for ordered items
6. Trigger email notification (order confirmation)

### Refund Handling

- Partial or full refunds via Stripe
- Track refund reason and amount
- Email notification on refund completion
- Inventory adjustment (optional return to stock)

## 5. Business Rules & Validation

### Order Validation

- Delivery address within service area
- Order minimum amounts (if applicable)
- Cut-off times for same-day delivery
- Maximum order quantities per product

### Pricing Rules

- Base product pricing by size/variant
- Bundle discount calculations (percentage off or fixed price)
- Promo code support:
  - **Percentage discount** (e.g., 10% off)
  - **Fixed amount** (e.g., $5 off)
  - **Free shipping**
  - Usage limits (total uses, per-customer limit)
  - Expiration dates and minimum order amounts
- Tax calculation based on location (if applicable)

### Inventory Rules

- Prevent over-selling available stock
- Reserve inventory during active checkouts
- Release reserved inventory after timeout
- Update inventory upon successful delivery

## 6. Data Requirements for E-commerce

### Essential Data Entities

- **Customers**: Profiles, preferences, order history, multiple addresses
- **Products**: Meal details, variants, pricing, images, categories, tags
- **Nutrition Info**: Macros, micros, allergens, dietary certifications
- **Orders**: Transaction records, status, timelines, inline delivery address
- **Inventory**: Stock levels, reservations, movements, reorder thresholds
- **Payments**: Stripe transaction references (Payment Intent ID), status, amounts
- **Bundles**: Pre-configured meal packages with discounted pricing
- **Promo Codes**: Discounts with usage tracking and validation rules
- **Email Notifications**: Order confirmations, status updates, refund alerts

### Analytics & Reporting Needs

- Sales performance by product/bundle
- Customer acquisition and retention metrics
- Average order value trends
- Popular products and bundle performance
- Delivery zone performance

## 7. Integration Points

### External Services

- **Stripe**:
  - Payment processing (Payment Intents API)
  - Each variant has unique `stripe_price_id`
  - Multiple variants share `stripe_product_id`
  - Webhook handling for payment confirmation
- **Email Service**: Order confirmations, status updates, refund notifications, marketing
- **Supabase**: Database (PostgreSQL 14+), authentication, storage (product images)

### Future Internal Integrations

- Kitchen display system (order tickets)
- Delivery logistics platform
- Customer service portal
- Marketing automation system

## 8. Security & Compliance

### Data Protection

- PCI compliance through Stripe integration (no card data stored)
- Secure customer data storage (bcrypt password hashing)
- GDPR/Privacy compliance for user data
- Row-level security (RLS) on all Supabase tables

### Access Control

- Customer data isolation (customers see only their own data)
- Admin role permissions (manage products, orders, inventory)
- API security for external integrations (service role key server-side only)
- Stripe webhook signature verification

## 9. Scalability Considerations

### Immediate Scale (0-6 months)

- Hundreds to thousands of monthly orders
- Single regional delivery operation
- Basic analytics and reporting

### Growth Preparation

- Database performance optimization (indexes on foreign keys, search columns)
- Caching strategies for product catalog (ISR in Next.js)
- Queue system for order processing (async webhook handling)
- Modular architecture for future services

## 10. Automation & Business Logic

### Database Triggers

- **Auto-update timestamps**: `updated_at` on all tables
- **Order number generation**: Sequential order numbers (ORD-YYYYMMDD-XXXX)
- **Promo usage tracking**: Increment usage count on order creation
- **Inventory deduction**: Automatic stock update when order is paid
- **Reservation cleanup**: Remove expired cart reservations (15-min timeout)

### Views

- **Available Inventory**: Real-time view of sellable stock (available - reserved)
- **Order Summary**: Aggregated order details with totals
- **Bundle Details**: Expanded bundle items with pricing

### Audit Trail

- Track all order status changes (who, when, old/new status)
- Log inventory movements (reason, quantity, timestamp)
- Monitor payment transaction history
