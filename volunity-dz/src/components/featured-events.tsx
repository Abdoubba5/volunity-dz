'use client';

import * as React from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { EventCard } from '@/components/event-card';
import { Button } from '@/components/ui/button';
import { getEventService } from '@/lib/services';
import type { Locale } from '@/i18n/config';
import type { Event } from '@/lib/database.types';

export function FeaturedEvents() {
  const t = useTranslations('home.featuredEvents');
  const locale = useLocale() as Locale;
  const [events, setEvents] = React.useState<Event[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    getEventService().getEvents({ limit: 6 })
      .then(setEvents)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-16 lg:py-24 relative overflow-hidden">
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

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-80 rounded-2xl bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.slice(0, 6).map((event, i) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <EventCard event={event} index={i} />
              </motion.div>
            ))}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-10"
        >
          <Button asChild variant="gradient" size="lg" className="gap-2">
            <Link href={`/${locale}/events`}>
              {t('viewAll')}
              <ArrowRight className="h-4 w-4 rtl-flip" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
