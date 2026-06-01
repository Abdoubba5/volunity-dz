import { createClient } from '@/lib/supabase/client';
import type { NotificationRow } from '@/lib/database.types';

export function getNotificationService() {
  const supabase = createClient();

  return {
    async getNotifications(
      userId: string,
      options?: { type?: string; unreadOnly?: boolean; limit?: number }
    ): Promise<NotificationRow[]> {
      let query = supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId);

      if (options?.type) query = query.eq('type', options.type);
      if (options?.unreadOnly) query = query.eq('read', false);

      query = query.order('created_at', { ascending: false });
      if (options?.limit) query = query.limit(options.limit);

      const { data, error } = await query;
      if (error) throw error;
      return (data || []) as NotificationRow[];
    },

    async getUnreadCount(userId: string): Promise<number> {
      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('read', false);
      if (error) throw error;
      return count || 0;
    },

    async markAsRead(notificationId: string): Promise<void> {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);
      if (error) throw error;
    },

    async markAllAsRead(userId: string): Promise<void> {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', userId)
        .eq('read', false);
      if (error) throw error;
    },

    async createNotification(notification: {
      user_id: string;
      type: NotificationRow['type'];
      title: string;
      description?: string;
      icon?: string;
      link?: string;
    }): Promise<NotificationRow> {
      const { data, error } = await supabase
        .from('notifications')
        .insert(notification as any)
        .select()
        .single();
      if (error) throw error;
      return data as NotificationRow;
    },

    async deleteNotification(notificationId: string): Promise<void> {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);
      if (error) throw error;
    },

    subscribeToNotifications(userId: string, callback: (payload: any) => void) {
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
