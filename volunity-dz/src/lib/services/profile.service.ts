import { createClient } from '@/lib/supabase/client';
import type { Profile } from '@/lib/database.types';

export function getProfileService() {
  const supabase = createClient();

  return {
    async getProfile(userId: string): Promise<Profile | null> {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      if (error && error.code !== 'PGRST116') throw error;
      return data as Profile | null;
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

    async searchProfiles(query: string): Promise<Profile[]> {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .or(`full_name.ilike.%${query}%,email.ilike.%${query}%,department.ilike.%${query}%`)
        .limit(20);
      if (error) throw error;
      return (data || []) as Profile[];
    },

    async getStudentsByFaculty(faculty: string): Promise<Profile[]> {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('faculty', faculty)
        .limit(50);
      if (error) throw error;
      return (data || []) as Profile[];
    },
  };
}
