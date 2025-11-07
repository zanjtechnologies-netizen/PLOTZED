# API Error Handling Examples

This guide shows how to use the centralized error handling system in your API routes.

## Table of Contents

1. [Basic Error Handling](#basic-error-handling)
2. [Using Error Handler Wrapper](#using-error-handler-wrapper)
3. [Custom Error Classes](#custom-error-classes)
4. [Validation Errors](#validation-errors)
5. [Database Errors](#database-errors)
6. [Authentication Errors](#authentication-errors)
7. [External Service Errors](#external-service-errors)

---

## Basic Error Handling

### Before (Manual Error Handling)

```typescript
// ❌ Old way - repetitive error handling
export async function GET(request: NextRequest) {
  try {
    const data = await prisma.plot.findMany()
    return NextResponse.json({ data })
  } catch (error) {
    console.error('Error fetching plots:', error)
    return NextResponse.json(
      { error: 'Failed to fetch plots' },
      { status: 500 }
    )
  }
}
```

### After (Centralized Error Handling)

```typescript
// ✅ New way - automatic error handling
import { withErrorHandling, successResponse } from '@/lib/api-error-handler'
import { NotFoundError } from '@/lib/errors'

export const GET = withErrorHandling(
  async (request: NextRequest) => {
    const data = await prisma.plot.findMany()
    return successResponse(data)
  },
  'GET /api/plots' // context for logging
)
```

---

## Using Error Handler Wrapper

### Example 1: Simple GET Endpoint

```typescript
// src/app/api/plots/route.ts
import { NextRequest } from 'next/server'
import { withErrorHandling, successResponse } from '@/lib/api-error-handler'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const querySchema = z.object({
  page: z.string().transform(Number).pipe(z.number().min(1)).default('1'),
  limit: z.string().transform(Number).pipe(z.number().min(1).max(100)).default('10'),
  city: z.string().optional(),
  status: z.enum(['AVAILABLE', 'BOOKED', 'SOLD']).optional(),
})

export const GET = withErrorHandling(
  async (request: NextRequest) => {
    const { searchParams } = new URL(request.url)

    // Validation happens automatically - Zod errors are caught
    const { page, limit, city, status } = querySchema.parse({
      page: searchParams.get('page'),
      limit: searchParams.get('limit'),
      city: searchParams.get('city'),
      status: searchParams.get('status'),
    })

    const skip = (page - 1) * limit

    const [plots, total] = await Promise.all([
      prisma.plot.findMany({
        where: {
          ...(city && { city }),
          ...(status && { status }),
        },
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
      }),
      prisma.plot.count({
        where: {
          ...(city && { city }),
          ...(status && { status }),
        },
      }),
    ])

    return successResponse({
      plots,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  },
  'GET /api/plots'
)
```

### Example 2: POST Endpoint with Validation

```typescript
// src/app/api/inquiries/route.ts
import { NextRequest } from 'next/server'
import {
  withErrorHandling,
  createdResponse,
  assertAuthenticated
} from '@/lib/api-error-handler'
import { UnauthorizedError } from '@/lib/errors'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { inquirySchema } from '@/lib/validators'

export const POST = withErrorHandling(
  async (request: NextRequest) => {
    // Get session
    const session = await auth()
    assertAuthenticated(session?.user, 'You must be logged in to submit an inquiry')

    // Parse and validate request body
    const body = await request.json()
    const validatedData = inquirySchema.parse(body)

    // Create inquiry
    const inquiry = await prisma.inquiry.create({
      data: {
        ...validatedData,
        user_id: session.user.id,
        status: 'NEW',
      },
    })

    // Send notification email (errors are caught by wrapper)
    await sendEmail({
      to: process.env.ADMIN_EMAIL!,
      subject: 'New Inquiry Received',
      html: emailTemplates.adminNewInquiry(/*...*/),
    })

    return createdResponse(inquiry, 'Inquiry submitted successfully')
  },
  'POST /api/inquiries'
)
```

### Example 3: Dynamic Route with Not Found Error

```typescript
// src/app/api/plots/[id]/route.ts
import { NextRequest } from 'next/server'
import { withErrorHandling, successResponse } from '@/lib/api-error-handler'
import { NotFoundError } from '@/lib/errors'
import { prisma } from '@/lib/prisma'

export const GET = withErrorHandling(
  async (
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
  ) => {
    const { id } = await params

    const plot = await prisma.plot.findUnique({
      where: { id },
      include: {
        bookings: {
          select: {
            id: true,
            status: true,
            created_at: true,
          },
        },
      },
    })

    // Throw custom error if not found
    if (!plot) {
      throw new NotFoundError('Plot not found')
    }

    return successResponse(plot)
  },
  'GET /api/plots/[id]'
)
```

---

## Custom Error Classes

### Example: Forbidden Access

```typescript
import { ForbiddenError, assertAuthorized } from '@/lib/errors'

export const DELETE = withErrorHandling(
  async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const session = await auth()
    assertAuthenticated(session?.user)

    const { id } = await params
    const booking = await prisma.booking.findUnique({
      where: { id },
    })

    if (!booking) {
      throw new NotFoundError('Booking not found')
    }

    // Check authorization
    const isOwner = booking.user_id === session.user.id
    const isAdmin = session.user.role === 'ADMIN'

    assertAuthorized(
      isOwner || isAdmin,
      'You do not have permission to delete this booking'
    )

    await prisma.booking.delete({ where: { id } })

    return noContentResponse()
  },
  'DELETE /api/bookings/[id]'
)
```

### Example: Conflict Error

```typescript
import { ConflictError } from '@/lib/errors'

export const POST = withErrorHandling(
  async (request: NextRequest) => {
    const body = await request.json()
    const { email } = registerSchema.parse(body)

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      throw new ConflictError('User with this email already exists')
    }

    // Create user...
    const user = await prisma.user.create({
      data: { /* ... */ },
    })

    return createdResponse(user)
  },
  'POST /api/auth/register'
)
```

---

## Validation Errors

Validation errors are automatically handled when using Zod:

```typescript
import { z } from 'zod'

const createPlotSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  price: z.number().positive('Price must be positive'),
  plot_size: z.number().positive('Plot size must be positive'),
  city: z.string().min(2, 'City is required'),
  address: z.string().min(10, 'Address must be at least 10 characters'),
})

export const POST = withErrorHandling(
  async (request: NextRequest) => {
    const body = await request.json()

    // If validation fails, a ValidationError is automatically thrown
    // and caught by withErrorHandling
    const validatedData = createPlotSchema.parse(body)

    const plot = await prisma.plot.create({
      data: validatedData,
    })

    return createdResponse(plot)
  },
  'POST /api/plots'
)
```

**Error Response:**
```json
{
  "success": false,
  "error": "Validation failed",
  "code": "VALIDATION_ERROR",
  "details": {
    "title": ["Title must be at least 3 characters"],
    "price": ["Price must be positive"]
  },
  "timestamp": "2025-01-15T10:30:00.000Z"
}
```

---

## Database Errors

Database errors are automatically converted to user-friendly messages:

```typescript
export const POST = withErrorHandling(
  async (request: NextRequest) => {
    const body = await request.json()
    const { email, phone } = body

    // If email/phone already exists (P2002: unique constraint violation)
    // it's automatically caught and returned as:
    // {
    //   "error": "A record with this email already exists",
    //   "code": "DUPLICATE_ENTRY",
    //   "details": { "field": "email" }
    // }

    const user = await prisma.user.create({
      data: {
        email,
        phone,
        name: body.name,
        password_hash: await bcrypt.hash(body.password, 12),
      },
    })

    return createdResponse(user)
  },
  'POST /api/users'
)
```

**Handled Prisma Errors:**
- `P2002` → 409 Conflict: Duplicate entry
- `P2025` → 404 Not Found: Record not found
- `P2003` → 400 Bad Request: Foreign key constraint
- `P2014` → 400 Bad Request: Invalid ID
- `P2024` → 503 Service Unavailable: Connection timeout

---

## Authentication Errors

```typescript
import { UnauthorizedError, ForbiddenError } from '@/lib/errors'
import { auth } from '@/lib/auth'

export const POST = withErrorHandling(
  async (request: NextRequest) => {
    const session = await auth()

    // Throw UnauthorizedError if not logged in
    if (!session?.user) {
      throw new UnauthorizedError('You must be logged in')
    }

    // Throw ForbiddenError if not admin
    if (session.user.role !== 'ADMIN') {
      throw new ForbiddenError('Admin access required')
    }

    // Protected logic here...
    return successResponse({ message: 'Admin action completed' })
  },
  'POST /api/admin/action'
)
```

**Helper Functions:**

```typescript
import { assertAuthenticated, assertAuthorized } from '@/lib/api-error-handler'

export const POST = withErrorHandling(
  async (request: NextRequest) => {
    const session = await auth()

    // Throws UnauthorizedError if session is null
    assertAuthenticated(session?.user)

    // Throws ForbiddenError if condition is false
    assertAuthorized(
      session.user.role === 'ADMIN',
      'Only admins can perform this action'
    )

    // Continue with logic...
  },
  'POST /api/admin/action'
)
```

---

## External Service Errors

```typescript
import { ExternalServiceError } from '@/lib/errors'
import { structuredLogger } from '@/lib/structured-logger'

export const POST = withErrorHandling(
  async (request: NextRequest) => {
    const body = await request.json()

    try {
      // Call Razorpay API
      const razorpay = getRazorpay()
      const order = await razorpay.orders.create({
        amount: body.amount * 100,
        currency: 'INR',
      })

      return successResponse({ orderId: order.id })
    } catch (error) {
      // Log the error
      structuredLogger.logExternalService(
        'Razorpay',
        'create_order',
        false,
        undefined,
        error as Error
      )

      // Throw custom error
      throw new ExternalServiceError(
        'Razorpay',
        'Failed to create payment order. Please try again.'
      )
    }
  },
  'POST /api/payments/create-order'
)
```

---

## Complete Real-World Example

Here's a complete example showing multiple error handling scenarios:

```typescript
// src/app/api/bookings/route.ts
import { NextRequest } from 'next/server'
import { z } from 'zod'
import {
  withErrorHandling,
  createdResponse,
  assertAuthenticated,
} from '@/lib/api-error-handler'
import {
  NotFoundError,
  ConflictError,
  BadRequestError,
} from '@/lib/errors'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { sendEmail, emailTemplates } from '@/lib/email'
import { structuredLogger } from '@/lib/structured-logger'

const createBookingSchema = z.object({
  plot_id: z.string().uuid('Invalid plot ID'),
  booking_amount: z.number().positive('Booking amount must be positive'),
  total_amount: z.number().positive('Total amount must be positive'),
})

export const POST = withErrorHandling(
  async (request: NextRequest) => {
    // 1. Authentication
    const session = await auth()
    assertAuthenticated(session?.user, 'Please login to create a booking')

    // 2. Validation
    const body = await request.json()
    const { plot_id, booking_amount, total_amount } = createBookingSchema.parse(body)

    // 3. Check plot exists and is available
    const plot = await prisma.plot.findUnique({
      where: { id: plot_id },
    })

    if (!plot) {
      throw new NotFoundError('Plot not found')
    }

    if (plot.status !== 'AVAILABLE') {
      throw new ConflictError(`This plot is ${plot.status.toLowerCase()} and cannot be booked`)
    }

    // 4. Validate booking amount
    const expectedBookingAmount = plot.booking_amount.toNumber()
    if (booking_amount < expectedBookingAmount) {
      throw new BadRequestError(
        `Minimum booking amount is ₹${expectedBookingAmount}`
      )
    }

    // 5. Create booking in transaction
    const booking = await prisma.$transaction(async (tx) => {
      // Create booking
      const newBooking = await tx.booking.create({
        data: {
          user_id: session.user.id,
          plot_id,
          booking_amount,
          total_amount,
          status: 'PENDING',
        },
        include: {
          plot: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      })

      // Update plot status
      await tx.plot.update({
        where: { id: plot_id },
        data: { status: 'BOOKED' },
      })

      return newBooking
    })

    // 6. Send confirmation email (non-blocking)
    sendEmail({
      to: booking.user.email,
      subject: 'Booking Confirmation - Plotzed Real Estate',
      html: emailTemplates.bookingConfirmation({
        customerName: booking.user.name,
        propertyName: booking.plot.title,
        bookingId: booking.id,
        amount: booking_amount,
        date: new Date().toLocaleDateString(),
      }),
    }).catch((error) => {
      // Log email error but don't fail the request
      structuredLogger.error('Failed to send booking confirmation email', error)
    })

    // 7. Log successful booking
    structuredLogger.info('Booking created', {
      bookingId: booking.id,
      userId: session.user.id,
      plotId: plot_id,
      amount: booking_amount,
    })

    // 8. Return success response
    return createdResponse(booking, 'Booking created successfully')
  },
  'POST /api/bookings'
)
```

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "user_id": "uuid",
    "plot_id": "uuid",
    "booking_amount": 100000,
    "total_amount": 500000,
    "status": "PENDING",
    "created_at": "2025-01-15T10:30:00.000Z",
    "plot": { /* ... */ },
    "user": { /* ... */ }
  },
  "message": "Booking created successfully",
  "timestamp": "2025-01-15T10:30:00.000Z"
}
```

**Error Response Examples:**

Validation Error (400):
```json
{
  "success": false,
  "error": "Validation failed",
  "code": "VALIDATION_ERROR",
  "details": {
    "plot_id": ["Invalid plot ID"],
    "booking_amount": ["Booking amount must be positive"]
  },
  "timestamp": "2025-01-15T10:30:00.000Z"
}
```

Not Found Error (404):
```json
{
  "success": false,
  "error": "Plot not found",
  "code": "NOT_FOUND",
  "timestamp": "2025-01-15T10:30:00.000Z"
}
```

Conflict Error (409):
```json
{
  "success": false,
  "error": "This plot is booked and cannot be booked",
  "code": "CONFLICT",
  "timestamp": "2025-01-15T10:30:00.000Z"
}
```

---

## Migration Guide

### Step 1: Update Existing Routes

Replace manual error handling with the wrapper:

```diff
- export async function GET(request: NextRequest) {
+ export const GET = withErrorHandling(
+   async (request: NextRequest) => {
-   try {
      const data = await prisma.plot.findMany()
-     return NextResponse.json({ data })
+     return successResponse(data)
-   } catch (error) {
-     console.error('Error:', error)
-     return NextResponse.json({ error: 'Failed' }, { status: 500 })
-   }
- }
+   },
+   'GET /api/plots'
+ )
```

### Step 2: Replace console.log with Structured Logger

```diff
- console.log('Creating booking for user:', userId)
+ structuredLogger.info('Creating booking', { userId })
```

### Step 3: Use Custom Error Classes

```diff
- if (!user) {
-   return NextResponse.json({ error: 'Not found' }, { status: 404 })
- }
+ if (!user) {
+   throw new NotFoundError('User not found')
+ }
```

---

## Best Practices

1. **Always use withErrorHandling wrapper** for API routes
2. **Use custom error classes** instead of manual status codes
3. **Validate input with Zod** at the start of handlers
4. **Log important events** with structured logger
5. **Don't expose internal errors** in production (handled automatically)
6. **Use transactions** for multi-step database operations
7. **Handle external service errors** with try-catch and custom errors
8. **Add context** to error handler wrapper for better debugging

---

## Testing Error Handling

```typescript
// Example test
describe('POST /api/bookings', () => {
  it('should return 401 when not authenticated', async () => {
    const response = await fetch('/api/bookings', {
      method: 'POST',
      body: JSON.stringify({ plot_id: 'test' }),
    })

    expect(response.status).toBe(401)
    const data = await response.json()
    expect(data.success).toBe(false)
    expect(data.code).toBe('UNAUTHORIZED')
  })

  it('should return 404 when plot not found', async () => {
    // ... test code
  })

  it('should return 422 when validation fails', async () => {
    // ... test code
  })
})
```

---

## Summary

✅ **Centralized** - All errors handled in one place
✅ **Consistent** - Same response format across all APIs
✅ **Type-safe** - Custom error classes with TypeScript
✅ **Logged** - All errors automatically logged
✅ **Secure** - Internal errors hidden in production
✅ **Developer-friendly** - Detailed errors in development
✅ **User-friendly** - Clear error messages for clients

Your API routes are now production-ready with comprehensive error handling!
