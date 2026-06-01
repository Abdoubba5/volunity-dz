import { createClient } from '@/lib/supabase/client';
import type { Event, EventParticipant, Profile } from '@/lib/database.types';

export function getEventService() {
  const supabase = createClient();

  return {
    async createEvent(event: Omit<Event, 'id' | 'created_at' | 'updated_at'>): Promise<Event> {
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
      limit?: number;
      offset?: number;
      search?: string;
    }): Promise<Event[]> {
      let query = supabase.from('events').select('*');

      if (options?.category) query = query.eq('category', options.category);
      if (options?.search) {
        query = query.or(
          `title.ilike.%${options.search}%,description.ilike.%${options.search}%,location.ilike.%${options.search}%`
        );
      }

      query = query.order('date', { ascending: true });

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

    async joinEvent(eventId: string, userId: string): Promise<EventParticipant> {
      const { data, error } = await supabase
        .from('event_participants')
        .insert({ event_id: eventId, user_id: userId, status: 'registered' } as any)
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

    async getParticipants(eventId: string): Promise<(EventParticipant & { profile?: Pick<Profile, 'full_name' | 'avatar_url'> })[]> {
      const { data, error } = await supabase
        .from('event_participants')
        .select('*, profile:profiles(full_name, avatar_url)')
        .eq('event_id', eventId)
        .order('created_at', { ascending: true });
      if (error) throw error;
      return (data || []) as any;
    },

    async getUserEvents(userId: string): Promise<(EventParticipant & { event?: Event })[]> {
      const { data, error } = await supabase
        .from('event_participants')
        .select('*, event:events(*)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []) as any;
    },

    async markAttendance(eventId: string, userId: string): Promise<void> {
      const { error } = await supabase
        .from('attendance')
        .insert({ event_id: eventId, user_id: userId } as any);
      if (error && error.code !== '23505') throw error;

      await supabase
        .from('event_participants')
        .update({ status: 'attended' } as any)
        .eq('event_id', eventId)
        .eq('user_id', userId);
    },

    async getParticipantCount(eventId: string): Promise<number> {
      const { count, error } = await supabase
        .from('event_participants')
        .select('*', { count: 'exact', head: true })
        .eq('event_id', eventId);
      if (error) throw error;
      return count || 0;
    },
  };
}
