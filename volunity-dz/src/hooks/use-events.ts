'use client';

import * as React from 'react';
import { createClient } from '@/lib/supabase/client';
import { getEventService } from '@/lib/services/event.service';
import type { Event, EventParticipant } from '@/lib/database.types';

export function useEvent(eventId: string | undefined) {
  const [event, setEvent] = React.useState<Event | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!eventId) return;
    const svc = getEventService();

    const load = async () => {
      setLoading(true);
      try {
        const data = await svc.getEvent(eventId);
        setEvent(data);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    load();

    // Real-time subscription
    const supabase = createClient();
    const channel = supabase
      .channel(`event:${eventId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'events',
          filter: `id=eq.${eventId}`,
        },
        (payload) => {
          if (payload.eventType === 'UPDATE') {
            setEvent(payload.new as Event);
          }
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel).catch(() => {}); };
  }, [eventId]);

  return { event, loading, error };
}

export function useEvents(options?: {
  category?: string;
  status?: string;
  featured?: boolean;
  limit?: number;
  search?: string;
}) {
  const [events, setEvents] = React.useState<Event[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const svc = getEventService();

    svc.getEvents(options)
      .then((data) => setEvents(data))
      .catch((e: any) => setError(e.message))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options?.category, options?.status, options?.featured, options?.limit, options?.search]);

  return { events, loading, error };
}

export function useParticipant(eventId: string | undefined, userId: string | undefined) {
  const [participant, setParticipant] = React.useState<EventParticipant | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!eventId || !userId) return;
    const svc = getEventService();

    const load = async () => {
      setLoading(true);
      try {
        const data = await svc.getParticipant(eventId, userId);
        setParticipant(data);
      } finally {
        setLoading(false);
      }
    };

    load();

    // Real-time
    const supabase = createClient();
    const channel = supabase
      .channel(`participant:${eventId}:${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'event_participants',
          filter: `event_id=eq.${eventId}`,
        },
        () => load()
      )
      .subscribe();

    return () => { supabase.removeChannel(channel).catch(() => {}); };
  }, [eventId, userId]);

  return { participant, loading };
}

export function useParticipants(eventId: string | undefined) {
  const [participants, setParticipants] = React.useState<any[]>([]);
  const [count, setCount] = React.useState(0);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!eventId) return;
    const svc = getEventService();

    const load = async () => {
      setLoading(true);
      try {
        const [data, cnt] = await Promise.all([
          svc.getParticipants(eventId),
          svc.getParticipantCount(eventId),
        ]);
        setParticipants(data);
        setCount(cnt);
      } finally {
        setLoading(false);
      }
    };

    load();

    const supabase = createClient();
    const channel = supabase
      .channel(`participants:${eventId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'event_participants',
          filter: `event_id=eq.${eventId}`,
        },
        () => load()
      )
      .subscribe();

    return () => { supabase.removeChannel(channel).catch(() => {}); };
  }, [eventId]);

  return { participants, count, loading, refetch: () => {} };
}
