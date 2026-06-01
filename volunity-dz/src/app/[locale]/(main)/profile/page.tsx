'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';
import {
  MapPin,
  Calendar,
  Award,
  Clock,
  Users,
  Trophy,
  Settings,
  Share2,
  Heart,
  CheckCircle2,
  Sparkles,
  Crown,
  Edit3,
  Target,
  Flame,
  TrendingUp,
  Star,
  Activity,
} from 'lucide-react';
import { GlassCard } from '@/components/glass-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { cn, formatDate, formatNumber, getInitials } from '@/lib/utils';
import type { Locale } from '@/i18n/config';
import { MOCK_EVENTS_FULL, MOCK_BADGES, MOCK_VOLUNTEERS_DETAILED } from '@/lib/mock-data';

const ME = MOCK_VOLUNTEERS_DETAILED[0];

const ACHIEVEMENTS = [
  { id: 1, title: '100 Hours Milestone', description: 'Reached 100 volunteering hours', date: '2026-04-12', icon: Clock, color: 'from-blue-500 to-cyan-500' },
  { id: 2, title: 'Top 10 Leaderboard', description: 'Ranked in top 10 this month', date: '2026-05-01', icon: Trophy, color: 'from-amber-400 to-yellow-600' },
  { id: 3, title: '30 Day Streak', description: 'Volunteered 30 days in a row', date: '2026-05-20', icon: Flame, color: 'from-orange-500 to-red-500' },
  { id: 4, title: 'Community Pillar', description: 'Helped onboard 50 new volunteers', date: '2026-03-08', icon: Users, color: 'from-purple-500 to-pink-500' },
];

