'use client';

import * as React from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Search,
  Grid3x3,
  List,
  SlidersHorizontal,
  Calendar,
  MapPin,
  Users,
  Sparkles,
  TrendingUp,
  Clock,
  X,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GlassCard } from '@/components/glass-card';
import { SkeletonGrid } from '@/components/skeletons';
import { NoEventsState } from '@/components/empty-state';
import { cn, formatDate, getInitials, formatNumber } from '@/lib/utils';
import type { Locale } from '@/i18n/config';
import type { Event } from '@/types';
import { MOCK_EVENTS_FULL } from '@/lib/mock-data';

const CATEGORIES = [
  'all',
  'education',
  'environment',
  'health',
  'culture',
  'sports',
  'social',
] as const;

export default function EventsPage() {
  const t = useTranslations('events');
  const tCommon = useTranslations('common');
  const locale = useLocale() as Locale;
  const searchParams = useSearchParams();
  const initialCategory = (searchParams.get('category') as typeof CATEGORIES[number]) || 'all';

  const [search, setSearch] = React.useState('');
  const [category, setCategory] = React.useState<typeof CATEGORIES[number]>(initialCategory);
  const [view, setView] = React.useState<'grid' | 'list'>('grid');
  const [sort, setSort] = React.useState<'date' | 'popular' | 'newest'>('date');
  const [loading, setLoading] = React.useState(true);
  const [showFilters, setShowFilters] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const filteredEvents = React.useMemo(() => {
    let events = MOCK_EVENTS_FULL;

    if (category !== 'all') {
      events = events.filter((e) => e.category === category);
    }

    if (search) {
      const q = search.toLowerCase();
      events = events.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.location.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q)
      );
    }

    return events;
  }, [search, category]);

  const activeFiltersCount = (category !== 'all' ? 1 : 0) + (search ? 1 : 0);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-3xl mx-auto mb-12"
      >
        <Badge variant="glass" className="mb-4 px-4 py-2 gap-2">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          AI-curated for you
        </Badge>
        <h1 className="display-2 mb-4">
          <span className="gradient-text">{t('title')}</span>
        </h1>
        <p className="lead text-pretty">{t('subtitle')}</p>
      </motion.div>

      {/* Filters bar */}
      <GlassCard className="p-4 sm:p-6 mb-8">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={tCommon('search')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="ps-10 pe-10"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as any)}
              className="h-10 px-3 rounded-xl glass text-sm bg-transparent focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
            >
              <option value="date">Upcoming</option>
              <option value="popular">Most popular</option>
              <option value="newest">Newest</option>
            </select>

            {/* View toggle */}
            <div className="flex items-center gap-1 glass p-1 rounded-xl">
              <Button
                variant={view === 'grid' ? 'gradient' : 'ghost'}
                size="icon"
                onClick={() => setView('grid')}
                aria-label="Grid view"
                className="h-8 w-8"
              >
                <Grid3x3 className="h-4 w-4" />
              </Button>
              <Button
                variant={view === 'list' ? 'gradient' : 'ghost'}
                size="icon"
                onClick={() => setView('list')}
                aria-label="List view"
                className="h-8 w-8"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap gap-2 mt-4">
          {CATEGORIES.map((cat) => {
            const active = category === cat;
            return (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={cn(
                  'px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200',
                  active
                    ? 'bg-gradient-to-r from-brand-primary to-brand-accent text-white shadow-lg glow-primary'
                    : 'glass hover:bg-white/10'
                )}
              >
                {cat === 'all' ? t('allCategories') : t(`categories_list.${cat}`)}
              </button>
            );
          })}
        </div>

        {/* Active filters count */}
        {activeFiltersCount > 0 && (
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/10">
            <p className="text-xs text-muted-foreground">
              {filteredEvents.length} results found
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearch('');
                setCategory('all');
              }}
            >
              Clear all
            </Button>
          </div>
        )}
      </GlassCard>

      {/* Loading state */}
      {loading ? (
        <SkeletonGrid count={6} />
      ) : filteredEvents.length === 0 ? (
        <NoEventsState />
      ) : (
        <div
          className={cn(
            'gap-6',
            view === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
              : 'flex flex-col max-w-4xl mx-auto'
          )}
        >
          {filteredEvents.map((event, i) => (
            <EventCard
              key={event.id}
              event={event}
              view={view}
              index={i}
              locale={locale}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function EventCard({
  event,
  view,
  index,
  locale,
}: {
  event: typeof MOCK_EVENTS_FULL[number];
  view: 'grid' | 'list';
  index: number;
  locale: Locale;
}) {
  const t = useTranslations('events');
  const capacityPercent = (event.participants_count / event.capacity) * 100;

  if (view === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.05 }}
      >
        <Link href={`/${locale}/events/${event.id}`} className="block group">
          <GlassCard hover className="p-0 overflow-hidden">
            <div className="grid grid-cols-1 sm:grid-cols-[200px_1fr] gap-0">
              <div className="relative h-40 sm:h-auto overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                  style={{ backgroundImage: `url('${event.image}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent sm:bg-gradient-to-r" />
                <Badge variant="glass" className="absolute top-3 start-3 capitalize backdrop-blur-xl">
                  {t(`categories_list.${event.category}`)}
                </Badge>
              </div>
              <div className="p-5 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-1">
                    {event.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    {event.description}
                  </p>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      {formatDate(event.date, locale)}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5" />
                      {event.location}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Users className="h-3.5 w-3.5" />
                      {formatNumber(event.participants_count)} / {formatNumber(event.capacity)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-2 text-xs">
                    <Sparkles className="h-3.5 w-3.5 text-primary" />
                    <span className="font-semibold">{event.points_reward} pts</span>
                  </div>
                  <Button variant="gradient" size="sm">
                    {t('joinEvent')}
                  </Button>
                </div>
              </div>
            </div>
          </GlassCard>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link href={`/${locale}/events/${event.id}`} className="block group h-full">
        <GlassCard hover className="p-0 overflow-hidden h-full flex flex-col">
          {/* Image */}
          <div className="relative h-44 overflow-hidden">
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
              style={{ backgroundImage: `url('${event.image}')` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />

            <Badge variant="glass" className="absolute top-3 start-3 capitalize backdrop-blur-xl">
              {t(`categories_list.${event.category}`)}
            </Badge>

            {event.featured && (
              <Badge variant="default" className="absolute top-3 end-3 gap-1">
                <Sparkles className="h-3 w-3" />
                Featured
              </Badge>
            )}

            <div className="absolute bottom-3 end-3 glass px-2.5 py-1 rounded-full flex items-center gap-1.5 text-xs font-semibold">
              <Users className="h-3 w-3" />
              {formatNumber(event.participants_count)}
            </div>

            <div className="absolute bottom-3 start-3 glass px-2.5 py-1 rounded-full flex items-center gap-1.5 text-xs font-semibold">
              <Sparkles className="h-3 w-3 text-primary" />
              {event.points_reward} pts
            </div>
          </div>

          {/* Content */}
          <div className="p-5 flex-1 flex flex-col">
            <h3 className="font-bold text-base mb-2 line-clamp-1 group-hover:text-primary transition-colors">
              {event.title}
            </h3>
            <p className="text-xs text-muted-foreground line-clamp-2 mb-4 flex-1">
              {event.description}
            </p>

            {/* Capacity bar */}
            <div className="mb-3">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-muted-foreground">Capacity</span>
                <span className="font-medium">
                  {Math.round(capacityPercent)}%
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-brand-primary to-brand-accent transition-all"
                  style={{ width: `${Math.min(capacityPercent, 100)}%` }}
                />
              </div>
            </div>

            <div className="space-y-1.5 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5 text-primary" />
                <span>{formatDate(event.date, locale)}</span>
                <span className="text-muted-foreground/60">•</span>
                <Clock className="h-3.5 w-3.5 text-primary" />
                <span>{event.time}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-primary" />
                <span className="line-clamp-1">{event.location}</span>
              </div>
            </div>
          </div>
        </GlassCard>
      </Link>
    </motion.div>
  );
}
