# Complete Error Handling Implementation Guide

## 🎯 Overview

This guide documents the complete error handling system implemented for the Plotzed Real Estate application.

**Status:** ✅ Production Ready

---

## 📦 What's Included

### 1. Error Classes (`src/lib/errors.ts`)
- ✅ ApiError (Base class)
- ✅ BadRequestError (400)
- ✅ UnauthorizedError (401)
- ✅ ForbiddenError (403)
- ✅ NotFoundError (404)
- ✅ ConflictError (409)
- ✅ ValidationError (422)
- ✅ RateLimitError (429)
- ✅ InternalServerError (500)
- ✅ DatabaseError (500)
- ✅ ExternalServiceError (502)
- ✅ ServiceUnavailableError (503)
- ✅ PaymentError (402)

### 2. Error Handler (`src/lib/api-error-handler.ts`)
- ✅ handleApiError() - Main error handler
- ✅ withErrorHandling() - Route wrapper
- ✅ successResponse() - Success helper
- ✅ createdResponse() - 201 helper
- ✅ noContentResponse() - 204 helper
- ✅ Prisma error conversion
- ✅ Zod validation error handling
- ✅ Custom error handling

### 3. Structured Logger (`src/lib/structured-logger.ts`)
- ✅ JSON-formatted logs
- ✅ Log levels (debug, info, warn, error, critical)
- ✅ Context support
- ✅ Specialized logging methods:
  - logApiRequest()
  - logApiResponse()
  - logDatabaseQuery()
  - logSecurityEvent()
  - logPayment()
  - logExternalService()

### 4. Global Error Boundary (`src/app/error.tsx`)
- ✅ Client-side error catching
- ✅ User-friendly error UI
- ✅ Development error details
- ✅ Error logging
- ✅ Recovery options

### 5. Documentation
- ✅ [EXAMPLE_API_WITH_ERROR_HANDLING.md](EXAMPLE_API_WITH_ERROR_HANDLING.md) - Complete usage examples
- ✅ [ERROR_MONITORING_SETUP.md](ERROR_MONITORING_SETUP.md) - Sentry/LogRocket integration
- ✅ [ERROR_HANDLING_COMPLETE_GUIDE.md](ERROR_HANDLING_COMPLETE_GUIDE.md) - This file

---

## 🚀 Quick Start

### For New API Routes

```typescript
import { withErrorHandling, successResponse } from '@/lib/api-error-handler'
import { NotFoundError } from '@/lib/errors'
import { prisma } from '@/lib/prisma'

export const GET = withErrorHandling(
  async (request: NextRequest) => {
    const data = await prisma.plot.findMany()

    if (!data.length) {
      throw new NotFoundError('No plots found')
    }

    return successResponse(data)
  },
  'GET /api/plots'
)
```

### For Existing API Routes

1. Import the handler:
   ```typescript
   import { withErrorHandling, successResponse } from '@/lib/api-error-handler'
   ```

2. Wrap your handler:
   ```typescript
   export const GET = withErrorHandling(
     async (request) => {
       // Your existing code
     },
     'GET /api/your-route'
   )
   ```

3. Replace `NextResponse.json()` with helpers:
   ```typescript
   // Before
   return NextResponse.json({ data }, { status: 200 })

   // After
   return successResponse(data)
   ```

4. Replace manual error responses with error classes:
   ```typescript
   // Before
   if (!user) {
     return NextResponse.json({ error: 'Not found' }, { status: 404 })
   }

   // After
   if (!user) {
     throw new NotFoundError('User not found')
   }
   ```

---

## 📊 Error Response Format

All API errors follow this consistent format:

```json
{
  "success": false,
  "error": "Human-readable error message",
  "code": "ERROR_CODE",
  "details": {}, // Optional: validation errors, etc.
  "timestamp": "2025-01-15T10:30:00.000Z"
}
```

**Success Response Format:**

