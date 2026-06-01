'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Building2, Plus, Search, Pencil, Trash2, Mail } from 'lucide-react';
import { GlassCard } from '@/components/glass-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createClient } from '@/lib/supabase/client';
import { Modal } from '../_components/modal';
import type { Association } from '@/lib/database.types';

export default function AdminAssociationsPage() {
  const supabase = createClient();
  const [associations, setAssociations] = React.useState<Association[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState('');
  const [showCreate, setShowCreate] = React.useState(false);
  const [editing, setEditing] = React.useState<Association | null>(null);
  const [deleting, setDeleting] = React.useState<string | null>(null);

  const [form, setForm] = React.useState({
    name: '', description: '', logo: '', president_name: '', faculty: '', email: '',
  });

  async function load() {
    setLoading(true);
    let query = supabase.from('associations').select('*').order('created_at', { ascending: false });
    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%,faculty.ilike.%${search}%`);
    }
    const { data } = await query;
    if (data) setAssociations(data as Association[]);
    setLoading(false);
  }

  React.useEffect(() => { load(); }, [search]);

  function resetForm() {
    setForm({ name: '', description: '', logo: '', president_name: '', faculty: '', email: '' });
  }

  async function handleCreate() {
    const { error } = await supabase.from('associations').insert({
      name: form.name,
      description: form.description,
      logo: form.logo || null,
      president_name: form.president_name,
      faculty: form.faculty,
      email: form.email || null,
    } as any);
    if (!error) { setShowCreate(false); resetForm(); load(); }
  }

  async function handleUpdate() {
    if (!editing) return;
    const { error } = await supabase.from('associations').update({
      name: form.name,
      description: form.description,
      logo: form.logo || null,
      president_name: form.president_name,
      faculty: form.faculty,
      email: form.email || null,
    } as any).eq('id', editing.id);
    if (!error) { setEditing(null); resetForm(); load(); }
  }

  async function handleDelete() {
    if (!deleting) return;
    const { error } = await supabase.from('associations').delete().eq('id', deleting);
    if (!error) { setDeleting(null); load(); }
  }

  function openEdit(assoc: Association) {
    setEditing(assoc);
    setForm({
      name: assoc.name,
      description: assoc.description || '',
      logo: assoc.logo || '',
      president_name: assoc.president_name || '',
      faculty: assoc.faculty || '',
      email: assoc.email || '',
    });
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <GlassCard>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-white">Associations</h1>
              <p className="text-white/40 text-sm mt-1">Manage student clubs and associations</p>
            </div>
            <Button variant="gradient" onClick={() => { resetForm(); setShowCreate(true); }} className="gap-2">
              <Plus className="h-4 w-4" /> Create Association
            </Button>
          </div>

          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
            <Input
              placeholder="Search associations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          ) : associations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-white/40">
              <Building2 className="h-12 w-12 mb-4 opacity-50" />
              <p className="text-lg font-medium">No associations found</p>
              <p className="text-sm mt-1">Create your first student club to get started.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5 text-white/40 text-xs uppercase tracking-wider">
                    <th className="text-left py-3 pr-4 font-medium">Name</th>
                    <th className="text-left py-3 pr-4 font-medium">Faculty</th>
                    <th className="text-left py-3 pr-4 font-medium">President</th>
                    <th className="text-left py-3 pr-4 font-medium">Email</th>
                    <th className="text-right py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {associations.map((assoc) => (
                    <tr key={assoc.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-xs font-bold text-white">
                            {getInitials(assoc.name)}
                          </div>
                          <div>
                            <div className="text-white font-medium">{assoc.name}</div>
                            {assoc.description && (
                              <div className="text-white/40 text-xs max-w-[250px] truncate">{assoc.description}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 pr-4 text-white/60">{assoc.faculty || '—'}</td>
                      <td className="py-3 pr-4 text-white/60">{assoc.president_name || '—'}</td>
                      <td className="py-3 pr-4">
                        {assoc.email ? (
                          <a href={`mailto:${assoc.email}`} className="inline-flex items-center gap-1 text-primary/80 hover:text-primary transition-colors">
                            <Mail className="h-3.5 w-3.5" />
                            <span className="text-xs">{assoc.email}</span>
                          </a>
                        ) : (
                          <span className="text-white/40">—</span>
                        )}
                      </td>
                      <td className="py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => openEdit(assoc)}
                            className="rounded-lg p-2 text-white/40 hover:text-white hover:bg-white/10 transition-colors"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setDeleting(assoc.id)}
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

      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Create Association">
        <AssociationForm form={form} onChange={setForm} />
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="ghost" onClick={() => setShowCreate(false)}>Cancel</Button>
          <Button variant="gradient" onClick={handleCreate}>Create Association</Button>
        </div>
      </Modal>

      <Modal open={!!editing} onClose={() => { setEditing(null); resetForm(); }} title="Edit Association">
        <AssociationForm form={form} onChange={setForm} />
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="ghost" onClick={() => { setEditing(null); resetForm(); }}>Cancel</Button>
          <Button variant="gradient" onClick={handleUpdate}>Save Changes</Button>
        </div>
      </Modal>

      <Modal open={!!deleting} onClose={() => setDeleting(null)} title="Delete Association">
        <p className="text-white/60">Are you sure you want to delete this association? This action cannot be undone.</p>
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="ghost" onClick={() => setDeleting(null)}>Cancel</Button>
          <Button variant="destructive" onClick={handleDelete}>Delete</Button>
        </div>
      </Modal>
    </div>
  );
}

function AssociationForm({ form, onChange }: {
  form: { name: string; description: string; logo: string; president_name: string; faculty: string; email: string };
  onChange: (f: typeof form) => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-white/70 mb-1.5">Name</label>
        <Input value={form.name} onChange={(e) => onChange({ ...form, name: e.target.value })} placeholder="Association name" />
      </div>
      <div>
        <label className="block text-sm font-medium text-white/70 mb-1.5">Description</label>
        <textarea
          value={form.description}
          onChange={(e) => onChange({ ...form, description: e.target.value })}
          placeholder="Brief description"
          rows={3}
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-white/70 mb-1.5">Faculty</label>
          <Input value={form.faculty} onChange={(e) => onChange({ ...form, faculty: e.target.value })} placeholder="Faculty name" />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/70 mb-1.5">President</label>
          <Input value={form.president_name} onChange={(e) => onChange({ ...form, president_name: e.target.value })} placeholder="President name" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-white/70 mb-1.5">Email</label>
          <Input type="email" value={form.email} onChange={(e) => onChange({ ...form, email: e.target.value })} placeholder="club@university.dz" />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/70 mb-1.5">Logo URL</label>
          <Input value={form.logo} onChange={(e) => onChange({ ...form, logo: e.target.value })} placeholder="https://..." />
        </div>
      </div>
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
