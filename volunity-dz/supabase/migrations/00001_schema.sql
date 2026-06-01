-- ============================================================
-- Volunity DZ - University Platform Schema
-- Paste directly into Supabase SQL Editor and run
-- ============================================================

-- 1. TABLES
-- ============================================================

-- PROFILES (extends auth.users)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text not null,
  avatar_url text,
  email text,
  university text,
  faculty text,
  department text,
  academic_year text,
  role text not null default 'student'::text check (role in ('student', 'moderator', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- EVENTS (admin-created only)
create table if not exists public.events (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  location text,
  date timestamptz not null,
  image_url text,
  created_by uuid not null references public.profiles(id) on delete cascade,
  category text check (category in ('academic', 'cultural', 'sports', 'social', 'career')),
  max_participants integer default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ASSOCIATIONS (student clubs)
create table if not exists public.associations (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  logo text,
  president_name text,
  faculty text,
  email text,
  created_by uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now()
);

-- POSTS (student feed)
create table if not exists public.posts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null references public.profiles(id) on delete cascade,
  content text not null,
  image text,
  created_at timestamptz not null default now()
);

-- COMMENTS (on posts)
create table if not exists public.comments (
  id uuid default gen_random_uuid() primary key,
  post_id uuid not null references public.posts(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  content text not null,
  created_at timestamptz not null default now()
);

-- EVENT PARTICIPANTS (registration)
create table if not exists public.event_participants (
  id uuid default gen_random_uuid() primary key,
  event_id uuid not null references public.events(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  status text not null default 'registered'::text check (status in ('registered', 'attended')),
  created_at timestamptz not null default now(),
  unique(event_id, user_id)
);

-- NOTIFICATIONS
create table if not exists public.notifications (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  message text,
  related_id text,
  type text not null default 'general'::text check (type in ('general', 'event', 'post', 'admin')),
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

-- STUDENT STATS (real metrics only)
create table if not exists public.student_stats (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null references public.profiles(id) on delete cascade,
  events_attended integer not null default 0,
  posts_count integer not null default 0,
  join_date timestamptz not null default now(),
  unique(user_id)
);

-- ATTENDANCE (QR check-in)
create table if not exists public.attendance (
  id uuid default gen_random_uuid() primary key,
  event_id uuid not null references public.events(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  scanned_at timestamptz not null default now(),
  unique(event_id, user_id)
);

-- RESOURCES (study materials)
create table if not exists public.resources (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  file_url text,
  type text check (type in ('exam', 'course', 'announcement', 'other')),
  faculty text,
  created_by uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now()
);

-- 2. INDEXES
-- ============================================================
create index if not exists events_date_idx on public.events(date desc);
create index if not exists events_category_idx on public.events(category);
create index if not exists events_created_by_idx on public.events(created_by);
create index if not exists posts_created_at_idx on public.posts(created_at desc);
create index if not exists posts_user_id_idx on public.posts(user_id);
create index if not exists comments_post_id_idx on public.comments(post_id);
create index if not exists notifications_user_id_idx on public.notifications(user_id);
create index if not exists notifications_unread_idx on public.notifications(user_id, is_read) where is_read = false;
create index if not exists resources_faculty_idx on public.resources(faculty);
create index if not exists event_participants_event_id_idx on public.event_participants(event_id);
create index if not exists event_participants_user_id_idx on public.event_participants(user_id);
create index if not exists profiles_faculty_idx on public.profiles(faculty);

-- 3. FUNCTIONS & TRIGGERS
-- ============================================================

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  meta jsonb;
begin
  meta := new.raw_user_meta_data;
  insert into public.profiles (id, full_name, avatar_url, email, university, faculty, department, academic_year)
  values (
    new.id,
    coalesce(
      meta ->> 'full_name',
      meta ->> 'name',
      split_part(new.email, '@', 1)
    ),
    coalesce(meta ->> 'avatar_url', meta ->> 'picture'),
    new.email,
    meta ->> 'university',
    meta ->> 'faculty',
    meta ->> 'department',
    meta ->> 'academic_year'
  );
  insert into public.student_stats (user_id) values (new.id);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Update events_attended when attendance is recorded
create or replace function public.update_attendance_stats()
returns trigger
language plpgsql
security definer
as $$
begin
  update public.student_stats
  set events_attended = events_attended + 1
  where user_id = new.user_id;
  return new;
end;
$$;

drop trigger if exists on_attendance_recorded on public.attendance;
create trigger on_attendance_recorded
  after insert on public.attendance
  for each row execute function public.update_attendance_stats();

-- Update posts_count when post is created
create or replace function public.update_post_stats()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into public.student_stats (user_id, posts_count)
  values (new.user_id, 1)
  on conflict (user_id)
  do update set posts_count = student_stats.posts_count + 1;
  return new;
end;
$$;

drop trigger if exists on_post_created on public.posts;
create trigger on_post_created
  after insert on public.posts
  for each row execute function public.update_post_stats();

-- Notify event participants when event is updated
create or replace function public.notify_event_update()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into public.notifications (user_id, title, message, type, related_id)
  select
    ep.user_id,
    'Event Updated',
    'The event "' || new.title || '" has been updated.',
    'event',
    new.id::text
  from public.event_participants ep
  where ep.event_id = new.id;
  return new;
end;
$$;

drop trigger if exists on_event_update_notification on public.events;
create trigger on_event_update_notification
  after update on public.events
  for each row execute function public.notify_event_update();

-- Update timestamps
create or replace function public.update_updated_at_column()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists update_profiles_updated_at on public.profiles;
create trigger update_profiles_updated_at
  before update on public.profiles
  for each row execute function public.update_updated_at_column();

drop trigger if exists update_events_updated_at on public.events;
create trigger update_events_updated_at
  before update on public.events
  for each row execute function public.update_updated_at_column();

-- 4. ROW LEVEL SECURITY
-- ============================================================
alter table public.profiles enable row level security;
alter table public.events enable row level security;
alter table public.event_participants enable row level security;
alter table public.associations enable row level security;
alter table public.posts enable row level security;
alter table public.comments enable row level security;
alter table public.notifications enable row level security;
alter table public.student_stats enable row level security;
alter table public.attendance enable row level security;
alter table public.resources enable row level security;

-- Drop existing policies
do $$ begin
  drop policy if exists "profiles_select" on public.profiles;
  drop policy if exists "profiles_update" on public.profiles;
  drop policy if exists "events_select" on public.events;
  drop policy if exists "events_insert" on public.events;
  drop policy if exists "events_update" on public.events;
  drop policy if exists "events_delete" on public.events;
  drop policy if exists "participants_select" on public.event_participants;
  drop policy if exists "participants_insert" on public.event_participants;
  drop policy if exists "participants_delete" on public.event_participants;
  drop policy if exists "associations_select" on public.associations;
  drop policy if exists "associations_insert" on public.associations;
  drop policy if exists "associations_update" on public.associations;
  drop policy if exists "associations_delete" on public.associations;
  drop policy if exists "posts_select" on public.posts;
  drop policy if exists "posts_insert" on public.posts;
  drop policy if exists "posts_delete" on public.posts;
  drop policy if exists "comments_select" on public.comments;
  drop policy if exists "comments_insert" on public.comments;
  drop policy if exists "comments_delete" on public.comments;
  drop policy if exists "notifications_select" on public.notifications;
  drop policy if exists "notifications_update" on public.notifications;
  drop policy if exists "notifications_delete" on public.notifications;
  drop policy if exists "student_stats_select" on public.student_stats;
  drop policy if exists "attendance_select" on public.attendance;
  drop policy if exists "attendance_insert" on public.attendance;
  drop policy if exists "resources_select" on public.resources;
  drop policy if exists "resources_insert" on public.resources;
end $$;

-- PROFILES
create policy "profiles_select" on public.profiles for select using (true);
create policy "profiles_update" on public.profiles for update using (auth.uid() = id);

-- EVENTS
create policy "events_select" on public.events for select using (true);
create policy "events_insert" on public.events for insert with check (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'moderator'))
);
create policy "events_update" on public.events for update using (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'moderator'))
);
create policy "events_delete" on public.events for delete using (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'moderator'))
);

