import { createClient } from '@supabase/supabase-js'

// Handle missing environment variables more gracefully
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key-placeholder'

// Only show warning in development
if (import.meta.env.DEV && (!supabaseUrl || !supabaseKey)) {
  console.warn('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY environment variables')
}

// Create client with fallback values to prevent app crash
export const supabase = createClient(supabaseUrl, supabaseKey)