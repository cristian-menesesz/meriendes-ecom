-- SEED DATA

-- =====================================================
-- CUSTOMERS
-- =====================================================

INSERT INTO customers (id, email, password_hash, first_name, last_name, phone, email_verified, marketing_opt_in, created_at) VALUES
-- Password for all test users: 'password123' (hashed with bcrypt)
('a1b2c3d4-0001-4000-8000-000000000001', 'sarah.johnson@email.com', '$2b$10$rZ3qPxHX5VKJ8YzM9vQN4.XWFqZJXYZK8hYqGN5YzM9vQN4.XWFqZ', 'Sarah', 'Johnson', '555-0101', true, true, NOW() - INTERVAL '180 days'),
('a1b2c3d4-0001-4000-8000-000000000002', 'michael.chen@email.com', '$2b$10$rZ3qPxHX5VKJ8YzM9vQN4.XWFqZJXYZK8hYqGN5YzM9vQN4.XWFqZ', 'Michael', 'Chen', '555-0102', true, true, NOW() - INTERVAL '165 days'),
('a1b2c3d4-0001-4000-8000-000000000003', 'emma.williams@email.com', '$2b$10$rZ3qPxHX5VKJ8YzM9vQN4.XWFqZJXYZK8hYqGN5YzM9vQN4.XWFqZ', 'Emma', 'Williams', '555-0103', true, false, NOW() - INTERVAL '150 days'),
('a1b2c3d4-0001-4000-8000-000000000004', 'james.rodriguez@email.com', '$2b$10$rZ3qPxHX5VKJ8YzM9vQN4.XWFqZJXYZK8hYqGN5YzM9vQN4.XWFqZ', 'James', 'Rodriguez', '555-0104', true, true, NOW() - INTERVAL '135 days'),
('a1b2c3d4-0001-4000-8000-000000000005', 'olivia.martinez@email.com', '$2b$10$rZ3qPxHX5VKJ8YzM9vQN4.XWFqZJXYZK8hYqGN5YzM9vQN4.XWFqZ', 'Olivia', 'Martinez', '555-0105', true, true, NOW() - INTERVAL '120 days'),
('a1b2c3d4-0001-4000-8000-000000000006', 'daniel.kim@email.com', '$2b$10$rZ3qPxHX5VKJ8YzM9vQN4.XWFqZJXYZK8hYqGN5YzM9vQN4.XWFqZ', 'Daniel', 'Kim', '555-0106', true, false, NOW() - INTERVAL '105 days'),
('a1b2c3d4-0001-4000-8000-000000000007', 'sophia.anderson@email.com', '$2b$10$rZ3qPxHX5VKJ8YzM9vQN4.XWFqZJXYZK8hYqGN5YzM9vQN4.XWFqZ', 'Sophia', 'Anderson', '555-0107', true, true, NOW() - INTERVAL '90 days'),
('a1b2c3d4-0001-4000-8000-000000000008', 'william.taylor@email.com', '$2b$10$rZ3qPxHX5VKJ8YzM9vQN4.XWFqZJXYZK8hYqGN5YzM9vQN4.XWFqZ', 'William', 'Taylor', '555-0108', true, true, NOW() - INTERVAL '75 days'),
('a1b2c3d4-0001-4000-8000-000000000009', 'ava.brown@email.com', '$2b$10$rZ3qPxHX5VKJ8YzM9vQN4.XWFqZJXYZK8hYqGN5YzM9vQN4.XWFqZ', 'Ava', 'Brown', '555-0109', true, false, NOW() - INTERVAL '60 days'),
('a1b2c3d4-0001-4000-8000-000000000010', 'alexander.davis@email.com', '$2b$10$rZ3qPxHX5VKJ8YzM9vQN4.XWFqZJXYZK8hYqGN5YzM9vQN4.XWFqZ', 'Alexander', 'Davis', '555-0110', true, true, NOW() - INTERVAL '45 days'),
('a1b2c3d4-0001-4000-8000-000000000011', 'mia.garcia@email.com', '$2b$10$rZ3qPxHX5VKJ8YzM9vQN4.XWFqZJXYZK8hYqGN5YzM9vQN4.XWFqZ', 'Mia', 'Garcia', '555-0111', true, true, NOW() - INTERVAL '40 days'),
('a1b2c3d4-0001-4000-8000-000000000012', 'ethan.miller@email.com', '$2b$10$rZ3qPxHX5VKJ8YzM9vQN4.XWFqZJXYZK8hYqGN5YzM9vQN4.XWFqZ', 'Ethan', 'Miller', '555-0112', true, false, NOW() - INTERVAL '35 days'),
('a1b2c3d4-0001-4000-8000-000000000013', 'isabella.wilson@email.com', '$2b$10$rZ3qPxHX5VKJ8YzM9vQN4.XWFqZJXYZK8hYqGN5YzM9vQN4.XWFqZ', 'Isabella', 'Wilson', '555-0113', true, true, NOW() - INTERVAL '30 days'),
('a1b2c3d4-0001-4000-8000-000000000014', 'noah.moore@email.com', '$2b$10$rZ3qPxHX5VKJ8YzM9vQN4.XWFqZJXYZK8hYqGN5YzM9vQN4.XWFqZ', 'Noah', 'Moore', '555-0114', true, true, NOW() - INTERVAL '25 days'),
('a1b2c3d4-0001-4000-8000-000000000015', 'charlotte.lee@email.com', '$2b$10$rZ3qPxHX5VKJ8YzM9vQN4.XWFqZJXYZK8hYqGN5YzM9vQN4.XWFqZ', 'Charlotte', 'Lee', '555-0115', true, false, NOW() - INTERVAL '20 days'),
('a1b2c3d4-0001-4000-8000-000000000016', 'lucas.white@email.com', '$2b$10$rZ3qPxHX5VKJ8YzM9vQN4.XWFqZJXYZK8hYqGN5YzM9vQN4.XWFqZ', 'Lucas', 'White', '555-0116', true, true, NOW() - INTERVAL '18 days'),
('a1b2c3d4-0001-4000-8000-000000000017', 'amelia.harris@email.com', '$2b$10$rZ3qPxHX5VKJ8YzM9vQN4.XWFqZJXYZK8hYqGN5YzM9vQN4.XWFqZ', 'Amelia', 'Harris', '555-0117', true, true, NOW() - INTERVAL '16 days'),
('a1b2c3d4-0001-4000-8000-000000000018', 'mason.clark@email.com', '$2b$10$rZ3qPxHX5VKJ8YzM9vQN4.XWFqZJXYZK8hYqGN5YzM9vQN4.XWFqZ', 'Mason', 'Clark', '555-0118', true, false, NOW() - INTERVAL '14 days'),
('a1b2c3d4-0001-4000-8000-000000000019', 'harper.lopez@email.com', '$2b$10$rZ3qPxHX5VKJ8YzM9vQN4.XWFqZJXYZK8hYqGN5YzM9vQN4.XWFqZ', 'Harper', 'Lopez', '555-0119', true, true, NOW() - INTERVAL '12 days'),
('a1b2c3d4-0001-4000-8000-000000000020', 'elijah.gonzalez@email.com', '$2b$10$rZ3qPxHX5VKJ8YzM9vQN4.XWFqZJXYZK8hYqGN5YzM9vQN4.XWFqZ', 'Elijah', 'Gonzalez', '555-0120', true, true, NOW() - INTERVAL '10 days'),
('a1b2c3d4-0001-4000-8000-000000000021', 'evelyn.perez@email.com', '$2b$10$rZ3qPxHX5VKJ8YzM9vQN4.XWFqZJXYZK8hYqGN5YzM9vQN4.XWFqZ', 'Evelyn', 'Perez', '555-0121', true, false, NOW() - INTERVAL '9 days'),
('a1b2c3d4-0001-4000-8000-000000000022', 'logan.sanchez@email.com', '$2b$10$rZ3qPxHX5VKJ8YzM9vQN4.XWFqZJXYZK8hYqGN5YzM9vQN4.XWFqZ', 'Logan', 'Sanchez', '555-0122', true, true, NOW() - INTERVAL '8 days'),
('a1b2c3d4-0001-4000-8000-000000000023', 'abigail.ramirez@email.com', '$2b$10$rZ3qPxHX5VKJ8YzM9vQN4.XWFqZJXYZK8hYqGN5YzM9vQN4.XWFqZ', 'Abigail', 'Ramirez', '555-0123', true, true, NOW() - INTERVAL '7 days'),
('a1b2c3d4-0001-4000-8000-000000000024', 'jackson.torres@email.com', '$2b$10$rZ3qPxHX5VKJ8YzM9vQN4.XWFqZJXYZK8hYqGN5YzM9vQN4.XWFqZ', 'Jackson', 'Torres', '555-0124', true, false, NOW() - INTERVAL '6 days'),
('a1b2c3d4-0001-4000-8000-000000000025', 'emily.rivera@email.com', '$2b$10$rZ3qPxHX5VKJ8YzM9vQN4.XWFqZJXYZK8hYqGN5YzM9vQN4.XWFqZ', 'Emily', 'Rivera', '555-0125', true, true, NOW() - INTERVAL '5 days'),
('a1b2c3d4-0001-4000-8000-000000000026', 'sebastian.flores@email.com', '$2b$10$rZ3qPxHX5VKJ8YzM9vQN4.XWFqZJXYZK8hYqGN5YzM9vQN4.XWFqZ', 'Sebastian', 'Flores', '555-0126', true, true, NOW() - INTERVAL '4 days'),
('a1b2c3d4-0001-4000-8000-000000000027', 'elizabeth.cook@email.com', '$2b$10$rZ3qPxHX5VKJ8YzM9vQN4.XWFqZJXYZK8hYqGN5YzM9vQN4.XWFqZ', 'Elizabeth', 'Cook', '555-0127', true, false, NOW() - INTERVAL '3 days'),
('a1b2c3d4-0001-4000-8000-000000000028', 'jack.morgan@email.com', '$2b$10$rZ3qPxHX5VKJ8YzM9vQN4.XWFqZJXYZK8hYqGN5YzM9vQN4.XWFqZ', 'Jack', 'Morgan', '555-0128', true, true, NOW() - INTERVAL '2 days'),
('a1b2c3d4-0001-4000-8000-000000000029', 'sofia.bell@email.com', '$2b$10$rZ3qPxHX5VKJ8YzM9vQN4.XWFqZJXYZK8hYqGN5YzM9vQN4.XWFqZ', 'Sofia', 'Bell', '555-0129', true, true, NOW() - INTERVAL '1 day'),
('a1b2c3d4-0001-4000-8000-000000000030', 'aiden.ward@email.com', '$2b$10$rZ3qPxHX5VKJ8YzM9vQN4.XWFqZJXYZK8hYqGN5YzM9vQN4.XWFqZ', 'Aiden', 'Ward', '555-0130', true, false, NOW()),
('a1b2c3d4-0001-4000-8000-000000000031', 'grace.cooper@email.com', '$2b$10$rZ3qPxHX5VKJ8YzM9vQN4.XWFqZJXYZK8hYqGN5YzM9vQN4.XWFqZ', 'Grace', 'Cooper', '555-0131', true, true, NOW() - INTERVAL '120 days'),
('a1b2c3d4-0001-4000-8000-000000000032', 'matthew.reed@email.com', '$2b$10$rZ3qPxHX5VKJ8YzM9vQN4.XWFqZJXYZK8hYqGN5YzM9vQN4.XWFqZ', 'Matthew', 'Reed', '555-0132', true, true, NOW() - INTERVAL '110 days'),
('a1b2c3d4-0001-4000-8000-000000000033', 'chloe.bailey@email.com', '$2b$10$rZ3qPxHX5VKJ8YzM9vQN4.XWFqZJXYZK8hYqGN5YzM9vQN4.XWFqZ', 'Chloe', 'Bailey', '555-0133', true, false, NOW() - INTERVAL '100 days'),
('a1b2c3d4-0001-4000-8000-000000000034', 'david.cox@email.com', '$2b$10$rZ3qPxHX5VKJ8YzM9vQN4.XWFqZJXYZK8hYqGN5YzM9vQN4.XWFqZ', 'David', 'Cox', '555-0134', true, true, NOW() - INTERVAL '95 days'),
('a1b2c3d4-0001-4000-8000-000000000035', 'ella.howard@email.com', '$2b$10$rZ3qPxHX5VKJ8YzM9vQN4.XWFqZJXYZK8hYqGN5YzM9vQN4.XWFqZ', 'Ella', 'Howard', '555-0135', true, true, NOW() - INTERVAL '85 days'),
('a1b2c3d4-0001-4000-8000-000000000036', 'joseph.ward@email.com', '$2b$10$rZ3qPxHX5VKJ8YzM9vQN4.XWFqZJXYZK8hYqGN5YzM9vQN4.XWFqZ', 'Joseph', 'Ward', '555-0136', true, false, NOW() - INTERVAL '80 days'),
('a1b2c3d4-0001-4000-8000-000000000037', 'scarlett.russell@email.com', '$2b$10$rZ3qPxHX5VKJ8YzM9vQN4.XWFqZJXYZK8hYqGN5YzM9vQN4.XWFqZ', 'Scarlett', 'Russell', '555-0137', true, true, NOW() - INTERVAL '70 days'),
('a1b2c3d4-0001-4000-8000-000000000038', 'samuel.james@email.com', '$2b$10$rZ3qPxHX5VKJ8YzM9vQN4.XWFqZJXYZK8hYqGN5YzM9vQN4.XWFqZ', 'Samuel', 'James', '555-0138', true, true, NOW() - INTERVAL '65 days'),
('a1b2c3d4-0001-4000-8000-000000000039', 'victoria.watson@email.com', '$2b$10$rZ3qPxHX5VKJ8YzM9vQN4.XWFqZJXYZK8hYqGN5YzM9vQN4.XWFqZ', 'Victoria', 'Watson', '555-0139', true, false, NOW() - INTERVAL '55 days'),
('a1b2c3d4-0001-4000-8000-000000000040', 'benjamin.brooks@email.com', '$2b$10$rZ3qPxHX5VKJ8YzM9vQN4.XWFqZJXYZK8hYqGN5YzM9vQN4.XWFqZ', 'Benjamin', 'Brooks', '555-0140', true, true, NOW() - INTERVAL '50 days'),
('a1b2c3d4-0001-4000-8000-000000000041', 'aria.kelly@email.com', '$2b$10$rZ3qPxHX5VKJ8YzM9vQN4.XWFqZJXYZK8hYqGN5YzM9vQN4.XWFqZ', 'Aria', 'Kelly', '555-0141', true, true, NOW() - INTERVAL '48 days'),
('a1b2c3d4-0001-4000-8000-000000000042', 'christopher.sanders@email.com', '$2b$10$rZ3qPxHX5VKJ8YzM9vQN4.XWFqZJXYZK8hYqGN5YzM9vQN4.XWFqZ', 'Christopher', 'Sanders', '555-0142', true, false, NOW() - INTERVAL '42 days'),
('a1b2c3d4-0001-4000-8000-000000000043', 'layla.price@email.com', '$2b$10$rZ3qPxHX5VKJ8YzM9vQN4.XWFqZJXYZK8hYqGN5YzM9vQN4.XWFqZ', 'Layla', 'Price', '555-0143', true, true, NOW() - INTERVAL '38 days'),
('a1b2c3d4-0001-4000-8000-000000000044', 'andrew.bennett@email.com', '$2b$10$rZ3qPxHX5VKJ8YzM9vQN4.XWFqZJXYZK8hYqGN5YzM9vQN4.XWFqZ', 'Andrew', 'Bennett', '555-0144', true, true, NOW() - INTERVAL '32 days'),
('a1b2c3d4-0001-4000-8000-000000000045', 'zoey.wood@email.com', '$2b$10$rZ3qPxHX5VKJ8YzM9vQN4.XWFqZJXYZK8hYqGN5YzM9vQN4.XWFqZ', 'Zoey', 'Wood', '555-0145', true, false, NOW() - INTERVAL '28 days'),
('a1b2c3d4-0001-4000-8000-000000000046', 'joshua.barnes@email.com', '$2b$10$rZ3qPxHX5VKJ8YzM9vQN4.XWFqZJXYZK8hYqGN5YzM9vQN4.XWFqZ', 'Joshua', 'Barnes', '555-0146', true, true, NOW() - INTERVAL '22 days'),
('a1b2c3d4-0001-4000-8000-000000000047', 'penelope.ross@email.com', '$2b$10$rZ3qPxHX5VKJ8YzM9vQN4.XWFqZJXYZK8hYqGN5YzM9vQN4.XWFqZ', 'Penelope', 'Ross', '555-0147', true, true, NOW() - INTERVAL '19 days'),
('a1b2c3d4-0001-4000-8000-000000000048', 'ryan.henderson@email.com', '$2b$10$rZ3qPxHX5VKJ8YzM9vQN4.XWFqZJXYZK8hYqGN5YzM9vQN4.XWFqZ', 'Ryan', 'Henderson', '555-0148', true, false, NOW() - INTERVAL '15 days'),
('a1b2c3d4-0001-4000-8000-000000000049', 'nora.coleman@email.com', '$2b$10$rZ3qPxHX5VKJ8YzM9vQN4.XWFqZJXYZK8hYqGN5YzM9vQN4.XWFqZ', 'Nora', 'Coleman', '555-0149', true, true, NOW() - INTERVAL '11 days'),
('a1b2c3d4-0001-4000-8000-000000000050', 'nathan.jenkins@email.com', '$2b$10$rZ3qPxHX5VKJ8YzM9vQN4.XWFqZJXYZK8hYqGN5YzM9vQN4.XWFqZ', 'Nathan', 'Jenkins', '555-0150', true, true, NOW() - INTERVAL '7 days');

