'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Award, Crown, TrendingUp, Users, Building2, Sparkles, Flame, ArrowUp, ArrowDown } from 'lucide-react';
import { GlassCard } from '@/components/glass-card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { cn, formatNumber, getInitials } from '@/lib/utils';

const TOP_VOLUNTEERS = [
  { id: '1', name: 'Sarah Khaled', username: '@sarahk', points: 2450, level: 12, badge: 'gold', city: 'Algiers', hours: 124, change: 2, trend: 'up' as const },
  { id: '2', name: 'Amine Benali', username: '@amineb', points: 2180, level: 11, badge: 'gold', city: 'Oran', hours: 108, change: 1, trend: 'up' as const },
  { id: '3', name: 'Lina Hadj', username: '@linah', points: 1950, level: 10, badge: 'silver', city: 'Constantine', hours: 98, change: -1, trend: 'down' as const },
  { id: '4', name: 'Karim Mansour', username: '@karimm', points: 1820, level: 10, badge: 'silver', city: 'Tizi Ouzou', hours: 92, change: 0, trend: 'up' as const },
  { id: '5', name: 'Yasmine Boudiaf', username: '@yasmineb', points: 1690, level: 9, badge: 'silver', city: 'Annaba', hours: 85, change: 3, trend: 'up' as const },
  { id: '6', name: 'Mehdi Cherif', username: '@mehdic', points: 1540, level: 9, badge: 'bronze', city: 'Setif', hours: 78, change: -2, trend: 'down' as const },
  { id: '7', name: 'Nour El Houda', username: '@nourh', points: 1420, level: 8, badge: 'bronze', city: 'Blida', hours: 71, change: 1, trend: 'up' as const },
  { id: '8', name: 'Reda Belkacem', username: '@redab', points: 1310, level: 8, badge: 'bronze', city: 'Tlemcen', hours: 65, change: -3, trend: 'down' as const },
  { id: '9', name: 'Imène Kaci', username: '@imenek', points: 1245, level: 7, badge: 'bronze', city: 'Mostaganem', hours: 62, change: 5, trend: 'up' as const },
  { id: '10', name: 'Yacine Boudjellal', username: '@yacineb', points: 1180, level: 7, badge: 'bronze', city: 'Batna', hours: 58, change: 0, trend: 'up' as const },
];

const TOP_ASSOCIATIONS = [
  { id: '1', name: 'Green Algeria', username: '@greenalgeria', followers: 12400, events: 45, verified: true, change: 0, trend: 'up' as const, city: 'Algiers' },
  { id: '2', name: 'Youth for Education', username: '@yfe', followers: 8900, events: 32, verified: true, change: 1, trend: 'up' as const, city: 'Tizi Ouzou' },
  { id: '3', name: 'Health Heroes DZ', username: '@hhdz', followers: 6700, events: 28, verified: true, change: -1, trend: 'down' as const, city: 'Constantine' },
  { id: '4', name: 'Culture Connect', username: '@culturec', followers: 5400, events: 21, verified: false, change: 2, trend: 'up' as const, city: 'Oran' },
  { id: '5', name: 'Sports for All', username: '@sportsa', followers: 4200, events: 18, verified: true, change: 0, trend: 'up' as const, city: 'Annaba' },
];

const TOP_CITIES = [
  { name: 'Algiers', volunteers: 3200, events: 145, change: 0, trend: 'up' as const },
  { name: 'Oran', volunteers: 2400, events: 98, change: 1, trend: 'up' as const },
  { name: 'Constantine', volunteers: 1900, events: 76, change: -1, trend: 'down' as const },
  { name: 'Tizi Ouzou', volunteers: 1500, events: 64, change: 0, trend: 'up' as const },
  { name: 'Annaba', volunteers: 1200, events: 52, change: 2, trend: 'up' as const },
];

const PERIODS = [
  { id: 'today', label: 'Today' },
  { id: 'week', label: 'This week' },
  { id: 'month', label: 'This month' },
  { id: 'year', label: 'This year' },
  { id: 'all', label: 'All time' },
];

const badgeStyles = {
  gold: { bg: 'from-amber-400 to-yellow-600', text: 'text-amber-500', glow: 'shadow-amber-500/50' },
  silver: { bg: 'from-slate-300 to-slate-500', text: 'text-slate-400', glow: 'shadow-slate-400/50' },
  bronze: { bg: 'from-orange-400 to-orange-600', text: 'text-orange-500', glow: 'shadow-orange-500/50' },
};

