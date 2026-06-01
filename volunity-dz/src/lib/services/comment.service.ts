import { createClient } from '@/lib/supabase/client';
import type { Comment, Profile } from '@/lib/database.types';

export function getCommentService() {
  const supabase = createClient();

  return {
    async create(comment: { post_id: string; user_id: string; content: string }): Promise<Comment> {
      const { data, error } = await supabase
        .from('comments')
        .insert(comment as any)
        .select()
        .single();
      if (error) throw error;
      return data as Comment;
    },

    async getByPost(postId: string): Promise<(Comment & { profile?: Pick<Profile, 'full_name' | 'avatar_url'> })[]> {
      const { data, error } = await supabase
        .from('comments')
        .select('*, profile:profiles(full_name, avatar_url)')
        .eq('post_id', postId)
        .order('created_at', { ascending: true });
      if (error) throw error;
      return (data || []) as any;
    },

    async delete(id: string): Promise<void> {
      const { error } = await supabase.from('comments').delete().eq('id', id);
      if (error) throw error;
    },
  };
}
