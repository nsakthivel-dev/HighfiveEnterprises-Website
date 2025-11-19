import 'dotenv/config';
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL as string;
const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE as string;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE) {
  throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE env vars");
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE, {
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
