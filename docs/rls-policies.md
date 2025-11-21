# Row Level Security (RLS) Policies for Meriendes E-Commerce

## Overview

This document outlines the Row Level Security (RLS) policies for the Meriendes meal delivery e-commerce platform. RLS is critical for security in a multi-tenant Supabase application, ensuring users can only access data they're authorized to view or modify.

## Security Principles

1. **Deny by Default**: All tables have RLS enabled. Without explicit policies, no data is accessible.
2. **Least Privilege**: Users only get the minimum access required for their role.
3. **Defense in Depth**: Multiple layers of security (RLS + application logic + API validation).
4. **Audit Trail**: Critical operations are logged in the audit_log table.

## User Roles

### Public (Unauthenticated Users)

- Can browse products, categories, and tags
- Can view nutrition information
- Cannot access any user-specific data
- Cannot modify any data

### Authenticated Users (Customers)

- All public permissions
- Can manage their own profile and addresses
- Can view and manage their own orders
- Can view and manage their own cart
- Can create new orders
- Cannot access other users' data

### Admin Users

- All authenticated user permissions
- Can manage products, variants, inventory
- Can view all orders and customer data
- Can manage promotions and bundles
- Full access to all tables

**Admin Identification**: A user is an admin if `customers.email` ends with `@meriendes.com` or if a future `is_admin` boolean column is added.

---

## Table-by-Table Policy Specifications

### 1. `customers`

**Purpose**: User account information

**Policies**:

| Policy Name            | Role          | Operation      | Condition                      |
| ---------------------- | ------------- | -------------- | ------------------------------ |
| `customers_select_own` | Authenticated | SELECT         | `auth.uid() = id`              |
| `customers_update_own` | Authenticated | UPDATE         | `auth.uid() = id`              |
| `customers_admin_all`  | Admin         | SELECT, UPDATE | `email LIKE '%@meriendes.com'` |

**Rationale**:

- Users can view/update only their own profile
- Admins can view all customers
- No INSERT policy (users created via Supabase Auth)
- No public SELECT (privacy protection)

---

### 2. `customer_addresses`

**Purpose**: Delivery addresses for customers

**Policies**:

| Policy Name            | Role          | Operation              | Condition                  |
| ---------------------- | ------------- | ---------------------- | -------------------------- |
| `addresses_select_own` | Authenticated | SELECT                 | `customer_id = auth.uid()` |
| `addresses_insert_own` | Authenticated | INSERT                 | `customer_id = auth.uid()` |
| `addresses_update_own` | Authenticated | UPDATE                 | `customer_id = auth.uid()` |
| `addresses_delete_own` | Authenticated | DELETE                 | `customer_id = auth.uid()` |
| `addresses_admin_all`  | Admin         | SELECT, UPDATE, DELETE | Admin user                 |

**Rationale**:

- Full CRUD for users on their own addresses
- Admins can view/modify all addresses (for order support)

---

### 3. `product_categories`

**Purpose**: Product categorization (Protein Bowls, Pasta, etc.)

**Policies**:

| Policy Name                | Role   | Operation                      | Condition          |
| -------------------------- | ------ | ------------------------------ | ------------------ |
| `categories_select_public` | Public | SELECT                         | `is_active = true` |
| `categories_admin_all`     | Admin  | SELECT, INSERT, UPDATE, DELETE | Admin user         |

**Rationale**:

- Everyone can see active categories
- Only admins can manage categories

---

### 4. `products`

**Purpose**: Meal products (Chicken Teriyaki Bowl, etc.)

**Policies**:

| Policy Name                     | Role   | Operation                      | Condition          |
| ------------------------------- | ------ | ------------------------------ | ------------------ |
| `products_select_active_public` | Public | SELECT                         | `is_active = true` |
| `products_admin_all`            | Admin  | SELECT, INSERT, UPDATE, DELETE | Admin user         |

**Rationale**:

- Everyone can browse active products
- Inactive products hidden from public (draft mode)
- Only admins can create/edit products

---

### 5. `product_variants`

**Purpose**: Size variants of products (Small, Large)

**Policies**:

| Policy Name                     | Role   | Operation                      | Condition          |
| ------------------------------- | ------ | ------------------------------ | ------------------ |
| `variants_select_active_public` | Public | SELECT                         | `is_active = true` |
| `variants_admin_all`            | Admin  | SELECT, INSERT, UPDATE, DELETE | Admin user         |

**Rationale**:

- Everyone can see active variants (needed for product browsing/checkout)
- Only admins can manage variants and Stripe IDs

---

### 6. `tags`

**Purpose**: Product tags (Vegan, Keto, Spicy, etc.)

**Policies**:

| Policy Name                 | Role   | Operation                      | Condition          |
| --------------------------- | ------ | ------------------------------ | ------------------ |
| `tags_select_active_public` | Public | SELECT                         | `is_active = true` |
| `tags_admin_all`            | Admin  | SELECT, INSERT, UPDATE, DELETE | Admin user         |

**Rationale**:

- Public can view tags for filtering
- Only admins can create/modify tags

---

### 7. `product_tags`

**Purpose**: Many-to-many relationship between products and tags

**Policies**:

| Policy Name                  | Role   | Operation                      | Condition           |
| ---------------------------- | ------ | ------------------------------ | ------------------- |
| `product_tags_select_public` | Public | SELECT                         | Always (join table) |
| `product_tags_admin_all`     | Admin  | SELECT, INSERT, UPDATE, DELETE | Admin user          |

**Rationale**:

- Public SELECT to enable product filtering by tags
- Only admins can assign tags to products

---

### 8. `nutrition_info`

**Purpose**: Nutritional information per variant

**Policies**:

| Policy Name               | Role   | Operation                      | Condition  |
| ------------------------- | ------ | ------------------------------ | ---------- |
| `nutrition_select_public` | Public | SELECT                         | Always     |
| `nutrition_admin_all`     | Admin  | SELECT, INSERT, UPDATE, DELETE | Admin user |

**Rationale**:

- Everyone can see nutrition facts (transparency)
- Only admins can update nutrition data

---

### 9. `inventory`

**Purpose**: Stock levels for product variants

**Policies**:

| Policy Name               | Role   | Operation                      | Condition                                |
| ------------------------- | ------ | ------------------------------ | ---------------------------------------- |
| `inventory_select_public` | Public | SELECT                         | `quantity_available > 0` (only in-stock) |
| `inventory_admin_all`     | Admin  | SELECT, INSERT, UPDATE, DELETE | Admin user                               |

**Rationale**:

- Public can check stock availability
- Only admins can adjust inventory levels
- Out-of-stock items hidden from public

---

### 10. `inventory_movements`

**Purpose**: Audit trail for inventory changes

**Policies**:

| Policy Name                     | Role  | Operation      | Condition  |
| ------------------------------- | ----- | -------------- | ---------- |
| `inventory_movements_admin_all` | Admin | SELECT, INSERT | Admin user |

**Rationale**:

- Only admins can view/create inventory movements
- No UPDATE/DELETE (immutable audit log)

---

### 11. `promo_codes`

**Purpose**: Discount codes

**Policies**:

| Policy Name                      | Role          | Operation                      | Condition                                                           |
| -------------------------------- | ------------- | ------------------------------ | ------------------------------------------------------------------- |
| `promo_codes_select_active_auth` | Authenticated | SELECT                         | `is_active = true AND valid_from <= NOW() AND valid_until >= NOW()` |
| `promo_codes_admin_all`          | Admin         | SELECT, INSERT, UPDATE, DELETE | Admin user                                                          |

**Rationale**:

- Only logged-in users can see active promo codes
- Prevents public scraping of promo codes
- Admins have full control

---

### 12. `bundles` & `bundle_items`

**Purpose**: Meal bundles (e.g., "Family Pack")

**Policies**:

| Policy Name                    | Role   | Operation                      | Condition           |
| ------------------------------ | ------ | ------------------------------ | ------------------- |
| `bundles_select_active_public` | Public | SELECT                         | `is_active = true`  |
| `bundle_items_select_public`   | Public | SELECT                         | Always (join table) |
| `bundles_admin_all`            | Admin  | SELECT, INSERT, UPDATE, DELETE | Admin user          |
| `bundle_items_admin_all`       | Admin  | SELECT, INSERT, UPDATE, DELETE | Admin user          |

**Rationale**:

- Public can browse bundles
- Only admins can create/modify bundles

---

### 13. `orders`

**Purpose**: Customer orders

**Policies**:

| Policy Name                   | Role          | Operation              | Condition                                       |
| ----------------------------- | ------------- | ---------------------- | ----------------------------------------------- |
| `orders_select_own`           | Authenticated | SELECT                 | `customer_id = auth.uid()`                      |
| `orders_insert_authenticated` | Authenticated | INSERT                 | `customer_id = auth.uid()`                      |
| `orders_insert_guest`         | Public        | INSERT                 | `customer_id IS NULL` (guest checkout)          |
| `orders_update_own_draft`     | Authenticated | UPDATE                 | `customer_id = auth.uid() AND status = 'draft'` |
| `orders_admin_all`            | Admin         | SELECT, INSERT, UPDATE | Admin user                                      |

**Rationale**:

- Users can view their own orders
- Guest checkout allowed (customer_id = NULL)
- Users can only update draft orders
- Admins can view/update all orders (fulfillment)
- No DELETE (orders are immutable once placed)

---

### 14. `order_items`

**Purpose**: Line items in orders

**Policies**:

| Policy Name              | Role          | Operation                      | Condition                                                                                 |
| ------------------------ | ------------- | ------------------------------ | ----------------------------------------------------------------------------------------- |
| `order_items_select_own` | Authenticated | SELECT                         | `order_id IN (SELECT id FROM orders WHERE customer_id = auth.uid())`                      |
| `order_items_insert_own` | Authenticated | INSERT                         | `order_id IN (SELECT id FROM orders WHERE customer_id = auth.uid() AND status = 'draft')` |
| `order_items_admin_all`  | Admin         | SELECT, INSERT, UPDATE, DELETE | Admin user                                                                                |

**Rationale**:

- Users can view items in their own orders
- Users can add items only to their draft orders
- Admins have full access

---

### 15. `carts` & `cart_items`

**Purpose**: Persistent cart storage for logged-in users

**Policies**:

| Policy Name             | Role          | Operation      | Condition                                                          |
| ----------------------- | ------------- | -------------- | ------------------------------------------------------------------ |
| `carts_select_own`      | Authenticated | SELECT         | `customer_id = auth.uid()`                                         |
| `carts_insert_own`      | Authenticated | INSERT         | `customer_id = auth.uid()`                                         |
| `carts_update_own`      | Authenticated | UPDATE         | `customer_id = auth.uid()`                                         |
| `carts_delete_own`      | Authenticated | DELETE         | `customer_id = auth.uid()`                                         |
| `cart_items_select_own` | Authenticated | SELECT         | `cart_id IN (SELECT id FROM carts WHERE customer_id = auth.uid())` |
| `cart_items_insert_own` | Authenticated | INSERT         | `cart_id IN (SELECT id FROM carts WHERE customer_id = auth.uid())` |
| `cart_items_update_own` | Authenticated | UPDATE         | `cart_id IN (SELECT id FROM carts WHERE customer_id = auth.uid())` |
| `cart_items_delete_own` | Authenticated | DELETE         | `cart_id IN (SELECT id FROM carts WHERE customer_id = auth.uid())` |
| `carts_admin_all`       | Admin         | SELECT, DELETE | Admin user                                                         |

**Rationale**:

- Full CRUD for users on their own cart
- No public access (carts are private)
- Admins can view/clear abandoned carts

---

### 16. `payments`

**Purpose**: Payment records (Stripe integration)

**Policies**:

| Policy Name                     | Role          | Operation      | Condition                                                            |
| ------------------------------- | ------------- | -------------- | -------------------------------------------------------------------- |
| `payments_select_own`           | Authenticated | SELECT         | `order_id IN (SELECT id FROM orders WHERE customer_id = auth.uid())` |
| `payments_insert_authenticated` | Authenticated | INSERT         | `order_id IN (SELECT id FROM orders WHERE customer_id = auth.uid())` |
| `payments_admin_all`            | Admin         | SELECT, UPDATE | Admin user                                                           |

**Rationale**:

- Users can view payments for their own orders
- Payment creation handled by backend (Stripe webhooks)
- No UPDATE for users (prevent fraud)
- Admins can view/manage payments

---

