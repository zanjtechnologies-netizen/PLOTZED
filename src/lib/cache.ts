// ================================================
// src/lib/cache.ts - Redis Cache Layer
// ================================================

/**
 * Redis-based caching for improved performance
 *
 * Features:
 * - Plot listings caching
 * - User session caching
 * - Search results caching
 * - Automatic cache invalidation
 * - TTL-based expiration
 * - Graceful fallback on Redis failures
 *
 * Usage:
 *   const plots = await cache.get('plots:all', async () => {
 *     return await prisma.plot.findMany()
 *   }, 300) // Cache for 5 minutes
 */

import { Redis } from '@upstash/redis'
import { structuredLogger } from './structured-logger'

// Initialize Redis connection
let redis: Redis | null = null

function getRedisClient(): Redis | null {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    structuredLogger.warn('Redis not configured, caching disabled', {
      type: 'cache_disabled',
    })
    return null
  }

  if (!redis) {
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  }

  return redis
}

// Cache key prefixes
export const CACHE_KEYS = {
  PLOTS_ALL: 'plots:all',
  PLOTS_FEATURED: 'plots:featured',
  PLOTS_AVAILABLE: 'plots:available',
  PLOT_BY_ID: (id: string) => `plot:${id}`,
  PLOT_BY_SLUG: (slug: string) => `plot:slug:${slug}`,
  USER_BY_ID: (id: string) => `user:${id}`,
  USER_BOOKINGS: (userId: string) => `user:${userId}:bookings`,
  USER_INQUIRIES: (userId: string) => `user:${userId}:inquiries`,
  SEARCH_RESULTS: (query: string) => `search:${query}`,
  STATS_DASHBOARD: 'stats:dashboard',
  ADMIN_STATS: 'admin:stats',
} as const

// Default TTL values (in seconds)
export const CACHE_TTL = {
  SHORT: 60, // 1 minute
  MEDIUM: 300, // 5 minutes
  LONG: 900, // 15 minutes
  HOUR: 3600, // 1 hour
  DAY: 86400, // 24 hours
} as const

interface CacheOptions {
  ttl?: number
  tags?: string[]
}

/**
 * Get data from cache or execute function and cache result
 */
export async function get<T>(
  key: string,
  fetchFn: () => Promise<T>,
  ttlSeconds: number = CACHE_TTL.MEDIUM
): Promise<T> {
  const client = getRedisClient()

  // If Redis is not available, just fetch the data
  if (!client) {
    return await fetchFn()
  }

  try {
    // Try to get from cache
    const cached = await client.get<T>(key)

    if (cached !== null) {
      structuredLogger.debug('Cache hit', {
        key,
        type: 'cache_hit',
      })
      return cached
    }

    // Cache miss - fetch data
    structuredLogger.debug('Cache miss', {
      key,
      type: 'cache_miss',
    })

    const data = await fetchFn()

    // Store in cache
    await client.setex(key, ttlSeconds, JSON.stringify(data))

    structuredLogger.debug('Cache set', {
      key,
      ttl: ttlSeconds,
      type: 'cache_set',
    })

    return data
  } catch (error: any) {
    structuredLogger.error('Cache error, falling back to direct fetch', error, {
      key,
      type: 'cache_error',
    })
    // Fallback to direct fetch on error
    return await fetchFn()
  }
}

/**
 * Set a value in cache
 */
export async function set<T>(
  key: string,
  value: T,
  ttlSeconds: number = CACHE_TTL.MEDIUM
): Promise<void> {
  const client = getRedisClient()
  if (!client) return

  try {
    await client.setex(key, ttlSeconds, JSON.stringify(value))
    structuredLogger.debug('Cache set', {
      key,
      ttl: ttlSeconds,
      type: 'cache_set',
    })
  } catch (error: any) {
    structuredLogger.error('Failed to set cache', error, {
      key,
      type: 'cache_error',
    })
  }
}

/**
 * Delete a single key from cache
 */
export async function del(key: string): Promise<void> {
  const client = getRedisClient()
  if (!client) return

  try {
    await client.del(key)
    structuredLogger.debug('Cache invalidated', {
      key,
      type: 'cache_invalidate',
    })
  } catch (error: any) {
    structuredLogger.error('Failed to delete cache', error, {
      key,
      type: 'cache_error',
    })
  }
}

/**
 * Delete multiple keys matching a pattern
 */
export async function delPattern(pattern: string): Promise<void> {
  const client = getRedisClient()
  if (!client) return

  try {
    // Get all keys matching pattern
    const keys = await client.keys(pattern)

    if (keys.length > 0) {
      await client.del(...keys)
      structuredLogger.info('Cache pattern invalidated', {
        pattern,
        count: keys.length,
        type: 'cache_invalidate_pattern',
      })
    }
  } catch (error: any) {
    structuredLogger.error('Failed to delete cache pattern', error, {
      pattern,
      type: 'cache_error',
    })
  }
}

