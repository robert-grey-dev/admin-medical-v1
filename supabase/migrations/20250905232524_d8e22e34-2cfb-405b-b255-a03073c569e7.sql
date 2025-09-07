-- Create test admin users directly in profiles table
-- Since we can't create auth users via SQL, we'll create profile entries
-- that can be matched when users sign up

INSERT INTO public.profiles (id, email, full_name, role)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'admin@medical.com', 'System Administrator', 'admin'),
  ('00000000-0000-0000-0000-000000000002', 'moderator@medical.com', 'Content Moderator', 'moderator');