-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================
-- Purpose: Implement security policies for all tables
-- Date: 2025-11-21
-- =====================================================

-- =====================================================
-- STEP 1: CREATE ADMIN HELPER FUNCTION
-- =====================================================

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

COMMENT ON FUNCTION is_admin() IS 'Helper function to identify admin users by email domain. Returns TRUE if authenticated user has @meriendes.com email.';

-- =====================================================
-- STEP 2: ENABLE RLS ON ALL TABLES
-- =====================================================

ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE nutrition_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE promo_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE bundles ENABLE ROW LEVEL SECURITY;
ALTER TABLE bundle_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE refunds ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- STEP 3: CUSTOMERS TABLE POLICIES
-- =====================================================

-- Users can view their own profile
CREATE POLICY customers_select_own ON customers
  FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY customers_update_own ON customers
  FOR UPDATE
  USING (auth.uid() = id);

-- Admins can view all customers
CREATE POLICY customers_admin_select ON customers
  FOR SELECT
  USING (is_admin());

-- Admins can update all customers
CREATE POLICY customers_admin_update ON customers
  FOR UPDATE
  USING (is_admin());

-- =====================================================
-- STEP 4: CUSTOMER_ADDRESSES TABLE POLICIES
-- =====================================================

CREATE POLICY addresses_select_own ON customer_addresses
  FOR SELECT
  USING (customer_id = auth.uid());

CREATE POLICY addresses_insert_own ON customer_addresses
  FOR INSERT
  WITH CHECK (customer_id = auth.uid());

CREATE POLICY addresses_update_own ON customer_addresses
  FOR UPDATE
  USING (customer_id = auth.uid());

CREATE POLICY addresses_delete_own ON customer_addresses
  FOR DELETE
  USING (customer_id = auth.uid());

CREATE POLICY addresses_admin_all ON customer_addresses
  FOR ALL
  USING (is_admin());

-- =====================================================
-- STEP 5: PRODUCT_CATEGORIES TABLE POLICIES
-- =====================================================

CREATE POLICY categories_select_public ON product_categories
  FOR SELECT
  USING (is_active = true);

CREATE POLICY categories_admin_all ON product_categories
  FOR ALL
  USING (is_admin());

-- =====================================================
-- STEP 6: PRODUCTS TABLE POLICIES
-- =====================================================

CREATE POLICY products_select_active_public ON products
  FOR SELECT
  USING (is_active = true);

CREATE POLICY products_admin_all ON products
  FOR ALL
  USING (is_admin());

-- =====================================================
-- STEP 7: PRODUCT_VARIANTS TABLE POLICIES
-- =====================================================

CREATE POLICY variants_select_active_public ON product_variants
  FOR SELECT
  USING (is_active = true);

CREATE POLICY variants_admin_all ON product_variants
  FOR ALL
  USING (is_admin());

-- =====================================================
-- STEP 8: TAGS TABLE POLICIES
-- =====================================================

CREATE POLICY tags_select_active_public ON tags
  FOR SELECT
  USING (is_active = true);

CREATE POLICY tags_admin_all ON tags
  FOR ALL
  USING (is_admin());

-- =====================================================
-- STEP 9: PRODUCT_TAGS TABLE POLICIES
-- =====================================================

CREATE POLICY product_tags_select_public ON product_tags
  FOR SELECT
  USING (true);

CREATE POLICY product_tags_admin_all ON product_tags
  FOR ALL
  USING (is_admin());

-- =====================================================
-- STEP 10: NUTRITION_INFO TABLE POLICIES
-- =====================================================

CREATE POLICY nutrition_select_public ON nutrition_info
  FOR SELECT
  USING (true);

CREATE POLICY nutrition_admin_all ON nutrition_info
  FOR ALL
  USING (is_admin());

-- =====================================================
-- STEP 11: INVENTORY TABLE POLICIES
-- =====================================================

CREATE POLICY inventory_select_public ON inventory
  FOR SELECT
  USING (quantity_available > 0);

CREATE POLICY inventory_admin_all ON inventory
  FOR ALL
  USING (is_admin());

