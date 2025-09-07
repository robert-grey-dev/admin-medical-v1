-- Add DELETE policy for owners to delete users
CREATE POLICY "Owners can delete any profile" 
ON public.profiles 
FOR DELETE 
USING (get_user_role(auth.uid()) = 'owner');