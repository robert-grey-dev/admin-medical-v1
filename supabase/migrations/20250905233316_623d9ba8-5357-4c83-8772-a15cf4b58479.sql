-- Fix RLS on profiles and add bootstrap admin RPC
-- 1) Drop problematic recursive policy
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

-- 2) Allow users to create their own profile (without IF NOT EXISTS)
DROP POLICY IF EXISTS "Users can create their own profile" ON public.profiles;
CREATE POLICY "Users can create their own profile"
ON public.profiles
FOR INSERT
WITH CHECK (auth.uid() = id);

-- 3) Create a SECURITY DEFINER function to promote the first authenticated user to admin
CREATE OR REPLACE FUNCTION public.bootstrap_first_admin(_full_name text DEFAULT NULL)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uid uuid := auth.uid();
  admin_exists boolean;
BEGIN
  IF uid IS NULL THEN
    RAISE EXCEPTION 'not authenticated';
  END IF;

  -- If any admin/moderator already exists, block promotion
  SELECT EXISTS (
    SELECT 1 FROM public.profiles WHERE role IN ('admin','moderator')
  ) INTO admin_exists;

  IF admin_exists THEN
    RAISE EXCEPTION 'admin or moderator already exists';
  END IF;

  -- Promote current user to admin and update name if provided
  UPDATE public.profiles
     SET role = 'admin',
         full_name = COALESCE(_full_name, full_name),
         updated_at = now()
   WHERE id = uid;
END;
$$;

-- 4) Allow the bootstrap function to be called by any authenticated user
GRANT EXECUTE ON FUNCTION public.bootstrap_first_admin TO authenticated;