'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Home, Calendar, User as UserIcon, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Locale } from '@/i18n/config';

export function MobileBottomNav() {
  const t = useTranslations('nav');
  const locale = useLocale() as Locale;
  const pathname = usePathname();

  const items = [
    { href: `/${locale}`, label: t('home'), icon: Home },
    { href: `/${locale}/events`, label: t('events'), icon: Calendar },
    { href: `/${locale}/events/new`, label: '', icon: Plus, primary: true },
    { href: `/${locale}/dashboard`, label: t('dashboard'), icon: UserIcon },
  ];

  const isActive = (href: string) => {
    if (href === `/${locale}`) return pathname === href;
    if (href === `/${locale}/events/new`) return false;
    return pathname.startsWith(href);
  };

  return (
    <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 px-3 pb-3 pointer-events-none">
      <motion.nav
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, type: 'spring', damping: 25 }}
        className="glass-strong rounded-2xl shadow-2xl shadow-black/40 border border-white/10 px-2 py-2 pointer-events-auto"
      >
        <div className="flex items-center justify-around relative">
          {items.map((item) => {
            if (item.primary) {
              return (
                <Link key={item.href} href={item.href} className="relative -mt-7">
                  <motion.div
                    whileTap={{ scale: 0.9 }}
                    className="h-14 w-14 rounded-2xl bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center shadow-lg glow-primary"
                  >
                    <item.icon className="h-7 w-7 text-white" strokeWidth={2.5} />
                  </motion.div>
                </Link>
              );
            }

            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-colors min-w-[60px] relative',
                  active ? 'text-primary' : 'text-muted-foreground'
                )}
              >
                {active && (
                  <motion.span
                    layoutId="bottomNavActive"
                    className="absolute inset-0 bg-primary/10 border border-primary/20 rounded-xl"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <item.icon className="h-5 w-5 relative z-10" />
                <span className="text-[10px] font-medium relative z-10">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </motion.nav>
    </div>
  );
}
