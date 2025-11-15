// ================================================
// sentry.server.config.ts - Sentry Server Configuration
// ================================================

/**
 * Sentry configuration for server-side (Node.js) error tracking
 *
 * This file is automatically imported by Next.js instrumentation
 * and runs on the server to capture API errors, server-side rendering errors, etc.
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

    // Note: @sentry/nextjs automatically includes all necessary integrations
    // including Prisma, HTTP, and Node integrations

    // Enable logs to be sent to Sentry
    enableLogs: process.env.NODE_ENV === 'production',

    // Enable sending user PII (Personally Identifiable Information)
    // Only in production with user consent
    sendDefaultPii: false,

    // Filter out known noise
    ignoreErrors: [
      // Expected validation errors
      'ValidationError',
      'ZodError',
      // Database connection retry errors (handled by Prisma)
      'P1001', // Can't reach database server
      'P1017', // Server has closed the connection
    ],

    // Event filtering and enrichment
    beforeSend(event, hint) {
      // Don't send events in development
      if (process.env.NODE_ENV === 'development') {
        console.error('Sentry Event (dev):', event, hint)
        return null
      }

      // Add request context
      const error = hint.originalException
      if (error && typeof error === 'object') {
        // Add custom error metadata
        if ('statusCode' in error) {
          event.contexts = event.contexts || {}
          event.contexts.http = event.contexts.http || {}
          event.contexts.http.status_code = (error as any).statusCode
        }

        // Add user context from error
        if ('userId' in error) {
          event.user = {
            id: (error as any).userId,
          }
        }
      }

      return event
    },

    // Transaction filtering
    beforeSendTransaction(transaction) {
      // Don't send health check transactions
      if (transaction.transaction?.includes('/api/health')) {
        return null
      }

      // Sample down high-volume endpoints
      if (transaction.transaction?.includes('/api/plots') && Math.random() > 0.1) {
        return null
      }

      return transaction
    },
  })
}

export default Sentry
