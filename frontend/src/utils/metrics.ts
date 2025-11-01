/**
 * Utility functions for Web Vitals metrics
 */

import type { PerformanceCategory, PerformanceThresholds } from '../types/webVitals';

// Core Web Vitals thresholds (based on Google's standards)
export const THRESHOLDS: PerformanceThresholds = {
  lcp: { good: 2500, needsImprovement: 4000 }, // ms
  fcp: { good: 1800, needsImprovement: 3000 }, // ms
  cls: { good: 0.1, needsImprovement: 0.25 }, // score
  fid: { good: 100, needsImprovement: 300 }, // ms
  inp: { good: 200, needsImprovement: 500 }, // ms
  ttfb: { good: 600, needsImprovement: 1200 }, // ms
};

/**
 * Get performance category for a metric value
 */
export function getPerformanceCategory(
  metricName: keyof PerformanceThresholds,
  value: number | null
): PerformanceCategory {
  if (value === null) return 'poor';

  const threshold = THRESHOLDS[metricName];
  if (value <= threshold.good) return 'good';
  if (value <= threshold.needsImprovement) return 'needs-improvement';
  return 'poor';
}

/**
 * Get color for performance category
 */
export function getCategoryColor(category: PerformanceCategory): string {
  switch (category) {
    case 'good':
      return '#2e7d32'; // green
    case 'needs-improvement':
      return '#ed6c02'; // orange
    case 'poor':
      return '#d32f2f'; // red
  }
}

/**
 * Format metric value with appropriate unit
 */
export function formatMetricValue(
  metricName: keyof PerformanceThresholds,
  value: number | null
): string {
  if (value === null || value === undefined || typeof value !== 'number') return 'N/A';

  if (metricName === 'cls') {
    return value.toFixed(3); // CLS is a score
  }

  return `${Math.round(value)}ms`; // All others are in milliseconds
}

/**
 * Get metric display name
 */
export function getMetricDisplayName(metricName: string): string {
  const names: Record<string, string> = {
    lcp: 'LCP',
    fcp: 'FCP',
    cls: 'CLS',
    fid: 'FID',
    inp: 'INP',
    ttfb: 'TTFB',
  };
  return names[metricName] || metricName.toUpperCase();
}

/**
 * Get metric full name
 */
export function getMetricFullName(metricName: string): string {
  const names: Record<string, string> = {
    lcp: 'Largest Contentful Paint',
    fcp: 'First Contentful Paint',
    cls: 'Cumulative Layout Shift',
    fid: 'First Input Delay',
    inp: 'Interaction to Next Paint',
    ttfb: 'Time to First Byte',
  };
  return names[metricName] || metricName;
}

/**
 * Get metric description
 */
export function getMetricDescription(metricName: string): string {
  const descriptions: Record<string, string> = {
    lcp: 'Time until the largest content element is visible',
    fcp: 'Time until first content appears on the screen',
    cls: 'Visual stability - measures unexpected layout shifts',
    fid: 'Responsiveness - time from first interaction to browser response',
    inp: 'Overall responsiveness - latency of all user interactions',
    ttfb: 'Server response time - time to receive first byte',
  };
  return descriptions[metricName] || '';
}
