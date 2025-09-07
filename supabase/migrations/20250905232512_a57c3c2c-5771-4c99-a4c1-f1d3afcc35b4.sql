-- Create a test administrator account
-- First, let's insert a user directly into auth.users (this is for demo purposes)
-- In production, users should be created through the signup process

-- Insert test admin user into profiles table
INSERT INTO public.profiles (id, email, full_name, role)
VALUES (
  gen_random_uuid(),
  'admin@medical.com', 
  'System Administrator', 
  'admin'
)
ON CONFLICT (email) DO UPDATE SET 
  role = 'admin',
  full_name = 'System Administrator';

-- Let's also create a moderator for testing
INSERT INTO public.profiles (id, email, full_name, role)
VALUES (
  gen_random_uuid(),
  'moderator@medical.com', 
  'Content Moderator', 
  'moderator'
)
ON CONFLICT (email) DO UPDATE SET 
  role = 'moderator',
  full_name = 'Content Moderator';