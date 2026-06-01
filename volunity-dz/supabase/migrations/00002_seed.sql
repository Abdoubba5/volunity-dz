-- ============================================================
-- Volunity DZ - Seed Data for University Platform
-- Run AFTER 00001_schema.sql in Supabase SQL Editor
-- ============================================================

-- 1. EVENTS (university-focused)
-- ============================================================
-- Use a placeholder admin UUID. Replace with your actual admin user ID.
-- After creating the first admin via Supabase Auth dashboard, 
-- run: select id from public.profiles where role = 'admin' limit 1;
-- Then replace 'ADMIN_UUID_HERE' below.

insert into public.events (title, description, location, date, image_url, created_by, category, max_participants) values
(
  'Welcome Week - Orientation 2026',
  'Kick off the new academic year with campus tours, faculty meet-and-greets, and student club exhibitions. All new students are encouraged to attend.',
  'University of Algiers - Main Campus',
  (current_date + interval '7 days')::timestamptz,
  'https://images.unsplash.com/photo-1523050854058-8df90110c7f1?w=800&q=80',
  (select id from public.profiles where role = 'admin' limit 1),
  'academic',
  500
),
(
  'Algorithmic Thinking Workshop',
  'A hands-on workshop on problem-solving and algorithmic thinking. Perfect for first-year CS students. Bring your laptop.',
  'Faculty of Technology - Room 204',
  (current_date + interval '3 days')::timestamptz,
  'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&q=80',
  (select id from public.profiles where role = 'admin' limit 1),
  'academic',
  30
),
(
  'Inter-University Football Tournament',
  'Annual football competition between faculties. Register your team of 7 players. Finals will be held at the Olympic Stadium.',
  'University Sports Complex',
  (current_date + interval '14 days')::timestamptz,
  'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=800&q=80',
  (select id from public.profiles where role = 'admin' limit 1),
  'sports',
  200
),
(
  'Cultural Night: Algerian Heritage',
  'An evening celebrating Algerian music, dance, and cuisine. Performances by student groups and traditional artisans.',
  'Faculty of Arts - Amphitheater',
  (current_date + interval '21 days')::timestamptz,
  'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80',
  (select id from public.profiles where role = 'admin' limit 1),
  'cultural',
  300
),
(
  'Career Fair 2026',
  'Meet recruiters from top Algerian and international companies. Bring your CV and prepare for on-site interviews. Open to all students.',
  'University Conference Center',
  (current_date + interval '30 days')::timestamptz,
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
  (select id from public.profiles where role = 'admin' limit 1),
  'career',
  1000
),
(
  'Hackathon: Build for Algeria',
  '48-hour hackathon to build tech solutions for local community challenges. Teams of 3-4. Prizes for top 3 teams.',
  'Innovation Lab - Library Building',
  (current_date + interval '10 days')::timestamptz,
  'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80',
  (select id from public.profiles where role = 'admin' limit 1),
  'academic',
  100
),
(
  'Beach Cleanup Day',
  'Join fellow students for a morning of beach cleanup at the Algiers coast. Gloves and bags provided. Transportation from campus available.',
  'Sablette Beach, Algiers',
  (current_date + interval '5 days')::timestamptz,
  'https://images.unsplash.com/photo-1583321500900-82807e458f3c?w=800&q=80',
  (select id from public.profiles where role = 'admin' limit 1),
  'social',
  150
),
(
  'Poetry and Spoken Word Night',
  'Open mic night for students to share their poetry and spoken word pieces. Arabic, French, and English welcome.',
  'Faculty of Letters - Auditorium',
  (current_date + interval '12 days')::timestamptz,
  'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&q=80',
  (select id from public.profiles where role = 'admin' limit 1),
  'cultural',
  80
),
(
  'Stress Management: Before Exams',
  'A workshop on managing exam stress with relaxation techniques, time management tips, and mindfulness exercises.',
  'Student Wellness Center',
  (current_date + interval '25 days')::timestamptz,
  'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80',
  (select id from public.profiles where role = 'admin' limit 1),
  'academic',
  50
),
(
  'Volunteering Fair',
  'Discover volunteering opportunities with local NGOs and student associations. Find your cause and make a difference.',
  'University Main Square',
  (current_date + interval '18 days')::timestamptz,
  'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&q=80',
  (select id from public.profiles where role = 'admin' limit 1),
  'social',
  400
)
on conflict (id) do nothing;

