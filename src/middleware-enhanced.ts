// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { securityConfig, isOriginAllowed, getRateLimitConfig } from '@/lib/security-config';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Initialize Redis for rate limiting (if Upstash is configured)
let ratelimit: Ratelimit | null = null;

if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });

  ratelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(100, '15 m'),
    analytics: true,
    prefix: 'plotzed-ratelimit',
  });
}

/**
 * Apply CORS headers to response
 */
function applyCorsHeaders(request: NextRequest, response: NextResponse): NextResponse {
  const origin = request.headers.get('origin');

  // Check if origin is allowed
  if (origin && isOriginAllowed(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin);
  } else if (process.env.NODE_ENV === 'development') {
    // In development, allow all origins
    response.headers.set('Access-Control-Allow-Origin', '*');
  }

  // Set CORS headers
  response.headers.set(
    'Access-Control-Allow-Methods',
    securityConfig.cors.allowedMethods.join(', ')
  );
  
  response.headers.set(
    'Access-Control-Allow-Headers',
    securityConfig.cors.allowedHeaders.join(', ')
  );

  response.headers.set(
    'Access-Control-Expose-Headers',
    securityConfig.cors.exposedHeaders.join(', ')
  );

  if (securityConfig.cors.credentials) {
    response.headers.set('Access-Control-Allow-Credentials', 'true');
  }

  response.headers.set(
    'Access-Control-Max-Age',
    String(securityConfig.cors.maxAge)
  );

  return response;
}

/**
 * Apply security headers to response
 */
function applySecurityHeaders(response: NextResponse): NextResponse {
  // Apply all security headers
  Object.entries(securityConfig.headers).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  // Apply Content Security Policy
  const cspArray = Object.entries(securityConfig.contentSecurityPolicy).map(
    ([key, values]) => `${key} ${Array.isArray(values) ? values.join(' ') : values}`
  );
  response.headers.set('Content-Security-Policy', cspArray.join('; '));

  return response;
}

/**
 * Check rate limit
 */
async function checkRateLimit(request: NextRequest): Promise<{
  success: boolean;
  limit?: number;
  remaining?: number;
  reset?: number;
}> {
  if (!ratelimit) {
    // Rate limiting not configured, allow request
    return { success: true };
  }

  try {
    // Get identifier (IP address or user ID from session)
    const identifier =
      (request as any).ip ??
      request.headers.get('x-forwarded-for') ??
      request.headers.get('x-real-ip') ??
      'anonymous';

    // Check rate limit
    const result = await ratelimit.limit(identifier);

    return {
      success: result.success,
      limit: result.limit,
      remaining: result.remaining,
      reset: result.reset,
    };
  } catch (error) {
    console.error('Rate limit check failed:', error);
    // On error, allow request (fail open)
    return { success: true };
  }
}

/**
 * Validate API key if required
 */
function validateApiKey(request: NextRequest): boolean {
  if (!securityConfig.apiKeys.enabled) {
    return true; // API key not required
  }

  const apiKey = request.headers.get(securityConfig.apiKeys.headerName);
  
  if (!apiKey) {
    return false;
  }

  return securityConfig.apiKeys.keys.includes(apiKey);
}

/**
 * Main middleware function
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Create base response
  let response = NextResponse.next();

  // Handle preflight OPTIONS requests
  if (request.method === 'OPTIONS') {
    response = new NextResponse(null, { status: 204 });
    response = applyCorsHeaders(request, response);
    return response;
  }

  // Apply CORS headers to all API routes
  if (pathname.startsWith('/api')) {
    response = applyCorsHeaders(request, response);

    // Validate API key for protected endpoints (if enabled)
    if (securityConfig.apiKeys.enabled && !pathname.startsWith('/api/auth')) {
      if (!validateApiKey(request)) {
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid or missing API key',
            code: 'INVALID_API_KEY',
          },
          { status: 401 }
        );
      }
    }

    // Apply rate limiting to API routes
    const rateLimitResult = await checkRateLimit(request);
    
    if (!rateLimitResult.success) {
      const retryAfter = rateLimitResult.reset
        ? Math.ceil((rateLimitResult.reset - Date.now()) / 1000)
        : 60;

      response = NextResponse.json(
        {
          success: false,
          error: 'Too many requests. Please try again later.',
          code: 'RATE_LIMIT_EXCEEDED',
          retryAfter,
        },
        { status: 429 }
      );

      response.headers.set('Retry-After', String(retryAfter));
      response.headers.set('X-RateLimit-Limit', String(rateLimitResult.limit || 0));
      response.headers.set('X-RateLimit-Remaining', String(rateLimitResult.remaining || 0));
      response.headers.set('X-RateLimit-Reset', String(rateLimitResult.reset || 0));

      return applyCorsHeaders(request, response);
    }

    // Add rate limit headers to successful responses
    if (rateLimitResult.limit !== undefined) {
      response.headers.set('X-RateLimit-Limit', String(rateLimitResult.limit));
      response.headers.set('X-RateLimit-Remaining', String(rateLimitResult.remaining || 0));
      response.headers.set('X-RateLimit-Reset', String(rateLimitResult.reset || 0));
    }
  }

  // Apply security headers to all responses
  response = applySecurityHeaders(response);

  // Add request ID for tracing
  const requestId = crypto.randomUUID();
  response.headers.set('X-Request-Id', requestId);

  return response;
}

// Configure which paths the middleware runs on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico (favicon file)
     * - public files (public directory)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