```json
{
  "success": true,
  "data": {}, // Your response data
  "message": "Optional success message",
  "timestamp": "2025-01-15T10:30:00.000Z"
}
```

---

## 🔧 Error Handling Features

### 1. Automatic Error Detection

The system automatically handles:

- **Zod Validation Errors** → 400 with field-level details
- **Prisma Database Errors** → User-friendly messages
  - P2002 (Unique constraint) → 409 Conflict
  - P2025 (Not found) → 404 Not Found
  - P2003 (Foreign key) → 400 Bad Request
  - P2024 (Timeout) → 503 Service Unavailable
- **JWT/Auth Errors** → 401 Unauthorized
- **Network/Fetch Errors** → 503 Service Unavailable
- **Type Errors** → 400 Bad Request
- **Syntax Errors** → 400 Invalid JSON

### 2. Context-Aware Logging

Every error is logged with:
- Error message and stack trace
- API route context
- Request URL
- User ID (if authenticated)
- Timestamp
- Environment (dev/prod)

### 3. Security Features

- ✅ Internal error details hidden in production
- ✅ Stack traces only in development
- ✅ Sensitive data redaction
- ✅ Rate limit information in headers
- ✅ Error ID for tracking

### 4. Developer Experience

- ✅ Type-safe error classes
- ✅ Auto-completion in IDEs
- ✅ Detailed error messages in development
- ✅ Clear stack traces
- ✅ Consistent API across routes

---

## 📝 Usage Examples

### Example 1: Simple GET with Not Found

```typescript
import { withErrorHandling, successResponse } from '@/lib/api-error-handler'
import { NotFoundError } from '@/lib/errors'

export const GET = withErrorHandling(
  async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params

    const plot = await prisma.plot.findUnique({ where: { id } })

    if (!plot) {
      throw new NotFoundError('Plot not found')
    }

    return successResponse(plot)
  },
  'GET /api/plots/[id]'
)
```

### Example 2: POST with Validation

```typescript
import { z } from 'zod'
import { withErrorHandling, createdResponse } from '@/lib/api-error-handler'

const createSchema = z.object({
  title: z.string().min(3),
  price: z.number().positive(),
})

export const POST = withErrorHandling(
  async (request: NextRequest) => {
    const body = await request.json()

    // Validation errors are automatically caught and formatted
    const validated = createSchema.parse(body)

    const plot = await prisma.plot.create({
      data: validated,
    })

    return createdResponse(plot, 'Plot created successfully')
  },
  'POST /api/plots'
)
```

### Example 3: Authentication & Authorization

```typescript
import { withErrorHandling } from '@/lib/api-error-handler'
import { UnauthorizedError, ForbiddenError } from '@/lib/errors'

export const DELETE = withErrorHandling(
  async (request: NextRequest, { params }) => {
    const session = await auth()

    if (!session?.user) {
      throw new UnauthorizedError('Please login to continue')
    }

    if (session.user.role !== 'ADMIN') {
      throw new ForbiddenError('Admin access required')
    }

    // Admin logic here...
    return noContentResponse()
  },
  'DELETE /api/admin/plots/[id]'
)
```

### Example 4: Conflict Handling

```typescript
import { withErrorHandling } from '@/lib/api-error-handler'
import { ConflictError } from '@/lib/errors'

export const POST = withErrorHandling(
  async (request: NextRequest) => {
    const { email } = await request.json()

    const existing = await prisma.user.findUnique({
      where: { email },
    })

    if (existing) {
      throw new ConflictError('User with this email already exists')
    }

    // Create user...
  },
  'POST /api/auth/register'
)
```

### Example 5: External Service Error

```typescript
import { withErrorHandling } from '@/lib/api-error-handler'
import { ExternalServiceError } from '@/lib/errors'

export const POST = withErrorHandling(
  async (request: NextRequest) => {
    try {
      const razorpay = getRazorpay()
      const order = await razorpay.orders.create({/*...*/})

      return successResponse({ orderId: order.id })
    } catch (error) {
      throw new ExternalServiceError(
        'Razorpay',
        'Payment service is temporarily unavailable'
      )
    }
  },
  'POST /api/payments/create-order'
)
```

