import 'dotenv/config';
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Handle missing environment variables more gracefully
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Log environment status for debugging
console.log('Supabase Environment Check:');
console.log('- SUPABASE_URL:', SUPABASE_URL ? 'SET' : 'MISSING');
console.log('- SUPABASE_SERVICE_ROLE_KEY:', SUPABASE_SERVICE_ROLE ? 'SET' : 'MISSING');
console.log('- NODE_ENV:', process.env.NODE_ENV);

// Use fallback values for development if needed
const supabaseUrl = SUPABASE_URL || "https://your-project.supabase.co";
const supabaseKey = SUPABASE_SERVICE_ROLE || "your-service-role-key-placeholder";

// Create a client that can handle invalid credentials gracefully
let supabase: SupabaseClient;

try {
  supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
  console.log('Supabase client created successfully');
} catch (error) {
  console.error('Failed to create Supabase client:', error);
  // Create a mock client for development
  supabase = {
    from: (table: string) => ({
      select: () => ({ data: [], error: null }),
      insert: () => ({ data: null, error: null }),
      update: () => ({ data: null, error: null }),
      delete: () => ({ data: null, error: null }),
      eq: () => ({ data: null, error: null }),
      order: () => ({ data: [], error: null }),
      limit: () => ({ data: [], error: null }),
      single: () => ({ data: null, error: null }),
    }),
    storage: {
      from: (bucket: string) => ({
        upload: () => ({ data: null, error: null }),
        getPublicUrl: () => ({ data: { publicUrl: '' }, error: null }),
      }),
    },
  } as unknown as SupabaseClient;
}

export { supabase };

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  avatar_url?: string | null;
  bio?: string | null;
  email?: string | null;
  linkedin?: string | null;
  status?: string | null;
  created_at?: string;
};

export type Project = {
  id: string;
  title: string;
  description?: string | null;
  image_url?: string | null;
  status?: string | null;
  url?: string | null;
  created_at?: string;
};