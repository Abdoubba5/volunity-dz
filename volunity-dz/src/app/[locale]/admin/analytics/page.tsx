'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import {
  Users, Calendar, FileText, Building2, UserPlus, Clock,
  TrendingUp, Activity, BarChart3, Download,
} from 'lucide-react';
import { GlassCard } from '@/components/glass-card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth-context';
import { getDashboardService, getAnalyticsService } from '@/lib/services';
import { createClient } from '@/lib/supabase/client';
import { getInitials, formatDate } from '@/lib/utils';
import type { Locale } from '@/i18n/config';
import type { Profile, Event, DailyMetric } from '@/lib/database.types';

export default function AdminAnalyticsPage() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const { profile, isAuthenticated, isLoading } = useAuth();
  const [stats, setStats] = React.useState<Record<string, number> | null>(null);
  const [dailyMetrics, setDailyMetrics] = React.useState<DailyMetric[]>([]);
  const [recentUsers, setRecentUsers] = React.useState<Profile[]>([]);
  const [upcomingEvents, setUpcomingEvents] = React.useState<Event[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      router.push(`/${locale}/login`);
      return;
    }
    if (profile?.role !== 'admin') {
      router.push(`/${locale}/dashboard`);
      return;
    }
    loadData();
  }, [isLoading, isAuthenticated, profile, router, locale]);

  async function loadData() {
    const svc = getDashboardService();
    const analytics = getAnalyticsService();
    const supabase = createClient();
    const now = new Date().toISOString();

    const [statsData, metrics, { data: recent }, { data: upcoming }] = await Promise.all([
      svc.getAdminStats(),
      analytics.getDailyMetrics(14),
      supabase.from('profiles').select('*').order('created_at', { ascending: false }).limit(10),
      supabase.from('events').select('*').gte('date', now).order('date', { ascending: true }).limit(5),
    ]);

    setStats(statsData);
    setDailyMetrics(metrics);
    if (recent) setRecentUsers(recent as Profile[]);
    if (upcoming) setUpcomingEvents(upcoming as Event[]);
    setLoading(false);
  }

  if (isLoading || loading || !stats) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  const growth = dailyMetrics.length >= 2
    ? ((dailyMetrics[0].total_users - dailyMetrics[dailyMetrics.length - 1].total_users) / Math.max(dailyMetrics[dailyMetrics.length - 1].total_users, 1) * 100).toFixed(1)
    : '0';

  const maxPageViews = Math.max(...dailyMetrics.map(m => m.page_views), 1);

  const statCards = [
    { label: 'Total Users', value: stats.totalUsers, icon: Users, gradient: 'from-brand-primary to-cyan-500', sub: `+${stats.newUsersToday} today` },
    { label: 'Events', value: stats.totalEvents, icon: Calendar, gradient: 'from-brand-secondary to-emerald-500', sub: `${stats.upcomingEvents} upcoming` },
    { label: 'Participants', value: stats.totalParticipants, icon: UserPlus, gradient: 'from-amber-400 to-yellow-600', sub: `${stats.totalAttendance} checked in` },
    { label: 'Posts', value: stats.totalPosts, icon: FileText, gradient: 'from-brand-accent to-purple-500', sub: `${stats.totalAssociations} clubs` },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold mb-2">
            Platform <span className="gradient-text">Analytics</span>
          </h1>
          <p className="text-muted-foreground">Real-time metrics and platform insights</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="glass" className="gap-1.5">
            <Activity className="h-3 w-3 text-emerald-500" />
            <span className="text-emerald-500">+{growth}%</span>
            <span className="text-muted-foreground">growth</span>
          </Badge>
        </div>
      </motion.div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <GlassCard hover className="relative overflow-hidden">
              <div className={`absolute -top-8 -end-8 w-32 h-32 rounded-full bg-gradient-to-br ${stat.gradient} opacity-20 blur-2xl`} />
              <div className="relative">
                <stat.icon className="h-5 w-5 text-muted-foreground mb-2" />
                <div className="text-2xl sm:text-3xl font-bold">{stat.value}</div>
                <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
                <p className="text-[10px] text-muted-foreground/70 mt-0.5">{stat.sub}</p>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daily Activity Chart (simplified bar chart) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <GlassCard>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-bold">Daily Page Views (14 days)</h2>
              </div>
            </div>
            <div className="h-48 flex items-end gap-1.5">
              {dailyMetrics.map((m, i) => {
                const height = (m.page_views / Math.max(maxPageViews, 1)) * 100;
                const isToday = i === 0;
                return (
                  <div key={m.date} className="flex-1 flex flex-col items-center gap-1 group relative">
                    <div className="hidden group-hover:block absolute -top-8 bg-foreground/10 backdrop-blur-xl px-2 py-1 rounded text-[10px] whitespace-nowrap z-10">
                      {m.page_views} views
                    </div>
                    <div
                      className={`w-full rounded-t-md transition-all hover:opacity-80 ${
                        isToday
                          ? 'bg-gradient-to-t from-primary to-accent'
                          : 'bg-primary/30'
                      }`}
                      style={{ height: `${Math.max(height, 2)}%` }}
                    />
                    <span className="text-[8px] text-muted-foreground rotate-45 origin-left whitespace-nowrap">
                      {new Date(m.date).getDate()}/{new Date(m.date).getMonth() + 1}
                    </span>
                  </div>
                );
              })}
            </div>
          </GlassCard>
        </motion.div>

        {/* Growth Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <GlassCard>
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-5 w-5 text-secondary" />
              <h2 className="text-xl font-bold">Growth Metrics</h2>
            </div>
            <div className="space-y-4">
              {[
                { label: 'Total Users', value: stats.totalUsers, delta: `+${stats.newUsersToday} today` },
                { label: 'Total Events', value: stats.totalEvents, delta: `${stats.upcomingEvents} upcoming` },
                { label: 'Total Participants', value: stats.totalParticipants, delta: `${stats.totalAttendance} attended` },
                { label: 'Total Posts', value: stats.totalPosts, delta: `${stats.totalAssociations} clubs` },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.delta}</p>
                  </div>
                  <span className="text-lg font-bold">{item.value}</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      </div>

      {/* Recent Users & Upcoming Events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <GlassCard>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-bold">Recent Users</h2>
              </div>
              <span className="text-xs text-muted-foreground">Latest 10</span>
            </div>
            <div className="space-y-3">
              {recentUsers.length === 0 && (
                <p className="text-sm text-muted-foreground">No users yet.</p>
              )}
              {recentUsers.map((user) => (
                <div key={user.id} className="flex items-center gap-3 p-3 rounded-xl glass">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={user.avatar_url || undefined} alt={user.full_name} />
                    <AvatarFallback>{getInitials(user.full_name)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">{user.full_name}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  </div>
                  <Badge variant="glass" className="text-[10px] capitalize">{user.role}</Badge>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <GlassCard>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-secondary" />
                <h2 className="text-xl font-bold">Upcoming Events</h2>
              </div>
              <span className="text-xs text-muted-foreground">Next 5</span>
            </div>
            <div className="space-y-3">
              {upcomingEvents.length === 0 && (
                <p className="text-sm text-muted-foreground">No upcoming events.</p>
              )}
              {upcomingEvents.map((event) => (
                <div key={event.id} className="flex items-center gap-3 p-3 rounded-xl glass">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">{event.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDate(event.date, locale)}
                    </p>
                  </div>
                  <Badge variant={new Date(event.date) > new Date() ? 'info' : 'success'} className="text-[10px]">
                    {new Date(event.date) > new Date() ? 'Upcoming' : 'Ongoing'}
                  </Badge>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}
