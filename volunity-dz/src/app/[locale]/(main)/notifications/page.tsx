'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';
import {
  Bell,
  Calendar,
  FileText,
  Shield,
  Info,
  Check,
} from 'lucide-react';
import { GlassCard } from '@/components/glass-card';
import { Button } from '@/components/ui/button';
import { ProtectedRoute } from '@/components/auth-components';
import { useAuth } from '@/lib/auth-context';
import { getNotificationService } from '@/lib/services';
import { cn } from '@/lib/utils';
import type { Locale } from '@/i18n/config';
import type { Notification } from '@/lib/database.types';

const TYPE_ICON: Record<string, React.ElementType> = {
  event: Calendar,
  post: FileText,
  admin: Shield,
  general: Info,
};

const TYPE_COLOR: Record<string, string> = {
  event: 'from-primary to-cyan-500',
  post: 'from-accent to-purple-500',
  admin: 'from-amber-400 to-yellow-600',
  general: 'from-secondary to-emerald-500',
};

const TABS = [
  { id: 'all', labelKey: 'all' },
  { id: 'unread', labelKey: 'unread' },
  { id: 'event', labelKey: 'categories.events' },
  { id: 'post', labelKey: 'post' },
  { id: 'admin', labelKey: 'admin' },
];

export default function NotificationsPage() {
  const t = useTranslations('notifications');
  const locale = useLocale() as Locale;
  const { user } = useAuth();
  const [tab, setTab] = React.useState('all');
  const [notifications, setNotifications] = React.useState<Notification[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const fetchNotifications = React.useCallback(async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      setError(null);
      const svc = getNotificationService();
      const data = await svc.getNotifications(user.id);
      setNotifications(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load notifications');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  React.useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const filtered = React.useMemo(() => {
    if (tab === 'all') return notifications;
    if (tab === 'unread') return notifications.filter((n) => !n.is_read);
    return notifications.filter((n) => n.type === tab);
  }, [tab, notifications]);

  const markAllRead = async () => {
    if (!user?.id) return;
    try {
      const svc = getNotificationService();
      await svc.markAllAsRead(user.id);
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    } catch {
      // ignore
    }
  };

  const markRead = async (id: string) => {
    try {
      const svc = getNotificationService();
      await svc.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
    } catch {
      // ignore
    }
  };

  const tabLabel = (tabItem: { id: string; labelKey: string }) => {
    if (tabItem.id === 'post') return 'Post';
    if (tabItem.id === 'admin') return 'Admin';
    return t(tabItem.labelKey as any);
  };

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6"
        >
          <div>
            <div className="inline-flex items-center gap-2 glass px-3 py-1.5 rounded-full mb-3">
              <Bell className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-medium">
                {unreadCount} {unreadCount === 1 ? 'unread' : 'unread'}
              </span>
            </div>
            <h1 className="display-2 mb-2">{t('title')}</h1>
            <p className="text-muted-foreground">{t('subtitle')}</p>
          </div>
          <Button
            variant="glass"
            size="sm"
            onClick={markAllRead}
            disabled={unreadCount === 0}
            className="gap-2"
          >
            <Check className="h-4 w-4" />
            {t('markAllRead')}
          </Button>
        </motion.div>

        {/* Tabs */}
        <div className="mb-6 overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="flex gap-2 glass p-1.5 rounded-2xl w-max sm:w-auto">
            {TABS.map((tabItem) => {
              const count =
                tabItem.id === 'all'
                  ? notifications.length
                  : tabItem.id === 'unread'
                  ? unreadCount
                  : notifications.filter((n) => n.type === tabItem.id).length;

              return (
                <button
                  key={tabItem.id}
                  onClick={() => setTab(tabItem.id)}
                  className={cn(
                    'relative px-4 py-2 text-sm font-medium rounded-xl transition-colors whitespace-nowrap flex items-center gap-2',
                    tab === tabItem.id
                      ? 'text-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {tab === tabItem.id && (
                    <motion.div
                      layoutId="notifTab"
                      className="absolute inset-0 bg-white/10 rounded-xl"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className="relative">{tabLabel(tabItem)}</span>
                  <span className="relative text-[10px] bg-white/5 px-1.5 py-0.5 rounded-full">
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-16">
            <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          </div>
        )}

        {/* Error */}
        {error && (
          <GlassCard className="text-center py-12">
            <p className="text-destructive">{error}</p>
            <Button variant="glass" size="sm" onClick={fetchNotifications} className="mt-4">
              Retry
            </Button>
          </GlassCard>
        )}

        {/* List */}
        {!loading && !error && (
          <AnimatePresence mode="popLayout">
            {filtered.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
              >
                <GlassCard className="text-center py-16">
                  <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 mb-4">
                    <Bell className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{t('empty')}</h3>
                  <p className="text-muted-foreground">{t('emptyDesc')}</p>
                </GlassCard>
              </motion.div>
            ) : (
              <div className="space-y-2">
                {filtered.map((notif, i) => {
                  const Icon = TYPE_ICON[notif.type] || Info;
                  return (
                    <motion.div
                      key={notif.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 100 }}
                      transition={{ delay: i * 0.03 }}
                    >
                      <GlassCard
                        hover
                        className={cn(
                          'flex items-start gap-3 p-4 cursor-pointer group',
                          !notif.is_read && 'border-primary/30'
                        )}
                        onClick={() => {
                          if (!notif.is_read) markRead(notif.id);
                        }}
                      >
                        <div
                          className={cn(
                            'h-10 w-10 rounded-xl bg-gradient-to-br flex items-center justify-center flex-shrink-0',
                            TYPE_COLOR[notif.type] || TYPE_COLOR.general
                          )}
                        >
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h3 className="font-semibold text-sm sm:text-base">
                              {notif.title}
                            </h3>
                            {!notif.is_read && (
                              <span className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-1.5" />
                            )}
                          </div>
                          {notif.message && (
                            <p className="text-sm text-muted-foreground mb-2">
                              {notif.message}
                            </p>
                          )}
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">
                              {new Date(notif.created_at).toLocaleDateString(locale === 'ar' ? 'ar-DZ' : locale === 'fr' ? 'fr-FR' : 'en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>
                        </div>
                      </GlassCard>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </AnimatePresence>
        )}
      </div>
    </ProtectedRoute>
  );
}
