/**
 * Environment Configuration
 *
 * Loads and validates environment variables.
 * Throws error if required variables are missing.
 */

require("dotenv").config();

const requiredEnvVars = ["CRUX_API_KEY"];

// Validate required environment variables
requiredEnvVars.forEach((varName) => {
  if (!process.env[varName]) {
    throw new Error(`Missing required environment variable: ${varName}`);
  }
});

const config = {
  // Server configuration
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || "development",

  // CrUX API configuration
  crux: {
    apiKey: process.env.CRUX_API_KEY,
    baseUrl:
      process.env.CRUX_API_BASE_URL ||
      "https://chromeuxreport.googleapis.com/v1",
    endpoint: "/records:queryRecord",
  },

  // CORS configuration
  cors: {
    origin: process.env.CORS_ORIGIN || "*",
    credentials: true,
  },
};

module.exports = config;
