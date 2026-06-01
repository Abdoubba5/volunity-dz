import { createClient } from '@/lib/supabase/client';
import type { Profile, ProfileInsert } from '@/lib/database.types';

export function getProfileService() {
  const supabase = createClient();

  return {
    async getProfile(userId: string): Promise<Profile | null> {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      if (error) throw error;
      return data as Profile | null;
    },

    async createProfile(profile: ProfileInsert): Promise<Profile> {
      const { data, error } = await supabase
        .from('profiles')
        .insert(profile as any)
        .select()
        .single();
      if (error) throw error;
      return data as Profile;
    },

    async updateProfile(userId: string, updates: Partial<Profile>): Promise<Profile> {
      const { data, error } = await supabase
        .from('profiles')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', userId)
        .select()
        .single();
      if (error) throw error;
      return data as Profile;
    },

    async getTopVolunteers(limit = 10): Promise<Profile[]> {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('points', { ascending: false })
        .limit(limit);
      if (error) throw error;
      return (data || []) as Profile[];
    },

    async searchProfiles(query: string): Promise<Profile[]> {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .or(`name.ilike.%${query}%,username.ilike.%${query}%,city.ilike.%${query}%`)
        .limit(20);
      if (error) throw error;
      return (data || []) as Profile[];
    },
  };
}
