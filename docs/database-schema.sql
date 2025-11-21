-- =====================================================
-- E-COMMERCE MEAL DELIVERY DATABASE SCHEMA
-- =====================================================
-- Database: PostgreSQL 14+
-- Features: ACID compliance, referential integrity, indexing
-- Changes: Removed delivery zones, fixed bundle structure,
--          simplified cart (browser-first), email-only notifications
-- =====================================================

-- Enable UUID extension for better distributed ID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- CUSTOMERS & AUTHENTICATION
-- =====================================================

CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    email_verified BOOLEAN DEFAULT FALSE,
    email_notifications BOOLEAN DEFAULT TRUE,
    marketing_opt_in BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE,
    CONSTRAINT email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_customers_created_at ON customers(created_at);

-- =====================================================
-- DELIVERY ADDRESSES (No delivery zones - accept all)
-- =====================================================

CREATE TABLE customer_addresses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    address_label VARCHAR(50), -- e.g., "Home", "Office"
    street_address_1 VARCHAR(255) NOT NULL,
    street_address_2 VARCHAR(255),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(50) NOT NULL,
    zip_code VARCHAR(20) NOT NULL,
    country VARCHAR(2) DEFAULT 'US',
    is_default BOOLEAN DEFAULT FALSE,
    delivery_instructions TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_customer_addresses_customer ON customer_addresses(customer_id);

-- =====================================================
-- PRODUCTS & CATALOG
-- =====================================================

CREATE TABLE product_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id INTEGER REFERENCES product_categories(id),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    short_description VARCHAR(500),
    image_url VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    is_seasonal BOOLEAN DEFAULT FALSE,
    is_featured BOOLEAN DEFAULT FALSE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_active ON products(is_active);

-- =====================================================
-- PRODUCT VARIANTS (Sizes: Small, Large, etc.)
-- =====================================================

CREATE TABLE product_variants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    sku VARCHAR(50) NOT NULL UNIQUE,
    variant_name VARCHAR(100) NOT NULL, -- "Small", "Large"
    price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
    compare_at_price DECIMAL(10, 2), -- Original price for sale display
    cost DECIMAL(10, 2), -- Cost basis for analytics
    weight_grams INTEGER,
    is_active BOOLEAN DEFAULT TRUE,
    display_order INTEGER DEFAULT 0,
    
    -- Stripe integration: Links to Stripe Price object
    stripe_price_id VARCHAR(255), -- Stripe Price ID (e.g., price_1AbC2dEfG3HiJ4kL)
    stripe_product_id VARCHAR(255), -- Stripe Product ID (e.g., prod_1AbC2dEfG3HiJ4kL)
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT price_validation CHECK (compare_at_price IS NULL OR compare_at_price >= price)
);

CREATE INDEX idx_product_variants_product ON product_variants(product_id);
CREATE INDEX idx_product_variants_sku ON product_variants(sku);
CREATE INDEX idx_product_variants_stripe_price ON product_variants(stripe_price_id);

COMMENT ON COLUMN product_variants.stripe_price_id IS 'Stripe Price ID for payment processing. Each variant has its own Stripe Price object.';
COMMENT ON COLUMN product_variants.stripe_product_id IS 'Stripe Product ID. Multiple variants of same product share this Stripe Product ID.';

-- =====================================================
-- PRODUCT TAGS (For search & filtering)
-- =====================================================

CREATE TABLE tags (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    slug VARCHAR(50) NOT NULL UNIQUE,
    tag_type VARCHAR(30) NOT NULL, -- 'dietary', 'ingredient', 'cuisine', 'meal_type', 'allergen', 'feature'
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT tag_type_check CHECK (tag_type IN ('dietary', 'ingredient', 'cuisine', 'meal_type', 'allergen', 'feature'))
);

CREATE INDEX idx_tags_type ON tags(tag_type);
CREATE INDEX idx_tags_slug ON tags(slug);
CREATE INDEX idx_tags_active ON tags(is_active);

