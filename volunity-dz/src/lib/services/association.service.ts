import { createClient } from '@/lib/supabase/client';
import type { Association } from '@/lib/database.types';

export function getAssociationService() {
  const supabase = createClient();

  return {
    async create(assoc: Omit<Association, 'id' | 'created_at'>): Promise<Association> {
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

    async getAll(options?: { search?: string; limit?: number }): Promise<Association[]> {
      let query = supabase.from('associations').select('*');

      if (options?.search) {
        query = query.or(
          `name.ilike.%${options.search}%,description.ilike.%${options.search}%`
        );
      }

      query = query.order('created_at', { ascending: false });
      if (options?.limit) query = query.limit(options.limit);

      const { data, error } = await query;
      if (error) throw error;
      return (data || []) as Association[];
    },

    async update(id: string, updates: Partial<Association>): Promise<Association> {
      const { data, error } = await supabase
        .from('associations')
        .update(updates as any)
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
  };
}
