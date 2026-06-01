'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  Sparkles,
  Bell,
  Search,
  User as UserIcon,
  Shield,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Logo } from '@/components/logo';
import { LanguageSwitcher } from '@/components/language-switcher';
import { ThemeToggle } from '@/components/theme-toggle';
import { NotificationsMenu } from '@/components/notifications-menu';
import { useAuth } from '@/lib/auth-context';
import { getInitials, cn } from '@/lib/utils';
import type { Locale } from '@/i18n/config';

export function Navbar() {
  const t = useTranslations('nav');
  const tCommon = useTranslations('common');
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const [scrolled, setScrolled] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  React.useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  React.useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const { user, profile, isAuthenticated, signOut } = useAuth();

  const userName = profile?.full_name || user?.user_metadata?.name || '';
  const userAvatar = profile?.avatar_url || '';
  const isAdmin = profile?.role === 'admin';

  const navLinks = [
    { href: `/${locale}`, label: t('home') },
    { href: `/${locale}/events`, label: t('events') },
    { href: `/${locale}/posts`, label: 'Posts' },
    { href: `/${locale}/resources`, label: 'Resources' },
    { href: `/${locale}/associations`, label: t('associations') },
  ];

  if (isAuthenticated) {
    navLinks.push({ href: `/${locale}/dashboard`, label: t('dashboard') });
  }

  if (isAdmin) {
    navLinks.push({ href: `/${locale}/admin`, label: 'Admin' });
  }

  const isActive = (href: string) => {
    if (href === `/${locale}`) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          scrolled
            ? 'backdrop-blur-2xl bg-background/80 border-b border-white/10 shadow-2xl shadow-black/20'
            : 'bg-transparent'
        )}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <Link
              href={`/${locale}`}
              className="flex-shrink-0 transition-transform hover:scale-105"
            >
              <Logo size="md" />
            </Link>

            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'relative px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                    isActive(link.href)
                      ? 'text-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {isActive(link.href) && (
                    <motion.span
                      layoutId="activeNav"
                      className="absolute inset-0 bg-primary/10 border border-primary/30 rounded-lg"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{link.label}</span>
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-1.5 sm:gap-2">
              <ThemeToggle />
              <LanguageSwitcher />
              <NotificationsMenu />

              <div className="hidden md:flex items-center gap-2 ms-2">
                {isAuthenticated ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="flex items-center gap-2 p-1 rounded-full hover:bg-white/5 transition-colors">
                        <Avatar className="h-8 w-8 ring-2 ring-primary/30">
                          <AvatarImage src={userAvatar} alt={userName} />
                          <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white text-xs">
                            {getInitials(userName || 'U')}
                          </AvatarFallback>
                        </Avatar>
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 glass-premium border-white/10">
                      <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col">
                          <span className="font-semibold">{userName}</span>
                          <span className="text-xs text-muted-foreground">{user?.email}</span>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator className="bg-white/10" />
                      <DropdownMenuItem asChild>
                        <Link href={`/${locale}/profile`} className="cursor-pointer">{t('profile')}</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/${locale}/dashboard`} className="cursor-pointer">{t('dashboard')}</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/${locale}/notifications`} className="cursor-pointer">{t('notifications')}</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/${locale}/settings`} className="cursor-pointer">{t('settings')}</Link>
                      </DropdownMenuItem>
                      {isAdmin && (
                        <>
                          <DropdownMenuSeparator className="bg-white/10" />
                          <DropdownMenuItem asChild>
                            <Link href={`/${locale}/admin`} className="cursor-pointer">
                              <Shield className="h-4 w-4 me-2" />
                              Admin Panel
                            </Link>
                          </DropdownMenuItem>
                        </>
                      )}
                      <DropdownMenuSeparator className="bg-white/10" />
                      <DropdownMenuItem
                        className="text-destructive cursor-pointer"
                        onClick={() => signOut()}
                      >
                        {t('logout')}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <>
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/${locale}/login`}>{t('login')}</Link>
                    </Button>
                    <Button asChild variant="gradient" size="sm" className="gap-2 glow-primary">
                      <Link href={`/${locale}/register`}>
                        <Sparkles className="h-4 w-4" />
                        {t('register')}
                      </Link>
                    </Button>
                  </>
                )}
              </div>

              <Button
                variant="glass"
                size="icon"
                className="lg:hidden rounded-full ms-1"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Menu"
              >
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: locale === 'ar' ? '-100%' : '100%' }}
              animate={{ x: 0 }}
              exit={{ x: locale === 'ar' ? '-100%' : '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className={cn(
                'fixed top-0 z-40 h-full w-[85%] max-w-sm lg:hidden',
                'bg-background/95 backdrop-blur-2xl border-white/10',
                locale === 'ar' ? 'left-0 border-r' : 'right-0 border-l'
              )}
            >
              <div className="flex flex-col h-full p-6 pt-24">
                <div className="relative mb-4">
                  <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="search"
                    placeholder={tCommon('search')}
                    className="w-full h-11 ps-10 pe-4 rounded-xl glass text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <nav className="flex flex-col gap-1 flex-1 overflow-y-auto">
                  {navLinks.map((link, i) => (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: locale === 'ar' ? -20 : 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Link
                        href={link.href}
                        className={cn(
                          'flex items-center px-4 py-3 rounded-xl text-base font-medium transition-colors',
                          isActive(link.href)
                            ? 'bg-primary/10 text-primary border border-primary/30'
                            : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
                        )}
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  ))}

                  <div className="h-px bg-white/10 my-3" />

                  {isAuthenticated && (
                    <>
                      <motion.div
                        initial={{ opacity: 0, x: locale === 'ar' ? -20 : 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <Link
                          href={`/${locale}/dashboard`}
                          className="flex items-center px-4 py-3 rounded-xl text-base font-medium text-muted-foreground hover:bg-white/5 hover:text-foreground"
                        >
                          <UserIcon className="h-4 w-4 me-3" />
                          {t('dashboard')}
                        </Link>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, x: locale === 'ar' ? -20 : 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.35 }}
                      >
                        <Link
                          href={`/${locale}/notifications`}
                          className="flex items-center px-4 py-3 rounded-xl text-base font-medium text-muted-foreground hover:bg-white/5 hover:text-foreground"
                        >
                          <Bell className="h-4 w-4 me-3" />
                          {t('notifications')}
                        </Link>
                      </motion.div>
                    </>
                  )}
                </nav>

                <div className="flex flex-col gap-3 pt-6 border-t border-white/10">
                  {isAuthenticated ? (
                    <Button variant="glass" size="lg" className="w-full gap-2 text-destructive" onClick={() => signOut()}>
                      {t('logout')}
                    </Button>
                  ) : (
                    <>
                      <Button asChild variant="glass" size="lg" className="w-full">
                        <Link href={`/${locale}/login`}>{t('login')}</Link>
                      </Button>
                      <Button asChild variant="gradient" size="lg" className="w-full gap-2">
                        <Link href={`/${locale}/register`}>
                          <Sparkles className="h-4 w-4" />
                          {t('register')}
                        </Link>
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
