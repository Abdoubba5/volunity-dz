'use client';

import * as React from 'react';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Trash2 } from 'lucide-react';
import { GlassCard } from '@/components/glass-card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { getInitials, formatDate, cn } from '@/lib/utils';
import { getPostService, getCommentService } from '@/lib/services';
import { useAuth } from '@/lib/auth-context';
import type { Locale } from '@/i18n/config';
import type { Post, Profile } from '@/lib/database.types';

interface PostCardProps {
  post: Post & { profile?: Pick<Profile, 'full_name' | 'avatar_url'>; comments_count?: number };
  onDelete?: (id: string) => void;
}

export function PostCard({ post, onDelete }: PostCardProps) {
  const locale = useLocale() as Locale;
  const { toast } = useToast();
  const { user } = useAuth();
  const [liked, setLiked] = React.useState(false);
  const [showComments, setShowComments] = React.useState(false);
  const [comments, setComments] = React.useState<React.ReactNode>(null);
  const [deleting, setDeleting] = React.useState(false);

  const isOwner = user?.id === post.user_id;

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await getPostService().delete(post.id);
      onDelete?.(post.id);
      toast({ title: 'Deleted', description: 'Post deleted successfully.' });
    } catch {
      toast({ title: 'Error', description: 'Failed to delete post.', variant: 'destructive' });
    } finally {
      setDeleting(false);
    }
  };

  const toggleComments = () => {
    setShowComments(!showComments);
    if (!showComments) {
      setComments(<PostComments postId={post.id} />);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <GlassCard className="p-5 space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 ring-2 ring-primary/20">
            <AvatarImage src={post.profile?.avatar_url ?? undefined} alt={post.profile?.full_name} />
            <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white text-xs">
              {getInitials(post.profile?.full_name ?? 'U')}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">{post.profile?.full_name ?? 'Unknown'}</p>
            <p className="text-xs text-muted-foreground">{formatDate(post.created_at, locale)}</p>
          </div>
          {isOwner && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-destructive"
              onClick={handleDelete}
              disabled={deleting}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Content */}
        <p className="text-sm leading-relaxed">{post.content}</p>

        {/* Image */}
        {post.image && (
          <div className="rounded-xl overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.image}
              alt=""
              className="w-full h-64 object-cover"
              loading="lazy"
            />
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-4 pt-2 border-t border-white/10">
          <button
            onClick={() => setLiked(!liked)}
            className={cn(
              'flex items-center gap-1.5 text-sm transition-colors',
              liked ? 'text-red-500' : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <Heart className={cn('h-4 w-4', liked && 'fill-current')} />
            <span>{liked ? '1' : '0'}</span>
          </button>
          <button
            onClick={toggleComments}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <MessageCircle className="h-4 w-4" />
            <span>{post.comments_count ?? 0}</span>
          </button>
        </div>

        {/* Comments section */}
        {showComments && comments}
      </GlassCard>
    </motion.div>
  );
}

function PostComments({ postId }: { postId: string }) {
  const { toast } = useToast();
  const { user, profile } = useAuth();
  const [comments, setComments] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [newComment, setNewComment] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);
  const locale = useLocale() as Locale;

  React.useEffect(() => {
    const load = async () => {
      try {
        const data = await getCommentService().getByPost(postId);
        setComments(data);
      } catch {
        toast({ title: 'Error', description: 'Failed to load comments', variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [postId, toast]);

  const handleSubmit = async () => {
    if (!newComment.trim() || !user) return;
    setSubmitting(true);
    try {
      const comment = await getCommentService().create({ post_id: postId, user_id: user.id, content: newComment.trim() });
      setComments((prev) => [...prev, { ...comment, profile: { full_name: profile?.full_name, avatar_url: profile?.avatar_url } }]);
      setNewComment('');
    } catch {
      toast({ title: 'Error', description: 'Failed to post comment.', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-3 pt-2 border-t border-white/10">
      {/* Existing comments */}
      {loading ? (
        <p className="text-xs text-muted-foreground">Loading comments...</p>
      ) : comments.length === 0 ? (
        <p className="text-xs text-muted-foreground">No comments yet.</p>
      ) : (
        comments.map((comment: any) => (
          <div key={comment.id} className="flex gap-2">
            <Avatar className="h-7 w-7 flex-shrink-0">
              <AvatarImage src={comment.profile?.avatar_url ?? undefined} alt={comment.profile?.full_name} />
              <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white text-[10px]">
                {getInitials(comment.profile?.full_name ?? 'U')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold">{comment.profile?.full_name ?? 'Unknown'}</span>
                <span className="text-[10px] text-muted-foreground">{formatDate(comment.created_at, locale)}</span>
              </div>
              <p className="text-xs mt-0.5">{comment.content}</p>
            </div>
          </div>
        ))
      )}

      {/* New comment input */}
      {user && (
        <div className="flex gap-2 pt-1">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="flex-1 h-9 px-3 rounded-xl glass text-xs focus:outline-none focus:ring-2 focus:ring-primary"
            onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit(); }}
          />
          <Button variant="gradient" size="sm" onClick={handleSubmit} disabled={submitting || !newComment.trim()}>
            Post
          </Button>
        </div>
      )}
    </div>
  );
}
