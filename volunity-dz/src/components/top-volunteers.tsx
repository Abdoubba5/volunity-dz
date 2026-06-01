'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Trophy, Award, Star, TrendingUp } from 'lucide-react';
import { GlassCard } from '@/components/glass-card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { getInitials } from '@/lib/utils';

const MOCK_VOLUNTEERS = [
  { id: '1', name: 'Sarah Khaled', points: 2450, level: 12, badge: 'gold', avatar: '', city: 'Algiers' },
  { id: '2', name: 'Amine Benali', points: 2180, level: 11, badge: 'gold', avatar: '', city: 'Oran' },
  { id: '3', name: 'Lina Hadj', points: 1950, level: 10, badge: 'silver', avatar: '', city: 'Constantine' },
  { id: '4', name: 'Karim Mansour', points: 1820, level: 10, badge: 'silver', avatar: '', city: 'Tizi Ouzou' },
  { id: '5', name: 'Yasmine Boudiaf', points: 1690, level: 9, badge: 'silver', avatar: '', city: 'Annaba' },
];

const badgeColors = {
  gold: { bg: 'from-amber-400 to-yellow-600', text: 'text-amber-500' },
  silver: { bg: 'from-slate-300 to-slate-500', text: 'text-slate-400' },
  bronze: { bg: 'from-orange-400 to-orange-600', text: 'text-orange-500' },
};

export function TopVolunteers() {
  const t = useTranslations('home.topVolunteers');

  return (
    <section className="py-16 lg:py-24 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <Badge variant="glass" className="mb-4 px-4 py-2 gap-2">
            <Trophy className="h-3.5 w-3.5 text-amber-500" />
            <span>Leaderboard</span>
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3">
            {t('title')}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6">
          {MOCK_VOLUNTEERS.map((volunteer, i) => {
            const colors = badgeColors[volunteer.badge as keyof typeof badgeColors];
            return (
              <motion.div
                key={volunteer.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <GlassCard hover className="text-center relative">
                  {/* Rank badge */}
                  <div className="absolute -top-3 -end-3 h-8 w-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-sm font-bold shadow-lg">
                    #{i + 1}
                  </div>

                  <Avatar className="h-20 w-20 mx-auto mb-4 ring-2 ring-white/20">
                    <AvatarImage src={volunteer.avatar} alt={volunteer.name} />
                    <AvatarFallback className={`bg-gradient-to-br ${colors.bg} text-white text-lg font-bold`}>
                      {getInitials(volunteer.name)}
                    </AvatarFallback>
                  </Avatar>

                  <h3 className="font-bold text-base mb-1 line-clamp-1">{volunteer.name}</h3>
                  <p className="text-xs text-muted-foreground mb-3">{volunteer.city}</p>

                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Star className={`h-4 w-4 ${colors.text}`} fill="currentColor" />
                    <span className="text-lg font-bold gradient-text">
                      {volunteer.points.toLocaleString()}
                    </span>
                  </div>

                  <Badge variant="glass" className="text-xs">
                    <Award className="h-3 w-3 me-1" />
                    Level {volunteer.level}
                  </Badge>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
