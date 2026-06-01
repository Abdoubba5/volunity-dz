import * as React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { CalendarOff, type LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  className?: string;
}

function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'glass-card flex flex-col items-center justify-center text-center py-16 px-6',
        className
      )}
    >
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/20 to-secondary/20 blur-2xl rounded-full" />
        <div className="relative h-20 w-20 rounded-2xl glass-strong flex items-center justify-center">
          <CalendarOff className="h-10 w-10 text-muted-foreground" strokeWidth={1.5} />
        </div>
      </div>

      <h3 className="text-xl font-semibold mb-2 text-balance">{title}</h3>
      {description && (
        <p className="text-muted-foreground max-w-md mb-6 text-pretty">
          {description}
        </p>
      )}

      {action && (
        <Button
          asChild={!!action.href}
          onClick={action.onClick}
          variant="gradient"
          size="lg"
        >
          {action.href ? <Link href={action.href}>{action.label}</Link> : action.label}
        </Button>
      )}
    </div>
  );
}

function NoEventsState({ canCreate = true }: { canCreate?: boolean }) {
  return (
    <EmptyState
      title="No events yet"
      description="There are no events matching your criteria. Be the first to create one or check back later."
      action={
        canCreate
          ? { label: 'Create event', href: '/events/new' }
          : { label: 'Refresh', onClick: () => window.location.reload() }
      }
    />
  );
}

export { EmptyState, NoEventsState };
