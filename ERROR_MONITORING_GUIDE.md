# 🔍 Error Monitoring Guide

Complete guide for error tracking and monitoring with Sentry in Plotzed.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Quick Start](#quick-start)
- [Architecture](#architecture)
- [Configuration](#configuration)
- [Error Tracking Features](#error-tracking-features)
- [Usage Examples](#usage-examples)
- [Dashboard & Monitoring](#dashboard--monitoring)
- [Source Maps](#source-maps)
- [Troubleshooting](#troubleshooting)
- [Best Practices](#best-practices)

---

## 🎯 Overview

### Why Error Monitoring?

**Without Monitoring:**
```
Error occurs → User sees error → User leaves → You never know why
```

**With Sentry:**
```
Error occurs → Captured with context → Alerted immediately → Fix before it affects more users
```

### Benefits

✅ **Real-time Error Tracking:** Know about errors instantly
✅ **Full Context:** See user actions, environment, and stack traces
✅ **Performance Monitoring:** Track slow API calls and page loads
✅ **Session Replay:** Watch exactly what the user did before the error
✅ **Release Tracking:** Track errors by deployment version
✅ **Source Maps:** Debug production errors with original code

### What's Monitored?

- **Client-Side Errors** (React component crashes, JavaScript errors)
- **Server-Side Errors** (API failures, database errors, unhandled exceptions)
- **Middleware Errors** (Authentication failures, rate limiting issues)
- **Performance Issues** (Slow database queries, API timeouts)
- **Security Events** (Suspicious requests, failed authentication attempts)

---

## 🚀 Quick Start

### 1. Create Sentry Account

**Get Free Sentry Account:**
1. Go to https://sentry.io
2. Sign up (free tier: 5,000 errors/month)
3. Create a new project
4. Select "Next.js" as framework
5. Copy your DSN (Data Source Name)

### 2. Configure Environment Variables

Add to `.env.local`:

```env
# Sentry Error Tracking
SENTRY_DSN="https://your-key@o123456.ingest.sentry.io/123456"
NEXT_PUBLIC_SENTRY_DSN="https://your-key@o123456.ingest.sentry.io/123456"
```

**Both variables can use the same DSN.**

### 3. Test Error Tracking

**Client-side test:**
```bash
# Visit this URL in your browser
http://localhost:3000/api/test-sentry

# Or add this to any React component
throw new Error('Test error - please ignore')
```

**Server-side test:**
```bash
# Call any API with invalid data
curl -X POST http://localhost:3000/api/plots \
  -H "Content-Type: application/json" \
  -d '{"invalid": "data"}'
```

**Check Sentry Dashboard:**
1. Go to https://sentry.io
2. Open your project
3. Check "Issues" tab
4. You should see your test errors

---

## 🏗️ Architecture

### Error Flow Diagram

```
┌─────────────────────────────────────────────┐
│         Client-Side Error                   │
│   (React component crash, JS error)         │
└────────────────┬────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────┐
│      Error Boundary Catches Error           │
│      (src/components/error-boundary.tsx)    │
└────────────────┬────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────┐
│      Sentry.captureException()              │
│      + User context + Breadcrumbs           │
└────────────────┬────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────┐
│         Sentry Dashboard                     │
│   - Stack trace                              │
│   - User actions (breadcrumbs)               │
│   - Session replay (if enabled)              │
│   - Environment data                         │
└──────────────────────────────────────────────┘
```

### File Structure

```
plotzed-webapp/
├── sentry.client.config.ts          # Client-side Sentry config
├── sentry.server.config.ts          # Server-side Sentry config
├── instrumentation.ts                # Next.js instrumentation
├── src/
│   ├── components/
│   │   └── error-boundary.tsx       # React error boundary
│   ├── middleware.ts                 # Middleware error tracking
│   └── lib/
│       └── api-error-handler.ts     # API error tracking
└── ERROR_MONITORING_GUIDE.md        # This file
```

---

## ⚙️ Configuration

### Environment Variables

```env
# Required for error tracking
SENTRY_DSN="https://key@o123456.ingest.sentry.io/123456"
NEXT_PUBLIC_SENTRY_DSN="https://key@o123456.ingest.sentry.io/123456"

# Optional - for release tracking
NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA="abc123"  # Auto-set on Vercel
VERCEL_GIT_COMMIT_SHA="abc123"              # Auto-set on Vercel
```

### Sentry Configuration Options

**Client Config** ([sentry.client.config.ts](sentry.client.config.ts)):
```typescript
Sentry.init({
  dsn: SENTRY_DSN,
  environment: 'production',           // development, staging, production
  release: 'v1.0.0',                   // Track errors by version
  tracesSampleRate: 0.1,               // 10% of transactions (performance)
  replaysSessionSampleRate: 0.1,       // 10% of sessions recorded
  replaysOnErrorSampleRate: 1.0,       // 100% of error sessions recorded
})
```

**Server Config** ([sentry.server.config.ts](sentry.server.config.ts)):
```typescript
Sentry.init({
  dsn: SENTRY_DSN,
  environment: 'production',
  tracesSampleRate: 0.1,               // 10% of API calls tracked
  integrations: [
    Sentry.prismaIntegration(),        // Track database queries
    Sentry.httpIntegration(),          // Track HTTP requests
  ],
})
```

### Sampling Rates Explained

| Environment | Traces | Session Replay | Why |
|-------------|--------|----------------|-----|
| Development | 100% | 100% | Full tracking for debugging |
| Production | 10% | 10% (normal), 100% (errors) | Balance cost and coverage |

**Cost Consideration:**
- Free tier: 5,000 errors/month, 10,000 performance events/month
- Sampling at 10% means you can handle 100,000 requests/month within limits

---

## 🚨 Error Tracking Features

### 1. Automatic Error Capture

**Client-Side:**
- Unhandled JavaScript errors
- Unhandled promise rejections
- React component errors (via Error Boundary)

**Server-Side:**
- API route errors (5xx errors)
- Database errors (Prisma)
- Unhandled exceptions
- Request errors (via instrumentation)

**Middleware:**
- Authentication failures
- Rate limit violations
- Suspicious request patterns
- General middleware crashes

### 2. Context Enrichment

Every error includes:
- **User Info:** ID, email, role (if authenticated)
- **Request Info:** URL, method, headers, IP address
- **Environment:** Node version, OS, runtime
- **Breadcrumbs:** User actions leading to error
- **Tags:** Error type, API context, route path

**Example Error Context:**
```json
{
  "error": "Cannot read property 'id' of undefined",
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "role": "USER"
  },
  "request": {
    "url": "/api/plots/123",
    "method": "GET",
    "ip": "192.168.1.1"
  },
  "tags": {
    "errorType": "TypeError",
    "apiContext": "GET /api/plots/:id"
  },
  "breadcrumbs": [
    "User clicked 'View Plot'",
    "Fetching plot data",
    "Database query failed"
  ]
}
```

### 3. Session Replay

**What is it?**
Session Replay records user interactions (clicks, scrolls, inputs) before an error occurs.

**Privacy:**
- All text is masked by default
- Media (images, videos) blocked
- Sensitive fields automatically hidden

**When Recorded:**
- 100% of sessions with errors
- 10% of normal sessions (configurable)

**How to View:**
1. Open error in Sentry dashboard
2. Click "Replay" tab
3. Watch video of user session

### 4. Performance Monitoring

**What's Tracked:**
- API response times
- Database query performance
- Page load times
- Component render times

**Example Performance Data:**
```
GET /api/plots
├─ Duration: 450ms
├─ Database Query: 380ms ⚠️ SLOW
├─ Redis Cache: 5ms ✅
└─ Response Serialization: 65ms
```

### 5. Breadcrumbs

**Breadcrumbs** track user actions before an error:

```
1. [Navigation] User visited /dashboard
2. [Click] Clicked "View My Bookings"
3. [HTTP] GET /api/bookings/user/123 (200 OK)
4. [Click] Clicked "Cancel Booking"
5. [HTTP] DELETE /api/bookings/456 (500 Error) ❌
```

---

## 📖 Usage Examples

### Manual Error Capture

**Capture Exception:**
```typescript
import * as Sentry from '@sentry/react'

try {
  // Risky operation
  await processPayment(paymentData)
} catch (error) {
  Sentry.captureException(error, {
    tags: {
      payment_provider: 'razorpay',
      amount: paymentData.amount,
    },
    contexts: {
      payment: {
        orderId: paymentData.orderId,
        userId: user.id,
      },
    },
    level: 'error',
  })
  throw error // Re-throw if needed
}
```

**Capture Message:**
```typescript
Sentry.captureMessage('Payment processed successfully', {
  level: 'info',
  tags: {
    payment_id: payment.id,
  },
})
```

**Set User Context:**
```typescript
Sentry.setUser({
  id: user.id,
  email: user.email,
  username: user.name,
  role: user.role,
})
```

**Add Breadcrumb:**
```typescript
Sentry.addBreadcrumb({
  category: 'payment',
  message: 'User initiated payment',
  level: 'info',
  data: {
    amount: 5000,
    currency: 'INR',
  },
})
```

### Using Error Boundary

**In React Components:**
```tsx
import { SentryErrorBoundary } from '@/components/error-boundary'

export default function MyPage() {
  return (
    <SentryErrorBoundary>
      <MyComponent />
    </SentryErrorBoundary>
  )
}
```

**Custom Fallback UI:**
```tsx
import ErrorBoundary from '@/components/error-boundary'

<ErrorBoundary
  fallback={
    <div className="error-container">
      <h1>Oops! Something went wrong</h1>
      <button onClick={() => window.location.reload()}>
        Reload Page
      </button>
    </div>
  }
>
  <MyComponent />
</ErrorBoundary>
```

### API Error Handling

**Errors are automatically captured in API routes:**
```typescript
import { withErrorHandling } from '@/lib/api-error-handler'

export const GET = withErrorHandling(
  async (request: NextRequest) => {
    // Any error here is automatically:
    // 1. Logged
    // 2. Sent to Sentry (if 5xx)
    // 3. Formatted as JSON response
    const plot = await prisma.plot.findUnique({
      where: { id: 'non-existent' } // This will trigger Sentry
    })

    return successResponse(plot)
  },
  'GET /api/plots/:id'  // Context shown in Sentry
)
```

---

## 📊 Dashboard & Monitoring

### Sentry Dashboard Overview

**Main Sections:**

1. **Issues**
   - List of all errors
   - Grouped by error type
   - Shows frequency and affected users

2. **Performance**
   - API endpoint performance
   - Database query times
   - Slow transactions

3. **Releases**
   - Errors by deployment version
   - Track regressions
   - Compare releases

4. **Alerts**
   - Email/Slack notifications
   - Custom alert rules
   - Spike detection

### Setting Up Alerts

**Email Alerts:**
1. Go to Settings → Alerts
2. Click "Create Alert Rule"
3. Configure:
   ```
   When: Error count > 10 in 1 hour
   Then: Send email to team@plotzed.com
   ```

**Slack Integration:**
1. Settings → Integrations → Slack
2. Connect workspace
3. Choose channel (#errors)
4. Configure alert rules

### Key Metrics to Monitor

| Metric | Good | Warning | Critical |
|--------|------|---------|----------|
| Error Rate | < 0.1% | 0.1-1% | > 1% |
| Response Time (API) | < 200ms | 200-500ms | > 500ms |
| Database Queries | < 100ms | 100-300ms | > 300ms |
| Unhandled Errors | 0 | 1-5/day | > 5/day |

---

## 🗺️ Source Maps

Source maps let you debug production errors with your original TypeScript code instead of minified JavaScript.

### What Are Source Maps?

**Without Source Maps:**
```javascript
// Production error
at e.r (main-abc123.js:1:2345)
at n (chunk-xyz789.js:5:678)
```

**With Source Maps:**
```typescript
// Original code location
at PlotList.fetchPlots (src/components/PlotList.tsx:42:10)
at handleClick (src/app/dashboard/page.tsx:18:5)
```

### Automatic Upload (Vercel)

If deploying to Vercel, source maps are automatically uploaded when you:

1. Install Sentry Vercel integration:
   ```bash
   npm install @sentry/nextjs
   npx @sentry/wizard@latest -i nextjs
   ```

2. Configure `next.config.js`:
   ```javascript
   const { withSentryConfig } = require('@sentry/nextjs')

   module.exports = withSentryConfig(
     {
       // Your Next.js config
     },
     {
       silent: true,
       org: 'your-org',
       project: 'plotzed',
     }
   )
   ```

3. Add to `.env.local`:
   ```env
   SENTRY_AUTH_TOKEN="your-auth-token"
   ```

### Manual Upload

**Create Auth Token:**
1. Go to Sentry → Settings → Auth Tokens
2. Create new token with "project:releases" scope
3. Copy token

**Upload Script:**
```bash
# Install CLI
npm install -g @sentry/cli

# Login
sentry-cli login

# Upload source maps
sentry-cli releases files <VERSION> upload-sourcemaps ./out --url-prefix '~/_next'
```

**In package.json:**
```json
{
  "scripts": {
    "build": "next build",
    "sentry:upload": "sentry-cli releases files $npm_package_version upload-sourcemaps ./out"
  }
}
```

---

## 🐛 Troubleshooting

### Errors Not Appearing in Sentry

**Check:**
```bash
# 1. Verify DSN is set
echo $SENTRY_DSN
echo $NEXT_PUBLIC_SENTRY_DSN

# 2. Check Sentry is initialized
curl http://localhost:3000/api/health

# 3. Test with sample error
curl -X POST http://localhost:3000/api/test-error

# 4. Check browser console
# Should see: "[Sentry] Sending event: ..."
```

**Common Issues:**
- ❌ DSN not set → Add to `.env.local`
- ❌ Wrong DSN → Copy from Sentry dashboard
- ❌ Ad blocker → Whitelist sentry.io
- ❌ Network error → Check firewall

### Too Many Errors

**Symptom:** Hitting Sentry quota limits

**Solutions:**

**1. Increase Sample Rate:**
```typescript
// Reduce from 100% to 10%
tracesSampleRate: 0.1,
replaysSessionSampleRate: 0.1,
```

**2. Filter Noisy Errors:**
```typescript
// In sentry.client.config.ts
Sentry.init({
  ignoreErrors: [
    'ResizeObserver loop limit exceeded',
    'Non-Error promise rejection',
    // Add more patterns
  ],
})
```

**3. Use beforeSend Hook:**
```typescript
Sentry.init({
  beforeSend(event, hint) {
    // Filter out specific errors
    if (event.exception?.values?.[0]?.type === 'ChunkLoadError') {
      return null // Don't send
    }
    return event
  },
})
```

### Source Maps Not Working

**Check:**
```bash
# 1. Verify source maps are generated
ls -la .next/static/chunks/*.map

# 2. Check upload
sentry-cli releases files list <VERSION>

# 3. Verify in Sentry
# Open error → Should see original TypeScript code
```

**Fix:**
```javascript
// next.config.js
module.exports = {
  productionBrowserSourceMaps: true,  // Enable source maps
}
```

### Performance Overhead

**Symptom:** App feels slower with Sentry

**Optimize:**

**1. Reduce Sampling:**
```typescript
tracesSampleRate: 0.05,  // From 10% to 5%
```

**2. Disable Session Replay:**
```typescript
replaysSessionSampleRate: 0,      // Disable normal sessions
replaysOnErrorSampleRate: 1.0,    // Keep error sessions
```

**3. Use Lazy Loading:**
```typescript
// Load Sentry only in production
if (process.env.NODE_ENV === 'production') {
  import('./sentry.client.config')
}
```

---

## ✅ Best Practices

### 1. Error Context

**Good:**
```typescript
Sentry.captureException(error, {
  tags: {
    feature: 'booking',
    action: 'cancel',
  },
  contexts: {
    booking: {
      id: booking.id,
      plotId: booking.plotId,
      status: booking.status,
    },
  },
})
```

**Bad:**
```typescript
Sentry.captureException(error)  // ❌ No context
```

### 2. User Privacy

**Do:**
```typescript
Sentry.setUser({
  id: user.id,              // ✅ Hash or ID
  email: user.email,        // ✅ If needed
})
```

**Don't:**
```typescript
Sentry.setUser({
  password: user.password,  // ❌ NEVER
  phone: user.phone,        // ❌ PII
  address: user.address,    // ❌ Sensitive
})
```

### 3. Environment Separation

**Development:**
```typescript
environment: 'development',
tracesSampleRate: 1.0,         // Track everything
replaysSessionSampleRate: 1.0,
```

**Production:**
```typescript
environment: 'production',
tracesSampleRate: 0.1,         // Sample 10%
replaysSessionSampleRate: 0.1,
```

### 4. Error Grouping

**Use consistent error messages:**
```typescript
// ✅ Good - Groups together
throw new Error(`Plot not found: ${plotId}`)

// ❌ Bad - Creates separate issues
throw new Error(`Could not find plot with ID ${plotId} in database`)
```

### 5. Alert Fatigue

**Set meaningful thresholds:**
```
✅ Alert: > 50 errors/hour (real issue)
❌ Alert: > 1 error/hour (too noisy)
```

### 6. Regular Review

**Weekly:**
- Review top 10 errors
- Check performance regressions
- Update ignore patterns

**Monthly:**
- Review alert rules
- Check quota usage
- Analyze trends

---

## 📈 Monitoring Checklist

### Initial Setup
- [ ] Create Sentry account
- [ ] Add DSN to environment variables
- [ ] Test client-side error capture
- [ ] Test server-side error capture
- [ ] Verify errors appear in dashboard

### Configuration
- [ ] Set up email alerts
- [ ] Configure Slack integration (optional)
- [ ] Set appropriate sampling rates
- [ ] Configure ignore patterns for noisy errors
- [ ] Enable source maps upload

### Ongoing Maintenance
- [ ] Review errors weekly
- [ ] Update ignore patterns as needed
- [ ] Monitor quota usage
- [ ] Check alert rules
- [ ] Review performance metrics

### Production Readiness
- [ ] Source maps working
- [ ] Alerts configured
- [ ] Team has Sentry access
- [ ] Documentation shared
- [ ] Runbook created

---

## 📞 Support

### Sentry Documentation
- Official Docs: https://docs.sentry.io/platforms/javascript/guides/nextjs/
- Community: https://forum.sentry.io/

### Internal Support
- Check [troubleshooting](#troubleshooting) section
- Review Sentry dashboard logs
- Check application logs
- Test with sample errors

### Common Links
- Sentry Dashboard: https://sentry.io
- Issues: `https://sentry.io/organizations/your-org/issues/`
- Performance: `https://sentry.io/organizations/your-org/performance/`
- Releases: `https://sentry.io/organizations/your-org/releases/`

---

**Happy Monitoring! 🎉**

With proper error tracking, you'll catch issues before they affect users and maintain a stable, reliable application.
