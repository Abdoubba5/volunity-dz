'use client';

import * as React from 'react';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Search, ArrowRight } from 'lucide-react';
import { GlassCard } from '@/components/glass-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { getInitials } from '@/lib/utils';
import { getAssociationService } from '@/lib/services';
import type { Association } from '@/lib/database.types';
import type { Locale } from '@/i18n/config';

export default function AssociationsPage() {
  const locale = useLocale() as Locale;
  const [search, setSearch] = React.useState('');
  const [associations, setAssociations] = React.useState<Association[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    getAssociationService().getAll()
      .then(setAssociations)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = associations.filter(
    (a) =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      (a.description || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-3xl mx-auto mb-12"
      >
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
          <span className="gradient-text">Student Associations</span>
        </h1>
        <p className="text-lg text-muted-foreground">
          Discover student associations and clubs at your university
        </p>
      </motion.div>

      <GlassCard className="p-4 mb-8 max-w-2xl mx-auto">
        <div className="relative">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search associations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="ps-10"
          />
        </div>
      </GlassCard>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-48 rounded-2xl bg-white/5 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((assoc, i) => (
            <motion.div
              key={assoc.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <GlassCard hover className="h-full flex flex-col group">
                <div className="flex items-start justify-between mb-4">
                  <Avatar className="h-16 w-16 ring-2 ring-white/20">
                    <AvatarImage src={assoc.logo || ''} alt={assoc.name} />
                    <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white text-lg font-bold">
                      {getInitials(assoc.name)}
                    </AvatarFallback>
                  </Avatar>
                </div>

                <h3 className="font-bold text-xl mb-2 group-hover:text-primary transition-colors">
                  {assoc.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3 flex-1">
                  {assoc.description}
                </p>

                {assoc.faculty && (
                  <Badge variant="glass" className="mb-4 self-start">
                    {assoc.faculty}
                  </Badge>
                )}

                <Button asChild variant="gradient" size="sm" className="w-full group/btn">
                  <Link href={`/${locale}/associations/${assoc.id}`}>
                    View Details
                    <ArrowRight className="h-3.5 w-3.5 ms-2 group-hover/btn:translate-x-1 rtl-flip transition-transform" />
                  </Link>
                </Button>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
