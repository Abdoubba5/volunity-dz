import { createClient } from '@/lib/supabase/client';
import type { BadgeRow, UserBadge } from '@/lib/database.types';

export function getBadgeService() {
  const supabase = createClient();

  return {
    async getAllBadges(): Promise<BadgeRow[]> {
      const { data, error } = await supabase
        .from('badges')
        .select('*')
        .order('required_points', { ascending: true });
      if (error) throw error;
      return (data || []) as BadgeRow[];
    },

    async getUserBadges(userId: string): Promise<(UserBadge & { badge?: BadgeRow })[]> {
      const { data, error } = await supabase
        .from('user_badges')
        .select('*, badge:badges(*)')
        .eq('user_id', userId)
        .order('earned_at', { ascending: false });
      if (error) throw error;
      return (data || []) as any;
    },

    async awardBadge(userId: string, badgeId: string): Promise<UserBadge> {
      const { data, error } = await supabase
        .from('user_badges')
        .insert({ user_id: userId, badge_id: badgeId } as any)
        .select()
        .single();
      if (error) throw error;
      return data as UserBadge;
    },

    async checkAndAwardBadges(userId: string, points: number): Promise<BadgeRow[]> {
      const { data: availableBadges, error: availErr } = await supabase
        .from('badges')
        .select('*')
        .lte('required_points', points);
      if (availErr) throw availErr;

      const { data: earnedBadges, error: earnedErr } = await supabase
        .from('user_badges')
        .select('badge_id')
        .eq('user_id', userId);
      if (earnedErr) throw earnedErr;

      const earnedIds = new Set((earnedBadges || []).map((b) => b.badge_id));
      const newBadges = ((availableBadges || []) as BadgeRow[]).filter(
        (b) => !earnedIds.has(b.id)
      );

      for (const badge of newBadges) {
        const { error } = await supabase.from('user_badges').insert({
          user_id: userId,
          badge_id: badge.id,
        } as any);
        if (error) throw error;
      }

      return newBadges;
    },
  };
}