/**
 * Invalidate all plot-related caches
 */
export async function invalidatePlotCaches(plotId?: string): Promise<void> {
  const keysToInvalidate: string[] = [
    CACHE_KEYS.PLOTS_ALL,
    CACHE_KEYS.PLOTS_FEATURED,
    CACHE_KEYS.PLOTS_AVAILABLE,
  ]

  if (plotId) {
    keysToInvalidate.push(CACHE_KEYS.PLOT_BY_ID(plotId))
  }

  await Promise.all(keysToInvalidate.map((key) => del(key)))

  // Also invalidate all search results
  await delPattern('search:*')

  structuredLogger.info('Plot caches invalidated', {
    plotId,
    type: 'cache_invalidate_plots',
  })
}

/**
 * Invalidate user-related caches
 */
export async function invalidateUserCaches(userId: string): Promise<void> {
  const keysToInvalidate = [
    CACHE_KEYS.USER_BY_ID(userId),
    CACHE_KEYS.USER_BOOKINGS(userId),
    CACHE_KEYS.USER_INQUIRIES(userId),
  ]

  await Promise.all(keysToInvalidate.map((key) => del(key)))

  structuredLogger.info('User caches invalidated', {
    userId,
    type: 'cache_invalidate_user',
  })
}

/**
 * Invalidate admin stats caches
 */
export async function invalidateAdminCaches(): Promise<void> {
  const keysToInvalidate = [CACHE_KEYS.ADMIN_STATS, CACHE_KEYS.STATS_DASHBOARD]

  await Promise.all(keysToInvalidate.map((key) => del(key)))

  structuredLogger.info('Admin caches invalidated', {
    type: 'cache_invalidate_admin',
  })
}

/**
 * Clear all caches
 */
export async function clearAll(): Promise<void> {
  const client = getRedisClient()
  if (!client) return

  try {
    await client.flushdb()
    structuredLogger.warn('All caches cleared', {
      type: 'cache_flush_all',
    })
  } catch (error: any) {
    structuredLogger.error('Failed to clear all caches', error, {
      type: 'cache_error',
    })
  }
}

/**
 * Get cache statistics
 */
export async function getCacheStats(): Promise<{
  info: Record<string, any> | null
  keyCount: number
  plotKeys: number
  userKeys: number
  searchKeys: number
}> {
  const client = getRedisClient()

  if (!client) {
    return {
      info: null,
      keyCount: 0,
      plotKeys: 0,
      userKeys: 0,
      searchKeys: 0,
    }
  }

  try {
    const [allKeys, plotKeys, userKeys, searchKeys] = await Promise.all([
      client.keys('*'),
      client.keys('plot*'),
      client.keys('user:*'),
      client.keys('search:*'),
    ])

    return {
      info: null, // Upstash Redis doesn't support INFO command
      keyCount: allKeys.length,
      plotKeys: plotKeys.length,
      userKeys: userKeys.length,
      searchKeys: searchKeys.length,
    }
  } catch (error: any) {
    structuredLogger.error('Failed to get cache stats', error, {
      type: 'cache_error',
    })
    return {
      info: null,
      keyCount: 0,
      plotKeys: 0,
      userKeys: 0,
      searchKeys: 0,
    }
  }
}

/**
 * Warm up cache with frequently accessed data
 */
export async function warmCache(): Promise<void> {
  structuredLogger.info('Starting cache warm-up', {
    type: 'cache_warmup_start',
  })

  try {
    // Import here to avoid circular dependencies
    const { PrismaClient } = await import('@prisma/client')
    const prisma = new PrismaClient()

    try {
      // Cache featured plots
      const featuredPlots = await prisma.plot.findMany({
        where: { is_featured: true, status: 'AVAILABLE' },
        take: 10,
        orderBy: { created_at: 'desc' },
      })
      await set(CACHE_KEYS.PLOTS_FEATURED, featuredPlots, CACHE_TTL.LONG)

      // Cache available plots
      const availablePlots = await prisma.plot.findMany({
        where: { status: 'AVAILABLE' },
        take: 50,
        orderBy: { created_at: 'desc' },
      })
      await set(CACHE_KEYS.PLOTS_AVAILABLE, availablePlots, CACHE_TTL.MEDIUM)

      structuredLogger.info('Cache warm-up completed', {
        featuredCount: featuredPlots.length,
        availableCount: availablePlots.length,
        type: 'cache_warmup_complete',
      })
    } finally {
      await prisma.$disconnect()
    }
  } catch (error: any) {
    structuredLogger.error('Cache warm-up failed', error, {
      type: 'cache_warmup_error',
    })
  }
}

// Export default cache object
export const cache = {
  get,
  set,
  del,
  delPattern,
  invalidatePlotCaches,
  invalidateUserCaches,
  invalidateAdminCaches,
  clearAll,
  getCacheStats,
  warmCache,
  keys: CACHE_KEYS,
  ttl: CACHE_TTL,
}

export default cache
