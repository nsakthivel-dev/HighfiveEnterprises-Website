-- Fix RLS policies for all tables to allow public read access
-- This ensures the application can load data properly

-- ============================================
-- FEEDBACK TABLE
-- ============================================

-- Create feedback table if it doesn't exist
CREATE TABLE IF NOT EXISTS feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT DEFAULT 'Anonymous',
  email TEXT,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  message TEXT NOT NULL CHECK (length(trim(message)) >= 10),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add columns explicitly to ensure they exist
ALTER TABLE feedback ADD COLUMN IF NOT EXISTS project_id UUID;
ALTER TABLE feedback ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT true;

-- Add foreign key constraint if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'feedback_project_id_fkey' 
    AND table_name = 'feedback'
  ) THEN
    ALTER TABLE feedback 
    ADD CONSTRAINT feedback_project_id_fkey 
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Disable RLS on feedback (allow public access)
ALTER TABLE feedback DISABLE ROW LEVEL SECURITY;

-- Or if you want to keep RLS enabled, use permissive policies:
-- ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;
-- DROP POLICY IF EXISTS "Public read access" ON feedback;
-- CREATE POLICY "Public read access" ON feedback FOR SELECT USING (true);
-- DROP POLICY IF EXISTS "Public insert access" ON feedback;
-- CREATE POLICY "Public insert access" ON feedback FOR INSERT WITH CHECK (true);

-- ============================================
-- TEAM MEMBERS TABLE
-- ============================================

-- Disable RLS to allow public read access
ALTER TABLE IF EXISTS team_members DISABLE ROW LEVEL SECURITY;

-- ============================================
-- PROJECTS TABLE
-- ============================================

-- Disable RLS to allow public read access
ALTER TABLE IF EXISTS projects DISABLE ROW LEVEL SECURITY;

-- ============================================
-- NETWORK TABLES
-- ============================================

-- Disable RLS on network tables
ALTER TABLE IF EXISTS network_collaborations DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS network_partners DISABLE ROW LEVEL SECURITY;

-- ============================================
-- OTHER TABLES
-- ============================================

-- Disable RLS on other public tables
ALTER TABLE IF EXISTS services DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS packages DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS events DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS activity DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS applications DISABLE ROW LEVEL SECURITY;

-- ============================================
-- VERIFICATION
-- ============================================

-- Check RLS status for all tables
SELECT 
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;

-- Test queries to verify data can be accessed
SELECT 'team_members' as table_name, COUNT(*) as record_count FROM team_members
UNION ALL
SELECT 'projects', COUNT(*) FROM projects
UNION ALL
SELECT 'feedback', COUNT(*) FROM feedback
UNION ALL
SELECT 'services', COUNT(*) FROM services
UNION ALL
SELECT 'events', COUNT(*) FROM events;