---

## 🔍 Error Codes Reference

| HTTP Status | Error Class | Code | When to Use |
|-------------|-------------|------|-------------|
| 400 | BadRequestError | BAD_REQUEST | Invalid input, malformed data |
| 401 | UnauthorizedError | UNAUTHORIZED | Not logged in, invalid credentials |
| 403 | ForbiddenError | FORBIDDEN | Logged in but insufficient permissions |
| 404 | NotFoundError | NOT_FOUND | Resource doesn't exist |
| 409 | ConflictError | CONFLICT | Duplicate entry, resource already exists |
| 422 | ValidationError | VALIDATION_ERROR | Input validation failed (Zod) |
| 429 | RateLimitError | RATE_LIMIT_EXCEEDED | Too many requests |
| 500 | DatabaseError | DATABASE_ERROR | Database operation failed |
| 500 | InternalServerError | INTERNAL_ERROR | Unknown server error |
| 502 | ExternalServiceError | EXTERNAL_SERVICE_ERROR | 3rd party API failed |
| 503 | ServiceUnavailableError | SERVICE_UNAVAILABLE | Service temporarily down |

---

## 🧪 Testing Error Handling

### Unit Tests

```typescript
import { describe, it, expect } from 'vitest'
import { NotFoundError, ValidationError } from '@/lib/errors'

describe('Error Classes', () => {
  it('should create NotFoundError with correct status', () => {
    const error = new NotFoundError('User not found')

    expect(error.statusCode).toBe(404)
    expect(error.code).toBe('NOT_FOUND')
    expect(error.message).toBe('User not found')
  })

  it('should create ValidationError with details', () => {
    const error = new ValidationError('Validation failed', {
      email: ['Invalid email format'],
      password: ['Too short'],
    })

    expect(error.statusCode).toBe(422)
    expect(error.details).toHaveProperty('email')
  })
})
```

### Integration Tests

```typescript
import { describe, it, expect } from 'vitest'
import request from 'supertest'

describe('GET /api/plots/[id]', () => {
  it('should return 404 for non-existent plot', async () => {
    const response = await request(baseURL)
      .get('/api/plots/non-existent-id')
      .expect(404)

    expect(response.body).toMatchObject({
      success: false,
      code: 'NOT_FOUND',
      error: expect.stringContaining('not found'),
    })
  })

  it('should return 422 for validation errors', async () => {
    const response = await request(baseURL)
      .post('/api/plots')
      .send({ title: 'AB' }) // Too short
      .expect(422)

    expect(response.body).toMatchObject({
      success: false,
      code: 'VALIDATION_ERROR',
      details: expect.objectContaining({
        title: expect.arrayContaining([expect.any(String)]),
      }),
    })
  })
})
```

---

## 📈 Monitoring & Alerts

### Sentry Integration

See [ERROR_MONITORING_SETUP.md](ERROR_MONITORING_SETUP.md) for detailed setup.

**Quick Setup:**

