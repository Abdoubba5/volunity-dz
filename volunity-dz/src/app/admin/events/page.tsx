'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import {
  Calendar, Plus, Search, Pencil, Trash2, Users,
} from 'lucide-react';
import { GlassCard } from '@/components/glass-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { createClient } from '@/lib/supabase/client';
import { Modal } from '../_components/modal';
import type { Event } from '@/lib/database.types';

const CATEGORY_VARIANTS: Record<string, 'success' | 'info' | 'warning' | 'accent' | 'glass'> = {
  academic: 'accent',
  cultural: 'info',
  sports: 'success',
  social: 'warning',
  career: 'glass',
};

export default function AdminEventsPage() {
  const supabase = createClient();
  const [events, setEvents] = React.useState<Event[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState('');
  const [showCreate, setShowCreate] = React.useState(false);
  const [editing, setEditing] = React.useState<Event | null>(null);
  const [deleting, setDeleting] = React.useState<string | null>(null);

  const [form, setForm] = React.useState<{
    title: string; description: string; location: string; date: string;
    category: string; image_url: string; max_participants: number;
  }>({
    title: '', description: '', location: '', date: '', category: 'academic',
    image_url: '', max_participants: 100,
  });

  async function load() {
    setLoading(true);
    let query = supabase.from('events').select('*').order('date', { ascending: false });
    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%,location.ilike.%${search}%`);
    }
    const { data } = await query;
    if (data) setEvents(data as Event[]);
    setLoading(false);
  }

  React.useEffect(() => { load(); }, [search]);

  function resetForm() {
    setForm({ title: '', description: '', location: '', date: '', category: 'academic', image_url: '', max_participants: 100 });
  }

  async function handleCreate() {
    const { error } = await supabase.from('events').insert({
      title: form.title,
      description: form.description,
      location: form.location,
      date: form.date,
      category: form.category,
      image_url: form.image_url || null,
      max_participants: form.max_participants,
    } as any);
    if (!error) { setShowCreate(false); resetForm(); load(); }
  }

  async function handleUpdate() {
    if (!editing) return;
    const { error } = await supabase.from('events').update({
      title: form.title,
      description: form.description,
      location: form.location,
      date: form.date,
      category: form.category,
      image_url: form.image_url || null,
      max_participants: form.max_participants,
      updated_at: new Date().toISOString(),
    } as any).eq('id', editing.id);
    if (!error) { setEditing(null); resetForm(); load(); }
  }

  async function handleDelete() {
    if (!deleting) return;
    const { error } = await supabase.from('events').delete().eq('id', deleting);
    if (!error) { setDeleting(null); load(); }
  }

  function openEdit(event: Event) {
    setEditing(event);
    setForm({
      title: event.title,
      description: event.description || '',
      location: event.location || '',
      date: event.date.slice(0, 16),
      category: event.category || 'academic',
      image_url: event.image_url || '',
      max_participants: event.max_participants || 100,
    });
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <GlassCard>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-white">Events</h1>
              <p className="text-white/40 text-sm mt-1">Manage campus events</p>
            </div>
            <Button variant="gradient" onClick={() => { resetForm(); setShowCreate(true); }} className="gap-2">
              <Plus className="h-4 w-4" /> Create Event
            </Button>
          </div>

          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
            <Input
              placeholder="Search events..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          ) : events.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-white/40">
              <Calendar className="h-12 w-12 mb-4 opacity-50" />
              <p className="text-lg font-medium">No events found</p>
              <p className="text-sm mt-1">Create your first event to get started.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5 text-white/40 text-xs uppercase tracking-wider">
                    <th className="text-left py-3 pr-4 font-medium">Title</th>
                    <th className="text-left py-3 pr-4 font-medium">Category</th>
                    <th className="text-left py-3 pr-4 font-medium">Date</th>
                    <th className="text-left py-3 pr-4 font-medium">Location</th>
                    <th className="text-center py-3 pr-4 font-medium">Max</th>
                    <th className="text-right py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((event) => (
                    <tr key={event.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 pr-4">
                        <span className="text-white font-medium">{event.title}</span>
                      </td>
                      <td className="py-3 pr-4">
                        <Badge variant={CATEGORY_VARIANTS[event.category || 'glass'] || 'glass'} className="text-xs capitalize">
                          {event.category}
                        </Badge>
                      </td>
                      <td className="py-3 pr-4 text-white/60 whitespace-nowrap">
                        {new Date(event.date).toLocaleDateString()}
                      </td>
                      <td className="py-3 pr-4 text-white/60">{event.location}</td>
                      <td className="py-3 pr-4 text-center text-white/60">
                        <span className="inline-flex items-center gap-1">
                          <Users className="h-3.5 w-3.5" />
                          {event.max_participants || '∞'}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => openEdit(event)}
                            className="rounded-lg p-2 text-white/40 hover:text-white hover:bg-white/10 transition-colors"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setDeleting(event.id)}
                            className="rounded-lg p-2 text-red-400/60 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </GlassCard>
      </motion.div>

      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Create Event">
        <EventForm form={form} onChange={setForm} />
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="ghost" onClick={() => setShowCreate(false)}>Cancel</Button>
          <Button variant="gradient" onClick={handleCreate}>Create Event</Button>
        </div>
      </Modal>

      <Modal open={!!editing} onClose={() => { setEditing(null); resetForm(); }} title="Edit Event">
        <EventForm form={form} onChange={setForm} />
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="ghost" onClick={() => { setEditing(null); resetForm(); }}>Cancel</Button>
          <Button variant="gradient" onClick={handleUpdate}>Save Changes</Button>
        </div>
      </Modal>

      <Modal open={!!deleting} onClose={() => setDeleting(null)} title="Delete Event">
        <p className="text-white/60">Are you sure you want to delete this event? This action cannot be undone.</p>
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="ghost" onClick={() => setDeleting(null)}>Cancel</Button>
          <Button variant="destructive" onClick={handleDelete}>Delete</Button>
        </div>
      </Modal>
    </div>
  );
}

function EventForm({ form, onChange }: {
  form: { title: string; description: string; location: string; date: string; category: string; image_url: string; max_participants: number };
  onChange: (f: typeof form) => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-white/70 mb-1.5">Title</label>
        <Input value={form.title} onChange={(e) => onChange({ ...form, title: e.target.value })} placeholder="Event title" />
      </div>
      <div>
        <label className="block text-sm font-medium text-white/70 mb-1.5">Description</label>
        <textarea
          value={form.description}
          onChange={(e) => onChange({ ...form, description: e.target.value })}
          placeholder="Event description"
          rows={3}
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-white/70 mb-1.5">Date</label>
          <Input type="datetime-local" value={form.date} onChange={(e) => onChange({ ...form, date: e.target.value })} />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/70 mb-1.5">Category</label>
          <select
            value={form.category}
            onChange={(e) => onChange({ ...form, category: e.target.value })}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value="academic">Academic</option>
            <option value="cultural">Cultural</option>
            <option value="sports">Sports</option>
            <option value="social">Social</option>
            <option value="career">Career</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-white/70 mb-1.5">Location</label>
        <Input value={form.location} onChange={(e) => onChange({ ...form, location: e.target.value })} placeholder="Event location" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-white/70 mb-1.5">Image URL</label>
          <Input value={form.image_url} onChange={(e) => onChange({ ...form, image_url: e.target.value })} placeholder="https://..." />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/70 mb-1.5">Max Participants</label>
          <Input type="number" value={form.max_participants} onChange={(e) => onChange({ ...form, max_participants: parseInt(e.target.value) || 0 })} />
        </div>
      </div>
    </div>
  );
}
