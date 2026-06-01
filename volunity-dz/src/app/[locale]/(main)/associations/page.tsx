'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Search, CheckCircle2, Users, Calendar, MapPin, ArrowRight } from 'lucide-react';
import { GlassCard } from '@/components/glass-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { getInitials } from '@/lib/utils';

const MOCK_ASSOCIATIONS = [
  {
    id: '1',
    name: 'Green Algeria',
    description: 'Environmental protection and sustainability initiatives across Algeria. We organize cleanups, tree planting, and awareness campaigns.',
    logo: '',
    followers: 12400,
    verified: true,
    events: 45,
    city: 'Algiers',
    category: 'environment',
  },
  {
    id: '2',
    name: 'Youth for Education',
    description: 'Empowering youth through education and skill development programs in underserved communities.',
    logo: '',
    followers: 8900,
    verified: true,
    events: 32,
    city: 'Tizi Ouzou',
    category: 'education',
  },
  {
    id: '3',
    name: 'Health Heroes DZ',
    description: 'Promoting health awareness and providing medical support to communities in need.',
    logo: '',
    followers: 6700,
    verified: true,
    events: 28,
    city: 'Constantine',
    category: 'health',
  },
  {
    id: '4',
    name: 'Culture Connect',
    description: 'Preserving and celebrating Algerian cultural heritage through events and exhibitions.',
    logo: '',
    followers: 5400,
    verified: false,
    events: 21,
    city: 'Oran',
    category: 'culture',
  },
  {
    id: '5',
    name: 'Sports for All',
    description: 'Promoting sports and physical activities among Algerian youth.',
    logo: '',
    followers: 4200,
    verified: true,
    events: 18,
    city: 'Annaba',
    category: 'sports',
  },
  {
    id: '6',
    name: 'Tech Volunteers',
    description: 'Bridging the digital divide by teaching technology skills to communities.',
    logo: '',
    followers: 3800,
    verified: false,
    events: 15,
    city: 'Blida',
    category: 'education',
  },
];

export default function AssociationsPage() {
  const [search, setSearch] = React.useState('');

  const filtered = MOCK_ASSOCIATIONS.filter(
    (a) =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-3xl mx-auto mb-12"
      >
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
          <span className="gradient-text">Our Associations</span>
        </h1>
        <p className="text-lg text-muted-foreground">
          Discover and follow the most active associations making a difference in Algeria
        </p>
      </motion.div>

      {/* Search */}
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

      {/* Grid */}
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
                  <AvatarImage src={assoc.logo} alt={assoc.name} />
                  <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white text-lg font-bold">
                    {getInitials(assoc.name)}
                  </AvatarFallback>
                </Avatar>
                {assoc.verified && (
                  <div className="flex items-center gap-1.5 glass px-3 py-1 rounded-full">
                    <CheckCircle2 className="h-3.5 w-3.5 text-primary" fill="currentColor" />
                    <span className="text-xs font-medium">Verified</span>
                  </div>
                )}
              </div>

              <h3 className="font-bold text-xl mb-2 group-hover:text-primary transition-colors">
                {assoc.name}
              </h3>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-3 flex-1">
                {assoc.description}
              </p>

              <div className="space-y-2 mb-4 pb-4 border-b border-white/10">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" />
                  <span>{assoc.city}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Users className="h-3.5 w-3.5" />
                  <span>{assoc.followers.toLocaleString()} followers</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>{assoc.events} events organized</span>
                </div>
              </div>

              <Button variant="gradient" size="sm" className="w-full group/btn">
                Follow
                <ArrowRight className="h-3.5 w-3.5 ms-2 group-hover/btn:translate-x-1 rtl-flip transition-transform" />
              </Button>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