-- =====================================================
-- STEP 12: INVENTORY_MOVEMENTS TABLE POLICIES
-- =====================================================

CREATE POLICY inventory_movements_admin_select ON inventory_movements
  FOR SELECT
  USING (is_admin());

CREATE POLICY inventory_movements_admin_insert ON inventory_movements
  FOR INSERT
  WITH CHECK (is_admin());

-- =====================================================
-- STEP 13: PROMO_CODES TABLE POLICIES
-- =====================================================

CREATE POLICY promo_codes_select_active_auth ON promo_codes
  FOR SELECT
  USING (
    auth.uid() IS NOT NULL 
    AND is_active = true 
    AND valid_from <= CURRENT_TIMESTAMP 
    AND valid_until >= CURRENT_TIMESTAMP
  );

CREATE POLICY promo_codes_admin_all ON promo_codes
  FOR ALL
  USING (is_admin());

-- =====================================================
-- STEP 14: BUNDLES TABLE POLICIES
-- =====================================================

CREATE POLICY bundles_select_active_public ON bundles
  FOR SELECT
  USING (is_active = true);

CREATE POLICY bundles_admin_all ON bundles
  FOR ALL
  USING (is_admin());

-- =====================================================
-- STEP 15: BUNDLE_ITEMS TABLE POLICIES
-- =====================================================

CREATE POLICY bundle_items_select_public ON bundle_items
  FOR SELECT
  USING (true);

CREATE POLICY bundle_items_admin_all ON bundle_items
  FOR ALL
  USING (is_admin());

-- =====================================================
-- STEP 16: ORDERS TABLE POLICIES
-- =====================================================

-- Users can view their own orders
CREATE POLICY orders_select_own ON orders
  FOR SELECT
  USING (customer_id = auth.uid());

-- Users can insert orders for themselves
CREATE POLICY orders_insert_authenticated ON orders
  FOR INSERT
  WITH CHECK (customer_id = auth.uid());

-- Guest checkout allowed (customer_id = NULL)
CREATE POLICY orders_insert_guest ON orders
  FOR INSERT
  WITH CHECK (customer_id IS NULL);

-- Users can update their own draft orders only
CREATE POLICY orders_update_own_draft ON orders
  FOR UPDATE
  USING (customer_id = auth.uid() AND status = 'draft');

-- Admins can view all orders
CREATE POLICY orders_admin_select ON orders
  FOR SELECT
  USING (is_admin());

-- Admins can update all orders
CREATE POLICY orders_admin_update ON orders
  FOR UPDATE
  USING (is_admin());

-- Admins can insert orders
CREATE POLICY orders_admin_insert ON orders
  FOR INSERT
  WITH CHECK (is_admin());

-- =====================================================
-- STEP 17: ORDER_ITEMS TABLE POLICIES
-- =====================================================

-- Users can view items in their own orders
CREATE POLICY order_items_select_own ON order_items
  FOR SELECT
  USING (
    order_id IN (
      SELECT id FROM orders WHERE customer_id = auth.uid()
    )
  );

-- Users can add items to their own draft orders
CREATE POLICY order_items_insert_own ON order_items
  FOR INSERT
  WITH CHECK (
    order_id IN (
      SELECT id FROM orders 
      WHERE customer_id = auth.uid() AND status = 'draft'
    )
  );

-- Admins have full access
CREATE POLICY order_items_admin_all ON order_items
  FOR ALL
  USING (is_admin());

-- =====================================================
-- STEP 18: CARTS TABLE POLICIES
-- =====================================================

CREATE POLICY carts_select_own ON carts
  FOR SELECT
  USING (customer_id = auth.uid());

CREATE POLICY carts_insert_own ON carts
  FOR INSERT
  WITH CHECK (customer_id = auth.uid());

CREATE POLICY carts_update_own ON carts
  FOR UPDATE
  USING (customer_id = auth.uid());

CREATE POLICY carts_delete_own ON carts
  FOR DELETE
  USING (customer_id = auth.uid());

