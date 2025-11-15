// ================================================
// src/app/api/health/route.ts - Health Check Endpoint
// ================================================

/**
 * Comprehensive health check endpoint
 *
 * GET /api/health
 * - Returns application health status
 * - Checks database connectivity
 * - Checks Redis connectivity (if configured)
 * - Returns enabled features
 * - Returns system information
 *
 * Use for:
 * - Load balancer health checks
 * - Monitoring systems
 * - Deployment verification
 */
export const runtime = "nodejs";

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getFeatureFlags, getEnv } from '@/lib/env-validation'

export const dynamic = 'force-dynamic'

export async function GET() {
  const startTime = Date.now()
  const features = getFeatureFlags()
  const env = getEnv()

  const health: any = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: env.NODE_ENV,
    version: process.env.npm_package_version || 'unknown',
    services: {
      api: { status: 'operational', responseTime: 0 },
      database: { status: 'unknown', responseTime: 0 },
      redis: { status: 'unknown', responseTime: 0 },
    },
    features: {
      caching: features.caching,
      rateLimiting: features.rateLimiting,
      email: features.email,
      payments: features.payments,
      backups: features.backups,
      sms: features.sms,
      errorTracking: features.sentry,
    },
  }

  let isHealthy = true

  // 1. Check database
  try {
    const dbStart = Date.now()
    await prisma.$queryRaw`SELECT 1`
    const dbTime = Date.now() - dbStart

    health.services.database = {
      status: 'connected',
      responseTime: dbTime,
    }
  } catch (error: any) {
    health.services.database = {
      status: 'disconnected',
      error: error.message,
    }
    isHealthy = false
  }

  // 2. Check Redis (if configured)
  if (features.redis) {
    try {
      const { Redis } = await import('@upstash/redis')
      const redis = new Redis({
        url: env.UPSTASH_REDIS_REST_URL!,
        token: env.UPSTASH_REDIS_REST_TOKEN!,
      })

      const redisStart = Date.now()
      await redis.ping()
      const redisTime = Date.now() - redisStart

      health.services.redis = {
        status: 'connected',
        responseTime: redisTime,
      }
    } catch (error: any) {
      health.services.redis = {
        status: 'disconnected',
        error: error.message,
      }
      // Redis is optional, don't mark as unhealthy
    }
  } else {
    health.services.redis = {
      status: 'not_configured',
    }
  }

  // Set overall status
  health.status = isHealthy ? 'healthy' : 'unhealthy'
  health.services.api.responseTime = Date.now() - startTime

  return NextResponse.json(health, {
    status: isHealthy ? 200 : 503,
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  })
}