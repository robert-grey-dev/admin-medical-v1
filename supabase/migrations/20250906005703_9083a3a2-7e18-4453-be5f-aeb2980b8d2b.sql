-- Add 'owner' role to the user_role enum
ALTER TYPE user_role ADD VALUE 'owner';

-- Update RLS policies for profiles table to include owner permissions
DROP POLICY IF EXISTS "Admins can update any profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

-- Create new policies with owner-specific permissions
CREATE POLICY "Owners and admins can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (get_user_role(auth.uid()) = ANY (ARRAY['owner'::user_role, 'admin'::user_role, 'moderator'::user_role]));

CREATE POLICY "Only owners can update any profile" 
ON public.profiles 
FOR UPDATE 
USING (get_user_role(auth.uid()) = 'owner'::user_role)
WITH CHECK (get_user_role(auth.uid()) = 'owner'::user_role);

-- Allow admins to update only non-admin profiles (not other admins/owners)
CREATE POLICY "Admins can update regular users only" 
ON public.profiles 
FOR UPDATE 
USING (
  get_user_role(auth.uid()) = ANY (ARRAY['admin'::user_role, 'moderator'::user_role])
  AND role = 'user'::user_role
);

-- Create function to check if user is owner
CREATE OR REPLACE FUNCTION public.is_owner(user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role = 'owner' FROM public.profiles WHERE id = user_id;
$$;