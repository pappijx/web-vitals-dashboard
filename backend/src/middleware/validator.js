/**
 * Request Validation Middleware
 *
 * Validates incoming requests using express-validator.
 * Ensures URLs are properly formatted and required fields are present.
 */

const { body, validationResult } = require('express-validator');

/**
 * Validates URL format
 *
 * @param {string} url - URL to validate
 * @returns {boolean} True if valid
 */
function isValidUrl(url) {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch (error) {
    return false;
  }
}

/**
 * Validation rules for single URL endpoint
 */
const validateSingleUrl = [
  body('url')
    .exists()
    .withMessage('URL is required')
    .trim()
    .notEmpty()
    .withMessage('URL cannot be empty')
    .custom(isValidUrl)
    .withMessage('Invalid URL format. Must be a valid HTTP or HTTPS URL'),

  body('formFactor')
    .optional()
    .isIn(['PHONE', 'DESKTOP', 'TABLET'])
    .withMessage('Form factor must be one of: PHONE, DESKTOP, TABLET'),
];

/**
 * Validation rules for multiple URLs endpoint
 */
const validateMultipleUrls = [
  body('urls')
    .exists()
    .withMessage('URLs array is required')
    .isArray({ min: 1, max: 10 })
    .withMessage('URLs must be an array with 1-10 URLs'),

  body('urls.*')
    .trim()
    .notEmpty()
    .withMessage('URL cannot be empty')
    .custom(isValidUrl)
    .withMessage('Invalid URL format. Must be a valid HTTP or HTTPS URL'),

  body('formFactor')
    .optional()
    .isIn(['PHONE', 'DESKTOP', 'TABLET'])
    .withMessage('Form factor must be one of: PHONE, DESKTOP, TABLET'),
];

/**
 * Middleware to handle validation errors
 *
 * Checks for validation errors and returns 400 if found
 */
function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
        value: err.value,
      })),
    });
  }

  next();
}

module.exports = {
  validateSingleUrl,
  validateMultipleUrls,
  handleValidationErrors,
};
