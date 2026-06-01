'use client';

import * as React from 'react';
import { X, CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Toast {
  id: string;
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive';
}

interface ToastContextType {
  toast: (props: Omit<Toast, 'id'>) => void;
}

const ToastContext = React.createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  const toast = React.useCallback((props: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).slice(2, 9);
    setToasts((prev) => [...prev, { ...props, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  const remove = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed top-20 end-4 z-[100] flex flex-col gap-2 max-w-sm">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={cn(
              'glass-card p-4 animate-fade-in shadow-2xl flex items-start gap-3',
              toast.variant === 'destructive' && 'border-destructive/50'
            )}
          >
            {toast.variant === 'destructive' ? (
              <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
            ) : (
              <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
            )}
            <div className="flex-1 min-w-0">
              {toast.title && <div className="font-semibold text-sm">{toast.title}</div>}
              {toast.description && (
                <div className="text-sm text-muted-foreground mt-1">{toast.description}</div>
              )}
            </div>
            <button
              onClick={() => remove(toast.id)}
              className="text-muted-foreground hover:text-foreground flex-shrink-0"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    // Fallback if not within provider
    return {
      toast: (props: Omit<Toast, 'id'>) => {
        if (typeof window !== 'undefined') {
          console.log('Toast:', props);
        }
      },
    };
  }
  return context;
}
