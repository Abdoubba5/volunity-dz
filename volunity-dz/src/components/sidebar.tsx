'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Calendar,
  Users,
  Settings,
  User,
  Bell,
  BarChart3,
  Shield,
  LogOut,
  Sparkles,
  MessageSquare,
  GraduationCap,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Locale } from '@/i18n/config';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/lib/auth-context';

interface SidebarProps {
  userRole?: 'student' | 'moderator' | 'admin';
  userName?: string;
  userEmail?: string;
  userAvatar?: string;
}

export function Sidebar({ userRole = 'student', userName = 'User', userEmail = '', userAvatar }: SidebarProps) {
  const locale = useLocale() as Locale;
  const t = useTranslations('nav');
  const pathname = usePathname();
  const { profile } = useAuth();

  const menuItems = React.useMemo(() => {
    const base = [
      { icon: LayoutDashboard, label: t('dashboard'), href: `/${locale}/dashboard` },
      { icon: Calendar, label: t('events'), href: `/${locale}/events` },
      { icon: MessageSquare, label: 'Posts', href: `/${locale}/posts` },
      { icon: GraduationCap, label: 'Resources', href: `/${locale}/resources` },
      { icon: User, label: t('profile'), href: `/${locale}/profile` },
      { icon: Bell, label: 'Notifications', href: `/${locale}/notifications` },
    ];

    if (userRole === 'admin' || profile?.role === 'admin') {
      base.push(
        { icon: Shield, label: 'Admin Panel', href: `/${locale}/admin` },
        { icon: Users, label: 'Manage Users', href: `/${locale}/admin/users` },
        { icon: BarChart3, label: 'Analytics', href: `/${locale}/admin/analytics` }
      );
    }

    base.push({ icon: Settings, label: t('settings'), href: `/${locale}/settings` });

    return base;
  }, [locale, t, userRole, profile?.role]);

  const isActive = (href: string) => pathname === href;

  const roleBadgeVariant = {
    student: 'glass' as const,
    moderator: 'secondary' as const,
    admin: 'accent' as const,
  };

  return (
    <aside className="hidden lg:flex flex-col w-72 h-screen sticky top-0 border-r border-white/10 bg-background/50 backdrop-blur-xl">
      <div className="p-6 border-b border-white/10">
        <Link href={`/${locale}`} className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-brand-primary via-brand-secondary to-brand-accent flex items-center justify-center shadow-lg glow-primary">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-lg">Volunity</h2>
            <p className="text-xs text-muted-foreground">Dashboard</p>
          </div>
        </Link>
      </div>

      <div className="p-4 border-b border-white/10">
        <div className="flex items-center gap-3 p-3 rounded-xl glass">
          <Avatar className="h-10 w-10">
            <AvatarImage src={userAvatar} alt={userName} />
            <AvatarFallback>{userName.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">{userName}</p>
            <p className="text-xs text-muted-foreground truncate">{userEmail}</p>
          </div>
          <Badge variant={roleBadgeVariant[userRole]} className="text-[10px] capitalize">
            {userRole}
          </Badge>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {menuItems.map((item, index) => (
          <motion.div
            key={item.href}
            initial={{ opacity: 0, x: locale === 'ar' ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.03 }}
          >
            <Link
              href={item.href}
              className={cn(
                'group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                isActive(item.href)
                  ? 'bg-gradient-to-r from-primary/20 to-accent/10 text-primary border border-primary/30'
                  : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
              )}
            >
              <item.icon
                className={cn(
                  'h-5 w-5 transition-transform group-hover:scale-110',
                  isActive(item.href) && 'text-primary'
                )}
              />
              <span>{item.label}</span>
              {isActive(item.href) && (
                <motion.div
                  layoutId="activeSidebar"
                  className="ms-auto h-2 w-2 rounded-full bg-primary"
                />
              )}
            </Link>
          </motion.div>
        ))}
      </nav>

      <Separator className="bg-white/10" />

      <div className="p-4">
        <Button variant="glass" className="w-full justify-start gap-3" size="lg">
          <LogOut className="h-5 w-5" />
          {t('logout')}
        </Button>
      </div>
    </aside>
  );
}
