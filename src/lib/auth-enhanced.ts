// src/lib/auth-enhanced.ts - Add these features
import { prisma } from './prisma'

// 1. Add account lockout after failed attempts
export async function checkLoginAttempts(email: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { email },
  })

  if (!user) return true

  // Check if account is locked
  const lockoutKey = `lockout:${email}`
  const attempts = await getLoginAttempts(lockoutKey)

  if (attempts >= 5) {
    // Lock account for 15 minutes
    const lockTime = await getLockoutTime(lockoutKey)
    if (Date.now() - lockTime < 15 * 60 * 1000) {
      throw new Error('Account locked. Too many failed attempts. Try again in 15 minutes.')
    } else {
      // Reset after lockout period
      await resetLoginAttempts(lockoutKey)
    }
  }

  return true
}

// 2. Track failed login attempts
export async function recordFailedLogin(email: string) {
  const key = `lockout:${email}`
  await incrementLoginAttempts(key)
}

// 3. Reset on successful login
export async function recordSuccessfulLogin(email: string) {
  const key = `lockout:${email}`
  await resetLoginAttempts(key)
}

// Helper functions (use in-memory or Redis)
const loginAttempts = new Map<string, { count: number; timestamp: number }>()

function getLoginAttempts(key: string): number {
  return loginAttempts.get(key)?.count || 0
}

function getLockoutTime(key: string): number {
  return loginAttempts.get(key)?.timestamp || 0
}

function incrementLoginAttempts(key: string) {
  const current = loginAttempts.get(key) || { count: 0, timestamp: Date.now() }
  loginAttempts.set(key, { count: current.count + 1, timestamp: Date.now() })
}

function resetLoginAttempts(key: string) {
  loginAttempts.delete(key)
}