-- Fix the security definer view issue by recreating without SECURITY DEFINER
DROP VIEW IF EXISTS public.public_reviews;

-- Create a simple view without SECURITY DEFINER 
CREATE VIEW public.public_reviews AS 
SELECT 
  id,
  doctor_id,
  patient_name,
  rating,
  review_text,
  status,
  created_at
FROM public.reviews 
WHERE status = 'approved';

-- Revoke previous grants and set proper permissions
REVOKE ALL ON public.public_reviews FROM anon;
REVOKE ALL ON public.public_reviews FROM authenticated;

-- Grant proper SELECT permissions
GRANT SELECT ON public.public_reviews TO anon;
GRANT SELECT ON public.public_reviews TO authenticated;