'use client';

import * as React from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Locale } from '@/i18n/config';

export function CTASection() {
  const t = useTranslations('home.cta');
  const locale = useLocale() as Locale;

  return (
    <section className="py-16 lg:py-24 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl"
        >
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-brand-primary via-brand-secondary to-brand-accent opacity-20" />
          <div className="absolute inset-0 grid-pattern opacity-30" />

          {/* Decorative orbs */}
          <div className="absolute -top-20 -start-20 w-64 h-64 rounded-full bg-primary/30 blur-3xl" />
          <div className="absolute -bottom-20 -end-20 w-64 h-64 rounded-full bg-accent/30 blur-3xl" />

          <div className="relative glass-card p-8 sm:p-12 lg:p-16 text-center max-w-4xl mx-auto border-white/20">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-primary to-brand-accent mb-6 glow-primary"
            >
              <Sparkles className="h-8 w-8 text-white" />
            </motion.div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-balance">
              {t('title')}
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto text-balance">
              {t('subtitle')}
            </p>

            <Button asChild variant="gradient" size="xl" className="gap-2 group">
              <Link href={`/${locale}/register`}>
                {t('button')}
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 rtl-flip transition-transform" />
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
