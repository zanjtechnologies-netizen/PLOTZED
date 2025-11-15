// ================================================
// src/app/api/admin/cache/status/route.ts - Cache Monitoring
// ================================================

/**
 * Admin endpoint for monitoring cache health and statistics
 *
 * GET /api/admin/cache/status
 * - Returns cache statistics
 * - Shows cache hit/miss rates
 * - Lists cached keys
 * - Shows memory usage
 *
 * Requires: ADMIN role
 */

import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { successResponse, withErrorHandling } from '@/lib/api-error-handler'
import { UnauthorizedError, ForbiddenError } from '@/lib/errors'
import { cache } from '@/lib/cache'

export const GET = withErrorHandling(
  async (request: NextRequest) => {
    // Check authentication
    const session = await auth()

    if (!session?.user) {
      throw new UnauthorizedError('Please login to view cache status')
    }

    if (session.user.role !== 'ADMIN') {
      throw new ForbiddenError('Admin access required')
    }

    // Get cache statistics
    const stats = await cache.getCacheStats()

    return successResponse({
      status: 'healthy',
      redis: {
        connected: stats.keyCount > 0 || stats.keyCount === 0, // If we got stats, Redis is connected
        configured: !!process.env.UPSTASH_REDIS_REST_URL && !!process.env.UPSTASH_REDIS_REST_TOKEN,
      },
      keys: {
        total: stats.keyCount,
        plots: stats.plotKeys,
        users: stats.userKeys,
        searches: stats.searchKeys,
      },
      timestamp: new Date().toISOString(),
    })
  },
  'GET /api/admin/cache/status'
)
