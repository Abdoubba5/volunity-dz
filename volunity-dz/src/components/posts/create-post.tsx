'use client';

import * as React from 'react';
import Image from 'next/image';
import { Image as ImageIcon, Send, X } from 'lucide-react';
import { GlassCard } from '@/components/glass-card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { getInitials } from '@/lib/utils';
import { getPostService } from '@/lib/services';
import { useAuth } from '@/lib/auth-context';

interface CreatePostProps {
  onCreated?: () => void;
}

export function CreatePost({ onCreated }: CreatePostProps) {
  const { toast } = useToast();
  const { user, profile } = useAuth();
  const [content, setContent] = React.useState('');
  const [image, setImage] = React.useState('');
  const [imagePreview, setImagePreview] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);

  const handleSubmit = async () => {
    if (!content.trim() || !user) return;
    setSubmitting(true);
    try {
      await getPostService().create({
        user_id: user.id,
        content: content.trim(),
        image: image || undefined,
      });
      setContent('');
      setImage('');
      setImagePreview('');
      toast({ title: 'Posted!', description: 'Your post has been published.' });
      onCreated?.();
    } catch {
      toast({ title: 'Error', description: 'Failed to create post.', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleImageUrl = () => {
    const url = window.prompt('Enter image URL:');
    if (url) {
      setImage(url);
      setImagePreview(url);
    }
  };

  return (
    <GlassCard className="p-4 space-y-3">
      <div className="flex gap-3">
        <Avatar className="h-10 w-10 flex-shrink-0">
          <AvatarImage src={profile?.avatar_url ?? undefined} alt={profile?.full_name} />
          <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white text-xs">
            {getInitials(profile?.full_name ?? 'U')}
          </AvatarFallback>
        </Avatar>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Share something with your university..."
          rows={3}
          className="flex-1 px-4 py-2.5 rounded-xl glass text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {imagePreview && (
        <div className="relative rounded-xl overflow-hidden">
          <Image src={imagePreview} alt="Preview" width={800} height={200} className="w-full h-48 object-cover" unoptimized />
          <button
            onClick={() => { setImage(''); setImagePreview(''); }}
            className="absolute top-2 right-2 h-8 w-8 rounded-full glass flex items-center justify-center"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="flex items-center justify-between pt-2 border-t border-white/10">
        <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground" onClick={handleImageUrl}>
          <ImageIcon className="h-4 w-4" />
          Image
        </Button>
        <Button
          variant="gradient"
          size="sm"
          className="gap-2"
          onClick={handleSubmit}
          disabled={submitting || !content.trim()}
        >
          <Send className="h-4 w-4" />
          Post
        </Button>
      </div>
    </GlassCard>
  );
}
