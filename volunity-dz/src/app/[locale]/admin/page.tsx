'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Users, Calendar, FileText, Building2, Plus, Shield, BarChart3, ArrowRight } from 'lucide-react';
import { GlassCard } from '@/components/glass-card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth-context';
import { getDashboardService } from '@/lib/services';
import type { Locale } from '@/i18n/config';

export default function AdminOverviewPage() {
  const t = useTranslations('common');
  const locale = useLocale() as Locale;
  const router = useRouter();
  const { profile, isAuthenticated, isLoading } = useAuth();
  const [stats, setStats] = React.useState<{
    totalUsers: number;
    totalEvents: number;
    totalPosts: number;
    totalAssociations: number;
  } | null>(null);

  React.useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      router.push(`/${locale}/login`);
      return;
    }
    if (profile?.role !== 'admin') {
      router.push(`/${locale}/dashboard`);
      return;
    }
    const svc = getDashboardService();
    svc.getAdminStats().then(setStats);
  }, [isLoading, isAuthenticated, profile, router, locale]);

  if (isLoading || !stats) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  const statCards = [
    {
      label: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      gradient: 'from-brand-primary to-cyan-500',
    },
    {
      label: 'Total Events',
      value: stats.totalEvents,
      icon: Calendar,
      gradient: 'from-brand-secondary to-emerald-500',
    },
    {
      label: 'Total Posts',
      value: stats.totalPosts,
      icon: FileText,
      gradient: 'from-brand-accent to-purple-500',
    },
    {
      label: 'Total Associations',
      value: stats.totalAssociations,
      icon: Building2,
      gradient: 'from-amber-400 to-yellow-600',
    },
  ];

  const quickActions = [
    {
      label: 'Create Event',
      icon: Plus,
      href: `/${locale}/events/create`,
      variant: 'gradient' as const,
    },
    {
      label: 'Manage Users',
      icon: Shield,
      href: `/${locale}/admin/users`,
      variant: 'glass' as const,
    },
    {
      label: 'View Reports',
      icon: BarChart3,
      href: `/${locale}/admin/analytics`,
      variant: 'glass' as const,
    },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold mb-2">
            Admin <span className="gradient-text">Dashboard</span>
          </h1>
          <p className="text-muted-foreground">Platform overview and management</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <GlassCard hover className="relative overflow-hidden">
              <div className={`absolute -top-8 -end-8 w-32 h-32 rounded-full bg-gradient-to-br ${stat.gradient} opacity-20 blur-2xl`} />
              <div className="relative">
                <stat.icon className="h-5 w-5 text-muted-foreground mb-2" />
                <div className="text-2xl sm:text-3xl font-bold">{stat.value}</div>
                <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <GlassCard>
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {quickActions.map((action) => (
              <Button key={action.label} asChild variant={action.variant} className="gap-2">
                <Link href={action.href}>
                  <action.icon className="h-4 w-4" />
                  {action.label}
                  <ArrowRight className="h-3.5 w-3.5 ms-auto rtl-flip" />
                </Link>
              </Button>
            ))}
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}
