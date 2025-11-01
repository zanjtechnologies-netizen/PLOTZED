// src/lib/rate-limit-enhanced.ts

import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL!,
  token: process.env.UPSTASH_REDIS_TOKEN!,
})

interface RateLimitConfig {
  requests: number
  window: number // seconds
}

const rateLimitConfigs = {
  default: { requests: 100, window: 900 }, // 15 min
  login: { requests: 5, window: 900 },
  register: { requests: 3, window: 3600 },
  payment: { requests: 10, window: 3600 },
  upload: { requests: 5, window: 3600 },
  otp: { requests: 3, window: 300 },
}

export async function rateLimit(
  identifier: string,
  type: keyof typeof rateLimitConfigs = 'default'
): Promise<{ success: boolean; limit: number; remaining: number; reset: number }> {
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
    // Fail open
    return {
      success: true,
      limit: config.requests,
      remaining: config.requests,
      reset: Math.floor(Date.now() / 1000) + config.window,
    }
  }
}

// Apply rate limiting in middleware
export async function applyRateLimit(request: Request, type: keyof typeof rateLimitConfigs) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown'
  const result = await rateLimit(ip, type)

  if (!result.success) {
    throw new Error(`Rate limit exceeded. Try again in ${result.reset - Math.floor(Date.now() / 1000)} seconds.`)
  }

  return result
}