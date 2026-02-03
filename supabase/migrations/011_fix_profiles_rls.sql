-- Migration: 011_fix_profiles_rls
-- Description: Fix infinite recursion in profiles RLS policies
-- The admin policy was checking profiles table which caused recursion

-- Drop the problematic policies
DROP POLICY IF EXISTS profiles_admin_all ON profiles;
DROP POLICY IF EXISTS profiles_select_own ON profiles;
DROP POLICY IF EXISTS profiles_select_public ON profiles;
DROP POLICY IF EXISTS profiles_update_own ON profiles;

-- Recreate SELECT policy: Users can read their own profile
CREATE POLICY profiles_select_own ON profiles
  FOR SELECT
  TO authenticated
  USING (id = auth.uid());

-- Recreate SELECT policy: Anyone can read basic public profile info (for search/discovery)
-- This allows unauthenticated users to see profiles too
CREATE POLICY profiles_select_public ON profiles
  FOR SELECT
  TO anon, authenticated
  USING (deleted_at IS NULL);

-- Users can only update their own profile
-- Admin operations should use service role key
CREATE POLICY profiles_update_own ON profiles
  FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- INSERT policy for the trigger (when new user signs up)
-- The handle_new_user trigger runs as SECURITY DEFINER so this may not be needed
-- but adding it for completeness
DROP POLICY IF EXISTS profiles_insert_own ON profiles;
CREATE POLICY profiles_insert_own ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (id = auth.uid());
