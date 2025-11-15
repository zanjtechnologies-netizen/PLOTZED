// src/lib/errors.ts

/**
 * Base API Error class
 */
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code?: string,
    public details?: any
  ) {
    super(message);
    this.name = 'ApiError';
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

/**
 * Bad Request Error (400)
 */
export class BadRequestError extends ApiError {
  constructor(message: string = 'Bad Request', code?: string, details?: any) {
    super(400, message, code || 'BAD_REQUEST', details);
    this.name = 'BadRequestError';
  }
}

/**
 * Unauthorized Error (401)
 */
export class UnauthorizedError extends ApiError {
  constructor(message: string = 'Unauthorized', code?: string) {
    super(401, message, code || 'UNAUTHORIZED');
    this.name = 'UnauthorizedError';
  }
}

/**
 * Forbidden Error (403)
 */
export class ForbiddenError extends ApiError {
  constructor(message: string = 'Forbidden', code?: string) {
    super(403, message, code || 'FORBIDDEN');
    this.name = 'ForbiddenError';
  }
}

/**
 * Not Found Error (404)
 */
export class NotFoundError extends ApiError {
  constructor(message: string = 'Resource not found', code?: string) {
    super(404, message, code || 'NOT_FOUND');
    this.name = 'NotFoundError';
  }
}

/**
 * Conflict Error (409)
 */
export class ConflictError extends ApiError {
  constructor(message: string = 'Resource already exists', code?: string, details?: any) {
    super(409, message, code || 'CONFLICT', details);
    this.name = 'ConflictError';
  }
}

/**
 * Validation Error (422)
 */
export class ValidationError extends ApiError {
  constructor(
    message: string = 'Validation failed',
    public errors: Record<string, string[]> = {}
  ) {
    super(422, message, 'VALIDATION_ERROR', errors);
    this.name = 'ValidationError';
  }
}

/**
 * Internal Server Error (500)
 */
export class InternalServerError extends ApiError {
  constructor(message: string = 'Internal server error', code?: string) {
    super(500, message, code || 'INTERNAL_ERROR');
    this.name = 'InternalServerError';
  }
}

/**
 * Service Unavailable Error (503)
 */
export class ServiceUnavailableError extends ApiError {
  constructor(message: string = 'Service temporarily unavailable', code?: string) {
    super(503, message, code || 'SERVICE_UNAVAILABLE');
    this.name = 'ServiceUnavailableError';
  }
}

/**
 * Rate Limit Error (429)
 */
export class RateLimitError extends ApiError {
  constructor(
    message: string = 'Too many requests',
    public retryAfter?: number
  ) {
    super(429, message, 'RATE_LIMIT_EXCEEDED', { retryAfter });
    this.name = 'RateLimitError';
  }
}

/**
 * Payment Error
 */
export class PaymentError extends ApiError {
  constructor(message: string, code?: string, details?: any) {
    super(402, message, code || 'PAYMENT_ERROR', details);
    this.name = 'PaymentError';
  }
}

/**
 * Database Error
 */
export class DatabaseError extends ApiError {
  constructor(message: string = 'Database operation failed', code?: string) {
    super(500, message, code || 'DATABASE_ERROR');
    this.name = 'DatabaseError';
  }
}

/**
 * External Service Error
 */
export class ExternalServiceError extends ApiError {
  constructor(
    public service: string,
    message: string = 'External service error',
    code?: string
  ) {
    super(502, message, code || 'EXTERNAL_SERVICE_ERROR', { service });
    this.name = 'ExternalServiceError';
  }
}
