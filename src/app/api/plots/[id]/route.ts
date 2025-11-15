// ================================================
// src/app/api/plots/[id]/route.ts - Single Plot API
// ================================================
export const runtime = "nodejs";

import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { updatePlotSchema } from '@/lib/validators'
import { noContentResponse, successResponse, withErrorHandling } from '@/lib/api-error-handler'
import { ForbiddenError, NotFoundError, UnauthorizedError } from '@/lib/errors'
import { structuredLogger } from '@/lib/structured-logger'
import { cache, CACHE_KEYS, CACHE_TTL } from '@/lib/cache'

export const GET = withErrorHandling(
  async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params

    const result = await cache.get(
      CACHE_KEYS.PLOT_BY_ID(id),
      async () => {
        const plot = await prisma.plot.findUnique({
          where: { id },
          include: {
            site_visits: {
              where: { status: 'COMPLETED' },
              select: { id: true },
            },
          },
        })

        if (!plot) {
          throw new NotFoundError('Plot not found')
        }

        return { plot }
      },
      CACHE_TTL.LONG // 15 minutes for individual plots
    )

    return successResponse(result)
  },
  'GET /api/plots/[id]'
)

export const PUT = withErrorHandling(
  async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const session = await auth()

    if (!session?.user) {
      throw new UnauthorizedError('Unauthorized. Please login.')
    }

    if (session.user.role !== 'ADMIN') {
      throw new ForbiddenError('Only admins can update plot listings.')
    }

    const { id } = await params
    const body = await request.json()
    const plotData = updatePlotSchema.parse(body)

    const { bookingAmount, plotSize, reraNumber, isFeatured, ...restOfPlotData } = plotData

    const updatedPlot = await prisma.plot.update({
      where: { id },
      data: {
        ...restOfPlotData,
        booking_amount: bookingAmount,
        plot_size: plotSize,
        rera_number: reraNumber,
        is_featured: isFeatured,
      },
    })

    structuredLogger.info('Plot updated', {
      plotId: id,
      userId: session.user.id,
      type: 'plot_update',
    })

    // Invalidate plot caches after update
    await cache.invalidatePlotCaches(id)

    return successResponse({ plot: updatedPlot }, 200, 'Plot updated successfully')
  },
  'PUT /api/plots/[id]'
)

export const DELETE = withErrorHandling(
  async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const session = await auth()

    if (!session?.user) {
      throw new UnauthorizedError('Unauthorized. Please login.')
    }

    if (session.user.role !== 'ADMIN') {
      throw new ForbiddenError('Only admins can delete plot listings.')
    }

    const { id } = await params
    await prisma.plot.delete({
      where: { id },
    })

    structuredLogger.warn('Plot deleted', {
      plotId: id,
      userId: session.user.id,
      type: 'plot_deletion',
    })

    // Invalidate plot caches after deletion
    await cache.invalidatePlotCaches(id)

    return noContentResponse()
  },
  'DELETE /api/plots/[id]'
)
