import { createClient } from '@/lib/supabase/client';
import type { Notification } from '@/lib/database.types';

export function getNotificationService() {
  const supabase = createClient();

  return {
    async getNotifications(
      userId: string,
      options?: { type?: string; unreadOnly?: boolean; limit?: number }
    ): Promise<Notification[]> {
      let query = supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId);

      if (options?.type) query = query.eq('type', options.type);
      if (options?.unreadOnly) query = query.eq('is_read', false);

      query = query.order('created_at', { ascending: false });
      if (options?.limit) query = query.limit(options.limit);

      const { data, error } = await query;
      if (error) throw error;
      return (data || []) as Notification[];
    },

    async getUnreadCount(userId: string): Promise<number> {
      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('is_read', false);
      if (error) throw error;
      return count || 0;
    },

    async markAsRead(notificationId: string): Promise<void> {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true } as any)
        .eq('id', notificationId);
      if (error) throw error;
    },

    async markAllAsRead(userId: string): Promise<void> {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true } as any)
        .eq('user_id', userId)
        .eq('is_read', false);
      if (error) throw error;
    },

    async create(notification: {
      user_id: string;
      title: string;
      message?: string;
      type: Notification['type'];
      related_id?: string;
    }): Promise<Notification> {
      const { data, error } = await supabase
        .from('notifications')
        .insert(notification as any)
        .select()
        .single();
      if (error) throw error;
      return data as Notification;
    },

    async delete(notificationId: string): Promise<void> {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);
      if (error) throw error;
    },

    subscribe(userId: string, callback: (payload: any) => void) {
      return supabase
        .channel(`notifications:${userId}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${userId}`,
          },
          callback
        )
        .subscribe();
    },
  };
}
