-- Fix security definer view for public_reviews
ALTER VIEW public.public_reviews SET (security_invoker = true, security_barrier = true);

-- Ensure proper permissions on the view
REVOKE ALL ON public.public_reviews FROM PUBLIC;
GRANT SELECT ON public.public_reviews TO anon, authenticated;