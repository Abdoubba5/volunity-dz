'use client';

import * as React from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Calendar, Bell, Sparkles, Activity, ArrowRight, ChevronRight } from 'lucide-react';
import { GlassCard } from '@/components/glass-card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ProtectedRoute } from '@/components/auth-components';
import { useAuth } from '@/lib/auth-context';
import { getDashboardService } from '@/lib/services';
import type { Locale } from '@/i18n/config';
import type { Event } from '@/lib/database.types';
import type { DashboardStats } from '@/lib/services';

export default function DashboardPage() {
  const t = useTranslations('dashboard');
  const locale = useLocale() as Locale;
  const { profile, user } = useAuth();
  const [greeting, setGreeting] = React.useState('');
  const [stats, setStats] = React.useState<DashboardStats | null>(null);
  const [upcoming, setUpcoming] = React.useState<Event[]>([]);

  React.useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  React.useEffect(() => {
    if (!user?.id) return;
    const svc = getDashboardService();
    svc.getStats(user.id).then(setStats);
    svc.getUpcomingEvents(user.id).then(setUpcoming);
  }, [user?.id]);

  const userName = profile?.full_name || user?.user_metadata?.full_name || 'Student';

  const statCards = [
    { label: 'Events Registered', value: stats?.eventsRegistered ?? 0, gradient: 'from-brand-primary to-cyan-500', glow: 'glow-primary' },
    { label: 'Events Attended', value: stats?.eventsAttended ?? 0, gradient: 'from-brand-secondary to-emerald-500', glow: 'glow-secondary' },
    { label: 'Posts', value: stats?.postsCount ?? 0, gradient: 'from-brand-accent to-purple-500', glow: 'glow-accent' },
    { label: 'Upcoming', value: stats?.upcomingEvents ?? 0, gradient: 'from-amber-400 to-yellow-600', glow: '' },
  ];

  return (
    <ProtectedRoute>
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold mb-2">
            {greeting}, <span className="gradient-text">{userName}</span>!
          </h1>
          <p className="text-muted-foreground">
            Here&apos;s your university dashboard
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="glass" size="icon" className="rounded-full relative" asChild>
            <Link href={`/${locale}/notifications`}>
              <Bell className="h-5 w-5" />
            </Link>
          </Button>
          <Button asChild variant="gradient" className="gap-2 glow-primary">
            <Link href={`/${locale}/events`}>
              <Sparkles className="h-4 w-4" />
              Browse Events
            </Link>
          </Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <GlassCard hover className="relative overflow-hidden">
              <div className={cn('absolute -top-8 -end-8 w-32 h-32 rounded-full bg-gradient-to-br opacity-20 blur-2xl', stat.gradient)} />
              <div className="relative">
                <div className="text-2xl sm:text-3xl font-bold">{stat.value}</div>
                <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <GlassCard>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Upcoming Events
              </h2>
              <Button asChild variant="ghost" size="sm">
                <Link href={`/${locale}/events`}>
                  View all <ArrowRight className="h-3.5 w-3.5 ms-1 rtl-flip" />
                </Link>
              </Button>
            </div>
            <div className="space-y-3">
              {upcoming.length === 0 && (
                <p className="text-sm text-muted-foreground">No upcoming events. Browse events to register!</p>
              )}
              {upcoming.map((event: any) => (
                <Link
                  key={event.id}
                  href={`/${locale}/events/${event.id}`}
                  className="flex items-center gap-3 p-3 rounded-xl glass hover:bg-white/5 transition-colors group"
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm truncate group-hover:text-primary transition-colors">{event.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(event.date).toLocaleDateString()}
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground rtl-flip" />
                </Link>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <GlassCard>
            <div className="flex items-center gap-2 mb-4">
              <Activity className="h-5 w-5 text-secondary" />
              <h2 className="text-xl font-bold">Quick Links</h2>
            </div>
            <div className="space-y-2">
              <Button asChild variant="glass" className="w-full justify-start">
                <Link href={`/${locale}/events`}>Browse Events</Link>
              </Button>
              <Button asChild variant="glass" className="w-full justify-start">
                <Link href={`/${locale}/associations`}>Student Associations</Link>
              </Button>
              {profile?.role === 'admin' && (
                <Button asChild variant="glass" className="w-full justify-start">
                  <Link href={`/${locale}/admin`}>Admin Panel</Link>
                </Button>
              )}
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
    </ProtectedRoute>
  );
}