export default function ProfilePage() {
  const t = useTranslations('profile');
  const tCommon = useTranslations('common');
  const locale = useLocale() as Locale;

  return (
    <div className="pb-8">
      {/* Cover & Header */}
      <div className="relative">
        <div
          className="h-48 sm:h-64 lg:h-80 bg-cover bg-center relative overflow-hidden"
          style={{ backgroundImage: `url('${ME.cover}')` }}
        >
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
                    <AvatarImage src={ME.avatar} alt={ME.name} />
                    <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white text-4xl font-bold">
                      {getInitials(ME.name)}
                    </AvatarFallback>
                  </Avatar>
                  {ME.online && (
                    <span className="absolute bottom-2 end-2 h-5 w-5 rounded-full bg-emerald-500 ring-4 ring-background" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h1 className="text-2xl sm:text-3xl font-bold">{ME.name}</h1>
                    {ME.verified && (
                      <CheckCircle2 className="h-5 w-5 text-primary" fill="currentColor" />
                    )}
                    <Badge variant="gradient" className="gap-1">
                      <Crown className="h-3 w-3" />
                      Level {ME.level}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground mb-3">{ME.username}</p>
                  <p className="text-sm sm:text-base max-w-2xl mb-4">{ME.bio}</p>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-4 w-4" />
                      {ME.location}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4" />
                      Joined {formatDate(ME.joined_at, locale)}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Users className="h-4 w-4" />
                      {formatNumber(ME.followers)} {t('follow')}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 w-full sm:w-auto">
                  <Button variant="glass" size="icon" className="rounded-full">
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <Button variant="glass" size="icon" className="rounded-full">
                    <Heart className="h-4 w-4" />
                  </Button>
                  <Button variant="gradient" className="gap-2 flex-1 sm:flex-initial" asChild>
                    <Link href={`/${locale}/settings`}>
                      <Edit3 className="h-4 w-4" />
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
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {[
            { label: t('points'), value: ME.points, icon: Trophy, color: 'from-amber-400 to-yellow-600' },
            { label: t('hours'), value: `${ME.hours}h`, icon: Clock, color: 'from-primary to-cyan-500' },
            { label: t('events'), value: ME.events_joined, icon: Calendar, color: 'from-secondary to-emerald-500' },
            { label: t('badges'), value: ME.badges_count, icon: Award, color: 'from-accent to-purple-500' },
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
                  <div className="text-2xl sm:text-3xl font-bold">{formatNumber(Number(stat.value))}</div>
                  <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Level progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <GlassCard>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Level Progress
              </h2>
              <Badge variant="default">{ME.level} → {ME.level + 1}</Badge>
            </div>
            <Progress value={78} className="h-3 mb-2" />
            <p className="text-xs text-muted-foreground">550 points to Level {ME.level + 1}</p>
          </GlassCard>
        </motion.div>

        {/* Tabs */}
        <Tabs defaultValue="about" className="w-full">
          <TabsList className="glass w-full sm:w-auto p-1.5 grid grid-cols-4 sm:flex">
            <TabsTrigger value="about">{t('tabs.about')}</TabsTrigger>
            <TabsTrigger value="events">{t('tabs.events')}</TabsTrigger>
            <TabsTrigger value="badges">{t('tabs.badges')}</TabsTrigger>
            <TabsTrigger value="achievements">{t('tabs.achievements')}</TabsTrigger>
          </TabsList>

          <TabsContent value="about" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <GlassCard className="lg:col-span-2">
                <h2 className="text-xl font-bold mb-4">About</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">{ME.bio}</p>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                  <div>
                    <p className="text-xs text-muted-foreground">University</p>
                    <p className="font-medium">{ME.university}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Location</p>
                    <p className="font-medium">{ME.location}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Followers</p>
                    <p className="font-medium">{formatNumber(ME.followers)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Following</p>
                    <p className="font-medium">{formatNumber(ME.following)}</p>
                  </div>
                </div>
              </GlassCard>

              <GlassCard>
                <h2 className="font-bold mb-4 flex items-center gap-2">
                  <Activity className="h-5 w-5 text-secondary" />
                  Streak
                </h2>
                <div className="text-center mb-4">
                  <div className="text-5xl font-bold gradient-text mb-1">7</div>
                  <p className="text-sm text-muted-foreground">days in a row</p>
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {[1, 1, 1, 1, 1, 1, 1, 0].map((active, i) => (
                    <div
                      key={i}
                      className={cn(
                        'aspect-square rounded flex items-center justify-center text-[10px] font-bold',
                        active
                          ? 'bg-gradient-to-br from-orange-500 to-red-500 text-white'
                          : 'glass text-muted-foreground'
                      )}
                    >
                      {i + 1}
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>
          </TabsContent>

          <TabsContent value="events" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {MOCK_EVENTS_FULL.slice(0, 6).map((event, i) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link href={`/${locale}/events/${event.id}`}>
                    <GlassCard hover className="overflow-hidden p-0">
                      <div className="h-32 bg-cover bg-center" style={{ backgroundImage: `url('${event.image}')` }} />
                      <div className="p-4">
                        <h3 className="font-bold text-sm mb-1 line-clamp-1">{event.title}</h3>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {formatDate(event.date, locale)}
                        </div>
                      </div>
                    </GlassCard>
                  </Link>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="badges" className="mt-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {MOCK_BADGES.map((badge, i) => (
                <motion.div
                  key={badge.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <GlassCard hover className="text-center">
                    <div className="text-5xl mb-3">{badge.icon}</div>
                    <h3 className="font-bold text-sm mb-1">{badge.name}</h3>
                    <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{badge.description}</p>
                    <Badge
                      variant={
                        badge.tier === 'gold'
                          ? 'warning'
                          : badge.tier === 'silver'
                          ? 'glass'
                          : 'outline'
                      }
                      className="capitalize"
                    >
                      {badge.tier}
                    </Badge>
                    {badge.progress < 100 && (
                      <div className="mt-3">
                        <Progress value={badge.progress} className="h-1.5" />
                        <p className="text-[10px] text-muted-foreground mt-1">{badge.progress}%</p>
                      </div>
                    )}
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="achievements" className="mt-6">
            <div className="space-y-3">
              {ACHIEVEMENTS.map((achievement, i) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <GlassCard hover>
                    <div className="flex items-center gap-4">
                      <div
                        className={cn(
                          'h-12 w-12 rounded-xl bg-gradient-to-br flex items-center justify-center flex-shrink-0',
                          achievement.color
                        )}
                      >
                        <achievement.icon className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold">{achievement.title}</h3>
                        <p className="text-sm text-muted-foreground">{achievement.description}</p>
                      </div>
                      <div className="text-end">
                        <div className="text-xs text-muted-foreground">
                          {formatDate(achievement.date, locale)}
                        </div>
                        <Sparkles className="h-3 w-3 text-amber-500 inline mt-1" />
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
