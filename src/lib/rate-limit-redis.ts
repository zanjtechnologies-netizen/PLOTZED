// ================================================
// src/lib/rate-limit-redis.ts - Redis-based Rate Limiting (Production)
// ================================================

import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

interface RateLimitConfig {
  requests: number
  window: number // seconds
}

const rateLimitConfigs: Record<string, RateLimitConfig> = {
  default: { requests: 100, window: 900 }, // 15 min
  login: { requests: 5, window: 900 },
  register: { requests: 3, window: 3600 },
  payment: { requests: 10, window: 3600 },
  upload: { requests: 5, window: 3600 },
  otp: { requests: 3, window: 300 },
}

interface RateLimitResult {
  success: boolean
  limit: number
  remaining: number
  reset: number
}

export async function rateLimit(
  identifier: string,
  type: keyof typeof rateLimitConfigs = 'default'
): Promise<RateLimitResult> {
  const config = rateLimitConfigs[type]
  const key = `ratelimit:${type}:${identifier}`

  try {
    const current = await redis.incr(key)

    if (current === 1) {
      // First request in window, set expiry
      await redis.expire(key, config.window)
    }

    const ttl = await redis.ttl(key)
    const resetTime = Math.floor(Date.now() / 1000) + ttl

    if (current > config.requests) {
      return {
        success: false,
        limit: config.requests,
        remaining: 0,
        reset: resetTime,
      }
    }

    return {
      success: true,
      limit: config.requests,
      remaining: config.requests - current,
      reset: resetTime,
    }
  } catch (error) {
    console.error('Rate limit error:', error)
    // Fail open in case of Redis issues
    return {
      success: true,
      limit: config.requests,
      remaining: config.requests,
      reset: Math.floor(Date.now() / 1000) + config.window,
    }
  }
}

// Helper to get IP from request
export function getIdentifier(request: Request): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0] ||
    request.headers.get('x-real-ip') ||
    'unknown'
  )
}