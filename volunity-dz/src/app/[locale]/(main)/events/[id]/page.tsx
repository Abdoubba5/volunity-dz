'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import {
  Calendar,
  MapPin,
  Users,
  Share2,
  Heart,
  ArrowLeft,
  CheckCircle2,
} from 'lucide-react';
import { GlassCard } from '@/components/glass-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { cn, formatDate, getInitials } from '@/lib/utils';
import { getEventService } from '@/lib/services';
import { useAuth } from '@/lib/auth-context';
import type { Locale } from '@/i18n/config';
import type { Event, EventParticipant, Profile } from '@/lib/database.types';

export default function EventDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const locale = useLocale() as Locale;
  const t = useTranslations('events');
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();

  const eventId = params.id as string;
  const [event, setEvent] = React.useState<Event | null>(null);
  const [participants, setParticipants] = React.useState<
    (EventParticipant & { profile?: Pick<Profile, 'full_name' | 'avatar_url'> })[]
  >([]);
  const [participantCount, setParticipantCount] = React.useState(0);
  const [joined, setJoined] = React.useState(false);
  const [liked, setLiked] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [actionLoading, setActionLoading] = React.useState(false);

  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const eventSvc = getEventService();
        const eventData = await eventSvc.getEvent(eventId);

        if (!eventData) {
          router.push(`/${locale}/events`);
          return;
        }

        setEvent(eventData);

        const [participantsData, count] = await Promise.all([
          eventSvc.getParticipants(eventId),
          eventSvc.getParticipantCount(eventId),
        ]);

        setParticipants(participantsData);
        setParticipantCount(count);

        if (user) {
          const participant = await eventSvc.getParticipant(eventId, user.id);
          setJoined(!!participant);
        }
      } catch {
        toast({
          title: 'Error',
          description: 'Failed to load event',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId, user?.id]);

  const handleJoin = async () => {
    if (!isAuthenticated || !user) {
      toast({ title: 'Sign in required', description: 'Please sign in to join events.' });
      return;
    }
    setActionLoading(true);
    try {
      const eventSvc = getEventService();
      if (joined) {
        await eventSvc.leaveEvent(eventId, user.id);
        setJoined(false);
        setParticipantCount((prev) => prev - 1);
        toast({ title: 'Left event', description: 'You have been removed from the event.' });
      } else {
        await eventSvc.joinEvent(eventId, user.id);
        setJoined(true);
        setParticipantCount((prev) => prev + 1);
        toast({ title: 'Joined event!', description: 'You will receive a reminder before the event starts.' });
      }
    } catch {
      toast({ title: 'Error', description: 'Failed to update participation', variant: 'destructive' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: event?.title ?? '',
          text: event?.description ?? '',
          url: window.location.href,
        });
      } catch {
        // cancelled
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({ title: 'Link copied!', description: 'Event link copied to clipboard.' });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            <p className="text-sm text-muted-foreground">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!event) return null;

  const isFull = participantCount >= event.max_participants;
  const capacityPercent = event.max_participants > 0
    ? (participantCount / event.max_participants) * 100
    : 0;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <Link
        href={`/${locale}/events`}
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 group"
      >
        <ArrowLeft className="h-4 w-4 rtl-flip group-hover:-translate-x-1 rtl:group-hover:translate-x-1 transition-transform" />
        Back to events
      </Link>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative h-72 sm:h-96 rounded-2xl overflow-hidden glass-premium">
              {event.image_url ? (
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url('${event.image_url}')` }}
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-accent/30" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />

              <div className="absolute top-4 start-4 flex flex-wrap gap-2">
                <Badge variant="glass" className="capitalize backdrop-blur-xl">
                  {t(`categories_list.${event.category}`)}
                </Badge>
              </div>

              <div className="absolute bottom-0 inset-x-0 p-6">
                <h1 className="display-3 mb-2 text-white drop-shadow-lg">
                  {event.title}
                </h1>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-white/90">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    {formatDate(event.date, locale)}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4" />
                    {event.location}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <GlassCard>
              <h3 className="font-semibold mb-3">About this event</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {event.description}
              </p>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <GlassCard>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  Participants
                </h3>
                <span className="text-sm text-muted-foreground">
                  {participantCount} / {event.max_participants}
                </span>
              </div>

              <Progress value={capacityPercent} className="h-2 mb-4" />

              <div className="flex -space-x-2 rtl:space-x-reverse mb-2">
                {participants.slice(0, 8).map((p) => (
                  <Avatar
                    key={p.id}
                    className="h-10 w-10 border-2 border-background"
                  >
                    <AvatarImage
                      src={p.profile?.avatar_url ?? undefined}
                      alt={p.profile?.full_name}
                    />
                    <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white text-xs">
                      {getInitials(p.profile?.full_name ?? 'U')}
                    </AvatarFallback>
                  </Avatar>
                ))}
                {participantCount > 8 && (
                  <div className="h-10 w-10 rounded-full bg-white/10 border-2 border-background flex items-center justify-center text-xs font-medium">
                    +{participantCount - 8}
                  </div>
                )}
              </div>
            </GlassCard>
          </motion.div>
        </div>

        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="sticky top-24"
          >
            <GlassCard className="space-y-4">
              <Button
                variant={joined ? 'glass' : 'gradient'}
                size="lg"
                className="w-full gap-2"
                onClick={handleJoin}
                disabled={(isFull && !joined) || actionLoading}
              >
                {joined ? (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    Joined
                  </>
                ) : isFull ? (
                  <>Event full</>
                ) : (
                  <>Join event</>
                )}
              </Button>

              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="glass"
                  size="lg"
                  onClick={() => setLiked(!liked)}
                  className={cn(liked && 'border-red-500/50 text-red-500')}
                >
                  <Heart className={cn('h-4 w-4', liked && 'fill-current')} />
                </Button>
                <Button variant="glass" size="lg" onClick={handleShare}>
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>

              <Separator className="bg-white/10" />

              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span>{formatDate(event.date, locale)}</span>
                </div>
                <div className="flex items-start gap-3 text-muted-foreground">
                  <MapPin className="h-4 w-4 text-primary mt-0.5" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Users className="h-4 w-4 text-primary" />
                  <span>
                    {participantCount} / {event.max_participants} joined
                  </span>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
