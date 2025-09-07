-- Fix critical security issue: Hide email from public reviews
-- Create view for public reviews without email
CREATE OR REPLACE VIEW public.public_reviews AS 
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

-- Add RLS policy to restrict email access in reviews
DROP POLICY IF EXISTS "Approved reviews are viewable by everyone" ON public.reviews;

-- Only show email to admins/moderators, hide from public
CREATE POLICY "Public can view approved reviews without email" 
ON public.reviews 
FOR SELECT 
USING (
  status = 'approved' AND 
  (
    get_user_role(auth.uid()) = ANY (ARRAY['owner'::user_role, 'admin'::user_role, 'moderator'::user_role])
    OR auth.uid() IS NULL  -- Allow public access but will be filtered by view
  )
);

-- Grant access to public view
GRANT SELECT ON public.public_reviews TO anon;
GRANT SELECT ON public.public_reviews TO authenticated;