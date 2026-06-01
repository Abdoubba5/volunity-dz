'use client';

import * as React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { motion } from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';
import {
  MapPin,
  Users,
  Calendar,
  CheckCircle2,
  Heart,
  Share2,
  MessageCircle,
  Globe,
  Trees,
  Sparkles,
  TrendingUp,
  Award,
  Building2,
  ExternalLink,
} from 'lucide-react';
import { GlassCard } from '@/components/glass-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { cn, formatDate, formatNumber, getInitials } from '@/lib/utils';
import type { Locale } from '@/i18n/config';
import { MOCK_ASSOCIATIONS_DETAILED, MOCK_EVENTS_FULL } from '@/lib/mock-data';

const MEMBERS = [
  { id: 'm1', name: 'Sarah Khaled', role: 'President', avatar: '' },
  { id: 'm2', name: 'Amine Benali', role: 'Coordinator', avatar: '' },
  { id: 'm3', name: 'Lina Hadj', role: 'Volunteer Lead', avatar: '' },
  { id: 'm4', name: 'Karim Mansour', role: 'Member', avatar: '' },
  { id: 'm5', name: 'Yasmine Boudiaf', role: 'Member', avatar: '' },
  { id: 'm6', name: 'Mehdi Cherif', role: 'Moderator', avatar: '' },
];

export default function AssociationProfilePage({ params }: { params: { id: string } }) {
  const t = useTranslations('profile');
  const tEvents = useTranslations('events');
  const locale = useLocale() as Locale;

  const assoc = MOCK_ASSOCIATIONS_DETAILED.find((a) => a.id === params.id) || MOCK_ASSOCIATIONS_DETAILED[0];
  if (!assoc) notFound();

  const events = MOCK_EVENTS_FULL.filter((e) => e.organizer.id === assoc.id);

  return (
    <div className="pb-8">
      {/* Cover */}
      <div className="relative">
        <div
          className="h-48 sm:h-64 lg:h-80 bg-cover bg-center relative overflow-hidden"
          style={{ backgroundImage: `url('${assoc.cover}')` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-secondary/20" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-20 sm:-mt-24 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <GlassCard className="p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-end">
                <Avatar className="h-24 w-24 sm:h-32 sm:w-32 ring-4 ring-background shadow-2xl -mt-12 sm:-mt-16">
                  <AvatarImage src={assoc.logo} alt={assoc.name} />
                  <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white text-3xl font-bold">
                    {getInitials(assoc.name)}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h1 className="text-2xl sm:text-3xl font-bold">{assoc.name}</h1>
                    {assoc.verified && (
                      <CheckCircle2 className="h-5 w-5 text-primary" fill="currentColor" />
                    )}
                    <Badge variant="glass" className="capitalize">{assoc.category}</Badge>
                  </div>
                  <p className="text-muted-foreground mb-3">{assoc.username}</p>
                  <p className="text-sm sm:text-base max-w-2xl mb-4">{assoc.bio}</p>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-4 w-4" />
                      {assoc.location}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Building2 className="h-4 w-4" />
                      Founded {assoc.founded}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Users className="h-4 w-4" />
                      {formatNumber(assoc.members_count)} members
                    </span>
                    <a
                      href={assoc.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 hover:text-primary transition-colors"
                    >
                      <Globe className="h-4 w-4" />
                      Website
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>

                <div className="flex gap-2 w-full sm:w-auto">
                  <Button variant="glass" size="icon" className="rounded-full">
                    <MessageCircle className="h-4 w-4" />
                  </Button>
                  <Button variant="glass" size="icon" className="rounded-full">
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <Button variant="gradient" className="gap-2 flex-1 sm:flex-initial">
                    <Heart className="h-4 w-4" />
                    {t('follow')}
                  </Button>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-6">
        {/* Impact stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {[
            { label: 'Trees planted', value: assoc.impact.trees_planted, icon: Trees, color: 'from-emerald-400 to-green-600' },
            { label: 'Cleanups', value: assoc.impact.cleanups, icon: Sparkles, color: 'from-primary to-cyan-500' },
            { label: 'Volunteers', value: assoc.impact.volunteers, icon: Users, color: 'from-accent to-purple-500' },
            { label: 'Cities', value: assoc.impact.cities, icon: MapPin, color: 'from-amber-400 to-orange-600' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 + 0.1 }}
            >
              <GlassCard hover className="relative overflow-hidden">
                <div
                  className={cn(
                    'absolute -top-8 -end-8 w-32 h-32 rounded-full bg-gradient-to-br opacity-20 blur-2xl',
                    stat.color
                  )}
                />
                <div className="relative">
                  <div
                    className={cn(
                      'inline-flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br mb-2',
                      stat.color
                    )}
                  >
                    <stat.icon className="h-4 w-4 text-white" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold">
                    {formatNumber(stat.value)}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="about" className="w-full">
          <TabsList className="glass w-full sm:w-auto p-1.5 grid grid-cols-3 sm:flex">
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
          </TabsList>

          <TabsContent value="about" className="mt-6 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <GlassCard className="lg:col-span-2">
                <h2 className="text-xl font-bold mb-4">About us</h2>
                <p className="text-muted-foreground leading-relaxed mb-6">{assoc.bio}</p>

                <h3 className="font-bold mb-3">Our mission</h3>
                <ul className="space-y-2">
                  {[
                    'Protect Algeria\'s natural environment',
                    'Educate communities about sustainability',
                    'Empower youth to take action',
                    'Build a network of eco-volunteers',
                  ].map((mission) => (
                    <li key={mission} className="flex items-start gap-2 text-sm">
                      <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle2 className="h-3 w-3 text-primary" />
                      </div>
                      <span>{mission}</span>
                    </li>
                  ))}
                </ul>
              </GlassCard>

              <GlassCard>
                <h3 className="font-bold mb-4">Stats overview</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Followers</span>
                    <span className="font-bold">{formatNumber(assoc.followers)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Events</span>
                    <span className="font-bold">{assoc.events_count}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Members</span>
                    <span className="font-bold">{assoc.members_count}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Founded</span>
                    <span className="font-bold">{assoc.founded}</span>
                  </div>
                </div>
              </GlassCard>
            </div>
          </TabsContent>

          <TabsContent value="events" className="mt-6">
            {events.length === 0 ? (
              <GlassCard className="text-center py-12">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <h3 className="font-bold mb-1">No events yet</h3>
                <p className="text-sm text-muted-foreground">Check back later for upcoming events</p>
              </GlassCard>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {events.map((event, i) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link href={`/${locale}/events/${event.id}`}>
                      <GlassCard hover className="overflow-hidden p-0">
                        <div className="h-32 bg-cover bg-center" style={{ backgroundImage: `url('${event.image}')` }} />
                        <div className="p-4">
                          <h3 className="font-bold text-sm mb-1 line-clamp-1">{event.title}</h3>
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
          </TabsContent>

          <TabsContent value="members" className="mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {MEMBERS.map((member, i) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <GlassCard hover className="text-center">
                    <Avatar className="h-16 w-16 mx-auto mb-3 ring-2 ring-white/20">
                      <AvatarImage src={member.avatar} />
                      <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white font-bold">
                        {getInitials(member.name)}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="font-bold">{member.name}</h3>
                    <p className="text-xs text-muted-foreground mb-3">{member.role}</p>
                    <Button variant="glass" size="sm" className="w-full">
                      View profile
                    </Button>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
