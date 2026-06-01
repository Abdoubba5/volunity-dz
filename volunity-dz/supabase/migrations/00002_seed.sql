-- ============================================================
-- Volunity DZ - Production Seed Data
-- Algerian volunteering ecosystem
-- Run AFTER 00001_schema.sql
-- ============================================================

-- 1. DEMO PROFILES (users that exist in auth.users)
-- ============================================================
-- NOTE: In Supabase, profiles are auto-created by the trigger when users sign up.
-- These INSERTs serve as documentation and can be used to create test profiles
-- AFTER auth.users records exist. For actual testing, sign up through the app.
-- To create these profiles manually (after auth.users exist), uncomment:
--
-- insert into public.profiles (id, name, username, city, points, level, role, hours_volunteered, events_joined, badges_count) values
--   ('00000000-0000-0000-0000-000000000001', 'Yasmine Benali', 'yasmine.benali', 'Alger', 2450, 13, 'user', 120, 25, 5),
--   ('00000000-0000-0000-0000-000000000002', 'Mohamed Kerrouche', 'mohamed.k', 'Oran', 1800, 10, 'user', 90, 18, 4),
--   ('00000000-0000-0000-0000-000000000003', 'Amina Bouzid', 'amina.b', 'Constantine', 3200, 17, 'user', 160, 35, 7),
--   ('00000000-0000-0000-0000-000000000004', 'Rachid Bensalem', 'rachid.b', 'Annaba', 950, 5, 'user', 45, 10, 2),
--   ('00000000-0000-0000-0000-000000000005', 'Lilia Mansouri', 'lilia.m', 'Tizi Ouzou', 4100, 21, 'user', 200, 45, 9),
--   ('00000000-0000-0000-0000-000000000006', 'Karim Hamdi', 'karim.h', 'Sétif', 650, 4, 'user', 30, 8, 1),
--   ('00000000-0000-0000-0000-000000000007', 'Nadia Taleb', 'nadia.t', 'Blida', 1500, 8, 'user', 75, 15, 3),
--   ('00000000-0000-0000-0000-000000000008', 'Samir Messaoudi', 'samir.m', 'Béjaïa', 5200, 27, 'user', 260, 55, 11),
--   ('00000000-0000-0000-0000-000000000009', 'Sofia Haddad', 'sofia.h', 'Tlemcen', 2800, 15, 'user', 140, 30, 6),
--   ('00000000-0000-0000-0000-000000000010', 'Yacine Saidi', 'yacine.s', 'Ouargla', 300, 2, 'association', 10, 3, 0);

