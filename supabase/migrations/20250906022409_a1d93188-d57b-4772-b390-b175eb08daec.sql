-- Create trigger to insert into profiles when a new auth user is created
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();