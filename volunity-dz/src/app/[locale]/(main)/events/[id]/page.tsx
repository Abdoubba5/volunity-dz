'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Share2,
  Heart,
  CheckCircle2,
  ArrowLeft,
  Building2,
  Globe,
  Award,
  Sparkles,
  QrCode,
  Camera,
  ListChecks,
  Tag,
  ExternalLink,
  MessageCircle,
} from 'lucide-react';
import { GlassCard } from '@/components/glass-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { cn, formatDate, getInitials, formatNumber } from '@/lib/utils';
import type { Locale } from '@/i18n/config';
import { MOCK_EVENTS_FULL } from '@/lib/mock-data';

export default function EventDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const locale = useLocale() as Locale;
  const t = useTranslations('events');
  const tDetails = useTranslations('events.details');
  const { toast } = useToast();
  const [joined, setJoined] = React.useState(false);
  const [liked, setLiked] = React.useState(false);

  const eventId = params.id as string;
  const event = MOCK_EVENTS_FULL.find((e) => e.id === eventId) || MOCK_EVENTS_FULL[0];

  const handleJoin = () => {
    setJoined(!joined);
    toast({
      title: joined ? 'Left event' : 'Joined event!',
      description: joined
        ? 'You have been removed from the event.'
        : 'You will receive a reminder before the event starts.',
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: event.title,
          text: event.description,
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

  const capacityPercent = (event.participants_count / event.capacity) * 100;
  const isFull = event.participants_count >= event.capacity;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      {/* Back button */}
      <Link
        href={`/${locale}/events`}
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 group"
      >
        <ArrowLeft className="h-4 w-4 rtl-flip group-hover:-translate-x-1 rtl:group-hover:translate-x-1 transition-transform" />
        Back to events
      </Link>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative h-72 sm:h-96 rounded-2xl overflow-hidden glass-premium">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url('${event.image}')`,
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />

              {/* Top badges */}
              <div className="absolute top-4 start-4 flex flex-wrap gap-2">
                <Badge variant="glass" className="capitalize backdrop-blur-xl">
                  {t(`categories_list.${event.category}`)}
                </Badge>
                {event.featured && (
                  <Badge variant="default" className="gap-1">
                    <Sparkles className="h-3 w-3" />
                    Featured
                  </Badge>
                )}
                {isFull && <Badge variant="destructive">Full</Badge>}
              </div>

              {/* Bottom info */}
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
                    <Clock className="h-4 w-4" />
                    {event.time}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4" />
                    {event.location}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Tabs defaultValue="about" className="w-full">
              <TabsList className="glass w-full sm:w-auto p-1.5 grid grid-cols-3 sm:flex">
                <TabsTrigger value="about" className="gap-1.5">
                  <ListChecks className="h-3.5 w-3.5" />
                  {tDetails('about')}
                </TabsTrigger>
                <TabsTrigger value="schedule" className="gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  {tDetails('schedule')}
                </TabsTrigger>
                <TabsTrigger value="gallery" className="gap-1.5">
                  <Camera className="h-3.5 w-3.5" />
                  {tDetails('gallery')}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="about" className="space-y-4 mt-6">
                <GlassCard>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    About this event
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {event.description}
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed mt-3">
                    Join us for an amazing volunteering experience. This event is part of our ongoing efforts to make a positive impact in the community. All skill levels are welcome — what matters most is your enthusiasm and willingness to help.
                  </p>
                </GlassCard>

                <GlassCard>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <ListChecks className="h-4 w-4 text-primary" />
                    {tDetails('requirements')}
                  </h3>
                  <ul className="space-y-2">
                    {event.requirements.map((req, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{req}</span>
                      </li>
                    ))}
                  </ul>
                </GlassCard>

                <GlassCard>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Tag className="h-4 w-4 text-primary" />
                    {tDetails('tags')}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {event.tags.map((tag) => (
                      <Badge key={tag} variant="glass">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </GlassCard>
              </TabsContent>

              <TabsContent value="schedule" className="mt-6">
                <GlassCard>
                  <h3 className="font-semibold mb-4">Event schedule</h3>
                  <div className="space-y-4">
                    {event.schedule.map((item, i) => (
                      <div key={i} className="flex gap-4 group">
                        <div className="flex flex-col items-center">
                          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-sm font-bold text-white">
                            {i + 1}
                          </div>
                          {i < event.schedule.length - 1 && (
                            <div className="w-px flex-1 bg-gradient-to-b from-primary/30 to-transparent mt-2" />
                          )}
                        </div>
                        <div className="flex-1 pb-4">
                          <p className="text-sm font-semibold">{item.title}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {item.time}
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              </TabsContent>

              <TabsContent value="gallery" className="mt-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {event.gallery.map((img, i) => (
                    <div
                      key={i}
                      className="aspect-square rounded-xl overflow-hidden glass group cursor-pointer"
                    >
                      <div
                        className="h-full w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                        style={{ backgroundImage: `url('${img}')` }}
                      />
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>

          {/* Participants */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <GlassCard>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  {tDetails('participants')}
                </h3>
                <span className="text-sm text-muted-foreground">
                  {formatNumber(event.participants_count)} / {formatNumber(event.capacity)}
                </span>
              </div>

              <Progress value={capacityPercent} className="h-2 mb-4" />

              <div className="flex -space-x-2 rtl:space-x-reverse mb-2">
                {event.participants.slice(0, 8).map((p) => (
                  <Avatar
                    key={p.id}
                    className="h-10 w-10 border-2 border-background"
                  >
                    <AvatarImage src={p.avatar} alt={p.name} />
                    <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white text-xs">
                      {getInitials(p.name)}
                    </AvatarFallback>
                  </Avatar>
                ))}
                {event.participants_count > 8 && (
                  <div className="h-10 w-10 rounded-full bg-white/10 border-2 border-background flex items-center justify-center text-xs font-medium">
                    +{event.participants_count - 8}
                  </div>
                )}
              </div>
            </GlassCard>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Action card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="sticky top-24"
          >
            <GlassCard className="space-y-4">
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold">
                    {event.points_reward}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    points reward
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Earn these points for participating
                </p>
              </div>

              <Separator className="bg-white/10" />

              <div className="space-y-2">
                <Button
                  variant={joined ? 'glass' : 'gradient'}
                  size="lg"
                  className="w-full gap-2"
                  onClick={handleJoin}
                  disabled={isFull && !joined}
                >
                  {joined ? (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      {t('joined')}
                    </>
                  ) : isFull ? (
                    <>Event full</>
                  ) : (
                    <>{t('joinEvent')}</>
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
                  <Button
                    variant="glass"
                    size="lg"
                    onClick={handleShare}
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <Separator className="bg-white/10" />

              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span>{formatDate(event.date, locale)}</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Clock className="h-4 w-4 text-primary" />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-start gap-3 text-muted-foreground">
                  <MapPin className="h-4 w-4 text-primary mt-0.5" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Users className="h-4 w-4 text-primary" />
                  <span>
                    {formatNumber(event.participants_count)} / {formatNumber(event.capacity)} joined
                  </span>
                </div>
              </div>
            </GlassCard>

            {/* Organizer */}
            <GlassCard className="mt-6">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Building2 className="h-4 w-4 text-primary" />
                {tDetails('organizer')}
              </h3>
              <Link
                href={`/${locale}/associations/${event.organizer.id}`}
                className="flex items-center gap-3 group"
              >
                <Avatar className="h-12 w-12 ring-2 ring-white/20">
                  <AvatarImage src={event.organizer.logo} alt={event.organizer.name} />
                  <AvatarFallback className="bg-gradient-to-br from-secondary to-emerald-500 text-white font-bold">
                    {getInitials(event.organizer.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold group-hover:text-primary transition-colors truncate">
                    {event.organizer.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatNumber(event.organizer.followers)} followers
                  </p>
                </div>
                <ExternalLink className="h-4 w-4 text-muted-foreground" />
              </Link>
            </GlassCard>

            {/* QR Check-in (if joined) */}
            {joined && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <GlassCard className="mt-6 text-center">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent mb-3">
                    <QrCode className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold mb-1">Your QR Pass</h3>
                  <p className="text-xs text-muted-foreground mb-4">
                    Show this code at the event entrance
                  </p>
                  <div className="aspect-square w-40 mx-auto rounded-xl bg-white p-3 relative overflow-hidden">
                    <div
                      className="h-full w-full"
                      style={{
                        backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' fill='white'/><g fill='black'><rect x='5' y='5' width='20' height='20'/><rect x='10' y='10' width='10' height='10' fill='white'/><rect x='12' y='12' width='6' height='6' fill='black'/><rect x='75' y='5' width='20' height='20'/><rect x='80' y='10' width='10' height='10' fill='white'/><rect x='82' y='12' width='6' height='6' fill='black'/><rect x='5' y='75' width='20' height='20'/><rect x='10' y='80' width='10' height='10' fill='white'/><rect x='12' y='82' width='6' height='6' fill='black'/><g><rect x='35' y='5' width='4' height='4'/><rect x='45' y='5' width='4' height='4'/><rect x='55' y='5' width='4' height='4'/><rect x='35' y='15' width='4' height='4'/><rect x='45' y='15' width='4' height='4'/><rect x='60' y='15' width='4' height='4'/><rect x='40' y='25' width='4' height='4'/><rect x='50' y='25' width='4' height='4'/><rect x='60' y='25' width='4' height='4'/><rect x='30' y='35' width='4' height='4'/><rect x='40' y='35' width='4' height='4'/><rect x='50' y='35' width='4' height='4'/><rect x='65' y='35' width='4' height='4'/><rect x='35' y='45' width='4' height='4'/><rect x='45' y='45' width='4' height='4'/><rect x='55' y='45' width='4' height='4'/><rect x='30' y='55' width='4' height='4'/><rect x='40' y='55' width='4' height='4'/><rect x='50' y='55' width='4' height='4'/><rect x='60' y='55' width='4' height='4'/><rect x='35' y='65' width='4' height='4'/><rect x='45' y='65' width='4' height='4'/><rect x='55' y='65' width='4' height='4'/><rect x='40' y='75' width='4' height='4'/><rect x='50' y='75' width='4' height='4'/><rect x='60' y='75' width='4' height='4'/><rect x='70' y='40' width='4' height='4'/><rect x='75' y='50' width='4' height='4'/><rect x='80' y='60' width='4' height='4'/><rect x='85' y='70' width='4' height='4'/></g></g></svg>")`,
                        backgroundSize: 'contain',
                        backgroundRepeat: 'no-repeat',
                      }}
                    />
                    <div className="absolute inset-x-0 h-1 bg-gradient-to-b from-primary/0 via-primary to-primary/0 animate-scan-line" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-3">
                    ID: VDZ-{event.id}-{joined ? '001' : '000'}
                  </p>
                </GlassCard>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
