-- ============================
-- EVENT TYPES TABLE
-- ============================
CREATE TABLE event_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    category VARCHAR(100) NOT NULL,
    description TEXT DEFAULT NULL
);

-- Create an index for faster searches
CREATE INDEX idx_event_types_category ON event_types (category);

-- ============================
-- INSERT EVENT TYPES
-- ============================
INSERT INTO event_types (name, category, description)
VALUES
    -- Personal & Social Events
    ('Wedding', 'Personal & Social Events', 'Marriage ceremony and celebration.'),
    ('Engagement Party', 'Personal & Social Events', 'Celebration of a couple’s engagement.'),
    ('Bridal Shower', 'Personal & Social Events', 'Pre-wedding party for the bride.'),
    ('Baby Shower', 'Personal & Social Events', 'Celebration of an upcoming baby birth.'),
    ('Birthday Party', 'Personal & Social Events', 'Celebration of an individual’s birthday.'),
    ('Anniversary Celebration', 'Personal & Social Events', 'Marking a significant milestone in a relationship.'),
    ('Family Reunion', 'Personal & Social Events', 'Gathering of extended family members.'),
    ('Graduation Party', 'Personal & Social Events', 'Celebration of academic achievement.'),
    ('Housewarming Party', 'Personal & Social Events', 'Party to celebrate a new home.'),
    ('Retirement Party', 'Personal & Social Events', 'Celebration of a person’s retirement.'),
    ('Celebration of Life / Memorial Service', 'Personal & Social Events', 'Gathering to honor a deceased loved one.'),
    ('Reunion Event', 'Personal & Social Events', 'School, military, or other group reunions.'),

    -- Corporate & Business Events
    ('Conference', 'Corporate & Business Events', 'Professional gathering with speakers and networking.'),
    ('Seminar', 'Corporate & Business Events', 'Educational and professional learning session.'),
    ('Workshop', 'Corporate & Business Events', 'Hands-on training or learning experience.'),
    ('Product Launch', 'Corporate & Business Events', 'Introduction of a new product to the market.'),
    ('Trade Show', 'Corporate & Business Events', 'Industry-specific exhibition and networking event.'),
    ('Networking Event', 'Corporate & Business Events', 'Professional networking and collaboration event.'),
    ('Business Dinner', 'Corporate & Business Events', 'Formal dinner for corporate networking.'),
    ('Annual General Meeting (AGM)', 'Corporate & Business Events', 'Official meeting for company stakeholders.'),
    ('Company Retreat', 'Corporate & Business Events', 'Team-building and strategy planning event.'),
    ('Press Conference', 'Corporate & Business Events', 'Media event for announcements.'),
    ('Award Ceremony', 'Corporate & Business Events', 'Recognition and awards presentation event.'),
    ('Fundraiser / Charity Gala', 'Corporate & Business Events', 'Event to raise funds for charitable causes.'),

    -- Community & Cultural Events
    ('Festival', 'Community & Cultural Events', 'Large-scale community celebration.'),
    ('Carnival', 'Community & Cultural Events', 'Public entertainment event with performances.'),
    ('Parade', 'Community & Cultural Events', 'Organized public procession.'),
    ('Cultural Celebration', 'Community & Cultural Events', 'Traditional or heritage-based event.'),
    ('Religious Gathering', 'Community & Cultural Events', 'Faith-based community event.'),
    ('Charity Event', 'Community & Cultural Events', 'Fundraising or community service event.'),
    ('Public Awareness Campaign', 'Community & Cultural Events', 'Education and advocacy-focused gathering.'),
    ('Political Rally', 'Community & Cultural Events', 'Event for political campaigning or activism.'),

    -- Entertainment & Recreational Events
    ('Concert', 'Entertainment & Recreational Events', 'Live musical performance.'),
    ('Theater Performance', 'Entertainment & Recreational Events', 'Live stage acting and performances.'),
    ('Movie Premiere', 'Entertainment & Recreational Events', 'Debut screening of a new film.'),
    ('Comedy Show', 'Entertainment & Recreational Events', 'Stand-up comedy performance.'),
    ('Sporting Event', 'Entertainment & Recreational Events', 'Competitive sports match or game.'),
    ('Gaming Tournament', 'Entertainment & Recreational Events', 'Esports and video game competitions.'),
    ('Art Exhibition', 'Entertainment & Recreational Events', 'Public display of artworks.'),
    ('Fashion Show', 'Entertainment & Recreational Events', 'Showcasing new fashion collections.'),
    ('Food & Wine Tasting', 'Entertainment & Recreational Events', 'Sampling of gourmet foods and wines.'),

    -- Educational & Training Events
    ('Lecture', 'Educational & Training Events', 'Formal presentation on a specific topic.'),
    ('Training Session', 'Educational & Training Events', 'Professional skill-building workshop.'),
    ('Panel Discussion', 'Educational & Training Events', 'Experts discussing a focused topic.'),
    ('Bootcamp', 'Educational & Training Events', 'Intensive training program.'),
    ('Certification Course', 'Educational & Training Events', 'Course for obtaining professional certification.'),
    ('Academic Conference', 'Educational & Training Events', 'Scholarly research presentation event.'),
    ('Scholarship Awards Night', 'Educational & Training Events', 'Recognition of scholarship recipients.'),

    -- Private & Exclusive Events
    ('VIP Party', 'Private & Exclusive Events', 'Private event for elite guests.'),
    ('Private Dinner', 'Private & Exclusive Events', 'Exclusive gathering with a formal dinner.'),
    ('Yacht Party', 'Private & Exclusive Events', 'Private event held on a yacht.'),
    ('Luxury Retreat', 'Private & Exclusive Events', 'High-end getaway for relaxation and networking.'),
    ('Exclusive Launch Party', 'Private & Exclusive Events', 'High-profile private event for product releases.');
