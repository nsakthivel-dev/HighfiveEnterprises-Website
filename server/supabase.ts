import 'dotenv/config';
import { createClient } from "@supabase/supabase-js";

// Handle missing environment variables more gracefully
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Only throw error in production environment
if (process.env.NODE_ENV === 'production' && (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE)) {
  console.warn("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars - using fallback for development");
}

// Use fallback values for development if needed
const supabaseUrl = SUPABASE_URL || "https://your-project.supabase.co";
const supabaseKey = SUPABASE_SERVICE_ROLE || "your-service-role-key-placeholder";

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

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