'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Users, Search, Shield, Trash2 } from 'lucide-react';
import { GlassCard } from '@/components/glass-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { createClient } from '@/lib/supabase/client';
import { Modal } from '../_components/modal';
import type { Profile } from '@/lib/database.types';

const ROLE_VARIANTS: Record<string, 'glass' | 'secondary' | 'accent' | 'success'> = {
  student: 'glass',
  moderator: 'secondary',
  admin: 'accent',
};

export default function AdminUsersPage() {
  const supabase = createClient();
  const [users, setUsers] = React.useState<Profile[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState('');
  const [deleting, setDeleting] = React.useState<Profile | null>(null);

  async function load() {
    setLoading(true);
    let query = supabase.from('profiles').select('*').order('created_at', { ascending: false });
    if (search) {
      query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%,university.ilike.%${search}%`);
    }
    const { data } = await query;
    if (data) setUsers(data as Profile[]);
    setLoading(false);
  }

  React.useEffect(() => { load(); }, [search]);

  async function handleRoleChange(userId: string, role: string) {
    await supabase.from('profiles').update({ role, updated_at: new Date().toISOString() } as any).eq('id', userId);
    load();
  }

  async function handleDelete() {
    if (!deleting) return;
    await supabase.auth.admin.deleteUser(deleting.id);
    setDeleting(null);
    load();
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <GlassCard>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-white">Users</h1>
              <p className="text-white/40 text-sm mt-1">Manage student accounts and roles</p>
            </div>
          </div>

          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
            <Input
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          ) : users.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-white/40">
              <Users className="h-12 w-12 mb-4 opacity-50" />
              <p className="text-lg font-medium">No users found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5 text-white/40 text-xs uppercase tracking-wider">
                    <th className="text-left py-3 pr-4 font-medium">User</th>
                    <th className="text-left py-3 pr-4 font-medium">University</th>
                    <th className="text-left py-3 pr-4 font-medium">Faculty</th>
                    <th className="text-left py-3 pr-4 font-medium">Role</th>
                    <th className="text-left py-3 pr-4 font-medium">Joined</th>
                    <th className="text-right py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={user.avatar_url || undefined} />
                            <AvatarFallback className="text-xs bg-gradient-to-br from-primary/30 to-accent/30 text-white">
                              {getInitials(user.full_name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="text-white font-medium">{user.full_name}</div>
                            <div className="text-white/40 text-xs">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 pr-4 text-white/60">{user.university || '—'}</td>
                      <td className="py-3 pr-4 text-white/60">{user.faculty || '—'}</td>
                      <td className="py-3 pr-4">
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user.id, e.target.value)}
                          className="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-xs text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                        >
                          <option value="student">student</option>
                          <option value="moderator">moderator</option>
                          <option value="admin">admin</option>
                        </select>
                      </td>
                      <td className="py-3 pr-4 text-white/60 whitespace-nowrap text-xs">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => setDeleting(user)}
                          className="rounded-lg p-2 text-red-400/60 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </GlassCard>
      </motion.div>

      <Modal open={!!deleting} onClose={() => setDeleting(null)} title="Delete User">
        <p className="text-white/60">
          Are you sure you want to delete <span className="text-white font-medium">{deleting?.full_name}</span>?
          This will permanently remove their account and all associated data.
        </p>
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="ghost" onClick={() => setDeleting(null)}>Cancel</Button>
          <Button variant="destructive" onClick={handleDelete}>Delete User</Button>
        </div>
      </Modal>
    </div>
  );
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}
