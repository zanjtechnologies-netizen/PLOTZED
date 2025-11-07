// ================================================
// src/app/api/auth/login/route.ts
// Explicit Login Endpoint
// ================================================

import { NextRequest } from 'next/server'
import { z } from 'zod'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { signIn } from '@/lib/auth'
import {
  checkAccountLockout,
  recordFailedLogin,
  recordSuccessfulLogin,
  formatRemainingTime,
} from '@/lib/account-lockout'
import { successResponse, withErrorHandling } from '@/lib/api-error-handler'
import { ForbiddenError, UnauthorizedError } from '@/lib/errors'
import { structuredLogger } from '@/lib/structured-logger'

const MAX_ATTEMPTS = 5

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

/**
 * POST /api/auth/login
 * Explicit login endpoint for API clients
 * Returns user data and session information
 */
export const POST = withErrorHandling(
  async (request: NextRequest) => {
    const body = await request.json()

    // Validate input
    const validatedData = loginSchema.parse(body)
    const { email, password } = validatedData

    // Check for account lockout
    const lockoutStatus = await checkAccountLockout(email)
    if (lockoutStatus.locked) {
      const timeRemaining = formatRemainingTime(lockoutStatus.remainingTime || 0)
      structuredLogger.warn('Login attempt on locked account', {
        email,
        type: 'account_lockout',
      })
      throw new ForbiddenError(
        `Account temporarily locked due to multiple failed login attempts. Try again in ${timeRemaining}.`
      )
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        password_hash: true,
        role: true,
        email_verified: true,
        kyc_verified: true,
        last_login: true,
      },
    })

    if (!user) {
      await recordFailedLogin(email)
      structuredLogger.warn('Login attempt for non-existent user', {
        email,
        type: 'failed_login',
      })
      throw new UnauthorizedError('Invalid email ID/Password')
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash)

    if (!isPasswordValid) {
      await recordFailedLogin(email)

      const attempts = lockoutStatus.attempts || 0
      const remaining = MAX_ATTEMPTS - attempts - 1

      structuredLogger.warn('Failed login attempt', {
        userId: user.id,
        email,
        attemptsRemaining: remaining,
        type: 'failed_login',
      })

      if (remaining > 0) {
        throw new UnauthorizedError(
          `Invalid email or password. ${remaining} ${remaining === 1 ? 'attempt' : 'attempts'} remaining.`
        )
      } else {
        throw new UnauthorizedError(
          'Invalid email or password. Account will be locked after one more failed attempt.'
        )
      }
    }

    // Reset failed attempts
    await recordSuccessfulLogin(email)

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { last_login: new Date() },
    })

    // Sign in using NextAuth (creates session)
    try {
      await signIn('credentials', {
        email,
        password,
        redirect: false,
      })
    } catch (signInError) {
      structuredLogger.error('NextAuth sign in error', signInError as Error, {
        userId: user.id,
        email: user.email,
      })
      // Continue anyway as we've already validated credentials
    }

    structuredLogger.info('User logged in successfully', {
      userId: user.id,
      email: user.email,
      type: 'user_login',
    })

    // Return success with user data (excluding sensitive info)
    return successResponse({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        role: user.role,
        email_verified: user.email_verified,
        kyc_verified: user.kyc_verified,
        last_login: user.last_login,
      },
    })
  },
  'POST /api/auth/login'
)
