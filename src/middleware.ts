// ================================================
// src/middleware.ts - Next.js Middleware (Consolidated)
// ================================================

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { rateLimit, getIdentifier } from '@/lib/rate-limit-redis'
import { securityConfig, isOriginAllowed } from '@/lib/security-config'
import * as Sentry from '@sentry/nextjs'

/**
 * Apply CORS headers to response
 */
function applyCorsHeaders(request: NextRequest, response: NextResponse): NextResponse {
  const origin = request.headers.get('origin')

  // Check if origin is allowed
  if (origin && isOriginAllowed(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin)
  } else if (process.env.NODE_ENV === 'development') {
    // In development, allow all origins
    response.headers.set('Access-Control-Allow-Origin', '*')
  }

  // Set CORS headers
  response.headers.set(
    'Access-Control-Allow-Methods',
    securityConfig.cors.allowedMethods.join(', ')
  )

  response.headers.set(
    'Access-Control-Allow-Headers',
    securityConfig.cors.allowedHeaders.join(', ')
  )

  response.headers.set(
    'Access-Control-Expose-Headers',
    securityConfig.cors.exposedHeaders.join(', ')
  )

  if (securityConfig.cors.credentials) {
    response.headers.set('Access-Control-Allow-Credentials', 'true')
  }

  response.headers.set(
    'Access-Control-Max-Age',
    String(securityConfig.cors.maxAge)
  )

  return response
}

/**
 * Apply security headers to response
 */
function applySecurityHeaders(response: NextResponse): NextResponse {
  // Apply all security headers
  Object.entries(securityConfig.headers).forEach(([key, value]) => {
    response.headers.set(key, value)
  })

  // Apply Content Security Policy
  const cspArray = Object.entries(securityConfig.contentSecurityPolicy).map(
    ([key, values]) => `${key} ${Array.isArray(values) ? values.join(' ') : values}`
  )
  response.headers.set('Content-Security-Policy', cspArray.join('; '))

  return response
}

/**
 * Validate API key if required
 */
function validateApiKey(request: NextRequest): boolean {
  if (!securityConfig.apiKeys.enabled) {
    return true // API key not required
  }

  const apiKey = request.headers.get(securityConfig.apiKeys.headerName)

  if (!apiKey) {
    return false
  }

  return securityConfig.apiKeys.keys.includes(apiKey)
}