-- Product-Tag relationship (many-to-many)
CREATE TABLE product_tags (
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    tag_id INTEGER NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (product_id, tag_id)
);

CREATE INDEX idx_product_tags_product ON product_tags(product_id);
CREATE INDEX idx_product_tags_tag ON product_tags(tag_id);

COMMENT ON TABLE product_tags IS 'Many-to-many relationship between products and tags for advanced filtering';

-- =====================================================
-- NUTRITION INFORMATION (Per serving/variant)
-- =====================================================

CREATE TABLE nutrition_info (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    variant_id UUID NOT NULL REFERENCES product_variants(id) ON DELETE CASCADE,
    
    -- Serving information
    serving_size VARCHAR(50), -- e.g., "1 container", "350g"
    serving_size_grams DECIMAL(8, 2), -- Weight in grams
    servings_per_container DECIMAL(4, 1) DEFAULT 1,
    
    -- Core macronutrients (required)
    calories INTEGER NOT NULL CHECK (calories >= 0),
    protein_grams DECIMAL(6, 2) NOT NULL CHECK (protein_grams >= 0),
    carbohydrates_grams DECIMAL(6, 2) NOT NULL CHECK (carbohydrates_grams >= 0),
    fat_grams DECIMAL(6, 2) NOT NULL CHECK (fat_grams >= 0),
    
    -- Detailed fats
    saturated_fat_grams DECIMAL(6, 2) CHECK (saturated_fat_grams >= 0),
    trans_fat_grams DECIMAL(6, 2) CHECK (trans_fat_grams >= 0),
    polyunsaturated_fat_grams DECIMAL(6, 2) CHECK (polyunsaturated_fat_grams >= 0),
    monounsaturated_fat_grams DECIMAL(6, 2) CHECK (monounsaturated_fat_grams >= 0),
    
    -- Detailed carbohydrates
    dietary_fiber_grams DECIMAL(6, 2) CHECK (dietary_fiber_grams >= 0),
    sugars_grams DECIMAL(6, 2) CHECK (sugars_grams >= 0),
    added_sugars_grams DECIMAL(6, 2) CHECK (added_sugars_grams >= 0),
    sugar_alcohols_grams DECIMAL(6, 2) CHECK (sugar_alcohols_grams >= 0),
    
    -- Minerals & Electrolytes
    sodium_mg DECIMAL(8, 2) CHECK (sodium_mg >= 0),
    potassium_mg DECIMAL(8, 2) CHECK (potassium_mg >= 0),
    cholesterol_mg DECIMAL(7, 2) CHECK (cholesterol_mg >= 0),
    calcium_mg DECIMAL(7, 2) CHECK (calcium_mg >= 0),
    iron_mg DECIMAL(6, 2) CHECK (iron_mg >= 0),
    magnesium_mg DECIMAL(7, 2) CHECK (magnesium_mg >= 0),
    zinc_mg DECIMAL(6, 2) CHECK (zinc_mg >= 0),
    
    -- Vitamins
    vitamin_a_mcg DECIMAL(7, 2) CHECK (vitamin_a_mcg >= 0),
    vitamin_c_mg DECIMAL(7, 2) CHECK (vitamin_c_mg >= 0),
    vitamin_d_mcg DECIMAL(6, 2) CHECK (vitamin_d_mcg >= 0),
    vitamin_e_mg DECIMAL(6, 2) CHECK (vitamin_e_mg >= 0),
    vitamin_k_mcg DECIMAL(7, 2) CHECK (vitamin_k_mcg >= 0),
    vitamin_b6_mg DECIMAL(6, 2) CHECK (vitamin_b6_mg >= 0),
    vitamin_b12_mcg DECIMAL(6, 2) CHECK (vitamin_b12_mcg >= 0),
    folate_mcg DECIMAL(7, 2) CHECK (folate_mcg >= 0),
    
    -- Additional health metrics
    glycemic_index INTEGER CHECK (glycemic_index BETWEEN 1 AND 100),
    glycemic_load DECIMAL(5, 2) CHECK (glycemic_load >= 0),
    omega3_grams DECIMAL(6, 2) CHECK (omega3_grams >= 0),
    omega6_grams DECIMAL(6, 2) CHECK (omega6_grams >= 0),
    
    -- Allergen flags
    contains_gluten BOOLEAN DEFAULT FALSE,
    contains_dairy BOOLEAN DEFAULT FALSE,
    contains_eggs BOOLEAN DEFAULT FALSE,
    contains_fish BOOLEAN DEFAULT FALSE,
    contains_shellfish BOOLEAN DEFAULT FALSE,
    contains_tree_nuts BOOLEAN DEFAULT FALSE,
    contains_peanuts BOOLEAN DEFAULT FALSE,
    contains_soy BOOLEAN DEFAULT FALSE,
    contains_wheat BOOLEAN DEFAULT FALSE,
    contains_sesame BOOLEAN DEFAULT FALSE,
    
    -- Ingredients & certifications
    ingredients_list TEXT,
    allergen_warnings TEXT, -- Free-text for "May contain traces of..."
    is_organic BOOLEAN DEFAULT FALSE,
    is_non_gmo BOOLEAN DEFAULT FALSE,
    is_gluten_free BOOLEAN DEFAULT FALSE,
    is_dairy_free BOOLEAN DEFAULT FALSE,
    is_vegan BOOLEAN DEFAULT FALSE,
    is_vegetarian BOOLEAN DEFAULT FALSE,
    is_kosher BOOLEAN DEFAULT FALSE,
    is_halal BOOLEAN DEFAULT FALSE,
    
    -- Metadata
    nutrition_data_source VARCHAR(100), -- 'lab_tested', 'usda_database', 'manufacturer', 'calculated'
    last_verified_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(variant_id)
);

