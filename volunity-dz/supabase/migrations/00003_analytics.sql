-- ============================================================
-- Volunity DZ - Analytics & Monitoring Schema
-- Run AFTER 00001_schema.sql in Supabase SQL Editor
-- ============================================================

-- 1. ANALYTICS EVENTS TABLE
-- ============================================================
-- Tracks page views, user actions, errors, and performance metrics
create table if not exists public.analytics_events (
  id uuid default gen_random_uuid() primary key,
  event_type text not null check (event_type in (
    'page_view', 'action', 'error', 'performance', 'navigation'
  )),
  user_id uuid references public.profiles(id) on delete set null,
  event_name text not null,
  event_data jsonb default '{}'::jsonb,
  session_id text,
  page_url text,
  user_agent text,
  ip_address text,
  created_at timestamptz not null default now()
);

-- 2. DAILY METRICS (materialized aggregations for admin)
-- ============================================================
create table if not exists public.daily_metrics (
  id uuid default gen_random_uuid() primary key,
  date date not null default current_date,
  total_users integer not null default 0,
  new_users integer not null default 0,
  active_users integer not null default 0,
  total_events integer not null default 0,
  events_created integer not null default 0,
  total_participants integer not null default 0,
  new_participants integer not null default 0,
  total_posts integer not null default 0,
  posts_created integer not null default 0,
  total_associations integer not null default 0,
  page_views integer not null default 0,
  unique(date)
);

-- 3. INDEXES
-- ============================================================
create index if not exists analytics_events_type_idx on public.analytics_events(event_type);
create index if not exists analytics_events_created_at_idx on public.analytics_events(created_at desc);
create index if not exists analytics_events_user_id_idx on public.analytics_events(user_id);
create index if not exists analytics_events_session_idx on public.analytics_events(session_id);
create index if not exists analytics_events_name_idx on public.analytics_events(event_name);
create index if not exists daily_metrics_date_idx on public.daily_metrics(date desc);

-- 4. AUTO-CLEANUP: Archive analytics older than 90 days
-- ============================================================
create or replace function public.cleanup_old_analytics()
returns void
language plpgsql
security definer
as $$
begin
  delete from public.analytics_events
  where created_at < now() - interval '90 days';
end;
$$;

-- 5. ROW LEVEL SECURITY
-- ============================================================
alter table public.analytics_events enable row level security;
alter table public.daily_metrics enable row level security;

do $$ begin
  drop policy if exists "analytics_insert" on public.analytics_events;
  drop policy if exists "analytics_select_admin" on public.analytics_events;
  drop policy if exists "daily_metrics_select_admin" on public.daily_metrics;
end $$;

-- Anyone authenticated can insert analytics events (for page views, etc.)
create policy "analytics_insert" on public.analytics_events
  for insert with check (auth.role() = 'authenticated');

-- Only admins can view analytics events
create policy "analytics_select_admin" on public.analytics_events
  for select using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- Only admins can view daily metrics
create policy "daily_metrics_select_admin" on public.daily_metrics
  for select using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- 6. DAILY METRICS AGGREGATION FUNCTION
-- ============================================================
create or replace function public.aggregate_daily_metrics(target_date date default current_date)
returns void
language plpgsql
security definer
as $$
declare
  v_total_users integer;
  v_new_users integer;
  v_total_events integer;
  v_events_created integer;
  v_total_participants integer;
  v_new_participants integer;
  v_total_posts integer;
  v_posts_created integer;
  v_total_associations integer;
  v_page_views integer;
begin
  -- Count users
  select count(*) into v_total_users from public.profiles;
  select count(*) into v_new_users from public.profiles
    where created_at::date = target_date;

  -- Count events
  select count(*) into v_total_events from public.events;
  select count(*) into v_events_created from public.events
    where created_at::date = target_date;

  -- Count participants
  select count(*) into v_total_participants from public.event_participants;
  select count(*) into v_new_participants from public.event_participants
    where created_at::date = target_date;

  -- Count posts
  select count(*) into v_total_posts from public.posts;
  select count(*) into v_posts_created from public.posts
    where created_at::date = target_date;

  -- Count associations
  select count(*) into v_total_associations from public.associations;

  -- Count page views from analytics
  select count(*) into v_page_views from public.analytics_events
    where event_type = 'page_view'
    and created_at::date = target_date;

  -- Upsert
  insert into public.daily_metrics (
    date, total_users, new_users, total_events, events_created,
    total_participants, new_participants, total_posts, posts_created,
    total_associations, page_views
  ) values (
    target_date, v_total_users, v_new_users, v_total_events, v_events_created,
    v_total_participants, v_new_participants, v_total_posts, v_posts_created,
    v_total_associations, v_page_views
  )
  on conflict (date) do update set
    total_users = excluded.total_users,
    new_users = excluded.new_users,
    total_events = excluded.total_events,
    events_created = excluded.events_created,
    total_participants = excluded.total_participants,
    new_participants = excluded.new_participants,
    total_posts = excluded.total_posts,
    posts_created = excluded.posts_created,
    total_associations = excluded.total_associations,
    page_views = excluded.page_views;
end;
$$;
