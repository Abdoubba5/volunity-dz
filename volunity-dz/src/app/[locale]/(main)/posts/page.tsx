'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { MessageSquare } from 'lucide-react';
import { CreatePost } from '@/components/posts/create-post';
import { PostCard } from '@/components/posts/post-card';
import { getPostService } from '@/lib/services';
import { useAuth } from '@/lib/auth-context';
import type { Post, Profile } from '@/lib/database.types';

export default function PostsPage() {
  const t = useTranslations('common');
  const { isAuthenticated } = useAuth();
  const [posts, setPosts] = React.useState<(Post & { profile?: Pick<Profile, 'full_name' | 'avatar_url'>; comments_count?: number })[]>([]);
  const [loading, setLoading] = React.useState(true);

  const loadPosts = React.useCallback(async () => {
    setLoading(true);
    try {
      const data = await getPostService().getAll(20, 0);
      setPosts(data);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const handleDelete = (id: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="min-h-screen py-8 lg:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-8"
        >
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <MessageSquare className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Posts</h1>
            <p className="text-sm text-muted-foreground">Share and connect with your university community</p>
          </div>
        </motion.div>

        {/* Create post */}
        {isAuthenticated && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6"
          >
            <CreatePost onCreated={loadPosts} />
          </motion.div>
        )}

        {/* Posts feed */}
        <div className="space-y-4">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
              <p className="text-muted-foreground">No posts yet. Be the first to share!</p>
            </div>
          ) : (
            posts.map((post) => (
              <PostCard key={post.id} post={post} onDelete={handleDelete} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