```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

### LogRocket Integration

```bash
npm install logrocket logrocket-react
```

### Custom Alerts

Set up alerts for:
- ✅ Error rate > 5% of requests
- ✅ 500 errors on payment endpoints
- ✅ Database connection failures
- ✅ External service timeouts
- ✅ Critical errors (logged as 'critical')

---

## 🎓 Best Practices

### DO ✅

1. **Use error classes instead of manual status codes**
   ```typescript
   // Good
   throw new NotFoundError('User not found')

   // Bad
   return NextResponse.json({ error: 'Not found' }, { status: 404 })
   ```

2. **Always use withErrorHandling wrapper**
   ```typescript
   export const GET = withErrorHandling(async (request) => {
     // Your code
   }, 'GET /api/route')
   ```

3. **Provide context in error messages**
   ```typescript
   throw new NotFoundError(`Plot with ID ${id} not found`)
   ```

4. **Use structured logging**
   ```typescript
   structuredLogger.error('Payment failed', error, { userId, amount })
   ```

5. **Validate input at the start**
   ```typescript
   const validated = schema.parse(body) // Zod validation
   ```

### DON'T ❌

1. **Don't catch errors just to re-throw**
   ```typescript
   // Bad
   try {
     await createUser()
   } catch (error) {
     throw error // Unnecessary
   }

   // Good - let the wrapper handle it
   await createUser()
   ```

2. **Don't expose internal details in production**
   ```typescript
   // Bad
   throw new Error(`SQL error: ${sqlDetails}`)

   // Good
   throw new DatabaseError('Failed to create user')
   ```

3. **Don't use console.log for errors**
   ```typescript
   // Bad
   console.log('Error:', error)

   // Good
   structuredLogger.error('Operation failed', error, context)
   ```

4. **Don't swallow errors silently**
   ```typescript
   // Bad
   try {
     await sendEmail()
   } catch (error) {
     // Silent failure
   }

   // Good
   try {
     await sendEmail()
   } catch (error) {
     structuredLogger.error('Email failed', error)
     // Continue or re-throw based on criticality
   }
   ```

---

## 🔄 Migration Checklist

For migrating existing API routes to the new error handling:

- [ ] Import `withErrorHandling` and response helpers
- [ ] Wrap route handler with `withErrorHandling()`
- [ ] Replace `NextResponse.json()` with helpers
- [ ] Replace manual status codes with error classes
- [ ] Replace `console.log` with `structuredLogger`
- [ ] Add Zod validation schemas
- [ ] Add route context to wrapper
- [ ] Test error scenarios
- [ ] Update API documentation

---

## 📚 Additional Resources

### Documentation Files
1. **[EXAMPLE_API_WITH_ERROR_HANDLING.md](EXAMPLE_API_WITH_ERROR_HANDLING.md)**
   - Complete examples for all error types
   - Migration guide
   - Testing examples

2. **[ERROR_MONITORING_SETUP.md](ERROR_MONITORING_SETUP.md)**
   - Sentry integration guide
   - LogRocket setup
   - Custom monitoring

3. **[API_DOCUMENTATION.md](API_DOCUMENTATION.md)**
   - Complete API reference
   - Request/response examples

### Code Files
1. **src/lib/errors.ts** - Error class definitions
2. **src/lib/api-error-handler.ts** - Main error handler
3. **src/lib/structured-logger.ts** - Logging utility
4. **src/app/error.tsx** - Global error boundary

---

## 🎯 Summary

### What You Get

✅ **Consistent** - Same error format across all APIs
✅ **Type-Safe** - TypeScript errors at compile time
✅ **Developer-Friendly** - Clear messages in development
✅ **Production-Ready** - Secure, logged, monitored
✅ **User-Friendly** - Helpful error messages for clients
✅ **Maintainable** - Centralized error handling logic
✅ **Testable** - Easy to test error scenarios
✅ **Monitored** - Integration with Sentry/LogRocket

### Checklist

- [x] Error classes defined
- [x] Error handler implemented
- [x] Structured logger created
- [x] Global error boundary added
- [x] Examples documented
- [x] Monitoring guide provided
- [x] Migration path defined
- [ ] Sentry integrated (optional)
- [ ] LogRocket integrated (optional)
- [ ] Existing routes migrated (in progress)

---

**Status:** ✅ **Production Ready**

All error handling infrastructure is in place and ready to use!

**Next Steps:**
1. Integrate Sentry for production monitoring (recommended)
2. Migrate existing API routes to use the new error handling
3. Set up error rate alerts
4. Monitor error trends in production

---

**Created:** 2025-11-04
**Last Updated:** 2025-11-04
**Version:** 1.0.0
