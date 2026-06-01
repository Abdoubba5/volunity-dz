'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { UserPlus, Compass, HandHeart } from 'lucide-react';
import { cn } from '@/lib/utils';

const stepIcons = [UserPlus, Compass, HandHeart];
const stepGradients = [
  'from-brand-primary to-cyan-500',
  'from-brand-secondary to-emerald-500',
  'from-brand-accent to-purple-500',
];

export function HowItWorks() {
  const t = useTranslations('home.howItWorks');

  return (
    <section className="section relative overflow-hidden">
      {/* Decorative bg */}
      <div className="absolute inset-0 -z-10 dot-pattern opacity-20" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="display-2 mb-4">{t('title')}</h2>
          <p className="lead text-pretty">{t('subtitle')}</p>
        </motion.div>

        <div className="relative">
          {/* Connection line */}
          <div className="hidden lg:block absolute top-1/2 start-0 end-0 h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent -translate-y-1/2" />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 relative">
            {(['1', '2', '3'] as const).map((step, i) => {
              const Icon = stepIcons[i];
              return (
                <motion.div
                  key={step}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.6, delay: i * 0.15 }}
                  className="relative"
                >
                  <div className="glass-premium p-8 rounded-2xl text-center h-full">
                    {/* Step number */}
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <div
                        className={cn(
                          'h-8 w-8 rounded-full bg-gradient-to-br flex items-center justify-center text-sm font-bold text-white shadow-lg',
                          stepGradients[i]
                        )}
                      >
                        {i + 1}
                      </div>
                    </div>

                    {/* Icon */}
                    <div className="relative inline-block mb-6 mt-2">
                      <div
                        className={cn(
                          'absolute inset-0 bg-gradient-to-br rounded-2xl blur-xl opacity-40',
                          stepGradients[i]
                        )}
                      />
                      <div
                        className={cn(
                          'relative h-16 w-16 rounded-2xl bg-gradient-to-br flex items-center justify-center',
                          stepGradients[i]
                        )}
                      >
                        <Icon className="h-8 w-8 text-white" />
                      </div>
                    </div>

                    <h3 className="text-xl font-bold mb-3">
                      {t(`steps.${step}.title`)}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {t(`steps.${step}.description`)}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
