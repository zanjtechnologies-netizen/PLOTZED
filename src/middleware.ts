// ================================================
// src/middleware.ts - Next.js Middleware for Rate Limiting & Security
// ================================================

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { rateLimit, getIdentifier } from '@/lib/rate-limit-redis'

// Rate limiting store (in-memory for development, use Redis in production)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

interface RateLimitConfig {
  interval: number // milliseconds
  maxRequests: number
}

// Different rate limits for different routes
const rateLimits: Record<string, RateLimitConfig> = {
  '/api/auth/login': { interval: 15 * 60 * 1000, maxRequests: 5 }, // 5 per 15 min
  '/api/auth/register': { interval: 60 * 60 * 1000, maxRequests: 3 }, // 3 per hour
  '/api/auth/send-otp': { interval: 5 * 60 * 1000, maxRequests: 3 }, // 3 per 5 min
  '/api/payments': { interval: 60 * 60 * 1000, maxRequests: 10 }, // 10 per hour
  '/api/upload': { interval: 60 * 60 * 1000, maxRequests: 5 }, // 5 per hour
  '/api': { interval: 15 * 60 * 1000, maxRequests: 100 }, // 100 per 15 min (default)
}

function getRateLimitConfig(pathname: string): RateLimitConfig {
  // Find the most specific matching rate limit
  for (const [path, config] of Object.entries(rateLimits)) {
    if (pathname.startsWith(path)) {
      return config
    }
  }
  return rateLimits['/api'] // default
}

function checkRateLimit(identifier: string, config: RateLimitConfig): boolean {
  const now = Date.now()
  const record = rateLimitStore.get(identifier)

  if (!record || now > record.resetTime) {
    // New window or expired
    rateLimitStore.set(identifier, {
      count: 1,
      resetTime: now + config.interval,
    })
    return true
  }

  if (record.count >= config.maxRequests) {
    return false // Rate limit exceeded
  }

  record.count++
  rateLimitStore.set(identifier, record)
  return true
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // ================================================
  // 1. SECURITY HEADERS
  // ================================================
  const response = NextResponse.next()

  response.headers.set('X-DNS-Prefetch-Control', 'on')
  response.headers.set('X-Frame-Options', 'SAMEORIGIN')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(self)'
  )
  response.headers.set(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains'
  )

  // Content Security Policy
  response.headers.set(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://checkout.razorpay.com https://maps.googleapis.com https://www.google.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "img-src 'self' data: https: blob:",
      "font-src 'self' https://fonts.gstatic.com",
      "connect-src 'self' https://api.razorpay.com https://maps.googleapis.com",
      "frame-src 'self' https://api.razorpay.com https://www.google.com",
    ].join('; ')
  )

  // ================================================
  // 2. RATE LIMITING FOR API ROUTES
  // ================================================

// In the middleware function, replace the rate limiting code:
// Rate limiting for API routes
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
    return new NextResponse(
      JSON.stringify({
        error: 'Rate limit exceeded',
        message: `Too many requests. Try again in ${rateLimitResult.reset - Math.floor(Date.now() / 1000)} seconds.`,
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'X-RateLimit-Limit': String(rateLimitResult.limit),
          'X-RateLimit-Remaining': String(rateLimitResult.remaining),
          'X-RateLimit-Reset': String(rateLimitResult.reset),
          'Retry-After': String(rateLimitResult.reset - Math.floor(Date.now() / 1000)),
        },
      }
    )
  }

  // Add rate limit headers to response
  response.headers.set('X-RateLimit-Limit', String(rateLimitResult.limit))
  response.headers.set('X-RateLimit-Remaining', String(rateLimitResult.remaining))
  response.headers.set('X-RateLimit-Reset', String(rateLimitResult.reset))
}

  // ================================================
  // 3. AUTHENTICATION CHECK FOR PROTECTED ROUTES
  // ================================================
  const protectedPaths = ['/dashboard', '/admin']
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path))

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
  // 4. BLOCK SUSPICIOUS PATTERNS
  // ================================================
  const suspiciousPatterns = [
    /\.\./,  // Directory traversal
    /<script/i,  // XSS attempts
    /union.*select/i,  // SQL injection
    /\/wp-admin/,  // WordPress scan
    /\.env/,  // Env file access
    /\.git/,  // Git folder access
  ]

  const url = request.url
  if (suspiciousPatterns.some(pattern => pattern.test(url))) {
    // Log suspicious activity
    console.warn('Suspicious request blocked:', {
      url,
      ip: request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request.headers.get('user-agent'),
    })
    
    return new NextResponse('Forbidden', { status: 403 })
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}
