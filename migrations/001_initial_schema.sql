-- Migration: 001_initial_schema
-- Creates core tables for QuietTheMowers v1

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  auth_provider_id TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  location_city TEXT,
  location_state TEXT,
  location_zip TEXT,
  bio TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK(role IN ('user', 'organizer', 'admin')),
  email_subscribed INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS campaigns (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  organizer_id TEXT NOT NULL REFERENCES users(id),
  title TEXT NOT NULL,
  template_type TEXT NOT NULL DEFAULT 'custom' CHECK(template_type IN ('hours_restriction', 'gas_blower_ban', 'hoa_rules', 'custom')),
  target_jurisdiction TEXT NOT NULL DEFAULT 'city' CHECK(target_jurisdiction IN ('city', 'hoa', 'county', 'state')),
  target_name TEXT,
  location_city TEXT,
  location_state TEXT,
  location_lat REAL,
  location_lng REAL,
  story_markdown TEXT,
  goal_signatures INTEGER NOT NULL DEFAULT 100,
  goal_deadline TEXT,
  hero_image_url TEXT,
  hero_video_url TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('draft', 'active', 'won', 'closed')),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX idx_campaigns_status ON campaigns(status);
CREATE INDEX idx_campaigns_state ON campaigns(location_state);
CREATE INDEX idx_campaigns_organizer ON campaigns(organizer_id);

CREATE TABLE IF NOT EXISTS signatures (
  id TEXT PRIMARY KEY,
  campaign_id TEXT NOT NULL REFERENCES campaigns(id),
  user_id TEXT REFERENCES users(id),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  zip TEXT,
  comment TEXT,
  display_publicly INTEGER NOT NULL DEFAULT 1,
  verified_at TEXT,
  ip_hash TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE UNIQUE INDEX idx_signatures_email_campaign ON signatures(email, campaign_id);
CREATE INDEX idx_signatures_campaign ON signatures(campaign_id);

CREATE TABLE IF NOT EXISTS comments (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  parent_type TEXT NOT NULL CHECK(parent_type IN ('campaign', 'testimonial', 'comment')),
  parent_id TEXT NOT NULL,
  body TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'visible' CHECK(status IN ('visible', 'flagged', 'removed')),
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX idx_comments_parent ON comments(parent_type, parent_id);

CREATE TABLE IF NOT EXISTS updates (
  id TEXT PRIMARY KEY,
  campaign_id TEXT NOT NULL REFERENCES campaigns(id),
  author_id TEXT NOT NULL REFERENCES users(id),
  title TEXT NOT NULL,
  body_markdown TEXT NOT NULL,
  send_email INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX idx_updates_campaign ON updates(campaign_id);

CREATE TABLE IF NOT EXISTS measurements (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  campaign_id TEXT REFERENCES campaigns(id),
  device_type TEXT NOT NULL DEFAULT 'other' CHECK(device_type IN ('rental', 'owned', 'smartphone', 'other')),
  device_model TEXT,
  measurement_date TEXT NOT NULL,
  measurement_time TEXT,
  lat REAL,
  lng REAL,
  zip TEXT,
  peak_db REAL NOT NULL,
  average_db REAL,
  duration_seconds INTEGER,
  source_description TEXT,
  audio_clip_url TEXT,
  photo_url TEXT,
  privacy TEXT NOT NULL DEFAULT 'public' CHECK(privacy IN ('public', 'anonymous', 'private')),
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS testimonials (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id),
  title TEXT NOT NULL,
  body_markdown TEXT NOT NULL,
  photo_url TEXT,
  location_city TEXT,
  location_state TEXT,
  display_name TEXT NOT NULL,
  mower_brand TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'approved', 'rejected')),
  featured INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  approved_at TEXT
);
CREATE INDEX idx_testimonials_status ON testimonials(status);
CREATE INDEX idx_testimonials_state ON testimonials(location_state);
CREATE INDEX idx_testimonials_featured ON testimonials(featured);

CREATE TABLE IF NOT EXISTS devices (
  id TEXT PRIMARY KEY,
  serial_number TEXT UNIQUE NOT NULL,
  model TEXT,
  calibration_date TEXT,
  status TEXT NOT NULL DEFAULT 'available' CHECK(status IN ('available', 'rented', 'maintenance', 'retired')),
  current_holder_id TEXT REFERENCES users(id),
  expected_return TEXT,
  notes TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS rental_requests (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  device_id TEXT REFERENCES devices(id),
  requested_start TEXT,
  requested_end TEXT,
  shipping_address TEXT,
  intended_use TEXT,
  campaign_id TEXT REFERENCES campaigns(id),
  stripe_payment_id TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'approved', 'shipped', 'returned', 'cancelled')),
  tracking_out TEXT,
  tracking_back TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS ordinances (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  jurisdiction_name TEXT NOT NULL,
  jurisdiction_type TEXT NOT NULL CHECK(jurisdiction_type IN ('city', 'county', 'state', 'hoa')),
  ordinance_type TEXT NOT NULL CHECK(ordinance_type IN ('gas_blower_ban', 'hours_restriction', 'noise_limit', 'other')),
  effective_date TEXT,
  full_text_markdown TEXT,
  source_url TEXT,
  summary TEXT,
  state TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS shares (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id),
  content_type TEXT NOT NULL,
  content_id TEXT NOT NULL,
  platform TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
