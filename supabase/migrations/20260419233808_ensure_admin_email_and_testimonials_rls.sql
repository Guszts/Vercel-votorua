/*
  # Ensure admin email and testimonials admin management

  1. Ensures gustavomonteiro09g@gmail.com is always promoted to admin
     - Updates the handle_new_user trigger to use this email
     - If the profile already exists, updates role to admin

  2. Adds admin delete policy for testimonials (already exists but ensuring it's correct)
     - Admins can delete any testimonial
     - Users can delete their own testimonials

  Notes:
  - Safe to run multiple times (idempotent)
  - Does not drop any existing data
*/

-- Re-create the trigger function with the correct admin email
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  is_bootstrap_admin boolean := new.email = 'gustavomonteiro09g@gmail.com';
BEGIN
  INSERT INTO public.profiles (id, email, full_name, nickname, username, avatar_url, role)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    split_part(new.email, '@', 1),
    new.raw_user_meta_data->>'avatar_url',
    CASE WHEN is_bootstrap_admin THEN 'admin'::public.app_role ELSE 'user'::public.app_role END
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    role = CASE
      WHEN public.profiles.role = 'admin' OR is_bootstrap_admin THEN 'admin'::public.app_role
      ELSE public.profiles.role
    END;
  RETURN new;
END; $$;

-- If the admin profile already exists, ensure it has admin role
DO $$
BEGIN
  UPDATE public.profiles
  SET role = 'admin'
  WHERE email = 'gustavomonteiro09g@gmail.com'
    AND role != 'admin';
EXCEPTION WHEN undefined_table THEN
  NULL;
END $$;

-- Ensure testimonials admin delete policy exists
DO $$
BEGIN
  DROP POLICY IF EXISTS "testimonials admin delete" ON public.testimonials;
  CREATE POLICY "testimonials admin delete" ON public.testimonials FOR DELETE
    TO authenticated USING (public.is_admin(auth.uid()) OR auth.uid() = user_id);
EXCEPTION WHEN undefined_table THEN
  NULL;
END $$;

-- Ensure admin can also update testimonials (e.g. reply/moderate)
DO $$
BEGIN
  DROP POLICY IF EXISTS "testimonials admin update" ON public.testimonials;
  CREATE POLICY "testimonials admin update" ON public.testimonials FOR UPDATE
    TO authenticated
    USING (public.is_admin(auth.uid()))
    WITH CHECK (public.is_admin(auth.uid()));
EXCEPTION WHEN undefined_table THEN
  NULL;
END $$;
