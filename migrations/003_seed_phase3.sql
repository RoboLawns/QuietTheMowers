-- Seed: Phase 3 - testimonials and measurements

-- Approved testimonials
INSERT OR IGNORE INTO testimonials (id, user_id, title, body_markdown, display_name, location_city, location_state, mower_brand, status, featured, created_at, approved_at)
VALUES (
  't_seed_1',
  'u_seed_supporter',
  'I Finally Heard the Birds Again',
  'I switched to an EGO mower last spring after years of dealing with a noisy gas mower. The first Saturday after the switch, I was out mowing at 8 AM and actually heard birds singing while I worked. My neighbor texted me to ask if I had hired a lawn service because it was so quiet. Now three other houses on our street have switched too.

The best part? No more gas cans in the garage. No more pull cords. No more smelling like exhaust when I come inside. Just pop in a battery and go.',
  'Sarah K.',
  'Boulder', 'CO',
  'EGO',
  'approved', 1,
  datetime('now', '-30 days'),
  datetime('now', '-30 days')
);

INSERT OR IGNORE INTO testimonials (id, user_id, title, body_markdown, display_name, location_city, location_state, mower_brand, status, featured, created_at, approved_at)
VALUES (
  't_seed_2',
  'u_seed_supporter',
  'From Complaining to Organizing',
  'For two years I complained about the gas leaf blowers in my neighborhood. Every Tuesday and Thursday, the landscaping crews would come through and for 4 hours it sounded like a racetrack outside my window.

Then I found Quiet The Mowers and realized I could actually do something about it. I started a petition, got 47 signatures from my block, and presented it at our HOA meeting last month. The board voted to require electric-only equipment starting next year.

I went from being the neighbor who complains to the neighbor who changed the rules. If I can do it, anyone can.',
  'Mike R.',
  'Austin', 'TX',
  'Greenworks',
  'approved', 1,
  datetime('now', '-20 days'),
  datetime('now', '-20 days')
);

INSERT OR IGNORE INTO testimonials (id, user_id, title, body_markdown, display_name, location_city, location_state, mower_brand, status, featured, created_at, approved_at)
VALUES (
  't_seed_3',
  null,
  'Quiet Mornings Are Worth Fighting For',
  'I never thought I would care this much about lawn equipment. But then I had a baby, and suddenly 7 AM leaf blowers were not just annoying — they were ruining nap schedules and making my newborn cry.

I found this community through a friend. Reading other stories made me realize I was not alone and not crazy for wanting quiet mornings. The measurement protocol helped me document the actual noise levels. The petition template got me started. And the council meeting guide helped me prepare.

We have not won yet. But we have 300 signatures and a council date. And I finally feel like change is possible.',
  'Anonymous',
  'Portland', 'OR',
  null,
  'approved', 0,
  datetime('now', '-10 days'),
  datetime('now', '-10 days')
);

-- Pending testimonial
INSERT OR IGNORE INTO testimonials (id, user_id, title, body_markdown, display_name, location_city, location_state, mower_brand, status, created_at)
VALUES (
  't_seed_4',
  'u_seed_organizer',
  'Testing the waters',
  'Just submitted my first noise measurements. Curious to see how this works.',
  'David C.',
  'Denver', 'CO',
  'Milwaukee',
  'pending',
  datetime('now', '-1 days')
);

-- Seed measurements
INSERT OR IGNORE INTO measurements (id, user_id, campaign_id, device_type, device_model, measurement_date, measurement_time, lat, lng, zip, peak_db, average_db, duration_seconds, source_description, privacy, created_at)
VALUES (
  'm_seed_1',
  'u_seed_supporter',
  'c_berkeley_blowers',
  'rental', 'Reed R8050',
  '2026-04-10', '08:15',
  37.8715, -122.2730, '94704',
  94.2, 85.6, 1800,
  'Commercial leaf blower crew on Elm Street',
  'public',
  datetime('now', '-15 days')
);

INSERT OR IGNORE INTO measurements (id, user_id, campaign_id, device_type, device_model, measurement_date, measurement_time, lat, lng, zip, peak_db, average_db, duration_seconds, source_description, privacy, created_at)
VALUES (
  'm_seed_2',
  'u_seed_supporter',
  'c_berkeley_blowers',
  'rental', 'Reed R8050',
  '2026-04-12', '09:30',
  37.8720, -122.2740, '94704',
  89.7, 78.3, 2400,
  'Neighbor gas mower, two houses down',
  'anonymous',
  datetime('now', '-13 days')
);

INSERT OR IGNORE INTO measurements (id, user_id, device_type, device_model, measurement_date, measurement_time, lat, lng, zip, peak_db, average_db, duration_seconds, source_description, privacy, created_at)
VALUES (
  'm_seed_3',
  'u_seed_organizer',
  'smartphone', 'NIOSH SLM',
  '2026-04-20', '07:45',
  37.8710, -122.2720, '94704',
  98.5, 91.2, 3600,
  'Multiple gas blowers from landscaping company',
  'public',
  datetime('now', '-5 days')
);

-- Seed devices
INSERT OR IGNORE INTO devices (id, serial_number, model, calibration_date, status, created_at)
VALUES ('d_seed_1', 'R8050-001', 'Reed R8050', '2026-01-15', 'available', datetime('now'));

INSERT OR IGNORE INTO devices (id, serial_number, model, calibration_date, status, created_at)
VALUES ('d_seed_2', 'R8050-002', 'Reed R8050', '2026-01-15', 'available', datetime('now'));

INSERT OR IGNORE INTO devices (id, serial_number, model, calibration_date, status, created_at)
VALUES ('d_seed_3', 'R8050-003', 'Reed R8050', '2026-01-15', 'available', datetime('now'));

INSERT OR IGNORE INTO devices (id, serial_number, model, calibration_date, status, created_at)
VALUES ('d_seed_4', 'EX407730-001', 'Extech 407730', '2026-02-01', 'rented', datetime('now'));

INSERT OR IGNORE INTO devices (id, serial_number, model, calibration_date, status, created_at)
VALUES ('d_seed_5', 'EX407730-002', 'Extech 407730', '2026-02-01', 'available', datetime('now'));
