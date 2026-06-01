'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';
import {
  Bell,
  Calendar,
  Trophy,
  Users,
  Sparkles,
  Check,
  Filter,
  Trash2,
} from 'lucide-react';
import { GlassCard } from '@/components/glass-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { Locale } from '@/i18n/config';
import { MOCK_NOTIFICATIONS_DETAILED } from '@/lib/mock-data';

const ICON_MAP = {
  calendar: Calendar,
  trophy: Trophy,
  users: Users,
  sparkles: Sparkles,
};

const COLOR_MAP: Record<string, string> = {
  event: 'from-primary to-cyan-500',
  badge: 'from-amber-400 to-yellow-600',
  social: 'from-accent to-purple-500',
  system: 'from-secondary to-emerald-500',
};

const TABS = [
  { id: 'all', label: 'all' },
  { id: 'unread', label: 'unread' },
  { id: 'event', label: 'events' },
  { id: 'badge', label: 'badges' },
  { id: 'social', label: 'social' },
  { id: 'system', label: 'system' },
];

export default function NotificationsPage() {
  const t = useTranslations('notifications');
  const tCommon = useTranslations('common');
  const locale = useLocale() as Locale;
  const [tab, setTab] = React.useState('all');
  const [items, setItems] = React.useState(MOCK_NOTIFICATIONS_DETAILED);

  const unreadCount = items.filter((n) => n.unread).length;

  const filtered = React.useMemo(() => {
    if (tab === 'all') return items;
    if (tab === 'unread') return items.filter((n) => n.unread);
    return items.filter((n) => n.type === tab);
  }, [tab, items]);

  const markAllRead = () => {
    setItems((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const markRead = (id: string) => {
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, unread: false } : n)));
  };

  return (
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
            <span className="text-xs font-medium">{unreadCount} unread</span>
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
                ? items.length
                : tabItem.id === 'unread'
                ? unreadCount
                : items.filter((n) => n.type === tabItem.id).length;

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
                <span className="relative">
                  {tabItem.id === 'all' && t('all')}
                  {tabItem.id === 'unread' && t('unread')}
                  {tabItem.id === 'event' && t('categories.events')}
                  {tabItem.id === 'badge' && t('categories.badges')}
                  {tabItem.id === 'social' && t('categories.social')}
                  {tabItem.id === 'system' && t('categories.system')}
                </span>
                <span className="relative text-[10px] bg-white/5 px-1.5 py-0.5 rounded-full">
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* List */}
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
              const Icon = ICON_MAP[notif.icon];
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
                      notif.unread && 'border-primary/30'
                    )}
                    onClick={() => markRead(notif.id)}
                  >
                    <div
                      className={cn(
                        'h-10 w-10 rounded-xl bg-gradient-to-br flex items-center justify-center flex-shrink-0',
                        COLOR_MAP[notif.type]
                      )}
                    >
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="font-semibold text-sm sm:text-base">{notif.title}</h3>
                        {notif.unread && (
                          <span className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-1.5" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{notif.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">{notif.time}</span>
                        {notif.action && (
                          <Button
                            asChild
                            variant="ghost"
                            size="sm"
                            className="h-7 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Link href={`/${locale}${notif.action}`}>View</Link>
                          </Button>
                        )}
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              );
            })}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
