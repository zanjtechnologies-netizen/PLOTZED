// ================================================
// src/app/api/plots/search/route.ts - Advanced Plot Search
// ================================================
export const runtime = "nodejs";

import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse, withErrorHandling } from '@/lib/api-error-handler'

// Helper to serialize plot data, converting Decimal types to numbers
const serializePlot = (plot: any) => ({
  ...plot,
  price: plot.price.toNumber(),
  booking_amount: plot.booking_amount.toNumber(),
  plot_size: plot.plot_size.toNumber(),
  latitude: plot.latitude?.toNumber() ?? null,
  longitude: plot.longitude?.toNumber() ?? null,
})

// GET - Search by slug
export const GET = withErrorHandling(
  async (request: NextRequest) => {
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get('slug')

    if (!slug) {
      return successResponse({ plots: [] })
    }

    const plot = await prisma.plots.findUnique({
      where: { slug },
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
        rera_number: true,
        created_at: true,
        updated_at: true,
      },
    })

    if (!plot || !plot.is_published) {
      return successResponse({ plots: [] })
    }

    const serializedPlot = serializePlot(plot)

    return successResponse({
      plots: [serializedPlot],
      pagination: {
        page: 1,
        limit: 1,
        total: 1,
        totalPages: 1,
        hasMore: false,
      },
    })
  },
  'GET /api/plots/search'
)

export const POST = withErrorHandling(
  async (request: NextRequest) => {
    const body = await request.json()

    const {
      search,
      city,
      state,
      pincode,
      minPrice,
      maxPrice,
      minSize,
      maxSize,
      status,
      amenities,
      facing,
      isFeatured,
      latitude,
      longitude,
      radiusKm = 10,
      page = 1,
      limit = 10,
      sortBy = 'created_at',
      sortOrder = 'desc',
    } = body

    const skip = (page - 1) * limit

    // Whitelist for sortBy parameter to prevent malicious input
    const allowedSortBy = [
      'created_at',
      'price',
      'plot_size',
      'updated_at',
      'title',
    ]
    if (!allowedSortBy.includes(sortBy)) {
      throw new Error(`Invalid sortBy parameter. Allowed values are: ${allowedSortBy.join(', ')}`)
    }

    // Build where clause
    const where: any = { is_published: true }

    // Text search
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { address: { contains: search, mode: 'insensitive' } },
        { city: { contains: search, mode: 'insensitive' } },
        { state: { contains: search, mode: 'insensitive' } },
      ]
    }

    // Location filters
    if (city) where.city = { contains: city, mode: 'insensitive' }
    if (state) where.state = { contains: state, mode: 'insensitive' }
    if (pincode) where.pincode = pincode

    // Status filter
    if (status) {
      if (Array.isArray(status)) {
        where.status = { in: status }
      } else {
        where.status = status
      }
    } else {
      // Default: only available plots
      where.status = 'AVAILABLE'
    }

    // Price range
    if (minPrice || maxPrice) {
      where.price = {}
      if (minPrice) where.price.gte = parseFloat(minPrice)
      if (maxPrice) where.price.lte = parseFloat(maxPrice)
    }

    // Size range
    if (minSize || maxSize) {
      where.plot_size = {}
      if (minSize) where.plot_size.gte = parseFloat(minSize)
      if (maxSize) where.plot_size.lte = parseFloat(maxSize)
    }

    // Amenities filter (array contains)
    if (amenities && Array.isArray(amenities) && amenities.length > 0) {
      where.amenities = {
        hasEvery: amenities,
      }
    }

    // Facing filter
    if (facing) {
      if (Array.isArray(facing)) {
        where.facing = { in: facing }
      } else {
        where.facing = facing
      }
    }

    // Featured filter
    if (isFeatured !== undefined) {
      where.is_featured = isFeatured
    }

    // Geolocation search (nearby plots)
    // Note: For production, consider using PostGIS for better performance
    let plots: any[] = []

    if (latitude && longitude) {
      const lat = parseFloat(latitude)
      const lon = parseFloat(longitude)

      // --- Bounding Box Optimization ---
      // 1. Calculate a square bounding box to narrow down the initial search.
      // This is much faster than calculating the distance for every plot in the DB.
      const latRadians = (lat * Math.PI) / 180
      const latRadius = radiusKm / 110.574 // Latitude degrees per km
      const lonRadius = radiusKm / (111.32 * Math.cos(latRadians)) // Longitude degrees per km

      const latMin = lat - latRadius
      const latMax = lat + latRadius
      const lonMin = lon - lonRadius
      const lonMax = lon + lonRadius

      // 2. Fetch plots within the bounding box
      const plotsInBoundingBox = await prisma.plots.findMany({
        where: {
          ...where,
          latitude: { gte: latMin, lte: latMax, not: null },
          longitude: { gte: lonMin, lte: lonMax, not: null },
        },
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
          rera_number: true,
          created_at: true,
          updated_at: true,
        },
      })

      // 3. Perform precise Haversine distance calculation and filtering on the smaller dataset
      plots = plotsInBoundingBox
        .map((plot: any) => {
          const lat2 = parseFloat(plot.latitude?.toString() || '0')
          const lon2 = parseFloat(plot.longitude?.toString() || '0')

          // Haversine formula
          const R = 6371 // Earth's radius in km
          const dLat = ((lat2 - lat) * Math.PI) / 180
          const dLon = ((lon2 - lon) * Math.PI) / 180
          const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos((lat * Math.PI) / 180) *
              Math.cos((lat2 * Math.PI) / 180) *
              Math.sin(dLon / 2) *
              Math.sin(dLon / 2)
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
          const distance = R * c

          const serialized = serializePlot(plot)
          return {
            ...serialized,
            distance: parseFloat(distance.toFixed(2)),
          }
        })
        .filter((plot: any) => plot.distance <= radiusKm)
        .sort((a: any, b: any) => a.distance - b.distance)

      // Apply pagination to filtered results
      const total = plots.length
      plots = plots.slice(skip, skip + limit)

      return successResponse({
        plots,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasMore: skip + plots.length < total,
        },
        filters: {
          radiusKm,
          latitude,
          longitude,
        },
      })
    } else {
      // Regular search without geolocation
      const total = await prisma.plots.count({ where })

      plots = await prisma.plots.findMany({
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
          rera_number: true,
          created_at: true,
          updated_at: true,
        },
      })

      // Convert Decimal fields to numbers for JSON serialization
      const serializedPlots = plots.map(serializePlot)

      return successResponse({
        plots: serializedPlots,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasMore: skip + plots.length < total,
        },
      })
    }
  },
  'POST /api/plots/search'
)