/**
 * Main middleware function
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  try {
    // ================================================
    // 1. HANDLE PREFLIGHT OPTIONS REQUESTS
    // ================================================
    if (request.method === 'OPTIONS') {
      const response = new NextResponse(null, { status: 204 })
      return applyCorsHeaders(request, response)
    }

    // ================================================
    // 2. CREATE BASE RESPONSE WITH SECURITY HEADERS
    // ================================================
    let response = NextResponse.next()

    // Add request ID for tracing
    const requestId = crypto.randomUUID()
    response.headers.set('X-Request-ID', requestId)

    // Apply security headers
    response = applySecurityHeaders(response)

    // ================================================
    // 3. APPLY CORS FOR API ROUTES
    // ================================================
    if (pathname.startsWith('/api')) {
      response = applyCorsHeaders(request, response)

      // Validate API key for external/admin API access (if enabled)
      if (securityConfig.apiKeys.enabled) {
        // Exempt these endpoints from API key requirement:
        const exemptPaths = [
          '/api/auth',        // NextAuth endpoints
          '/api/verify-recaptcha', // reCAPTCHA verification
          '/api/health',      // Health check
          '/api/check-env',   // Environment check
        ]

        const isExempt = exemptPaths.some(path => pathname.startsWith(path))

        // Check if request has valid session token (authenticated user)
        const hasSessionToken = request.cookies.has('next-auth.session-token') ||
                               request.cookies.has('__Secure-next-auth.session-token')

        // Require API key only if:
        // 1. Path is not exempt
        // 2. User is not authenticated (no session token)
        if (!isExempt && !hasSessionToken) {
          if (!validateApiKey(request)) {
            return NextResponse.json(
              {
                success: false,
                error: 'Authentication required. Please log in or provide a valid API key.',
                code: 'AUTHENTICATION_REQUIRED',
              },
              { status: 401 }
            )
          }
        }
      }
    }

    // ================================================
    // 4. RATE LIMITING FOR API ROUTES
    // ================================================
    if (pathname.startsWith('/api')) {
      const identifier = getIdentifier(request)

      // Determine rate limit type based on path
      let type: 'default' | 'login' | 'register' | 'payment' | 'upload' = 'default'

      if (pathname.includes('/auth/login')) type = 'login'
      else if (pathname.includes('/auth/register')) type = 'register'
      else if (pathname.includes('/payments')) type = 'payment'
      else if (pathname.includes('/upload')) type = 'upload'

      const rateLimitResult = await rateLimit(identifier, type)

      if (!rateLimitResult.success) {
        const retryAfter = rateLimitResult.reset - Math.floor(Date.now() / 1000)

        const rateLimitResponse = NextResponse.json(
          {
            success: false,
            error: 'Rate limit exceeded',
            message: `Too many requests. Try again in ${retryAfter} seconds.`,
            code: 'RATE_LIMIT_EXCEEDED',
            retryAfter,
          },
          { status: 429 }
        )

        rateLimitResponse.headers.set('Retry-After', String(retryAfter))
        rateLimitResponse.headers.set('X-RateLimit-Limit', String(rateLimitResult.limit))
        rateLimitResponse.headers.set('X-RateLimit-Remaining', String(rateLimitResult.remaining))
        rateLimitResponse.headers.set('X-RateLimit-Reset', String(rateLimitResult.reset))

        return applyCorsHeaders(request, rateLimitResponse)
      }

      // Add rate limit headers to successful responses
      response.headers.set('X-RateLimit-Limit', String(rateLimitResult.limit))
      response.headers.set('X-RateLimit-Remaining', String(rateLimitResult.remaining))
      response.headers.set('X-RateLimit-Reset', String(rateLimitResult.reset))
    }

    // ================================================
    // 5. AUTHENTICATION CHECK FOR PROTECTED ROUTES
    // ================================================
    const protectedPaths = ['/dashboard', '/admin']
    const isProtectedPath = protectedPaths.some((path) => pathname.startsWith(path))

    if (isProtectedPath) {
      const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET,
      })

      if (!token) {
        // Not authenticated - redirect to login
        const url = new URL('/login', request.url)
        url.searchParams.set('callbackUrl', pathname)
        return NextResponse.redirect(url)
      }

      // Check role for admin routes
      if (pathname.startsWith('/admin') && token.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
    }

    // ================================================
    // 6. BLOCK SUSPICIOUS PATTERNS (Security)
    // ================================================
    const suspiciousPatterns = [
      /\.\./,              // Directory traversal
      /<script/i,          // XSS attempts
      /union.*select/i,    // SQL injection
      /\/wp-admin/,        // WordPress scan
      /\.env/,             // Env file access
      /\.git/,             // Git folder access
    ]

    const url = request.url
    if (suspiciousPatterns.some((pattern) => pattern.test(url))) {
      // Log suspicious activity
      console.warn('Suspicious request blocked:', {
        url,
        ip: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent'),
      })

      // Report to Sentry
      Sentry.captureMessage('Suspicious request blocked', {
        level: 'warning',
        tags: {
          security: 'suspicious_pattern',
          path: pathname,
        },
        contexts: {
          request: {
            url,
            ip: request.headers.get('x-forwarded-for') || 'unknown',
            userAgent: request.headers.get('user-agent') || 'unknown',
          },
        },
      })

      return new NextResponse('Forbidden', { status: 403 })
    }

    return response
  } catch (error) {
    // Capture middleware errors in Sentry
    Sentry.captureException(error, {
      contexts: {
        middleware: {
          url: request.url,
          method: request.method,
          pathname: request.nextUrl.pathname,
          userAgent: request.headers.get('user-agent') || 'unknown',
          ip: request.headers.get('x-forwarded-for') || 'unknown',
        },
      },
      tags: {
        middleware: 'true',
        path: request.nextUrl.pathname,
      },
    })

    // Log error
    console.error('Middleware error:', error)

    // Return error response
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        code: 'MIDDLEWARE_ERROR',
      },
      { status: 500 }
    )
  }
}

// Configure which paths the middleware runs on
export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico (favicon file)
     * - public folder (static assets)
     * - monitoring (Sentry tunnel route)
     */
    '/((?!_next/static|_next/image|favicon.ico|public|monitoring).*)',
  ],
}
