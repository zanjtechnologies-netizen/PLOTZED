// src/lib/api-error-handler.ts

import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { logger } from './logger';
import {
  ApiError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  ValidationError,
  InternalServerError,
  RateLimitError,
  DatabaseError,
} from './errors';
import * as Sentry from '@sentry/nextjs';

/**
 * Standard error response format
 */
interface ErrorResponse {
  success: false;
  error: string;
  code: string;
  details?: any;
  timestamp: string;
}

/**
 * Handle Prisma database errors
 */
function handlePrismaError(error: Prisma.PrismaClientKnownRequestError): ApiError {
  logger.error('Prisma error', error, { code: error.code });

  switch (error.code) {
    case 'P2000':
      return new BadRequestError(
        'The provided value is too long for the column',
        'VALUE_TOO_LONG'
      );
    
    case 'P2001':
      return new NotFoundError(
        'Record not found in the database',
        'RECORD_NOT_FOUND'
      );
    
    case 'P2002':
      // Unique constraint violation
      const target = (error.meta?.target as string[]) || [];
      const field = target[0] || 'field';
      return new ConflictError(
        `A record with this ${field} already exists`,
        'DUPLICATE_ENTRY',
        { field }
      );
    
    case 'P2003':
      return new BadRequestError(
        'Foreign key constraint failed',
        'FOREIGN_KEY_VIOLATION'
      );
    
    case 'P2025':
      return new NotFoundError(
        'Record to update/delete not found',
        'RECORD_NOT_FOUND'
      );
    
    case 'P2014':
      return new BadRequestError(
        'Invalid relation reference',
        'INVALID_RELATION'
      );
    
    case 'P2015':
      return new NotFoundError(
        'Related record not found',
        'RELATED_RECORD_NOT_FOUND'
      );
    
    default:
      return new DatabaseError(
        'Database operation failed',
        error.code
      );
  }
}

/**
 * Handle validation errors from Zod or similar
 */
function handleValidationError(error: any): ValidationError {
  if (error.errors && Array.isArray(error.errors)) {
    // Zod error format
    const validationErrors: Record<string, string[]> = {};
    
    error.errors.forEach((err: any) => {
      const path = err.path.join('.');
      if (!validationErrors[path]) {
        validationErrors[path] = [];
      }
      validationErrors[path].push(err.message);
    });
    
    return new ValidationError('Validation failed', validationErrors);
  }
  
  return new ValidationError(error.message || 'Validation failed');
}

/**
 * Main error handler for API routes
 */
export function handleApiError(error: unknown, context?: string): NextResponse<ErrorResponse> {
  // Log the error with context
  if (context) {
    logger.error(`Error in ${context}`, error);
  } else {
    logger.error('API Error', error);
  }

  let apiError: ApiError;

  // Handle known error types
  if (error instanceof ApiError) {
    apiError = error;
  } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
    apiError = handlePrismaError(error);
  } else if (error instanceof Prisma.PrismaClientValidationError) {
    apiError = new BadRequestError('Invalid data provided', 'VALIDATION_ERROR');
  } else if (error instanceof Prisma.PrismaClientInitializationError) {
    apiError = new DatabaseError('Database connection failed', 'DB_CONNECTION_ERROR');
  } else if ((error as any).name === 'ZodError') {
    apiError = handleValidationError(error);
  } else if (error instanceof SyntaxError) {
    apiError = new BadRequestError('Invalid JSON format', 'INVALID_JSON');
  } else if (error instanceof TypeError) {
    apiError = new BadRequestError('Invalid data type', 'TYPE_ERROR');
  } else {
    // Unknown error - treat as internal server error
    const message = error instanceof Error ? error.message : 'An unexpected error occurred';
    apiError = new InternalServerError(message);
  }

  // Report to Sentry for server errors (5xx) and unexpected errors
  if (
    apiError.statusCode >= 500 ||
    !(error instanceof ApiError)
  ) {
    Sentry.captureException(error, {
      contexts: {
        api: {
          context: context || 'unknown',
          errorCode: apiError.code,
          statusCode: apiError.statusCode,
        },
      },
      tags: {
        errorType: error instanceof Error ? error.constructor.name : 'UnknownError',
        apiContext: context || 'unknown',
      },
      level: apiError.statusCode >= 500 ? 'error' : 'warning',
    });
  }

  // Build error response
  const errorResponse: ErrorResponse = {
    success: false,
    error: apiError.message,
    code: apiError.code || 'UNKNOWN_ERROR',
    timestamp: new Date().toISOString(),
  };

  // Add details in development or for specific error types
  if (
    process.env.NODE_ENV === 'development' ||
    apiError instanceof ValidationError ||
    apiError.details
  ) {
    errorResponse.details = apiError.details;
  }

  // Add retry-after header for rate limit errors
  const headers: Record<string, string> = {};
  if (apiError instanceof RateLimitError && apiError.retryAfter) {
    headers['Retry-After'] = String(apiError.retryAfter);
  }

  return NextResponse.json(errorResponse, {
    status: apiError.statusCode,
    headers,
  });
}

/**
 * Async error handler wrapper for API routes
 */
export function withErrorHandling<T extends (...args: any[]) => Promise<NextResponse>>(
  handler: T,
  context?: string
): T {
  return (async (...args: any[]) => {
    try {
      return await handler(...args);
    } catch (error) {
      return handleApiError(error, context);
    }
  }) as T;
}

/**
 * Success response helper
 */
export function successResponse<T = any>(
  data: T,
  status: number = 200,
  message?: string
) {
  return NextResponse.json(
    {
      success: true,
      data,
      ...(message && { message }),
      timestamp: new Date().toISOString(),
    },
    { status }
  );
}

/**
 * Created response helper (201)
 */
export function createdResponse<T = any>(data: T, message?: string) {
  return successResponse(data, 201, message || 'Resource created successfully');
}

/**
 * No content response helper (204)
 */
export function noContentResponse() {
  return new NextResponse(null, { status: 204 });
}