function PodiumCard({ volunteer, rank }: { volunteer: typeof TOP_VOLUNTEERS[0]; rank: number }) {
  const colors = badgeStyles[volunteer.badge as keyof typeof badgeStyles];
  const heights = ['h-32', 'h-40', 'h-28'];
  const orders = [2, 1, 3];
  const ranks = [2, 1, 3];
  const icons = [Medal, Crown, Award];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: rank * 0.1 }}
      className="flex flex-col items-center"
    >
      <div className="relative mb-3">
        {rank === 0 && (
          <div className="absolute -top-8 left-1/2 -translate-x-1/2">
            <Crown className="h-8 w-8 text-amber-400" fill="currentColor" />
          </div>
        )}
        <div
          className={cn(
            'absolute inset-0 rounded-full blur-2xl opacity-50 bg-gradient-to-br',
            colors.bg
          )}
        />
        <Avatar className={cn('h-20 w-20 ring-4 relative', rank === 0 && 'ring-amber-400/60', rank === 1 && 'ring-slate-400/60', rank === 2 && 'ring-orange-500/60')}>
          <AvatarImage src="" alt={volunteer.name} />
          <AvatarFallback className={cn('bg-gradient-to-br text-white font-bold text-xl', colors.bg)}>
            {getInitials(volunteer.name)}
          </AvatarFallback>
        </Avatar>
      </div>
      <h3 className="font-bold text-sm mb-1 text-center">{volunteer.name}</h3>
      <p className="text-xs text-muted-foreground mb-2">{volunteer.city}</p>
      <div className="text-2xl font-bold gradient-text mb-3">
        {formatNumber(volunteer.points)}
      </div>
      <div
        className={cn(
          'w-full max-w-[120px] rounded-t-2xl flex flex-col items-center justify-end pb-3 bg-gradient-to-b',
          colors.bg,
          heights[rank]
        )}
      >
        {React.createElement(icons[rank], { className: 'h-6 w-6 text-white' })}
        <span className="text-white text-2xl font-bold mt-1">#{ranks[rank]}</span>
      </div>
    </motion.div>
  );
}