-- 2. ASSOCIATIONS (student clubs)
-- ============================================================
insert into public.associations (name, description, logo, president_name, faculty, email, created_by) values
(
  'CS Club',
  'Computer Science student club organizing coding workshops, hackathons, and tech talks. Open to all students interested in technology.',
  'https://api.dicebear.com/7.x/shapes/svg?seed=csclub&backgroundColor=00B7FF',
  'Amine Bensalem',
  'Technology',
  'csclub@univ-alger.dz',
  (select id from public.profiles where role = 'admin' limit 1)
),
(
  'Environmental Action Group',
  'Student-led initiative focused on environmental sustainability on campus and in the local community. We organize cleanups, tree planting, and awareness campaigns.',
  'https://api.dicebear.com/7.x/shapes/svg?seed=envgroup&backgroundColor=00E38C',
  'Yasmine Kerrouche',
  'Sciences',
  'environment@univ-alger.dz',
  (select id from public.profiles where role = 'admin' limit 1)
),
(
  'Debate Society',
  'Sharpen your public speaking and critical thinking skills. We hold weekly debates and participate in national competitions.',
  'https://api.dicebear.com/7.x/shapes/svg?seed=debate&backgroundColor=8B5CF6',
  'Rachid Amrani',
  'Law',
  'debate@univ-alger.dz',
  (select id from public.profiles where role = 'admin' limit 1)
),
(
  'Arts and Culture Collective',
  'A space for students to express themselves through visual arts, music, theater, and creative writing. Annual exhibition and performance events.',
  'https://api.dicebear.com/7.x/shapes/svg?seed=arts&backgroundColor=FF6B6B',
  'Lilia Mansouri',
  'Literature',
  'arts@univ-alger.dz',
  (select id from public.profiles where role = 'admin' limit 1)
),
(
  'Sports Association',
  'Promotes sports and physical wellness among students. Organizes inter-faculty tournaments, fitness challenges, and recreational activities.',
  'https://api.dicebear.com/7.x/shapes/svg?seed=sports&backgroundColor=F59E0B',
  'Karim Hamdi',
  'Physical Education',
  'sports@univ-alger.dz',
  (select id from public.profiles where role = 'admin' limit 1)
),
(
  'Medical Students Network',
  'Network for medical and health sciences students. Organizes study groups, health awareness campaigns, and hospital volunteering.',
  'https://api.dicebear.com/7.x/shapes/svg?seed=mednet&backgroundColor=EF4444',
  'Dr. Nadia Taleb',
  'Medicine',
  'mednet@univ-alger.dz',
  (select id from public.profiles where role = 'admin' limit 1)
)
on conflict (id) do nothing;

-- 3. RESOURCES (study materials and announcements)
-- ============================================================
insert into public.resources (title, description, file_url, type, faculty, created_by) values
(
  'Exam Schedule - Semester 2',
  'Official exam timetable for all faculties. Check your exam dates and rooms.',
  NULL,
  'announcement',
  NULL,
  (select id from public.profiles where role = 'admin' limit 1)
),
(
  'Introduction to Algorithms - Course Notes',
  'Comprehensive notes covering sorting algorithms, graph theory, and dynamic programming. Prepared by Dr. Amrani.',
  NULL,
  'course',
  'Technology',
  (select id from public.profiles where role = 'admin' limit 1)
),
(
  'Organic Chemistry - Past Exams',
  'Collection of past exam papers with solutions for Organic Chemistry (CHM201).',
  NULL,
  'exam',
  'Sciences',
  (select id from public.profiles where role = 'admin' limit 1)
),
(
  'Library Extended Hours - Exam Period',
  'The university library will be open 24/7 during the exam period starting May 15th.',
  NULL,
  'announcement',
  NULL,
  (select id from public.profiles where role = 'admin' limit 1)
),
(
  'English for Academic Purposes - Workbook',
  'Workbook for improving academic writing and presentation skills in English.',
  NULL,
  'course',
  'Literature',
  (select id from public.profiles where role = 'admin' limit 1)
),
(
  'Scholarship Opportunities 2026',
  'List of available scholarships for Algerian students including eligibility criteria and application deadlines.',
  NULL,
  'other',
  NULL,
  (select id from public.profiles where role = 'admin' limit 1)
)
on conflict (id) do nothing;

-- 4. VERIFICATION QUERIES
-- ============================================================
-- After running this seed, check data with:
-- select 'events' as tbl, count(*) from public.events
-- union all select 'associations', count(*) from public.associations
-- union all select 'resources', count(*) from public.resources
-- union all select 'profiles', count(*) from public.profiles
-- order by tbl;
