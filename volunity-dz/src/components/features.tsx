'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import {
  Sparkles,
  QrCode,
  Trophy,
  Users,
  ArrowUpRight,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const iconMap: Record<string, LucideIcon> = {
  ai: Sparkles,
  qr: QrCode,
  network: Users,
  community: Users,
};

const gradientMap: Record<string, string> = {
  ai: 'from-brand-primary to-cyan-500',
  qr: 'from-brand-secondary to-emerald-500',
  network: 'from-brand-accent to-purple-500',
  community: 'from-amber-400 to-orange-500',
};

const glowMap: Record<string, string> = {
  ai: 'glow-primary',
  qr: 'glow-secondary',
  network: 'glow-accent',
  community: '',
};

export function Features() {
  const t = useTranslations('home.features');

  const features = [
    { key: 'ai', icon: iconMap.ai, gradient: gradientMap.ai, glow: glowMap.ai },
    { key: 'qr', icon: iconMap.qr, gradient: gradientMap.qr, glow: glowMap.qr },
    { key: 'network', icon: iconMap.network, gradient: gradientMap.network, glow: glowMap.network },
    { key: 'community', icon: iconMap.community, gradient: gradientMap.community, glow: glowMap.community },
  ];

  return (
    <section className="section">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 glass px-4 py-1.5 rounded-full mb-4">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span className="text-sm font-medium">Powerful features</span>
          </div>
          <h2 className="display-2 mb-4">{t('title')}</h2>
          <p className="lead text-pretty">{t('subtitle')}</p>
        </motion.div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.key}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <div className="group relative glass-premium p-6 h-full rounded-2xl hover:-translate-y-1 transition-all duration-500 cursor-pointer overflow-hidden">
                {/* Hover gradient */}
                <div
                  className={cn(
                    'absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-500',
                    feature.gradient
                  )}
                />

                {/* Icon */}
                <div className="relative mb-5">
                  <div
                    className={cn(
                      'absolute inset-0 bg-gradient-to-br rounded-2xl blur-xl opacity-50',
                      feature.gradient
                    )}
                  />
                  <div
                    className={cn(
                      'relative h-14 w-14 rounded-2xl bg-gradient-to-br flex items-center justify-center group-hover:scale-110 transition-transform duration-500',
                      feature.gradient,
                      feature.glow
                    )}
                  >
                    <feature.icon className="h-7 w-7 text-white" />
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">
                  {t(`items.${feature.key}.title`)}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t(`items.${feature.key}.description`)}
                </p>

                {/* Arrow on hover */}
                <div className="mt-4 flex items-center gap-1 text-sm text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Learn more</span>
                  <ArrowUpRight className="h-3.5 w-3.5 rtl-flip" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