CREATE INDEX idx_nutrition_variant ON nutrition_info(variant_id);
CREATE INDEX idx_nutrition_calories ON nutrition_info(calories);
CREATE INDEX idx_nutrition_protein ON nutrition_info(protein_grams);
CREATE INDEX idx_nutrition_vegan ON nutrition_info(is_vegan) WHERE is_vegan = TRUE;
CREATE INDEX idx_nutrition_vegetarian ON nutrition_info(is_vegetarian) WHERE is_vegetarian = TRUE;
CREATE INDEX idx_nutrition_gluten_free ON nutrition_info(is_gluten_free) WHERE is_gluten_free = TRUE;
CREATE INDEX idx_nutrition_dairy_free ON nutrition_info(is_dairy_free) WHERE is_dairy_free = TRUE;

COMMENT ON TABLE nutrition_info IS 'Comprehensive nutrition information per product variant. Includes macros, micros, vitamins, minerals, allergens, and certifications for health-conscious customers.';
COMMENT ON COLUMN nutrition_info.serving_size_grams IS 'Weight of one serving in grams for consistent nutrition calculations';
COMMENT ON COLUMN nutrition_info.glycemic_index IS 'GI score (1-100): Low=1-55, Medium=56-69, High=70+. Useful for diabetic customers.';
COMMENT ON COLUMN nutrition_info.nutrition_data_source IS 'Transparency about data origin: lab_tested (most accurate), usda_database, manufacturer, calculated';

-- =====================================================
-- INVENTORY MANAGEMENT
-- =====================================================

CREATE TABLE inventory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    variant_id UUID NOT NULL REFERENCES product_variants(id) ON DELETE CASCADE,
    quantity_available INTEGER NOT NULL DEFAULT 0 CHECK (quantity_available >= 0),
    quantity_reserved INTEGER NOT NULL DEFAULT 0 CHECK (quantity_reserved >= 0),
    low_stock_threshold INTEGER DEFAULT 10,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(variant_id)
);

