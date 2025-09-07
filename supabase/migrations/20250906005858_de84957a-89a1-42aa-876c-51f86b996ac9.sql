-- Add status column for user suspension
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS status text DEFAULT 'active' CHECK (status IN ('active', 'suspended'));

-- Drop existing policies that depend on the function
DROP POLICY IF EXISTS "Admins can view all reviews" ON public.reviews;
DROP POLICY IF EXISTS "Admins can update review status" ON public.reviews;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update any profile" ON public.profiles;

-- Update the get_user_role function to handle the new owner role
CREATE OR REPLACE FUNCTION public.get_user_role(user_id uuid)
RETURNS user_role
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.profiles WHERE id = user_id;
$$;

-- Recreate policies with new permission structure
CREATE POLICY "Owners and admins can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (get_user_role(auth.uid()) = ANY (ARRAY['owner'::user_role, 'admin'::user_role, 'moderator'::user_role]));

CREATE POLICY "Only owners can update any profile" 
ON public.profiles 
FOR UPDATE 
USING (get_user_role(auth.uid()) = 'owner'::user_role)
WITH CHECK (get_user_role(auth.uid()) = 'owner'::user_role);

-- Allow admins to update only regular users (not other admins/owners)
CREATE POLICY "Admins can update regular users only" 
ON public.profiles 
FOR UPDATE 
USING (
  get_user_role(auth.uid()) = ANY (ARRAY['admin'::user_role, 'moderator'::user_role])
  AND role = 'user'::user_role
);

-- Recreate review policies
CREATE POLICY "Admins can view all reviews" 
ON public.reviews 
FOR SELECT 
USING ((get_user_role(auth.uid()) = ANY (ARRAY['owner'::user_role, 'admin'::user_role, 'moderator'::user_role])) OR (status = 'approved'::review_status));

CREATE POLICY "Admins can update review status" 
ON public.reviews 
FOR UPDATE 
USING (get_user_role(auth.uid()) = ANY (ARRAY['owner'::user_role, 'admin'::user_role, 'moderator'::user_role]));

-- Create function to check if user is owner
CREATE OR REPLACE FUNCTION public.is_owner(user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role = 'owner' FROM public.profiles WHERE id = user_id;
$$;