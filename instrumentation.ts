// ================================================
// instrumentation.ts - Next.js Instrumentation
// ================================================

/**
 * Next.js instrumentation hook
 *
 * This file is automatically called by Next.js during application startup
 * and is used to initialize monitoring, tracing, and error tracking tools.
 *
 * @see https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation
 */

export async function register() {
  // Only run on server
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Initialize Sentry for server-side error tracking
    await import('./sentry.server.config')
  }

  // Only run on edge runtime
  if (process.env.NEXT_RUNTIME === 'edge') {
    // Initialize Sentry for edge runtime
    await import('./sentry.server.config')
  }
}

export async function onRequestError(
  err: Error,
  request: {
    path: string
    method: string
    headers: Headers
  },
  context: {
    routerKind: 'Pages Router' | 'App Router'
    routePath: string
    routeType: 'render' | 'route' | 'action' | 'middleware'
  }
) {
  // This function is called when an error occurs during a request
  // It's automatically integrated with Sentry if configured

  // Log error details for debugging
  console.error('Request error:', {
    error: err.message,
    path: request.path,
    method: request.method,
    router: context.routerKind,
    routePath: context.routePath,
    routeType: context.routeType,
  })

  // The error is automatically sent to Sentry if configured
  // No need to manually call Sentry.captureException here
}
