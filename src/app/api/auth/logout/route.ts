// ================================================
// src/app/api/auth/logout/route.ts
// Explicit Logout Endpoint
// ================================================

import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { successResponse, withErrorHandling } from '@/lib/api-error-handler'
import { UnauthorizedError } from '@/lib/errors'
import { structuredLogger } from '@/lib/structured-logger'

/**
 * POST /api/auth/logout
 * Explicitly logs out the user and destroys the session
 *
 * Note: In NextAuth v4, session destruction is handled client-side
 * This endpoint validates the session and logs the event
 * Client should call NextAuth's signOut() after receiving this response
 */
export const POST = withErrorHandling(
  async (request: NextRequest) => {
    // Get current session
    const session = await auth()

    if (!session?.user) {
      throw new UnauthorizedError('Not authenticated')
    }

    const userId = session.user.id

    structuredLogger.info('User logged out successfully', {
      userId,
      type: 'user_logout',
    })

    // Client-side should call signOut() from next-auth/react to clear the session
    return successResponse({
      message: 'Logged out successfully',
    })
  },
  'POST /api/auth/logout'
)
