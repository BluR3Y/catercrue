-- Switch to the database
\c catercrue;

-- Drop existing tables if they exist (for resets during development)
DROP TABLE IF EXISTS vendor_industries;
DROP TABLE IF EXISTS industry_services;
DROP TABLE IF EXISTS industry_roles;
DROP TABLE IF EXISTS event_types;

-- ============================
-- VENDOR INDUSTRIES TABLE
-- ============================
CREATE TABLE vendor_industries (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT DEFAULT NULL
);

-- Insert optimized vendor industries
INSERT INTO vendor_industries (name, description) VALUES
    ('Catering & Food Services', 'Vendors offering food preparation, beverage services, and mobile catering.'),
    ('Event Planning & Management', 'Full-service event planning, coordination, and logistics management.'),
    ('Photography & Videography', 'Event photography, videography, live streaming, and photo booths.'),
    ('Entertainment & Performances', 'Live bands, DJs, specialty performers, casino nights.'),
    ('Floral & Event Decor', 'Floral arrangements, balloon art, themed decorations, and rentals.'),
    ('Event Logistics & Operations', 'Staffing, transportation, security, VIP concierge services.'),
    ('Technology & AV Solutions', 'Audio-visual setups, live streaming, LED screens, and event tech.'),
    ('Beauty & Personal Care', 'Hair & makeup, skincare, spa services, and personal grooming.'),
    ('Event Merchandise & Gifts', 'Custom clothing, personalized gifts, invitations, and favors.'),
    ('Corporate & Business Events', 'Printing, branding, HR services, financial consulting.'),
    ('Other / Specialty Services', 'Unique offerings like officiants, luxury rentals, and custom services.');

-- ============================
-- VENDOR SERVICES TABLE
-- ============================
CREATE TABLE industry_services (
    id SERIAL PRIMARY KEY,
    industry_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT DEFAULT NULL,
    CONSTRAINT fk_industry FOREIGN KEY (industry_id) REFERENCES vendor_industries(id) ON DELETE CASCADE
);

-- Insert optimized vendor services linked to industries
INSERT INTO industry_services (industry_id, name, description)
VALUES
    -- Catering & Food Services
    ((SELECT id FROM vendor_industries WHERE name = 'Catering & Food Services'), 'Food Preparation', 'Preparation of meals and event catering.'),
    ((SELECT id FROM vendor_industries WHERE name = 'Catering & Food Services'), 'Beverage Service', 'Bar services, cocktails, and non-alcoholic beverages.'),
    ((SELECT id FROM vendor_industries WHERE name = 'Catering & Food Services'), 'Wedding Cake Design', 'Custom wedding cakes and dessert design.'),
    ((SELECT id FROM vendor_industries WHERE name = 'Catering & Food Services'), 'Mobile Food Trucks', 'On-site mobile catering and food trucks.'),

    -- Event Planning & Management
    ((SELECT id FROM vendor_industries WHERE name = 'Event Planning & Management'), 'Budget Management', 'Tracking and managing event budgets.'),
    ((SELECT id FROM vendor_industries WHERE name = 'Event Planning & Management'), 'Logistics & Coordination', 'Handling event logistics and vendor scheduling.'),
    ((SELECT id FROM vendor_industries WHERE name = 'Event Planning & Management'), 'Destination Event Planning', 'Planning and organizing destination weddings or events.'),
    ((SELECT id FROM vendor_industries WHERE name = 'Event Planning & Management'), 'Sustainable Event Planning', 'Eco-friendly and green event planning services.'),

    -- Photography & Videography
    ((SELECT id FROM vendor_industries WHERE name = 'Photography & Videography'), 'Event Photography', 'Professional photography services for events.'),
    ((SELECT id FROM vendor_industries WHERE name = 'Photography & Videography'), 'Videography & Live Streaming', 'Event videography, editing, and live broadcasting.'),
    ((SELECT id FROM vendor_industries WHERE name = 'Photography & Videography'), '360 Photo Booth', 'Interactive 360-degree photo booth experience.'),

    -- Entertainment & Performances
    ((SELECT id FROM vendor_industries WHERE name = 'Entertainment & Performances'), 'DJ Services', 'Music and entertainment by professional DJs.'),
    ((SELECT id FROM vendor_industries WHERE name = 'Entertainment & Performances'), 'Live Band Performances', 'Live musical performances for events.'),
    ((SELECT id FROM vendor_industries WHERE name = 'Entertainment & Performances'), 'Themed Party Performers', 'Magicians, impersonators, and interactive entertainers.'),
    ((SELECT id FROM vendor_industries WHERE name = 'Entertainment & Performances'), 'Casino Night & Games', 'Rental of poker tables, roulette, and gaming setups.'),

    -- Floral & Event Decor
    ((SELECT id FROM vendor_industries WHERE name = 'Floral & Event Decor'), 'Floral Arrangements', 'Bouquets, centerpieces, and floral designs.'),
    ((SELECT id FROM vendor_industries WHERE name = 'Floral & Event Decor'), 'Balloon Art & Installations', 'Balloon decorations for events.'),
    ((SELECT id FROM vendor_industries WHERE name = 'Floral & Event Decor'), 'Themed Decorations', 'Event-themed decor and ambiance setup.'),

    -- Event Logistics & Operations
    ((SELECT id FROM vendor_industries WHERE name = 'Event Logistics & Operations'), 'Event Staffing', 'Hiring event staff such as ushers and servers.'),
    ((SELECT id FROM vendor_industries WHERE name = 'Event Logistics & Operations'), 'Security Services', 'Crowd control, security guards, and monitoring.'),
    ((SELECT id FROM vendor_industries WHERE name = 'Event Logistics & Operations'), 'VIP Concierge Services', 'High-end guest management and personalized services.'),

    -- Technology & AV Solutions
    ((SELECT id FROM vendor_industries WHERE name = 'Technology & AV Solutions'), 'LED Screens & Projection Mapping', 'Visual effects and digital displays.'),
    ((SELECT id FROM vendor_industries WHERE name = 'Technology & AV Solutions'), 'Hybrid Event Streaming', 'Hosting virtual and hybrid events.'),

    -- Beauty & Personal Care
    ((SELECT id FROM vendor_industries WHERE name = 'Beauty & Personal Care'), 'Hair & Makeup', 'Professional hair and makeup for events.'),
    ((SELECT id FROM vendor_industries WHERE name = 'Beauty & Personal Care'), 'On-Site Spa Treatments', 'Mobile spa and relaxation services.'),

    -- Event Merchandise & Gifts
    ((SELECT id FROM vendor_industries WHERE name = 'Event Merchandise & Gifts'), 'Personalized Gifts', 'Engraved and custom event favors.'),
    ((SELECT id FROM vendor_industries WHERE name = 'Event Merchandise & Gifts'), 'Custom Invitations & Printing', 'Design and printing of event invitations.'),

    -- Corporate & Business Events
    ((SELECT id FROM vendor_industries WHERE name = 'Corporate & Business Events'), 'Conference Planning', 'Planning for corporate events and conferences.'),
    ((SELECT id FROM vendor_industries WHERE name = 'Corporate & Business Events'), 'Financial Consulting', 'Budget planning and financial services for businesses.'),

    -- Other / Specialty Services
    ((SELECT id FROM vendor_industries WHERE name = 'Other / Specialty Services'), 'Luxury Car Rentals', 'High-end vehicle rentals for events.'),
    ((SELECT id FROM vendor_industries WHERE name = 'Other / Specialty Services'), 'Wedding Officiant', 'Certified officiant services for weddings.');