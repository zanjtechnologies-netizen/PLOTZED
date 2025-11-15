// ================================================
// src/lib/rate-limit.ts - Rate Limiting Utility
// ================================================

import { getRedisClient } from './cache'

interface RateLimitConfig {
  interval: number // Time window in seconds
  maxRequests: number // Maximum requests allowed in the interval
}

/**
 * Rate limiter using Redis
 * @param identifier - Unique identifier (e.g., IP address, user ID, email)
 * @param config - Rate limit configuration
 * @returns boolean - true if rate limit exceeded
 */
export async function checkRateLimit(
  identifier: string,
  config: RateLimitConfig,
): Promise<{ limited: boolean; remaining: number; resetAt: Date }> {
  const redis = getRedisClient()
  if (!redis) {
    // Fail open if Redis is not available
    return {
      limited: false,
      remaining: config.maxRequests,
      resetAt: new Date(Date.now() + config.interval * 1000),
    }
  }

  const key = `ratelimit:${identifier}`

  try {
    const current = await redis.incr(key)

    // Set expiry on first request
    if (current === 1) {
      await redis.expire(key, config.interval)
    }

    const ttl = await redis.ttl(key)
    const resetAt = new Date(Date.now() + ttl * 1000)

    if (current > config.maxRequests) {
      return {
        limited: true,
        remaining: 0,
        resetAt,
      }
    }

    return {
      limited: false,
      remaining: config.maxRequests - current,
      resetAt,
    }
  } catch (error) {
    console.error('Rate limit check error:', error)
    // Fail open - allow request if Redis is down
    return {
      limited: false,
      remaining: config.maxRequests,
      resetAt: new Date(Date.now() + config.interval * 1000),
    }
  }
}

/**
 * Rate limit configurations for different endpoints
 */
export const RATE_LIMITS = {
  // Public endpoints
  INQUIRY_SUBMISSION: {
    interval: 3600, // 1 hour
    maxRequests: 5, // 5 inquiries per hour per IP
  },
  SITE_VISIT_BOOKING: {
    interval: 3600, // 1 hour
    maxRequests: 3, // 3 bookings per hour per user
  },
  LOGIN_ATTEMPT: {
    interval: 900, // 15 minutes
    maxRequests: 5, // 5 login attempts per 15 minutes
  },
  REGISTRATION: {
    interval: 3600, // 1 hour
    maxRequests: 3, // 3 registrations per hour per IP
  },
  // Admin endpoints
  ADMIN_ACTION: {
    interval: 60, // 1 minute
    maxRequests: 30, // 30 actions per minute
  },
}

/**
 * Get client IP address from request
 */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')

  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }

  if (realIp) {
    return realIp
  }

  return 'unknown'
}
