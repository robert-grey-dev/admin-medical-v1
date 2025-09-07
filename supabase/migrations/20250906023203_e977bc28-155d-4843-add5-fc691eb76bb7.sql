-- Allow owners to insert profiles for newly created users
CREATE POLICY "Owners can insert any profile"
ON public.profiles
FOR INSERT
WITH CHECK (get_user_role(auth.uid()) = 'owner');