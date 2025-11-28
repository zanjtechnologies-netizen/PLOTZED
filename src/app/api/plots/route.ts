// ================================================
// src/app/api/plots/route.ts - Plots API
// ================================================
export const runtime = "nodejs";

import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { createPlotSchema } from '@/lib/validators'
import { createdResponse, successResponse, withErrorHandling } from '@/lib/api-error-handler'
import { ForbiddenError, UnauthorizedError } from '@/lib/errors'
import { structuredLogger } from '@/lib/structured-logger'
import { cache, CACHE_TTL } from '@/lib/cache'

export const GET = withErrorHandling(
  async (request: NextRequest) => {
    const { searchParams } = new URL(request.url)

    // Pagination
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    // Filters
    const city = searchParams.get('city')
    const state = searchParams.get('state')
    const status = searchParams.get('status')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const minSize = searchParams.get('minSize')
    const maxSize = searchParams.get('maxSize')
    const isFeatured = searchParams.get('featured')
    const isPublished = searchParams.get('published')

    // Search
    const search = searchParams.get('search')

    // Sorting
    const sortBy = searchParams.get('sortBy') || 'created_at'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    // Build where clause
    const where: any = {}

    if (city) where.city = { contains: city, mode: 'insensitive' }
    if (state) where.state = { contains: state, mode: 'insensitive' }
    if (status) where.status = status
    if (isFeatured) where.is_featured = isFeatured === 'true'
    if (isPublished !== null) where.is_published = isPublished !== 'false'
    else where.is_published = true // Default: only published

    // Price range filter
    if (minPrice || maxPrice) {
      where.price = {}
      if (minPrice) where.price.gte = parseFloat(minPrice)
      if (maxPrice) where.price.lte = parseFloat(maxPrice)
    }

    // Size range filter
    if (minSize || maxSize) {
      where.plot_size = {}
      if (minSize) where.plot_size.gte = parseFloat(minSize)
      if (maxSize) where.plot_size.lte = parseFloat(maxSize)
    }

    // Search in title, description, address
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { address: { contains: search, mode: 'insensitive' } },
      ]
    }

    // Generate cache key based on query params
    const cacheKey = `plots:list:${JSON.stringify({ page, limit, city, state, status, minPrice, maxPrice, minSize, maxSize, isFeatured, isPublished, search, sortBy, sortOrder })}`

    // Use cache for GET requests (cache for 5 minutes)
    const result = await cache.get(
      cacheKey,
      async () => {
        // Get total count for pagination
        const total = await prisma.plot.count({ where })

        // Get plots with pagination and sorting
        const plots = await prisma.plot.findMany({
          where,
          skip,
          take: limit,
          orderBy: { [sortBy]: sortOrder },
          select: {
            id: true,
            title: true,
            slug: true,
            description: true,
            price: true,
            booking_amount: true,
            plot_size: true,
            dimensions: true,
            facing: true,
            address: true,
            city: true,
            state: true,
            pincode: true,
            latitude: true,
            longitude: true,
            images: true,
            amenities: true,
            status: true,
            is_featured: true,
            is_published: true,
            created_at: true,
            updated_at: true,
            _count: {
              select: { site_visits: true },
            },
          },
        })

        // Convert Decimal fields to numbers for JSON serialization
        const serializedPlots = plots.map(plot => ({
          ...plot,
          price: plot.price.toNumber(),
          booking_amount: plot.booking_amount.toNumber(),
          plot_size: plot.plot_size.toNumber(),
          latitude: plot.latitude?.toNumber() ?? null,
          longitude: plot.longitude?.toNumber() ?? null,
        }))

        return {
          plots: serializedPlots,
          pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
            hasMore: skip + plots.length < total,
          },
        }
      },
      CACHE_TTL.MEDIUM // 5 minutes
    )

    return successResponse(result)
  },
  'GET /api/plots'
)

export const POST = withErrorHandling(
  async (request: NextRequest) => {
    // ADMIN ONLY: Check authentication and role
    const session = await auth()

    if (!session?.user) {
      throw new UnauthorizedError('Unauthorized. Please login.')
    }

    if (session.user.role !== 'ADMIN') {
      throw new ForbiddenError('Only admins can create plot listings.')
    }

    const body = await request.json()
    const plotData = createPlotSchema.parse(body)

    // Create a URL-friendly slug from the title
    const slug = plotData.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/[\s-]+/g, '-')

    const { bookingAmount, plotSize, reraNumber, isFeatured, is_published, ...restOfPlotData } = plotData

    const newPlot = await prisma.plot.create({
      data: {
        ...restOfPlotData,
        slug,
        booking_amount: bookingAmount,
        plot_size: plotSize,
        rera_number: reraNumber,
        is_featured: isFeatured,
        is_published: is_published,
      },
    })

    structuredLogger.info('Plot created successfully', {
      plotId: newPlot.id,
      userId: session.user.id,
      type: 'plot_creation',
    })

    // Invalidate plot caches after creation
    await cache.invalidatePlotCaches()

    return createdResponse(newPlot, 'Plot created successfully')
  },
  'POST /api/plots'
)