-- 2. EVENTS
-- ============================================================
insert into public.events (id, title, description, category, location, date, time, image_url, capacity, participants_count, points_reward, organizer_id, status, featured, tags, requirements, schedule) values
-- Current/upcoming events
(
  'e0000001-0000-0000-0000-000000000001',
  'Plage Propre - Alger Plage',
  'Rejoignez-nous pour une journée de nettoyage de la plage d Alger. Ensemble, protégeons notre littoral méditerranéen. Gants et sacs fournis.',
  'environment',
  'Alger Plage, Alger',
  (current_date + interval '7 days')::date,
  '08:00',
  '/images/events/beach-cleanup.jpg',
  100,
  0,
  150,
  '00000000-0000-0000-0000-000000000010',
  'upcoming',
  true,
  array['plage', 'environnement', 'nettoyage', 'mer'],
  array['Tenue décontractée', 'Bouteille deau', 'Crème solaire'],
  '[{"time": "08:00", "activity": "Accueil et inscription"}, {"time": "08:30", "activity": "Briefing et distribution du matériel"}, {"time": "09:00", "activity": "Nettoyage de la plage"}, {"time": "12:00", "activity": "Pause déjeuner"}, {"time": "13:00", "activity": "Sensibilisation"}, {"time": "15:00", "activity": "Clôture"}]'
),
(
  'e0000001-0000-0000-0000-000000000002',
  'Cours d Alphabétisation - Bab El Oued',
  'Programme dalphabétisation pour adultes dans le quartier de Bab El Oued. Nous cherchons des bénévoles pour enseigner la lecture et lécriture de base.',
  'education',
  'Centre Culturel Bab El Oued, Alger',
  (current_date + interval '3 days')::date,
  '09:00',
  '/images/events/literacy.jpg',
  30,
  0,
  200,
  '00000000-0000-0000-0000-000000000009',
  'upcoming',
  true,
  array['éducation', 'alphabétisation', 'enseignement', 'social'],
  array['Patient', 'Bonne communication', 'Aucun diplôme requis'],
  '[{"time": "09:00", "activity": "Formation des bénévoles"}, {"time": "10:00", "activity": "Session 1 - Lecture"}, {"time": "11:00", "activity": "Pause"}, {"time": "11:15", "activity": "Session 2 - Écriture"}, {"time": "12:30", "activity": "Clôture"}]'
),
(
  'e0000001-0000-0000-0000-000000000003',
  'Marathon de la Santé - Oran',
  'Course caritative au profit des enfants atteints de maladies chroniques. 5km, 10km et semi-marathon. Inscription sur place.',
  'health',
  'Front de Mer, Oran',
  (current_date + interval '14 days')::date,
  '06:30',
  '/images/events/marathon.jpg',
  500,
  0,
  100,
  '00000000-0000-0000-0000-000000000002',
  'upcoming',
  true,
  array['santé', 'sport', 'marathon', 'caritatif'],
  array['Tenue de sport', 'Certificat médical obligatoire'],
  '[{"time": "06:00", "activity": "Retrait des dossards"}, {"time": "07:00", "activity": "Départ semi-marathon"}, {"time": "07:15", "activity": "Départ 10km"}, {"time": "07:30", "activity": "Départ 5km"}, {"time": "10:00", "activity": "Cérémonie de remise des prix"}]'
),
(
  'e0000001-0000-0000-0000-000000000004',
  'Nettoyage de la Forêt de Bainem',
  'Opération de reboisement et nettoyage de la forêt de Bainem après la saison estivale. Plantation de 500 arbres.',
  'environment',
  'Forêt de Bainem, Alger',
  (current_date + interval '5 days')::date,
 '07:30',
  '/images/events/forest.jpg',
  80,
  0,
  200,
  '00000000-0000-0000-0000-000000000003',
  'upcoming',
  false,
  array['forêt', 'reboisement', 'environnement', 'nature'],
  array['Chaussures de marche', 'Gants de jardinage', 'Chapeau'],
  '[{"time": "07:30", "activity": "Rassemblement"}, {"time": "08:00", "activity": "Distribution des plants"}, {"time": "08:30", "activity": "Plantation"}, {"time": "12:00", "activity": "Pause déjeuner"}, {"time": "13:00", "activity": "Nettoyage"}, {"time": "16:00", "activity": "Clôture"}]'
),
(
  'e0000001-0000-0000-0000-000000000005',
  'Festival Culturel des Arts Traditionnels',
  'Célébration des arts traditionnels algériens avec des ateliers de poterie, tissage, et musique andalouse.',
  'culture',
  'Palais de la Culture, Constantine',
  (current_date + interval '21 days')::date,
  '10:00',
  '/images/events/festival.jpg',
  200,
  0,
  100,
  '00000000-0000-0000-0000-000000000003',
  'upcoming',
  true,
  array['culture', 'art', 'tradition', 'musique'],
  array['Aucun requis'],
  '[{"time": "10:00", "activity": "Ouverture du festival"}, {"time": "11:00", "activity": "Atelier poterie"}, {"time": "13:00", "activity": "Déjeuner traditionnel"}, {"time": "14:30", "activity": "Concert musique andalouse"}, {"time": "17:00", "activity": "Clôture"}]'
),
(
  'e0000001-0000-0000-0000-000000000006',
  'Distribution de Repas - Ramadhan',
  'Distribution de repas pour les familles nécessiteuses pendant le mois de Ramadhan. Nous avons besoin de volontaires pour la préparation et la distribution.',
  'social',
  'Place du 1er Mai, Alger',
  (current_date + interval '30 days')::date,
  '16:00',
  '/images/events/ramadan.jpg',
  150,
  0,
  300,
  '00000000-0000-0000-0000-000000000010',
  'upcoming',
  true,
  array['ramadhan', 'solidarité', 'distribution', 'social'],
  array['Hygiène stricte', 'Disponible tout le mois'],
  '[{"time": "16:00", "activity": "Préparation des repas"}, {"time": "17:30", "activity": "Mise en boîtes"}, {"time": "18:00", "activity": "Distribution"}, {"time": "19:30", "activity": "Iftar collectif"}]'
),
(
  'e0000001-0000-0000-0000-000000000007',
  'Cours de Français pour Enfants - Tizi Ouzou',
  'Soutien scolaire en français pour les enfants du primaire à Tizi Ouzou. Nous recherchons des bénévoles francophones.',
  'education',
  'École Primaire des Frères Ouramdane, Tizi Ouzou',
  (current_date + interval '4 days')::date,
  '14:00',
  '/images/events/tutoring.jpg',
  20,
  0,
  150,
  '00000000-0000-0000-0000-000000000005',
  'upcoming',
  false,
  array['éducation', 'enfants', 'français', 'soutien scolaire'],
  array['Bonne maîtrise du français', 'Aimer les enfants'],
  '[{"time": "14:00", "activity": "Accueil des enfants"}, {"time": "14:30", "activity": "Exercices de lecture"}, {"time": "15:30", "activity": "Jeux éducatifs"}, {"time": "16:30", "activity": "Clôture"}]'
),
(
  'e0000001-0000-0000-0000-000000000008',
  'Journée de Sensibilisation au Diabète',
  'Campagne de sensibilisation et dépistage gratuit du diabète dans la wilaya de Blida. Médecins et infirmiers bénévoles bienvenus.',
  'health',
  'Polyclinique Ben Boulaid, Blida',
  (current_date + interval '10 days')::date,
  '08:30',
  '/images/events/diabetes.jpg',
  50,
  0,
  250,
  '00000000-0000-0000-0000-000000000007',
  'upcoming',
  false,
  array['santé', 'diabète', 'sensibilisation', 'dépistage'],
  array['Personnel médical', 'Matériel médical'],
  '[{"time": "08:30", "activity": "Installation des stands"}, {"time": "09:00", "activity": "Dépistage gratuit"}, {"time": "10:00", "activity": "Conférence éducative"}, {"time": "12:00", "activity": "Pause"}, {"time": "13:00", "activity": "Ateliers culinaires"}, {"time": "16:00", "activity": "Clôture"}]'
),
(
  'e0000001-0000-0000-0000-000000000009',
  'Tournoi de Football des Quartiers',
  'Tournoi inter-quartiers pour promouvoir le sport et la cohésion sociale. Catégories juniors et seniors.',
  'sports',
  'Stade du 20 Août 1955, Sétif',
  (current_date + interval '12 days')::date,
  '09:00',
  '/images/events/football.jpg',
  200,
  0,
  100,
  '00000000-0000-0000-0000-000000000006',
  'upcoming',
  false,
  array['sport', 'football', 'jeunes', 'tournoi'],
  array['Tenue de sport', 'Équipe de 7 joueurs'],
  '[{"time": "08:00", "activity": "Accueil des équipes"}, {"time": "09:00", "activity": "Phase de groupes"}, {"time": "12:00", "activity": "Quarts de finale"}, {"time": "14:00", "activity": "Demi-finales"}, {"time": "15:30", "activity": "Finale"}, {"time": "16:30", "activity": "Remise des prix"}]'
),
(
  'e0000001-0000-0000-0000-000000000010',
  'Cours d Informatique pour Seniors',
  'Initiation à linformatique pour les personnes âgées. Apprenez à utiliser un ordinateur, naviguer sur internet et communiquer avec vos proches.',
  'education',
  'Maison de Jeunes, Annaba',
  (current_date + interval '8 days')::date,
  '10:00',
  '/images/events/computers.jpg',
  25,
  0,
  100,
  '00000000-0000-0000-0000-000000000004',
  'upcoming',
  true,
  array['informatique', 'seniors', 'éducation', 'numérique'],
  array['Patient', 'Pédagogue'],
  '[{"time": "10:00", "activity": "Accueil"}, {"time": "10:30", "activity": "Bases de lordinateur"}, {"time": "11:30", "activity": "Navigation internet"}, {"time": "12:30", "activity": "Pause"}, {"time": "13:30", "activity": "Email et communication"}, {"time": "15:00", "activity": "Clôture"}]'
),
-- Past events (for testing history/leaderboard)
(
  'e0000001-0000-0000-0000-000000000011',
  'Nettoyage du Jardin d Essai',
  'Grande opération de nettoyage du Jardin d Essai du Hamma à Alger.',
  'environment',
  'Jardin d Essai, Alger',
  (current_date - interval '30 days')::date,
  '08:00',
  NULL,
  100,
  45,
  100,
  '00000000-0000-0000-0000-000000000001',
  'completed',
  false,
  array['jardin', 'nettoyage', 'nature'],
  array['Gants'],
  '[]'
),
(
  'e0000001-0000-0000-0000-000000000012',
  'Caravane Médicale - Sud Algérien',
  'Caravane médicale vers les zones reculées du sud pour fournir des soins gratuits.',
  'health',
  'Djanet, Illizi',
  (current_date - interval '45 days')::date,
  '07:00',
  NULL,
  40,
  40,
  500,
  '00000000-0000-0000-0000-000000000008',
  'completed',
  true,
  array['médical', 'caravane', 'sud', 'solidarité'],
  array['Personnel médical'],
  '[]'
),
(
  'e0000001-0000-0000-0000-000000000013',
  'Ateliers de Peinture Mural',
  'Réalisation d une fresque murale dans le centre-ville de Béjaïa sur le thème de lenvironnement.',
  'culture',
  'Centre-ville, Béjaïa',
  (current_date - interval '20 days')::date,
  '09:00',
  NULL,
  30,
  28,
  150,
  '00000000-0000-0000-0000-000000000008',
  'completed',
  false,
  array['art', 'peinture', 'culture', 'mural'],
  array['Aucun'],
  '[]'
),
(
  'e0000001-0000-0000-0000-000000000014',
  'Collecte de Vêtements - Hiver',
  'Collecte de vêtements chauds pour les sans-abris et familles démunies pour lhiver.',
  'social',
  'Place de la République, Tlemcen',
  (current_date - interval '15 days')::date,
  '10:00',
  NULL,
  60,
  55,
  200,
  '00000000-0000-0000-0000-000000000009',
  'completed',
  false,
  array['collecte', 'vêtements', 'hiver', 'solidarité'],
  array['Aucun'],
  '[]'
),
(
  'e0000001-0000-0000-0000-000000000015',
  'Course de Lemnity - Préparation',
  'Séance dentraînement collectif pour les participants à la course de Lemnity.',
  'sports',
  'Stade du 5 Juillet, Alger',
  (current_date - interval '60 days')::date,
  '06:00',
  NULL,
  150,
  120,
  100,
  '00000000-0000-0000-0000-000000000002',
  'completed',
  false,
  array['sport', 'course', 'entraînement'],
  array['Tenue de sport'],
  '[]'
)
on conflict (id) do nothing;

