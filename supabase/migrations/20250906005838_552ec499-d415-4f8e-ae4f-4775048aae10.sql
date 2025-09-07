-- Step 2: Add status column for user suspension and update policies
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS status text DEFAULT 'active' CHECK (status IN ('active', 'suspended'));

-- Update get_user_role function to return text
DROP FUNCTION IF EXISTS public.get_user_role(uuid);
CREATE OR REPLACE FUNCTION public.get_user_role(user_id uuid)
RETURNS text
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role::text FROM public.profiles WHERE id = user_id;
$$;

-- Drop existing policies
DROP POLICY IF EXISTS "Admins can update any profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

-- Create new policies with owner-specific permissions
CREATE POLICY "Owners and admins can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (get_user_role(auth.uid()) IN ('owner', 'admin', 'moderator'));

CREATE POLICY "Only owners can update any profile" 
ON public.profiles 
FOR UPDATE 
USING (get_user_role(auth.uid()) = 'owner')
WITH CHECK (get_user_role(auth.uid()) = 'owner');

-- Allow admins to update only regular users (not other admins/owners)
CREATE POLICY "Admins can update regular users only" 
ON public.profiles 
FOR UPDATE 
USING (
  get_user_role(auth.uid()) IN ('admin', 'moderator')
  AND role = 'user'
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