'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Trophy } from 'lucide-react';
import { GlassCard } from '@/components/glass-card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn, getInitials } from '@/lib/utils';
import { getLeaderboardService } from '@/lib/services';
import type { LeaderboardEntry } from '@/lib/services/leaderboard.service';

export default function LeaderboardPage() {
  const t = useTranslations('common');
  const [students, setStudents] = React.useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const fetchLeaderboard = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const svc = getLeaderboardService();
      const data = await svc.getTopStudents(20);
      setStudents(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load leaderboard');
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-3xl mx-auto mb-12"
      >
        <Badge variant="glass" className="mb-4 px-4 py-2 gap-2">
          <Trophy className="h-3.5 w-3.5 text-amber-500" />
          <span>Top Students</span>
        </Badge>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
          <span className="gradient-text">Leaderboard</span>
        </h1>
        <p className="text-lg text-muted-foreground">
          Most active volunteers ranked by events attended
        </p>
      </motion.div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-16">
          <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        </div>
      )}

      {/* Error */}
      {error && (
        <GlassCard className="text-center py-12">
          <p className="text-destructive">{error}</p>
          <button
            onClick={fetchLeaderboard}
            className="mt-4 text-sm text-primary hover:underline"
          >
            Retry
          </button>
        </GlassCard>
      )}

      {/* List */}
      {!loading && !error && (
        <div className="max-w-2xl mx-auto space-y-3">
          {students.length === 0 ? (
            <GlassCard className="text-center py-12">
              <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <h3 className="font-bold mb-1">No volunteers yet</h3>
              <p className="text-sm text-muted-foreground">
                Be the first to join an event!
              </p>
            </GlassCard>
          ) : (
            students.map((student, i) => {
              const rank = i + 1;
              const isTop3 = rank <= 3;
              const initials = getInitials(student.full_name || '?');

              return (
                <motion.div
                  key={student.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                >
                  <GlassCard
                    hover
                    className={cn(
                      'flex items-center gap-4 p-4',
                      isTop3 && 'border-primary/30'
                    )}
                  >
                    {/* Rank */}
                    <div
                      className={cn(
                        'flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm',
                        rank === 1 && 'bg-gradient-to-br from-amber-400 to-yellow-600 text-white',
                        rank === 2 && 'bg-gradient-to-br from-slate-300 to-slate-500 text-white',
                        rank === 3 && 'bg-gradient-to-br from-orange-400 to-orange-600 text-white',
                        rank > 3 && 'bg-white/5 text-muted-foreground'
                      )}
                    >
                      #{rank}
                    </div>

                    {/* Avatar */}
                    <Avatar className="h-12 w-12 ring-2 ring-white/20 flex-shrink-0">
                      <AvatarImage src={student.avatar_url || ''} alt={student.full_name || ''} />
                      <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white font-bold">
                        {initials}
                      </AvatarFallback>
                    </Avatar>

                    {/* Name */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-sm truncate">
                        {student.full_name || 'Unknown'}
                      </h3>
                    </div>

                    {/* Events attended */}
                    <div className="text-end flex-shrink-0">
                      <div className="text-lg font-bold">{student.events_attended}</div>
                      <div className="text-xs text-muted-foreground">
                        event{student.events_attended !== 1 ? 's' : ''} attended
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
