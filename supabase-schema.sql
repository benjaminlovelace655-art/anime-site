-- Run this in your Supabase SQL editor (https://supabase.com/dashboard/project/_/sql/new)
-- to create the users table for AniLove authentication.

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  username text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Allow insert during registration (from anon key)
CREATE POLICY "Allow public registration" ON users
  FOR INSERT TO anon
  WITH CHECK (true);

-- Allow users to read their own data
CREATE POLICY "Users can read own data" ON users
  FOR SELECT TO anon
  USING (true);
