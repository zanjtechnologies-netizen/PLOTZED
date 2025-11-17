// src/lib/security-config.ts

/**
 * Security Configuration for Plotzed Application
 * Includes CORS, rate limiting, and API security settings
 */

export const securityConfig = {
  // CORS Configuration
  cors: {
    // Allowed origins (update these for production)
    allowedOrigins: [
      'http://localhost:3000',
      'http://localhost:3001',
      'https://plotzedrealestate.com',
      'https://www.plotzedrealestate.com',
      'https://app.plotzedrealestate.com',
      // Add staging/preview URLs
      ...(process.env.VERCEL_URL ? [`https://${process.env.VERCEL_URL}`] : []),
    ],

    // Allowed methods
    allowedMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],

    // Allowed headers
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'Accept',
      'Origin',
      'X-CSRF-Token',
    ],

    // Exposed headers
    exposedHeaders: ['Content-Length', 'X-Request-Id'],

    // Credentials
    credentials: true,

    // Preflight cache (in seconds)
    maxAge: 86400, // 24 hours
  },

  // Rate Limiting Configuration
  rateLimit: {
    // General API rate limit
    api: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // 100 requests per window
    },

    // Authentication endpoints (stricter)
    auth: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 5, // 5 attempts per window
    },

    // Payment endpoints (strictest)
    payment: {
      windowMs: 60 * 60 * 1000, // 1 hour
      max: 10, // 10 requests per hour
    },

    // Upload endpoints
    upload: {
      windowMs: 60 * 60 * 1000, // 1 hour
      max: 20, // 20 uploads per hour
    },
  },

  // API Key validation
  apiKeys: {
    enabled: process.env.REQUIRE_API_KEY === 'true',
    headerName: 'X-API-Key',
    keys: process.env.API_KEYS?.split(',') || [],
  },

  // CSRF Protection
  csrf: {
    enabled: true,
    headerName: 'X-CSRF-Token',
    cookieName: 'csrf-token',
  },

  // Content Security Policy
  contentSecurityPolicy: {
    'default-src': ["'self'"],
    'script-src': [
      "'self'",
      "'unsafe-inline'",
      "'unsafe-eval'",
      'https://checkout.razorpay.com',
      'https://www.google.com',
      'https://www.gstatic.com',
    ],
    'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
    'font-src': ["'self'", 'https://fonts.gstatic.com'],
    'img-src': ["'self'", 'data:', 'https:', 'blob:'],
    'connect-src': [
      "'self'",
      'https://api.razorpay.com',
      'https://*.google.com',
      'https://www.google.com',
      'https://www.gstatic.com',
    ],
    'frame-src': [
      "'self'",
      'https://api.razorpay.com',
      'https://www.google.com',
      'https://www.gstatic.com',
      'https://recaptcha.google.com',
    ],
  },

  // Security Headers
  headers: {
    'X-DNS-Prefetch-Control': 'on',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'X-Frame-Options': 'SAMEORIGIN',
    'X-Content-Type-Options': 'nosniff',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=(self)',
  },
} as const;

/**
 * Check if origin is allowed
 */
export function isOriginAllowed(origin: string | null): boolean {
  if (!origin) return false;

  // In development, allow all localhost origins
  if (process.env.NODE_ENV === 'development') {
    if (origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
      return true;
    }
  }

  return securityConfig.cors.allowedOrigins.includes(origin);
}

/**
 * Get rate limit config for specific endpoint
 */
export function getRateLimitConfig(path: string) {
  if (path.startsWith('/api/auth')) {
    return securityConfig.rateLimit.auth;
  }
  if (path.startsWith('/api/payments')) {
    return securityConfig.rateLimit.payment;
  }
  if (path.startsWith('/api/upload')) {
    return securityConfig.rateLimit.upload;
  }
  return securityConfig.rateLimit.api;
}