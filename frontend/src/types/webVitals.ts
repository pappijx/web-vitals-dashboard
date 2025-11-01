/**
 * TypeScript Type Definitions for Web Vitals Dashboard
 */

// Form factor types
export type FormFactor = 'PHONE' | 'DESKTOP' | 'TABLET' | 'ALL';

// Performance metrics interface
export interface WebVitalsMetrics {
  lcp: number | null;  // Largest Contentful Paint (ms)
  fcp: number | null;  // First Contentful Paint (ms)
  cls: number | null;  // Cumulative Layout Shift (score)
  fid: number | null;  // First Input Delay (ms)
  inp: number | null;  // Interaction to Next Paint (ms)
  ttfb: number | null; // Time to First Byte (ms)
}

// Collection period interface
export interface CollectionPeriod {
  firstDate: {
    year: number;
    month: number;
    day: number;
  } | null;
  lastDate: {
    year: number;
    month: number;
    day: number;
  } | null;
}

// Single URL metrics data
export interface WebVitalsData {
  url: string;
  metrics: WebVitalsMetrics;
  formFactor: FormFactor;
  collectionPeriod: CollectionPeriod;
}

// API response for single URL
export interface SingleUrlResponse {
  success: boolean;
  data: WebVitalsData;
  timestamp: string;
}

// API response for multiple URLs - individual result
export interface MultiUrlResult {
  success: boolean;
  url: string;
  data?: WebVitalsData;
  error?: string;
}

// Summary statistics
export interface SummaryStatistics {
  avgLcp: number | null;
  avgFcp: number | null;
  avgCls: number | null;
  avgFid: number | null;
  avgInp: number | null;
  avgTtfb: number | null;
}

// Stats for multiple URLs
export interface MultiUrlStats {
  total: number;
  successful: number;
  failed: number;
}

// API response for multiple URLs
export interface MultiUrlResponse {
  success: boolean;
  data: {
    results: MultiUrlResult[];
    summary: SummaryStatistics;
    stats: MultiUrlStats;
  };
  timestamp: string;
}

// API error response
export interface ApiError {
  success: false;
  message: string;
  details?: string;
  errors?: Array<{
    field: string;
    message: string;
    value: unknown;
  }>;
}

// Request body for single URL
export interface SingleUrlRequest {
  url: string;
  formFactor?: FormFactor;
}

// Request body for multiple URLs
export interface MultiUrlRequest {
  urls: string[];
  formFactor?: FormFactor;
}

// Performance thresholds (based on Core Web Vitals)
export interface PerformanceThresholds {
  lcp: { good: number; needsImprovement: number }; // 2500ms, 4000ms
  fcp: { good: number; needsImprovement: number }; // 1800ms, 3000ms
  cls: { good: number; needsImprovement: number }; // 0.1, 0.25
  fid: { good: number; needsImprovement: number }; // 100ms, 300ms
  inp: { good: number; needsImprovement: number }; // 200ms, 500ms
  ttfb: { good: number; needsImprovement: number }; // 600ms, 1200ms
}

// Performance category
export type PerformanceCategory = 'good' | 'needs-improvement' | 'poor';

// Filter state
export interface FilterState {
  minLcp: number | null;
  maxLcp: number | null;
  minFcp: number | null;
  maxFcp: number | null;
  minCls: number | null;
  maxCls: number | null;
  minFid: number | null;
  maxFid: number | null;
  minInp: number | null;
  maxInp: number | null;
  minTtfb: number | null;
  maxTtfb: number | null;
  category?: PerformanceCategory;
}

// Sort configuration
export type SortOrder = 'asc' | 'desc';
export type SortableField = keyof WebVitalsMetrics | 'url';

export interface SortConfig {
  field: SortableField;
  order: SortOrder;
}

// Component props types

export interface DataTableProps {
  data: WebVitalsData[];
  loading?: boolean;
  sortConfig?: SortConfig;
  onSort?: (field: SortableField) => void;
}

export interface FilterControlsProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  onClear: () => void;
}

export interface SummaryStatsProps {
  summary: SummaryStatistics;
  stats: MultiUrlStats;
}

export interface URLInputProps {
  onSubmit: (url: string, formFactor?: FormFactor) => void;
  loading?: boolean;
  disabled?: boolean;
}

export interface MultiURLInputProps {
  onSubmit: (urls: string[], formFactor?: FormFactor) => void;
  loading?: boolean;
  disabled?: boolean;
}
