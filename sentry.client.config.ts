// ================================================
// sentry.client.config.ts - Sentry Client Configuration
// ================================================

/**
 * Sentry configuration for client-side (browser) error tracking
 *
 * This file is automatically imported by Next.js instrumentation
 * and runs in the browser to capture client-side errors.
 */

import * as Sentry from '@sentry/nextjs'

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN

// Only initialize Sentry if DSN is configured
if (SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,

    // Environment
    environment: process.env.NODE_ENV || 'development',

    // Release tracking
    release: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA,

    // Performance Monitoring
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

    // Session Replay
    replaysSessionSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 0, // 10% of sessions in production, disabled in dev
    replaysOnErrorSampleRate: process.env.NODE_ENV === 'production' ? 1.0 : 0, // 100% of error sessions in production

    // Integration configuration
    integrations: [
      Sentry.replayIntegration({
        // Mask all text and input content for privacy
        maskAllText: true,
        blockAllMedia: true,
      }),
    ],

    // Filter out known noise
    ignoreErrors: [
      // Browser extensions
      'top.GLOBALS',
      'chrome-extension://',
      'moz-extension://',
      // Network errors
      'NetworkError',
      'Failed to fetch',
      // User cancellations
      'AbortError',
      'The user aborted a request',
    ],

    // Breadcrumb filtering
    beforeBreadcrumb(breadcrumb) {
      // Don't log console breadcrumbs in production
      if (breadcrumb.category === 'console' && process.env.NODE_ENV === 'production') {
        return null
      }
      return breadcrumb
    },

    // Event filtering and enrichment
    beforeSend(event, hint) {
      // Don't send events in development
      if (process.env.NODE_ENV === 'development') {
        console.error('Sentry Event (dev):', event, hint)
        return null
      }

      // Add user context if available
      const error = hint.originalException
      if (error && typeof error === 'object' && 'user' in error) {
        event.user = {
          id: (error as any).user?.id,
          email: (error as any).user?.email,
        }
      }

      return event
    },
  })
}

export default Sentry
