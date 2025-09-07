-- Ensure RLS is enabled
alter table public.doctors enable row level security;

-- Drop existing policies that allow moderators to manage doctors
drop policy if exists "Admins and moderators can insert doctors" on public.doctors;
drop policy if exists "Admins and moderators can update doctors" on public.doctors;
drop policy if exists "Admins and moderators can delete doctors" on public.doctors;

-- Create new policies allowing only owners and admins to manage doctors
create policy "Owners and admins can insert doctors"
  on public.doctors
  for insert
  to authenticated
  with check (public.get_user_role(auth.uid()) in ('owner','admin'));

create policy "Owners and admins can update doctors"
  on public.doctors
  for update
  to authenticated
  using (public.get_user_role(auth.uid()) in ('owner','admin'))
  with check (public.get_user_role(auth.uid()) in ('owner','admin'));

create policy "Owners and admins can delete doctors"
  on public.doctors
  for delete
  to authenticated
  using (public.get_user_role(auth.uid()) in ('owner','admin'));
