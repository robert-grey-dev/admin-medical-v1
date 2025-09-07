-- Adjust profiles RLS to match new requirements
-- 1) Drop and recreate policies for admins/moderators updating users

-- Drop existing policy for admins updating users
DROP POLICY IF EXISTS "Admins can update regular users only" ON public.profiles;

-- Create new policies: moderators can update users, admins can only update moderators
CREATE POLICY "Moderators can update regular users only"
ON public.profiles
FOR UPDATE
USING (get_user_role(auth.uid()) = 'moderator'::user_role AND role = 'user'::user_role)
WITH CHECK (get_user_role(auth.uid()) = 'moderator'::user_role AND role = 'user'::user_role);

CREATE POLICY "Admins can update moderators only"
ON public.profiles
FOR UPDATE
USING (get_user_role(auth.uid()) = 'admin'::user_role AND role = 'moderator'::user_role)
WITH CHECK (get_user_role(auth.uid()) = 'admin'::user_role AND role = 'moderator'::user_role);

-- 2) Allow admins to delete moderators only (in addition to owners deleting anyone)
CREATE POLICY "Admins can delete moderators"
ON public.profiles
FOR DELETE
USING (get_user_role(auth.uid()) = 'admin'::user_role AND role = 'moderator'::user_role);