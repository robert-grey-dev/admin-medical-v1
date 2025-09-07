-- Adjust profiles RLS to match new requirements
-- 1) Replace policy that allowed admins & moderators to update users
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'profiles' AND policyname = 'Admins can update regular users only'
  ) THEN
    EXECUTE 'DROP POLICY "Admins can update regular users only" ON public.profiles';
  END IF;
END$$;

-- Preserve moderators' ability to update regular users
CREATE POLICY IF NOT EXISTS "Moderators can update regular users only"
ON public.profiles
FOR UPDATE
USING (get_user_role(auth.uid()) = 'moderator'::user_role AND role = 'user'::user_role)
WITH CHECK (get_user_role(auth.uid()) = 'moderator'::user_role AND role = 'user'::user_role);

-- Admins can update moderators only (no updates to admins or users)
CREATE POLICY IF NOT EXISTS "Admins can update moderators only"
ON public.profiles
FOR UPDATE
USING (get_user_role(auth.uid()) = 'admin'::user_role AND role = 'moderator'::user_role)
WITH CHECK (get_user_role(auth.uid()) = 'admin'::user_role AND role = 'moderator'::user_role);

-- 2) Allow admins to delete moderators only
CREATE POLICY IF NOT EXISTS "Admins can delete moderators"
ON public.profiles
FOR DELETE
USING (get_user_role(auth.uid()) = 'admin'::user_role AND role = 'moderator'::user_role);
