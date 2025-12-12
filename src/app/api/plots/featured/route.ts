// ================================================
// src/app/api/plots/featured/route.ts - Featured Plots
// ================================================
export const runtime = "nodejs";

import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse, withErrorHandling } from '@/lib/api-error-handler'
import { Decimal } from '@prisma/client/runtime/library'
import { cache, CACHE_KEYS, CACHE_TTL } from '@/lib/cache'

export const GET = withErrorHandling(
  async (request: NextRequest) => {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '6')
    const city = searchParams.get('city')

    const where: any = {
      is_featured: true,
      is_published: true,
      status: 'AVAILABLE',
    }

    if (city) {
      where.city = { contains: city, mode: 'insensitive' }
    }

    // Cache key includes city filter
    const cacheKey = city ? `${CACHE_KEYS.PLOTS_FEATURED}:${city}:${limit}` : `${CACHE_KEYS.PLOTS_FEATURED}:${limit}`

    const result = await cache.get(
      cacheKey,
      async () => {
        const plots = await prisma.plots.findMany({
          where,
          take: limit,
          orderBy: { created_at: 'desc' },
          select: {
            id: true,
            title: true,
            slug: true,
            description: true,
            price: true,
            original_price: true,
            booking_amount: true,
            plot_size: true,
            dimensions: true,
            facing: true,
            address: true,
            city: true,
            state: true,
            pincode: true,
            images: true,
            brochure: true,
            amenities: true,
            nearby_places: true,
            status: true,
            is_featured: true,
            rera_number: true,
            created_at: true,
          },
        })

        // Convert Decimal fields to numbers for JSON serialization
        const serializedPlots = plots.map((plot) => ({
          ...plot,
          price: plot.price.toNumber(),
          original_price: plot.original_price?.toNumber() ?? null,
          booking_amount: plot.booking_amount.toNumber(),
          plot_size: plot.plot_size.toNumber(),
        }))

        return {
          plots: serializedPlots,
          count: plots.length,
        }
      },
      CACHE_TTL.LONG // 15 minutes for featured plots
    )

    return successResponse(result)
  },
  'GET /api/plots/featured'
)
