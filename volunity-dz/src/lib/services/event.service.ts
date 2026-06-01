import { createClient } from '@/lib/supabase/client';
import type { Event, EventInsert, EventParticipant, Profile } from '@/lib/database.types';

export function getEventService() {
  const supabase = createClient();

  return {
    // ── CRUD ──────────────────────────────────────
    async createEvent(event: EventInsert): Promise<Event> {
      const { data, error } = await supabase
        .from('events')
        .insert(event as any)
        .select()
        .single();
      if (error) throw error;
      return data as Event;
    },

    async getEvent(eventId: string): Promise<Event | null> {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', eventId)
        .single();
      if (error && error.code !== 'PGRST116') throw error;
      return data as Event | null;
    },

    async getEvents(options?: {
      category?: string;
      status?: string;
      organizerId?: string;
      featured?: boolean;
      limit?: number;
      offset?: number;
      search?: string;
    }): Promise<Event[]> {
      let query = supabase.from('events').select('*');

      if (options?.category) query = query.eq('category', options.category);
      if (options?.status) query = query.eq('status', options.status);
      else query = query.in('status', ['upcoming', 'ongoing']);
      if (options?.organizerId) query = query.eq('organizer_id', options.organizerId);
      if (options?.featured) query = query.eq('featured', true);
      if (options?.search) {
        query = query.or(
          `title.ilike.%${options.search}%,description.ilike.%${options.search}%,location.ilike.%${options.search}%`
        );
      }

      query = query
        .order('date', { ascending: true })
        .order('created_at', { ascending: false });

      if (options?.limit) {
        query = query.range(options.offset || 0, (options.offset || 0) + options.limit - 1);
      }

      const { data, error } = await query;
      if (error) throw error;
      return (data || []) as Event[];
    },

    async updateEvent(eventId: string, updates: Partial<Event>): Promise<Event> {
      const { data, error } = await supabase
        .from('events')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', eventId)
        .select()
        .single();
      if (error) throw error;
      return data as Event;
    },

    async deleteEvent(eventId: string): Promise<void> {
      const { error } = await supabase.from('events').delete().eq('id', eventId);
      if (error) throw error;
    },

    async getEventsCount(options?: { category?: string; status?: string }): Promise<number> {
      let query = supabase.from('events').select('*', { count: 'exact', head: true });
      if (options?.category) query = query.eq('category', options.category);
      if (options?.status) query = query.eq('status', options.status);
      const { count, error } = await query;
      if (error) throw error;
      return count || 0;
    },

    // ── PARTICIPATION ────────────────────────────
    async joinEvent(eventId: string, userId: string): Promise<EventParticipant> {
      const { data, error } = await supabase
        .from('event_participants')
        .insert({ event_id: eventId, user_id: userId, status: 'confirmed' } as any)
        .select()
        .single();
      if (error) throw error;
      return data as EventParticipant;
    },

    async leaveEvent(eventId: string, userId: string): Promise<void> {
      const { error } = await supabase
        .from('event_participants')
        .delete()
        .eq('event_id', eventId)
        .eq('user_id', userId);
      if (error) throw error;
    },

    async getParticipant(eventId: string, userId: string): Promise<EventParticipant | null> {
      const { data, error } = await supabase
        .from('event_participants')
        .select('*')
        .eq('event_id', eventId)
        .eq('user_id', userId)
        .maybeSingle();
      if (error) throw error;
      return data as EventParticipant | null;
    },

    async getParticipants(eventId: string): Promise<(EventParticipant & { profile?: Pick<Profile, 'name' | 'avatar_url' | 'city'> })[]> {
      const { data, error } = await supabase
        .from('event_participants')
        .select('*, profile:profiles(name, avatar_url, city)')
        .eq('event_id', eventId)
        .order('joined_at', { ascending: true });
      if (error) throw error;
      return (data || []) as any;
    },

    async getUserEvents(userId: string): Promise<(EventParticipant & { event?: Event })[]> {
      const { data, error } = await supabase
        .from('event_participants')
        .select('*, event:events(*)')
        .eq('user_id', userId)
        .order('joined_at', { ascending: false });
      if (error) throw error;
      return (data || []) as any;
    },

    async markAttendance(eventId: string, userId: string): Promise<void> {
      const { error } = await supabase
        .from('event_participants')
        .update({ status: 'attended' })
        .eq('event_id', eventId)
        .eq('user_id', userId);
      if (error) throw error;
    },

    async getParticipantCount(eventId: string): Promise<number> {
      const { count, error } = await supabase
        .from('event_participants')
        .select('*', { count: 'exact', head: true })
        .eq('event_id', eventId)
        .eq('status', 'confirmed');
      if (error) throw error;
      return count || 0;
    },
  };
}
