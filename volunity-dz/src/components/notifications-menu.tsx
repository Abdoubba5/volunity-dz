'use client';

import * as React from 'react';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Calendar, Trophy, Users, Settings, Check, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Locale } from '@/i18n/config';

interface AppNotification {
  id: string;
  type: 'event' | 'badge' | 'social' | 'system';
  title: string;
  description: string;
  time: string;
  unread: boolean;
  icon?: 'calendar' | 'trophy' | 'users' | 'sparkles';
}

const MOCK_NOTIFICATIONS: AppNotification[] = [
  {
    id: '1',
    type: 'event',
    title: 'Event reminder',
    description: 'Beach Cleanup starts in 2 hours',
    time: '2h',
    unread: true,
    icon: 'calendar',
  },
  {
    id: '2',
    type: 'badge',
    title: 'New badge unlocked!',
    description: 'You earned the "Eco Warrior" badge',
    time: '5h',
    unread: true,
    icon: 'trophy',
  },
  {
    id: '3',
    type: 'social',
    title: 'New follower',
    description: 'Green Algeria started following you',
    time: '1d',
    unread: false,
    icon: 'users',
  },
];

const iconMap = {
  calendar: Calendar,
  trophy: Trophy,
  users: Users,
  sparkles: Sparkles,
};

const typeColors = {
  event: 'from-primary to-cyan-500',
  badge: 'from-amber-400 to-orange-500',
  social: 'from-accent to-purple-500',
  system: 'from-slate-400 to-slate-600',
};

export function NotificationsMenu() {
  const locale = useLocale() as Locale;
  const [open, setOpen] = React.useState(false);
  const [notifications, setNotifications] = React.useState(MOCK_NOTIFICATIONS);
  const ref = React.useRef<HTMLDivElement>(null);
  const unreadCount = notifications.filter((n) => n.unread).length;

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  return (
    <div ref={ref} className="relative">
      <Button
        variant="glass"
        size="icon"
        className="rounded-full relative"
        onClick={() => setOpen(!open)}
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-0.5 -end-0.5 h-4 w-4 rounded-full bg-gradient-to-br from-primary to-accent text-[10px] font-bold text-white flex items-center justify-center ring-2 ring-background"
          >
            {unreadCount}
          </motion.span>
        )}
      </Button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className={cn(
                'fixed z-50 mt-2 w-[calc(100vw-2rem)] sm:w-96 max-w-sm',
                'start-auto',
                'end-2 sm:end-auto sm:start-1/2 sm:-translate-x-1/2',
                locale === 'ar' ? 'sm:start-1/2 sm:translate-x-1/2' : ''
              )}
              style={{ top: '4rem' }}
            >
              <div className="glass-premium rounded-2xl overflow-hidden shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-white/10">
                  <div>
                    <h3 className="font-semibold text-sm">Notifications</h3>
                    {unreadCount > 0 && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {unreadCount} new
                      </p>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={markAllAsRead}
                      className="text-xs h-8"
                    >
                      <Check className="h-3.5 w-3.5 me-1" />
                      Mark all read
                    </Button>
                  )}
                </div>

                {/* List */}
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length > 0 ? (
                    <div className="divide-y divide-white/5">
                      {notifications.map((n) => {
                        const Icon = iconMap[n.icon || 'sparkles'];
                        return (
                          <button
                            key={n.id}
                            className="w-full p-4 flex items-start gap-3 hover:bg-white/5 transition-colors text-start relative"
                          >
                            {n.unread && (
                              <span className="absolute top-4 end-4 h-2 w-2 rounded-full bg-primary" />
                            )}
                            <div
                              className={cn(
                                'h-9 w-9 rounded-xl bg-gradient-to-br flex items-center justify-center flex-shrink-0',
                                typeColors[n.type]
                              )}
                            >
                              <Icon className="h-4 w-4 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium leading-snug">
                                {n.title}
                              </p>
                              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                                {n.description}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {n.time} ago
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-8 text-center">
                      <Bell className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                      <p className="text-sm text-muted-foreground">
                        You&apos;re all caught up!
                      </p>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="p-3 border-t border-white/10 flex items-center justify-between">
                  <Link
                    href={`/${locale}/notifications`}
                    onClick={() => setOpen(false)}
                    className="text-xs font-medium text-primary hover:underline"
                  >
                    View all
                  </Link>
                  <Link
                    href={`/${locale}/settings`}
                    onClick={() => setOpen(false)}
                    className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                  >
                    <Settings className="h-3 w-3" />
                    Settings
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