### 17. `refunds`

**Purpose**: Refund records

**Policies**:

| Policy Name          | Role          | Operation              | Condition                                                                                                          |
| -------------------- | ------------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `refunds_select_own` | Authenticated | SELECT                 | `payment_id IN (SELECT id FROM payments WHERE order_id IN (SELECT id FROM orders WHERE customer_id = auth.uid()))` |
| `refunds_admin_all`  | Admin         | SELECT, INSERT, UPDATE | Admin user                                                                                                         |

**Rationale**:

- Users can see refunds on their payments
- Only admins can process refunds

---

### 18. `inventory_reservations`

**Purpose**: Temporary inventory holds during checkout

**Policies**:

| Policy Name                         | Role          | Operation              | Condition                                                            |
| ----------------------------------- | ------------- | ---------------------- | -------------------------------------------------------------------- |
| `reservations_insert_authenticated` | Authenticated | INSERT                 | `order_id IN (SELECT id FROM orders WHERE customer_id = auth.uid())` |
| `reservations_admin_all`            | Admin         | SELECT, UPDATE, DELETE | Admin user                                                           |

**Rationale**:

- Users can create reservations (during checkout)
- Only admins can view/manage reservations
- Auto-cleanup via expiration

---

### 19. `email_notifications`

**Purpose**: Email notification log

**Policies**:

| Policy Name                         | Role         | Operation | Condition             |
| ----------------------------------- | ------------ | --------- | --------------------- |
| `email_notifications_insert_system` | Service Role | INSERT    | Always (backend only) |
| `email_notifications_admin_all`     | Admin        | SELECT    | Admin user            |

**Rationale**:

- No user access (internal logging)
- Only admins can view notification history

---

### 20. `audit_log`

**Purpose**: System audit trail

**Policies**:

| Policy Name               | Role         | Operation | Condition             |
| ------------------------- | ------------ | --------- | --------------------- |
| `audit_log_insert_system` | Service Role | INSERT    | Always (backend only) |
| `audit_log_admin_all`     | Admin        | SELECT    | Admin user            |

**Rationale**:

- Immutable audit log
- Only admins can view
- No DELETE/UPDATE

---

## Admin Detection Function

For policies that require admin privileges, we'll create a helper function:

```sql
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM customers
    WHERE id = auth.uid()
    AND email LIKE '%@meriendes.com'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

This function:

- Checks if the authenticated user exists in `customers` table
- Verifies if their email ends with `@meriendes.com`
- Returns `TRUE` for admin users, `FALSE` otherwise
- `SECURITY DEFINER` ensures it runs with elevated privileges

---

## Implementation Notes

### Order of Operations

1. **Enable RLS** on each table
2. **Create admin helper function**
3. **Apply policies** in order (public → authenticated → admin)
4. **Test each policy** thoroughly

### Testing Strategy

After applying policies:

1. **Public Access Test**: Browse products as unauthenticated user
2. **User Access Test**: Log in, create cart, place order
3. **Admin Access Test**: Verify admin can manage products/orders
4. **Negative Tests**: Attempt unauthorized access (should fail)

### Future Enhancements

- **Role-based access control** (RBAC) with explicit roles table
- **API key authentication** for backend services
- **Rate limiting policies** to prevent abuse
- **Geofencing policies** for delivery zone validation

---

## Security Checklist

- [ ] All tables have RLS enabled
- [ ] Public tables allow SELECT on active records only
- [ ] Users can only access their own data
- [ ] Admins identified via email domain or role column
- [ ] No policies allow unauthorized data modification
- [ ] Audit logs are immutable
- [ ] Guest checkout supported for orders
- [ ] Payment data restricted to order owners
- [ ] Inventory data protected from manipulation

---

## Migration Script Summary

The complete RLS policy migration will:

1. Enable RLS on all 22 tables
2. Create `is_admin()` helper function
3. Apply 80+ individual policies
4. Verify policies with test queries

**Estimated Time**: 2-3 minutes
**Rollback Strategy**: Drop all policies and disable RLS if issues occur

---

## Next Steps

1. Review this document for correctness
2. Apply policies using Supabase MCP
3. Test policies in development environment
4. Update application code to handle RLS errors gracefully
5. Document API error handling for RLS violations
