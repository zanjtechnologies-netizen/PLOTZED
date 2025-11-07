# Error Monitoring Setup Guide

This guide shows how to integrate error monitoring services with your Next.js application.

## Table of Contents

1. [Sentry Integration (Recommended)](#sentry-integration)
2. [LogRocket Integration](#logrocket-integration)
3. [Custom Monitoring Setup](#custom-monitoring-setup)
4. [Environment Setup](#environment-setup)

---

## Sentry Integration (Recommended)

Sentry provides excellent error tracking, performance monitoring, and user session replay.

### Step 1: Install Sentry

```bash
npm install --save @sentry/nextjs
```

### Step 2: Initialize Sentry

```bash
npx @sentry/wizard@latest -i nextjs
```

This creates:
- `sentry.client.config.ts` - Client-side configuration
- `sentry.server.config.ts` - Server-side configuration
- `sentry.edge.config.ts` - Edge runtime configuration
- `next.config.js` updates - Automatic source map upload

### Step 3: Configure Sentry

#### sentry.client.config.ts
```typescript
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Performance Monitoring
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

  // Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,

  // Environment
  environment: process.env.NODE_ENV,

  // Ignore certain errors
  ignoreErrors: [
    'ResizeObserver loop limit exceeded',
    'Non-Error promise rejection captured',
  ],

  // Before send hook
  beforeSend(event, hint) {
    // Filter out development errors
    if (process.env.NODE_ENV === 'development') {
      return null
    }

    // Add user context
    if (event.user) {
      event.user = {
        id: event.user.id,
        // Don't send PII like email unless necessary
      }
    }

    return event
  },

  // Integrations
  integrations: [
    new Sentry.BrowserTracing({
      tracePropagationTargets: ['localhost', 'https://plotzed.com'],
    }),
    new Sentry.Replay({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],
})
```

#### sentry.server.config.ts
```typescript
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.SENTRY_DSN,

  // Performance Monitoring
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

  // Environment
  environment: process.env.NODE_ENV,

  // Debug mode in development
  debug: process.env.NODE_ENV === 'development',

  // Before send hook
  beforeSend(event, hint) {
    if (process.env.NODE_ENV === 'development') {
      return null
    }
    return event
  },
})
```

### Step 4: Update Error Handler with Sentry

```typescript
// src/lib/sentry-logger.ts
import * as Sentry from '@sentry/nextjs'

export function logToSentry(error: Error, context?: Record<string, any>) {
  Sentry.withScope((scope) => {
    // Add context
    if (context) {
      Object.entries(context).forEach(([key, value]) => {
        scope.setContext(key, value)
      })
    }

    // Add tags for filtering
    if (context?.type) {
      scope.setTag('error_type', context.type)
    }

    // Capture exception
    Sentry.captureException(error)
  })
}

export function logEventToSentry(message: string, level: Sentry.SeverityLevel = 'info', context?: Record<string, any>) {
  Sentry.withScope((scope) => {
    if (context) {
      Object.entries(context).forEach(([key, value]) => {
        scope.setContext(key, value)
      })
    }

    Sentry.captureMessage(message, level)
  })
}
```

### Step 5: Integrate with Error Handler

```typescript
// Update src/lib/structured-logger.ts
import { logToSentry } from './sentry-logger'

export function logError(params: {
  error: Error
  context?: LogContext
  level?: 'error' | 'critical'
}): void {
  const { error, context, level = 'error' } = params

  // Log to structured logger
  if (level === 'critical') {
    structuredLogger.critical(error.message, error, context)
  } else {
    structuredLogger.error(error.message, error, context)
  }

  // Also log to Sentry in production
  if (process.env.NODE_ENV === 'production') {
    logToSentry(error, context)
  }
}
```

### Step 6: Add User Context

```typescript
// In your auth callback or middleware
import * as Sentry from '@sentry/nextjs'

export async function middleware(request: NextRequest) {
  const session = await auth()

  if (session?.user) {
    Sentry.setUser({
      id: session.user.id,
      email: session.user.email,
      username: session.user.name,
    })
  }

  return NextResponse.next()
}
```

### Step 7: Manual Error Capture

```typescript
// In your API routes or components
import * as Sentry from '@sentry/nextjs'

try {
  // Your code
} catch (error) {
  Sentry.captureException(error, {
    tags: {
      section: 'payment',
      action: 'create_order',
    },
    extra: {
      orderId: order.id,
      amount: amount,
    },
  })

  throw error // Re-throw for normal error handling
}
```

### Step 8: Performance Monitoring

```typescript
// Track custom transactions
import * as Sentry from '@sentry/nextjs'

export const GET = async (request: NextRequest) => {
  const transaction = Sentry.startTransaction({
    op: 'api.request',
    name: 'GET /api/plots',
  })

  try {
    // Your API logic
    const plots = await prisma.plot.findMany()

    transaction.setStatus('ok')
    return NextResponse.json({ data: plots })
  } catch (error) {
    transaction.setStatus('internal_error')
    throw error
  } finally {
    transaction.finish()
  }
}
```

### Environment Variables

```env
# .env.local
NEXT_PUBLIC_SENTRY_DSN=https://xxxxx@xxxxx.ingest.sentry.io/xxxxx
SENTRY_DSN=https://xxxxx@xxxxx.ingest.sentry.io/xxxxx
SENTRY_ORG=your-org
SENTRY_PROJECT=plotzed-webapp
SENTRY_AUTH_TOKEN=your-auth-token
```

---

## LogRocket Integration

LogRocket provides session replay and error tracking.

### Step 1: Install LogRocket

```bash
npm install --save logrocket logrocket-react
```

### Step 2: Initialize LogRocket

```typescript
// src/lib/logrocket.ts
import LogRocket from 'logrocket'

export function initLogRocket() {
  if (process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_LOGROCKET_APP_ID) {
    LogRocket.init(process.env.NEXT_PUBLIC_LOGROCKET_APP_ID, {
      // Privacy settings
      dom: {
        textSanitizer: true,
        inputSanitizer: true,
      },

      // Network settings
      network: {
        requestSanitizer: (request) => {
          // Hide sensitive headers
          if (request.headers?.Authorization) {
            request.headers.Authorization = 'REDACTED'
          }
          return request
        },
      },

      // Console settings
      console: {
        shouldAggregateConsoleErrors: true,
      },
    })
  }
}

export function identifyUser(user: { id: string; email: string; name: string }) {
  if (process.env.NODE_ENV === 'production') {
    LogRocket.identify(user.id, {
      name: user.name,
      email: user.email,
    })
  }
}

export function logEvent(name: string, properties?: Record<string, any>) {
  if (process.env.NODE_ENV === 'production') {
    LogRocket.track(name, properties)
  }
}
```

### Step 3: Initialize in App

```typescript
// src/app/layout.tsx
'use client'

import { useEffect } from 'react'
import { initLogRocket } from '@/lib/logrocket'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initLogRocket()
  }, [])

  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
```

### Step 4: Integrate with Sentry

```typescript
// src/lib/logrocket.ts
import LogRocket from 'logrocket'
import setupLogRocketReact from 'logrocket-react'
import * as Sentry from '@sentry/nextjs'

export function initLogRocket() {
  if (process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_LOGROCKET_APP_ID) {
    LogRocket.init(process.env.NEXT_PUBLIC_LOGROCKET_APP_ID)
    setupLogRocketReact(LogRocket)

    // Integrate with Sentry
    LogRocket.getSessionURL((sessionURL) => {
      Sentry.setContext('LogRocket', { sessionURL })
    })
  }
}
```

---

## Custom Monitoring Setup

If you want to build a custom monitoring solution:

### Step 1: Create Monitoring Service

```typescript
// src/lib/custom-monitoring.ts
interface ErrorReport {
  error: {
    name: string
    message: string
    stack?: string
  }
  context?: Record<string, any>
  timestamp: string
  environment: string
  url?: string
  userAgent?: string
  userId?: string
}

export async function reportError(error: Error, context?: Record<string, any>) {
  if (process.env.NODE_ENV !== 'production') {
    return
  }

  const report: ErrorReport = {
    error: {
      name: error.name,
      message: error.message,
      stack: error.stack,
    },
    context,
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'unknown',
    url: typeof window !== 'undefined' ? window.location.href : undefined,
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
  }

  try {
    await fetch('/api/monitoring/errors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(report),
    })
  } catch (err) {
    console.error('Failed to report error:', err)
  }
}
```

### Step 2: Create Error Collection Endpoint

```typescript
// src/app/api/monitoring/errors/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const errorReport = await request.json()

    // Store in database
    await prisma.activityLog.create({
      data: {
        action: 'ERROR_REPORTED',
        entity_type: 'error',
        metadata: errorReport,
      },
    })

    // Send alert for critical errors
    if (errorReport.error.name === 'CriticalError') {
      await sendAlert(errorReport)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to log error:', error)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}

async function sendAlert(errorReport: any) {
  // Send email/SMS/Slack notification
  await sendEmail({
    to: process.env.ADMIN_EMAIL!,
    subject: '🚨 Critical Error Detected',
    html: `
      <h2>Critical Error</h2>
      <p><strong>Message:</strong> ${errorReport.error.message}</p>
      <p><strong>Time:</strong> ${errorReport.timestamp}</p>
      <pre>${errorReport.error.stack}</pre>
    `,
  })
}
```

---

## Environment Setup

### Development
```env
# .env.local (development)
NODE_ENV=development

# Disable external monitoring in development
# NEXT_PUBLIC_SENTRY_DSN=
# NEXT_PUBLIC_LOGROCKET_APP_ID=
```

### Production
```env
# .env.production
NODE_ENV=production

# Sentry
NEXT_PUBLIC_SENTRY_DSN=https://xxxxx@xxxxx.ingest.sentry.io/xxxxx
SENTRY_DSN=https://xxxxx@xxxxx.ingest.sentry.io/xxxxx
SENTRY_ORG=your-org
SENTRY_PROJECT=plotzed-webapp
SENTRY_AUTH_TOKEN=your-auth-token

# LogRocket (optional)
NEXT_PUBLIC_LOGROCKET_APP_ID=xxxxx/plotzed

# Custom monitoring endpoint (optional)
LOGGING_ENDPOINT=https://your-logging-service.com/api/logs
```

---

## Testing Error Monitoring

### Test in Development

```typescript
// Test error capture
function TestErrorComponent() {
  const handleTestError = () => {
    try {
      throw new Error('Test error from client')
    } catch (error) {
      console.error('Caught error:', error)
      Sentry.captureException(error)
    }
  }

  return (
    <button onClick={handleTestError}>
      Test Error Reporting
    </button>
  )
}
```

### Test in API Routes

```typescript
// src/app/api/test-error/route.ts
import * as Sentry from '@sentry/nextjs'

export async function GET() {
  // Test error
  const error = new Error('Test API error')

  Sentry.captureException(error, {
    tags: {
      test: true,
    },
  })

  throw error
}
```

---

## Monitoring Dashboard

Once configured, you'll have access to:

### Sentry Dashboard
- Error frequency and trends
- Stack traces with source maps
- User impact analysis
- Performance metrics
- Session replays
- Release tracking

### LogRocket Dashboard
- Session replays
- Console logs
- Network requests
- Redux/state logs
- Performance metrics
- Heatmaps

---

## Best Practices

1. **Always set user context** for better debugging
2. **Use tags and breadcrumbs** for filtering
3. **Sanitize sensitive data** before sending
4. **Set up alerts** for critical errors
5. **Monitor error rates** and set thresholds
6. **Review errors weekly** and fix high-impact issues
7. **Use source maps** for readable stack traces
8. **Set sample rates** appropriately to control costs
9. **Don't log in development** to avoid noise
10. **Create error budgets** and SLOs

---

## Costs

### Sentry
- Free tier: 5,000 errors/month
- Team plan: $26/month (50,000 errors)
- Business plan: $80/month (1M errors)

### LogRocket
- Free tier: 1,000 sessions/month
- Professional: $99/month (10,000 sessions)
- Enterprise: Custom pricing

### Custom Solution
- Database storage costs
- Email/SMS notification costs
- Server costs for log aggregation

---

## Summary

✅ **Sentry** - Best for error tracking and performance
✅ **LogRocket** - Best for session replay and user debugging
✅ **Custom** - Best for full control and privacy

Choose based on your needs and budget. For most applications, **Sentry** is the recommended choice due to its comprehensive features and Next.js integration.

For maximum visibility, use **Sentry + LogRocket** together!
