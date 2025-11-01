# Web Vitals Dashboard - API Documentation

## Base URL
```
http://localhost:5000
```

## Table of Contents
- [Overview](#overview)
- [Authentication](#authentication)
- [Endpoints](#endpoints)
  - [Health Check](#health-check)
  - [Single URL Lookup](#single-url-lookup)
  - [Multiple URL Lookup](#multiple-url-lookup)
- [Error Handling](#error-handling)
- [Response Codes](#response-codes)
- [Examples](#examples)

---

## Overview

The Web Vitals Dashboard API provides access to Chrome User Experience Report (CrUX) performance data for websites. It allows you to:

- Fetch Core Web Vitals metrics for a single URL
- Analyze multiple URLs simultaneously
- Get aggregate statistics across URLs
- Filter by form factor (mobile, desktop, tablet)

## Authentication

The API uses a Google Cloud API key for authentication with the CrUX API. This key is stored securely in environment variables on the backend and is never exposed to the frontend.

**Important:** You need to enable the Chrome UX Report API in your Google Cloud Console for the API key to work.

### Enabling CrUX API:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to APIs & Services > Library
3. Search for "Chrome UX Report API"
4. Click "Enable"
5. Create credentials (API key) if needed

---

## Endpoints

### Health Check

Check if the API server is running.

**Endpoint:** `GET /api/health`

**Request:**
```bash
curl http://localhost:5000/api/health
```

**Response:**
```json
{
  "success": true,
  "message": "Web Vitals Dashboard API is running",
  "timestamp": "2025-10-31T18:17:45.884Z",
  "version": "1.0.0"
}
```

---

### Single URL Lookup

Fetch performance metrics for a single URL.

**Endpoint:** `POST /api/crux/single`

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "url": "https://developer.intuit.com",
  "formFactor": "PHONE"  // Optional: PHONE, DESKTOP, TABLET
}
```

**Request Example:**
```bash
curl -X POST http://localhost:5000/api/crux/single \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://developer.intuit.com",
    "formFactor": "PHONE"
  }'
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "url": "https://developer.intuit.com",
    "metrics": {
      "lcp": 2200,      // Largest Contentful Paint (ms)
      "fcp": 1500,      // First Contentful Paint (ms)
      "cls": 0.08,      // Cumulative Layout Shift (score)
      "fid": 80,        // First Input Delay (ms)
      "inp": 150,       // Interaction to Next Paint (ms)
      "ttfb": 400       // Time to First Byte (ms)
    },
    "formFactor": "PHONE",
    "collectionPeriod": {
      "firstDate": {"year": 2025, "month": 10, "day": 1},
      "lastDate": {"year": 2025, "month": 10, "day": 28}
    }
  },
  "timestamp": "2025-10-31T18:17:45.884Z"
}
```

**Validation:**
- `url` (required): Must be a valid HTTP or HTTPS URL
- `formFactor` (optional): Must be one of: `PHONE`, `DESKTOP`, `TABLET`

---

### Multiple URL Lookup

Fetch performance metrics for multiple URLs with summary statistics.

**Endpoint:** `POST /api/crux/multiple`

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "urls": [
    "https://developer.intuit.com",
    "https://quickbooks.intuit.com",
    "https://turbotax.intuit.com"
  ],
  "formFactor": "PHONE"  // Optional: PHONE, DESKTOP, TABLET
}
```

**Request Example:**
```bash
curl -X POST http://localhost:5000/api/crux/multiple \
  -H "Content-Type: application/json" \
  -d '{
    "urls": [
      "https://developer.intuit.com",
      "https://quickbooks.intuit.com"
    ],
    "formFactor": "PHONE"
  }'
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "results": [
      {
        "success": true,
        "url": "https://developer.intuit.com",
        "data": {
          "url": "https://developer.intuit.com",
          "metrics": {
            "lcp": 2200,
            "fcp": 1500,
            "cls": 0.08,
            "fid": 80,
            "inp": 150,
            "ttfb": 400
          },
          "formFactor": "PHONE",
          "collectionPeriod": {
            "firstDate": {"year": 2025, "month": 10, "day": 1},
            "lastDate": {"year": 2025, "month": 10, "day": 28}
          }
        }
      },
      {
        "success": true,
        "url": "https://quickbooks.intuit.com",
        "data": {
          "url": "https://quickbooks.intuit.com",
          "metrics": {
            "lcp": 2800,
            "fcp": 1800,
            "cls": 0.12,
            "fid": 120,
            "inp": 200,
            "ttfb": 500
          },
          "formFactor": "PHONE",
          "collectionPeriod": {
            "firstDate": {"year": 2025, "month": 10, "day": 1},
            "lastDate": {"year": 2025, "month": 10, "day": 28}
          }
        }
      }
    ],
    "summary": {
      "avgLcp": 2500,
      "avgFcp": 1650,
      "avgCls": 0.1,
      "avgFid": 100,
      "avgInp": 175,
      "avgTtfb": 450
    },
    "stats": {
      "total": 2,
      "successful": 2,
      "failed": 0
    }
  },
  "timestamp": "2025-10-31T18:17:45.884Z"
}
```

**Partial Success Example:**
If some URLs fail but others succeed, the API returns all results:
```json
{
  "success": true,
  "data": {
    "results": [
      {
        "success": true,
        "url": "https://developer.intuit.com",
        "data": { /* ... metrics ... */ }
      },
      {
        "success": false,
        "url": "https://invalid-site-12345.com",
        "error": "No CrUX data available for URL..."
      }
    ],
    "summary": {
      "avgLcp": 2200,
      // Summary only includes successful results
    },
    "stats": {
      "total": 2,
      "successful": 1,
      "failed": 1
    }
  },
  "timestamp": "2025-10-31T18:17:45.884Z"
}
```

**Validation:**
- `urls` (required): Array of 1-10 valid HTTP/HTTPS URLs
- `formFactor` (optional): Must be one of: `PHONE`, `DESKTOP`, `TABLET`

---

## Error Handling

All errors follow a consistent format:

```json
{
  "success": false,
  "message": "Error description",
  "details": "Additional details (optional)",
  "stack": "Stack trace (only in development mode)"
}
```

### Common Errors

#### Validation Error (400 Bad Request)
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "url",
      "message": "Invalid URL format. Must be a valid HTTP or HTTPS URL",
      "value": "invalid-url"
    }
  ]
}
```

#### URL Not Found (404 Not Found)
```json
{
  "success": false,
  "message": "No CrUX data available for URL: https://example.com. The URL might not have sufficient Chrome user traffic data."
}
```

#### API Authentication Error (403 Forbidden)
```json
{
  "success": false,
  "message": "API authentication failed",
  "details": "API key is invalid or CrUX API is not enabled for this key."
}
```

#### Rate Limit Error (429 Too Many Requests)
```json
{
  "success": false,
  "message": "Rate limit exceeded. Please try again later."
}
```

#### Service Unavailable (503 Service Unavailable)
```json
{
  "success": false,
  "message": "Service unavailable",
  "details": "No response from CrUX API. Please check your internet connection."
}
```

#### Route Not Found (404 Not Found)
```json
{
  "success": false,
  "message": "Route not found: POST /api/invalid-route"
}
```

---

## Response Codes

| Code | Description |
|------|-------------|
| 200  | Success |
| 400  | Bad Request (validation error) |
| 403  | Forbidden (API key invalid) |
| 404  | Not Found (no CrUX data or route doesn't exist) |
| 429  | Too Many Requests (rate limit) |
| 500  | Internal Server Error |
| 503  | Service Unavailable |

---

## Examples

### Example 1: Basic Single URL Query
```bash
curl -X POST http://localhost:5000/api/crux/single \
  -H "Content-Type: application/json" \
  -d '{"url": "https://web.dev"}'
```

### Example 2: Mobile Performance Check
```bash
curl -X POST http://localhost:5000/api/crux/single \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://developer.intuit.com",
    "formFactor": "PHONE"
  }'
```

### Example 3: Desktop Performance Check
```bash
curl -X POST http://localhost:5000/api/crux/single \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://developer.intuit.com",
    "formFactor": "DESKTOP"
  }'
