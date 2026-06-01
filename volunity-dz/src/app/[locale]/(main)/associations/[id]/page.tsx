'use client';

import * as React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { motion } from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';
import {
  Calendar,
  Mail,
  GraduationCap,
  User,
  Building2,
} from 'lucide-react';
import { GlassCard } from '@/components/glass-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn, getInitials, formatDate } from '@/lib/utils';
import { ProtectedRoute } from '@/components/auth-components';
import { getAssociationService, getEventService } from '@/lib/services';
import type { Locale } from '@/i18n/config';
import type { Association, Event } from '@/lib/database.types';

export default function AssociationProfilePage({ params }: { params: { id: string } }) {
  const t = useTranslations('profile');
  const tEvents = useTranslations('events');
  const tCommon = useTranslations('common');
  const locale = useLocale() as Locale;

  const [assoc, setAssoc] = React.useState<Association | null>(null);
  const [events, setEvents] = React.useState<Event[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const fetchData = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const assocSvc = getAssociationService();
      const eventSvc = getEventService();
      const association = await assocSvc.getById(params.id);
      if (!association) {
        notFound();
        return;
      }
      setAssoc(association);
      const allEvents = await eventSvc.getEvents();
      const assocEvents = allEvents.filter((e) => e.created_by === association.created_by);
      setEvents(assocEvents);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load association');
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <GlassCard className="text-center py-12">
          <p className="text-destructive">{error}</p>
          <Button variant="glass" size="sm" onClick={fetchData} className="mt-4">
            Retry
          </Button>
        </GlassCard>
      </div>
    );
  }

  if (!assoc) return null;

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 max-w-4xl">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <GlassCard className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
              <Avatar className="h-24 w-24 sm:h-28 sm:w-28 ring-4 ring-background shadow-2xl">
                <AvatarImage src={assoc.logo || ''} alt={assoc.name} />
                <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white text-3xl font-bold">
                  {getInitials(assoc.name)}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <h1 className="text-2xl sm:text-3xl font-bold mb-2">{assoc.name}</h1>

                {assoc.description && (
                  <p className="text-muted-foreground text-sm sm:text-base mb-4">
                    {assoc.description}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                  {assoc.president_name && (
                    <span className="flex items-center gap-1.5">
                      <User className="h-4 w-4" />
                      {assoc.president_name}
                    </span>
                  )}
                  {assoc.faculty && (
                    <span className="flex items-center gap-1.5">
                      <GraduationCap className="h-4 w-4" />
                      {assoc.faculty}
                    </span>
                  )}
                  {assoc.email && (
                    <a
                      href={`mailto:${assoc.email}`}
                      className="flex items-center gap-1.5 hover:text-primary transition-colors"
                    >
                      <Mail className="h-4 w-4" />
                      {assoc.email}
                    </a>
                  )}
                  <span className="flex items-center gap-1.5">
                    <Building2 className="h-4 w-4" />
                    {t('joined')} {new Date(assoc.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Events Section */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Events
            </h2>
            <Badge variant="glass">{events.length} event{events.length !== 1 ? 's' : ''}</Badge>
          </div>

          {events.length === 0 ? (
            <GlassCard className="text-center py-12">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <h3 className="font-bold mb-1">No events yet</h3>
              <p className="text-sm text-muted-foreground">
                Check back later for upcoming events
              </p>
            </GlassCard>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {events.map((event, i) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link href={`/${locale}/events/${event.id}`}>
                    <GlassCard hover className="overflow-hidden p-0">
                      {event.image_url && (
                        <div
                          className="h-32 bg-cover bg-center"
                          style={{ backgroundImage: `url('${event.image_url}')` }}
                        />
                      )}
                      <div className="p-4">
                        <h3 className="font-bold text-sm mb-1 line-clamp-1">
                          {event.title}
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {formatDate(event.date, locale)}
                        </div>
                      </div>
                    </GlassCard>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