-- EVENT PARTICIPANTS
create policy "participants_select" on public.event_participants for select using (true);
create policy "participants_insert" on public.event_participants for insert with check (auth.uid() = user_id);
create policy "participants_delete" on public.event_participants for delete using (auth.uid() = user_id);

-- ASSOCIATIONS
create policy "associations_select" on public.associations for select using (true);
create policy "associations_insert" on public.associations for insert with check (auth.role() = 'authenticated');
create policy "associations_update" on public.associations for update using (
  auth.uid() = created_by or exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
create policy "associations_delete" on public.associations for delete using (
  auth.uid() = created_by or exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- POSTS
create policy "posts_select" on public.posts for select using (true);
create policy "posts_insert" on public.posts for insert with check (auth.uid() = user_id);
create policy "posts_delete" on public.posts for delete using (
  auth.uid() = user_id or exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- COMMENTS
create policy "comments_select" on public.comments for select using (true);
create policy "comments_insert" on public.comments for insert with check (auth.uid() = user_id);
create policy "comments_delete" on public.comments for delete using (
  auth.uid() = user_id or exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- NOTIFICATIONS
create policy "notifications_select" on public.notifications for select using (auth.uid() = user_id);
create policy "notifications_update" on public.notifications for update using (auth.uid() = user_id);
create policy "notifications_delete" on public.notifications for delete using (auth.uid() = user_id);

-- STUDENT STATS
create policy "student_stats_select" on public.student_stats for select using (true);
create policy "admin_all" on public.student_stats for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- ATTENDANCE
create policy "attendance_select" on public.attendance for select using (true);
create policy "attendance_insert" on public.attendance for insert with check (auth.uid() = user_id);

-- RESOURCES
create policy "resources_select" on public.resources for select using (true);
create policy "resources_insert" on public.resources for insert with check (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'moderator'))
);
