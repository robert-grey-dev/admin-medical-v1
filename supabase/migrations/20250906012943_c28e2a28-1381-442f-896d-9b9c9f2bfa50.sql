-- Promote specific user to Owner
update public.profiles
set role = 'owner', updated_at = now()
where email = 'cadisgrey@gmail.com';