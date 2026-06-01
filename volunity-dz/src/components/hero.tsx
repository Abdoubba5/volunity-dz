'use client';

import * as React from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import {
  Sparkles,
  ArrowRight,
  Play,
  Heart,
  Globe2,
  Users,
  Star,
  Zap,
  CheckCircle2,
  Quote,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { Locale } from '@/i18n/config';

const STATS_PREVIEW = [
  { icon: Users, value: '12.5K+', label: 'Students' },
  { icon: Heart, value: '850+', label: 'Events' },
  { icon: Globe2, value: '48', label: 'Faculties' },
];

const FEATURES_PREVIEW = [
  { icon: Sparkles, label: 'AI Matching' },
  { icon: Zap, label: 'QR Check-in' },
  { icon: Star, label: 'Earn Rewards' },
];

export function Hero() {
  const t = useTranslations('home.hero');
  const tStats = useTranslations('home.stats');
  const locale = useLocale() as Locale;

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });
  const rotateX = useTransform(springY, [-0.5, 0.5], [5, -5]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-5, 5]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-32">
      {/* Background layers */}
      <div className="absolute inset-0 -z-10">
        {/* Gradient mesh */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 via-transparent to-brand-accent/5" />

        {/* Animated orbs */}
        <motion.div
          className="absolute top-20 -start-20 w-72 h-72 rounded-full bg-brand-primary/30 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute top-40 -end-20 w-96 h-96 rounded-full bg-brand-accent/30 blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -40, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        />
        <motion.div
          className="absolute bottom-0 start-1/4 w-80 h-80 rounded-full bg-brand-secondary/20 blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            x: [0, 20, 0],
            y: [0, -30, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        />

        {/* Grid pattern */}
        <div className="absolute inset-0 grid-pattern opacity-20" />

        {/* Radial vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,hsl(var(--background))_70%)]" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left content */}
          <div className="text-center lg:text-start relative z-10">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Badge variant="glass" className="mb-6 px-4 py-2 gap-2 inline-flex">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                >
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                </motion.div>
                <span className="gradient-text-static font-semibold text-sm">
                  {t('badge')}
                </span>
              </Badge>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="display-1 mb-6"
            >
              <span className="block">{t('title')}</span>
              <span className="block gradient-text mt-2">{tStats('volunteers')}</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="lead mb-8 max-w-2xl mx-auto lg:mx-0"
            >
              {t('subtitle')}
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start mb-10"
            >
              <Button
                asChild
                variant="gradient"
                size="xl"
                className="gap-2 group glow-primary"
              >
                <Link href={`/${locale}/register`}>
                  {t('ctaPrimary')}
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 rtl-flip transition-transform" />
                </Link>
              </Button>
              <Button
                asChild
                variant="glass"
                size="xl"
                className="gap-2"
              >
                <Link href={`/${locale}/events`}>
                  <div className="h-7 w-7 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                    <Play className="h-3.5 w-3.5 fill-current" />
                  </div>
                  {t('ctaSecondary')}
                </Link>
              </Button>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-3"
            >
              <div className="flex -space-x-2 rtl:space-x-reverse">
                {['#00B7FF', '#00E38C', '#8B5CF6', '#F59E0B', '#EC4899'].map((color, i) => (
                  <div
                    key={i}
                    className="h-9 w-9 rounded-full ring-2 ring-background flex items-center justify-center text-xs font-bold text-white shadow-lg"
                    style={{
                      background: `linear-gradient(135deg, ${color}, ${color}99)`,
                    }}
                  >
                    {String.fromCharCode(65 + i)}
                  </div>
                ))}
              </div>
              <div className="flex flex-col text-start">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  ))}
                  <span className="text-sm font-semibold ms-1">4.9</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {t('trustText')} <span className="text-foreground font-semibold">{t('trustCount')}</span>
                </p>
              </div>
            </motion.div>
          </div>

          {/* Right - 3D Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative hidden lg:block"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ perspective: 1000 }}
          >
            <motion.div
              className="relative"
              style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
            >
              {/* Main visual card */}
              <div className="relative h-[500px] xl:h-[560px]">
                <div className="absolute inset-0 glass-premium rounded-3xl overflow-hidden p-0">
                  {/* Hero image */}
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                      backgroundImage:
                        "url('https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=900&q=80')",
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-background via-background/40 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />

                  {/* Content overlay */}
                  <div className="absolute inset-0 p-6 flex flex-col justify-between">
                    {/* Top tag */}
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 }}
                      className="flex items-center justify-between"
                    >
                      <Badge variant="glass" className="gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                        Live now
                      </Badge>
                      <div className="h-9 w-9 rounded-full glass flex items-center justify-center">
                        <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                      </div>
                    </motion.div>

                    {/* Bottom info */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1 }}
                      className="space-y-2"
                    >
                      <Badge variant="default" className="bg-primary/90">
                        Academic
                      </Badge>
                      <h3 className="text-2xl font-bold">Welcome Week 2026</h3>
                      <p className="text-sm text-white/80">University of Algiers</p>
                    </motion.div>
                  </div>
                </div>

                {/* Floating cards */}
                <motion.div
                  initial={{ opacity: 0, x: -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9, type: 'spring' }}
                  className="absolute -top-6 -start-6 glass-premium p-4 w-56 animate-float"
                  style={{ transform: 'translateZ(40px)' }}
                >
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0">
                      <Heart className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Active now</p>
                      <p className="text-lg font-bold">142 students</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1, type: 'spring' }}
                  className="absolute top-1/3 -end-8 glass-premium p-4 w-64 animate-float"
                  style={{ animationDelay: '1s', transform: 'translateZ(60px)' }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-accent to-purple-500 flex items-center justify-center font-bold text-white">
                      S
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Student</p>
                      <p className="text-xs text-muted-foreground">University of Algiers</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Events attended</span>
                    <span className="gradient-text-static font-bold">12</span>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.3, type: 'spring' }}
                  className="absolute -bottom-4 start-8 glass-premium p-4 w-52 animate-float"
                  style={{ animationDelay: '2s', transform: 'translateZ(80px)' }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <span className="text-sm font-semibold">AI Match</span>
                    <Badge variant="success" className="ms-auto text-[10px]">
                      98%
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Career Fair 2026
                  </p>
                  <p className="text-xs text-muted-foreground">Algiers, June 25</p>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
