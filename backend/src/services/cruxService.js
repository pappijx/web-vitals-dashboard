/**
 * CrUX API Service
 *
 * Handles communication with Google's Chrome UX Report API.
 * Provides functions to fetch performance metrics for single or multiple URLs.
 */

const axios = require('axios');
const config = require('../config/env');

/**
 * Fetches CrUX data for a single URL
 *
 * @param {string} url - The URL to query
 * @param {string} formFactor - Optional: 'PHONE', 'DESKTOP', 'TABLET'
 * @returns {Promise<Object>} Parsed performance metrics
 */
async function fetchSingleUrlMetrics(url, formFactor = null) {
  try {
    const requestBody = {
      url: url,
    };

    // Add form factor if specified
    if (formFactor) {
      requestBody.formFactor = formFactor;
    }

    const response = await axios.post(
      `${config.crux.baseUrl}${config.crux.endpoint}`,
      requestBody,
      {
        params: {
          key: config.crux.apiKey,
        },
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000, // 10 second timeout
      }
    );

    return parseMetricsData(response.data, url);
  } catch (error) {
    throw handleCruxError(error, url);
  }
}

/**
 * Fetches CrUX data for multiple URLs in parallel
 *
 * @param {Array<string>} urls - Array of URLs to query
 * @param {string} formFactor - Optional: 'PHONE', 'DESKTOP', 'TABLET'
 * @returns {Promise<Object>} Object containing individual results and summary
 */
async function fetchMultipleUrlMetrics(urls, formFactor = null) {
  try {
    // Create promises for all URLs
    const promises = urls.map((url) =>
      fetchSingleUrlMetrics(url, formFactor)
        .then((data) => ({ success: true, url, data }))
        .catch((error) => ({ success: false, url, error: error.message }))
    );

    // Wait for all promises to settle
    const results = await Promise.all(promises);

    // Separate successful and failed results
    const successful = results.filter((r) => r.success);
    const failed = results.filter((r) => !r.success);

    // Calculate summary statistics from successful results
    const summary = calculateSummary(successful.map((r) => r.data));

    return {
      results: results,
      summary: summary,
      stats: {
        total: urls.length,
        successful: successful.length,
        failed: failed.length,
      },
    };
  } catch (error) {
    throw new Error(`Failed to fetch metrics for multiple URLs: ${error.message}`);
  }
}

/**
 * Parses raw CrUX API response into structured metrics
 *
 * @param {Object} data - Raw CrUX API response
 * @param {string} url - The queried URL
 * @returns {Object} Structured performance metrics
 */
function parseMetricsData(data, url) {
  const record = data.record;
  const metrics = record.metrics || {};

  return {
    url: url,
    metrics: {
      lcp: extractMetricValue(metrics.largest_contentful_paint),
      fcp: extractMetricValue(metrics.first_contentful_paint),
      cls: extractMetricValue(metrics.cumulative_layout_shift),
      fid: extractMetricValue(metrics.first_input_delay),
      inp: extractMetricValue(metrics.interaction_to_next_paint),
      ttfb: extractMetricValue(metrics.experimental_time_to_first_byte),
    },
    formFactor: record.key?.formFactor || 'ALL',
    collectionPeriod: {
      firstDate: record.collectionPeriod?.firstDate || null,
      lastDate: record.collectionPeriod?.lastDate || null,
    },
  };
}

/**
 * Extracts p75 value from metric object
 *
 * @param {Object} metric - CrUX metric object
 * @returns {number|null} P75 value or null if not available
 */
function extractMetricValue(metric) {
  if (!metric || !metric.percentiles) {
    return null;
  }
  return metric.percentiles.p75 || null;
}

/**
 * Calculates summary statistics across multiple results
 *
 * @param {Array<Object>} results - Array of parsed metrics
 * @returns {Object} Summary statistics
 */
function calculateSummary(results) {
  if (results.length === 0) {
    return {
      avgLcp: null,
      avgFcp: null,
      avgCls: null,
      avgFid: null,
      avgInp: null,
      avgTtfb: null,
    };
  }

  const sum = results.reduce(
    (acc, result) => {
      const m = result.metrics;
      return {
        lcp: acc.lcp + (m.lcp || 0),
        fcp: acc.fcp + (m.fcp || 0),
        cls: acc.cls + (m.cls || 0),
        fid: acc.fid + (m.fid || 0),
        inp: acc.inp + (m.inp || 0),
        ttfb: acc.ttfb + (m.ttfb || 0),
        count: {
          lcp: acc.count.lcp + (m.lcp ? 1 : 0),
          fcp: acc.count.fcp + (m.fcp ? 1 : 0),
          cls: acc.count.cls + (m.cls ? 1 : 0),
          fid: acc.count.fid + (m.fid ? 1 : 0),
          inp: acc.count.inp + (m.inp ? 1 : 0),
          ttfb: acc.count.ttfb + (m.ttfb ? 1 : 0),
        },
      };
    },
    {
      lcp: 0,
      fcp: 0,
      cls: 0,
      fid: 0,
      inp: 0,
      ttfb: 0,
      count: { lcp: 0, fcp: 0, cls: 0, fid: 0, inp: 0, ttfb: 0 },
    }
  );

  return {
    avgLcp: sum.count.lcp > 0 ? Math.round(sum.lcp / sum.count.lcp) : null,
    avgFcp: sum.count.fcp > 0 ? Math.round(sum.fcp / sum.count.fcp) : null,
    avgCls: sum.count.cls > 0 ? parseFloat((sum.cls / sum.count.cls).toFixed(3)) : null,
    avgFid: sum.count.fid > 0 ? Math.round(sum.fid / sum.count.fid) : null,
    avgInp: sum.count.inp > 0 ? Math.round(sum.inp / sum.count.inp) : null,
    avgTtfb: sum.count.ttfb > 0 ? Math.round(sum.ttfb / sum.count.ttfb) : null,
  };
}

/**
 * Handles errors from CrUX API and formats them appropriately
 *
 * @param {Error} error - The error object
 * @param {string} url - The URL that caused the error
 * @returns {Error} Formatted error
 */
function handleCruxError(error, url) {
  if (error.response) {
    // The request was made and the server responded with a status code
    const status = error.response.status;
    const data = error.response.data;

    if (status === 404) {
      return new Error(
        `No CrUX data available for URL: ${url}. The URL might not have sufficient Chrome user traffic data.`
      );
    } else if (status === 400) {
      return new Error(`Invalid request for URL: ${url}. ${data.error?.message || 'Bad request'}`);
    } else if (status === 403) {
      return new Error('API key is invalid or CrUX API is not enabled for this key.');
    } else if (status === 429) {
      return new Error('Rate limit exceeded. Please try again later.');
    } else {
      return new Error(`CrUX API error (${status}): ${data.error?.message || 'Unknown error'}`);
    }
  } else if (error.request) {
    // The request was made but no response was received
    return new Error(`No response from CrUX API. Please check your internet connection.`);
  } else {
    // Something happened in setting up the request
    return new Error(`Error setting up CrUX API request: ${error.message}`);
  }
}

module.exports = {
  fetchSingleUrlMetrics,
  fetchMultipleUrlMetrics,
};
