'use client';

import * as React from 'react';
import { motion, useInView, useMotionValue, useTransform, animate } from 'framer-motion';
import { useTranslations, useLocale } from 'next-intl';
import { Users, Calendar, Building2, MapPin, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Locale } from '@/i18n/config';

interface StatItemProps {
  icon: React.ElementType;
  value: number;
  suffix?: string;
  label: string;
  gradient: string;
  glow: string;
  delay: number;
  locale: Locale;
}

function StatItem({ icon: Icon, value, suffix = '', label, gradient, glow, delay, locale }: StatItemProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => {
    const num = Math.round(latest);
    return num.toLocaleString(locale === 'ar' ? 'ar-DZ' : locale === 'fr' ? 'fr-FR' : 'en-US');
  });

  React.useEffect(() => {
    if (!isInView) return;
    const controls = animate(count, value, { duration: 2.2, delay, ease: 'easeOut' });
    return controls.stop;
  }, [isInView, value, delay, count]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
    >
      <div className="group relative glass-premium p-6 lg:p-8 rounded-2xl hover:-translate-y-1 transition-all duration-500 overflow-hidden">
        <div
          className={cn(
            'absolute -top-10 -end-10 w-40 h-40 rounded-full bg-gradient-to-br opacity-20 blur-2xl group-hover:opacity-30 transition-opacity',
            gradient
          )}
        />

        <div className="relative">
          <div
            className={cn(
              'inline-flex h-12 w-12 lg:h-14 lg:w-14 items-center justify-center rounded-2xl bg-gradient-to-br mb-4 group-hover:scale-110 transition-transform duration-500',
              gradient,
              glow
            )}
          >
            <Icon className="h-6 w-6 lg:h-7 lg:w-7 text-white" />
          </div>

          <div className="flex items-baseline gap-1">
            <motion.span className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
              {rounded}
            </motion.span>
            {suffix && (
              <span className="text-2xl sm:text-3xl font-bold gradient-text-static">
                {suffix}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 mt-1 text-xs text-emerald-500 font-medium">
            <TrendingUp className="h-3 w-3" />
            <span>+12% this month</span>
          </div>

          <p className="text-sm text-muted-foreground mt-2">{label}</p>
        </div>
      </div>
    </motion.div>
  );
}

export function Stats() {
  const t = useTranslations('home.stats');
  const locale = useLocale() as Locale;

  const stats = [
    { icon: Users, value: 12500, suffix: '+', label: 'Students', gradient: 'from-brand-primary to-cyan-500', glow: 'glow-primary' },
    { icon: Calendar, value: 850, suffix: '+', label: 'Events', gradient: 'from-brand-secondary to-emerald-500', glow: 'glow-secondary' },
    { icon: Building2, value: 320, suffix: '+', label: 'Associations', gradient: 'from-brand-accent to-purple-500', glow: 'glow-accent' },
    { icon: MapPin, value: 48, label: 'Faculties', gradient: 'from-amber-500 to-orange-500', glow: '' },
  ];

  return (
    <section className="py-12 lg:py-20 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {stats.map((stat, i) => (
            <StatItem key={stat.label} locale={locale} {...stat} delay={i * 0.1} />
          ))}
        </div>
      </div>
    </section>
  );
}
