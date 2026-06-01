import * as React from 'react';
import { cn } from '@/lib/utils';

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-md bg-white/5',
        'before:absolute before:inset-0 before:-translate-x-full before:animate-shimmer before:bg-gradient-to-r before:from-transparent before:via-white/[0.08] before:to-transparent',
        className
      )}
      {...props}
    />
  );
}

function SkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="glass-card p-0 overflow-hidden">
          <div className="h-48 w-full bg-white/5 animate-shimmer rounded-none" />
          <div className="p-5 space-y-3">
            <div className="h-4 w-3/4 rounded bg-white/5 animate-shimmer" />
            <div className="h-3 w-full rounded bg-white/5 animate-shimmer" />
            <div className="h-3 w-2/3 rounded bg-white/5 animate-shimmer" />
            <div className="flex gap-2 pt-2">
              <div className="h-3 w-20 rounded bg-white/5 animate-shimmer" />
              <div className="h-3 w-16 rounded bg-white/5 animate-shimmer" />
            </div>
            <div className="h-9 w-full rounded bg-white/5 animate-shimmer mt-3" />
          </div>
        </div>
      ))}
    </div>
  );
}

export { Skeleton, SkeletonGrid };
