import { createClient } from '@/lib/supabase/client';
import type { Resource } from '@/lib/database.types';

export function getResourceService() {
  const supabase = createClient();

  return {
    async create(resource: Omit<Resource, 'id' | 'created_at'>): Promise<Resource> {
      const { data, error } = await supabase
        .from('resources')
        .insert(resource as any)
        .select()
        .single();
      if (error) throw error;
      return data as Resource;
    },

    async getAll(options?: { type?: string; faculty?: string; limit?: number }): Promise<Resource[]> {
      let query = supabase.from('resources').select('*');

      if (options?.type) query = query.eq('type', options.type);
      if (options?.faculty) query = query.eq('faculty', options.faculty);

      query = query.order('created_at', { ascending: false });
      if (options?.limit) query = query.limit(options.limit);

      const { data, error } = await query;
      if (error) throw error;
      return (data || []) as Resource[];
    },

    async getById(id: string): Promise<Resource | null> {
      const { data, error } = await supabase
        .from('resources')
        .select('*')
        .eq('id', id)
        .single();
      if (error && error.code !== 'PGRST116') throw error;
      return data as Resource | null;
    },

    async delete(id: string): Promise<void> {
      const { error } = await supabase.from('resources').delete().eq('id', id);
      if (error) throw error;
    },
  };
}