```

### Example 4: Compare Multiple Sites
```bash
curl -X POST http://localhost:5000/api/crux/multiple \
  -H "Content-Type: application/json" \
  -d '{
    "urls": [
      "https://developer.intuit.com",
      "https://quickbooks.intuit.com",
      "https://turbotax.intuit.com"
    ]
  }'
```

### Example 5: Invalid URL (Validation Error)
```bash
curl -X POST http://localhost:5000/api/crux/single \
  -H "Content-Type: application/json" \
  -d '{"url": "not-a-valid-url"}'
```

### Example 6: Missing Required Field
```bash
curl -X POST http://localhost:5000/api/crux/single \
  -H "Content-Type: application/json" \
  -d '{}'
```

---

## Metrics Explained

| Metric | Full Name | What It Measures | Good | Needs Improvement | Poor |
|--------|-----------|------------------|------|-------------------|------|
| **LCP** | Largest Contentful Paint | Time until main content is visible | ≤ 2500ms | 2500-4000ms | > 4000ms |
| **FCP** | First Contentful Paint | Time until first content appears | ≤ 1800ms | 1800-3000ms | > 3000ms |
| **CLS** | Cumulative Layout Shift | Visual stability (lower is better) | ≤ 0.1 | 0.1-0.25 | > 0.25 |
| **FID** | First Input Delay | Interactivity/responsiveness | ≤ 100ms | 100-300ms | > 300ms |
| **INP** | Interaction to Next Paint | Overall responsiveness | ≤ 200ms | 200-500ms | > 500ms |
| **TTFB** | Time to First Byte | Server response time | ≤ 600ms | 600-1200ms | > 1200ms |

All time-based metrics (LCP, FCP, FID, INP, TTFB) are measured in **milliseconds**.

CLS is a **score** (dimensionless value).

All values represent the **75th percentile (p75)** from real Chrome user data.

---

## Notes

1. **Data Availability:** Not all URLs have CrUX data. Only sites with sufficient Chrome user traffic are included in the dataset.

2. **Form Factors:** If you don't specify a `formFactor`, the API returns data aggregated across all devices.

3. **Percentiles:** All metric values represent the 75th percentile (p75) from the CrUX dataset, which is the threshold used by Google for Core Web Vitals assessment.

4. **Collection Period:** The data is typically collected over the past 28 days.

5. **Rate Limits:** Google's CrUX API has rate limits. The backend implements proper error handling for rate limit scenarios.

6. **Parallel Requests:** The multiple URL endpoint makes parallel requests to the CrUX API for better performance.

7. **Error Resilience:** When querying multiple URLs, if some fail, the successful ones are still returned with summary statistics calculated from available data.

---

## Testing the API

Use the provided curl examples or tools like:
- **Postman**: Import the examples as a collection
- **Insomnia**: REST client with nice UI
- **HTTPie**: Command-line HTTP client
- **Browser DevTools**: Use fetch() in console

---

## Support

For issues or questions, refer to:
- [Chrome UX Report Documentation](https://developer.chrome.com/docs/crux/api)
- [Core Web Vitals Guide](https://web.dev/vitals/)
- Project README.md

---

**Last Updated:** 2025-10-31
**API Version:** 1.0.0
