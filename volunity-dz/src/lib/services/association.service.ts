import { createClient } from '@/lib/supabase/client';
import type { Association, AssociationInsert, AssociationMember, Profile } from '@/lib/database.types';

export function getAssociationService() {
  const supabase = createClient();

  return {
    async create(assoc: AssociationInsert): Promise<Association> {
      const { data, error } = await supabase
        .from('associations')
        .insert(assoc as any)
        .select()
        .single();
      if (error) throw error;
      return data as Association;
    },

    async getById(id: string): Promise<Association | null> {
      const { data, error } = await supabase
        .from('associations')
        .select('*')
        .eq('id', id)
        .single();
      if (error && error.code !== 'PGRST116') throw error;
      return data as Association | null;
    },

    async getAll(options?: { search?: string; category?: string; limit?: number }): Promise<Association[]> {
      let query = supabase.from('associations').select('*');

      if (options?.search) {
        query = query.or(
          `name.ilike.%${options.search}%,description.ilike.%${options.search}%,location.ilike.%${options.search}%`
        );
      }
      if (options?.category) query = query.eq('category', options.category);

      query = query.order('followers_count', { ascending: false });
      if (options?.limit) query = query.limit(options.limit);

      const { data, error } = await query;
      if (error) throw error;
      return (data || []) as Association[];
    },

    async update(id: string, updates: Partial<Association>): Promise<Association> {
      const { data, error } = await supabase
        .from('associations')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data as Association;
    },

    async delete(id: string): Promise<void> {
      const { error } = await supabase.from('associations').delete().eq('id', id);
      if (error) throw error;
    },

    // ── Members ──
    async getMembers(associationId: string): Promise<(AssociationMember & { profile?: Pick<Profile, 'name' | 'avatar_url' | 'city'> })[]> {
      const { data, error } = await supabase
        .from('association_members')
        .select('*, profile:profiles(name, avatar_url, city)')
        .eq('association_id', associationId)
        .order('joined_at', { ascending: true });
      if (error) throw error;
      return (data || []) as any;
    },

    async join(associationId: string, userId: string, role: string = 'member'): Promise<void> {
      const { error } = await supabase
        .from('association_members')
        .insert({ association_id: associationId, user_id: userId, role } as any);
      if (error) throw error;
    },

    async leave(associationId: string, userId: string): Promise<void> {
      const { error } = await supabase
        .from('association_members')
        .delete()
        .eq('association_id', associationId)
        .eq('user_id', userId);
      if (error) throw error;
    },

    async isMember(associationId: string, userId: string): Promise<boolean> {
      const { data, error } = await supabase
        .from('association_members')
        .select('id')
        .eq('association_id', associationId)
        .eq('user_id', userId)
        .maybeSingle();
      if (error) throw error;
      return !!data;
    },
  };
}
