// ================================================
// src/app/api/plots/route.ts - Plots API
// ================================================
export const runtime = "nodejs";

import { NextRequest } from 'next/server'
import { randomUUID } from 'crypto'
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
    const where: any = {
      AND: []
    }

    // Handle Puducherry/Pondicherry special case
    if (city) {
      if (city === 'Puducherry / Pondicherry') {
        where.AND.push({
          OR: [
            { city: { contains: 'Puducherry', mode: 'insensitive' } },
            { city: { contains: 'Pondicherry', mode: 'insensitive' } },
          ]
        })
      } else {
        where.AND.push({ city: { contains: city, mode: 'insensitive' } })
      }
    }

    if (state) where.AND.push({ state: { contains: state, mode: 'insensitive' } })
    if (status) where.AND.push({ status })
    if (isFeatured) where.AND.push({ is_featured: isFeatured === 'true' })

    // Published filter - ALWAYS default to showing only published plots
    // Only show unpublished if explicitly requested with published=false
    if (isPublished === 'false') {
      where.AND.push({ is_published: false })
    } else if (isPublished === 'all') {
      // Don't filter by published status
      // Allow admins to see all plots
    } else {
      // Default: only show published plots
      where.AND.push({ is_published: true })
    }

    // Price range filter
    if (minPrice || maxPrice) {
      const priceFilter: any = {}
      if (minPrice) priceFilter.gte = parseFloat(minPrice)
      if (maxPrice) priceFilter.lte = parseFloat(maxPrice)
      where.AND.push({ price: priceFilter })
    }

    // Size range filter
    if (minSize || maxSize) {
      const sizeFilter: any = {}
      if (minSize) sizeFilter.gte = parseFloat(minSize)
      if (maxSize) sizeFilter.lte = parseFloat(maxSize)
      where.AND.push({ plot_size: sizeFilter })
    }

    // Search in title, description, address
    if (search) {
      where.AND.push({
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { address: { contains: search, mode: 'insensitive' } },
        ]
      })
    }

    // Clean up empty AND array
    const finalWhere = where.AND.length > 0 ? where : {}

    // TEMPORARY: Disable cache to test if cache is causing the issue
    // Generate cache key based on query params
    // const cacheKey = `plots:list:${JSON.stringify({ page, limit, city, state, status, minPrice, maxPrice, minSize, maxSize, isFeatured, isPublished, search, sortBy, sortOrder })}`

    // Direct database query (cache disabled for debugging)
    // Get total count for pagination
    const total = await prisma.plots.count({ where: finalWhere })

    structuredLogger.info('Fetching plots', {
      where: finalWhere,
      total,
      page,
      limit,
      type: 'plots_fetch',
    })

    // Get plots with pagination and sorting
    // Featured properties appear first, then sorted by the specified field
    const plots = await prisma.plots.findMany({
      where: finalWhere,
      skip,
      take: limit,
      orderBy: [
        { is_featured: 'desc' }, // Featured properties first
        { created_at: 'desc'},
        /*{ [sortBy]: sortOrder },*/  // Then by specified sort field
      ],
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
    const serializedPlots = plots.map((plot: any) => ({
      ...plot,
      price: plot.price.toNumber(),
      booking_amount: plot.booking_amount.toNumber(),
      plot_size: plot.plot_size.toNumber(),
      latitude: plot.latitude?.toNumber() ?? null,
      longitude: plot.longitude?.toNumber() ?? null,
    }))

    const result = {
      plots: serializedPlots,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: skip + plots.length < total,
      },
    }

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

    const newPlot = await prisma.plots.create({
      data: {
        id: randomUUID(),
        updated_at: new Date(),
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
