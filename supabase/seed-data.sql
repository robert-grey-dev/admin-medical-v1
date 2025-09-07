-- Demo seed data for Medical Portal
-- This script creates sample data for demonstration purposes

-- Insert demo profiles/users
INSERT INTO public.profiles (id, email, full_name, role, status) VALUES
  ('00000000-0000-0000-0000-000000000001'::uuid, 'owner@medical.com', 'System Owner', 'owner', 'active'),
  ('00000000-0000-0000-0000-000000000002'::uuid, 'admin@medical.com', 'Admin User', 'admin', 'active'),
  ('00000000-0000-0000-0000-000000000003'::uuid, 'moderator@medical.com', 'Moderator User', 'moderator', 'active'),
  ('00000000-0000-0000-0000-000000000004'::uuid, 'user@medical.com', 'Regular User', 'user', 'active');

-- Insert demo doctors
INSERT INTO public.doctors (id, name, specialty, description, experience_years, image_url) VALUES
  ('10000000-0000-0000-0000-000000000001'::uuid, 'Dr. Sarah Johnson', 'Cardiology', 'Experienced cardiologist specializing in heart disease prevention and treatment. Board certified with 15 years of clinical experience.', 15, 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&h=300&fit=crop&crop=face'),
  ('10000000-0000-0000-0000-000000000002'::uuid, 'Dr. Michael Chen', 'Neurology', 'Leading neurologist with expertise in stroke treatment and brain disorders. Research focus on neurodegenerative diseases.', 12, 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=300&fit=crop&crop=face'),
  ('10000000-0000-0000-0000-000000000003'::uuid, 'Dr. Emily Rodriguez', 'Pediatrics', 'Dedicated pediatrician caring for children from infancy through adolescence. Specializes in developmental disorders and vaccines.', 8, 'https://images.unsplash.com/photo-1594824388191-82dc2c72a4c0?w=300&h=300&fit=crop&crop=face'),
  ('10000000-0000-0000-0000-000000000004'::uuid, 'Dr. David Thompson', 'Orthopedics', 'Orthopedic surgeon specializing in sports medicine and joint replacement. Former team physician for professional athletics.', 18, 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=300&h=300&fit=crop&crop=face'),
  ('10000000-0000-0000-0000-000000000005'::uuid, 'Dr. Lisa Park', 'Dermatology', 'Board-certified dermatologist with expertise in skin cancer detection and cosmetic procedures. Published researcher in dermatological treatments.', 10, 'https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?w=300&h=300&fit=crop&crop=face'),
  ('10000000-0000-0000-0000-000000000006'::uuid, 'Dr. James Wilson', 'Family Medicine', 'Family physician providing comprehensive care for patients of all ages. Focus on preventive medicine and chronic disease management.', 14, 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=300&fit=crop&crop=face'),
  ('10000000-0000-0000-0000-000000000007'::uuid, 'Dr. Maria Gonzalez', 'Psychiatry', 'Psychiatrist specializing in anxiety disorders, depression, and cognitive behavioral therapy. Bilingual practice serving diverse communities.', 11, 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&h=300&fit=crop&crop=face'),
  ('10000000-0000-0000-0000-000000000008'::uuid, 'Dr. Robert Kim', 'Oncology', 'Medical oncologist with expertise in cancer treatment and immunotherapy. Active in clinical trials for new cancer treatments.', 16, 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=300&h=300&fit=crop&crop=face'),
  ('10000000-0000-0000-0000-000000000009'::uuid, 'Dr. Jennifer Lee', 'Gastroenterology', 'Gastroenterologist specializing in digestive disorders and endoscopic procedures. Expert in inflammatory bowel disease treatment.', 13, 'https://images.unsplash.com/photo-1594824388191-82dc2c72a4c0?w=300&h=300&fit=crop&crop=face'),
  ('10000000-0000-0000-0000-000000000010'::uuid, 'Dr. Andrew Brown', 'Emergency Medicine', 'Emergency physician with experience in trauma care and critical medicine. Former military medic with deployment experience.', 9, 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=300&fit=crop&crop=face');

-- Insert demo reviews with various statuses and ratings
INSERT INTO public.reviews (doctor_id, patient_name, email, rating, review_text, status, created_at) VALUES
  -- Dr. Sarah Johnson (Cardiology) - High rated
  ('10000000-0000-0000-0000-000000000001'::uuid, 'John Smith', 'john.smith@email.com', 5, 'Dr. Johnson saved my life! Her expertise in cardiology is unmatched. She explained everything clearly and made me feel comfortable throughout the treatment.', 'approved', NOW() - INTERVAL '2 days'),
  ('10000000-0000-0000-0000-000000000001'::uuid, 'Mary Davis', 'mary.davis@email.com', 5, 'Excellent cardiologist. Very thorough examination and great bedside manner. Highly recommend for anyone with heart concerns.', 'approved', NOW() - INTERVAL '5 days'),
  ('10000000-0000-0000-0000-000000000001'::uuid, 'Robert Wilson', 'robert.wilson@email.com', 4, 'Professional and knowledgeable. The wait time was a bit long but the quality of care was worth it.', 'approved', NOW() - INTERVAL '8 days'),
  
  -- Dr. Michael Chen (Neurology) - Good ratings
  ('10000000-0000-0000-0000-000000000002'::uuid, 'Linda Brown', 'linda.brown@email.com', 5, 'Dr. Chen is incredible. He diagnosed my condition when other doctors missed it. His expertise in neurology is exceptional.', 'approved', NOW() - INTERVAL '1 day'),
  ('10000000-0000-0000-0000-000000000002'::uuid, 'Steven Garcia', 'steven.garcia@email.com', 4, 'Very knowledgeable neurologist. Takes time to explain complex medical terms in simple language.', 'approved', NOW() - INTERVAL '6 days'),
  ('10000000-0000-0000-0000-000000000002'::uuid, 'Jennifer Martinez', 'jennifer.martinez@email.com', 4, 'Good doctor, helped with my headache issues. Treatment plan is working well.', 'pending', NOW() - INTERVAL '3 days'),
  
  -- Dr. Emily Rodriguez (Pediatrics) - Excellent for kids
  ('10000000-0000-0000-0000-000000000003'::uuid, 'Patricia Johnson', 'patricia.johnson@email.com', 5, 'Dr. Rodriguez is amazing with children. My daughter loves her! Very patient and caring.', 'approved', NOW() - INTERVAL '4 days'),
  ('10000000-0000-0000-0000-000000000003'::uuid, 'Michael Lee', 'michael.lee@email.com', 5, 'Best pediatrician in town. Always available for questions and concerns. Highly recommended.', 'approved', NOW() - INTERVAL '7 days'),
  ('10000000-0000-0000-0000-000000000003'::uuid, 'Sarah Thompson', 'sarah.thompson@email.com', 4, 'Great with my toddler. Very gentle and professional approach to pediatric care.', 'approved', NOW() - INTERVAL '10 days'),
  
  -- Dr. David Thompson (Orthopedics) - Mixed reviews
  ('10000000-0000-0000-0000-000000000004'::uuid, 'James Anderson', 'james.anderson@email.com', 5, 'Dr. Thompson performed my knee surgery and the results are fantastic. Back to playing sports!', 'approved', NOW() - INTERVAL '12 days'),
  ('10000000-0000-0000-0000-000000000004'::uuid, 'Lisa White', 'lisa.white@email.com', 3, 'Competent surgeon but communication could be better. Surgery went well but follow-up was lacking.', 'approved', NOW() - INTERVAL '15 days'),
  ('10000000-0000-0000-0000-000000000004'::uuid, 'David Clark', 'david.clark@email.com', 4, 'Good orthopedic surgeon. Fixed my shoulder injury effectively. Recovery is going well.', 'pending', NOW() - INTERVAL '2 days'),
  
  -- Dr. Lisa Park (Dermatology) - Great reviews
  ('10000000-0000-0000-0000-000000000005'::uuid, 'Nancy Taylor', 'nancy.taylor@email.com', 5, 'Dr. Park caught my skin cancer early. Her attention to detail literally saved my life. Grateful beyond words.', 'approved', NOW() - INTERVAL '9 days'),
  ('10000000-0000-0000-0000-000000000005'::uuid, 'Kevin Miller', 'kevin.miller@email.com', 5, 'Excellent dermatologist. Very thorough skin examination and great advice on skincare.', 'approved', NOW() - INTERVAL '11 days'),
  ('10000000-0000-0000-0000-000000000005'::uuid, 'Michelle Davis', 'michelle.davis@email.com', 4, 'Professional service. Helped with my acne treatment. Seeing good results.', 'approved', NOW() - INTERVAL '14 days'),
  
  -- Dr. James Wilson (Family Medicine) - Solid reviews
  ('10000000-0000-0000-0000-000000000006'::uuid, 'Brian Wilson', 'brian.wilson@email.com', 4, 'Dr. Wilson has been our family doctor for years. Reliable and trustworthy physician.', 'approved', NOW() - INTERVAL '6 days'),
  ('10000000-0000-0000-0000-000000000006'::uuid, 'Carol Moore', 'carol.moore@email.com', 5, 'Great family doctor. Takes time to listen and provides comprehensive care for our whole family.', 'approved', NOW() - INTERVAL '13 days'),
  ('10000000-0000-0000-0000-000000000006'::uuid, 'George Harris', 'george.harris@email.com', 4, 'Knowledgeable family physician. Good preventive care and health advice.', 'pending', NOW() - INTERVAL '1 day'),
  
  -- Dr. Maria Gonzalez (Psychiatry) - Some pending reviews
  ('10000000-0000-0000-0000-000000000007'::uuid, 'Sandra Lewis', 'sandra.lewis@email.com', 5, 'Dr. Gonzalez helped me through my depression. Compassionate and professional therapist.', 'approved', NOW() - INTERVAL '8 days'),
  ('10000000-0000-0000-0000-000000000007'::uuid, 'Mark Young', 'mark.young@email.com', 4, 'Good psychiatrist. Helped with my anxiety issues. Treatment is working well.', 'pending', NOW() - INTERVAL '3 days'),
  ('10000000-0000-0000-0000-000000000007'::uuid, 'Karen Walker', 'karen.walker@email.com', 5, 'Excellent psychiatrist. Very understanding and provides effective treatment plans.', 'pending', NOW() - INTERVAL '1 day'),
  
  -- Dr. Robert Kim (Oncology) - High praise
  ('10000000-0000-0000-0000-000000000008'::uuid, 'Paul Hall', 'paul.hall@email.com', 5, 'Dr. Kim is fighting cancer with me every step of the way. His expertise gives me hope.', 'approved', NOW() - INTERVAL '10 days'),
  ('10000000-0000-0000-0000-000000000008'::uuid, 'Helen Allen', 'helen.allen@email.com', 5, 'Outstanding oncologist. Explained treatment options clearly and provided excellent care throughout chemotherapy.', 'approved', NOW() - INTERVAL '16 days'),
  ('10000000-0000-0000-0000-000000000008'::uuid, 'Timothy Green', 'timothy.green@email.com', 4, 'Competent cancer specialist. Good communication and professional approach to treatment.', 'approved', NOW() - INTERVAL '20 days'),
  
  -- Dr. Jennifer Lee (Gastroenterology) - Good feedback
  ('10000000-0000-0000-0000-000000000009'::uuid, 'Dorothy Adams', 'dorothy.adams@email.com', 4, 'Dr. Lee helped with my digestive issues. Professional and knowledgeable gastroenterologist.', 'approved', NOW() - INTERVAL '5 days'),
  ('10000000-0000-0000-0000-000000000009'::uuid, 'Ryan Nelson', 'ryan.nelson@email.com', 5, 'Excellent GI doctor. Solved my stomach problems that other doctors couldn''t figure out.', 'approved', NOW() - INTERVAL '12 days'),
  ('10000000-0000-0000-0000-000000000009'::uuid, 'Christine Carter', 'christine.carter@email.com', 3, 'Decent doctor but appointment wait times are too long. Treatment was effective though.', 'pending', NOW() - INTERVAL '2 days'),
  
  -- Dr. Andrew Brown (Emergency Medicine) - Mixed recent reviews
  ('10000000-0000-0000-0000-000000000010'::uuid, 'Charles Mitchell', 'charles.mitchell@email.com', 4, 'Dr. Brown treated me in the ER. Professional and efficient under pressure.', 'approved', NOW() - INTERVAL '7 days'),
  ('10000000-0000-0000-0000-000000000010'::uuid, 'Barbara Perez', 'barbara.perez@email.com', 5, 'Outstanding emergency physician. Calm and competent during my medical emergency.', 'approved', NOW() - INTERVAL '14 days'),
  ('10000000-0000-0000-0000-000000000010'::uuid, 'Daniel Roberts', 'daniel.roberts@email.com', 2, 'Dr. Brown seemed rushed and didn''t explain my condition well. Not satisfied with the care.', 'rejected', NOW() - INTERVAL '18 days'),
  
  -- Additional recent reviews for trend analysis
  ('10000000-0000-0000-0000-000000000001'::uuid, 'Amanda Turner', 'amanda.turner@email.com', 5, 'Outstanding cardiologist! Dr. Johnson provided excellent care during my heart procedure.', 'pending', NOW() - INTERVAL '1 hour'),
  ('10000000-0000-0000-0000-000000000003'::uuid, 'Thomas Phillips', 'thomas.phillips@email.com', 5, 'Dr. Rodriguez is wonderful with children. My son actually looks forward to his checkups!', 'pending', NOW() - INTERVAL '6 hours'),
  ('10000000-0000-0000-0000-000000000005'::uuid, 'Rebecca Campbell', 'rebecca.campbell@email.com', 4, 'Professional dermatology service. Dr. Park provided thorough skin examination and treatment.', 'pending', NOW() - INTERVAL '12 hours');

-- Trigger the rating recalculation for all doctors
SELECT public.recalculate_doctor_rating(doctor_id) 
FROM (SELECT DISTINCT doctor_id FROM public.reviews WHERE status = 'approved') AS doctor_ids;