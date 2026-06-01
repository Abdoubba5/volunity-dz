'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, Clock, ArrowRight } from 'lucide-react';
import { GlassCard } from '@/components/glass-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn, formatDate } from '@/lib/utils';
import type { Locale } from '@/i18n/config';
import type { Event } from '@/lib/database.types';

interface EventCardProps {
  event: Event;
  index?: number;
}

export function EventCard({ event, index = 0 }: EventCardProps) {
  const locale = useLocale() as Locale;
  const t = useTranslations('events');

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <GlassCard hover className="overflow-hidden p-0 h-full flex flex-col group">
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          {event.image_url ? (
            <Image
              src={event.image_url}
              alt={event.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/30 via-brand-accent/30 to-brand-secondary/30" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />

          {event.category && (
            <Badge variant="glass" className="absolute top-3 start-3 capitalize">
              {t(`categories_list.${event.category}`)}
            </Badge>
          )}

          {/* Category Label (replaces participants) */}
          <div className="absolute bottom-3 end-3 glass px-3 py-1 rounded-full flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5" />
            <span className="text-xs font-semibold">{t(`categories_list.${event.category}`)}</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex-1 flex flex-col">
          <h3 className="font-bold text-lg mb-2 line-clamp-1 group-hover:text-primary transition-colors">
            {event.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
            {event.description}
          </p>

          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="h-3.5 w-3.5 text-primary" />
              <span>{formatDate(event.date, locale)}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 text-primary" />
              <span className="line-clamp-1">{event.location}</span>
            </div>
          </div>

          <Button asChild variant="gradient" className="w-full group/btn" size="sm">
            <Link href={`/${locale}/events/${event.id}`}>
              {t('joinEvent')}
              <ArrowRight className="h-4 w-4 ms-2 group-hover/btn:translate-x-1 rtl-flip transition-transform" />
            </Link>
          </Button>
        </div>
      </GlassCard>
    </motion.div>
  );
}
