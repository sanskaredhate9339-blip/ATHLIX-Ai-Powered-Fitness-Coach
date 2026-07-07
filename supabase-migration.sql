-- Supabase Migration Script for Athlix
-- Project ID: ovogoacobyvhhtmoppun
-- This script creates tables, adds user_id columns, and sets up RLS policies for user data isolation

-- Create foods table if it doesn't exist
CREATE TABLE IF NOT EXISTS foods (
    id TEXT PRIMARY KEY,
    food_name TEXT NOT NULL,
    calories NUMERIC NOT NULL,
    protein NUMERIC,
    carbs NUMERIC,
    fat NUMERIC,
    meal_type TEXT NOT NULL,
    date TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    user_id TEXT
);

-- Create weights table if it doesn't exist
CREATE TABLE IF NOT EXISTS weights (
    id TEXT PRIMARY KEY,
    weight NUMERIC NOT NULL,
    fat NUMERIC,
    date TEXT NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    user_id TEXT
);

-- Create habits table if it doesn't exist
CREATE TABLE IF NOT EXISTS habits (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    icon TEXT NOT NULL,
    is_custom BOOLEAN DEFAULT FALSE,
    frequency TEXT DEFAULT 'daily',
    user_id TEXT
);

-- Create habit_logs table if it doesn't exist
CREATE TABLE IF NOT EXISTS habit_logs (
    id TEXT PRIMARY KEY,
    habit_id TEXT NOT NULL,
    date TEXT NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    user_id TEXT
);

-- Create workouts table if it doesn't exist
CREATE TABLE IF NOT EXISTS workouts (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    goal TEXT NOT NULL,
    split_type TEXT NOT NULL,
    days_per_week NUMERIC NOT NULL,
    duration NUMERIC NOT NULL,
    equipment TEXT[] NOT NULL,
    experience TEXT NOT NULL,
    medical_conditions TEXT,
    days JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    user_id TEXT
);

-- Create chat_history table if it doesn't exist
CREATE TABLE IF NOT EXISTS chat_history (
    id TEXT PRIMARY KEY,
    sender TEXT NOT NULL,
    text TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    user_id TEXT
);

-- Enable RLS on all tables
ALTER TABLE foods ENABLE ROW LEVEL SECURITY;
ALTER TABLE weights ENABLE ROW LEVEL SECURITY;
ALTER TABLE habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE habit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_history ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own foods" ON foods;
DROP POLICY IF EXISTS "Users can insert own foods" ON foods;
DROP POLICY IF EXISTS "Users can update own foods" ON foods;
DROP POLICY IF EXISTS "Users can delete own foods" ON foods;

DROP POLICY IF EXISTS "Users can view own weights" ON weights;
DROP POLICY IF EXISTS "Users can insert own weights" ON weights;
DROP POLICY IF EXISTS "Users can update own weights" ON weights;
DROP POLICY IF EXISTS "Users can delete own weights" ON weights;

DROP POLICY IF EXISTS "Users can view own habits" ON habits;
DROP POLICY IF EXISTS "Users can insert own habits" ON habits;
DROP POLICY IF EXISTS "Users can update own habits" ON habits;
DROP POLICY IF EXISTS "Users can delete own habits" ON habits;

DROP POLICY IF EXISTS "Users can view own habit_logs" ON habit_logs;
DROP POLICY IF EXISTS "Users can insert own habit_logs" ON habit_logs;
DROP POLICY IF EXISTS "Users can update own habit_logs" ON habit_logs;
DROP POLICY IF EXISTS "Users can delete own habit_logs" ON habit_logs;

DROP POLICY IF EXISTS "Users can view own workouts" ON workouts;
DROP POLICY IF EXISTS "Users can insert own workouts" ON workouts;
DROP POLICY IF EXISTS "Users can update own workouts" ON workouts;
DROP POLICY IF EXISTS "Users can delete own workouts" ON workouts;

DROP POLICY IF EXISTS "Users can view own chat_history" ON chat_history;
DROP POLICY IF EXISTS "Users can insert own chat_history" ON chat_history;
DROP POLICY IF EXISTS "Users can update own chat_history" ON chat_history;
DROP POLICY IF EXISTS "Users can delete own chat_history" ON chat_history;

-- Create RLS policies for foods table
CREATE POLICY "Users can view own foods" ON foods
    FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert own foods" ON foods
    FOR INSERT WITH CHECK (auth.uid()::text = user_id OR user_id IS NULL);

CREATE POLICY "Users can update own foods" ON foods
    FOR UPDATE USING (auth.uid()::text = user_id);

CREATE POLICY "Users can delete own foods" ON foods
    FOR DELETE USING (auth.uid()::text = user_id);

-- Create RLS policies for weights table
CREATE POLICY "Users can view own weights" ON weights
    FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert own weights" ON weights
    FOR INSERT WITH CHECK (auth.uid()::text = user_id OR user_id IS NULL);

CREATE POLICY "Users can update own weights" ON weights
    FOR UPDATE USING (auth.uid()::text = user_id);

CREATE POLICY "Users can delete own weights" ON weights
    FOR DELETE USING (auth.uid()::text = user_id);

-- Create RLS policies for habits table
CREATE POLICY "Users can view own habits" ON habits
    FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert own habits" ON habits
    FOR INSERT WITH CHECK (auth.uid()::text = user_id OR user_id IS NULL);

CREATE POLICY "Users can update own habits" ON habits
    FOR UPDATE USING (auth.uid()::text = user_id);

CREATE POLICY "Users can delete own habits" ON habits
    FOR DELETE USING (auth.uid()::text = user_id);

-- Create RLS policies for habit_logs table
CREATE POLICY "Users can view own habit_logs" ON habit_logs
    FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert own habit_logs" ON habit_logs
    FOR INSERT WITH CHECK (auth.uid()::text = user_id OR user_id IS NULL);

CREATE POLICY "Users can update own habit_logs" ON habit_logs
    FOR UPDATE USING (auth.uid()::text = user_id);

CREATE POLICY "Users can delete own habit_logs" ON habit_logs
    FOR DELETE USING (auth.uid()::text = user_id);

-- Create RLS policies for workouts table
CREATE POLICY "Users can view own workouts" ON workouts
    FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert own workouts" ON workouts
    FOR INSERT WITH CHECK (auth.uid()::text = user_id OR user_id IS NULL);

CREATE POLICY "Users can update own workouts" ON workouts
    FOR UPDATE USING (auth.uid()::text = user_id);

CREATE POLICY "Users can delete own workouts" ON workouts
    FOR DELETE USING (auth.uid()::text = user_id);

-- Create RLS policies for chat_history table
CREATE POLICY "Users can view own chat_history" ON chat_history
    FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert own chat_history" ON chat_history
    FOR INSERT WITH CHECK (auth.uid()::text = user_id OR user_id IS NULL);

CREATE POLICY "Users can update own chat_history" ON chat_history
    FOR UPDATE USING (auth.uid()::text = user_id);

CREATE POLICY "Users can delete own chat_history" ON chat_history
    FOR DELETE USING (auth.uid()::text = user_id);

-- Add index on user_id columns for better performance
CREATE INDEX IF NOT EXISTS idx_foods_user_id ON foods(user_id);
CREATE INDEX IF NOT EXISTS idx_weights_user_id ON weights(user_id);
CREATE INDEX IF NOT EXISTS idx_habits_user_id ON habits(user_id);
CREATE INDEX IF NOT EXISTS idx_habit_logs_user_id ON habit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_workouts_user_id ON workouts(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_history_user_id ON chat_history(user_id);