-- 3. ASSOCIATIONS
-- ============================================================
insert into public.associations (id, name, description, logo_url, cover_url, website, verified, owner_id, location, founded, category, followers_count, events_count, members_count, impact) values
(
  'a0000001-0000-0000-0000-000000000001',
  'Green Algérie',
  'Association nationale pour la protection de lenvironnement et le développement durable. Active dans le reboisement, le nettoyage des plages et la sensibilisation écologique.',
  '/images/associations/green-algerie.png',
  '/images/associations/green-algerie-cover.jpg',
  'https://greenalgerie.dz',
  true,
  '00000000-0000-0000-0000-000000000010',
  'Alger',
  '2015',
  'environment',
  5000,
  150,
  1200,
  '{"trees_planted": 15000, "cleanups": 300, "volunteers": 5000, "cities": 25}'
),
(
  'a0000001-0000-0000-0000-000000000002',
  'Éducation Pour Tous',
  'Association œuvrant pour laccès à léducation dans les zones défavorisées. Nous organisons des cours de soutien, des formations et distribuons des fournitures scolaires.',
  '/images/associations/education-pour-tous.png',
  '/images/associations/education-pour-tous-cover.jpg',
  'https://educationpourtous.dz',
  true,
  '00000000-0000-0000-0000-000000000003',
  'Constantine',
  '2018',
  'education',
  3500,
  200,
  800,
  '{"trees_planted": 2000, "cleanups": 50, "volunteers": 3500, "cities": 15}'
),
(
  'a0000001-0000-0000-0000-000000000003',
  'Santé Solidarité',
  'Association médicale humanitaire organisant des caravanes de santé dans les zones rurales et des campagnes de sensibilisation.',
  '/images/associations/sante-solidarite.png',
  '/images/associations/sante-solidarite-cover.jpg',
  'https://santesolidarite.dz',
  true,
  '00000000-0000-0000-0000-000000000008',
  'Béjaïa',
  '2016',
  'health',
  4200,
  180,
  950,
  '{"trees_planted": 500, "cleanups": 30, "volunteers": 4200, "cities": 20}'
),
(
  'a0000001-0000-0000-0000-000000000004',
  'Culture et Patrimoine',
  'Association de préservation et de promotion du patrimoine culturel algérien. Organisation de festivals, expositions et ateliers artisanaux.',
  '/images/associations/culture-patrimoine.png',
  '/images/associations/culture-patrimoine-cover.jpg',
  'https://culturepatrimoine.dz',
  false,
  '00000000-0000-0000-0000-000000000005',
  'Tizi Ouzou',
  '2019',
  'culture',
  1800,
  90,
  400,
  '{"trees_planted": 0, "cleanups": 0, "volunteers": 1800, "cities": 8}'
),
(
  'a0000001-0000-0000-0000-000000000005',
  'Sport et Jeunesse',
  'Association sportive offrant des activités gratuites aux jeunes des quartiers défavorisés. Football, basket, athlétisme et encadrement éducatif.',
  '/images/associations/sport-jeunesse.png',
  '/images/associations/sport-jeunesse-cover.jpg',
  'https://sportjeunesse.dz',
  false,
  '00000000-0000-0000-0000-000000000006',
  'Sétif',
  '2020',
  'sports',
  2500,
  120,
  600,
  '{"trees_planted": 0, "cleanups": 10, "volunteers": 2500, "cities": 5}'
),
(
  'a0000001-0000-0000-0000-000000000006',
  'Entraide et Fraternité',
  'Association humanitaire apportant une aide alimentaire, vestimentaire et sociale aux familles dans le besoin à travers toute lAlgérie.',
  '/images/associations/entraide-fraternite.png',
  '/images/associations/entraide-fraternite-cover.jpg',
  'https://entraidefraternite.dz',
  true,
  '00000000-0000-0000-0000-000000000009',
  'Tlemcen',
  '2014',
  'social',
  6000,
  300,
  1500,
  '{"trees_planted": 1000, "cleanups": 20, "volunteers": 6000, "cities": 30}'
)
on conflict (id) do nothing;

