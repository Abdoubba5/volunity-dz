'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import {
  Calendar,
  Trophy,
  Clock,
  Award,
  Sparkles,
  Bell,
  ArrowRight,
  TrendingUp,
  Target,
  Activity,
  Flame,
  ChevronRight,
  Plus,
  Heart,
  Users,
  MapPin,
  Settings,
  LogOut,
  CheckCircle2,
} from 'lucide-react';
import { GlassCard } from '@/components/glass-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { cn, formatDate, getInitials, formatNumber } from '@/lib/utils';
import { ProtectedRoute } from '@/components/auth-components';
import { useAuth } from '@/lib/auth-context';
import type { Locale } from '@/i18n/config';
import { MOCK_EVENTS_FULL } from '@/lib/mock-data';

const DEFAULT_STATS = [
  {
    icon: Trophy,
    label: 'Points',
    value: '2,450',
    change: '+125 this week',
    trend: 12,
    gradient: 'from-amber-400 to-yellow-600',
    glow: '',
  },
  {
    icon: Clock,
    label: 'Hours',
    value: '124h',
    change: '+8h this week',
    trend: 8,
    gradient: 'from-brand-primary to-cyan-500',
    glow: 'glow-primary',
  },
  {
    icon: Calendar,
    label: 'Events',
    value: '32',
    change: '+3 this month',
    trend: 15,
    gradient: 'from-brand-secondary to-emerald-500',
    glow: 'glow-secondary',
  },
  {
    icon: Award,
    label: 'Badges',
    value: '18',
    change: '+2 this month',
    trend: 11,
    gradient: 'from-brand-accent to-purple-500',
    glow: 'glow-accent',
  },
];

const UPCOMING = MOCK_EVENTS_FULL.slice(0, 3);

const RECENT_ACTIVITY = [
  { id: 1, type: 'event', text: 'You joined Beach Cleanup Campaign', time: '2h ago', icon: Calendar, color: 'from-primary to-cyan-500' },
  { id: 2, type: 'badge', text: 'You earned "Eco Warrior" badge', time: '1d ago', icon: Award, color: 'from-amber-400 to-orange-500' },
  { id: 3, type: 'level', text: 'You reached Level 12', time: '3d ago', icon: TrendingUp, color: 'from-secondary to-emerald-500' },
  { id: 4, type: 'social', text: 'Green Algeria started following you', time: '5d ago', icon: Users, color: 'from-accent to-purple-500' },
  { id: 5, type: 'streak', text: '7-day volunteering streak!', time: '1w ago', icon: Flame, color: 'from-red-400 to-orange-500' },
];

const AI_RECOMMENDATIONS = [
  { id: 'r1', title: 'Tree Planting Drive', match: 98, category: 'environment' },
  { id: 'r2', title: 'Coding Workshop for Kids', match: 95, category: 'education' },
  { id: 'r3', title: 'Community Garden Build', match: 92, category: 'social' },
];

const RECENT_BADGES = [
  { id: 1, name: 'Eco Warrior', icon: '🌱', tier: 'gold' },
  { id: 2, name: 'Early Bird', icon: '🌅', tier: 'silver' },
  { id: 3, name: 'Streak Master', icon: '🔥', tier: 'gold' },
];

