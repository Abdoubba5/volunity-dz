import { createClient } from '@/lib/supabase/client';
import type { AnalyticsEvent, DailyMetric } from '@/lib/database.types';

type TrackEvent = {
  event_type: AnalyticsEvent['event_type'];
  event_name: string;
  event_data?: Record<string, unknown>;
  page_url?: string;
};

let sessionId: string | null = null;

function getSessionId(): string {
  if (!sessionId) {
    sessionId = crypto.randomUUID();
  }
  return sessionId;
}

export function getAnalyticsService() {
  const supabase = createClient();

  const track = async (event: TrackEvent) => {
    try {
      await supabase.from('analytics_events').insert({
        event_type: event.event_type,
        event_name: event.event_name,
        event_data: event.event_data ?? {},
        session_id: getSessionId(),
        page_url: event.page_url ?? (typeof window !== 'undefined' ? window.location.pathname : ''),
        user_agent: typeof window !== 'undefined' ? window.navigator.userAgent.slice(0, 500) : null,
      } as any);
    } catch {
      // Analytics failures must never break the app
    }
  };

  return {
    trackPageView: (url: string) =>
      track({ event_type: 'page_view', event_name: 'page_view', page_url: url }),

    trackAction: (name: string, data?: Record<string, unknown>) =>
      track({ event_type: 'action', event_name: name, event_data: data }),

    trackError: (name: string, data?: Record<string, unknown>) =>
      track({ event_type: 'error', event_name: name, event_data: data }),

    trackPerformance: (name: string, data?: Record<string, unknown>) =>
      track({ event_type: 'performance', event_name: name, event_data: data }),

    // Analytics queries (admin only)
    async getDailyMetrics(days = 30): Promise<DailyMetric[]> {
      const { data } = await supabase
        .from('daily_metrics')
        .select('*')
        .order('date', { ascending: false })
        .limit(days);
      return (data || []) as DailyMetric[];
    },

    async getEventAnalytics(eventId: string) {
      const { data: participants } = await supabase
        .from('event_participants')
        .select('status, created_at, profile:profiles(full_name, avatar_url, faculty)')
        .eq('event_id', eventId);

      const { count: attendanceCount } = await supabase
        .from('attendance')
        .select('*', { count: 'exact', head: true })
        .eq('event_id', eventId);

      const registered = participants?.filter((p: any) => p.status === 'registered').length ?? 0;
      const attended = participants?.filter((p: any) => p.status === 'attended').length ?? 0;

      return {
        totalRegistered: registered + attended,
        attended: attendanceCount ?? 0,
        noShow: registered,
        participantsByFaculty: (participants || []).reduce((acc: Record<string, number>, p: any) => {
          const faculty = p.profile?.faculty || 'Unknown';
          acc[faculty] = (acc[faculty] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
      };
    },

    async getPlatformTrends(days = 30) {
      const metrics = await this.getDailyMetrics(days);
      return {
        usersGrowth: metrics.length >= 2
          ? metrics[0].total_users - metrics[metrics.length - 1].total_users
          : 0,
        eventsGrowth: metrics.length >= 2
          ? metrics[0].total_events - metrics[metrics.length - 1].total_events
          : 0,
        dailyMetrics: metrics,
      };
    },
  };
}
