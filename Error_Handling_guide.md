# Error Handling Implementation Guide

## 📚 Overview

This error handling system provides comprehensive error management for the Plotzed Next.js application, including:
- Structured logging
- Type-safe custom errors
- Standardized API error responses
- Global error boundaries
- Client-side error handling

---

## 🚀 Quick Start

### 1. API Routes

**Basic Usage:**
```typescript
import { handleApiError, successResponse } from '@/lib/api-error-handler';
import { NotFoundError, ValidationError } from '@/lib/errors';
import { logger } from '@/lib/logger';

export async function GET(request: Request) {
  try {
    logger.apiRequest('GET', '/api/example');
    
    const data = await fetchData();
    
    if (!data) {
      throw new NotFoundError('Data not found');
    }
    
    return successResponse(data);
  } catch (error) {
    return handleApiError(error, 'GET /api/example');
  }
}
```

**With Validation:**
```typescript
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate
    const errors: Record<string, string[]> = {};
    if (!body.email) errors.email = ['Email is required'];
    if (!body.name) errors.name = ['Name is required'];
    
    if (Object.keys(errors).length > 0) {
      throw new ValidationError('Validation failed', errors);
    }
    
    const result = await createUser(body);
    
    return createdResponse(result);
  } catch (error) {
    return handleApiError(error);
  }
}
```

---

### 2. Client-Side Components

**Using Error Handler Hook:**
```typescript
'use client';

import { useErrorHandler } from '@/hooks/useErrorHandler';
import { Toast } from '@/components/ui/Toast';

export function MyComponent() {
  const { errorMessage, clearError, withErrorHandler } = useErrorHandler();
  
  const fetchData = withErrorHandler(async () => {
    const response = await fetch('/api/data');
    if (!response.ok) throw new Error('Failed to fetch data');
    return response.json();
  });
  
  return (
    <div>
      {errorMessage && (
        <Toast
          message={errorMessage}
          type="error"
          onClose={clearError}
        />
      )}
      <button onClick={fetchData}>Load Data</button>
    </div>
  );
}
```

**Using Error Boundary:**
```typescript
import { ErrorBoundary } from '@/components/ErrorBoundary';

export function Page() {
  return (
    <ErrorBoundary>
      <ComponentThatMightError />
    </ErrorBoundary>
  );
}
```

---

### 3. Logging

**Replace all console.log with logger:**

```typescript
import { logger } from '@/lib/logger';

// ❌ OLD
console.log('User created', user);
console.error('Error:', error);

// ✅ NEW
logger.info('User created', { userId: user.id, email: user.email });
logger.error('Failed to create user', error, { email: user.email });
```

**Log Levels:**
```typescript
logger.info('Informational message');
logger.warn('Warning message');
logger.error('Error occurred', error);
logger.debug('Debug info (dev only)');

// Specialized logging
logger.apiRequest('POST', '/api/users');
logger.apiResponse('POST', '/api/users', 201, 150);
logger.dbQuery('CREATE', 'User', { email: 'user@example.com' });
```

---

## 🎯 Error Types Reference

### Client Errors (4xx)

```typescript
// 400 Bad Request
throw new BadRequestError('Invalid data provided');

// 401 Unauthorized
throw new UnauthorizedError('Please log in to continue');

// 403 Forbidden
throw new ForbiddenError('You do not have permission');

// 404 Not Found
throw new NotFoundError('Resource not found');

// 409 Conflict
throw new ConflictError('Email already exists');

// 422 Validation Error
throw new ValidationError('Validation failed', {
  email: ['Email is required', 'Email must be valid'],
  password: ['Password must be at least 8 characters'],
});

// 429 Rate Limit
throw new RateLimitError('Too many requests', 60);
```

### Server Errors (5xx)

```typescript
// 500 Internal Server Error
throw new InternalServerError('Something went wrong');

// 502 External Service Error
throw new ExternalServiceError('Razorpay', 'Payment gateway unavailable');

// 503 Service Unavailable
throw new ServiceUnavailableError('Database is down');
```

### Domain-Specific Errors

```typescript
// Payment Error (402)
throw new PaymentError('Payment declined', 'CARD_DECLINED');

// Database Error (500)
throw new DatabaseError('Failed to save data', 'DB_TIMEOUT');
```

---

## 📋 Migration Checklist

Replace all existing error handling with the new system:

### API Routes
```markdown
□ Import error handlers and logger
□ Wrap all routes in try-catch
□ Replace console.log with logger calls
□ Throw appropriate custom errors
□ Use successResponse/createdResponse helpers
□ Remove generic error messages
□ Add context to handleApiError
```

