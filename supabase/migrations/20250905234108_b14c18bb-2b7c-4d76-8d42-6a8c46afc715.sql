-- Remove insecure self-promotion function and empower admins to manage profiles
-- 1) Drop the bootstrap function (public self-promotion)
DROP FUNCTION IF EXISTS public.bootstrap_first_admin(text);

-- 2) Allow admins/moderators to view and update any profile
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update any profile" ON public.profiles;

CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
USING (get_user_role(auth.uid()) IN ('admin','moderator'));

CREATE POLICY "Admins can update any profile"
ON public.profiles
FOR UPDATE
USING (get_user_role(auth.uid()) IN ('admin','moderator'))
WITH CHECK (get_user_role(auth.uid()) IN ('admin','moderator'));
