'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface AnimatedBackgroundProps {
  className?: string;
  variant?: 'default' | 'subtle' | 'intense';
  showGrid?: boolean;
  showDots?: boolean;
}

export function AnimatedBackground({
  className,
  variant = 'default',
  showGrid = false,
  showDots = false,
}: AnimatedBackgroundProps) {
  const opacityClass = {
    default: 'opacity-30',
    subtle: 'opacity-15',
    intense: 'opacity-50',
  }[variant];

  return (
    <div
      className={cn(
        'fixed inset-0 -z-10 overflow-hidden pointer-events-none',
        className
      )}
      aria-hidden="true"
    >
      {/* Gradient orbs */}
      <div
        className={cn(
          'orb bg-brand-primary w-[600px] h-[600px] rounded-full -top-40 -start-40 blur-3xl animate-float',
          opacityClass
        )}
      />
      <div
        className={cn(
          'orb bg-brand-accent w-[700px] h-[700px] rounded-full top-1/3 -end-40 blur-3xl',
          opacityClass
        )}
        style={{ animationDelay: '2s' }}
      />
      <div
        className={cn(
          'orb bg-brand-secondary w-[500px] h-[500px] rounded-full bottom-0 start-1/4 blur-3xl',
          opacityClass
        )}
        style={{ animationDelay: '4s' }}
      />

      {/* Optional grid */}
      {showGrid && (
        <div className={cn('absolute inset-0 grid-pattern', opacityClass)} />
      )}

      {/* Optional dots */}
      {showDots && (
        <div className={cn('absolute inset-0 dot-pattern', opacityClass)} />
      )}

      {/* Radial fade */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/40 to-background" />
    </div>
  );
}
