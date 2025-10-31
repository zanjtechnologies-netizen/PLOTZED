// ================================================
// Usage Example in API Route
// ================================================

/*
// src/app/api/plots/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { rateLimit } from '@/lib/rate-limit-redis'

export async function GET(request: NextRequest) {
  // Rate limiting
  const identifier = request.ip || 'unknown'
  const rateLimitResult = await rateLimit(identifier, 100, 15 * 60)
  
  if (!rateLimitResult.success) {
    return NextResponse.json(
      { error: 'Rate limit exceeded' },
      { 
        status: 429,
        headers: {
          'X-RateLimit-Limit': String(rateLimitResult.limit),
          'X-RateLimit-Remaining': String(rateLimitResult.remaining),
          'X-RateLimit-Reset': String(rateLimitResult.reset),
        }
      }
    )
  }
  
  // Fetch plots
  const plots = await prisma.plot.findMany({
    where: { is_published: true },
    orderBy: { created_at: 'desc' },
  })
  
  return NextResponse.json(plots)
}
*/