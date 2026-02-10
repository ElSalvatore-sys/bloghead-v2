import { onCLS, onFCP, onLCP, onINP, onTTFB } from 'web-vitals'

/**
 * Report Core Web Vitals to console (dev mode) or analytics endpoint (production)
 *
 * Metrics tracked:
 * - CLS (Cumulative Layout Shift): < 0.1 (good)
 * - FCP (First Contentful Paint): < 1.8s (good)
 * - LCP (Largest Contentful Paint): < 2.5s (good)
 * - INP (Interaction to Next Paint): < 200ms (good)
 * - TTFB (Time to First Byte): < 800ms (good)
 *
 * @see https://web.dev/vitals/
 */
export function reportWebVitals() {
  // In development, log to console
  // In production, consider sending to analytics endpoint
  const logMetric = (metric: any) => {
    console.log(`[Web Vitals] ${metric.name}:`, {
      value: metric.value,
      rating: metric.rating,
      delta: metric.delta,
    })
  }

  onCLS(logMetric)   // Cumulative Layout Shift
  onFCP(logMetric)   // First Contentful Paint
  onLCP(logMetric)   // Largest Contentful Paint
  onINP(logMetric)   // Interaction to Next Paint
  onTTFB(logMetric)  // Time to First Byte
}
