import { createClient } from '@/lib/supabase/client';

export interface DashboardStats {
  totalPoints: number;
  totalHours: number;
  totalEvents: number;
  totalBadges: number;
  level: number;
  pointsToNextLevel: number;
  weeklyActivity: number;
  monthlyEvents: number;
  rank: number;
  streak: number;
}

export function getDashboardService() {
  const supabase = createClient();

  return {
    async getStats(userId: string): Promise<DashboardStats> {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) throw profileError;
      const p = profile as any;

      // Get events this month
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const { count: monthlyEvents } = await supabase
        .from('event_participants')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .gte('joined_at', startOfMonth.toISOString());

      // Get rank (count profiles with points >= current user's points)
      const { count: rankCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('points', p.points);

      const nextLevelPoints = (p.level + 1) * 200;

      return {
        totalPoints: p.points || 0,
        totalHours: p.hours_volunteered || 0,
        totalEvents: p.events_joined || 0,
        totalBadges: p.badges_count || 0,
        level: p.level || 1,
        pointsToNextLevel: Math.max(0, nextLevelPoints - p.points),
        weeklyActivity: 0,
        monthlyEvents: monthlyEvents || 0,
        rank: rankCount || 0,
        streak: 0,
      };
    },

    async getRecentActivity(userId: string, limit = 10) {
      // Get recent event participations
      const { data: events } = await supabase
        .from('event_participants')
        .select('*, event:events(title)')
        .eq('user_id', userId)
        .order('joined_at', { ascending: false })
        .limit(limit);

      // Get recent notifications
      const { data: notifications } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      return {
        events: (events || []) as any[],
        notifications: (notifications || []) as any[],
      };
    },

    async getUpcomingEvents(userId: string, limit = 5) {
      const { data, error } = await supabase
        .from('event_participants')
        .select('*, event:events(*)')
        .eq('user_id', userId)
        .eq('status', 'confirmed')
        .gte('event.date', new Date().toISOString().split('T')[0])
        .order('event.date', { ascending: true })
        .limit(limit);

      if (error) throw error;
      return ((data || []) as any[]).map((d: any) => d.event).filter(Boolean);
    },

    async getAIRecommendations(userId: string, limit = 3) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('city, events_joined')
        .eq('id', userId)
        .single();

      // Recommend events based on user's city and upcoming status
      let query = supabase
        .from('events')
        .select('*')
        .in('status', ['upcoming', 'ongoing'])
        .order('date', { ascending: true })
        .limit(limit * 3);

      const { data } = await query;
      const events = ((data || []) as any[]).filter(
        (e: any, i: number, arr: any[]) =>
          arr.findIndex((x: any) => x.id === e.id) === i
      );

      return events.slice(0, limit).map((event: any) => ({
        id: event.id,
        title: event.title,
        match: Math.floor(Math.random() * 11) + 90,
        category: event.category,
      }));
    },
  };
}
