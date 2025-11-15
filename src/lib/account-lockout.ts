import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

const MAX_ATTEMPTS = 5
const LOCKOUT_DURATION = 15 * 60 // 15 minutes in seconds

interface LockoutStatus {
  locked: boolean
  attempts?: number
  remainingTime?: number
}

export async function checkAccountLockout(email: string): Promise<LockoutStatus> {
  const key = `lockout:${email}`

  try {
    const attempts = await redis.get<number>(key)

    if (!attempts) {
      return { locked: false, attempts: 0 }
    }

    if (attempts >= MAX_ATTEMPTS) {
      const ttl = await redis.ttl(key)
      return {
        locked: true,
        attempts,
        remainingTime: ttl,
      }
    }

    return { locked: false, attempts }
  } catch (error) {
    console.error('Lockout check error:', error)
    // Fail open
    return { locked: false, attempts: 0 }
  }
}

export async function recordFailedLogin(email: string): Promise<void> {
  const key = `lockout:${email}`

  try {
    const current = await redis.incr(key)

    if (current === 1) {
      // First failed attempt, set expiry
      await redis.expire(key, LOCKOUT_DURATION)
    }

    if (current >= MAX_ATTEMPTS) {
      console.warn(`🔒 Account locked: ${email} (${current} failed attempts)`)
      
      // Log to database for audit
      // await logSecurityEvent({ type: 'account_locked', email })
    }
  } catch (error) {
    console.error('Failed login recording error:', error)
  }
}

export async function recordSuccessfulLogin(email: string): Promise<void> {
  const key = `lockout:${email}`

  try {
    await redis.del(key)
  } catch (error) {
    console.error('Successful login recording error:', error)
  }
}

export function formatRemainingTime(seconds: number): string {
  if (seconds < 60) {
    return `${seconds} seconds`
  }
  const minutes = Math.ceil(seconds / 60)
  return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`
}