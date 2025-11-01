/**
 * React Query Hooks for Web Vitals Data
 *
 * Custom hooks using TanStack Query for fetching and managing Web Vitals data
 */

import {
  useQuery,
  useQueries,
  type UseQueryResult,
} from "@tanstack/react-query";
import { webVitalsApi } from "../services/api";
import type {
  FormFactor,
  SingleUrlResponse,
  MultiUrlResponse,
  WebVitalsData,
} from "../types/webVitals";

/**
 * Hook to fetch metrics for a single URL
 *
 * @param url - The URL to fetch metrics for
 * @param formFactor - Optional form factor (PHONE, DESKTOP, TABLET)
 * @param enabled - Whether the query should run (default: true when URL is provided)
 */
export function useSingleUrlMetrics(
  url: string,
  formFactor?: FormFactor,
  enabled = true
) {
  return useQuery<SingleUrlResponse, Error>({
    queryKey: ["webVitals", "single", url, formFactor],
    queryFn: () => webVitalsApi.fetchSingleUrl({ url, formFactor }),
    enabled: enabled && !!url, // Only run if enabled and URL is provided
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  });
}

/**
 * Hook to fetch metrics for multiple URLs in parallel
 *
 * Uses useQueries to fetch multiple URLs concurrently with individual loading states
 *
 * @param urls - Array of URLs to fetch metrics for
 * @param formFactor - Optional form factor
 */
export function useMultipleUrlMetrics(urls: string[], formFactor?: FormFactor) {
  return useQueries({
    queries: urls.map((url) => ({
      queryKey: ["webVitals", "single", url, formFactor],
      queryFn: () => webVitalsApi.fetchSingleUrl({ url, formFactor }),
      enabled: !!url,
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
    })),
  });
}

/**
 * Hook to fetch metrics using the multiple URLs endpoint (with summary)
 *
 * This uses the backend's /api/crux/multiple endpoint which provides
 * summary statistics and handles errors gracefully
 *
 * @param urls - Array of URLs to fetch metrics for
 * @param formFactor - Optional form factor
 * @param enabled - Whether the query should run
 */
export function useMultipleUrlsWithSummary(
  urls: string[],
  formFactor?: FormFactor,
  enabled = true
) {
  return useQuery<MultiUrlResponse, Error>({
    queryKey: ["webVitals", "multiple", urls, formFactor],
    queryFn: () => webVitalsApi.fetchMultipleUrls({ urls, formFactor }),
    enabled: enabled && urls.length > 0,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

/**
 * Helper hook to extract successful results from multiple URL queries
 *
 * @param queries - Results from useMultipleUrlMetrics
 * @returns Array of successfully fetched WebVitalsData
 */
export function useSuccessfulResults(
  queries: UseQueryResult<SingleUrlResponse, Error>[]
): WebVitalsData[] {
  return queries
    .filter((query) => query.isSuccess && query.data)
    .map((query) => query.data!.data);
}

/**
 * Helper hook to check if any queries are loading
 *
 * @param queries - Results from useMultipleUrlMetrics
 * @returns True if any query is loading
 */
export function useAnyLoading(
  queries: UseQueryResult<SingleUrlResponse, Error>[]
): boolean {
  return queries.some((query) => query.isLoading);
}

/**
 * Helper hook to get error count from multiple queries
 *
 * @param queries - Results from useMultipleUrlMetrics
 * @returns Number of failed queries
 */
export function useErrorCount(
  queries: UseQueryResult<SingleUrlResponse, Error>[]
): number {
  return queries.filter((query) => query.isError).length;
}
