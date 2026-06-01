'use client';

import * as React from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import {
  GraduationCap,
  Leaf,
  HeartPulse,
  Palette,
  Trophy,
  Users,
  ArrowRight,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Locale } from '@/i18n/config';
interface CategoryConfig {
  key: string;
  icon: LucideIcon;
  gradient: string;
  count: number;
}

const CATEGORIES: CategoryConfig[] = [
  { key: 'education', icon: GraduationCap, gradient: 'from-blue-500 to-cyan-500', count: 145 },
  { key: 'environment', icon: Leaf, gradient: 'from-emerald-500 to-green-500', count: 98 },
  { key: 'health', icon: HeartPulse, gradient: 'from-rose-500 to-pink-500', count: 76 },
  { key: 'culture', icon: Palette, gradient: 'from-amber-500 to-orange-500', count: 64 },
  { key: 'sports', icon: Trophy, gradient: 'from-violet-500 to-purple-500', count: 52 },
  { key: 'social', icon: Users, gradient: 'from-fuchsia-500 to-pink-500', count: 41 },
];

export function Categories() {
  const t = useTranslations('home.categories');
  const tEvents = useTranslations('events.categories_list');
  const locale = useLocale() as Locale;

  return (
    <section className="section">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <h2 className="display-2 mb-4">{t('title')}</h2>
          <p className="lead text-pretty">{t('subtitle')}</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.key}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
            >
              <Link
                href={`/${locale}/events?category=${cat.key}`}
                className="group block"
              >
                <div className="relative glass-premium p-6 rounded-2xl hover:-translate-y-1 transition-all duration-500 overflow-hidden">
                  {/* Hover gradient */}
                  <div
                    className={cn(
                      'absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-20 transition-opacity duration-500',
                      cat.gradient
                    )}
                  />

                  <div className="relative">
                    <div
                      className={cn(
                        'h-12 w-12 rounded-xl bg-gradient-to-br flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500',
                        cat.gradient
                      )}
                    >
                      <cat.icon className="h-6 w-6 text-white" />
                    </div>

                    <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">
                      {tEvents(cat.key)}
                    </h3>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{cat.count} events</span>
                      <ArrowRight className="h-3.5 w-3.5 rtl-flip opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