CREATE INDEX idx_inventory_variant ON inventory(variant_id);

-- Inventory movement tracking for audit
CREATE TABLE inventory_movements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    variant_id UUID NOT NULL REFERENCES product_variants(id),
    movement_type VARCHAR(50) NOT NULL, -- 'restock', 'sale', 'reservation', 'release', 'adjustment'
    quantity INTEGER NOT NULL,
    reference_type VARCHAR(50), -- 'order', 'manual', 'system'
    reference_id UUID,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES customers(id)
);

CREATE INDEX idx_inventory_movements_variant ON inventory_movements(variant_id);
CREATE INDEX idx_inventory_movements_created ON inventory_movements(created_at);

-- =====================================================
-- PROMOTIONAL CODES
-- =====================================================

CREATE TABLE promo_codes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    discount_type VARCHAR(20) NOT NULL, -- 'percentage', 'fixed_amount'
    discount_value DECIMAL(10, 2) NOT NULL CHECK (discount_value > 0),
    minimum_order_amount DECIMAL(10, 2) DEFAULT 0,
    max_uses INTEGER,
    times_used INTEGER DEFAULT 0,
    valid_from TIMESTAMP WITH TIME ZONE NOT NULL,
    valid_until TIMESTAMP WITH TIME ZONE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_discount CHECK (
        (discount_type = 'percentage' AND discount_value <= 100) OR
        discount_type = 'fixed_amount'
    )
);

CREATE INDEX idx_promo_codes_code ON promo_codes(code);
CREATE INDEX idx_promo_codes_valid ON promo_codes(valid_from, valid_until);

-- =====================================================
-- BUNDLES (Collections of DIFFERENT meal variants)
-- =====================================================

CREATE TABLE bundles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    image_url VARCHAR(500),
    price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
    savings_amount DECIMAL(10, 2), -- How much customer saves vs buying individually
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_bundles_slug ON bundles(slug);
CREATE INDEX idx_bundles_active ON bundles(is_active);

-- Bundle composition: Each bundle contains different product variants
CREATE TABLE bundle_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    bundle_id UUID NOT NULL REFERENCES bundles(id) ON DELETE CASCADE,
    variant_id UUID NOT NULL REFERENCES product_variants(id),
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    -- A bundle can have the same variant multiple times if needed (e.g., 2 small chicken, 1 large beef)
    -- But typically bundles will have different products for variety
    UNIQUE(bundle_id, variant_id)
);

CREATE INDEX idx_bundle_items_bundle ON bundle_items(bundle_id);
CREATE INDEX idx_bundle_items_variant ON bundle_items(variant_id);

COMMENT ON TABLE bundles IS 'Promotional meal bundles containing different products at discounted prices';
COMMENT ON TABLE bundle_items IS 'Individual product variants that make up a bundle. Each bundle should contain different meal types for variety.';

-- =====================================================
-- ORDERS
-- =====================================================

CREATE TYPE order_status AS ENUM (
    'draft',
    'awaiting_payment',
    'paid',
    'processing',
    'ready_for_delivery',
    'out_for_delivery',
    'delivered',
    'cancelled'
);

CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number VARCHAR(50) NOT NULL UNIQUE,
    customer_id UUID REFERENCES customers(id), -- NULL for guest checkout
    status order_status NOT NULL DEFAULT 'draft',
    
    -- Pricing
    subtotal DECIMAL(10, 2) NOT NULL DEFAULT 0 CHECK (subtotal >= 0),
    discount_amount DECIMAL(10, 2) DEFAULT 0 CHECK (discount_amount >= 0),
    tax_amount DECIMAL(10, 2) DEFAULT 0 CHECK (tax_amount >= 0),
    delivery_fee DECIMAL(10, 2) DEFAULT 0 CHECK (delivery_fee >= 0),
    total DECIMAL(10, 2) NOT NULL DEFAULT 0 CHECK (total >= 0),
    
    -- Promo code
    promo_code_id UUID REFERENCES promo_codes(id),
    
    -- Delivery information (snapshot at order time)
    delivery_street_address_1 VARCHAR(255) NOT NULL,
    delivery_street_address_2 VARCHAR(255),
    delivery_city VARCHAR(100) NOT NULL,
    delivery_state VARCHAR(50) NOT NULL,
    delivery_zip_code VARCHAR(20) NOT NULL,
    delivery_country VARCHAR(2) DEFAULT 'US',
    delivery_instructions TEXT,
    
    -- Contact information (required for all orders, especially guest checkout)
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(20),
    customer_first_name VARCHAR(100) NOT NULL,
    customer_last_name VARCHAR(100) NOT NULL,
    
    -- Payment
    payment_status VARCHAR(50),
    payment_method VARCHAR(50),
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    paid_at TIMESTAMP WITH TIME ZONE,
    processing_at TIMESTAMP WITH TIME ZONE,
    ready_at TIMESTAMP WITH TIME ZONE,
    out_for_delivery_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    cancelled_at TIMESTAMP WITH TIME ZONE,
    
    -- Metadata
    customer_notes TEXT,
    internal_notes TEXT,
    cancellation_reason TEXT
);

CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created ON orders(created_at);
CREATE INDEX idx_orders_order_number ON orders(order_number);
CREATE INDEX idx_orders_customer_email ON orders(customer_email);

COMMENT ON TABLE orders IS 'Complete order records. Supports both registered customers and guest checkout. All delivery addresses stored directly in order.';

-- =====================================================
-- ORDER ITEMS (Individual products OR complete bundles)
-- =====================================================
-- BEST PRACTICE: Separate line items for products and bundles
-- This allows proper tracking, inventory management, and reporting

CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    
    -- Type discriminator: is this a product or bundle?
    item_type VARCHAR(20) NOT NULL CHECK (item_type IN ('product', 'bundle')),
    
    -- Reference to actual product variant OR bundle
    variant_id UUID REFERENCES product_variants(id), -- Used when item_type = 'product'
    bundle_id UUID REFERENCES bundles(id),           -- Used when item_type = 'bundle'
    
    -- Snapshot of item details at time of order (for historical accuracy)
    product_name VARCHAR(255) NOT NULL,
    variant_name VARCHAR(100), -- NULL for bundles
    sku VARCHAR(50),            -- NULL for bundles
    
    -- Pricing and quantity
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(10, 2) NOT NULL CHECK (unit_price >= 0),
    line_total DECIMAL(10, 2) NOT NULL CHECK (line_total >= 0),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Ensure each item references EITHER a variant OR a bundle, not both
    CONSTRAINT item_reference_check CHECK (
        (item_type = 'product' AND variant_id IS NOT NULL AND bundle_id IS NULL) OR
        (item_type = 'bundle' AND bundle_id IS NOT NULL AND variant_id IS NULL)
    )
);

CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_variant ON order_items(variant_id) WHERE variant_id IS NOT NULL;
CREATE INDEX idx_order_items_bundle ON order_items(bundle_id) WHERE bundle_id IS NOT NULL;
CREATE INDEX idx_order_items_type ON order_items(item_type);

COMMENT ON TABLE order_items IS 'Line items in orders. Each row is either a product variant OR a complete bundle. item_type determines which. This supports orders with mix of individual products and bundles.';

COMMENT ON COLUMN order_items.item_type IS 'Discriminator: "product" for individual product variants, "bundle" for complete meal bundles';
COMMENT ON COLUMN order_items.variant_id IS 'FK to product_variants when item_type=product. NULL for bundles.';
COMMENT ON COLUMN order_items.bundle_id IS 'FK to bundles when item_type=bundle. NULL for products.';

