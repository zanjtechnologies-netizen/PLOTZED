// ================================================
// src/lib/rate-limit-redis.ts - Redis-based Rate Limiting (Production)
// ================================================

import { Redis } from '@upstash/redis'

// Use Upstash Redis for serverless-friendly rate limiting
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL || '',
  token: process.env.UPSTASH_REDIS_TOKEN || '',
})

interface RateLimitResult {
  success: boolean
  limit: number
  remaining: number
  reset: number
}

export async function rateLimit(
  identifier: string,
  limit: number = 100,
  window: number = 15 * 60 // 15 minutes in seconds
): Promise<RateLimitResult> {
  const key = `rate_limit:${identifier}`
  const now = Math.floor(Date.now() / 1000)
  const windowStart = now - window

  try {
    // Remove old entries
    await redis.zremrangebyscore(key, 0, windowStart)
    
    // Count requests in current window
    const count = await redis.zcard(key)
    
    if (count >= limit) {
      const oldestEntry = (await redis.zrange(key, 0, 0, {
        withScores: true,
      })) as { score: number }[]
      const resetTime = oldestEntry[0]
        ? Number(oldestEntry[0].score) + window
        : now + window

      return {
        success: false,
        limit,
        remaining: 0,
        reset: resetTime,
      }
    }
    
    // Add current request
    await redis.zadd(key, { score: now, member: `${now}-${Math.random()}` })
    await redis.expire(key, window)
    
    return {
      success: true,
      limit,
      remaining: limit - (count + 1),
      reset: now + window,
    }
  } catch (error) {
    console.error('Rate limit error:', error)
    // Fail open - allow request if rate limiting fails
    return {
      success: true,
      limit,
      remaining: limit,
      reset: now + window,
    }
  }
}
