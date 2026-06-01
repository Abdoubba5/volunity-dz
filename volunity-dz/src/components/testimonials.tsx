'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Quote, Star, GraduationCap, Building2, HeartHandshake } from 'lucide-react';
import { cn, getInitials } from '@/lib/utils';

interface Testimonial {
  quote: string;
  name: string;
  role: string;
  org: string;
  rating: number;
  avatar?: string;
  type: 'volunteer' | 'association' | 'organizer';
}

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      'Volunity DZ transformed how I find volunteering opportunities. The AI recommendations are spot on — I discovered projects I never knew existed in my city.',
    name: 'Amina Belkacem',
    role: 'University Student',
    org: 'University of Algiers',
    rating: 5,
    type: 'volunteer',
  },
  {
    quote:
      'As an association, we increased our event participation by 300% in just three months. The QR attendance system saves us hours of work every week.',
    name: 'Karim Hadj',
    role: 'Director',
    org: 'Green Algeria',
    rating: 5,
    type: 'association',
  },
  {
    quote:
      'The gamification with badges and levels keeps our volunteers engaged and motivated. It is now the most popular platform in our network.',
    name: 'Sara Mansouri',
    role: 'Program Coordinator',
    org: 'Youth for Education',
    rating: 5,
    type: 'organizer',
  },
];

const typeStyles = {
  volunteer: 'from-brand-primary to-cyan-500',
  association: 'from-brand-secondary to-emerald-500',
  organizer: 'from-brand-accent to-purple-500',
};

const typeIcon = {
  volunteer: GraduationCap,
  association: Building2,
  organizer: HeartHandshake,
};

export function Testimonials() {
  const t = useTranslations('home.testimonials');

  return (
    <section className="section relative overflow-hidden">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TESTIMONIALS.map((testimonial, i) => {
            const TypeIcon = typeIcon[testimonial.type];
            return (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div className="glass-premium p-6 h-full rounded-2xl relative group hover:-translate-y-1 transition-all duration-500">
                  {/* Quote icon */}
                  <div className="absolute -top-3 -start-3 h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Quote className="h-5 w-5 text-white fill-white" />
                  </div>

                  {/* Stars */}
                  <div className="flex items-center gap-0.5 mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, j) => (
                      <Star
                        key={j}
                        className="h-4 w-4 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>

                  {/* Quote */}
                  <p className="text-sm text-foreground/90 leading-relaxed mb-6 text-pretty">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                    <div
                      className={cn(
                        'h-11 w-11 rounded-full bg-gradient-to-br flex items-center justify-center font-bold text-white flex-shrink-0',
                        typeStyles[testimonial.type]
                      )}
                    >
                      {getInitials(testimonial.name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">
                        {testimonial.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {testimonial.role} • {testimonial.org}
                      </p>
                    </div>
                    <div
                      className={cn(
                        'h-8 w-8 rounded-lg bg-gradient-to-br flex items-center justify-center flex-shrink-0',
                        typeStyles[testimonial.type]
                      )}
                    >
                      <TypeIcon className="h-4 w-4 text-white" />
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