export default function DashboardPage() {
  const t = useTranslations('dashboard');
  const tCommon = useTranslations('common');
  const router = useRouter();
  const locale = useLocale() as Locale;
  const { profile, user } = useAuth();
  const [greeting, setGreeting] = React.useState('');

  const userName = profile?.name || user?.user_metadata?.name || 'Volunteer';
  const userLevel = profile?.level || 1;
  const userPoints = profile?.points || 0;
  const userHours = profile?.hours_volunteered || 0;
  const userEvents = profile?.events_joined || 0;
  const userBadges = profile?.badges_count || 0;

  const STATS = React.useMemo(
    () => [
      {
        icon: Trophy,
        label: 'Points',
        value: userPoints.toLocaleString(),
        change: '+125 this week',
        trend: 12,
        gradient: 'from-amber-400 to-yellow-600',
        glow: '',
      },
      {
        icon: Clock,
        label: 'Hours',
        value: `${userHours}h`,
        change: '+8h this week',
        trend: 8,
        gradient: 'from-brand-primary to-cyan-500',
        glow: 'glow-primary',
      },
      {
        icon: Calendar,
        label: 'Events',
        value: String(userEvents),
        change: '+3 this month',
        trend: 15,
        gradient: 'from-brand-secondary to-emerald-500',
        glow: 'glow-secondary',
      },
      {
        icon: Award,
        label: 'Badges',
        value: String(userBadges),
        change: '+2 this month',
        trend: 11,
        gradient: 'from-brand-accent to-purple-500',
        glow: 'glow-accent',
      },
    ],
    [userPoints, userHours, userEvents, userBadges]
  );

  React.useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  return (
    <ProtectedRoute>
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8 max-w-7xl mx-auto">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="display-3 mb-2">
            {greeting}, <span className="gradient-text">{userName}</span>! 👋
          </h1>
          <p className="text-muted-foreground">
            Here&apos;s what&apos;s happening with your volunteering journey
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="glass"
            size="icon"
            className="rounded-full relative"
            asChild
          >
            <Link href={`/${locale}/notifications`}>
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 end-1.5 h-2 w-2 bg-primary rounded-full" />
            </Link>
          </Button>
          <Button asChild variant="gradient" className="gap-2 glow-primary">
            <Link href={`/${locale}/events`}>
              <Sparkles className="h-4 w-4" />
              Explore Events
            </Link>
          </Button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {STATS.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <GlassCard hover className="relative overflow-hidden">
              <div
                className={cn(
                  'absolute -top-8 -end-8 w-32 h-32 rounded-full bg-gradient-to-br opacity-20 blur-2xl',
                  stat.gradient
                )}
              />
              <div className="relative">
                <div
                  className={cn(
                    'inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br mb-3',
                    stat.gradient,
                    stat.glow
                  )}
                >
                  <stat.icon className="h-5 w-5 text-white" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold">{stat.value}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {stat.label}
                </div>
                <div className="flex items-center gap-1 mt-2 text-xs text-emerald-500 font-medium">
                  <TrendingUp className="h-3 w-3" />
                  {stat.change}
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Level progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <GlassCard>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Level Progress
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  550 points to Level {userLevel + 1}
                </p>
              </div>
              <Badge variant="default" className="text-sm px-3 py-1">
                Level {userLevel}
              </Badge>
            </div>

            <Progress value={78} className="h-3 mb-6" />

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: 'Total Points', value: userPoints.toLocaleString() },
                { label: 'Rank', value: '#14' },
                { label: 'Hours', value: `${userHours}h` },
                { label: 'Streak', value: '7 days' },
              ].map((item) => (
                <div key={item.label} className="text-center sm:text-start">
                  <div className="text-xl sm:text-2xl font-bold gradient-text-static">
                    {item.value}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        {/* Streak */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <GlassCard className="h-full relative overflow-hidden">
            <div className="absolute -top-10 -end-10 w-40 h-40 rounded-full bg-gradient-to-br from-orange-500/30 to-red-500/30 blur-3xl" />
            <div className="relative">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-red-500 mb-3">
                <Flame className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-xl font-bold mb-1">7-Day Streak</h2>
              <p className="text-sm text-muted-foreground mb-4">
                You&apos;re on fire! Keep it up.
              </p>

              <div className="grid grid-cols-7 gap-1.5">
                {[1, 1, 1, 1, 1, 1, 1, 0].map((active, i) => (
                  <div
                    key={i}
                    className={cn(
                      'aspect-square rounded-md flex items-center justify-center text-xs font-bold',
                      active
                        ? 'bg-gradient-to-br from-orange-500 to-red-500 text-white'
                        : 'glass text-muted-foreground'
                    )}
                  >
                    {i + 1}
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming events */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2"
        >
          <GlassCard>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Upcoming Events
              </h2>
              <Button asChild variant="ghost" size="sm">
                <Link href={`/${locale}/events`}>
                  View all
                  <ArrowRight className="h-3.5 w-3.5 ms-1 rtl-flip" />
                </Link>
              </Button>
            </div>

            <div className="space-y-3">
              {UPCOMING.map((event) => (
                <Link
                  key={event.id}
                  href={`/${locale}/events/${event.id}`}
                  className="flex items-center gap-3 sm:gap-4 p-3 rounded-xl glass hover:bg-white/5 transition-colors group"
                >
                  <div className="relative h-16 w-16 rounded-xl overflow-hidden flex-shrink-0">
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{ backgroundImage: `url('${event.image}')` }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm sm:text-base truncate group-hover:text-primary transition-colors">
                      {event.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground mt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(event.date, locale)}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <span className="truncate">{event.location}</span>
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground rtl-flip" />
                </Link>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        {/* AI Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <GlassCard className="h-full">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-accent to-primary flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <h2 className="font-bold">AI Suggestions</h2>
            </div>

            <div className="space-y-2">
              {AI_RECOMMENDATIONS.map((rec) => (
                <Link
                  key={rec.id}
                  href={`/${locale}/events`}
                  className="block p-3 rounded-xl bg-white/[0.02] hover:bg-white/5 transition-colors group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium group-hover:text-primary transition-colors">
                      {rec.title}
                    </p>
                    <Badge variant="success" className="text-[10px]">
                      {rec.match}%
                    </Badge>
                  </div>
                  <div className="h-1 rounded-full bg-white/5 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-accent"
                      style={{ width: `${rec.match}%` }}
                    />
                  </div>
                </Link>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2"
        >
          <GlassCard>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Activity className="h-5 w-5 text-secondary" />
                Recent Activity
              </h2>
            </div>

            <div className="space-y-3">
              {RECENT_ACTIVITY.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02]"
                >
                  <div
                    className={cn(
                      'h-9 w-9 rounded-xl bg-gradient-to-br flex items-center justify-center flex-shrink-0',
                      activity.color
                    )}
                  >
                    <activity.icon className="h-4 w-4 text-white" />
                  </div>
                  <p className="flex-1 text-sm">{activity.text}</p>
                  <span className="text-xs text-muted-foreground flex-shrink-0">
                    {activity.time}
                  </span>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        {/* Recent badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
        >
          <GlassCard>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold flex items-center gap-2">
                <Award className="h-5 w-5 text-amber-500" />
                Recent Badges
              </h2>
              <Button asChild variant="ghost" size="sm">
                <Link href={`/${locale}/profile`}>
                  All
                  <ArrowRight className="h-3 w-3 ms-1 rtl-flip" />
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {RECENT_BADGES.map((badge) => (
                <div
                  key={badge.id}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl glass hover:bg-white/5 transition-colors"
                >
                  <div className="text-3xl">{badge.icon}</div>
                  <p className="text-xs text-center font-medium line-clamp-1">
                    {badge.name}
                  </p>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
    </ProtectedRoute>
  );
}