export default function LeaderboardPage() {
  const [period, setPeriod] = React.useState('all');

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-3xl mx-auto mb-12"
      >
        <Badge variant="glass" className="mb-4 px-4 py-2 gap-2">
          <Trophy className="h-3.5 w-3.5 text-amber-500" />
          <span>Hall of Fame</span>
        </Badge>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
          <span className="gradient-text">Leaderboard</span>
        </h1>
        <p className="text-lg text-muted-foreground">
          Celebrating the most active volunteers, associations, and cities
        </p>
      </motion.div>

      {/* Period Filter */}
      <div className="flex justify-center mb-8">
        <div className="glass p-1.5 rounded-2xl flex gap-1 overflow-x-auto max-w-full">
          {PERIODS.map((p) => (
            <button
              key={p.id}
              onClick={() => setPeriod(p.id)}
              className={cn(
                'relative px-4 py-2 text-sm font-medium rounded-xl transition-colors whitespace-nowrap',
                period === p.id
                  ? 'text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {period === p.id && (
                <motion.div
                  layoutId="periodTab"
                  className="absolute inset-0 bg-white/10 rounded-xl"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative">{p.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="volunteers" className="w-full">
        <div className="flex justify-center mb-8">
          <TabsList className="glass p-1.5">
            <TabsTrigger value="volunteers" className="gap-2">
              <Users className="h-4 w-4" />
              Volunteers
            </TabsTrigger>
            <TabsTrigger value="associations" className="gap-2">
              <Building2 className="h-4 w-4" />
              Associations
            </TabsTrigger>
            <TabsTrigger value="cities" className="gap-2">
              <TrendingUp className="h-4 w-4" />
              Cities
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Volunteers */}
        <TabsContent value="volunteers" className="space-y-8">
          {/* Podium */}
          <div className="flex items-end justify-center gap-4 sm:gap-8 max-w-2xl mx-auto px-4">
            <div className="order-1">
              {TOP_VOLUNTEERS[1] && <PodiumCard volunteer={TOP_VOLUNTEERS[1]} rank={1} />}
            </div>
            <div className="order-2">
              {TOP_VOLUNTEERS[0] && <PodiumCard volunteer={TOP_VOLUNTEERS[0]} rank={0} />}
            </div>
            <div className="order-3">
              {TOP_VOLUNTEERS[2] && <PodiumCard volunteer={TOP_VOLUNTEERS[2]} rank={2} />}
            </div>
          </div>

          {/* Rest of list */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {TOP_VOLUNTEERS.slice(3).map((volunteer, i) => {
              const colors = badgeStyles[volunteer.badge as keyof typeof badgeStyles];

              return (
                <motion.div
                  key={volunteer.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                >
                  <GlassCard hover className="flex items-center gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center bg-white/5">
                      <span className="text-lg font-bold text-muted-foreground">#{i + 4}</span>
                    </div>

                    <Avatar className="h-12 w-12 ring-2 ring-white/20 flex-shrink-0">
                      <AvatarImage src="" alt={volunteer.name} />
                      <AvatarFallback className={cn('bg-gradient-to-br text-white font-bold', colors.bg)}>
                        {getInitials(volunteer.name)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-sm truncate">{volunteer.name}</h3>
                      <p className="text-xs text-muted-foreground">{volunteer.city} • Level {volunteer.level}</p>
                    </div>

                    {volunteer.change !== 0 && (
                      <div
                        className={cn(
                          'flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium',
                          volunteer.trend === 'up'
                            ? 'bg-emerald-500/10 text-emerald-500'
                            : 'bg-red-500/10 text-red-500'
                        )}
                      >
                        {volunteer.trend === 'up' ? (
                          <ArrowUp className="h-3 w-3" />
                        ) : (
                          <ArrowDown className="h-3 w-3" />
                        )}
                        {Math.abs(volunteer.change)}
                      </div>
                    )}

                    <div className="text-end flex-shrink-0">
                      <div className="text-xl font-bold gradient-text">
                        {formatNumber(volunteer.points)}
                      </div>
                      <div className="text-xs text-muted-foreground">points</div>
                    </div>
                  </GlassCard>
                </motion.div>
              );
            })}
          </div>
        </TabsContent>

        {/* Associations */}
        <TabsContent value="associations">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {TOP_ASSOCIATIONS.map((assoc, i) => {
              const colors = badgeStyles.gold;

              return (
                <motion.div
                  key={assoc.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                >
                  <GlassCard hover className="text-center relative">
                    {i === 0 && (
                      <div className="absolute -top-2 -end-2">
                        <Crown className="h-6 w-6 text-amber-400" fill="currentColor" />
                      </div>
                    )}
                    <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent mb-3`}>
                      <span className="text-lg font-bold text-white">#{i + 1}</span>
                    </div>
                    <Avatar className="h-16 w-16 mx-auto mb-3 ring-2 ring-white/20">
                      <AvatarImage src="" alt={assoc.name} />
                      <AvatarFallback className={cn('bg-gradient-to-br text-white font-bold', colors.bg)}>
                        {getInitials(assoc.name)}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="font-bold mb-1">{assoc.name}</h3>
                    <p className="text-xs text-muted-foreground mb-3">
                      {formatNumber(assoc.followers)} followers • {assoc.events} events
                    </p>
                    {assoc.change !== 0 && (
                      <div
                        className={cn(
                          'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium',
                          assoc.trend === 'up'
                            ? 'bg-emerald-500/10 text-emerald-500'
                            : 'bg-red-500/10 text-red-500'
                        )}
                      >
                        {assoc.trend === 'up' ? (
                          <ArrowUp className="h-3 w-3" />
                        ) : (
                          <ArrowDown className="h-3 w-3" />
                        )}
                        {Math.abs(assoc.change)}
                      </div>
                    )}
                  </GlassCard>
                </motion.div>
              );
            })}
          </div>
        </TabsContent>

        {/* Cities */}
        <TabsContent value="cities">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {TOP_CITIES.map((city, i) => (
              <motion.div
                key={city.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <GlassCard hover className="text-center relative">
                  {i === 0 && (
                    <div className="absolute -top-2 -end-2">
                      <Crown className="h-6 w-6 text-amber-400" fill="currentColor" />
                    </div>
                  )}
                  <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${
                    i === 0 ? 'bg-gradient-to-br from-amber-400 to-yellow-600' : 'bg-white/5'
                  } mb-3`}>
                    <span className="text-lg font-bold text-white">#{i + 1}</span>
                  </div>
                  <h3 className="font-bold text-lg mb-1">{city.name}</h3>
                  <p className="text-xs text-muted-foreground">
                    {formatNumber(city.volunteers)} volunteers
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {city.events} events
                  </p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
