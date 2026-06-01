'use client';

import * as React from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Settings, Sparkles, User as UserIcon } from 'lucide-react';
import { GlassCard } from '@/components/glass-card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn, getInitials, formatDate, formatNumber } from '@/lib/utils';
import { ProtectedRoute } from '@/components/auth-components';
import { useAuth } from '@/lib/auth-context';
import { getEventService, getDashboardService } from '@/lib/services';
import type { Locale } from '@/i18n/config';
import type { DashboardStats } from '@/lib/services/dashboard.service';

export default function ProfilePage() {
  const t = useTranslations('profile');
  const tCommon = useTranslations('common');
  const locale = useLocale() as Locale;
  const { profile, user, isAuthenticated, isLoading: authLoading } = useAuth();

  const [stats, setStats] = React.useState<DashboardStats | null>(null);
  const [myEvents, setMyEvents] = React.useState<any[]>([]);
  const [isDataLoading, setIsDataLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const userId = user?.id;

  React.useEffect(() => {
    if (!userId) return;

    const loadData = async () => {
      setIsDataLoading(true);
      setError(null);
      try {
        const dashboardSvc = getDashboardService();
        const eventSvc = getEventService();
        const [statsData, eventsData] = await Promise.all([
          dashboardSvc.getStats(userId),
          eventSvc.getUserEvents(userId),
        ]);
        setStats(statsData);
        setMyEvents(eventsData || []);
      } catch {
        setError('Failed to load profile data');
      } finally {
        setIsDataLoading(false);
      }
    };

    loadData();
  }, [userId]);

  const isLoading = authLoading || isDataLoading;
  const me = profile;

  return (
    <ProtectedRoute>
      <div className="pb-8">
        {/* Cover & Header */}
        <div className="relative">
          <div className="h-48 sm:h-64 lg:h-80 relative overflow-hidden bg-gradient-to-br from-primary/30 via-accent/20 to-secondary/30">
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-20 sm:-mt-24 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <GlassCard className="p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-end">
                  <div className="relative -mt-16 sm:-mt-20">
                    <Avatar className="h-28 w-28 sm:h-36 sm:w-36 ring-4 ring-background shadow-2xl">
                      <AvatarImage src={me?.avatar_url || undefined} alt={me?.full_name || ''} />
                      <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white text-4xl font-bold">
                        {getInitials(me?.full_name || 'U')}
                      </AvatarFallback>
                    </Avatar>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h1 className="text-2xl sm:text-3xl font-bold mb-1">
                      {isLoading ? (
                        <span className="inline-block h-8 w-48 rounded bg-white/10 animate-pulse" />
                      ) : (
                        me?.full_name || 'User'
                      )}
                    </h1>
                    {me?.email && (
                      <p className="text-sm text-muted-foreground mb-2">{me.email}</p>
                    )}
                    {(me?.university || me?.faculty || me?.department || me?.academic_year) && (
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground mb-1">
                        {me.university && (
                          <span className="flex items-center gap-1.5">
                            <UserIcon className="h-4 w-4" />
                            {me.university}
                          </span>
                        )}
                        {me.faculty && <span>{me.faculty}</span>}
                        {me.department && <span>{me.department}</span>}
                        {me.academic_year && (
                          <Badge variant="outline" className="text-xs">
                            {me.academic_year}
                          </Badge>
                        )}
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      {t('joined')}{' '}
                      {me?.created_at ? formatDate(me.created_at, locale) : ''}
                    </p>
                  </div>

                  <div className="flex gap-2 w-full sm:w-auto">
                    <Button variant="gradient" className="gap-2 flex-1 sm:flex-initial" asChild>
                      <Link href={`/${locale}/settings`}>
                        <Settings className="h-4 w-4" />
                        {t('edit')}
                      </Link>
                    </Button>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-6">
          {/* Stats cards */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            {[
              {
                label: 'Events Registered',
                value: stats?.eventsRegistered ?? 0,
                icon: Calendar,
                color: 'from-primary to-cyan-500',
              },
              {
                label: 'Events Attended',
                value: stats?.eventsAttended ?? 0,
                icon: Sparkles,
                color: 'from-secondary to-emerald-500',
              },
              {
                label: 'Posts',
                value: stats?.postsCount ?? 0,
                icon: UserIcon,
                color: 'from-accent to-purple-500',
              },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 + 0.1 }}
              >
                <GlassCard hover className="relative overflow-hidden">
                  <div
                    className={cn(
                      'absolute -top-8 -end-8 w-32 h-32 rounded-full bg-gradient-to-br opacity-20 blur-2xl',
                      stat.color
                    )}
                  />
                  <div className="relative">
                    <div
                      className={cn(
                        'inline-flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br mb-2',
                        stat.color
                      )}
                    >
                      <stat.icon className="h-4 w-4 text-white" />
                    </div>
                    <div className="text-2xl sm:text-3xl font-bold">
                      {formatNumber(stat.value)}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>

          {/* My Events */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <GlassCard>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  My Events
                </h2>
                <Button variant="glass" size="sm" asChild>
                  <Link href={`/${locale}/events`}>
                    {tCommon('seeAll')}
                  </Link>
                </Button>
              </div>

              {error && (
                <p className="text-sm text-red-400">{error}</p>
              )}

              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-20 rounded-lg bg-white/5 animate-pulse" />
                  ))}
                </div>
              ) : myEvents.length === 0 ? (
                <div className="text-center py-12">
                  <div className="relative mb-4 inline-flex">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/20 to-secondary/20 blur-2xl rounded-full" />
                    <div className="relative h-16 w-16 rounded-2xl glass-strong flex items-center justify-center">
                      <Calendar className="h-8 w-8 text-muted-foreground" strokeWidth={1.5} />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold mb-1">No events yet</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    You haven&apos;t registered for any events yet.
                  </p>
                  <Button variant="gradient" asChild>
                    <Link href={`/${locale}/events`}>
                      Browse events
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {myEvents.map((item, i) => {
                    const event = item.event;
                    if (!event) return null;
                    return (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.03 }}
                      >
                        <Link href={`/${locale}/events/${event.id}`}>
                          <GlassCard hover className="p-4">
                            <div className="flex items-center gap-4">
                              {event.image_url && (
                                <div
                                  className="h-14 w-14 rounded-xl bg-cover bg-center flex-shrink-0"
                                  style={{ backgroundImage: `url('${event.image_url}')` }}
                                />
                              )}
                              {!event.image_url && (
                                <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center flex-shrink-0">
                                  <Calendar className="h-6 w-6 text-primary" />
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-sm line-clamp-1">{event.title}</h3>
                                <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                                  <span className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {formatDate(event.date, locale)}
                                  </span>
                                  {event.location && (
                                    <span className="flex items-center gap-1">
                                      <MapPin className="h-3 w-3" />
                                      <span className="line-clamp-1">{event.location}</span>
                                    </span>
                                  )}
                                </div>
                              </div>
                              <Badge
                                variant={
                                  item.status === 'attended' ? 'default' : 'outline'
                                }
                                className="capitalize flex-shrink-0"
                              >
                                {item.status}
                              </Badge>
                            </div>
                          </GlassCard>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
