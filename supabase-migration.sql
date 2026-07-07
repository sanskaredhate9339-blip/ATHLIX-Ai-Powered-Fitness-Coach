-- Supabase Migration Script for Athlix
-- Project ID: ovogoacobyvhhtmoppun
-- This script adds user_id columns and sets up RLS policies for user data isolation

-- Enable RLS on all tables
ALTER TABLE foods ENABLE ROW LEVEL SECURITY;
ALTER TABLE weights ENABLE ROW LEVEL SECURITY;
ALTER TABLE habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE habit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_history ENABLE ROW LEVEL SECURITY;

-- Add user_id column to foods table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'foods' AND column_name = 'user_id'
    ) THEN
        ALTER TABLE foods ADD COLUMN user_id TEXT;
    END IF;
END $$;

-- Add user_id column to weights table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'weights' AND column_name = 'user_id'
    ) THEN
        ALTER TABLE weights ADD COLUMN user_id TEXT;
    END IF;
END $$;

-- Add user_id column to habits table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'habits' AND column_name = 'user_id'
    ) THEN
        ALTER TABLE habits ADD COLUMN user_id TEXT;
    END IF;
END $$;

-- Add user_id column to habit_logs table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'habit_logs' AND column_name = 'user_id'
    ) THEN
        ALTER TABLE habit_logs ADD COLUMN user_id TEXT;
    END IF;
END $$;

-- Add user_id column to workouts table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'workouts' AND column_name = 'user_id'
    ) THEN
        ALTER TABLE workouts ADD COLUMN user_id TEXT;
    END IF;
END $$;

-- Add user_id column to chat_history table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'chat_history' AND column_name = 'user_id'
    ) THEN
        ALTER TABLE chat_history ADD COLUMN user_id TEXT;
    END IF;
END $$;

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
    FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update own foods" ON foods
    FOR UPDATE USING (auth.uid()::text = user_id);

CREATE POLICY "Users can delete own foods" ON foods
    FOR DELETE USING (auth.uid()::text = user_id);

-- Create RLS policies for weights table
CREATE POLICY "Users can view own weights" ON weights
    FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert own weights" ON weights
    FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update own weights" ON weights
    FOR UPDATE USING (auth.uid()::text = user_id);

CREATE POLICY "Users can delete own weights" ON weights
    FOR DELETE USING (auth.uid()::text = user_id);

-- Create RLS policies for habits table
CREATE POLICY "Users can view own habits" ON habits
    FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert own habits" ON habits
    FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update own habits" ON habits
    FOR UPDATE USING (auth.uid()::text = user_id);

CREATE POLICY "Users can delete own habits" ON habits
    FOR DELETE USING (auth.uid()::text = user_id);

-- Create RLS policies for habit_logs table
CREATE POLICY "Users can view own habit_logs" ON habit_logs
    FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert own habit_logs" ON habit_logs
    FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update own habit_logs" ON habit_logs
    FOR UPDATE USING (auth.uid()::text = user_id);

CREATE POLICY "Users can delete own habit_logs" ON habit_logs
    FOR DELETE USING (auth.uid()::text = user_id);

-- Create RLS policies for workouts table
CREATE POLICY "Users can view own workouts" ON workouts
    FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert own workouts" ON workouts
    FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update own workouts" ON workouts
    FOR UPDATE USING (auth.uid()::text = user_id);

CREATE POLICY "Users can delete own workouts" ON workouts
    FOR DELETE USING (auth.uid()::text = user_id);

-- Create RLS policies for chat_history table
CREATE POLICY "Users can view own chat_history" ON chat_history
    FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert own chat_history" ON chat_history
    FOR INSERT WITH CHECK (auth.uid()::text = user_id);

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
