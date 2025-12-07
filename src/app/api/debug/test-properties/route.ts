// ================================================
// src/app/api/debug/test-properties/route.ts
// Test endpoint to simulate properties page API call
// ================================================
export const runtime = "nodejs";

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, withErrorHandling } from '@/lib/api-error-handler';
import { cache, CACHE_TTL } from '@/lib/cache';

export const GET = withErrorHandling(
  async (request: NextRequest) => {
    // Simulate exact same params as properties page
    const page = 1;
    const limit = 12;
    const skip = (page - 1) * limit;

    // Build where clause (same as /api/plots)
    const where: any = {
      is_published: true  // Default filter
    };

    console.log('[DEBUG] Where clause:', JSON.stringify(where));

    // Direct database query (bypass cache)
    const total = await prisma.plots.count({ where });
    console.log('[DEBUG] Total count:', total);

    const plots = await prisma.plots.findMany({
      where,
      skip,
      take: limit,
      orderBy: [
        { is_featured: 'desc' },
        { created_at: 'desc'},
      ],
      select: {
        id: true,
        title: true,
        slug: true,
        status: true,
        price: true,
        plot_size: true,
        city: true,
        is_published: true,
        is_featured: true,
      },
    });

    console.log('[DEBUG] Plots found:', plots.length);

    // Check cache
    const cacheKey = `plots:list:${JSON.stringify({ page, limit, city: null, state: null, status: null, minPrice: null, maxPrice: null, minSize: null, maxSize: null, isFeatured: null, isPublished: null, search: null, sortBy: 'created_at', sortOrder: 'desc' })}`;

    const cacheStats = await cache.getCacheStats();

    // Serialize plots
    const serializedPlots = plots.map((plot: any) => ({
      ...plot,
      price: plot.price.toNumber(),
      plot_size: plot.plot_size.toNumber(),
    }));

    return successResponse({
      test: 'properties-page-simulation',
      database: {
        totalCount: total,
        plotsReturned: plots.length,
        where: where,
      },
      cache: {
        key: cacheKey,
        stats: cacheStats,
      },
      samplePlots: serializedPlots.slice(0, 3),
      actualApiCall: '/api/plots?page=1&limit=12',
      recommendation: total > 0
        ? `✅ Database has ${total} published plots. Cache might be the issue.`
        : `❌ No published plots in database!`,
    });
  },
  'GET /api/debug/test-properties'
);
