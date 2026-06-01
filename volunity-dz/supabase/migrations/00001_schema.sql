-- ============================================================
-- Volunity DZ - Complete Database Schema
-- Paste this directly into Supabase SQL Editor and run
-- ============================================================

-- 1. TABLES
-- ============================================================

-- PROFILES (extends auth.users)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  name text not null,
  username text unique,
  avatar_url text,
  bio text,
  university text,
  city text,
  points integer not null default 0,
  level integer not null default 1,
  role text not null default 'user'::text check (role in ('user', 'association', 'admin')),
  followers_count integer not null default 0,
  following_count integer not null default 0,
  hours_volunteered integer not null default 0,
  events_joined integer not null default 0,
  badges_count integer not null default 0,
  onboarding_complete boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- EVENTS
create table if not exists public.events (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  category text not null check (category in ('education', 'environment', 'health', 'culture', 'sports', 'social')),
  location text not null,
  date date not null,
  time text,
  image_url text,
  capacity integer not null default 0,
  participants_count integer not null default 0,
  points_reward integer not null default 100,
  organizer_id uuid not null references public.profiles(id) on delete cascade,
  status text not null default 'upcoming'::text check (status in ('upcoming', 'ongoing', 'completed', 'cancelled')),
  featured boolean not null default false,
  tags text[] default '{}'::text[],
  requirements text[] default '{}'::text[],
  schedule jsonb default '[]'::jsonb,
  gallery text[] default '{}'::text[],
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- EVENT PARTICIPANTS
create table if not exists public.event_participants (
  id uuid default gen_random_uuid() primary key,
  event_id uuid not null references public.events(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  status text not null default 'confirmed'::text check (status in ('confirmed', 'attended', 'cancelled')),
  joined_at timestamptz not null default now(),
  unique(event_id, user_id)
);

-- ASSOCIATIONS
create table if not exists public.associations (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  logo_url text,
  cover_url text,
  website text,
  verified boolean not null default false,
  owner_id uuid not null references public.profiles(id) on delete cascade,
  location text,
  founded text,
  category text check (category in ('education', 'environment', 'health', 'culture', 'sports', 'social')),
  followers_count integer not null default 0,
  events_count integer not null default 0,
  members_count integer not null default 0,
  impact jsonb default '{"trees_planted": 0, "cleanups": 0, "volunteers": 0, "cities": 0}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ASSOCIATION MEMBERS
create table if not exists public.association_members (
  id uuid default gen_random_uuid() primary key,
  association_id uuid not null references public.associations(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role text not null default 'member'::text check (role in ('admin', 'moderator', 'member')),
  joined_at timestamptz not null default now(),
  unique(association_id, user_id)
);

-- BADGES (definitions)
create table if not exists public.badges (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  icon text,
  tier text not null default 'bronze'::text check (tier in ('bronze', 'silver', 'gold')),
  required_points integer not null default 0,
  created_at timestamptz not null default now()
);

-- USER BADGES (earned badges - join table)
create table if not exists public.user_badges (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null references public.profiles(id) on delete cascade,
  badge_id uuid not null references public.badges(id) on delete cascade,
  earned_at timestamptz not null default now(),
  unique(user_id, badge_id)
);

-- NOTIFICATIONS
create table if not exists public.notifications (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null references public.profiles(id) on delete cascade,
  type text not null check (type in ('event', 'badge', 'social', 'system')),
  title text not null,
  description text,
  icon text default 'bell'::text,
  link text,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

-- 2. INDEXES
-- ============================================================
create index if not exists events_organizer_id_idx on public.events(organizer_id);
create index if not exists events_date_idx on public.events(date desc);
create index if not exists events_category_idx on public.events(category);
create index if not exists events_status_idx on public.events(status);
create index if not exists event_participants_event_id_idx on public.event_participants(event_id);
create index if not exists event_participants_user_id_idx on public.event_participants(user_id);
create index if not exists event_participants_status_idx on public.event_participants(status);
create index if not exists notifications_user_id_idx on public.notifications(user_id);
create index if not exists notifications_unread_idx on public.notifications(user_id, read) where read = false;
create index if not exists user_badges_user_id_idx on public.user_badges(user_id);
create index if not exists profiles_points_idx on public.profiles(points desc);
create index if not exists profiles_level_idx on public.profiles(level desc);
create index if not exists profiles_hours_idx on public.profiles(hours_volunteered desc);
create index if not exists associations_followers_idx on public.associations(followers_count desc);

-- 3. FUNCTIONS & TRIGGERS
-- ============================================================

-- 3a. Auto-create profile on user signup (handles both email+password and OAuth)
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, name, avatar_url)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data ->> 'name',
      new.raw_user_meta_data ->> 'full_name',
      split_part(new.email, '@', 1)
    ),
    coalesce(
      new.raw_user_meta_data ->> 'avatar_url',
      new.raw_user_meta_data ->> 'picture'
    )
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 3b. Update participant count when joining/leaving events
create or replace function public.update_event_participant_count()
returns trigger
language plpgsql
security definer
as $$
begin
  if tg_op = 'INSERT' then
    update public.events set participants_count = participants_count + 1 where id = new.event_id;
    update public.profiles set events_joined = events_joined + 1 where id = new.user_id;
    return new;
  elsif tg_op = 'DELETE' then
    update public.events set participants_count = greatest(0, participants_count - 1) where id = old.event_id;
    return old;
  end if;
end;
$$;

drop trigger if exists on_event_participant_change on public.event_participants;
create trigger on_event_participant_change
  after insert or delete on public.event_participants
  for each row execute function public.update_event_participant_count();

-- 3c. Award points when status becomes 'attended'
create or replace function public.award_attendance_points()
returns trigger
language plpgsql
security definer
as $$
declare
  event_points integer;
begin
  if new.status = 'attended' and (old is null or old.status != 'attended') then
    select coalesce(points_reward, 100) into event_points from public.events where id = new.event_id;
    update public.profiles
    set
      points = points + event_points,
      hours_volunteered = hours_volunteered + 2
    where id = new.user_id;
  end if;
  return new;
end;
$$;

drop trigger if exists on_participant_status_change on public.event_participants;
create trigger on_participant_status_change
  after insert or update on public.event_participants
  for each row execute function public.award_attendance_points();

-- 3d. Auto-notification to organizer on event creation
create or replace function public.handle_event_notification()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into public.notifications (user_id, type, title, description, link, icon)
  values (
    new.organizer_id,
    'system',
    'Event Created',
    'Your event "' || new.title || '" has been created successfully.',
    '/events/' || new.id,
    'calendar'
  );
  return new;
end;
$$;

drop trigger if exists on_event_created on public.events;
create trigger on_event_created
  after insert on public.events
  for each row execute function public.handle_event_notification();

-- 3e. Notify participants when event details change
create or replace function public.handle_event_update_notification()
returns trigger
language plpgsql
security definer
as $$
begin
  if old.title != new.title or old.date != new.date or old.status != new.status then
    insert into public.notifications (user_id, type, title, description, link, icon)
    select
      ep.user_id,
      'event',
      'Event Updated',
      'Event "' || new.title || '" has been updated.',
      '/events/' || new.id,
      'calendar'
    from public.event_participants ep
    where ep.event_id = new.id and ep.status = 'confirmed';
  end if;
  return new;
end;
$$;

drop trigger if exists on_event_updated on public.events;
create trigger on_event_updated
  after update on public.events
  for each row execute function public.handle_event_update_notification();

-- 3f. Auto level-up when points increase
create or replace function public.check_level_up()
returns trigger
language plpgsql
security definer
as $$
begin
  if new.points > old.points then
    new.level := greatest(1, floor(new.points / 200)::int + 1);
  end if;
  return new;
end;
$$;

drop trigger if exists on_profile_points_update on public.profiles;
create trigger on_profile_points_update
  before update of points on public.profiles
  for each row execute function public.check_level_up();

-- 3g. Auto-increment badges_count and create notification when a badge is earned
create or replace function public.update_badges_count()
returns trigger
language plpgsql
security definer
as $$
begin
  update public.profiles set badges_count = badges_count + 1 where id = new.user_id;
  insert into public.notifications (user_id, type, title, description, link, icon)
  select
    new.user_id,
    'badge',
    'Badge Earned!',
    'You earned the "' || b.name || '" badge!',
    '/profile/' || new.user_id,
    'award'
  from public.badges b
  where b.id = new.badge_id;
  return new;
end;
$$;

drop trigger if exists on_user_badge_earned on public.user_badges;
create trigger on_user_badge_earned
  after insert on public.user_badges
  for each row execute function public.update_badges_count();

-- 3h. Update timestamps on row change
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

drop trigger if exists update_associations_updated_at on public.associations;
create trigger update_associations_updated_at
  before update on public.associations
  for each row execute function public.update_updated_at_column();

-- 4. ROW LEVEL SECURITY
-- ============================================================
alter table public.profiles enable row level security;
alter table public.events enable row level security;
alter table public.event_participants enable row level security;
alter table public.associations enable row level security;
alter table public.association_members enable row level security;
alter table public.badges enable row level security;
alter table public.user_badges enable row level security;
alter table public.notifications enable row level security;

-- Drop existing policies before creating
drop policy if exists "profiles_select" on public.profiles;
drop policy if exists "profiles_insert" on public.profiles;
drop policy if exists "profiles_update" on public.profiles;
drop policy if exists "events_select" on public.events;
drop policy if exists "events_insert" on public.events;
drop policy if exists "events_update" on public.events;
drop policy if exists "events_delete" on public.events;
drop policy if exists "participants_select" on public.event_participants;
drop policy if exists "participants_insert" on public.event_participants;
drop policy if exists "participants_update" on public.event_participants;
drop policy if exists "participants_delete" on public.event_participants;
drop policy if exists "associations_select" on public.associations;
drop policy if exists "associations_insert" on public.associations;
drop policy if exists "associations_update" on public.associations;
drop policy if exists "associations_delete" on public.associations;
drop policy if exists "members_select" on public.association_members;
drop policy if exists "members_insert" on public.association_members;
drop policy if exists "members_update" on public.association_members;
drop policy if exists "members_delete" on public.association_members;
drop policy if exists "badges_select" on public.badges;
drop policy if exists "badges_insert" on public.badges;
drop policy if exists "badges_update" on public.badges;
drop policy if exists "user_badges_select" on public.user_badges;
drop policy if exists "user_badges_insert" on public.user_badges;
drop policy if exists "notifications_select" on public.notifications;
drop policy if exists "notifications_update" on public.notifications;
drop policy if exists "notifications_delete" on public.notifications;

-- PROFILES
create policy "profiles_select" on public.profiles for select using (true);
create policy "profiles_insert" on public.profiles for insert with check (auth.uid() = id);
create policy "profiles_update" on public.profiles for update using (auth.uid() = id);

-- EVENTS
create policy "events_select" on public.events for select using (true);
create policy "events_insert" on public.events for insert with check (auth.role() = 'authenticated');
create policy "events_update" on public.events for update using (auth.uid() = organizer_id);
create policy "events_delete" on public.events for delete using (auth.uid() = organizer_id);

-- EVENT PARTICIPANTS
create policy "participants_select" on public.event_participants for select using (true);
create policy "participants_insert" on public.event_participants for insert with check (auth.uid() = user_id);
create policy "participants_update" on public.event_participants for update using (auth.uid() = user_id);
create policy "participants_delete" on public.event_participants for delete using (auth.uid() = user_id);

-- ASSOCIATIONS
create policy "associations_select" on public.associations for select using (true);
create policy "associations_insert" on public.associations for insert with check (auth.role() = 'authenticated');
create policy "associations_update" on public.associations for update using (auth.uid() = owner_id);
create policy "associations_delete" on public.associations for delete using (auth.uid() = owner_id);

-- ASSOCIATION MEMBERS
create policy "members_select" on public.association_members for select using (true);
create policy "members_insert" on public.association_members for insert with check (auth.role() = 'authenticated');
create policy "members_update" on public.association_members for update using (exists (
  select 1 from public.association_members am
  where am.association_id = association_members.association_id
    and am.user_id = auth.uid()
    and am.role in ('admin', 'moderator')
));
create policy "members_delete" on public.association_members for delete using (auth.uid() = user_id);

-- BADGES (definitions)
create policy "badges_select" on public.badges for select using (true);
create policy "badges_insert" on public.badges for insert with check (auth.role() = 'authenticated');
create policy "badges_update" on public.badges for update using (auth.role() = 'authenticated');

-- USER BADGES
create policy "user_badges_select" on public.user_badges for select using (true);
create policy "user_badges_insert" on public.user_badges for insert with check (auth.uid() = user_id);

-- NOTIFICATIONS
create policy "notifications_select" on public.notifications for select using (auth.uid() = user_id);
create policy "notifications_update" on public.notifications for update using (auth.uid() = user_id);
create policy "notifications_delete" on public.notifications for delete using (auth.uid() = user_id);

-- 5. SEED DATA (badges definitions)
-- ============================================================
insert into public.badges (name, description, icon, tier, required_points)
values
  ('First Steps', 'Joined your first event', '🌱', 'bronze', 0),
  ('Community Helper', 'Completed 5 events', '🤝', 'bronze', 500),
  ('Eco Warrior', 'Participated in 10 environmental events', '🌍', 'silver', 1000),
  ('Dedicated Volunteer', 'Completed 20 events', '⭐', 'silver', 2000),
  ('Community Hero', 'Completed 50 events', '🦸', 'gold', 5000),
  ('Early Bird', 'Joined 10 morning events', '🌅', 'silver', 1500),
  ('Streak Master', 'Maintained a 30-day volunteering streak', '🔥', 'gold', 3000),
  ('Trailblazer', 'First to join 3 events', '🚀', 'silver', 1000),
  ('Mentor', 'Helped onboard 5 new volunteers', '👨‍🏫', 'bronze', 800),
  ('Globetrotter', 'Volunteered in 5 different cities', '🌍', 'silver', 2000),
  ('Social Butterfly', 'Connected with 50 volunteers', '🦋', 'bronze', 500),
  ('Night Owl', 'Participated in 5 evening events', '🦉', 'bronze', 500)
on conflict (id) do nothing;
