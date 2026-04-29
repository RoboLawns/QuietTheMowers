-- Seed: development campaigns and users
-- Insert a seed organizer
INSERT OR IGNORE INTO users (id, auth_provider_id, email, display_name, role, location_city, location_state, bio, created_at, updated_at)
VALUES ('u_seed_organizer', 'clerk_dev_organizer_1', 'maria@example.com', 'Maria T.', 'organizer', 'Berkeley', 'CA', 'Mother of two, neighborhood organizer. Started the Berkeley gas blower ban campaign.', datetime('now'), datetime('now'));

INSERT OR IGNORE INTO users (id, auth_provider_id, email, display_name, role, location_city, location_state, bio, created_at, updated_at)
VALUES ('u_seed_supporter', 'clerk_dev_supporter_1', 'sarah@example.com', 'Sarah K.', 'user', 'Boulder', 'CO', 'Switched to electric and never looked back.', datetime('now'), datetime('now'));

INSERT OR IGNORE INTO users (id, auth_provider_id, email, display_name, role, location_city, location_state, bio, created_at, updated_at)
VALUES ('u_seed_admin', 'clerk_dev_admin_1', 'admin@example.com', 'Admin', 'admin', NULL, NULL, 'Platform administrator', datetime('now'), datetime('now'));

-- Seed campaigns
INSERT OR IGNORE INTO campaigns (id, slug, organizer_id, title, template_type, target_jurisdiction, target_name, location_city, location_state, location_lat, location_lng, story_markdown, goal_signatures, goal_deadline, status, created_at, updated_at)
VALUES (
  'c_berkeley_blowers',
  'berkeley-ban-gas-leaf-blowers',
  'u_seed_organizer',
  'Ban Gas Leaf Blowers in Berkeley',
  'gas_blower_ban',
  'city',
  'Berkeley City Council',
  'Berkeley', 'CA',
  37.8715, -122.2730,
  '## The Problem

Every weekday morning, gas-powered leaf blowers disrupt our neighborhood from 7 AM onward. The noise levels exceed 85 dB at the property line, and the two-stroke emissions are harming our air quality.

## What We Want

A phased ban on gas-powered leaf blowers within Berkeley city limits, with a rebate program for residents and commercial landscapers to switch to electric equipment.

## Why It Matters

- Health: Our children, elderly neighbors, and night-shift workers deserve quiet
- Environment: Two-stroke engines are among the dirtiest combustion engines still in widespread use
- It''s been done: Washington DC, Palo Alto, and Montclair have all passed similar ordinances

## The Data

We''ve collected over 50 noise measurements across 4 weekends. Average peak: 92 dB at the property line. Baseline neighborhood noise without equipment: 42 dB.',
  500,
  '2026-09-01',
  'active',
  datetime('now'),
  datetime('now')
);

INSERT OR IGNORE INTO campaigns (id, slug, organizer_id, title, template_type, target_jurisdiction, target_name, location_city, location_state, location_lat, location_lng, story_markdown, goal_signatures, goal_deadline, status, created_at, updated_at)
VALUES (
  'c_boulder_hoa',
  'boulder-hoa-electric-only',
  'u_seed_organizer',
  'Electric-Only Lawn Equipment for Pineview HOA',
  'hoa_rules',
  'hoa',
  'Pineview HOA',
  'Boulder', 'CO',
  40.0150, -105.2705,
  '## The Problem

Our HOA currently has no restrictions on lawn equipment. Multiple gas mowers and blowers operate simultaneously on weekends, making it impossible to enjoy our outdoor spaces.

## What We Want

An HOA bylaw amendment requiring electric-only lawn equipment for all residential properties and landscaping services operating within Pineview.

## Why Now

Electric equipment has reached performance parity with gas for residential use. The cost difference has narrowed significantly. And 8 of 10 neighbors we surveyed support the change.

## Next Steps

We''re presenting at the next HOA board meeting on June 15. We need 200 signatures to show community support.',
  200,
  '2026-06-15',
  'active',
  datetime('now'),
  datetime('now')
);

INSERT OR IGNORE INTO campaigns (id, slug, organizer_id, title, template_type, target_jurisdiction, target_name, location_city, location_state, location_lat, location_lng, story_markdown, goal_signatures, goal_deadline, status, created_at, updated_at)
VALUES (
  'c_pdx_hours',
  'portland-restrict-gas-equipment-hours',
  'u_seed_organizer',
  'Restrict Gas Equipment Hours in Portland',
  'hours_restriction',
  'city',
  'Portland City Council',
  'Portland', 'OR',
  45.5152, -122.6784,
  '## The Problem

Gas-powered lawn equipment operates at all hours in our neighborhoods, often starting before 7 AM on weekdays and running throughout weekend mornings.

## What We Want

An ordinance restricting gas-powered lawn equipment to 9 AM - 5 PM on weekdays and 10 AM - 4 PM on weekends, with a noise limit of 65 dB at property lines.

## The Data

We have documented 150+ instances of early-morning equipment noise across 6 neighborhoods. The average start time was 7:15 AM, well before Portland''s existing general noise ordinance allows.

## Our Coalition

We have support from the Portland Clean Air Coalition, three neighborhood associations, and two city council members who have agreed to sponsor the ordinance.',
  1000,
  '2026-11-01',
  'active',
  datetime('now'),
  datetime('now')
);

