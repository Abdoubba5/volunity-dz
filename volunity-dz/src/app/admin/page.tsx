'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Users, Calendar, FileText, Building2, UserPlus, Clock,
  Shield, ArrowRight, Plus, BarChart3,
} from 'lucide-react';
import { GlassCard } from '@/components/glass-card';
import { Button } from '@/components/ui/button';
import { getDashboardService } from '@/lib/services';

interface AdminStats {
  totalUsers: number;
  totalEvents: number;
  totalPosts: number;
  totalAssociations: number;
  totalParticipants: number;
  totalAttendance: number;
  upcomingEvents: number;
  newUsersToday: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = React.useState<AdminStats | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    getDashboardService().getAdminStats()
      .then(setStats)
      .finally(() => setLoading(false));
  }, []);

  if (loading || !stats) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  const statCards = [
    { label: 'Total Users', value: stats.totalUsers, icon: Users, gradient: 'from-brand-primary to-cyan-500' },
    { label: 'New Today', value: stats.newUsersToday, icon: UserPlus, gradient: 'from-sky-500 to-blue-500' },
    { label: 'Total Events', value: stats.totalEvents, icon: Calendar, gradient: 'from-brand-secondary to-emerald-500' },
    { label: 'Upcoming', value: stats.upcomingEvents, icon: Clock, gradient: 'from-teal-500 to-green-500' },
    { label: 'Total Posts', value: stats.totalPosts, icon: FileText, gradient: 'from-brand-accent to-purple-500' },
    { label: 'Associations', value: stats.totalAssociations, icon: Building2, gradient: 'from-amber-400 to-yellow-600' },
    { label: 'Participants', value: stats.totalParticipants, icon: Users, gradient: 'from-pink-500 to-rose-500' },
    { label: 'Attendance', value: stats.totalAttendance, icon: Shield, gradient: 'from-indigo-500 to-violet-500' },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold mb-1">
            Admin <span className="gradient-text">Dashboard</span>
          </h1>
          <p className="text-white/40 text-sm">Platform overview and management</p>
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
                <stat.icon className="h-5 w-5 text-white/40 mb-2" />
                <div className="text-2xl sm:text-3xl font-bold text-white">{stat.value}</div>
                <div className="text-xs text-white/40 mt-1">{stat.label}</div>
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
          <h2 className="text-lg font-bold text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Button asChild variant="gradient" className="gap-2">
              <Link href="/admin/events">
                <Plus className="h-4 w-4" />
                Create Event
                <ArrowRight className="h-3.5 w-3.5 ms-auto" />
              </Link>
            </Button>
            <Button asChild variant="glass" className="gap-2">
              <Link href="/admin/users">
                <Shield className="h-4 w-4" />
                Manage Users
                <ArrowRight className="h-3.5 w-3.5 ms-auto" />
              </Link>
            </Button>
            <Button asChild variant="glass" className="gap-2">
              <Link href="/admin/associations">
                <BarChart3 className="h-4 w-4" />
                View Associations
                <ArrowRight className="h-3.5 w-3.5 ms-auto" />
              </Link>
            </Button>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}
