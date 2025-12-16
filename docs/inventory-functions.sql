-- =====================================================
-- INVENTORY MANAGEMENT FUNCTIONS
-- For checkout inventory reservation and release
-- =====================================================

-- Function to reserve inventory (decrement available, increment reserved)
CREATE OR REPLACE FUNCTION reserve_inventory(
    p_variant_id UUID,
    p_quantity INTEGER
)
RETURNS VOID AS $$
BEGIN
    UPDATE inventory
    SET 
        quantity_available = quantity_available - p_quantity,
        quantity_reserved = quantity_reserved + p_quantity,
        updated_at = NOW()
    WHERE variant_id = p_variant_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Inventory record not found for variant %', p_variant_id;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to release inventory (increment available, decrement reserved)
CREATE OR REPLACE FUNCTION release_inventory(
    p_variant_id UUID,
    p_quantity INTEGER
)
RETURNS VOID AS $$
BEGIN
    UPDATE inventory
    SET 
        quantity_available = quantity_available + p_quantity,
        quantity_reserved = quantity_reserved - p_quantity,
        updated_at = NOW()
    WHERE variant_id = p_variant_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Inventory record not found for variant %', p_variant_id;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to fulfill order (decrement reserved only)
CREATE OR REPLACE FUNCTION fulfill_order_inventory(
    p_variant_id UUID,
    p_quantity INTEGER
)
RETURNS VOID AS $$
BEGIN
    UPDATE inventory
    SET 
        quantity_reserved = quantity_reserved - p_quantity,
        updated_at = NOW()
    WHERE variant_id = p_variant_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Inventory record not found for variant %', p_variant_id;
    END IF;
    
    -- Insert movement record
    INSERT INTO inventory_movements (
        variant_id,
        movement_type,
        quantity,
        reference_type,
        reference_id,
        created_at
    ) VALUES (
        p_variant_id,
        'sale',
        -p_quantity,
        'order',
        NULL,
        NOW()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION reserve_inventory IS 'Reserves inventory during checkout (available--, reserved++)';
COMMENT ON FUNCTION release_inventory IS 'Releases reserved inventory on cancellation (available++, reserved--)';
COMMENT ON FUNCTION fulfill_order_inventory IS 'Fulfills order by decrementing reserved inventory only (reserved--)';
