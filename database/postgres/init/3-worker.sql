DROP TABLE IF EXISTS industry_roles;

-- ============================
-- INDUSTRY ROLES TABLE
-- ============================
CREATE TABLE industry_roles (
    id SERIAL PRIMARY KEY,
    industry_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT DEFAULT NULL,
    
    CONSTRAINT fk_industry FOREIGN KEY (industry_id) REFERENCES service_industries(id) ON DELETE CASCADE
);

-- Create an index for faster lookups by industry_id
CREATE INDEX idx_industry_roles_industry ON industry_roles (industry_id);

-- ============================
-- INSERT INDUSTRY ROLES
-- ============================
INSERT INTO industry_roles (industry_id, name, description)
VALUES
    -- Catering & Food Services Roles
    ((SELECT id FROM service_industries WHERE name = 'Catering & Food Services'), 'Executive Chef', 'Head of kitchen operations and menu creation.'),
    ((SELECT id FROM service_industries WHERE name = 'Catering & Food Services'), 'Sous Chef', 'Second-in-command in the kitchen.'),
    ((SELECT id FROM service_industries WHERE name = 'Catering & Food Services'), 'Pastry Chef', 'Responsible for baking and dessert preparation.'),
    ((SELECT id FROM service_industries WHERE name = 'Catering & Food Services'), 'Bartender', 'Prepares and serves alcoholic and non-alcoholic beverages.'),
    ((SELECT id FROM service_industries WHERE name = 'Catering & Food Services'), 'Event Server', 'Handles guest food and beverage service.'),

    -- Event Planning & Management Roles
    ((SELECT id FROM service_industries WHERE name = 'Event Planning & Management'), 'Event Coordinator', 'Manages event logistics and execution.'),
    ((SELECT id FROM service_industries WHERE name = 'Event Planning & Management'), 'Event Designer', 'Responsible for event theme, décor, and styling.'),
    ((SELECT id FROM service_industries WHERE name = 'Event Planning & Management'), 'Event Producer', 'Oversees event execution from start to finish.'),

    -- Photography & Videography Roles
    ((SELECT id FROM service_industries WHERE name = 'Photography & Videography'), 'Lead Photographer', 'Main photographer responsible for capturing key moments.'),
    ((SELECT id FROM service_industries WHERE name = 'Photography & Videography'), 'Assistant Photographer', 'Provides support to the lead photographer.'),
    ((SELECT id FROM service_industries WHERE name = 'Photography & Videography'), 'Videographer', 'Records and edits video footage.'),

    -- Entertainment & Performances Roles
    ((SELECT id FROM service_industries WHERE name = 'Entertainment & Performances'), 'DJ', 'Provides music and entertainment for events.'),
    ((SELECT id FROM service_industries WHERE name = 'Entertainment & Performances'), 'Live Performer', 'Performs live acts such as singing, dancing, or magic.'),
    ((SELECT id FROM service_industries WHERE name = 'Entertainment & Performances'), 'Sound Engineer', 'Manages sound quality and technical aspects.'),

    -- Floral & Event Decor Roles
    ((SELECT id FROM service_industries WHERE name = 'Floral & Event Decor'), 'Floral Designer', 'Creates floral arrangements for events.'),
    ((SELECT id FROM service_industries WHERE name = 'Floral & Event Decor'), 'Event Decorator', 'Handles event theme setup and decorations.'),

    -- Event Logistics & Operations Roles
    ((SELECT id FROM service_industries WHERE name = 'Event Logistics & Operations'), 'Event Security Guard', 'Ensures security and crowd control at events.'),
    ((SELECT id FROM service_industries WHERE name = 'Event Logistics & Operations'), 'Transportation Coordinator', 'Manages guest and vendor transportation logistics.'),
    ((SELECT id FROM service_industries WHERE name = 'Event Logistics & Operations'), 'Event Setup Crew', 'Responsible for assembling event equipment and furniture.'),

    -- Technology & AV Solutions Roles
    ((SELECT id FROM service_industries WHERE name = 'Technology & AV Solutions'), 'AV Technician', 'Manages audiovisual equipment setup and operation.'),
    ((SELECT id FROM service_industries WHERE name = 'Technology & AV Solutions'), 'Lighting Designer', 'Designs and controls event lighting effects.'),

    -- Beauty & Personal Care Roles
    ((SELECT id FROM service_industries WHERE name = 'Beauty & Personal Care'), 'Makeup Artist', 'Provides makeup services for events.'),
    ((SELECT id FROM service_industries WHERE name = 'Beauty & Personal Care'), 'Hair Stylist', 'Provides hairstyling services for events.'),

    -- Event Merchandise & Gifts Roles
    ((SELECT id FROM service_industries WHERE name = 'Event Merchandise & Gifts'), 'Engraving Specialist', 'Handles custom engraving and personalization.'),
    ((SELECT id FROM service_industries WHERE name = 'Event Merchandise & Gifts'), 'Print Designer', 'Designs custom event invitations and merchandise.'),

    -- Corporate & Business Events Roles
    ((SELECT id FROM service_industries WHERE name = 'Corporate & Business Events'), 'Event Marketing Manager', 'Handles promotions and marketing for events.'),
    ((SELECT id FROM service_industries WHERE name = 'Corporate & Business Events'), 'Business Consultant', 'Provides business advisory services for corporate events.'),

    -- Other / Specialty Services Roles
    ((SELECT id FROM service_industries WHERE name = 'Other / Specialty Services'), 'Wedding Officiant', 'Officiates wedding ceremonies.'),
    ((SELECT id FROM service_industries WHERE name = 'Other / Specialty Services'), 'Luxury Concierge', 'Manages luxury event arrangements.');