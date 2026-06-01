'use client';

import * as React from 'react';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import {
  BookOpen,
  FileText,
  GraduationCap,
  Megaphone,
  Paperclip,
  Search,
  Filter,
} from 'lucide-react';
import { GlassCard } from '@/components/glass-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDate, cn } from '@/lib/utils';
import { getResourceService } from '@/lib/services';
import type { Locale } from '@/i18n/config';
import type { Resource } from '@/lib/database.types';

const typeIcons: Record<string, typeof BookOpen> = {
  course: BookOpen,
  exam: FileText,
  announcement: Megaphone,
  other: Paperclip,
};

const typeLabels: Record<string, string> = {
  course: 'Course',
  exam: 'Past Exam',
  announcement: 'Announcement',
  other: 'Other',
};

export default function ResourcesPage() {
  const locale = useLocale() as Locale;
  const [resources, setResources] = React.useState<Resource[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState('');
  const [typeFilter, setTypeFilter] = React.useState<string | null>(null);

  React.useEffect(() => {
    const load = async () => {
      try {
        const data = await getResourceService().getAll({ type: typeFilter ?? undefined });
        setResources(data);
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [typeFilter]);

  const filtered = search
    ? resources.filter((r) =>
        r.title.toLowerCase().includes(search.toLowerCase()) ||
        r.description?.toLowerCase().includes(search.toLowerCase())
      )
    : resources;

  return (
    <div className="min-h-screen py-8 lg:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-8"
        >
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <GraduationCap className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Resources</h1>
            <p className="text-sm text-muted-foreground">Study materials, exams, and university announcements</p>
          </div>
        </motion.div>

        {/* Search & filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col sm:flex-row gap-3 mb-8"
        >
          <div className="relative flex-1">
            <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search resources..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-11 ps-10 pe-4 rounded-xl glass text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {[null, 'course', 'exam', 'announcement', 'other'].map((type) => (
              <Button
                key={type ?? 'all'}
                variant={typeFilter === type ? 'gradient' : 'glass'}
                size="sm"
                onClick={() => setTypeFilter(type)}
                className="whitespace-nowrap capitalize"
              >
                {type ?? 'All'}
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Resources list */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12">
            <GraduationCap className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
            <p className="text-muted-foreground">No resources found.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((resource, i) => {
              const Icon = typeIcons[resource.type ?? 'other'] ?? Paperclip;
              return (
                <motion.div
                  key={resource.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                >
                  <GlassCard hover className="p-5 flex items-start gap-4">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center flex-shrink-0">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-sm truncate">{resource.title}</h3>
                        {resource.type && (
                          <Badge variant="glass" className="text-[10px] shrink-0">
                            {typeLabels[resource.type] ?? resource.type}
                          </Badge>
                        )}
                      </div>
                      {resource.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">{resource.description}</p>
                      )}
                      <p className="text-xs text-muted-foreground mt-2">
                        {resource.faculty && <span className="me-2">Faculty: {resource.faculty}</span>}
                        <span>{formatDate(resource.created_at, locale)}</span>
                      </p>
                    </div>
                    {resource.file_url && (
                      <Button variant="glass" size="sm" asChild className="shrink-0">
                        <a href={resource.file_url} target="_blank" rel="noopener noreferrer">
                          <FileText className="h-4 w-4 me-1" />
                          Open
                        </a>
                      </Button>
                    )}
                  </GlassCard>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