-- =====================================================
-- CART (Optional DB storage for registered users)
-- =====================================================
-- NOTE: Primary cart storage is in browser (localStorage/sessionStorage)
-- This table provides:
-- 1. Cart persistence for logged-in users across devices
-- 2. Cart recovery if browser storage is cleared
-- 3. Analytics on abandoned carts

CREATE TABLE carts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    
    -- Cart metadata
    expires_at TIMESTAMP WITH TIME ZONE, -- Optional: auto-clear old carts
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(customer_id) -- One cart per customer
);

CREATE INDEX idx_carts_customer ON carts(customer_id);
CREATE INDEX idx_carts_expires ON carts(expires_at) WHERE expires_at IS NOT NULL;

CREATE TABLE cart_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cart_id UUID NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
    
    -- Item type: product or bundle
    item_type VARCHAR(20) NOT NULL CHECK (item_type IN ('product', 'bundle')),
    variant_id UUID REFERENCES product_variants(id),
    bundle_id UUID REFERENCES bundles(id),
    
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Ensure uniqueness: can't have same item twice in cart
    UNIQUE(cart_id, variant_id, bundle_id),
    
    -- Ensure proper item reference
    CONSTRAINT cart_item_reference_check CHECK (
        (item_type = 'product' AND variant_id IS NOT NULL AND bundle_id IS NULL) OR
        (item_type = 'bundle' AND bundle_id IS NOT NULL AND variant_id IS NULL)
    )
);

CREATE INDEX idx_cart_items_cart ON cart_items(cart_id);
CREATE INDEX idx_cart_items_variant ON cart_items(variant_id) WHERE variant_id IS NOT NULL;
CREATE INDEX idx_cart_items_bundle ON cart_items(bundle_id) WHERE bundle_id IS NOT NULL;

COMMENT ON TABLE carts IS 'Optional server-side cart storage for registered users. Primary cart is browser-based. This enables cross-device sync and cart recovery.';
COMMENT ON TABLE cart_items IS 'Items in saved carts. Supports both product variants and bundles.';

-- =====================================================
-- PAYMENT PROCESSING
-- =====================================================

CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id),
    
    -- Stripe integration
    stripe_payment_intent_id VARCHAR(255) UNIQUE,
    stripe_payment_method_id VARCHAR(255),
    stripe_customer_id VARCHAR(255),
    
    -- Payment details
    amount DECIMAL(10, 2) NOT NULL CHECK (amount >= 0),
    currency VARCHAR(3) DEFAULT 'USD',
    status VARCHAR(50) NOT NULL, -- 'pending', 'succeeded', 'failed', 'refunded'
    payment_method_type VARCHAR(50), -- 'card', 'apple_pay', 'google_pay'
    
    -- Card details (last 4 digits only for reference)
    card_brand VARCHAR(50),
    card_last4 VARCHAR(4),
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    succeeded_at TIMESTAMP WITH TIME ZONE,
    failed_at TIMESTAMP WITH TIME ZONE,
    
    -- Error handling
    failure_code VARCHAR(100),
    failure_message TEXT,
    
    -- Metadata
    metadata JSONB
);

CREATE INDEX idx_payments_order ON payments(order_id);
CREATE INDEX idx_payments_stripe_intent ON payments(stripe_payment_intent_id);
CREATE INDEX idx_payments_status ON payments(status);

-- =====================================================
-- REFUNDS
-- =====================================================

CREATE TABLE refunds (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    payment_id UUID NOT NULL REFERENCES payments(id),
    order_id UUID NOT NULL REFERENCES orders(id),
    stripe_refund_id VARCHAR(255) UNIQUE,
    
    amount DECIMAL(10, 2) NOT NULL CHECK (amount > 0),
    reason VARCHAR(100),
    notes TEXT,
    status VARCHAR(50) NOT NULL, -- 'pending', 'succeeded', 'failed'
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMP WITH TIME ZONE,
    created_by UUID REFERENCES customers(id)
);

