import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function Logo({ className, size = 'md' }: LogoProps) {
  const sizes = {
    sm: { container: 'h-8', icon: 'h-7 w-7', text: 'text-lg' },
    md: { container: 'h-10', icon: 'h-9 w-9', text: 'text-xl' },
    lg: { container: 'h-12', icon: 'h-11 w-11', text: 'text-2xl' },
  };

  const s = sizes[size];

  return (
    <div className={cn('flex items-center gap-3', s.container, className)}>
      <div className={cn('relative', s.icon)}>
        <div className="absolute inset-0 bg-gradient-to-br from-brand-primary via-brand-secondary to-brand-accent rounded-xl blur-md opacity-50" />
        <div className="relative h-full w-full rounded-xl bg-gradient-to-br from-brand-primary via-brand-secondary to-brand-accent flex items-center justify-center shadow-lg">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="h-3/5 w-3/5 text-white"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </div>
      </div>
      <div className="flex flex-col leading-none">
        <span className={cn('font-bold gradient-text', s.text)}>Volunity</span>
        <span className="text-[10px] font-semibold text-muted-foreground tracking-widest">DZ</span>
      </div>
    </div>
  );
}
