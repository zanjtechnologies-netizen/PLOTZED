// ================================================
// sentry.edge.config.ts - Sentry Edge Runtime Configuration
// ================================================

/**
 * Sentry configuration for edge features (middleware, edge routes)
 *
 * This config is used when edge features are loaded.
 * Note: This is unrelated to Vercel Edge Runtime and is required when running locally.
 */

import * as Sentry from '@sentry/nextjs'

const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN

// Only initialize Sentry if DSN is configured
if (SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,

    // Environment
    environment: process.env.NODE_ENV || 'development',

    // Release tracking
    release: process.env.VERCEL_GIT_COMMIT_SHA,

    // Performance Monitoring
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

    // Enable logs to be sent to Sentry (only in production)
    enableLogs: process.env.NODE_ENV === 'production',

    // Don't send PII by default
    sendDefaultPii: false,

    // Filter out noise
    beforeSend(event, hint) {
      // Don't send events in development
      if (process.env.NODE_ENV === 'development') {
        console.error('Sentry Edge Event (dev):', event, hint)
        return null
      }

      return event
    },
  })
}
