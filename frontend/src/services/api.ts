/**
 * API Service Layer
 *
 * Axios instance configuration and API methods for Web Vitals Dashboard
 */

import axios, { AxiosError } from 'axios';
import type {
  SingleUrlRequest,
  SingleUrlResponse,
  MultiUrlRequest,
  MultiUrlResponse,
  ApiError,
} from '../types/webVitals';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
  timeout: 30000, // 30 seconds for multiple URLs
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor (for adding auth tokens, logging, etc.)
api.interceptors.request.use(
  (config) => {
    // Log requests in development
    if (import.meta.env.DEV) {
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, config.data);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor (for error handling, logging, etc.)
api.interceptors.response.use(
  (response) => {
    // Log responses in development
    if (import.meta.env.DEV) {
      console.log(`[API Response] ${response.config.url}`, response.data);
    }
    return response;
  },
  (error: AxiosError<ApiError>) => {
    // Log errors in development
    if (import.meta.env.DEV) {
      console.error('[API Error]', error.response?.data || error.message);
    }

    // Format error for consistent handling
    const formattedError = {
      message: error.response?.data?.message || error.message || 'An error occurred',
      details: error.response?.data?.details,
      status: error.response?.status,
      errors: error.response?.data?.errors,
    };

    return Promise.reject(formattedError);
  }
);

/**
 * API Methods
 */

export const webVitalsApi = {
  /**
   * Health check endpoint
   */
  async healthCheck() {
    const response = await api.get('/api/health');
    return response.data;
  },

  /**
   * Fetch metrics for a single URL
   */
  async fetchSingleUrl(request: SingleUrlRequest): Promise<SingleUrlResponse> {
    const response = await api.post<SingleUrlResponse>('/api/crux/single', request);
    return response.data;
  },

  /**
   * Fetch metrics for multiple URLs
   */
  async fetchMultipleUrls(request: MultiUrlRequest): Promise<MultiUrlResponse> {
    const response = await api.post<MultiUrlResponse>('/api/crux/multiple', request);
    return response.data;
  },
};

export default api;
