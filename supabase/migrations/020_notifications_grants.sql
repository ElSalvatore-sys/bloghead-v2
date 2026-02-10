-- Fix: Grant table permissions on notifications to authenticated and anon roles
-- PostgREST requires explicit GRANT for API access

GRANT SELECT, INSERT, UPDATE, DELETE ON public.notifications TO authenticated;
GRANT SELECT ON public.notifications TO anon;
