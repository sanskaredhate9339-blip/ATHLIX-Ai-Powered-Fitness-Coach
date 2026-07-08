-- Supabase Migration Script for Athlix
-- Project ID: ovogoacobyvhhtmoppun
-- This script creates tables, adds user_id columns, and sets up RLS policies for user data isolation

-- Create users table if it doesn't exist
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
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
    onboarded BOOLEAN DEFAULT FALSE,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

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
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE foods ENABLE ROW LEVEL SECURITY;
ALTER TABLE weights ENABLE ROW LEVEL SECURITY;
ALTER TABLE habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE habit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_history ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own users" ON users;
DROP POLICY IF EXISTS "Users can insert own users" ON users;
DROP POLICY IF EXISTS "Users can update own users" ON users;
DROP POLICY IF EXISTS "Users can delete own users" ON users;

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

-- Create RLS policies for users table
CREATE POLICY "Users can view own users" ON users
    FOR SELECT USING (auth.uid()::text = id);

CREATE POLICY "Users can insert own users" ON users
    FOR INSERT WITH CHECK (auth.uid()::text = id);

CREATE POLICY "Users can update own users" ON users
    FOR UPDATE USING (auth.uid()::text = id);

CREATE POLICY "Users can delete own users" ON users
    FOR DELETE USING (auth.uid()::text = id);

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
CREATE INDEX IF NOT EXISTS idx_users_id ON users(id);
CREATE INDEX IF NOT EXISTS idx_foods_user_id ON foods(user_id);
CREATE INDEX IF NOT EXISTS idx_weights_user_id ON weights(user_id);
CREATE INDEX IF NOT EXISTS idx_habits_user_id ON habits(user_id);
CREATE INDEX IF NOT EXISTS idx_habit_logs_user_id ON habit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_workouts_user_id ON workouts(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_history_user_id ON chat_history(user_id);

-- Add missing columns to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS activity_level TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS workout_settings JSONB;
ALTER TABLE users ADD COLUMN IF NOT EXISTS ai_settings JSONB;
ALTER TABLE users ADD COLUMN IF NOT EXISTS acknowledged_warnings TEXT[];

-- Create notifications table if it doesn't exist
CREATE TABLE IF NOT EXISTS notifications (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    read BOOLEAN DEFAULT FALSE
);

-- Create calories_predictions table if it doesn't exist
CREATE TABLE IF NOT EXISTS calories_predictions (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    age NUMERIC NOT NULL,
    gender TEXT NOT NULL,
    height NUMERIC NOT NULL,
    weight NUMERIC NOT NULL,
    bmi NUMERIC NOT NULL,
    workout_type TEXT NOT NULL,
    workout_duration NUMERIC NOT NULL,
    steps NUMERIC NOT NULL,
    heart_rate NUMERIC NOT NULL,
    calories_consumed NUMERIC NOT NULL,
    calories_burned NUMERIC NOT NULL,
    confidence NUMERIC NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE calories_predictions ENABLE ROW LEVEL SECURITY;

-- Notifications RLS Policies
DROP POLICY IF EXISTS "Users can view own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can insert own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can update own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can delete own notifications" ON notifications;

CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (auth.uid()::text = user_id);
CREATE POLICY "Users can insert own notifications" ON notifications FOR INSERT WITH CHECK (auth.uid()::text = user_id OR user_id IS NULL);
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (auth.uid()::text = user_id);
CREATE POLICY "Users can delete own notifications" ON notifications FOR DELETE USING (auth.uid()::text = user_id);

-- Calories Predictions RLS Policies
DROP POLICY IF EXISTS "Users can view own predictions" ON calories_predictions;
DROP POLICY IF EXISTS "Users can insert own predictions" ON calories_predictions;
DROP POLICY IF EXISTS "Users can update own predictions" ON calories_predictions;
DROP POLICY IF EXISTS "Users can delete own predictions" ON calories_predictions;

CREATE POLICY "Users can view own predictions" ON calories_predictions FOR SELECT USING (auth.uid()::text = user_id);
CREATE POLICY "Users can insert own predictions" ON calories_predictions FOR INSERT WITH CHECK (auth.uid()::text = user_id OR user_id IS NULL);
CREATE POLICY "Users can update own predictions" ON calories_predictions FOR UPDATE USING (auth.uid()::text = user_id);
CREATE POLICY "Users can delete own predictions" ON calories_predictions FOR DELETE USING (auth.uid()::text = user_id);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_predictions_user_id ON calories_predictions(user_id);

