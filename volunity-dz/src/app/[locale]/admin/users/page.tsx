'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Shield, ChevronDown } from 'lucide-react';
import { GlassCard } from '@/components/glass-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/lib/auth-context';
import { createClient } from '@/lib/supabase/client';
import { getInitials, formatDate } from '@/lib/utils';
import type { Locale } from '@/i18n/config';
import type { Profile, UserRole } from '@/lib/database.types';

const roleBadgeVariant: Record<UserRole, 'glass' | 'secondary' | 'accent'> = {
  student: 'glass',
  moderator: 'secondary',
  admin: 'accent',
};

export default function AdminUsersPage() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const { profile, isAuthenticated, isLoading } = useAuth();
  const [users, setUsers] = React.useState<Profile[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [updating, setUpdating] = React.useState<string | null>(null);

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
    loadUsers();
  }, [isLoading, isAuthenticated, profile, router, locale]);

  async function loadUsers() {
    const supabase = createClient();
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setUsers(data as Profile[]);
    setLoading(false);
  }

  async function handleRoleChange(userId: string, newRole: UserRole) {
    setUpdating(userId);
    const supabase = createClient();
    const { error } = await supabase
      .from('profiles')
      .update({ role: newRole, updated_at: new Date().toISOString() })
      .eq('id', userId);
    if (!error) {
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      );
    }
    setUpdating(null);
  }

  if (isLoading || loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold mb-2">
            Manage <span className="gradient-text">Users</span>
          </h1>
          <p className="text-muted-foreground">{users.length} total users</p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <GlassCard className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-muted-foreground">
                  <th className="text-start p-4 font-medium">User</th>
                  <th className="text-start p-4 font-medium hidden md:table-cell">University</th>
                  <th className="text-start p-4 font-medium hidden lg:table-cell">Faculty</th>
                  <th className="text-start p-4 font-medium">Role</th>
                  <th className="text-start p-4 font-medium hidden xl:table-cell">Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, i) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.02 }}
                    className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={user.avatar_url || undefined} alt={user.full_name} />
                          <AvatarFallback>{getInitials(user.full_name)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-sm">{user.full_name}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-muted-foreground hidden md:table-cell">
                      {user.university || '—'}
                    </td>
                    <td className="p-4 text-muted-foreground hidden lg:table-cell">
                      {user.faculty || '—'}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <select
                          value={user.role}
                          disabled={updating === user.id}
                          onChange={(e) =>
                            handleRoleChange(user.id, e.target.value as UserRole)
                          }
                          className="appearance-none bg-transparent border border-white/10 rounded-lg px-2 py-1 text-xs font-medium cursor-pointer hover:border-white/30 focus:outline-none focus:border-primary/50 transition-colors disabled:opacity-50"
                        >
                          <option value="student">student</option>
                          <option value="moderator">moderator</option>
                          <option value="admin">admin</option>
                        </select>
                        <Badge variant={roleBadgeVariant[user.role]} className="text-[10px] capitalize">
                          {user.role}
                        </Badge>
                      </div>
                    </td>
                    <td className="p-4 text-muted-foreground text-xs hidden xl:table-cell">
                      {formatDate(user.created_at, locale)}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}
