import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

// Validate environment variables
if (!supabaseUrl) {
  throw new Error('Missing VITE_SUPABASE_URL environment variable')
}

if (!supabaseAnonKey) {
  throw new Error('Missing VITE_SUPABASE_ANON_KEY environment variable')
}

// Validate URL format - should NOT contain /rest/v1 or /auth/v1
if (supabaseUrl.includes('/rest/v1') || supabaseUrl.includes('/auth/v1')) {
  throw new Error(
    'VITE_SUPABASE_URL format is incorrect. It should be: https://PROJECT_REF.supabase.co\n' +
    'Do NOT include /rest/v1 or /auth/v1 in the URL.\n' +
    `Current value: ${supabaseUrl}`
  )
}

export const isSupabaseConfigured = supabaseUrl !== '' && supabaseAnonKey !== ''

// Log environment variables in development (masked)
if (import.meta.env.DEV) {
  console.log('[Supabase] Configuration')
  console.log('[Supabase] URL:', supabaseUrl)
  console.log('[Supabase] Anon Key:', supabaseAnonKey.slice(0, 8) + '...' + supabaseAnonKey.slice(-4))
  console.log('[Supabase] Storage: Using localStorage (Safari ITP compatible)')
}

if (!isSupabaseConfigured) {
  console.warn(
    'Athlix: Supabase credentials (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY) are not set. ' +
    'The application is running in Local Mode, utilizing LocalStorage for persistence and AI mock services.'
  );
}

// Configure Supabase client for Safari ITP compatibility
// Using localStorage explicitly to avoid Safari's Intelligent Tracking Prevention
// which can clear cookies/sessionStorage but preserves localStorage
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        storage: window.localStorage,
        storageKey: 'athlix-supabase-auth',
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        flowType: 'pkce', // Use PKCE flow for better mobile/Safari compatibility
      }
    })
  : null
