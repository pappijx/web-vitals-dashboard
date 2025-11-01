/**
 * CrUX API Routes
 *
 * Defines all endpoints for Chrome UX Report data fetching.
 */

const express = require('express');
const router = express.Router();
const cruxService = require('../services/cruxService');
const { validateSingleUrl, validateMultipleUrls, handleValidationErrors } = require('../middleware/validator');

/**
 * Health check endpoint
 *
 * GET /api/health
 *
 * Returns server status and timestamp
 */
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Web Vitals Dashboard API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

/**
 * Single URL lookup endpoint
 *
 * POST /api/crux/single
 *
 * Body:
 * {
 *   "url": "https://example.com",
 *   "formFactor": "PHONE" // Optional: PHONE, DESKTOP, TABLET
 * }
 *
 * Returns performance metrics for a single URL
 */
router.post('/crux/single', validateSingleUrl, handleValidationErrors, async (req, res, next) => {
  try {
    const { url, formFactor } = req.body;

    console.log(`Fetching CrUX data for: ${url}${formFactor ? ` (${formFactor})` : ''}`);

    const data = await cruxService.fetchSingleUrlMetrics(url, formFactor);

    res.json({
      success: true,
      data: data,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Multiple URLs lookup endpoint
 *
 * POST /api/crux/multiple
 *
 * Body:
 * {
 *   "urls": [
 *     "https://example1.com",
 *     "https://example2.com"
 *   ],
 *   "formFactor": "PHONE" // Optional: PHONE, DESKTOP, TABLET
 * }
 *
 * Returns performance metrics for multiple URLs with summary statistics
 */
router.post('/crux/multiple', validateMultipleUrls, handleValidationErrors, async (req, res, next) => {
  try {
    const { urls, formFactor } = req.body;

    console.log(`Fetching CrUX data for ${urls.length} URLs${formFactor ? ` (${formFactor})` : ''}`);

    const data = await cruxService.fetchMultipleUrlMetrics(urls, formFactor);

    res.json({
      success: true,
      data: data,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
