-- Migration: 012_profile_trigger_role
-- Description: Update profile trigger to use role from user metadata

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_role profile_role;
BEGIN
  -- Get role from metadata, default to USER if not provided
  user_role := COALESCE(
    (NEW.raw_user_meta_data->>'role')::profile_role,
    'USER'::profile_role
  );

  INSERT INTO public.profiles (id, email, first_name, last_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    user_role
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