### Example Migration:

**Before:**
```typescript
export async function GET() {
  console.log('Getting plots');
  
  const plots = await prisma.plot.findMany();
  
  if (!plots) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  
  return NextResponse.json(plots);
}
```

**After:**
```typescript
export async function GET() {
  try {
    logger.apiRequest('GET', '/api/plots');
    
    const plots = await prisma.plot.findMany();
    
    if (!plots || plots.length === 0) {
      throw new NotFoundError('No plots found');
    }
    
    logger.apiResponse('GET', '/api/plots', 200);
    return successResponse(plots);
  } catch (error) {
    return handleApiError(error, 'GET /api/plots');
  }
}
```

---

## 🔍 Testing Error Handling

### Test API Errors

```bash
# Test 404
curl http://localhost:3000/api/plots/invalid-id

# Expected Response:
{
  "success": false,
  "error": "Plot with ID invalid-id not found",
  "code": "NOT_FOUND",
  "timestamp": "2024-11-06T..."
}

# Test Validation Error
curl -X POST http://localhost:3000/api/plots \
  -H "Content-Type: application/json" \
  -d '{}'

# Expected Response:
{
  "success": false,
  "error": "Validation failed",
  "code": "VALIDATION_ERROR",
  "details": {
    "title": ["Title is required"],
    "location": ["Location is required"]
  },
  "timestamp": "2024-11-06T..."
}
```

### Test UI Error Boundaries

```typescript
// Create a component that throws error
function ErrorComponent() {
  throw new Error('Test error');
}

// Wrap in error boundary
<ErrorBoundary>
  <ErrorComponent />
</ErrorBoundary>

// Should display error UI instead of crashing
```

---

## 🎨 Response Format Standards

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional success message",
  "timestamp": "2024-11-06T12:00:00.000Z"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Human-readable error message",
  "code": "ERROR_CODE",
  "details": { ... }, // Optional, for validation errors
  "timestamp": "2024-11-06T12:00:00.000Z"
}
```

---

## 🚨 Common Patterns

### Pattern 1: Database Not Found
```typescript
const user = await prisma.user.findUnique({ where: { id } });
if (!user) {
  throw new NotFoundError(`User with ID ${id} not found`);
}
```

### Pattern 2: Authorization Check
```typescript
if (plot.userId !== session.user.id && session.user.role !== 'ADMIN') {
  throw new ForbiddenError('You do not have permission to edit this plot');
}
```

### Pattern 3: Validation
```typescript
const errors: Record<string, string[]> = {};

if (!email) errors.email = ['Email is required'];
if (email && !isValidEmail(email)) errors.email = ['Email is invalid'];

if (Object.keys(errors).length > 0) {
  throw new ValidationError('Validation failed', errors);
}
```

### Pattern 4: External API Call
```typescript
try {
  const response = await fetch('https://external-api.com/data');
  if (!response.ok) {
    throw new ExternalServiceError(
      'ExternalAPI',
      'Failed to fetch data from external service'
    );
  }
} catch (error) {
  if (error instanceof ExternalServiceError) throw error;
  throw new ExternalServiceError('ExternalAPI', 'API request failed');
}
```

---

## 🔗 Related Files

- `/src/lib/logger.ts` - Logging utility
- `/src/lib/errors.ts` - Custom error classes
- `/src/lib/api-error-handler.ts` - API error handling
- `/src/app/error.tsx` - Global error page
- `/src/app/not-found.tsx` - 404 page
- `/src/components/ErrorBoundary.tsx` - React error boundary
- `/src/hooks/useErrorHandler.ts` - Client-side error hook
- `/src/components/ui/Toast.tsx` - Toast notifications

---

## 📊 Next Steps

1. ✅ Copy all files to your project
2. ✅ Update existing API routes to use new error handling
3. ✅ Replace console.log with logger calls
4. ✅ Add error boundaries to key components
5. ✅ Test error scenarios
6. ⏰ Later: Integrate with Sentry or similar monitoring service

---

## 🆘 Need Help?

If you encounter issues:
1. Check the console for detailed error logs
2. Verify imports are correct
3. Ensure Prisma client is properly initialized
4. Check that error messages are helpful for debugging

**Common Issues:**
- TypeScript errors: Make sure @types are installed
- Logger not working: Check if logger is imported correctly
- API errors not caught: Ensure try-catch wraps all async code