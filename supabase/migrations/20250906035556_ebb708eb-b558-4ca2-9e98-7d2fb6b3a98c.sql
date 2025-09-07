-- Fix admin permissions: allow admins to update users and moderators, but not other admins

-- Drop the restrictive policy that only allowed admins to update moderators
DROP POLICY IF EXISTS "Admins can update moderators only" ON public.profiles;

-- Create new policy: admins can update users and moderators (but not other admins)
CREATE POLICY "Admins can update users and moderators"
ON public.profiles
FOR UPDATE
USING (get_user_role(auth.uid()) = 'admin'::user_role AND role IN ('user'::user_role, 'moderator'::user_role))
WITH CHECK (get_user_role(auth.uid()) = 'admin'::user_role AND role IN ('user'::user_role, 'moderator'::user_role));