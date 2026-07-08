-- Fix Users Table Schema Migration
-- This script updates the users table to use UUID instead of TEXT for compatibility with Supabase auth

-- Drop existing users table if it exists (to recreate with correct schema)
DROP TABLE IF EXISTS users CASCADE;

-- Create users table with proper UUID fields
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email TEXT,
  name TEXT NOT NULL,
  age NUMERIC NOT NULL,
  gender TEXT NOT NULL,
  height NUMERIC NOT NULL,
  weight NUMERIC NOT NULL,
  goal TEXT NOT NULL,
  experience_level TEXT NOT NULL,
  available_equipment TEXT[] NOT NULL,
  workout_days_preference NUMERIC NOT NULL,
  preferred_session_duration NUMERIC NOT NULL,
  unit_preference TEXT NOT NULL,
  notification_preferences JSONB NOT NULL,
  avatar_url TEXT,
  activity_level TEXT,
  workout_settings JSONB,
  ai_settings JSONB,
  acknowledged_warnings TEXT[],
  onboarded BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own users" ON users;
DROP POLICY IF EXISTS "Users can insert own users" ON users;
DROP POLICY IF EXISTS "Users can update own users" ON users;
DROP POLICY IF EXISTS "Users can delete own users" ON users;

-- Create RLS policies for users table
CREATE POLICY "Users can view own users" 
ON users 
FOR SELECT 
USING (auth.uid()::text = id::text);

CREATE POLICY "Users can insert own users" 
ON users 
FOR INSERT 
WITH CHECK (auth.uid()::text = id::text);

CREATE POLICY "Users can update own users" 
ON users 
FOR UPDATE 
USING (auth.uid()::text = id::text);

CREATE POLICY "Users can delete own users" 
ON users 
FOR DELETE 
USING (auth.uid()::text = id::text);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_users_id ON users(id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Grant necessary permissions
GRANT ALL ON users TO authenticated;
GRANT ALL ON users TO anon;