CREATE INDEX idx_refunds_payment ON refunds(payment_id);
CREATE INDEX idx_refunds_order ON refunds(order_id);

-- =====================================================
-- INVENTORY RESERVATIONS
-- =====================================================

CREATE TABLE inventory_reservations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    variant_id UUID NOT NULL REFERENCES product_variants(id),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    released_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_reservations_variant ON inventory_reservations(variant_id);
CREATE INDEX idx_reservations_order ON inventory_reservations(order_id);
CREATE INDEX idx_reservations_expires ON inventory_reservations(expires_at);

COMMENT ON TABLE inventory_reservations IS 'Temporary inventory holds during checkout. Prevents overselling during payment process.';

-- =====================================================
-- NOTIFICATIONS & COMMUNICATIONS
-- =====================================================

CREATE TABLE email_notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES customers(id),
    order_id UUID REFERENCES orders(id),
    
    -- Email details
    recipient_email VARCHAR(255) NOT NULL,
    template_name VARCHAR(100) NOT NULL, -- 'order_confirmation', 'order_shipped', 'order_delivered', etc.
    subject VARCHAR(255) NOT NULL,
    
    -- Status tracking
    status VARCHAR(50) NOT NULL DEFAULT 'pending', -- 'pending', 'sent', 'failed'
    external_id VARCHAR(255), -- Email service provider ID (SendGrid, Mailgun, etc.)
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    sent_at TIMESTAMP WITH TIME ZONE,
    failed_at TIMESTAMP WITH TIME ZONE,
    
    -- Error handling
    error_message TEXT,
    retry_count INTEGER DEFAULT 0
);

CREATE INDEX idx_email_notifications_customer ON email_notifications(customer_id);
CREATE INDEX idx_email_notifications_order ON email_notifications(order_id);
CREATE INDEX idx_email_notifications_status ON email_notifications(status);
CREATE INDEX idx_email_notifications_created ON email_notifications(created_at);

COMMENT ON TABLE email_notifications IS 'All customer communications via email only. Tracks delivery status and history.';

-- =====================================================
-- AUDIT & COMPLIANCE
-- =====================================================

CREATE TABLE audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    table_name VARCHAR(100) NOT NULL,
    record_id UUID NOT NULL,
    action VARCHAR(50) NOT NULL, -- 'INSERT', 'UPDATE', 'DELETE'
    old_values JSONB,
    new_values JSONB,
    changed_by UUID REFERENCES customers(id),
    changed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    ip_address INET
);

CREATE INDEX idx_audit_table_record ON audit_log(table_name, record_id);
CREATE INDEX idx_audit_changed_at ON audit_log(changed_at);

-- =====================================================
-- VIEWS FOR COMMON QUERIES
-- =====================================================

-- Available inventory (total - reserved)
CREATE VIEW v_available_inventory AS
SELECT 
    i.variant_id,
    i.quantity_available,
    i.quantity_reserved,
    (i.quantity_available - i.quantity_reserved) AS quantity_sellable,
    i.low_stock_threshold,
    CASE 
        WHEN (i.quantity_available - i.quantity_reserved) <= 0 THEN 'out_of_stock'
        WHEN (i.quantity_available - i.quantity_reserved) <= i.low_stock_threshold THEN 'low_stock'
        ELSE 'in_stock'
    END AS stock_status
FROM inventory i;

-- Order summary with customer info
CREATE VIEW v_order_summary AS
SELECT 
    o.id,
    o.order_number,
    o.status,
    o.total,
    o.created_at,
    o.delivered_at,
    o.customer_email,
    o.customer_first_name,
    o.customer_last_name,
    COALESCE(c.id, NULL) AS customer_id,
    CASE WHEN c.id IS NULL THEN TRUE ELSE FALSE END AS is_guest_order,
    COUNT(oi.id) AS item_count
