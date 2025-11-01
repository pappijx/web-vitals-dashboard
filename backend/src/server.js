/**
 * Web Vitals Dashboard - Backend Server
 *
 * Express.js server that provides API endpoints for Chrome UX Report data.
 */

const express = require('express');
const cors = require('cors');
const config = require('./config/env');
const cruxRoutes = require('./routes/cruxRoutes');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

// Initialize Express app
const app = express();

// ===================
// Middleware Setup
// ===================

// Enable CORS for all origins (configure as needed for production)
app.use(
  cors({
    origin: config.cors.origin,
    credentials: config.cors.credentials,
  })
);

// Parse JSON request bodies
app.use(express.json());

// Parse URL-encoded request bodies
app.use(express.urlencoded({ extended: true }));

// Request logging middleware (simple console logging)
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// ===================
// Routes
// ===================

// API routes
app.use('/api', cruxRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Web Vitals Dashboard API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      singleUrl: 'POST /api/crux/single',
      multipleUrls: 'POST /api/crux/multiple',
    },
    documentation: 'See README.md for detailed API documentation',
  });
});

// ===================
// Error Handling
// ===================

// 404 handler (must be after all routes)
app.use(notFoundHandler);

// Global error handler (must be last)
app.use(errorHandler);

// ===================
// Server Startup
// ===================

const PORT = config.port;

const server = app.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log('🚀 Web Vitals Dashboard Backend Server');
  console.log('='.repeat(50));
  console.log(`📡 Server running on: http://localhost:${PORT}`);
  console.log(`🌍 Environment: ${config.nodeEnv}`);
  console.log(`⏰ Started at: ${new Date().toISOString()}`);
  console.log('='.repeat(50));
  console.log('\nAvailable endpoints:');
  console.log(`  GET  http://localhost:${PORT}/`);
  console.log(`  GET  http://localhost:${PORT}/api/health`);
  console.log(`  POST http://localhost:${PORT}/api/crux/single`);
  console.log(`  POST http://localhost:${PORT}/api/crux/multiple`);
  console.log('='.repeat(50));
});

// ===================
// Graceful Shutdown
// ===================

// Handle SIGTERM
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

// Handle SIGINT (Ctrl+C)
process.on('SIGINT', () => {
  console.log('\nSIGINT signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

module.exports = app;
