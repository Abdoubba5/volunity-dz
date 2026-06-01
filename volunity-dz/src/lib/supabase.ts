export { createClient as createBrowserClient } from '@/lib/supabase/client';
export { createClient as createServerClient } from '@/lib/supabase/server';
export type {
  Profile,
  Event,
  EventParticipant,
  Association,
  Notification,
  StudentStat,
  Post,
  Comment,
  Resource,
  AttendanceRecord,
} from '@/lib/database.types';
