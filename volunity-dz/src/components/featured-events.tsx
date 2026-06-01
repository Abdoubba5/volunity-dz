'use client';

import * as React from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { EventCard } from '@/components/event-card';
import { Button } from '@/components/ui/button';
import type { Locale } from '@/i18n/config';
import type { Event } from '@/types';

const MOCK_EVENTS: Event[] = [
  {
    id: '1',
    title: 'Beach Cleanup Campaign',
    description: 'Join us in cleaning the beautiful coastal areas of Algiers and raising awareness about marine pollution.',
    category: 'environment',
    location: 'Sablette Beach, Algiers',
    date: '2026-06-15',
    image: 'https://images.unsplash.com/photo-1583321500900-82807e458f3c?w=600&q=80',
    created_by: '1',
    participants_count: 124,
    created_at: '2026-05-01',
  },
  {
    id: '2',
    title: 'Education for All',
    description: 'Help us teach underprivileged children in rural areas. Your time can shape their future.',
    category: 'education',
    location: 'Tizi Ouzou',
    date: '2026-06-20',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&q=80',
    created_by: '2',
    participants_count: 89,
    created_at: '2026-05-05',
  },
  {
    id: '3',
    title: 'Health & Wellness Fair',
    description: 'Free health checkups and awareness sessions for communities across Constantine.',
    category: 'health',
    location: 'Constantine City Center',
    date: '2026-07-01',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&q=80',
    created_by: '3',
    participants_count: 215,
    created_at: '2026-05-10',
  },
  {
    id: '4',
    title: 'Cultural Heritage Festival',
    description: 'Celebrate Algeria\'s rich cultural heritage with traditional music, food, and art exhibitions.',
    category: 'culture',
    location: 'Oran',
    date: '2026-07-10',
    image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=600&q=80',
    created_by: '4',
    participants_count: 178,
    created_at: '2026-05-12',
  },
  {
    id: '5',
    title: 'Youth Sports Tournament',
    description: 'Organize and participate in a football tournament bringing together youth from different cities.',
    category: 'sports',
    location: 'Annaba Stadium',
    date: '2026-07-15',
    image: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=600&q=80',
    created_by: '5',
    participants_count: 156,
    created_at: '2026-05-15',
  },
  {
    id: '6',
    title: 'Community Garden Project',
    description: 'Build sustainable community gardens in urban areas to promote healthy living and environmental awareness.',
    category: 'social',
    location: 'Blida',
    date: '2026-07-20',
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&q=80',
    created_by: '6',
    participants_count: 67,
    created_at: '2026-05-18',
  },
];

export function FeaturedEvents() {
  const t = useTranslations('home.featured');
  const tCommon = useTranslations('common');
  const locale = useLocale() as Locale;

  return (
    <section className="py-16 lg:py-24 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12"
        >
          <div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3">
              {t('title')}
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl">
              {t('subtitle')}
            </p>
          </div>
          <Button asChild variant="glass" className="group self-start sm:self-auto">
            <Link href={`/${locale}/events`}>
              {tCommon('seeAll')}
              <ArrowRight className="h-4 w-4 ms-2 group-hover:translate-x-1 rtl-flip transition-transform" />
            </Link>
          </Button>
        </motion.div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_EVENTS.slice(0, 6).map((event, i) => (
            <EventCard key={event.id} event={event} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
