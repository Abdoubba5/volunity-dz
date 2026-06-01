'use client';

import * as React from 'react';
import { createClient } from '@/lib/supabase/client';
import { getNotificationService } from '@/lib/services/notification.service';
import type { NotificationRow } from '@/lib/database.types';

export function useNotifications(userId: string | undefined) {
  const [notifications, setNotifications] = React.useState<NotificationRow[]>([]);
  const [unreadCount, setUnreadCount] = React.useState(0);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!userId) return;
    const svc = getNotificationService();

    const load = async () => {
      setLoading(true);
      try {
        const [data, count] = await Promise.all([
          svc.getNotifications(userId, { limit: 50 }),
          svc.getUnreadCount(userId),
        ]);
        setNotifications(data);
        setUnreadCount(count);
      } finally {
        setLoading(false);
      }
    };

    load();

    const supabase = createClient();
    const channel = supabase
      .channel(`notifications:${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`,
        },
        (payload: any) => {
          if (payload.eventType === 'INSERT') {
            setNotifications((prev) => [payload.new as NotificationRow, ...prev]);
            setUnreadCount((c) => c + 1);
          } else if (payload.eventType === 'UPDATE') {
            setNotifications((prev) =>
              prev.map((n) => (n.id === payload.new.id ? (payload.new as NotificationRow) : n))
            );
            setUnreadCount((c) => Math.max(0, c - 1));
          }
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel).catch(() => {}); };
  }, [userId]);

  const markAsRead = React.useCallback(async (id: string) => {
    const svc = getNotificationService();
    await svc.markAsRead(id);
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    setUnreadCount((c) => Math.max(0, c - 1));
  }, []);

  const markAllAsRead = React.useCallback(async () => {
    if (!userId) return;
    const svc = getNotificationService();
    await svc.markAllAsRead(userId);
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  }, [userId]);

  return { notifications, unreadCount, loading, markAsRead, markAllAsRead };
}
