import { createClient } from '@/lib/supabase/client';
import type { Post, Profile } from '@/lib/database.types';

export function getPostService() {
  const supabase = createClient();

  return {
    async create(post: { user_id: string; content: string; image?: string }): Promise<Post> {
      const { data, error } = await supabase
        .from('posts')
        .insert(post as any)
        .select()
        .single();
      if (error) throw error;
      return data as Post;
    },

    async getAll(limit = 20, offset = 0): Promise<(Post & { profile?: Pick<Profile, 'full_name' | 'avatar_url'>; comments_count?: number })[]> {
      const { data, error } = await supabase
        .from('posts')
        .select('*, profile:profiles(full_name, avatar_url)')
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);
      if (error) throw error;
      return (data || []) as any;
    },

    async getById(id: string): Promise<Post | null> {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .single();
      if (error && error.code !== 'PGRST116') throw error;
      return data as Post | null;
    },

    async delete(id: string): Promise<void> {
      const { error } = await supabase.from('posts').delete().eq('id', id);
      if (error) throw error;
    },
  };
}
