-- Promote specified email to admin role in profiles
-- This will insert the profile if missing and set role='admin'
insert into public.profiles (id, email, full_name, role)
select 
  u.id,
  u.email,
  coalesce(u.raw_user_meta_data->>'full_name', split_part(u.email,'@',1)) as full_name,
  'admin'::user_role
from auth.users u
where u.email = 'cadisgrey@gmail.com'
on conflict (id) do update set role = 'admin'::user_role, updated_at = now();