INSERT OR IGNORE INTO campaigns (id, slug, organizer_id, title, template_type, target_jurisdiction, target_name, location_city, location_state, location_lat, location_lng, story_markdown, goal_signatures, status, created_at, updated_at)
VALUES (
  'c_denver_mowers',
  'denver-gas-mower-trade-in',
  'u_seed_organizer',
  'Denver Gas Mower Trade-In Program',
  'custom',
  'city',
  'Denver City Council',
  'Denver', 'CO',
  39.7392, -104.9903,
  '## The Problem

Many Denver residents want to switch to electric lawn equipment but cite the upfront cost as the barrier. A municipal trade-in program would accelerate the transition.

## What We Want

A city-funded rebate program: $100 for trading in a gas mower, $50 for a gas trimmer or blower. Partner with local retailers for bulk discounts.

## The Model

Portland, OR already has this program. We can adapt their ordinance language. Estimated cost to the city for 1,000 rebates: $100,000 - less than one mile of road repaving.

## Status

We''re in the signature-gathering phase. Next step: present to the City Council Sustainability Committee.',
  300,
  'active',
  datetime('now'),
  datetime('now')
);

INSERT OR IGNORE INTO campaigns (id, slug, organizer_id, title, template_type, target_jurisdiction, target_name, location_city, location_state, location_lat, location_lng, story_markdown, goal_signatures, status, created_at, updated_at)
VALUES (
  'c_austin_won',
  'austin-neighborhood-quiet-zones',
  'u_seed_organizer',
  'Austin Neighborhood Quiet Zones',
  'hours_restriction',
  'city',
  'Austin City Council',
  'Austin', 'TX',
  30.2672, -97.7431,
  '## We Won!

On March 15, 2026, the Austin City Council voted 7-2 to establish neighborhood quiet zones with restricted gas equipment hours. This campaign is now closed after a successful outcome.

## What Passed

- Gas-powered lawn equipment restricted to 9 AM - 6 PM weekdays, 10 AM - 4 PM weekends
- 70 dB noise limit at property lines
- Rebate program for electric equipment trade-ins
- Enforcement via 311 complaints

## Thank You

To the 847 Austin residents who signed, the 12 organizers who knocked on doors, and the council members who listened. This win belongs to all of you.',
  500,
  'won',
  datetime('now'),
  datetime('now')
);

-- Seed signatures
INSERT OR IGNORE INTO signatures (id, campaign_id, name, email, zip, comment, display_publicly, created_at)
VALUES ('sig_1', 'c_berkeley_blowers', 'David C.', 'david@example.com', '94704', 'I can hear leaf blowers from 3 houses away. This is long overdue.', 1, datetime('now'));

INSERT OR IGNORE INTO signatures (id, campaign_id, name, email, zip, comment, display_publicly, created_at)
VALUES ('sig_2', 'c_berkeley_blowers', 'Jennifer L.', 'jennifer@example.com', '94703', 'My baby cant nap with this noise. Please act.', 1, datetime('now'));

INSERT OR IGNORE INTO signatures (id, campaign_id, name, email, zip, comment, display_publicly, created_at)
VALUES ('sig_3', 'c_berkeley_blowers', 'Sarah K.', 'sarah@example.com', '80303', 'I visit my parents in Berkeley often. The difference in noise compared to Boulder is stark.', 1, datetime('now'));

INSERT OR IGNORE INTO signatures (id, campaign_id, name, email, zip, comment, display_publicly, created_at)
VALUES ('sig_4', 'c_boulder_hoa', 'Mike R.', 'mike@example.com', '80301', 'Our entire block supports this. Lets make it happen.', 1, datetime('now'));

INSERT OR IGNORE INTO signatures (id, campaign_id, name, email, zip, comment, display_publicly, created_at)
VALUES ('sig_5', 'c_pdx_hours', 'Emma W.', 'emma@example.com', '97201', 'I work nights and sleep during the day. This would change my life.', 1, datetime('now'));

-- Seed updates
INSERT OR IGNORE INTO updates (id, campaign_id, author_id, title, body_markdown, send_email, created_at)
VALUES ('upd_1', 'c_berkeley_blowers', 'u_seed_organizer', 'We hit 100 signatures!', 'Amazing milestone - we reached 100 signatures in just two weeks. The council has taken notice and we''ve been added to the agenda for the July 15 meeting. Keep sharing!', 1, datetime('now'));

INSERT OR IGNORE INTO updates (id, campaign_id, author_id, title, body_markdown, send_email, created_at)
VALUES ('upd_2', 'c_berkeley_blowers', 'u_seed_organizer', 'Council meeting scheduled', 'We''re on the agenda for July 15 at 7 PM. If you can attend in person, please do. I''ll be sharing talking points and a speaker card template later this week.', 1, datetime('now'));

-- Seed comments
INSERT OR IGNORE INTO comments (id, user_id, parent_type, parent_id, body, status, created_at)
VALUES ('cmt_1', 'u_seed_supporter', 'campaign', 'c_berkeley_blowers', 'This is fantastic! I switched to an EGO mower last year and its been great. Happy to help with the campaign.', 'visible', datetime('now'));

INSERT OR IGNORE INTO comments (id, user_id, parent_type, parent_id, body, status, created_at)
VALUES ('cmt_2', 'u_seed_supporter', 'campaign', 'c_berkeley_blowers', 'Has anyone looked at what DC did? They had a really smooth phase-in that could work here too.', 'visible', datetime('now'));