CREATE POLICY carts_admin_select ON carts
  FOR SELECT
  USING (is_admin());

CREATE POLICY carts_admin_delete ON carts
  FOR DELETE
  USING (is_admin());

-- =====================================================
-- STEP 19: CART_ITEMS TABLE POLICIES
-- =====================================================

CREATE POLICY cart_items_select_own ON cart_items
  FOR SELECT
  USING (
    cart_id IN (
      SELECT id FROM carts WHERE customer_id = auth.uid()
    )
  );

CREATE POLICY cart_items_insert_own ON cart_items
  FOR INSERT
  WITH CHECK (
    cart_id IN (
      SELECT id FROM carts WHERE customer_id = auth.uid()
    )
  );

CREATE POLICY cart_items_update_own ON cart_items
  FOR UPDATE
  USING (
    cart_id IN (
      SELECT id FROM carts WHERE customer_id = auth.uid()
    )
  );

CREATE POLICY cart_items_delete_own ON cart_items
  FOR DELETE
  USING (
    cart_id IN (
      SELECT id FROM carts WHERE customer_id = auth.uid()
    )
  );

CREATE POLICY cart_items_admin_all ON cart_items
  FOR ALL
  USING (is_admin());

-- =====================================================
-- STEP 20: PAYMENTS TABLE POLICIES
-- =====================================================

-- Users can view payments for their own orders
CREATE POLICY payments_select_own ON payments
  FOR SELECT
  USING (
    order_id IN (
      SELECT id FROM orders WHERE customer_id = auth.uid()
    )
  );

-- Users can create payments for their own orders
CREATE POLICY payments_insert_authenticated ON payments
  FOR INSERT
  WITH CHECK (
    order_id IN (
      SELECT id FROM orders WHERE customer_id = auth.uid()
    )
  );

-- Admins can view all payments
CREATE POLICY payments_admin_select ON payments
  FOR SELECT
  USING (is_admin());

-- Admins can update payments
CREATE POLICY payments_admin_update ON payments
  FOR UPDATE
  USING (is_admin());

-- =====================================================
-- STEP 21: REFUNDS TABLE POLICIES
-- =====================================================

-- Users can view refunds for their own payments
CREATE POLICY refunds_select_own ON refunds
  FOR SELECT
  USING (
    payment_id IN (
      SELECT id FROM payments 
      WHERE order_id IN (
        SELECT id FROM orders WHERE customer_id = auth.uid()
      )
    )
  );

-- Admins have full access
CREATE POLICY refunds_admin_all ON refunds
  FOR ALL
  USING (is_admin());

-- =====================================================
-- STEP 22: INVENTORY_RESERVATIONS TABLE POLICIES
-- =====================================================

-- Users can create reservations for their own orders
CREATE POLICY reservations_insert_authenticated ON inventory_reservations
  FOR INSERT
  WITH CHECK (
    order_id IN (
      SELECT id FROM orders WHERE customer_id = auth.uid()
    )
  );

-- Admins have full access
CREATE POLICY reservations_admin_all ON inventory_reservations
  FOR ALL
  USING (is_admin());

-- =====================================================
-- STEP 23: EMAIL_NOTIFICATIONS TABLE POLICIES
-- =====================================================

-- Only admins can view notifications
CREATE POLICY email_notifications_admin_select ON email_notifications
  FOR SELECT
  USING (is_admin());

-- Note: INSERT for notifications should be done via service role in backend

-- =====================================================
-- STEP 24: AUDIT_LOG TABLE POLICIES
-- =====================================================

-- Only admins can view audit logs
CREATE POLICY audit_log_admin_select ON audit_log
  FOR SELECT
  USING (is_admin());

-- Note: INSERT for audit logs should be done via service role in backend

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Verify RLS is enabled on all tables
SELECT 
  schemaname, 
  tablename, 
  rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;

-- Count policies per table
SELECT 
  schemaname,
  tablename,
  COUNT(*) as policy_count
FROM pg_policies
WHERE schemaname = 'public'
GROUP BY schemaname, tablename
ORDER BY tablename;

-- List all policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
