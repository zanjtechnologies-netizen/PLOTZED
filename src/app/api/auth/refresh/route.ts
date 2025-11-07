// ================================================
// src/app/api/auth/refresh/route.ts
// JWT Refresh Token Endpoint
// ================================================

import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { successResponse, withErrorHandling } from '@/lib/api-error-handler'
import { NotFoundError, UnauthorizedError } from '@/lib/errors'
import { structuredLogger } from '@/lib/structured-logger'

/**
 * POST /api/auth/refresh
 * Refreshes the current session and extends expiration
 * Requires active session
 */
export const POST = withErrorHandling(
  async (request: NextRequest) => {
    // Get current session
    const session = await auth()

    if (!session?.user?.id) {
      throw new UnauthorizedError('Not authorized')
    }

    // Verify user still exists and is active
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        email_verified: true,
      },
    })

    if (!user) {
      throw new NotFoundError('User not found')
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { last_login: new Date() },
    })

    structuredLogger.info('Session refreshed', {
      userId: user.id,
      type: 'session_refresh',
    })

    // Return refreshed user data
    // NextAuth will automatically handle the token refresh
    return successResponse({
      message: 'Session refreshed successfully',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        email_verified: user.email_verified,
      },
    })
  },
  'POST /api/auth/refresh'
)

/**
 * GET /api/auth/refresh
 * Get current session status
 */
export const GET = withErrorHandling(
  async (request: NextRequest) => {
    const session = await auth()

    if (!session?.user?.id) {
      throw new UnauthorizedError('Authentication failed')
    }

    // Verify user still exists
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        email_verified: true,
        last_login: true,
      },
    })

    if (!user) {
      throw new NotFoundError('User not found')
    }

    return successResponse({
      authenticated: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        email_verified: user.email_verified,
        last_login: user.last_login,
      },
    })
  },
  'GET /api/auth/refresh'
)
