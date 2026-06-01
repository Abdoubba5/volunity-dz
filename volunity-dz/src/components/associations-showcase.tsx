'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { GlassCard } from '@/components/glass-card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getInitials } from '@/lib/utils';
import { getAssociationService } from '@/lib/services';
import type { Association } from '@/lib/database.types';

export function AssociationsShowcase() {
  const t = useTranslations('home.associations');
  const [associations, setAssociations] = React.useState<Association[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    getAssociationService().getAll({ limit: 4 })
      .then(setAssociations)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-16 lg:py-24 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3">
            {t('title')}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-48 rounded-2xl bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {associations.map((assoc, i) => (
              <motion.div
                key={assoc.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <GlassCard hover className="h-full flex flex-col group">
                  <div className="flex items-start justify-between mb-4">
                    <Avatar className="h-14 w-14 ring-2 ring-white/20">
                      <AvatarImage src={assoc.logo || ''} alt={assoc.name} />
                      <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white font-bold">
                        {getInitials(assoc.name)}
                      </AvatarFallback>
                    </Avatar>
                  </div>

                  <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">
                    {assoc.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1">
                    {assoc.description}
                  </p>

                  {assoc.faculty && (
                    <p className="text-xs text-muted-foreground mb-4">{assoc.faculty}</p>
                  )}

                  <Button variant="glass" size="sm" className="w-full group/btn">
                    View Details
                    <ArrowRight className="h-3.5 w-3.5 ms-2 group-hover/btn:translate-x-1 rtl-flip transition-transform" />
                  </Button>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
