'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Bell, Plus, Search, Trash2, Send, CheckCheck, Users } from 'lucide-react';
import { GlassCard } from '@/components/glass-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { createClient } from '@/lib/supabase/client';
import { Modal } from '../_components/modal';
import type { Notification, Profile } from '@/lib/database.types';

const TYPE_VARIANTS: Record<string, 'info' | 'warning' | 'accent' | 'glass'> = {
  general: 'info',
  event: 'accent',
  post: 'glass',
  admin: 'warning',
};

export default function AdminNotificationsPage() {
  const supabase = createClient();
  const [notifications, setNotifications] = React.useState<Notification[]>([]);
  const [users, setUsers] = React.useState<Profile[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState('');
  const [showCreate, setShowCreate] = React.useState(false);
  const [deleting, setDeleting] = React.useState<string | null>(null);
  const [sending, setSending] = React.useState(false);

  const [form, setForm] = React.useState({
    title: '', message: '', type: 'general' as Notification['type'], user_id: '', sendToAll: false,
  });

  async function load() {
    setLoading(true);
    const [notifRes, usersRes] = await Promise.all([
      supabase.from('notifications').select('*').order('created_at', { ascending: false }).limit(50),
      supabase.from('profiles').select('id, full_name, email').order('full_name'),
    ]);
    if (notifRes.data) setNotifications(notifRes.data as Notification[]);
    if (usersRes.data) setUsers(usersRes.data as Profile[]);
    setLoading(false);
  }

  React.useEffect(() => { load(); }, []);

  async function handleCreate() {
    setSending(true);
    if (form.sendToAll) {
      for (const user of users) {
        await supabase.from('notifications').insert({
          user_id: user.id,
          title: form.title,
          message: form.message || null,
          type: form.type,
        } as any);
      }
    } else if (form.user_id) {
      await supabase.from('notifications').insert({
        user_id: form.user_id,
        title: form.title,
        message: form.message || null,
        type: form.type,
      } as any);
    }
    setSending(false);
    setShowCreate(false);
    setForm({ title: '', message: '', type: 'general', user_id: '', sendToAll: false });
    load();
  }

  async function handleDelete() {
    if (!deleting) return;
    const { error } = await supabase.from('notifications').delete().eq('id', deleting);
    if (!error) { setDeleting(null); load(); }
  }

  const filtered = notifications.filter((n) =>
    !search || n.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <GlassCard>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-white">Notifications</h1>
              <p className="text-white/40 text-sm mt-1">Send and manage platform notifications</p>
            </div>
            <Button variant="gradient" onClick={() => setShowCreate(true)} className="gap-2">
              <Plus className="h-4 w-4" /> Send Notification
            </Button>
          </div>

          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
            <Input
              placeholder="Search notifications..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-white/40">
              <Bell className="h-12 w-12 mb-4 opacity-50" />
              <p className="text-lg font-medium">No notifications found</p>
              <p className="text-sm mt-1">Send your first notification to get started.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5 text-white/40 text-xs uppercase tracking-wider">
                    <th className="text-left py-3 pr-4 font-medium">Title</th>
                    <th className="text-left py-3 pr-4 font-medium">Type</th>
                    <th className="text-left py-3 pr-4 font-medium">Status</th>
                    <th className="text-left py-3 pr-4 font-medium">Created</th>
                    <th className="text-right py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((notif) => (
                    <tr key={notif.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 pr-4">
                        <div>
                          <div className="text-white font-medium">{notif.title}</div>
                          {notif.message && (
                            <div className="text-white/40 text-xs max-w-[300px] truncate mt-0.5">{notif.message}</div>
                          )}
                        </div>
                      </td>
                      <td className="py-3 pr-4">
                        <Badge variant={TYPE_VARIANTS[notif.type] || 'glass'} className="text-xs capitalize">
                          {notif.type}
                        </Badge>
                      </td>
                      <td className="py-3 pr-4">
                        {notif.is_read ? (
                          <span className="inline-flex items-center gap-1 text-xs text-white/40">
                            <CheckCheck className="h-3.5 w-3.5" /> Read
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs text-primary/80">
                            <Send className="h-3.5 w-3.5" /> Sent
                          </span>
                        )}
                      </td>
                      <td className="py-3 pr-4 text-white/60 text-xs whitespace-nowrap">
                        {new Date(notif.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => setDeleting(notif.id)}
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

      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Send Notification">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/70 mb-1.5">Title</label>
            <Input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Notification title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/70 mb-1.5">Message</label>
            <textarea
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="Notification message (optional)"
              rows={3}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/70 mb-1.5">Type</label>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value as Notification['type'] })}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="general">General</option>
              <option value="event">Event</option>
              <option value="post">Post</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="sendToAll"
              checked={form.sendToAll}
              onChange={(e) => setForm({ ...form, sendToAll: e.target.checked, user_id: e.target.checked ? '' : form.user_id })}
              className="rounded border-white/20 bg-white/5 text-primary focus:ring-primary/50"
            />
            <label htmlFor="sendToAll" className="text-sm text-white/70">Send to all users</label>
          </div>

          {!form.sendToAll && (
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1.5">Recipient</label>
              <select
                value={form.user_id}
                onChange={(e) => setForm({ ...form, user_id: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="">Select a user...</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>{u.full_name} ({u.email})</option>
                ))}
              </select>
            </div>
          )}
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="ghost" onClick={() => setShowCreate(false)}>Cancel</Button>
          <Button variant="gradient" onClick={handleCreate} disabled={sending || !form.title || (!form.sendToAll && !form.user_id)} className="gap-2">
            {sending ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            {form.sendToAll ? `Send to All (${users.length})` : 'Send'}
          </Button>
        </div>
      </Modal>

      <Modal open={!!deleting} onClose={() => setDeleting(null)} title="Delete Notification">
        <p className="text-white/60">Are you sure you want to delete this notification? This action cannot be undone.</p>
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="ghost" onClick={() => setDeleting(null)}>Cancel</Button>
          <Button variant="destructive" onClick={handleDelete}>Delete</Button>
        </div>
      </Modal>
    </div>
  );
}
