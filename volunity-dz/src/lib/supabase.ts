export { createClient as createBrowserClient } from '@/lib/supabase/client';
export { createClient as createServerClient } from '@/lib/supabase/server';
export type {
  Profile,
  Event,
  EventParticipant,
  Association,
  AssociationMember,
  BadgeRow,
  UserBadge,
  NotificationRow,
  ProfileInsert,
  EventInsert,
  AssociationInsert,
} from '@/lib/database.types';
