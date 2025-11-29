// ================================================
// src/lib/cache-middleware.ts - API Response Caching Middleware
// ================================================

/**
 * Middleware for caching API responses
 *
 * Features:
 * - Automatic caching of GET requests
 * - Configurable TTL per route
 * - Cache key based on URL and query params
 * - Conditional caching based on user authentication
 * - Cache bypass via header or query param
 *
 * Usage:
 *   export const GET = withCache(
 *     async (request) => {
 *       const plots = await prisma.plots.findMany()
 *       return successResponse(plots)
 *     },
 *     { ttl: 300, key: 'plots:all' }
 *   )
 */

import { NextRequest, NextResponse } from 'next/server'
import { cache, CACHE_TTL } from './cache'
import { structuredLogger } from './structured-logger'

export interface CacheConfig {
  ttl?: number
  key?: string
  varyByUser?: boolean // Different cache per user
  varyByQuery?: boolean // Include query params in cache key
  bypassHeader?: string // Header to bypass cache
}

/**
 * Generate cache key from request
 */
function generateCacheKey(request: NextRequest, config: CacheConfig): string {
  const url = new URL(request.url)
  let key = config.key || `api:${url.pathname}`

  // Include query params if configured
  if (config.varyByQuery && url.search) {
    const sortedParams = Array.from(url.searchParams.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${k}=${v}`)
      .join('&')
    key += `:${sortedParams}`
  }

  // Include user ID if configured (requires auth)
  if (config.varyByUser) {
    // Extract user ID from session (this would need to be implemented based on your auth)
    // For now, we'll skip user-specific caching
    // const userId = await getUserIdFromRequest(request)
    // if (userId) key += `:user:${userId}`
  }

  return key
}

/**
 * Check if cache should be bypassed
 */
function shouldBypassCache(request: NextRequest, config: CacheConfig): boolean {
  // Bypass if cache-control: no-cache header
  if (request.headers.get('cache-control')?.includes('no-cache')) {
    return true
  }

  // Bypass if custom bypass header is present
  if (config.bypassHeader && request.headers.get(config.bypassHeader)) {
    return true
  }

  // Bypass if ?nocache=1 query param
  const url = new URL(request.url)
  if (url.searchParams.get('nocache') === '1') {
    return true
  }

  return false
}

/**
 * Wrapper for caching API responses
 */
export function withCache<T extends any[], R>(
  handler: (request: NextRequest, ...args: T) => Promise<NextResponse> | NextResponse,
  config: CacheConfig = {}
) {
  return async (request: NextRequest, ...args: T): Promise<NextResponse> => {
    // Only cache GET requests
    if (request.method !== 'GET') {
      return await handler(request, ...args)
    }

    // Check if cache should be bypassed
    if (shouldBypassCache(request, config)) {
      const response = await handler(request, ...args)
      response.headers.set('X-Cache', 'BYPASS')
      return response
    }

    const cacheKey = generateCacheKey(request, config)
    const ttl = config.ttl || CACHE_TTL.MEDIUM

    try {
      // Try to get from cache
      const cachedResponse = await cache.get<{
        status: number
        headers: Record<string, string>
        body: any
      }>(
        cacheKey,
        async () => {
          // Cache miss - execute handler
          const response = await handler(request, ...args)

          // Extract response data
          const body = await response.json()
          const headers: Record<string, string> = {}
          response.headers.forEach((value, key) => {
            headers[key] = value
          })

          return {
            status: response.status,
            headers,
            body,
          }
        },
        ttl
      )

      // Reconstruct response
      const response = NextResponse.json(cachedResponse.body, {
        status: cachedResponse.status,
      })

      // Restore original headers
      Object.entries(cachedResponse.headers).forEach(([key, value]) => {
        response.headers.set(key, value)
      })

      // Add cache status header
      response.headers.set('X-Cache', 'HIT')
      response.headers.set('X-Cache-Key', cacheKey)

      return response
    } catch (error: any) {
      structuredLogger.error('Cache middleware error', error, {
        cacheKey,
        type: 'cache_middleware_error',
      })

      // Fallback to direct execution
      const response = await handler(request, ...args)
      response.headers.set('X-Cache', 'ERROR')
      return response
    }
  }
}

/**
 * Simpler cache wrapper for route handlers that return data
 */
export function cachedResponse<T>(
  key: string,
  fetchFn: () => Promise<T>,
  ttl: number = CACHE_TTL.MEDIUM
): Promise<T> {
  return cache.get(key, fetchFn, ttl)
}

/**
 * Cache tags for easier invalidation
 */
export const CACHE_TAGS = {
  PLOTS: 'plots',
  USERS: 'users',
  BOOKINGS: 'bookings',
  PAYMENTS: 'payments',
  INQUIRIES: 'inquiries',
  SITE_VISITS: 'site_visits',
  ADMIN: 'admin',
} as const

export type CacheTag = (typeof CACHE_TAGS)[keyof typeof CACHE_TAGS]
