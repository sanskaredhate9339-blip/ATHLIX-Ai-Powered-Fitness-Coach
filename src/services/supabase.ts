import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const isSupabaseConfigured = supabaseUrl !== '' && supabaseAnonKey !== ''

if (!isSupabaseConfigured) {
  console.warn(
    'Athlix: Supabase credentials (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY) are not set. ' +
    'The application is running in Local Mode, utilizing LocalStorage for persistence and AI mock services.'
  );
}

export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null
