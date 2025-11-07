// ================================================
// src/app/api/auth/logout/route.ts
// Explicit Logout Endpoint
// ================================================

import { NextRequest } from 'next/server'
import { auth, signOut } from '@/lib/auth'
import { successResponse, withErrorHandling } from '@/lib/api-error-handler'
import { UnauthorizedError } from '@/lib/errors'
import { structuredLogger } from '@/lib/structured-logger'

/**
 * POST /api/auth/logout
 * Explicitly logs out the user and destroys the session
 */
export const POST = withErrorHandling(
  async (request: NextRequest) => {
    // Get current session
    const session = await auth()

    if (!session?.user) {
      throw new UnauthorizedError('Not authenticated')
    }

    const userId = session.user.id

    // Sign out using NextAuth
    await signOut({ redirect: false })

    structuredLogger.info('User logged out successfully', {
      userId,
      type: 'user_logout',
    })

    return successResponse({
      message: 'Logged out successfully',
    })
  },
  'POST /api/auth/logout'
)