FROM orders o
LEFT JOIN customers c ON o.customer_id = c.id
LEFT JOIN order_items oi ON o.id = oi.order_id
GROUP BY o.id, c.id;

-- Bundle composition details
CREATE VIEW v_bundle_details AS
SELECT 
    b.id AS bundle_id,
    b.name AS bundle_name,
    b.price AS bundle_price,
    p.name AS product_name,
    pv.variant_name,
    pv.price AS individual_price,
    bi.quantity,
    (pv.price * bi.quantity) AS component_total
FROM bundles b
JOIN bundle_items bi ON b.id = bi.bundle_id
JOIN product_variants pv ON bi.variant_id = pv.id
JOIN products p ON pv.product_id = p.id
WHERE b.is_active = TRUE;

-- =====================================================
-- FUNCTIONS & TRIGGERS
-- =====================================================

-- Update timestamp function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to relevant tables
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_product_variants_updated_at BEFORE UPDATE ON product_variants
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_carts_updated_at BEFORE UPDATE ON carts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cart_items_updated_at BEFORE UPDATE ON cart_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bundles_updated_at BEFORE UPDATE ON bundles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_nutrition_info_updated_at BEFORE UPDATE ON nutrition_info
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customer_addresses_updated_at BEFORE UPDATE ON customer_addresses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Generate order number function
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.order_number IS NULL THEN
        NEW.order_number := 'ORD-' || TO_CHAR(CURRENT_TIMESTAMP, 'YYYYMMDD') || '-' || 
                           LPAD(nextval('order_number_seq')::TEXT, 6, '0');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE SEQUENCE order_number_seq START 1;

CREATE TRIGGER generate_order_number_trigger BEFORE INSERT ON orders
    FOR EACH ROW EXECUTE FUNCTION generate_order_number();

-- =====================================================
-- DESIGN NOTES & DOCUMENTATION
-- =====================================================

COMMENT ON SCHEMA public IS 'Meal delivery e-commerce database';

-- EXAMPLE: How order_items handles mixed orders
-- Order with 2 individual products + 1 bundle:
--
-- order_items:
-- | item_type | variant_id        | bundle_id         | product_name      | quantity | unit_price |
-- |-----------|-------------------|-------------------|-------------------|----------|------------|
-- | product   | uuid-variant-123  | NULL              | Chicken Teriyaki  | 2        | 12.99      |
-- | product   | uuid-variant-456  | NULL              | Beef Stir Fry     | 1        | 15.99      |
-- | bundle    | NULL              | uuid-bundle-789   | Family Pack       | 1        | 49.99      |
--
-- This design:
-- ✅ Clearly separates products from bundles
-- ✅ Allows proper inventory tracking (products deduct inventory, bundles deduct their components)
-- ✅ Simplifies reporting (can aggregate by item_type)
-- ✅ Maintains referential integrity
-- ✅ Stores historical snapshot of what was ordered

-- Key design decisions:
COMMENT ON TABLE orders IS 'All delivery addresses stored inline (no zones). Supports guest + registered checkout.';
COMMENT ON TABLE order_items IS 'CRITICAL: Each row is either a product OR bundle (never both). Use item_type to distinguish.';
COMMENT ON TABLE bundles IS 'Promotional meal packages with multiple DIFFERENT products at discount prices.';
COMMENT ON TABLE carts IS 'OPTIONAL: Server-side cart for registered users. Primary storage is browser localStorage.';
COMMENT ON TABLE email_notifications IS 'ALL communications via email only (no SMS).';
COMMENT ON TABLE tags IS 'Product tags for filtering and search. Types: dietary (vegan, keto), ingredient (chicken, beef), cuisine (asian, mexican), meal_type (breakfast, dinner), allergen (nuts, dairy), feature (spicy, kid-friendly)';

-- =====================================================
-- END OF SCHEMA
-- =====================================================