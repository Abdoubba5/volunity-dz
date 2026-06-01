import { createClient } from '@/lib/supabase/client';

export interface DashboardStats {
  eventsRegistered: number;
  eventsAttended: number;
  postsCount: number;
  upcomingEvents: number;
}

export function getDashboardService() {
  const supabase = createClient();

  return {
    async getStats(userId: string): Promise<DashboardStats> {
      const { count: eventsRegistered } = await supabase
        .from('event_participants')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

      const { count: eventsAttended } = await supabase
        .from('attendance')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

      const { count: postsCount } = await supabase
        .from('posts')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

      const now = new Date().toISOString();
      const { count: upcomingEvents } = await supabase
        .from('event_participants')
        .select('*, event:events!inner(date)', { count: 'exact', head: true })
        .eq('user_id', userId)
        .gte('event.date', now);

      return {
        eventsRegistered: eventsRegistered || 0,
        eventsAttended: eventsAttended || 0,
        postsCount: postsCount || 0,
        upcomingEvents: upcomingEvents || 0,
      };
    },

    async getUpcomingEvents(userId: string, limit = 5) {
      const now = new Date().toISOString();
      const { data, error } = await supabase
        .from('event_participants')
        .select('*, event:events(*)')
        .eq('user_id', userId)
        .gte('event.date', now)
        .order('event.date', { ascending: true })
        .limit(limit);

      if (error) throw error;
      return ((data || []) as any[]).map((d: any) => d.event).filter(Boolean);
    },

    async getRecentActivity(userId: string, limit = 10) {
      const { data: events } = await supabase
        .from('event_participants')
        .select('*, event:events(title)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      const { data: posts } = await supabase
        .from('posts')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      return {
        events: (events || []) as any[],
        posts: (posts || []) as any[],
      };
    },

    async getAdminStats() {
      const { count: totalUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      const { count: totalEvents } = await supabase
        .from('events')
        .select('*', { count: 'exact', head: true });

      const { count: totalPosts } = await supabase
        .from('posts')
        .select('*', { count: 'exact', head: true });

      const { count: totalAssociations } = await supabase
        .from('associations')
        .select('*', { count: 'exact', head: true });

      return {
        totalUsers: totalUsers || 0,
        totalEvents: totalEvents || 0,
        totalPosts: totalPosts || 0,
        totalAssociations: totalAssociations || 0,
      };
    },
  };
}