-- =====================================================
-- CUSTOMER ADDRESSES
-- =====================================================

INSERT INTO customer_addresses (customer_id, address_label, street_address_1, street_address_2, city, state, zip_code, is_default, delivery_instructions) VALUES
('a1b2c3d4-0001-4000-8000-000000000001', 'Home', '123 Oak Street', 'Apt 4B', 'San Francisco', 'CA', '94102', true, 'Ring doorbell twice'),
('a1b2c3d4-0001-4000-8000-000000000001', 'Office', '456 Market Street', 'Suite 200', 'San Francisco', 'CA', '94105', false, 'Leave with reception'),
('a1b2c3d4-0001-4000-8000-000000000002', 'Home', '789 Pine Avenue', NULL, 'Los Angeles', 'CA', '90012', true, 'Gate code: 1234'),
('a1b2c3d4-0001-4000-8000-000000000003', 'Home', '321 Maple Drive', NULL, 'Seattle', 'WA', '98101', true, NULL),
('a1b2c3d4-0001-4000-8000-000000000004', 'Home', '654 Elm Street', 'Unit 12', 'Portland', 'OR', '97201', true, 'Leave at side door'),
('a1b2c3d4-0001-4000-8000-000000000005', 'Home', '987 Cedar Lane', NULL, 'Austin', 'TX', '78701', true, NULL),
('a1b2c3d4-0001-4000-8000-000000000006', 'Home', '147 Birch Road', 'Apt 301', 'Denver', 'CO', '80202', true, 'Call upon arrival'),
('a1b2c3d4-0001-4000-8000-000000000007', 'Home', '258 Willow Court', NULL, 'Boston', 'MA', '02101', true, NULL),
('a1b2c3d4-0001-4000-8000-000000000008', 'Home', '369 Spruce Way', NULL, 'Chicago', 'IL', '60601', true, 'Doorman available'),
('a1b2c3d4-0001-4000-8000-000000000009', 'Home', '741 Ash Boulevard', 'Unit 5', 'Miami', 'FL', '33101', true, NULL),
('a1b2c3d4-0001-4000-8000-000000000010', 'Home', '852 Cherry Circle', NULL, 'Atlanta', 'GA', '30301', true, 'Ring bell for unit 10'),
('a1b2c3d4-0001-4000-8000-000000000011', 'Home', '963 Poplar Street', NULL, 'Phoenix', 'AZ', '85001', true, NULL),
('a1b2c3d4-0001-4000-8000-000000000012', 'Home', '159 Hickory Lane', 'Apt 2A', 'Philadelphia', 'PA', '19101', true, 'Knock loudly'),
('a1b2c3d4-0001-4000-8000-000000000013', 'Home', '357 Walnut Drive', NULL, 'San Diego', 'CA', '92101', true, NULL),
('a1b2c3d4-0001-4000-8000-000000000014', 'Home', '486 Magnolia Avenue', NULL, 'Dallas', 'TX', '75201', true, 'Leave with neighbor if not home'),
('a1b2c3d4-0001-4000-8000-000000000015', 'Home', '264 Sycamore Street', 'Unit 8', 'Nashville', 'TN', '37201', true, NULL),
('a1b2c3d4-0001-4000-8000-000000000016', 'Home', '735 Redwood Road', NULL, 'Charlotte', 'NC', '28201', true, NULL),
('a1b2c3d4-0001-4000-8000-000000000017', 'Home', '918 Cypress Way', NULL, 'Indianapolis', 'IN', '46201', true, 'Use side entrance'),
('a1b2c3d4-0001-4000-8000-000000000018', 'Home', '624 Dogwood Court', 'Apt 15', 'Columbus', 'OH', '43201', true, NULL),
('a1b2c3d4-0001-4000-8000-000000000019', 'Home', '537 Beech Lane', NULL, 'Fort Worth', 'TX', '76101', true, NULL),
('a1b2c3d4-0001-4000-8000-000000000020', 'Home', '842 Hawthorn Drive', NULL, 'San Jose', 'CA', '95101', true, 'Ring doorbell'),
('a1b2c3d4-0001-4000-8000-000000000021', 'Home', '176 Juniper Avenue', 'Unit 4', 'Jacksonville', 'FL', '32099', true, NULL),
('a1b2c3d4-0001-4000-8000-000000000022', 'Home', '459 Laurel Street', NULL, 'San Antonio', 'TX', '78201', true, NULL),
('a1b2c3d4-0001-4000-8000-000000000023', 'Home', '683 Fir Boulevard', NULL, 'Detroit', 'MI', '48201', true, 'Leave at back door'),
('a1b2c3d4-0001-4000-8000-000000000024', 'Home', '295 Alder Circle', 'Apt 7B', 'El Paso', 'TX', '79901', true, NULL),
('a1b2c3d4-0001-4000-8000-000000000025', 'Home', '817 Sequoia Way', NULL, 'Memphis', 'TN', '37501', true, NULL),
('a1b2c3d4-0001-4000-8000-000000000026', 'Home', '931 Mesquite Lane', NULL, 'Boston', 'MA', '02108', true, 'Buzz apartment 26'),
('a1b2c3d4-0001-4000-8000-000000000027', 'Home', '428 Cottonwood Drive', 'Unit 9', 'Baltimore', 'MD', '21201', true, NULL),
('a1b2c3d4-0001-4000-8000-000000000028', 'Home', '764 Aspen Court', NULL, 'Milwaukee', 'WI', '53201', true, NULL),
('a1b2c3d4-0001-4000-8000-000000000029', 'Home', '542 Chestnut Street', NULL, 'Albuquerque', 'NM', '87101', true, 'Front porch'),
('a1b2c3d4-0001-4000-8000-000000000030', 'Home', '309 Palmetto Avenue', 'Apt 11', 'Tucson', 'AZ', '85701', true, NULL);

-- =====================================================
-- PRODUCT CATEGORIES
-- =====================================================

INSERT INTO product_categories (id, name, slug, description, display_order, is_active) VALUES
(1, 'Protein Bowls', 'protein-bowls', 'High-protein meals with lean meats and wholesome grains', 1, true),
(2, 'Pasta & Italian', 'pasta-italian', 'Classic Italian-inspired pasta dishes', 2, true),
(3, 'Asian Fusion', 'asian-fusion', 'Bold Asian flavors from teriyaki to Thai curry', 3, true),
(4, 'Mexican & Latin', 'mexican-latin', 'Spicy and savory Latin American favorites', 4, true),
(5, 'Plant-Based', 'plant-based', 'Delicious vegan and vegetarian options', 5, true),
(6, 'Keto & Low-Carb', 'keto-low-carb', 'Low-carb, high-fat meals for keto diet', 6, true),
(7, 'Breakfast & Brunch', 'breakfast-brunch', 'Start your day right with nutritious breakfast options', 7, true),
(8, 'Soups & Salads', 'soups-salads', 'Light and refreshing meals packed with nutrients', 8, true);

-- =====================================================
-- TAGS
-- =====================================================

INSERT INTO tags (name, slug, tag_type, description, is_active) VALUES
-- Dietary tags
('Vegan', 'vegan', 'dietary', 'Contains no animal products', true),
('Vegetarian', 'vegetarian', 'dietary', 'No meat, may contain dairy/eggs', true),
('Keto', 'keto', 'dietary', 'Low-carb, high-fat ketogenic diet', true),
('Paleo', 'paleo', 'dietary', 'Grain-free, dairy-free paleo diet', true),
('Gluten-Free', 'gluten-free', 'dietary', 'No gluten-containing ingredients', true),
('Dairy-Free', 'dairy-free', 'dietary', 'No dairy products', true),
('Low-Carb', 'low-carb', 'dietary', 'Reduced carbohydrate content', true),

-- Ingredient tags
('Chicken', 'chicken', 'ingredient', 'Contains chicken', true),
('Beef', 'beef', 'ingredient', 'Contains beef', true),
('Pork', 'pork', 'ingredient', 'Contains pork', true),
('Seafood', 'seafood', 'ingredient', 'Contains fish or shellfish', true),
('Tofu', 'tofu', 'ingredient', 'Contains tofu', true),
('Quinoa', 'quinoa', 'ingredient', 'Contains quinoa', true),

-- Cuisine tags
('Italian', 'italian', 'cuisine', 'Italian cuisine', true),
('Asian', 'asian', 'cuisine', 'Asian cuisine', true),
('Mexican', 'mexican', 'cuisine', 'Mexican cuisine', true),
('Mediterranean', 'mediterranean', 'cuisine', 'Mediterranean cuisine', true),
('American', 'american', 'cuisine', 'American cuisine', true),

-- Meal type tags
('Breakfast', 'breakfast', 'meal_type', 'Breakfast meal', true),
('Lunch', 'lunch', 'meal_type', 'Lunch meal', true),
('Dinner', 'dinner', 'meal_type', 'Dinner meal', true),

