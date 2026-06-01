import { createClient } from '@/lib/supabase/client';
import type { Profile } from '@/lib/database.types';

export type LeaderboardEntry = Pick<
  Profile,
  'id' | 'name' | 'username' | 'avatar_url' | 'city' | 'points' | 'level' | 'hours_volunteered' | 'events_joined'
>;

export function getLeaderboardService() {
  const supabase = createClient();

  return {
    async getTopVolunteers(limit = 20, period: 'all' | 'month' | 'week' = 'all'): Promise<LeaderboardEntry[]> {
      let query = supabase
        .from('profiles')
        .select('id, name, username, avatar_url, city, points, level, hours_volunteered, events_joined')
        .order('points', { ascending: false })
        .limit(limit);

      const { data, error } = await query;
      if (error) throw error;
      return (data || []) as LeaderboardEntry[];
    },

    async getVolunteerRank(userId: string): Promise<number> {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('points')
        .eq('id', userId)
        .single();
      if (profileError) throw profileError;
      if (!profile) return 0;

      const { count, error: countError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('points', (profile as any).points);
      if (countError) throw countError;
      return count || 0;
    },

    async getTopAssociations(limit = 10) {
      const { data, error } = await supabase
        .from('associations')
        .select('*')
        .order('followers_count', { ascending: false })
        .limit(limit);
      if (error) throw error;
      return (data || []) as any[];
    },

    async getTopCities(limit = 5) {
      const { data, error } = await supabase
        .from('profiles')
        .select('city')
        .not('city', 'is', null);

      if (error) throw error;
      const cityCount = new Map<string, number>();
      for (const row of (data || []) as { city: string }[]) {
        cityCount.set(row.city, (cityCount.get(row.city) || 0) + 1);
      }
      return Array.from(cityCount.entries())
        .map(([city, count]) => ({ city, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, limit);
    },
  };
}
