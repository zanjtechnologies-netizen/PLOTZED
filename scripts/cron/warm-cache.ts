#!/usr/bin/env tsx
// ================================================
// scripts/cron/warm-cache.ts
// Warm up Redis cache with frequently accessed data
// ================================================

/**
 * Scheduled Task: Cache Warming
 *
 * Purpose:
 * - Pre-load frequently accessed data into Redis cache
 * - Improve response times for homepage and plot listings
 * - Reduce database load during peak traffic
 * - Ensure cache is always warm for better UX
 *
 * Schedule: Every hour (or after deployments)
 *
 * Usage:
 *   npm run cron:warm-cache
 */

import { PrismaClient } from '@prisma/client'
import { cache, CACHE_KEYS, CACHE_TTL } from '@/lib/cache'

const prisma = new PrismaClient()

interface WarmCacheResult {
  featuredPlots: number
  availablePlots: number
  cities: number
  duration: number
}

async function warmCache(): Promise<WarmCacheResult> {
  const startTime = Date.now()

  console.log('╔════════════════════════════════════════════╗')
  console.log('║   CACHE WARMING JOB                        ║')
  console.log('╚════════════════════════════════════════════╝')
  console.log()
  console.log(`Started at: ${new Date().toISOString()}`)
  console.log()

  try {
    let featuredCount = 0
    let availableCount = 0
    let citiesCount = 0

    // 1. Warm up featured plots
    console.log('🔥 Warming featured plots cache...')
    const featuredPlots = await prisma.plot.findMany({
      where: {
        is_featured: true,
        is_published: true,
        status: 'AVAILABLE',
      },
      take: 10,
      orderBy: { created_at: 'desc' },
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
        images: true,
        amenities: true,
        status: true,
        is_featured: true,
        rera_number: true,
        created_at: true,
      },
    })

    await cache.set(
      `${CACHE_KEYS.PLOTS_FEATURED}:6`,
      { plots: featuredPlots, count: featuredPlots.length },
      CACHE_TTL.LONG
    )
    featuredCount = featuredPlots.length
    console.log(`   ✅ Cached ${featuredCount} featured plots`)

    // 2. Warm up available plots (first page)
    console.log('🔥 Warming available plots cache...')
    const availablePlots = await prisma.plot.findMany({
      where: {
        status: 'AVAILABLE',
        is_published: true,
      },
      take: 10,
      orderBy: { created_at: 'desc' },
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
          select: { bookings: true },
        },
      },
    })

    const total = await prisma.plot.count({
      where: {
        status: 'AVAILABLE',
        is_published: true,
      },
    })

    const cacheKey = `plots:list:${JSON.stringify({
      page: 1,
      limit: 10,
      city: null,
      state: null,
      status: null,
      minPrice: null,
      maxPrice: null,
      minSize: null,
      maxSize: null,
      isFeatured: null,
      isPublished: null,
      search: null,
      sortBy: 'created_at',
      sortOrder: 'desc'
    })}`

    await cache.set(
      cacheKey,
      {
        plots: availablePlots,
        pagination: {
          page: 1,
          limit: 10,
          total,
          totalPages: Math.ceil(total / 10),
          hasMore: availablePlots.length < total,
        },
      },
      CACHE_TTL.MEDIUM
    )
    availableCount = availablePlots.length
    console.log(`   ✅ Cached ${availableCount} available plots`)

    // 3. Warm up city-specific featured plots
    console.log('🔥 Warming city-specific caches...')
    const topCities = await prisma.plot.groupBy({
      by: ['city'],
      where: {
        is_published: true,
        status: 'AVAILABLE',
      },
      _count: { city: true },
      orderBy: {
        _count: { city: 'desc' },
      },
      take: 5,
    })

    for (const cityGroup of topCities) {
      const cityPlots = await prisma.plot.findMany({
        where: {
          city: cityGroup.city,
          is_featured: true,
          is_published: true,
          status: 'AVAILABLE',
        },
        take: 6,
        orderBy: { created_at: 'desc' },
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
          images: true,
          amenities: true,
          status: true,
          is_featured: true,
          rera_number: true,
          created_at: true,
        },
      })

      if (cityPlots.length > 0) {
        await cache.set(
          `${CACHE_KEYS.PLOTS_FEATURED}:${cityGroup.city}:6`,
          { plots: cityPlots, count: cityPlots.length },
          CACHE_TTL.LONG
        )
        console.log(`   ✅ Cached ${cityPlots.length} plots for ${cityGroup.city}`)
        citiesCount++
      }
    }

    // 4. Cache admin dashboard stats (if needed)
    console.log('🔥 Warming admin stats cache...')
    const [totalPlots, totalUsers, totalBookings, totalRevenue] = await Promise.all([
      prisma.plot.count(),
      prisma.user.count(),
      prisma.booking.count(),
      prisma.payment.aggregate({
        where: { status: 'COMPLETED' },
        _sum: { amount: true },
      }),
    ])

    await cache.set(
      CACHE_KEYS.ADMIN_STATS,
      {
        totalPlots,
        totalUsers,
        totalBookings,
        totalRevenue: totalRevenue._sum.amount || 0,
      },
      CACHE_TTL.MEDIUM
    )
    console.log(`   ✅ Cached admin dashboard stats`)

    const duration = Date.now() - startTime

    console.log()
    console.log('╔════════════════════════════════════════════╗')
    console.log('║   CACHE WARMING COMPLETED                  ║')
    console.log('╚════════════════════════════════════════════╝')
    console.log(`   Featured plots: ${featuredCount}`)
    console.log(`   Available plots: ${availableCount}`)
    console.log(`   Cities warmed: ${citiesCount}`)
    console.log(`   Duration: ${duration}ms`)
    console.log()

    return {
      featuredPlots: featuredCount,
      availablePlots: availableCount,
      cities: citiesCount,
      duration,
    }
  } catch (error: any) {
    console.error('❌ Cache warming failed:', error.message)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Execute if run directly
if (require.main === module) {
  warmCache()
    .then(() => {
      process.exit(0)
    })
    .catch((error) => {
      console.error('Fatal error:', error)
      process.exit(1)
    })
}

export { warmCache }
