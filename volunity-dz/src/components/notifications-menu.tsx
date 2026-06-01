'use client';

import * as React from 'react';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Calendar, BellOff, Users, Check, Sparkles, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/auth-context';
import { useNotifications } from '@/hooks/use-notifications';
import type { Locale } from '@/i18n/config';

const iconMap: Record<string, any> = {
  general: Sparkles,
  event: Calendar,
  post: Users,
  admin: Shield,
};

const typeColors: Record<string, string> = {
  general: 'from-primary to-cyan-500',
  event: 'from-brand-primary to-cyan-500',
  post: 'from-accent to-purple-500',
  admin: 'from-amber-400 to-orange-500',
};

export function NotificationsMenu() {
  const locale = useLocale() as Locale;
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { notifications, unreadCount, markAllAsRead } = useNotifications(user?.id);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
            {unreadCount > 9 ? '9+' : unreadCount}
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
                'end-2 sm:end-auto sm:start-1/2 sm:-translate-x-1/2',
                locale === 'ar' ? 'sm:start-1/2 sm:translate-x-1/2' : ''
              )}
              style={{ top: '4rem' }}
            >
              <div className="glass-premium rounded-2xl overflow-hidden shadow-2xl">
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
                    <Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-xs h-8">
                      <Check className="h-3.5 w-3.5 me-1" />
                      Mark all read
                    </Button>
                  )}
                </div>

                <div className="max-h-96 overflow-y-auto">
                  {notifications.length > 0 ? (
                    <div className="divide-y divide-white/5">
                      {notifications.slice(0, 10).map((n) => {
                        const Icon = iconMap[n.type] || Sparkles;
                        return (
                          <div key={n.id} className="w-full p-4 flex items-start gap-3 text-start relative">
                            {!n.is_read && (
                              <span className="absolute top-4 end-4 h-2 w-2 rounded-full bg-primary" />
                            )}
                            <div
                              className={cn(
                                'h-9 w-9 rounded-xl bg-gradient-to-br flex items-center justify-center flex-shrink-0',
                                typeColors[n.type] || typeColors.general
                              )}
                            >
                              <Icon className="h-4 w-4 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium leading-snug">{n.title}</p>
                              {n.message && (
                                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{n.message}</p>
                              )}
                              <p className="text-xs text-muted-foreground mt-1">
                                {new Date(n.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-8 text-center">
                      <BellOff className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                      <p className="text-sm text-muted-foreground">You&apos;re all caught up!</p>
                    </div>
                  )}
                </div>

                <div className="p-3 border-t border-white/10 flex items-center justify-between">
                  <Link
                    href={`/${locale}/notifications`}
                    onClick={() => setOpen(false)}
                    className="text-xs font-medium text-primary hover:underline"
                  >
                    View all
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
