// ================================================
// src/app/api/site-visits/my/route.ts - User's Site Visits
// ================================================
export const runtime = "nodejs";

import { NextRequest } from 'next/server'
import { z } from 'zod'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { successResponse, withErrorHandling } from '@/lib/api-error-handler'
import { UnauthorizedError } from '@/lib/errors'
import { structuredLogger } from '@/lib/structured-logger'

// Validation schema
const querySchema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED']).optional(),
  page: z.string().optional().default('1').transform(Number).pipe(z.number().min(1)),
  limit: z.string().optional().default('10').transform(Number).pipe(z.number().min(1).max(100)),
})

/**
 * GET /api/site-visits/my
 * Get current user's site visits with filtering and pagination
 */
export const GET = withErrorHandling(
  async (request: NextRequest) => {
    const startTime = Date.now()

    // 1. Authentication
    const session = await auth()

    if (!session?.user) {
      throw new UnauthorizedError('Authentication required')
    }

    // 2. Parse and validate query parameters
    const { searchParams } = new URL(request.url)
    const { status, page, limit } = querySchema.parse({
      status: searchParams.get('status') || undefined,
      page: searchParams.get('page'),
      limit: searchParams.get('limit'),
    })

    // 3. Build where clause
    const where: any = {
      user_id: session.user.id,
    }

    if (status) {
      where.status = status
    }

    // 4. Calculate pagination
    const skip = (page - 1) * limit

    // 5. Fetch site visits and total count in parallel
    const [siteVisits, totalCount] = await Promise.all([
      prisma.site_visits.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          visit_date: 'desc',
        },
        include: {
          plots: {
            select: {
              id: true,
              title: true,
              city: true,
              state: true,
              price: true,
              images: true,
            },
          },
        },
      }),
      prisma.site_visits.count({ where }),
    ])

    // 6. Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / limit)
    const hasNextPage = page < totalPages
    const hasPrevPage = page > 1

    // 7. Log request
    structuredLogger.info('User site visits retrieved', {
      userId: session.user.id,
      count: siteVisits.length,
      page,
      type: 'site_visits_my',
    })

    const duration = Date.now() - startTime
    structuredLogger.logApiResponse('GET', '/api/site-visits/my', 200, duration)

    // 8. Return response
    return successResponse({
      siteVisits: siteVisits.map((visit: any) => ({
        id: visit.id,
        visitDate: visit.visit_date,
        status: visit.status,
        attendees: visit.attendees,
        createdAt: visit.created_at,
        plots: visit.plot,
      })),
      pagination: {
        page,
        limit,
        totalPages,
        totalCount,
        hasNextPage,
        hasPrevPage,
      },
      meta: {
        queryDuration: `${duration}ms`,
      },
    })
  },
  'GET /api/site-visits/my'
)
