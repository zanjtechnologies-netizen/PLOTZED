// ================================================
// src/app/api/plots/search/route.ts - Advanced Plot Search
// ================================================
export const runtime = "nodejs";

import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse, withErrorHandling } from '@/lib/api-error-handler'

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
      // Fetch all matching plots with coordinates
      const allPlots = await prisma.plot.findMany({
        where: {
          ...where,
          latitude: { not: null },
          longitude: { not: null },
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

      // Calculate distance for each plot using Haversine formula
      const lat1 = parseFloat(latitude)
      const lon1 = parseFloat(longitude)

      plots = allPlots
        .map((plot) => {
          const lat2 = parseFloat(plot.latitude?.toString() || '0')
          const lon2 = parseFloat(plot.longitude?.toString() || '0')

          // Haversine formula
          const R = 6371 // Earth's radius in km
          const dLat = ((lat2 - lat1) * Math.PI) / 180
          const dLon = ((lon2 - lon1) * Math.PI) / 180
          const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos((lat1 * Math.PI) / 180) *
              Math.cos((lat2 * Math.PI) / 180) *
              Math.sin(dLon / 2) *
              Math.sin(dLon / 2)
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
          const distance = R * c

          return {
            ...plot,
            price: plot.price.toNumber(),
            booking_amount: plot.booking_amount.toNumber(),
            plot_size: plot.plot_size.toNumber(),
            latitude: plot.latitude?.toNumber() ?? null,
            longitude: plot.longitude?.toNumber() ?? null,
            distance: parseFloat(distance.toFixed(2)),
          }
        })
        .filter((plot) => plot.distance <= radiusKm)
        .sort((a, b) => a.distance - b.distance)

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
      const total = await prisma.plot.count({ where })

      plots = await prisma.plot.findMany({
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
      const serializedPlots = plots.map(plot => ({
        ...plot,
        price: plot.price.toNumber(),
        booking_amount: plot.booking_amount.toNumber(),
        plot_size: plot.plot_size.toNumber(),
        latitude: plot.latitude?.toNumber() ?? null,
        longitude: plot.longitude?.toNumber() ?? null,
      }))

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
