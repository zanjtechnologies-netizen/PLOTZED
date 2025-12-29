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
        const plot = await prisma.plots.findUnique({
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

        // Convert Decimal fields to numbers for JSON serialization
        const serializedPlot = {
          ...plot,
          price: plot.price.toNumber(),
          original_price: plot.original_price?.toNumber() ?? null,
          booking_amount: plot.booking_amount.toNumber(),
          plot_size: plot.plot_size.toNumber(),
          latitude: plot.latitude?.toNumber() ?? null,
          longitude: plot.longitude?.toNumber() ?? null,
        }

        return { plot: serializedPlot }
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

    const { bookingAmount, plotSize, originalPrice, reraNumber, isFeatured, is_published, heroImage, brochure, ...restOfPlotData } = plotData

    const updateData: any = {
      ...restOfPlotData,
    }

    // If title is being updated, regenerate slug and ensure it's unique
    if (plotData.title) {
      let baseSlug = plotData.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/[\s-]+/g, '-')

      // Check if slug needs to be updated (different from current)
      const currentPlot = await prisma.plots.findUnique({ where: { id }, select: { slug: true } })

      if (currentPlot && baseSlug !== currentPlot.slug) {
        // Ensure new slug is unique (excluding current property)
        let slug = baseSlug
        let counter = 1
        while (true) {
          const existing = await prisma.plots.findUnique({ where: { slug } })
          if (!existing || existing.id === id) break
          counter++
          slug = `${baseSlug}-${counter}`
        }
        updateData.slug = slug
      }
    }

    if (bookingAmount !== undefined) updateData.booking_amount = bookingAmount
    if (plotSize !== undefined) updateData.plot_size = plotSize
    if (originalPrice !== undefined) updateData.original_price = originalPrice
    if (reraNumber !== undefined) updateData.rera_number = reraNumber
    if (heroImage !== undefined) updateData.hero_image = heroImage
    if (brochure !== undefined) updateData.brochure = brochure
    if (isFeatured !== undefined) updateData.is_featured = isFeatured
    if (is_published !== undefined) updateData.is_published = is_published

    const updatedPlot = await prisma.plots.update({
      where: { id },
      data: updateData,
    })

    structuredLogger.info('Plot updated', {
      plotId: id,
      userId: session.user.id,
      type: 'plot_update',
    })

    // Invalidate plot caches after update
    await cache.invalidatePlotCaches(id)

    // Convert Decimal fields to numbers for JSON serialization
    const serializedPlot = {
      ...updatedPlot,
      price: updatedPlot.price.toNumber(),
      original_price: updatedPlot.original_price?.toNumber() ?? null,
      booking_amount: updatedPlot.booking_amount.toNumber(),
      plot_size: updatedPlot.plot_size.toNumber(),
      latitude: updatedPlot.latitude?.toNumber() ?? null,
      longitude: updatedPlot.longitude?.toNumber() ?? null,
    }

    return successResponse({ plot: serializedPlot }, 200, 'Plot updated successfully')
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
    await prisma.plots.delete({
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
