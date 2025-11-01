/**
 * Global Error Handler Middleware
 *
 * Catches all errors and formats them consistently.
 * Different error types get different status codes.
 */

/**
 * Global error handling middleware
 *
 * @param {Error} err - Error object
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Next middleware
 */
function errorHandler(err, req, res, next) {
  // Log error for debugging (in production, use proper logging service)
  console.error('Error:', {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString(),
  });

  // Default error response
  let statusCode = 500;
  let message = 'Internal server error';
  let details = null;

  // Determine status code based on error type or message
  if (err.message.includes('No CrUX data available')) {
    statusCode = 404;
    message = err.message;
  } else if (err.message.includes('Invalid request')) {
    statusCode = 400;
    message = err.message;
  } else if (err.message.includes('API key is invalid') || err.message.includes('not enabled')) {
    statusCode = 403;
    message = 'API authentication failed';
    details = err.message;
  } else if (err.message.includes('Rate limit exceeded')) {
    statusCode = 429;
    message = err.message;
  } else if (err.message.includes('No response from CrUX API')) {
    statusCode = 503;
    message = 'Service unavailable';
    details = err.message;
  } else if (err.statusCode) {
    statusCode = err.statusCode;
    message = err.message;
  } else {
    message = process.env.NODE_ENV === 'development' ? err.message : 'Internal server error';
  }

  // Send error response
  const response = {
    success: false,
    message: message,
    ...(details && { details }),
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  };

  res.status(statusCode).json(response);
}

/**
 * 404 Not Found handler
 *
 * Catches requests to non-existent routes
 */
function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.path}`,
  });
}

module.exports = {
  errorHandler,
  notFoundHandler,
};
