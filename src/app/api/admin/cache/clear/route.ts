// ================================================
// src/app/api/admin/cache/clear/route.ts - Cache Management
// ================================================

/**
 * Admin endpoint for clearing cache
 *
 * POST /api/admin/cache/clear
 * - Clear all caches
 * - Clear specific cache patterns
 *
 * Query params:
 * - pattern: Cache key pattern to clear (optional, defaults to all)
 *
 * Requires: ADMIN role
 */

import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { successResponse, withErrorHandling } from '@/lib/api-error-handler'
import { UnauthorizedError, ForbiddenError } from '@/lib/errors'
import { cache } from '@/lib/cache'
import { structuredLogger } from '@/lib/structured-logger'

export const POST = withErrorHandling(
  async (request: NextRequest) => {
    // Check authentication
    const session = await auth()

    if (!session?.user) {
      throw new UnauthorizedError('Please login to clear cache')
    }

    if (session.user.role !== 'ADMIN') {
      throw new ForbiddenError('Admin access required')
    }

    const { searchParams } = new URL(request.url)
    const pattern = searchParams.get('pattern')

    if (pattern) {
      // Clear specific pattern
      await cache.delPattern(pattern)

      structuredLogger.warn('Cache pattern cleared by admin', {
        pattern,
        userId: session.user.id,
        type: 'cache_clear_pattern',
      })

      return successResponse({
        message: `Cache cleared for pattern: ${pattern}`,
        pattern,
      })
    } else {
      // Clear all caches
      await cache.clearAll()

      structuredLogger.warn('All caches cleared by admin', {
        userId: session.user.id,
        type: 'cache_clear_all',
      })

      return successResponse({
        message: 'All caches cleared successfully',
      })
    }
  },
  'POST /api/admin/cache/clear'
)