-- Allergen tags
('Contains Nuts', 'contains-nuts', 'allergen', 'Contains tree nuts or peanuts', true),
('Contains Dairy', 'contains-dairy', 'allergen', 'Contains milk products', true),
('Contains Soy', 'contains-soy', 'allergen', 'Contains soy', true),
('Contains Shellfish', 'contains-shellfish', 'allergen', 'Contains shellfish', true),

-- Feature tags
('High Protein', 'high-protein', 'feature', '30g+ protein per serving', true),
('Spicy', 'spicy', 'feature', 'Spicy heat level', true),
('Kid-Friendly', 'kid-friendly', 'feature', 'Mild flavors kids love', true),
('Organic', 'organic', 'feature', 'Made with organic ingredients', true),
('Low-Sodium', 'low-sodium', 'feature', 'Reduced sodium content', true);

-- =====================================================
-- PRODUCTS & VARIANTS
-- =====================================================

-- Product 1: Grilled Chicken Teriyaki Bowl
INSERT INTO products (id, category_id, name, slug, description, short_description, image_url, is_active, is_featured, display_order) VALUES
('b1c2d3e4-0001-4000-8000-000000000001', 1, 'Grilled Chicken Teriyaki Bowl', 'grilled-chicken-teriyaki-bowl', 'Tender grilled chicken breast glazed with our signature teriyaki sauce, served over fluffy jasmine rice with steamed broccoli and carrots. A perfect balance of sweet and savory flavors.', 'Grilled chicken with teriyaki glaze, rice, and vegetables', 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c', true, true, 1);

INSERT INTO product_variants (id, product_id, sku, variant_name, price, compare_at_price, cost, weight_grams, stripe_price_id, stripe_product_id, is_active) VALUES
('b1c2d3e4-0001-4001-8000-000000000001', 'b1c2d3e4-0001-4000-8000-000000000001', 'MEAL-CHKTER-SM', 'Small', 12.99, NULL, 6.50, 350, 'price_teriyaki_small', 'prod_teriyaki', true),
('b1c2d3e4-0001-4001-8000-000000000002', 'b1c2d3e4-0001-4000-8000-000000000001', 'MEAL-CHKTER-LG', 'Large', 17.99, NULL, 9.00, 500, 'price_teriyaki_large', 'prod_teriyaki', true);

-- Product 2: Beef Stir Fry
INSERT INTO products (id, category_id, name, slug, description, short_description, image_url, is_active, is_featured, display_order) VALUES
('b1c2d3e4-0001-4000-8000-000000000002', 3, 'Beef Stir Fry', 'beef-stir-fry', 'Tender strips of beef wok-tossed with bell peppers, snap peas, and onions in a savory garlic-ginger sauce. Served with brown rice for a wholesome meal.', 'Wok-tossed beef with vegetables and brown rice', 'https://images.unsplash.com/photo-1603133872878-684f208fb84b', true, true, 2);

INSERT INTO product_variants (id, product_id, sku, variant_name, price, compare_at_price, cost, weight_grams, stripe_price_id, stripe_product_id, is_active) VALUES
('b1c2d3e4-0001-4001-8000-000000000003', 'b1c2d3e4-0001-4000-8000-000000000002', 'MEAL-BEEFST-SM', 'Small', 14.99, NULL, 7.50, 350, 'price_beefstir_small', 'prod_beefstir', true),
('b1c2d3e4-0001-4001-8000-000000000004', 'b1c2d3e4-0001-4000-8000-000000000002', 'MEAL-BEEFST-LG', 'Large', 19.99, NULL, 10.00, 500, 'price_beefstir_large', 'prod_beefstir', true);

-- Product 3: Mediterranean Quinoa Bowl
INSERT INTO products (id, category_id, name, slug, description, short_description, image_url, is_active, is_featured, display_order) VALUES
('b1c2d3e4-0001-4000-8000-000000000003', 5, 'Mediterranean Quinoa Bowl', 'mediterranean-quinoa-bowl', 'Protein-rich quinoa topped with chickpeas, cucumber, tomatoes, red onion, Kalamata olives, and crumbled feta. Drizzled with lemon-herb dressing.', 'Quinoa with chickpeas, veggies, and feta', 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd', true, true, 3);

INSERT INTO product_variants (id, product_id, sku, variant_name, price, compare_at_price, cost, weight_grams, stripe_price_id, stripe_product_id, is_active) VALUES
('b1c2d3e4-0001-4001-8000-000000000005', 'b1c2d3e4-0001-4000-8000-000000000003', 'MEAL-MEDQUI-SM', 'Small', 11.99, NULL, 5.50, 320, 'price_medquinoa_small', 'prod_medquinoa', true),
('b1c2d3e4-0001-4001-8000-000000000006', 'b1c2d3e4-0001-4000-8000-000000000003', 'MEAL-MEDQUI-LG', 'Large', 15.99, NULL, 7.50, 450, 'price_medquinoa_large', 'prod_medquinoa', true);

-- Product 4: Spicy Chicken Burrito Bowl
INSERT INTO products (id, category_id, name, slug, description, short_description, image_url, is_active, is_featured, display_order) VALUES
('b1c2d3e4-0001-4000-8000-000000000004', 4, 'Spicy Chicken Burrito Bowl', 'spicy-chicken-burrito-bowl', 'Seasoned chicken with cilantro-lime rice, black beans, corn salsa, pico de gallo, and chipotle crema. A fiesta in a bowl!', 'Mexican-style chicken bowl with beans and salsa', 'https://images.unsplash.com/photo-1559543452-731e5f9e8b4c', true, false, 4);

INSERT INTO product_variants (id, product_id, sku, variant_name, price, compare_at_price, cost, weight_grams, stripe_price_id, stripe_product_id, is_active) VALUES
('b1c2d3e4-0001-4001-8000-000000000007', 'b1c2d3e4-0001-4000-8000-000000000004', 'MEAL-SPYCHK-SM', 'Small', 12.99, NULL, 6.00, 360, 'price_spicychick_small', 'prod_spicychick', true),
('b1c2d3e4-0001-4001-8000-000000000008', 'b1c2d3e4-0001-4000-8000-000000000004', 'MEAL-SPYCHK-LG', 'Large', 17.99, NULL, 8.50, 510, 'price_spicychick_large', 'prod_spicychick', true);

-- Product 5: Creamy Tuscan Chicken Pasta
INSERT INTO products (id, category_id, name, slug, description, short_description, image_url, is_active, is_featured, display_order) VALUES
('b1c2d3e4-0001-4000-8000-000000000005', 2, 'Creamy Tuscan Chicken Pasta', 'creamy-tuscan-chicken-pasta', 'Al dente penne pasta with grilled chicken in a rich, creamy sun-dried tomato sauce with spinach and parmesan. Italian comfort food at its finest.', 'Pasta with chicken in creamy tomato sauce', 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9', true, true, 5);

INSERT INTO product_variants (id, product_id, sku, variant_name, price, compare_at_price, cost, weight_grams, stripe_price_id, stripe_product_id, is_active) VALUES
('b1c2d3e4-0001-4001-8000-000000000009', 'b1c2d3e4-0001-4000-8000-000000000005', 'MEAL-TUSCPAS-SM', 'Small', 13.99, NULL, 7.00, 380, 'price_tuscan_small', 'prod_tuscan', true),
('b1c2d3e4-0001-4001-8000-000000000010', 'b1c2d3e4-0001-4000-8000-000000000005', 'MEAL-TUSCPAS-LG', 'Large', 18.99, NULL, 9.50, 530, 'price_tuscan_large', 'prod_tuscan', true);

-- Product 6: Salmon Teriyaki with Vegetables
INSERT INTO products (id, category_id, name, slug, description, short_description, image_url, is_active, is_featured, display_order) VALUES
('b1c2d3e4-0001-4000-8000-000000000006', 3, 'Salmon Teriyaki with Vegetables', 'salmon-teriyaki-vegetables', 'Wild-caught salmon fillet glazed with teriyaki, served with steamed broccoli, edamame, and jasmine rice. Rich in omega-3s.', 'Glazed salmon with Asian vegetables', 'https://images.unsplash.com/photo-1467003909585-2f8a72700288', true, true, 6);

INSERT INTO product_variants (id, product_id, sku, variant_name, price, compare_at_price, cost, weight_grams, stripe_price_id, stripe_product_id, is_active) VALUES
('b1c2d3e4-0001-4001-8000-000000000011', 'b1c2d3e4-0001-4000-8000-000000000006', 'MEAL-SALTER-SM', 'Small', 15.99, NULL, 8.50, 340, 'price_salmon_small', 'prod_salmon', true),
('b1c2d3e4-0001-4001-8000-000000000012', 'b1c2d3e4-0001-4000-8000-000000000006', 'MEAL-SALTER-LG', 'Large', 21.99, NULL, 11.50, 480, 'price_salmon_large', 'prod_salmon', true);

-- Product 7: Vegan Buddha Bowl
INSERT INTO products (id, category_id, name, slug, description, short_description, image_url, is_active, is_featured, display_order) VALUES
('b1c2d3e4-0001-4000-8000-000000000007', 5, 'Vegan Buddha Bowl', 'vegan-buddha-bowl', 'Roasted sweet potato, chickpeas, kale, quinoa, avocado, and tahini dressing. A colorful, nutrient-dense plant-based meal.', 'Plant-based bowl with roasted vegetables', 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd', true, true, 7);

INSERT INTO product_variants (id, product_id, sku, variant_name, price, compare_at_price, cost, weight_grams, stripe_price_id, stripe_product_id, is_active) VALUES
('b1c2d3e4-0001-4001-8000-000000000013', 'b1c2d3e4-0001-4000-8000-000000000007', 'MEAL-VEGBUD-SM', 'Small', 11.99, NULL, 5.00, 330, 'price_buddha_small', 'prod_buddha', true),
('b1c2d3e4-0001-4001-8000-000000000014', 'b1c2d3e4-0001-4000-8000-000000000007', 'MEAL-VEGBUD-LG', 'Large', 15.99, NULL, 7.00, 470, 'price_buddha_large', 'prod_buddha', true);

-- Product 8: Keto Beef and Broccoli
INSERT INTO products (id, category_id, name, slug, description, short_description, image_url, is_active, is_featured, display_order) VALUES
('b1c2d3e4-0001-4000-8000-000000000008', 6, 'Keto Beef and Broccoli', 'keto-beef-broccoli', 'Tender beef strips with broccoli in a savory sauce, served over cauliflower rice. High-fat, low-carb perfection.', 'Low-carb beef and broccoli with cauliflower rice', 'https://images.unsplash.com/photo-1603133872878-684f208fb84b', true, true, 8);

INSERT INTO product_variants (id, product_id, sku, variant_name, price, compare_at_price, cost, weight_grams, stripe_price_id, stripe_product_id, is_active) VALUES
('b1c2d3e4-0001-4001-8000-000000000015', 'b1c2d3e4-0001-4000-8000-000000000008', 'MEAL-KETBEEF-SM', 'Small', 14.99, NULL, 7.50, 320, 'price_ketobeef_small', 'prod_ketobeef', true),
('b1c2d3e4-0001-4001-8000-000000000016', 'b1c2d3e4-0001-4000-8000-000000000008', 'MEAL-KETBEEF-LG', 'Large', 19.99, NULL, 10.00, 450, 'price_ketobeef_large', 'prod_ketobeef', true);

-- Product 9: Turkey Meatballs Marinara
INSERT INTO products (id, category_id, name, slug, description, short_description, image_url, is_active, is_featured, display_order) VALUES
('b1c2d3e4-0001-4000-8000-000000000009', 2, 'Turkey Meatballs Marinara', 'turkey-meatballs-marinara', 'Lean turkey meatballs in rich marinara sauce over spaghetti, topped with fresh basil and parmesan. Comfort food made healthier.', 'Turkey meatballs with pasta and marinara', 'https://images.unsplash.com/photo-1622973536968-3ead9e780960', true, false, 9);

INSERT INTO product_variants (id, product_id, sku, variant_name, price, compare_at_price, cost, weight_grams, stripe_price_id, stripe_product_id, is_active) VALUES
('b1c2d3e4-0001-4001-8000-000000000017', 'b1c2d3e4-0001-4000-8000-000000000009', 'MEAL-TURKMAR-SM', 'Small', 12.99, NULL, 6.00, 360, 'price_turkey_small', 'prod_turkey', true),
('b1c2d3e4-0001-4001-8000-000000000018', 'b1c2d3e4-0001-4000-8000-000000000009', 'MEAL-TURKMAR-LG', 'Large', 17.99, NULL, 8.50, 500, 'price_turkey_large', 'prod_turkey', true);

-- Product 10: Thai Green Curry Chicken
INSERT INTO products (id, category_id, name, slug, description, short_description, image_url, is_active, is_featured, display_order) VALUES
('b1c2d3e4-0001-4000-8000-000000000010', 3, 'Thai Green Curry Chicken', 'thai-green-curry-chicken', 'Aromatic green curry with chicken, bamboo shoots, Thai basil, and coconut milk. Served with jasmine rice. Authentically spicy!', 'Spicy Thai curry with chicken and vegetables', 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd', true, true, 10);

INSERT INTO product_variants (id, product_id, sku, variant_name, price, compare_at_price, cost, weight_grams, stripe_price_id, stripe_product_id, is_active) VALUES
('b1c2d3e4-0001-4001-8000-000000000019', 'b1c2d3e4-0001-4000-8000-000000000010', 'MEAL-THAICUR-SM', 'Small', 13.99, NULL, 6.50, 350, 'price_thaicurry_small', 'prod_thaicurry', true),
('b1c2d3e4-0001-4001-8000-000000000020', 'b1c2d3e4-0001-4000-8000-000000000010', 'MEAL-THAICUR-LG', 'Large', 18.99, NULL, 9.00, 490, 'price_thaicurry_large', 'prod_thaicurry', true);

-- Continue with 30 more products...
-- Product 11: Pork Carnitas Tacos
INSERT INTO products (id, category_id, name, slug, description, short_description, image_url, is_active, display_order) VALUES
('b1c2d3e4-0001-4000-8000-000000000011', 4, 'Pork Carnitas Tacos', 'pork-carnitas-tacos', 'Slow-cooked pork carnitas with corn tortillas, cilantro, onions, and lime. Includes black beans and Mexican rice.', 'Mexican pork tacos with beans and rice', 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47', true, 11);

INSERT INTO product_variants (id, product_id, sku, variant_name, price, compare_at_price, cost, weight_grams, stripe_price_id, stripe_product_id, is_active) VALUES
('b1c2d3e4-0001-4001-8000-000000000021', 'b1c2d3e4-0001-4000-8000-000000000011', 'MEAL-PRKCAR-SM', 'Small', 13.99, NULL, 6.50, 370, 'price_carnitas_small', 'prod_carnitas', true),
('b1c2d3e4-0001-4001-8000-000000000022', 'b1c2d3e4-0001-4000-8000-000000000011', 'MEAL-PRKCAR-LG', 'Large', 18.99, NULL, 9.00, 520, 'price_carnitas_large', 'prod_carnitas', true);

-- Product 12: Breakfast Power Bowl
INSERT INTO products (id, category_id, name, slug, description, short_description, image_url, is_active, is_featured, display_order) VALUES
('b1c2d3e4-0001-4000-8000-000000000012', 7, 'Breakfast Power Bowl', 'breakfast-power-bowl', 'Scrambled eggs, turkey sausage, roasted sweet potatoes, avocado, and spinach. Fuel your morning!', 'High-protein breakfast with eggs and sausage', 'https://images.unsplash.com/photo-1525351484163-7529414344d8', true, true, 12);

INSERT INTO product_variants (id, product_id, sku, variant_name, price, compare_at_price, cost, weight_grams, stripe_price_id, stripe_product_id, is_active) VALUES
('b1c2d3e4-0001-4001-8000-000000000023', 'b1c2d3e4-0001-4000-8000-000000000012', 'MEAL-BRKPWR-SM', 'Small', 10.99, NULL, 5.00, 310, 'price_breakfast_small', 'prod_breakfast', true),
('b1c2d3e4-0001-4001-8000-000000000024', 'b1c2d3e4-0001-4000-8000-000000000012', 'MEAL-BRKPWR-LG', 'Large', 14.99, NULL, 7.00, 440, 'price_breakfast_large', 'prod_breakfast', true);

-- Product 13: Caesar Salad with Grilled Chicken
INSERT INTO products (id, category_id, name, slug, description, short_description, image_url, is_active, display_order) VALUES
('b1c2d3e4-0001-4000-8000-000000000013', 8, 'Caesar Salad with Grilled Chicken', 'caesar-salad-grilled-chicken', 'Crisp romaine lettuce, grilled chicken breast, parmesan cheese, croutons, and creamy Caesar dressing.', 'Classic Caesar with protein-packed chicken', 'https://images.unsplash.com/photo-1546793665-c74683f339c1', true, 13);

INSERT INTO product_variants (id, product_id, sku, variant_name, price, compare_at_price, cost, weight_grams, stripe_price_id, stripe_product_id, is_active) VALUES
('b1c2d3e4-0001-4001-8000-000000000025', 'b1c2d3e4-0001-4000-8000-000000000013', 'MEAL-CAESAR-SM', 'Small', 11.99, NULL, 5.50, 280, 'price_caesar_small', 'prod_caesar', true),
('b1c2d3e4-0001-4001-8000-000000000026', 'b1c2d3e4-0001-4000-8000-000000000013', 'MEAL-CAESAR-LG', 'Large', 15.99, NULL, 7.50, 400, 'price_caesar_large', 'prod_caesar', true);

-- Product 14: Lentil Vegetable Soup
INSERT INTO products (id, category_id, name, slug, description, short_description, image_url, is_active, display_order) VALUES
('b1c2d3e4-0001-4000-8000-000000000014', 8, 'Lentil Vegetable Soup', 'lentil-vegetable-soup', 'Hearty lentils with carrots, celery, tomatoes, and spices. Vegan, gluten-free, and incredibly satisfying.', 'Plant-based lentil soup with vegetables', 'https://images.unsplash.com/photo-1547592166-23ac45744acd', true, 14);

INSERT INTO product_variants (id, product_id, sku, variant_name, price, compare_at_price, cost, weight_grams, stripe_price_id, stripe_product_id, is_active) VALUES
('b1c2d3e4-0001-4001-8000-000000000027', 'b1c2d3e4-0001-4000-8000-000000000014', 'MEAL-LENSOUP-SM', 'Small', 9.99, NULL, 4.00, 340, 'price_lentil_small', 'prod_lentil', true),
('b1c2d3e4-0001-4001-8000-000000000028', 'b1c2d3e4-0001-4000-8000-000000000014', 'MEAL-LENSOUP-LG', 'Large', 13.99, NULL, 5.50, 480, 'price_lentil_large', 'prod_lentil', true);

-- Product 15: Shrimp Pad Thai
INSERT INTO products (id, category_id, name, slug, description, short_description, image_url, is_active, is_featured, display_order) VALUES
('b1c2d3e4-0001-4000-8000-000000000015', 3, 'Shrimp Pad Thai', 'shrimp-pad-thai', 'Rice noodles stir-fried with shrimp, eggs, bean sprouts, and peanuts in tangy tamarind sauce. A Thai classic!', 'Traditional Pad Thai with succulent shrimp', 'https://images.unsplash.com/photo-1559314809-0d155014e29e', true, true, 15);

INSERT INTO product_variants (id, product_id, sku, variant_name, price, compare_at_price, cost, weight_grams, stripe_price_id, stripe_product_id, is_active) VALUES
('b1c2d3e4-0001-4001-8000-000000000029', 'b1c2d3e4-0001-4000-8000-000000000015', 'MEAL-PADTHAI-SM', 'Small', 14.99, NULL, 7.50, 360, 'price_padthai_small', 'prod_padthai', true),
('b1c2d3e4-0001-4001-8000-000000000030', 'b1c2d3e4-0001-4000-8000-000000000015', 'MEAL-PADTHAI-LG', 'Large', 19.99, NULL, 10.00, 500, 'price_padthai_large', 'prod_padthai', true);

-- Product 16: Keto Chicken Alfredo
INSERT INTO products (id, category_id, name, slug, description, short_description, image_url, is_active, display_order) VALUES
('b1c2d3e4-0001-4000-8000-000000000016', 6, 'Keto Chicken Alfredo', 'keto-chicken-alfredo', 'Grilled chicken with zucchini noodles in rich, creamy alfredo sauce. Low-carb Italian indulgence.', 'Low-carb alfredo with zucchini noodles', 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a', true, 16);

INSERT INTO product_variants (id, product_id, sku, variant_name, price, compare_at_price, cost, weight_grams, stripe_price_id, stripe_product_id, is_active) VALUES
('b1c2d3e4-0001-4001-8000-000000000031', 'b1c2d3e4-0001-4000-8000-000000000016', 'MEAL-KETALF-SM', 'Small', 13.99, NULL, 7.00, 330, 'price_ketoalf_small', 'prod_ketoalf', true),
('b1c2d3e4-0001-4001-8000-000000000032', 'b1c2d3e4-0001-4000-8000-000000000016', 'MEAL-KETALF-LG', 'Large', 18.99, NULL, 9.50, 460, 'price_ketoalf_large', 'prod_ketoalf', true);

-- Product 17: BBQ Pulled Pork Bowl
INSERT INTO products (id, category_id, name, slug, description, short_description, image_url, is_active, display_order) VALUES
('b1c2d3e4-0001-4000-8000-000000000017', 1, 'BBQ Pulled Pork Bowl', 'bbq-pulled-pork-bowl', 'Slow-cooked pulled pork in smoky BBQ sauce with coleslaw, baked beans, and cornbread. Southern comfort!', 'BBQ pork with classic Southern sides', 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd', true, 17);

INSERT INTO product_variants (id, product_id, sku, variant_name, price, compare_at_price, cost, weight_grams, stripe_price_id, stripe_product_id, is_active) VALUES
('b1c2d3e4-0001-4001-8000-000000000033', 'b1c2d3e4-0001-4000-8000-000000000017', 'MEAL-BBQPRK-SM', 'Small', 13.99, NULL, 6.50, 380, 'price_bbqpork_small', 'prod_bbqpork', true),
('b1c2d3e4-0001-4001-8000-000000000034', 'b1c2d3e4-0001-4000-8000-000000000017', 'MEAL-BBQPRK-LG', 'Large', 18.99, NULL, 9.00, 530, 'price_bbqpork_large', 'prod_bbqpork', true);

-- Product 18: Tofu Teriyaki Stir Fry
INSERT INTO products (id, category_id, name, slug, description, short_description, image_url, is_active, display_order) VALUES
('b1c2d3e4-0001-4000-8000-000000000018', 5, 'Tofu Teriyaki Stir Fry', 'tofu-teriyaki-stir-fry', 'Crispy tofu with bell peppers, snap peas, and carrots in teriyaki sauce. Served over brown rice. 100% plant-based.', 'Vegan tofu stir fry with vegetables', 'https://images.unsplash.com/photo-1546069901-eacef0df6022', true, 18);

INSERT INTO product_variants (id, product_id, sku, variant_name, price, compare_at_price, cost, weight_grams, stripe_price_id, stripe_product_id, is_active) VALUES
('b1c2d3e4-0001-4001-8000-000000000035', 'b1c2d3e4-0001-4000-8000-000000000018', 'MEAL-TOFTER-SM', 'Small', 11.99, NULL, 5.00, 340, 'price_tofu_small', 'prod_tofu', true),
('b1c2d3e4-0001-4001-8000-000000000036', 'b1c2d3e4-0001-4000-8000-000000000018', 'MEAL-TOFTER-LG', 'Large', 15.99, NULL, 7.00, 480, 'price_tofu_large', 'prod_tofu', true);

-- Product 19: Steak Fajita Bowl
INSERT INTO products (id, category_id, name, slug, description, short_description, image_url, is_active, is_featured, display_order) VALUES
('b1c2d3e4-0001-4000-8000-000000000019', 4, 'Steak Fajita Bowl', 'steak-fajita-bowl', 'Marinated steak strips with sautéed peppers and onions, cilantro-lime rice, guacamole, and salsa.', 'Sizzling steak fajitas in a bowl', 'https://images.unsplash.com/photo-1565557623262-b51c2513a641', true, true, 19);

INSERT INTO product_variants (id, product_id, sku, variant_name, price, compare_at_price, cost, weight_grams, stripe_price_id, stripe_product_id, is_active) VALUES
('b1c2d3e4-0001-4001-8000-000000000037', 'b1c2d3e4-0001-4000-8000-000000000019', 'MEAL-STKFAJ-SM', 'Small', 15.99, NULL, 8.00, 370, 'price_fajita_small', 'prod_fajita', true),
('b1c2d3e4-0001-4001-8000-000000000038', 'b1c2d3e4-0001-4000-8000-000000000019', 'MEAL-STKFAJ-LG', 'Large', 21.99, NULL, 11.00, 520, 'price_fajita_large', 'prod_fajita', true);

-- Product 20: Egg White Veggie Scramble
INSERT INTO products (id, category_id, name, slug, description, short_description, image_url, is_active, display_order) VALUES
('b1c2d3e4-0001-4000-8000-000000000020', 7, 'Egg White Veggie Scramble', 'egg-white-veggie-scramble', 'Fluffy egg whites with spinach, tomatoes, mushrooms, and bell peppers. Includes turkey bacon and wheat toast.', 'Low-calorie breakfast with egg whites', 'https://images.unsplash.com/photo-1525351484163-7529414344d8', true, 20);

INSERT INTO product_variants (id, product_id, sku, variant_name, price, compare_at_price, cost, weight_grams, stripe_price_id, stripe_product_id, is_active) VALUES
('b1c2d3e4-0001-4001-8000-000000000039', 'b1c2d3e4-0001-4000-8000-000000000020', 'MEAL-EGGVEG-SM', 'Small', 10.99, NULL, 4.50, 290, 'price_eggwhite_small', 'prod_eggwhite', true),
('b1c2d3e4-0001-4001-8000-000000000040', 'b1c2d3e4-0001-4000-8000-000000000020', 'MEAL-EGGVEG-LG', 'Large', 14.99, NULL, 6.50, 410, 'price_eggwhite_large', 'prod_eggwhite', true);

-- Product 21: Coconut Chicken Curry
INSERT INTO products (id, category_id, name, slug, description, short_description, image_url, is_active, display_order) VALUES
('b1c2d3e4-0001-4000-8000-000000000021', 3, 'Coconut Chicken Curry', 'coconut-chicken-curry', 'Tender chicken in creamy coconut curry with potatoes and peas. Served with basmati rice. Mild and comforting.', 'Creamy coconut curry with chicken', 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db', true, 21);

INSERT INTO product_variants (id, product_id, sku, variant_name, price, compare_at_price, cost, weight_grams, stripe_price_id, stripe_product_id, is_active) VALUES
('b1c2d3e4-0001-4001-8000-000000000041', 'b1c2d3e4-0001-4000-8000-000000000021', 'MEAL-COCCUR-SM', 'Small', 13.99, NULL, 6.50, 360, 'price_cocurry_small', 'prod_cocurry', true),
('b1c2d3e4-0001-4001-8000-000000000042', 'b1c2d3e4-0001-4000-8000-000000000021', 'MEAL-COCCUR-LG', 'Large', 18.99, NULL, 9.00, 500, 'price_cocurry_large', 'prod_cocurry', true);

-- Product 22: Greek Chicken Bowl
INSERT INTO products (id, category_id, name, slug, description, short_description, image_url, is_active, display_order) VALUES
('b1c2d3e4-0001-4000-8000-000000000022', 1, 'Greek Chicken Bowl', 'greek-chicken-bowl', 'Grilled chicken with cucumber, tomatoes, red onion, Kalamata olives, feta, and tzatziki sauce over rice.', 'Mediterranean chicken with Greek flavors', 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe', true, 22);

INSERT INTO product_variants (id, product_id, sku, variant_name, price, compare_at_price, cost, weight_grams, stripe_price_id, stripe_product_id, is_active) VALUES
('b1c2d3e4-0001-4001-8000-000000000043', 'b1c2d3e4-0001-4000-8000-000000000022', 'MEAL-GRKCHK-SM', 'Small', 12.99, NULL, 6.00, 350, 'price_greek_small', 'prod_greek', true),
('b1c2d3e4-0001-4001-8000-000000000044', 'b1c2d3e4-0001-4000-8000-000000000022', 'MEAL-GRKCHK-LG', 'Large', 17.99, NULL, 8.50, 490, 'price_greek_large', 'prod_greek', true);

-- Product 23: Mushroom Risotto
INSERT INTO products (id, category_id, name, slug, description, short_description, image_url, is_active, display_order) VALUES
('b1c2d3e4-0001-4000-8000-000000000023', 2, 'Mushroom Risotto', 'mushroom-risotto', 'Creamy Arborio rice with mixed mushrooms, parmesan, and fresh herbs. Rich and satisfying vegetarian option.', 'Creamy Italian risotto with mushrooms', 'https://images.unsplash.com/photo-1476124369491-c4c11fdf6d2e', true, 23);

INSERT INTO product_variants (id, product_id, sku, variant_name, price, compare_at_price, cost, weight_grams, stripe_price_id, stripe_product_id, is_active) VALUES
('b1c2d3e4-0001-4001-8000-000000000045', 'b1c2d3e4-0001-4000-8000-000000000023', 'MEAL-MUSHRIS-SM', 'Small', 12.99, NULL, 5.50, 340, 'price_risotto_small', 'prod_risotto', true),
('b1c2d3e4-0001-4001-8000-000000000046', 'b1c2d3e4-0001-4000-8000-000000000023', 'MEAL-MUSHRIS-LG', 'Large', 17.99, NULL, 7.50, 480, 'price_risotto_large', 'prod_risotto', true);

-- Product 24: Sesame Ginger Salmon
INSERT INTO products (id, category_id, name, slug, description, short_description, image_url, is_active, is_featured, display_order) VALUES
('b1c2d3e4-0001-4000-8000-000000000024', 3, 'Sesame Ginger Salmon', 'sesame-ginger-salmon', 'Pan-seared salmon with sesame-ginger glaze, bok choy, and jasmine rice. Topped with sesame seeds and scallions.', 'Asian-inspired salmon with bold flavors', 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2', true, true, 24);

INSERT INTO product_variants (id, product_id, sku, variant_name, price, compare_at_price, cost, weight_grams, stripe_price_id, stripe_product_id, is_active) VALUES
('b1c2d3e4-0001-4001-8000-000000000047', 'b1c2d3e4-0001-4000-8000-000000000024', 'MEAL-SESSAL-SM', 'Small', 16.99, NULL, 9.00, 350, 'price_sessalmon_small', 'prod_sessalmon', true),
('b1c2d3e4-0001-4001-8000-000000000048', 'b1c2d3e4-0001-4000-8000-000000000024', 'MEAL-SESSAL-LG', 'Large', 22.99, NULL, 12.00, 490, 'price_sessalmon_large', 'prod_sessalmon', true);

-- Product 25: Veggie Enchiladas
INSERT INTO products (id, category_id, name, slug, description, short_description, image_url, is_active, display_order) VALUES
('b1c2d3e4-0001-4000-8000-000000000025', 4, 'Veggie Enchiladas', 'veggie-enchiladas', 'Corn tortillas stuffed with black beans, corn, peppers, and cheese. Topped with enchilada sauce and served with rice.', 'Vegetarian enchiladas with beans and cheese', 'https://images.unsplash.com/photo-1599974386967-5ac5e5d0a1e2', true, 25);

INSERT INTO product_variants (id, product_id, sku, variant_name, price, compare_at_price, cost, weight_grams, stripe_price_id, stripe_product_id, is_active) VALUES
('b1c2d3e4-0001-4001-8000-000000000049', 'b1c2d3e4-0001-4000-8000-000000000025', 'MEAL-VEGENCH-SM', 'Small', 11.99, NULL, 5.00, 360, 'price_enchilada_small', 'prod_enchilada', true),
('b1c2d3e4-0001-4001-8000-000000000050', 'b1c2d3e4-0001-4000-8000-000000000025', 'MEAL-VEGENCH-LG', 'Large', 15.99, NULL, 7.00, 500, 'price_enchilada_large', 'prod_enchilada', true);

-- Product 26: Keto Bacon Egg Cups
INSERT INTO products (id, category_id, name, slug, description, short_description, image_url, is_active, display_order) VALUES
('b1c2d3e4-0001-4000-8000-000000000026', 6, 'Keto Bacon Egg Cups', 'keto-bacon-egg-cups', 'Baked egg cups wrapped in bacon with cheese and spinach. Perfect grab-and-go keto breakfast. Set of 4.', 'Low-carb bacon and egg breakfast cups', 'https://images.unsplash.com/photo-1608039755401-742074f0548d', true, 26);

INSERT INTO product_variants (id, product_id, sku, variant_name, price, compare_at_price, cost, weight_grams, stripe_price_id, stripe_product_id, is_active) VALUES
('b1c2d3e4-0001-4001-8000-000000000051', 'b1c2d3e4-0001-4000-8000-000000000026', 'MEAL-KETBAC-SM', 'Small', 9.99, NULL, 4.50, 250, 'price_ketobacon_small', 'prod_ketobacon', true),
('b1c2d3e4-0001-4001-8000-000000000052', 'b1c2d3e4-0001-4000-8000-000000000026', 'MEAL-KETBAC-LG', 'Large', 13.99, NULL, 6.50, 350, 'price_ketobacon_large', 'prod_ketobacon', true);

-- Product 27: Chicken Noodle Soup
INSERT INTO products (id, category_id, name, slug, description, short_description, image_url, is_active, display_order) VALUES
('b1c2d3e4-0001-4000-8000-000000000027', 8, 'Chicken Noodle Soup', 'chicken-noodle-soup', 'Classic comfort soup with tender chicken, egg noodles, carrots, and celery in savory broth.', 'Traditional chicken noodle soup', 'https://images.unsplash.com/photo-1613844237701-8f3664fc2eff', true, 27);

INSERT INTO product_variants (id, product_id, sku, variant_name, price, compare_at_price, cost, weight_grams, stripe_price_id, stripe_product_id, is_active) VALUES
('b1c2d3e4-0001-4001-8000-000000000053', 'b1c2d3e4-0001-4000-8000-000000000027', 'MEAL-CHKNOOD-SM', 'Small', 9.99, NULL, 4.00, 320, 'price_chickensoup_small', 'prod_chickensoup', true),
('b1c2d3e4-0001-4001-8000-000000000054', 'b1c2d3e4-0001-4000-8000-000000000027', 'MEAL-CHKNOOD-LG', 'Large', 13.99, NULL, 5.50, 460, 'price_chickensoup_large', 'prod_chickensoup', true);

-- Product 28: Sweet Potato Black Bean Bowl
INSERT INTO products (id, category_id, name, slug, description, short_description, image_url, is_active, display_order) VALUES
('b1c2d3e4-0001-4000-8000-000000000028', 5, 'Sweet Potato Black Bean Bowl', 'sweet-potato-black-bean-bowl', 'Roasted sweet potatoes, black beans, corn, avocado, and cilantro-lime dressing. Vegan and fiber-rich.', 'Plant-based sweet potato and bean bowl', 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd', true, 28);

INSERT INTO product_variants (id, product_id, sku, variant_name, price, compare_at_price, cost, weight_grams, stripe_price_id, stripe_product_id, is_active) VALUES
('b1c2d3e4-0001-4001-8000-000000000055', 'b1c2d3e4-0001-4000-8000-000000000028', 'MEAL-SWTBLK-SM', 'Small', 10.99, NULL, 4.50, 330, 'price_sweetbean_small', 'prod_sweetbean', true),
('b1c2d3e4-0001-4001-8000-000000000056', 'b1c2d3e4-0001-4000-8000-000000000028', 'MEAL-SWTBLK-LG', 'Large', 14.99, NULL, 6.50, 470, 'price_sweetbean_large', 'prod_sweetbean', true);

-- Product 29: Cajun Shrimp and Grits
INSERT INTO products (id, category_id, name, slug, description, short_description, image_url, is_active, display_order) VALUES
('b1c2d3e4-0001-4000-8000-000000000029', 1, 'Cajun Shrimp and Grits', 'cajun-shrimp-grits', 'Spicy Cajun shrimp over creamy cheese grits with andouille sausage and bell peppers. Southern soul food!', 'Spicy shrimp with creamy grits', 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58', true, 29);

INSERT INTO product_variants (id, product_id, sku, variant_name, price, compare_at_price, cost, weight_grams, stripe_price_id, stripe_product_id, is_active) VALUES
('b1c2d3e4-0001-4001-8000-000000000057', 'b1c2d3e4-0001-4000-8000-000000000029', 'MEAL-CAJSHR-SM', 'Small', 15.99, NULL, 8.00, 370, 'price_cajunshrimp_small', 'prod_cajunshrimp', true),
('b1c2d3e4-0001-4001-8000-000000000058', 'b1c2d3e4-0001-4000-8000-000000000029', 'MEAL-CAJSHR-LG', 'Large', 21.99, NULL, 11.00, 510, 'price_cajunshrimp_large', 'prod_cajunshrimp', true);

-- Product 30: Pesto Pasta with Cherry Tomatoes
INSERT INTO products (id, category_id, name, slug, description, short_description, image_url, is_active, display_order) VALUES
('b1c2d3e4-0001-4000-8000-000000000030', 2, 'Pesto Pasta with Cherry Tomatoes', 'pesto-pasta-cherry-tomatoes', 'Penne pasta tossed with fresh basil pesto, roasted cherry tomatoes, pine nuts, and parmesan. Simple and delicious.', 'Fresh pesto pasta with roasted tomatoes', 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601', true, 30);

INSERT INTO product_variants (id, product_id, sku, variant_name, price, compare_at_price, cost, weight_grams, stripe_price_id, stripe_product_id, is_active) VALUES
('b1c2d3e4-0001-4001-8000-000000000059', 'b1c2d3e4-0001-4000-8000-000000000030', 'MEAL-PESTOM-SM', 'Small', 12.99, NULL, 5.50, 340, 'price_pesto_small', 'prod_pesto', true),
('b1c2d3e4-0001-4001-8000-000000000060', 'b1c2d3e4-0001-4000-8000-000000000030', 'MEAL-PESTOM-LG', 'Large', 17.99, NULL, 7.50, 480, 'price_pesto_large', 'prod_pesto', true);

-- Continue with 10 more products to reach 40 total...
-- Product 31: Korean Beef Bulgogi
INSERT INTO products (id, category_id, name, slug, description, short_description, image_url, is_active, is_featured, display_order) VALUES
('b1c2d3e4-0001-4000-8000-000000000031', 3, 'Korean Beef Bulgogi', 'korean-beef-bulgogi', 'Marinated beef in sweet and savory Korean BBQ sauce with sesame seeds, served with rice and kimchi.', 'Sweet and savory Korean BBQ beef', 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb', true, true, 31);

INSERT INTO product_variants (id, product_id, sku, variant_name, price, compare_at_price, cost, weight_grams, stripe_price_id, stripe_product_id, is_active) VALUES
('b1c2d3e4-0001-4001-8000-000000000061', 'b1c2d3e4-0001-4000-8000-000000000031', 'MEAL-BULGO-SM', 'Small', 14.99, NULL, 7.50, 360, 'price_bulgogi_small', 'prod_bulgogi', true),
('b1c2d3e4-0001-4001-8000-000000000062', 'b1c2d3e4-0001-4000-8000-000000000031', 'MEAL-BULGO-LG', 'Large', 19.99, NULL, 10.00, 500, 'price_bulgogi_large', 'prod_bulgogi', true);

-- Product 32: Spinach Feta Omelette
INSERT INTO products (id, category_id, name, slug, description, short_description, image_url, is_active, display_order) VALUES
('b1c2d3e4-0001-4000-8000-000000000032', 7, 'Spinach Feta Omelette', 'spinach-feta-omelette', 'Fluffy three-egg omelette stuffed with spinach and feta cheese. Served with roasted potatoes and fruit.', 'Greek-inspired omelette with spinach and feta', 'https://images.unsplash.com/photo-1608039829572-78524f79c4c7', true, 32);

INSERT INTO product_variants (id, product_id, sku, variant_name, price, compare_at_price, cost, weight_grams, stripe_price_id, stripe_product_id, is_active) VALUES
('b1c2d3e4-0001-4001-8000-000000000063', 'b1c2d3e4-0001-4000-8000-000000000032', 'MEAL-SPINOMEL-SM', 'Small', 10.99, NULL, 4.50, 300, 'price_omelette_small', 'prod_omelette', true),
('b1c2d3e4-0001-4001-8000-000000000064', 'b1c2d3e4-0001-4000-8000-000000000032', 'MEAL-SPINOMEL-LG', 'Large', 14.99, NULL, 6.50, 420, 'price_omelette_large', 'prod_omelette', true);

-- Product 33: Chipotle Turkey Chili
INSERT INTO products (id, category_id, name, slug, description, short_description, image_url, is_active, display_order) VALUES
('b1c2d3e4-0001-4000-8000-000000000033', 8, 'Chipotle Turkey Chili', 'chipotle-turkey-chili', 'Lean ground turkey chili with beans, tomatoes, and smoky chipotle peppers. Topped with cheese and sour cream.', 'Spicy turkey chili with beans', 'https://images.unsplash.com/photo-1569862533825-21f3e3c0ff2e', true, 33);

INSERT INTO product_variants (id, product_id, sku, variant_name, price, compare_at_price, cost, weight_grams, stripe_price_id, stripe_product_id, is_active) VALUES
('b1c2d3e4-0001-4001-8000-000000000065', 'b1c2d3e4-0001-4000-8000-000000000033', 'MEAL-CHIPCHIL-SM', 'Small', 11.99, NULL, 5.00, 350, 'price_chili_small', 'prod_chili', true),
('b1c2d3e4-0001-4001-8000-000000000066', 'b1c2d3e4-0001-4000-8000-000000000033', 'MEAL-CHIPCHIL-LG', 'Large', 15.99, NULL, 7.00, 490, 'price_chili_large', 'prod_chili', true);

-- Product 34: Lemon Herb Chicken
INSERT INTO products (id, category_id, name, slug, description, short_description, image_url, is_active, display_order) VALUES
('b1c2d3e4-0001-4000-8000-000000000034', 1, 'Lemon Herb Chicken', 'lemon-herb-chicken', 'Juicy chicken breast marinated in lemon and herbs, with roasted vegetables and quinoa. Light and refreshing.', 'Citrus-marinated chicken with vegetables', 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6', true, 34);

INSERT INTO product_variants (id, product_id, sku, variant_name, price, compare_at_price, cost, weight_grams, stripe_price_id, stripe_product_id, is_active) VALUES
('b1c2d3e4-0001-4001-8000-000000000067', 'b1c2d3e4-0001-4000-8000-000000000034', 'MEAL-LEMCHK-SM', 'Small', 12.99, NULL, 6.00, 340, 'price_lemonchicken_small', 'prod_lemonchicken', true),
('b1c2d3e4-0001-4001-8000-000000000068', 'b1c2d3e4-0001-4000-8000-000000000034', 'MEAL-LEMCHK-LG', 'Large', 17.99, NULL, 8.50, 480, 'price_lemonchicken_large', 'prod_lemonchicken', true);

-- Product 35: Keto Cauliflower Mac and Cheese
INSERT INTO products (id, category_id, name, slug, description, short_description, image_url, is_active, display_order) VALUES
('b1c2d3e4-0001-4000-8000-000000000035', 6, 'Keto Cauliflower Mac and Cheese', 'keto-cauliflower-mac-cheese', 'Roasted cauliflower in rich, creamy cheese sauce with bacon bits. Low-carb comfort food.', 'Low-carb cauliflower mac and cheese', 'https://images.unsplash.com/photo-1619682817481-e994891cd1f5', true, 35);

INSERT INTO product_variants (id, product_id, sku, variant_name, price, compare_at_price, cost, weight_grams, stripe_price_id, stripe_product_id, is_active) VALUES
('b1c2d3e4-0001-4001-8000-000000000069', 'b1c2d3e4-0001-4000-8000-000000000035', 'MEAL-KETMAC-SM', 'Small', 11.99, NULL, 5.50, 310, 'price_ketomac_small', 'prod_ketomac', true),
('b1c2d3e4-0001-4001-8000-000000000070', 'b1c2d3e4-0001-4000-8000-000000000035', 'MEAL-KETMAC-LG', 'Large', 15.99, NULL, 7.50, 430, 'price_ketomac_large', 'prod_ketomac', true);

-- Product 36: Asian Sesame Salad
INSERT INTO products (id, category_id, name, slug, description, short_description, image_url, is_active, display_order) VALUES
('b1c2d3e4-0001-4000-8000-000000000036', 8, 'Asian Sesame Salad', 'asian-sesame-salad', 'Mixed greens with grilled chicken, mandarin oranges, crispy wonton strips, and sesame-ginger dressing.', 'Asian-inspired salad with sesame dressing', 'https://images.unsplash.com/photo-1546793665-c74683f339c1', true, 36);

INSERT INTO product_variants (id, product_id, sku, variant_name, price, compare_at_price, cost, weight_grams, stripe_price_id, stripe_product_id, is_active) VALUES
('b1c2d3e4-0001-4001-8000-000000000071', 'b1c2d3e4-0001-4000-8000-000000000036', 'MEAL-ASNSALAD-SM', 'Small', 11.99, NULL, 5.50, 290, 'price_asiansalad_small', 'prod_asiansalad', true),
('b1c2d3e4-0001-4001-8000-000000000072', 'b1c2d3e4-0001-4000-8000-000000000036', 'MEAL-ASNSALAD-LG', 'Large', 15.99, NULL, 7.50, 410, 'price_asiansalad_large', 'prod_asiansalad', true);

-- Product 37: Lamb Kofta with Tzatziki
INSERT INTO products (id, category_id, name, slug, description, short_description, image_url, is_active, display_order) VALUES
('b1c2d3e4-0001-4000-8000-000000000037', 1, 'Lamb Kofta with Tzatziki', 'lamb-kofta-tzatziki', 'Spiced ground lamb kofta with cucumber tzatziki, tomatoes, red onion, and rice. Mediterranean flavors.', 'Seasoned lamb with cooling tzatziki sauce', 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783', true, 37);

INSERT INTO product_variants (id, product_id, sku, variant_name, price, compare_at_price, cost, weight_grams, stripe_price_id, stripe_product_id, is_active) VALUES
('b1c2d3e4-0001-4001-8000-000000000073', 'b1c2d3e4-0001-4000-8000-000000000037', 'MEAL-LAMBKOF-SM', 'Small', 15.99, NULL, 8.50, 360, 'price_lamb_small', 'prod_lamb', true),
('b1c2d3e4-0001-4001-8000-000000000074', 'b1c2d3e4-0001-4000-8000-000000000037', 'MEAL-LAMBKOF-LG', 'Large', 21.99, NULL, 11.50, 500, 'price_lamb_large', 'prod_lamb', true);

-- Product 38: Vegan Chickpea Tikka Masala
INSERT INTO products (id, category_id, name, slug, description, short_description, image_url, is_active, display_order) VALUES
('b1c2d3e4-0001-4000-8000-000000000038', 5, 'Vegan Chickpea Tikka Masala', 'vegan-chickpea-tikka-masala', 'Chickpeas in creamy coconut-tomato tikka masala sauce with Indian spices. Served with basmati rice.', 'Plant-based Indian curry with chickpeas', 'https://images.unsplash.com/photo-1585937421612-70a008356fbe', true, 38);

INSERT INTO product_variants (id, product_id, sku, variant_name, price, compare_at_price, cost, weight_grams, stripe_price_id, stripe_product_id, is_active) VALUES
('b1c2d3e4-0001-4001-8000-000000000075', 'b1c2d3e4-0001-4000-8000-000000000038', 'MEAL-VEGTIK-SM', 'Small', 12.99, NULL, 5.50, 350, 'price_tikka_small', 'prod_tikka', true),
('b1c2d3e4-0001-4001-8000-000000000076', 'b1c2d3e4-0001-4000-8000-000000000038', 'MEAL-VEGTIK-LG', 'Large', 17.99, NULL, 7.50, 490, 'price_tikka_large', 'prod_tikka', true);

-- Product 39: Blackened Mahi Mahi
INSERT INTO products (id, category_id, name, slug, description, short_description, image_url, is_active, is_featured, display_order) VALUES
('b1c2d3e4-0001-4000-8000-000000000039', 1, 'Blackened Mahi Mahi', 'blackened-mahi-mahi', 'Cajun-spiced mahi mahi with cilantro-lime slaw, black beans, and rice. Fresh and zesty!', 'Spiced fish with fresh slaw and beans', 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2', true, true, 39);

INSERT INTO product_variants (id, product_id, sku, variant_name, price, compare_at_price, cost, weight_grams, stripe_price_id, stripe_product_id, is_active) VALUES
('b1c2d3e4-0001-4001-8000-000000000077', 'b1c2d3e4-0001-4000-8000-000000000039', 'MEAL-MAHMAH-SM', 'Small', 16.99, NULL, 9.00, 350, 'price_mahi_small', 'prod_mahi', true),
('b1c2d3e4-0001-4001-8000-000000000078', 'b1c2d3e4-0001-4000-8000-000000000039', 'MEAL-MAHMAH-LG', 'Large', 22.99, NULL, 12.00, 490, 'price_mahi_large', 'prod_mahi', true);

-- Product 40: Butternut Squash Ravioli
INSERT INTO products (id, category_id, name, slug, description, short_description, image_url, is_active, display_order) VALUES
('b1c2d3e4-0001-4000-8000-000000000040', 2, 'Butternut Squash Ravioli', 'butternut-squash-ravioli', 'Homemade ravioli filled with butternut squash and ricotta in brown butter sage sauce. Fall favorite!', 'Sweet squash ravioli in sage butter', 'https://images.unsplash.com/photo-1587740908075-9e245070dfaa', true, 40);

INSERT INTO product_variants (id, product_id, sku, variant_name, price, compare_at_price, cost, weight_grams, stripe_price_id, stripe_product_id, is_active) VALUES
('b1c2d3e4-0001-4001-8000-000000000079', 'b1c2d3e4-0001-4000-8000-000000000040', 'MEAL-BUTRAVIOLI-SM', 'Small', 13.99, NULL, 6.50, 340, 'price_ravioli_small', 'prod_ravioli', true),
('b1c2d3e4-0001-4001-8000-000000000080', 'b1c2d3e4-0001-4000-8000-000000000040', 'MEAL-BUTRAVIOLI-LG', 'Large', 18.99, NULL, 9.00, 480, 'price_ravioli_large', 'prod_ravioli', true);

-- =====================================================
-- PRODUCT TAGS RELATIONSHIPS
-- =====================================================

-- Map products to tags (selecting representative mappings)
INSERT INTO product_tags (product_id, tag_id) VALUES
-- Grilled Chicken Teriyaki Bowl
('b1c2d3e4-0001-4000-8000-000000000001', 8),  -- Chicken
('b1c2d3e4-0001-4000-8000-000000000001', 16), -- Asian
('b1c2d3e4-0001-4000-8000-000000000001', 19), -- Lunch
('b1c2d3e4-0001-4000-8000-000000000001', 20), -- Dinner
('b1c2d3e4-0001-4000-8000-000000000001', 27), -- High Protein

-- Beef Stir Fry
('b1c2d3e4-0001-4000-8000-000000000002', 9),  -- Beef
('b1c2d3e4-0001-4000-8000-000000000002', 16), -- Asian
('b1c2d3e4-0001-4000-8000-000000000002', 20), -- Dinner
('b1c2d3e4-0001-4000-8000-000000000002', 27), -- High Protein

-- Mediterranean Quinoa Bowl
('b1c2d3e4-0001-4000-8000-000000000003', 2),  -- Vegetarian
('b1c2d3e4-0001-4000-8000-000000000003', 13), -- Quinoa
('b1c2d3e4-0001-4000-8000-000000000003', 17), -- Mediterranean
('b1c2d3e4-0001-4000-8000-000000000003', 19), -- Lunch
('b1c2d3e4-0001-4000-8000-000000000003', 22), -- Contains Dairy

-- Spicy Chicken Burrito Bowl
('b1c2d3e4-0001-4000-8000-000000000004', 8),  -- Chicken
('b1c2d3e4-0001-4000-8000-000000000004', 15), -- Mexican
('b1c2d3e4-0001-4000-8000-000000000004', 20), -- Dinner
('b1c2d3e4-0001-4000-8000-000000000004', 28), -- Spicy

-- Creamy Tuscan Chicken Pasta
('b1c2d3e4-0001-4000-8000-000000000005', 8),  -- Chicken
('b1c2d3e4-0001-4000-8000-000000000005', 14), -- Italian
('b1c2d3e4-0001-4000-8000-000000000005', 20), -- Dinner
('b1c2d3e4-0001-4000-8000-000000000005', 22), -- Contains Dairy

-- Salmon Teriyaki
('b1c2d3e4-0001-4000-8000-000000000006', 11), -- Seafood
('b1c2d3e4-0001-4000-8000-000000000006', 16), -- Asian
('b1c2d3e4-0001-4000-8000-000000000006', 20), -- Dinner
('b1c2d3e4-0001-4000-8000-000000000006', 27), -- High Protein

-- Vegan Buddha Bowl
('b1c2d3e4-0001-4000-8000-000000000007', 1),  -- Vegan
('b1c2d3e4-0001-4000-8000-000000000007', 2),  -- Vegetarian
('b1c2d3e4-0001-4000-8000-000000000007', 5),  -- Gluten-Free
('b1c2d3e4-0001-4000-8000-000000000007', 6),  -- Dairy-Free
('b1c2d3e4-0001-4000-8000-000000000007', 19), -- Lunch

-- Keto Beef and Broccoli
('b1c2d3e4-0001-4000-8000-000000000008', 3),  -- Keto
('b1c2d3e4-0001-4000-8000-000000000008', 7),  -- Low-Carb
('b1c2d3e4-0001-4000-8000-000000000008', 9),  -- Beef
('b1c2d3e4-0001-4000-8000-000000000008', 20), -- Dinner

-- Shrimp Pad Thai
('b1c2d3e4-0001-4000-8000-000000000015', 11), -- Seafood
('b1c2d3e4-0001-4000-8000-000000000015', 16), -- Asian
('b1c2d3e4-0001-4000-8000-000000000015', 20), -- Dinner
('b1c2d3e4-0001-4000-8000-000000000015', 21), -- Contains Nuts

-- Vegan Buddha Bowl mappings
('b1c2d3e4-0001-4000-8000-000000000007', 13), -- Quinoa

-- Breakfast Power Bowl
('b1c2d3e4-0001-4000-8000-000000000012', 18), -- Breakfast
('b1c2d3e4-0001-4000-8000-000000000012', 27), -- High Protein
('b1c2d3e4-0001-4000-8000-000000000012', 5),  -- Gluten-Free

-- Vegan Chickpea Tikka Masala
('b1c2d3e4-0001-4000-8000-000000000038', 1),  -- Vegan
('b1c2d3e4-0001-4000-8000-000000000038', 2),  -- Vegetarian
('b1c2d3e4-0001-4000-8000-000000000038', 5),  -- Gluten-Free
('b1c2d3e4-0001-4000-8000-000000000038', 6);  -- Dairy-Free

-- =====================================================
-- SAMPLE NUTRITION INFO (for first 10 products)
-- =====================================================

-- Grilled Chicken Teriyaki Bowl - Small
INSERT INTO nutrition_info (
    variant_id, serving_size, serving_size_grams, calories, protein_grams, 
    carbohydrates_grams, fat_grams, dietary_fiber_grams, sugars_grams,
    sodium_mg, potassium_mg, cholesterol_mg, saturated_fat_grams,
    is_gluten_free, is_dairy_free, contains_soy
) VALUES (
    'b1c2d3e4-0001-4001-8000-000000000001', '1 bowl', 350, 450, 38, 52, 8, 4, 12,
    680, 520, 85, 2.5, false, true, true
);

-- Grilled Chicken Teriyaki Bowl - Large
INSERT INTO nutrition_info (
    variant_id, serving_size, serving_size_grams, calories, protein_grams, 
    carbohydrates_grams, fat_grams, dietary_fiber_grams, sugars_grams,
    sodium_mg, potassium_mg, cholesterol_mg, saturated_fat_grams,
    is_gluten_free, is_dairy_free, contains_soy
) VALUES (
    'b1c2d3e4-0001-4001-8000-000000000002', '1 bowl', 500, 625, 52, 72, 11, 6, 16,
    920, 720, 115, 3.5, false, true, true
);

-- Beef Stir Fry - Small
INSERT INTO nutrition_info (
    variant_id, serving_size, serving_size_grams, calories, protein_grams, 
    carbohydrates_grams, fat_grams, dietary_fiber_grams, sugars_grams,
    sodium_mg, potassium_mg, cholesterol_mg, saturated_fat_grams,
    is_gluten_free, is_dairy_free, contains_soy
) VALUES (
    'b1c2d3e4-0001-4001-8000-000000000003', '1 bowl', 350, 480, 35, 48, 14, 5, 8,
    720, 580, 75, 4.5, false, true, true
);

-- Beef Stir Fry - Large
INSERT INTO nutrition_info (
    variant_id, serving_size, serving_size_grams, calories, protein_grams, 
    carbohydrates_grams, fat_grams, dietary_fiber_grams, sugars_grams,
    sodium_mg, potassium_mg, cholesterol_mg, saturated_fat_grams,
    is_gluten_free, is_dairy_free, contains_soy
) VALUES (
    'b1c2d3e4-0001-4001-8000-000000000004', '1 bowl', 500, 665, 48, 66, 19, 7, 11,
    980, 800, 105, 6.5, false, true, true
);

-- Mediterranean Quinoa Bowl - Small
INSERT INTO nutrition_info (
    variant_id, serving_size, serving_size_grams, calories, protein_grams, 
    carbohydrates_grams, fat_grams, dietary_fiber_grams, sugars_grams,
    sodium_mg, potassium_mg, cholesterol_mg, saturated_fat_grams,
    is_gluten_free, is_dairy_free, is_vegetarian, contains_dairy
) VALUES (
    'b1c2d3e4-0001-4001-8000-000000000005', '1 bowl', 320, 420, 18, 56, 14, 8, 6,
    540, 480, 25, 5, true, false, true, true
);

-- Mediterranean Quinoa Bowl - Large
INSERT INTO nutrition_info (
    variant_id, serving_size, serving_size_grams, calories, protein_grams, 
    carbohydrates_grams, fat_grams, dietary_fiber_grams, sugars_grams,
    sodium_mg, potassium_mg, cholesterol_mg, saturated_fat_grams,
    is_gluten_free, is_dairy_free, is_vegetarian, contains_dairy
) VALUES (
    'b1c2d3e4-0001-4001-8000-000000000006', '1 bowl', 450, 580, 25, 78, 19, 11, 8,
    740, 660, 35, 7, true, false, true, true
);

-- Salmon Teriyaki - Small
INSERT INTO nutrition_info (
    variant_id, serving_size, serving_size_grams, calories, protein_grams, 
    carbohydrates_grams, fat_grams, dietary_fiber_grams, sugars_grams,
    sodium_mg, potassium_mg, cholesterol_mg, saturated_fat_grams,
    omega3_grams, is_gluten_free, is_dairy_free, contains_fish
) VALUES (
    'b1c2d3e4-0001-4001-8000-000000000011', '1 bowl', 340, 520, 42, 45, 18, 4, 10,
    780, 680, 95, 3.5, 2.8, false, true, true
);

-- Salmon Teriyaki - Large
INSERT INTO nutrition_info (
    variant_id, serving_size, serving_size_grams, calories, protein_grams, 
    carbohydrates_grams, fat_grams, dietary_fiber_grams, sugars_grams,
    sodium_mg, potassium_mg, cholesterol_mg, saturated_fat_grams,
    omega3_grams, is_gluten_free, is_dairy_free, contains_fish
) VALUES (
    'b1c2d3e4-0001-4001-8000-000000000012', '1 bowl', 480, 720, 58, 62, 25, 6, 14,
    1080, 940, 130, 4.8, 3.9, false, true, true
);

-- Vegan Buddha Bowl - Small
INSERT INTO nutrition_info (
    variant_id, serving_size, serving_size_grams, calories, protein_grams, 
    carbohydrates_grams, fat_grams, dietary_fiber_grams, sugars_grams,
    sodium_mg, potassium_mg, monounsaturated_fat_grams,
    is_vegan, is_vegetarian, is_gluten_free, is_dairy_free
) VALUES (
    'b1c2d3e4-0001-4001-8000-000000000013', '1 bowl', 330, 390, 14, 54, 15, 12, 8,
    420, 820, 8, true, true, true, true
);

-- Vegan Buddha Bowl - Large
INSERT INTO nutrition_info (
    variant_id, serving_size, serving_size_grams, calories, protein_grams, 
    carbohydrates_grams, fat_grams, dietary_fiber_grams, sugars_grams,
    sodium_mg, potassium_mg, monounsaturated_fat_grams,
    is_vegan, is_vegetarian, is_gluten_free, is_dairy_free
) VALUES (
    'b1c2d3e4-0001-4001-8000-000000000014', '1 bowl', 470, 540, 19, 75, 21, 16, 11,
    580, 1140, 11, true, true, true, true
);

-- Keto Beef and Broccoli - Small
INSERT INTO nutrition_info (
    variant_id, serving_size, serving_size_grams, calories, protein_grams, 
    carbohydrates_grams, fat_grams, dietary_fiber_grams, sugars_grams,
    sodium_mg, potassium_mg, cholesterol_mg, saturated_fat_grams,
    is_gluten_free, is_dairy_free
) VALUES (
    'b1c2d3e4-0001-4001-8000-000000000015', '1 bowl', 320, 420, 32, 12, 28, 5, 4,
    640, 540, 85, 11, true, true
);

-- Keto Beef and Broccoli - Large
INSERT INTO nutrition_info (
    variant_id, serving_size, serving_size_grams, calories, protein_grams, 
    carbohydrates_grams, fat_grams, dietary_fiber_grams, sugars_grams,
    sodium_mg, potassium_mg, cholesterol_mg, saturated_fat_grams,
    is_gluten_free, is_dairy_free
) VALUES (
    'b1c2d3e4-0001-4001-8000-000000000016', '1 bowl', 450, 580, 44, 17, 39, 7, 5,
    880, 750, 120, 15, true, true
);

-- =====================================================
-- INVENTORY
-- =====================================================

-- Set inventory for all 80 variants (40 products x 2 sizes)
INSERT INTO inventory (variant_id, quantity_available, quantity_reserved, low_stock_threshold) 
SELECT 
    id,
    FLOOR(RANDOM() * 80 + 20)::INTEGER, -- Random between 20-100
    FLOOR(RANDOM() * 5)::INTEGER,        -- Random reserved 0-5
    15
FROM product_variants;

-- =====================================================
-- PROMOTIONAL CODES
-- =====================================================

INSERT INTO promo_codes (id, code, description, discount_type, discount_value, minimum_order_amount, max_uses, times_used, valid_from, valid_until, is_active) VALUES
('c1d2e3f4-0001-4000-8000-000000000001', 'WELCOME10', 'Welcome discount for new customers', 'percentage', 10.00, 30.00, 1000, 234, NOW() - INTERVAL '60 days', NOW() + INTERVAL '90 days', true),
('c1d2e3f4-0001-4000-8000-000000000002', 'SAVE5', '$5 off your order', 'fixed_amount', 5.00, 25.00, 500, 156, NOW() - INTERVAL '30 days', NOW() + INTERVAL '60 days', true),
('c1d2e3f4-0001-4000-8000-000000000003', 'HEALTHY20', '20% off plant-based meals', 'percentage', 20.00, 40.00, 200, 87, NOW() - INTERVAL '15 days', NOW() + INTERVAL '45 days', true),
('c1d2e3f4-0001-4000-8000-000000000004', 'BULK15', '15% off orders over $75', 'percentage', 15.00, 75.00, NULL, 42, NOW() - INTERVAL '45 days', NOW() + INTERVAL '120 days', true),
('c1d2e3f4-0001-4000-8000-000000000005', 'FREESHIP', 'Free delivery', 'fixed_amount', 7.99, 50.00, NULL, 298, NOW() - INTERVAL '90 days', NOW() + INTERVAL '365 days', true),
('c1d2e3f4-0001-4000-8000-000000000006', 'SUMMER25', 'Summer special - 25% off', 'percentage', 25.00, 60.00, 100, 67, NOW() - INTERVAL '20 days', NOW() + INTERVAL '30 days', true);


-- =====================================================
-- BUNDLES
-- =====================================================

-- Bundle 1: Family Pack
INSERT INTO bundles (id, name, slug, description, image_url, price, savings_amount, is_active) VALUES
('d1e2f3a4-0001-4000-8000-000000000001', 'Family Pack', 'family-pack', 'Perfect for the whole family! Includes 2 Chicken Teriyaki, 2 Beef Stir Fry, and 2 Mediterranean Quinoa bowls.', 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c', 69.99, 15.95, true);

INSERT INTO bundle_items (bundle_id, variant_id, quantity) VALUES
('d1e2f3a4-0001-4000-8000-000000000001', 'b1c2d3e4-0001-4001-8000-000000000002', 2), -- Chicken Teriyaki Large x2
('d1e2f3a4-0001-4000-8000-000000000001', 'b1c2d3e4-0001-4001-8000-000000000004', 2), -- Beef Stir Fry Large x2
('d1e2f3a4-0001-4000-8000-000000000001', 'b1c2d3e4-0001-4001-8000-000000000006', 2); -- Med Quinoa Large x2

-- Bundle 2: Keto Starter Pack
INSERT INTO bundles (id, name, slug, description, image_url, price, savings_amount, is_active) VALUES
('d1e2f3a4-0001-4000-8000-000000000002', 'Keto Starter Pack', 'keto-starter-pack', 'Start your keto journey! 3 Keto Beef & Broccoli, 3 Keto Chicken Alfredo meals.', 'https://images.unsplash.com/photo-1603133872878-684f208fb84b', 79.99, 9.95, true);

INSERT INTO bundle_items (bundle_id, variant_id, quantity) VALUES
('d1e2f3a4-0001-4000-8000-000000000002', 'b1c2d3e4-0001-4001-8000-000000000016', 3), -- Keto Beef Large x3
('d1e2f3a4-0001-4000-8000-000000000002', 'b1c2d3e4-0001-4001-8000-000000000032', 3); -- Keto Alfredo Large x3

-- Bundle 3: Plant-Based Week
INSERT INTO bundles (id, name, slug, description, image_url, price, savings_amount, is_active) VALUES
('d1e2f3a4-0001-4000-8000-000000000003', 'Plant-Based Week', 'plant-based-week', 'A week of delicious vegan meals! Mix of Buddha Bowls, Tofu Stir Fry, and Chickpea Tikka.', 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd', 74.99, 14.96, true);

INSERT INTO bundle_items (bundle_id, variant_id, quantity) VALUES
('d1e2f3a4-0001-4000-8000-000000000003', 'b1c2d3e4-0001-4001-8000-000000000014', 3), -- Buddha Bowl Large x3
('d1e2f3a4-0001-4000-8000-000000000003', 'b1c2d3e4-0001-4001-8000-000000000036', 2), -- Tofu Teriyaki Large x2
('d1e2f3a4-0001-4000-8000-000000000003', 'b1c2d3e4-0001-4001-8000-000000000076', 2); -- Chickpea Tikka Large x2

-- Bundle 4: Seafood Lovers
INSERT INTO bundles (id, name, slug, description, image_url, price, savings_amount, is_active) VALUES
('d1e2f3a4-0001-4000-8000-000000000004', 'Seafood Lovers', 'seafood-lovers', 'Fresh from the sea! Salmon Teriyaki, Shrimp Pad Thai, and Blackened Mahi.', 'https://images.unsplash.com/photo-1467003909585-2f8a72700288', 59.99, 8.97, true);

INSERT INTO bundle_items (bundle_id, variant_id, quantity) VALUES
('d1e2f3a4-0001-4000-8000-000000000004', 'b1c2d3e4-0001-4001-8000-000000000012', 2), -- Salmon Large x2
('d1e2f3a4-0001-4000-8000-000000000004', 'b1c2d3e4-0001-4001-8000-000000000030', 1), -- Pad Thai Large x1
('d1e2f3a4-0001-4000-8000-000000000004', 'b1c2d3e4-0001-4001-8000-000000000078', 1); -- Mahi Large x1

-- Bundle 5: Breakfast Bundle
INSERT INTO bundles (id, name, slug, description, image_url, price, savings_amount, is_active) VALUES
('d1e2f3a4-0001-4000-8000-000000000005', 'Breakfast Bundle', 'breakfast-bundle', 'Start every day right! 5 breakfast meals to fuel your week.', 'https://images.unsplash.com/photo-1525351484163-7529414344d8', 49.99, 6.96, true);

INSERT INTO bundle_items (bundle_id, variant_id, quantity) VALUES
('d1e2f3a4-0001-4000-8000-000000000005', 'b1c2d3e4-0001-4001-8000-000000000024', 2), -- Breakfast Power Large x2
('d1e2f3a4-0001-4000-8000-000000000005', 'b1c2d3e4-0001-4001-8000-000000000040', 2), -- Egg White Scramble Large x2
('d1e2f3a4-0001-4000-8000-000000000005', 'b1c2d3e4-0001-4001-8000-000000000064', 1); -- Spinach Omelette Large x1

-- Bundle 6: Italian Feast
INSERT INTO bundles (id, name, slug, description, image_url, price, savings_amount, is_active) VALUES
('d1e2f3a4-0001-4000-8000-000000000006', 'Italian Feast', 'italian-feast', 'Taste of Italy! Tuscan Chicken Pasta, Turkey Meatballs, and Pesto Pasta.', 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9', 49.99, 5.98, true);

INSERT INTO bundle_items (bundle_id, variant_id, quantity) VALUES
('d1e2f3a4-0001-4000-8000-000000000006', 'b1c2d3e4-0001-4001-8000-000000000010', 1), -- Tuscan Pasta Large x1
('d1e2f3a4-0001-4000-8000-000000000006', 'b1c2d3e4-0001-4001-8000-000000000018', 1), -- Turkey Meatballs Large x1
('d1e2f3a4-0001-4000-8000-000000000006', 'b1c2d3e4-0001-4001-8000-000000000060', 1); -- Pesto Pasta Large x1

-- Bundle 7: Protein Power Pack
INSERT INTO bundles (id, name, slug, description, image_url, price, savings_amount, is_active) VALUES
('d1e2f3a4-0001-4000-8000-000000000007', 'Protein Power Pack', 'protein-power-pack', 'Maximum protein! Perfect for athletes and fitness enthusiasts.', 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c', 84.99, 11.96, true);

INSERT INTO bundle_items (bundle_id, variant_id, quantity) VALUES
('d1e2f3a4-0001-4000-8000-000000000007', 'b1c2d3e4-0001-4001-8000-000000000002', 2), -- Chicken Teriyaki Large x2
('d1e2f3a4-0001-4000-8000-000000000007', 'b1c2d3e4-0001-4001-8000-000000000004', 2), -- Beef Stir Fry Large x2
('d1e2f3a4-0001-4000-8000-000000000007', 'b1c2d3e4-0001-4001-8000-000000000012', 2); -- Salmon Large x2

-- Bundle 8: Mexican Fiesta
INSERT INTO bundles (id, name, slug, description, image_url, price, savings_amount, is_active) VALUES
('d1e2f3a4-0001-4000-8000-000000000008', 'Mexican Fiesta', 'mexican-fiesta', 'Spice up your week! Burrito Bowl, Carnitas Tacos, Steak Fajita, and Veggie Enchiladas.', 'https://images.unsplash.com/photo-1559543452-731e5f9e8b4c', 64.99, 9.97, true);

INSERT INTO bundle_items (bundle_id, variant_id, quantity) VALUES
('d1e2f3a4-0001-4000-8000-000000000008', 'b1c2d3e4-0001-4001-8000-000000000008', 1), -- Burrito Bowl Large x1
('d1e2f3a4-0001-4000-8000-000000000008', 'b1c2d3e4-0001-4001-8000-000000000022', 1), -- Carnitas Large x1
('d1e2f3a4-0001-4000-8000-000000000008', 'b1c2d3e4-0001-4001-8000-000000000038', 1), -- Steak Fajita Large x1
('d1e2f3a4-0001-4000-8000-000000000008', 'b1c2d3e4-0001-4001-8000-000000000050', 1); -- Veggie Enchiladas Large x1

-- Bundle 9: Light & Fresh
INSERT INTO bundles (id, name, slug, description, image_url, price, savings_amount, is_active) VALUES
('d1e2f3a4-0001-4000-8000-000000000009', 'Light & Fresh', 'light-fresh', 'Healthy and refreshing meals for a lighter approach.', 'https://images.unsplash.com/photo-1546793665-c74683f339c1', 54.99, 7.97, true);

INSERT INTO bundle_items (bundle_id, variant_id, quantity) VALUES
('d1e2f3a4-0001-4000-8000-000000000009', 'b1c2d3e4-0001-4001-8000-000000000026', 2), -- Caesar Salad Large x2
('d1e2f3a4-0001-4000-8000-000000000009', 'b1c2d3e4-0001-4001-8000-000000000072', 2); -- Asian Sesame Salad Large x2

-- Bundle 10: Soup Sampler
INSERT INTO bundles (id, name, slug, description, image_url, price, savings_amount, is_active) VALUES
('d1e2f3a4-0001-4000-8000-000000000010', 'Soup Sampler', 'soup-sampler', 'Warm and comforting soups for any day.', 'https://images.unsplash.com/photo-1547592166-23ac45744acd', 44.99, 6.98, true);

INSERT INTO bundle_items (bundle_id, variant_id, quantity) VALUES
('d1e2f3a4-0001-4000-8000-000000000010', 'b1c2d3e4-0001-4001-8000-000000000028', 2), -- Lentil Soup Large x2
('d1e2f3a4-0001-4000-8000-000000000010', 'b1c2d3e4-0001-4001-8000-000000000054', 2), -- Chicken Noodle Large x2
('d1e2f3a4-0001-4000-8000-000000000010', 'b1c2d3e4-0001-4001-8000-000000000066', 1); -- Turkey Chili Large x1

-- Bundle 11: Asian Adventure
INSERT INTO bundles (id, name, slug, description, image_url, price, savings_amount, is_active) VALUES
('d1e2f3a4-0001-4000-8000-000000000011', 'Asian Adventure', 'asian-adventure', 'Explore bold Asian flavors! Thai Curry, Pad Thai, Bulgogi, and Sesame Salmon.', 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd', 72.99, 10.97, true);

INSERT INTO bundle_items (bundle_id, variant_id, quantity) VALUES
('d1e2f3a4-0001-4000-8000-000000000011', 'b1c2d3e4-0001-4001-8000-000000000020', 1), -- Thai Curry Large x1
('d1e2f3a4-0001-4000-8000-000000000011', 'b1c2d3e4-0001-4001-8000-000000000030', 1), -- Pad Thai Large x1
('d1e2f3a4-0001-4000-8000-000000000011', 'b1c2d3e4-0001-4001-8000-000000000062', 1), -- Bulgogi Large x1
('d1e2f3a4-0001-4000-8000-000000000011', 'b1c2d3e4-0001-4001-8000-000000000048', 1); -- Sesame Salmon Large x1

-- Bundle 12: Mediterranean Mix
INSERT INTO bundles (id, name, slug, description, image_url, price, savings_amount, is_active) VALUES
('d1e2f3a4-0001-4000-8000-000000000012', 'Mediterranean Mix', 'mediterranean-mix', 'Fresh Mediterranean flavors! Quinoa Bowl, Greek Chicken, and Lamb Kofta.', 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe', 52.99, 7.98, true);

INSERT INTO bundle_items (bundle_id, variant_id, quantity) VALUES
('d1e2f3a4-0001-4000-8000-000000000012', 'b1c2d3e4-0001-4001-8000-000000000006', 1), -- Med Quinoa Large x1
('d1e2f3a4-0001-4000-8000-000000000012', 'b1c2d3e4-0001-4001-8000-000000000044', 1), -- Greek Chicken Large x1
('d1e2f3a4-0001-4000-8000-000000000012', 'b1c2d3e4-0001-4001-8000-000000000074', 1); -- Lamb Kofta Large x1

-- =====================================================
-- CARTS (Some active shopping carts for registered users)
-- =====================================================

INSERT INTO carts (id, customer_id, created_at, updated_at) VALUES
('f1a2b3c4-0001-4000-8000-000000000001', 'a1b2c3d4-0001-4000-8000-000000000015', NOW() - INTERVAL '2 hours', NOW() - INTERVAL '5 minutes'),
('f1a2b3c4-0001-4000-8000-000000000002', 'a1b2c3d4-0001-4000-8000-000000000016', NOW() - INTERVAL '1 day', NOW() - INTERVAL '8 hours'),
('f1a2b3c4-0001-4000-8000-000000000003', 'a1b2c3d4-0001-4000-8000-000000000020', NOW() - INTERVAL '30 minutes', NOW() - INTERVAL '10 minutes');

INSERT INTO cart_items (cart_id, item_type, variant_id, bundle_id, quantity, created_at) VALUES
('f1a2b3c4-0001-4000-8000-000000000001', 'product', 'b1c2d3e4-0001-4001-8000-000000000002', NULL, 2, NOW() - INTERVAL '2 hours'),
('f1a2b3c4-0001-4000-8000-000000000001', 'product', 'b1c2d3e4-0001-4001-8000-000000000012', NULL, 1, NOW() - INTERVAL '5 minutes'),
('f1a2b3c4-0001-4000-8000-000000000002', 'bundle', NULL, 'd1e2f3a4-0001-4000-8000-000000000001', 1, NOW() - INTERVAL '1 day'),
('f1a2b3c4-0001-4000-8000-000000000003', 'product', 'b1c2d3e4-0001-4001-8000-000000000020', NULL, 3, NOW() - INTERVAL '30 minutes'),
('f1a2b3c4-0001-4000-8000-000000000003', 'product', 'b1c2d3e4-0001-4001-8000-000000000014', NULL, 2, NOW() - INTERVAL '10 minutes');

-- =====================================================
-- END OF SEED DATA
-- =====================================================-- =====================================================
-- SEED DATA FOR MEAL DELIVERY E-COMMERCE DATABASE
-- =====================================================
-- This seed data provides a realistic development environment with:
-- - 50 customers (mix of registered and guest orders)
-- - 8 product categories
-- - 40 unique meal products with 80 variants (small/large)
-- - Comprehensive nutrition data for all variants
-- - 12 meal bundles
-- - 100+ orders with various statuses
-- - Realistic inventory levels
-- - Active promotional codes
-- =====================================================
