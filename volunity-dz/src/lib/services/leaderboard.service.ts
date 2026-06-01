import { createClient } from '@/lib/supabase/client';

export type LeaderboardEntry = {
  id: string;
  full_name: string;
  avatar_url: string | null;
  events_attended: number;
};

export function getLeaderboardService() {
  const supabase = createClient();

  return {
    async getTopStudents(limit = 20) {
      const { data, error } = await supabase
        .from('student_stats')
        .select('*, profile:profiles(full_name, avatar_url)')
        .order('events_attended', { ascending: false })
        .limit(limit);
      if (error) throw error;
      return (data || []) as any[];
    },
  };
}
