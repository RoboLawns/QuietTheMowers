-- Migration: Phase 6 - email verification + R2 references

-- Email verification tokens
CREATE TABLE IF NOT EXISTS verification_tokens (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  signature_id TEXT REFERENCES signatures(id),
  token TEXT UNIQUE NOT NULL,
  type TEXT NOT NULL DEFAULT 'signature' CHECK(type IN ('signature', 'email_change')),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  expires_at TEXT NOT NULL,
  verified_at TEXT
);
CREATE INDEX IF NOT EXISTS idx_verification_tokens_token ON verification_tokens(token);
CREATE INDEX IF NOT EXISTS idx_verification_tokens_email ON verification_tokens(email);

-- Add username to users (URL slug for /u/[username])
ALTER TABLE users ADD COLUMN username TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_username ON users(username) WHERE username IS NOT NULL;
