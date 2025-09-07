-- Fix recursive/insufficient RLS on profiles and add bootstrap admin RPC
-- 1) Drop problematic recursive policy (if exists)
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

-- 2) Allow users to create their own profile (safe, no recursion)
-- Drop first if exists
DROP POLICY IF EXISTS "Users can create their own profile" ON public.profiles;
CREATE POLICY "Users can create their own profile"
ON public.profiles
FOR INSERT
WITH CHECK (auth.uid() = id);

-- 3) Ensure profiles are auto-created on new auth user signup
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created'
  ) THEN
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
  END IF;
END $$;

-- 4) Create a SECURITY DEFINER function to promote the first authenticated user to admin
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