'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { CheckCircle2, Users, Calendar, ArrowRight } from 'lucide-react';
import { GlassCard } from '@/components/glass-card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { getInitials } from '@/lib/utils';

const MOCK_ASSOCIATIONS = [
  {
    id: '1',
    name: 'Green Algeria',
    description: 'Environmental protection and sustainability initiatives across Algeria.',
    logo: '',
    followers: 12400,
    verified: true,
    events: 45,
  },
  {
    id: '2',
    name: 'Youth for Education',
    description: 'Empowering youth through education and skill development programs.',
    logo: '',
    followers: 8900,
    verified: true,
    events: 32,
  },
  {
    id: '3',
    name: 'Health Heroes DZ',
    description: 'Promoting health awareness and providing medical support to communities.',
    logo: '',
    followers: 6700,
    verified: true,
    events: 28,
  },
  {
    id: '4',
    name: 'Culture Connect',
    description: 'Preserving and celebrating Algerian cultural heritage through events.',
    logo: '',
    followers: 5400,
    verified: false,
    events: 21,
  },
];

export function AssociationsShowcase() {
  const t = useTranslations('home.associations');
  const tCommon = useTranslations('common');

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
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3">
            {t('title')}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {MOCK_ASSOCIATIONS.map((assoc, i) => (
            <motion.div
              key={assoc.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <GlassCard hover className="h-full flex flex-col group">
                <div className="flex items-start justify-between mb-4">
                  <Avatar className="h-14 w-14 ring-2 ring-white/20">
                    <AvatarImage src={assoc.logo} alt={assoc.name} />
                    <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white font-bold">
                      {getInitials(assoc.name)}
                    </AvatarFallback>
                  </Avatar>
                  {assoc.verified && (
                    <CheckCircle2 className="h-5 w-5 text-primary" fill="currentColor" />
                  )}
                </div>

                <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">
                  {assoc.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1">
                  {assoc.description}
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Users className="h-3.5 w-3.5" />
                      <span>{assoc.followers.toLocaleString()} followers</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{assoc.events} events</span>
                    </div>
                  </div>
                </div>

                <Button variant="glass" size="sm" className="w-full group/btn">
                  Follow
                  <ArrowRight className="h-3.5 w-3.5 ms-2 group-hover/btn:translate-x-1 rtl-flip transition-transform" />
                </Button>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
