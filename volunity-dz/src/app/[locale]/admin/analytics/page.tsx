'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Users, Calendar, FileText, Building2, UserPlus, Clock } from 'lucide-react';
import { GlassCard } from '@/components/glass-card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/lib/auth-context';
import { getDashboardService } from '@/lib/services';
import { createClient } from '@/lib/supabase/client';
import { getInitials, formatDate } from '@/lib/utils';
import type { Locale } from '@/i18n/config';
import type { Profile, Event } from '@/lib/database.types';

export default function AdminAnalyticsPage() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const { profile, isAuthenticated, isLoading } = useAuth();
  const [stats, setStats] = React.useState<{
    totalUsers: number;
    totalEvents: number;
    totalPosts: number;
    totalAssociations: number;
  } | null>(null);
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
    const supabase = createClient();
    const now = new Date().toISOString();

    const [statsData, { data: recent }, { data: upcoming }] = await Promise.all([
      svc.getAdminStats(),
      supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10),
      supabase
        .from('events')
        .select('*')
        .gte('date', now)
        .order('date', { ascending: true })
        .limit(5),
    ]);

    setStats(statsData);
    if (recent) setRecentUsers(recent as Profile[]);
    if (upcoming) setUpcomingEvents(upcoming as Event[]);
    setLoading(false);
  }

  if (isLoading || loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  const statCards = [
    { label: 'Total Users', value: stats?.totalUsers ?? 0, icon: Users, gradient: 'from-brand-primary to-cyan-500' },
    { label: 'Total Events', value: stats?.totalEvents ?? 0, icon: Calendar, gradient: 'from-brand-secondary to-emerald-500' },
    { label: 'Total Posts', value: stats?.totalPosts ?? 0, icon: FileText, gradient: 'from-brand-accent to-purple-500' },
    { label: 'Total Associations', value: stats?.totalAssociations ?? 0, icon: Building2, gradient: 'from-amber-400 to-yellow-600' },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold mb-2">
          Platform <span className="gradient-text">Analytics</span>
        </h1>
        <p className="text-muted-foreground">Overview of platform metrics and activity</p>
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
              <div className={`absolute -top-8 -end-8 w-32 h-32 rounded-full bg-gradient-to-br ${stat.gradient} opacity-20 blur-2xl`} />
              <div className="relative">
                <stat.icon className="h-5 w-5 text-muted-foreground mb-2" />
                <div className="text-2xl sm:text-3xl font-bold">{stat.value}</div>
                <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <GlassCard>
            <div className="flex items-center gap-2 mb-4">
              <UserPlus className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold">Recent Users</h2>
            </div>
            <div className="space-y-3">
              {recentUsers.length === 0 && (
                <p className="text-sm text-muted-foreground">No users yet.</p>
              )}
              {recentUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center gap-3 p-3 rounded-xl glass"
                >
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={user.avatar_url || undefined} alt={user.full_name} />
                    <AvatarFallback>{getInitials(user.full_name)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">{user.full_name}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  </div>
                  <Badge variant="glass" className="text-[10px] capitalize">
                    {user.role}
                  </Badge>
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
            <div className="flex items-center gap-2 mb-4">
              <Clock className="h-5 w-5 text-secondary" />
              <h2 className="text-xl font-bold">Upcoming Events</h2>
            </div>
            <div className="space-y-3">
              {upcomingEvents.length === 0 && (
                <p className="text-sm text-muted-foreground">No upcoming events.</p>
              )}
              {upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center gap-3 p-3 rounded-xl glass"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">{event.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDate(event.date, locale)}
                    </p>
                  </div>
                  <Badge variant="info" className="text-[10px]">
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
