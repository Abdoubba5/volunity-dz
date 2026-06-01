'use client';

import * as React from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { getAnalyticsService } from '@/lib/services/analytics.service';
import { useAuth } from '@/lib/auth-context';

function PageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { isAuthenticated, user } = useAuth();
  const trackedRef = React.useRef<string>('');

  React.useEffect(() => {
    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
    const trackingKey = url + (user?.id ?? 'anon');

    if (trackedRef.current === trackingKey) return;
    trackedRef.current = trackingKey;

    const timeout = setTimeout(() => {
      getAnalyticsService().trackPageView(url);
    }, 500);

    return () => clearTimeout(timeout);
  }, [pathname, searchParams, user?.id]);

  return null;
}

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <React.Suspense fallback={null}>
        <PageViewTracker />
      </React.Suspense>
      {children}
    </>
  );
}
