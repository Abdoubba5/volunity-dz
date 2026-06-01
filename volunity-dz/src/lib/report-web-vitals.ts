import { getAnalyticsService } from '@/lib/services/analytics.service';

export function reportWebVitals(metric: any) {
  if (process.env.NODE_ENV === 'development') return;

  const svc = getAnalyticsService();
  svc.trackPerformance(metric.name, {
    value: metric.value,
    rating: metric.rating,
    delta: metric.delta,
    id: metric.id,
  });
}