-- 4. ASSOCIATION MEMBERS
-- ============================================================
-- NOTE: These reference auth.users IDs. They will work after users sign up.
-- Uncomment when test users exist in auth.users:
--
-- insert into public.association_members (association_id, user_id, role) values
--   ('a0000001-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'member'),
--   ('a0000001-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'moderator'),
--   ('a0000001-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000003', 'admin'),
--   ('a0000001-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000004', 'member'),
--   ('a0000001-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000005', 'member'),
--   ('a0000001-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000008', 'admin'),
--   ('a0000001-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000005', 'admin'),
--   ('a0000001-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000006', 'admin'),
--   ('a0000001-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000009', 'admin'),
--   ('a0000001-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000007', 'member');

-- 5. EVENT PARTICIPANTS (past events for leaderboard data)
-- ============================================================
-- NOTE: These reference auth.users IDs. Uncomment when test users exist.
--
-- -- Past event participations
-- insert into public.event_participants (event_id, user_id, status) values
--   ('e0000001-0000-0000-0000-000000000011', '00000000-0000-0000-0000-000000000001', 'attended'),
--   ('e0000001-0000-0000-0000-000000000011', '00000000-0000-0000-0000-000000000002', 'attended'),
--   ('e0000001-0000-0000-0000-000000000011', '00000000-0000-0000-0000-000000000003', 'attended'),
--   ('e0000001-0000-0000-0000-000000000011', '00000000-0000-0000-0000-000000000005', 'attended'),
--   ('e0000001-0000-0000-0000-000000000012', '00000000-0000-0000-0000-000000000008', 'attended'),
--   ('e0000001-0000-0000-0000-000000000012', '00000000-0000-0000-0000-000000000005', 'attended'),
--   ('e0000001-0000-0000-0000-000000000012', '00000000-0000-0000-0000-000000000003', 'attended'),
--   ('e0000001-0000-0000-0000-000000000012', '00000000-0000-0000-0000-000000000009', 'attended'),
--   ('e0000001-0000-0000-0000-000000000013', '00000000-0000-0000-0000-000000000008', 'attended'),
--   ('e0000001-0000-0000-0000-000000000013', '00000000-0000-0000-0000-000000000003', 'attended'),
--   ('e0000001-0000-0000-0000-000000000014', '00000000-0000-0000-0000-000000000009', 'attended'),
--   ('e0000001-0000-0000-0000-000000000014', '00000000-0000-0000-0000-000000000007', 'attended'),
--   ('e0000001-0000-0000-0000-000000000014', '00000000-0000-0000-0000-000000000001', 'attended'),
--   ('e0000001-0000-0000-0000-000000000015', '00000000-0000-0000-0000-000000000002', 'attended'),
--   ('e0000001-0000-0000-0000-000000000015', '00000000-0000-0000-0000-000000000004', 'attended');

-- 6. BADGES (additional Algerian-themed badges on top of the 12 seed badges)
-- ============================================================
insert into public.badges (name, description, icon, tier, required_points)
values
  ('Sahara Explorer', 'Volunteered in the Sahara region', '🏜️', 'gold', 3000),
  ('Mediterranean Guardian', 'Completed 5 beach cleanups', '🌊', 'silver', 1500),
  ('Ramadhan Angel', 'Participated in iftar distributions', '🌙', 'bronze', 200),
  ('Kabyle Craftsman', 'Contributed to cultural preservation', '🏺', 'silver', 1000),
  ('Oran Ambassador', 'Represented at events in Oran', '🎭', 'bronze', 500),
  ('Constantine Bridge', 'Connected volunteers across cities', '🌉', 'gold', 4000),
  ('Algiers Heart', 'Most active in Algiers region', '❤️', 'silver', 2000),
  ('Digital Pioneer', 'Completed tech-related volunteering', '💻', 'bronze', 500),
  ('Health Hero', 'Participated in medical caravans', '🏥', 'gold', 3500),
  ('Sports Champion', 'Led sports events for youth', '🏆', 'silver', 2000),
  ('Mentor of the Year', 'Trained 10+ new volunteers', '🎓', 'gold', 5000),
  ('Guardian of Nature', 'Planted 100+ trees', '🌳', 'gold', 4500)
on conflict (id) do nothing;

-- 7. SAMPLE NOTIFICATIONS
-- ============================================================
-- NOTE: These reference auth.users IDs. Uncomment when test users exist.
--
-- insert into public.notifications (user_id, type, title, description, icon, link) values
--   ('00000000-0000-0000-0000-000000000001', 'badge', 'Badge Gagné !', 'Vous avez débloqué le badge "First Steps"', 'award', '/profile/00000000-0000-0000-0000-000000000001'),
--   ('00000000-0000-0000-0000-000000000001', 'event', 'Rappel', 'Votre événement "Plage Propre" est demain !', 'calendar', '/events/e0000001-0000-0000-0000-000000000001'),
--   ('00000000-0000-0000-0000-000000000003', 'badge', 'Badge Gagné !', 'Vous avez débloqué le badge "Dedicated Volunteer"', 'award', '/profile/00000000-0000-0000-0000-000000000003'),
--   ('00000000-0000-0000-0000-000000000005', 'badge', 'Badge Gagné !', 'Vous avez débloqué le badge "Community Hero"', 'award', '/profile/00000000-0000-0000-0000-000000000005'),
--   ('00000000-0000-0000-0000-000000000008', 'system', 'Bienvenue', 'Bienvenue sur Volunity DZ ! Commencez votre parcours de volontaire.', 'bell', '/dashboard'),
--   ('00000000-0000-0000-0000-000000000002', 'event', 'Nouvel événement', 'Un nouvel événement est disponible dans votre région.', 'calendar', '/events/e0000001-0000-0000-0000-000000000003'),
--   ('00000000-0000-0000-0000-000000000009', 'social', 'Nouveau membre', 'Entraide et Fraternité a rejoint Volunity DZ !', 'users', '/associations/a0000001-0000-0000-0000-000000000006'),
--   ('00000000-0000-0000-0000-000000000007', 'badge', 'Badge Gagné !', 'Vous avez débloqué le badge "Community Helper"', 'award', '/profile/00000000-0000-0000-0000-000000000007');

-- 8. VERIFICATION QUERIES (run in SQL Editor after seeding)
-- ============================================================
-- -- Check all tables have data:
-- select 'badges' as table_name, count(*) from public.badges
-- union all select 'events', count(*) from public.events
-- union all select 'associations', count(*) from public.associations
-- union all select 'profiles', count(*) from public.profiles
-- union all select 'notifications', count(*) from public.notifications
-- order by table_name;
--
-- -- Check upcoming events:
-- select title, date, location, category, capacity, participants_count, featured
-- from public.events where status = 'upcoming' order by date;
--
-- -- Check leaderboard (by points):
-- select name, points, level, hours_volunteered, city
-- from public.profiles order by points desc limit 10;
--
-- -- Check associations by followers:
-- select name, category, followers_count, verified, city || ', ' || location as address
-- from public.associations order by followers_count desc;
