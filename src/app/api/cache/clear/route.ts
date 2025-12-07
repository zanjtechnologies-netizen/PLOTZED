// ================================================
// src/app/api/cache/clear/route.ts
// Public endpoint to clear plot caches (for production debugging)
// ================================================
export const runtime = "nodejs";

import { NextRequest } from 'next/server';
import { cache } from '@/lib/cache';
import { successResponse, withErrorHandling } from '@/lib/api-error-handler';

export const POST = withErrorHandling(
  async (request: NextRequest) => {
    // Clear all plot-related caches
    await cache.clearAll();

    return successResponse(
      { message: 'All caches cleared successfully' },
      200,
      'Cache cleared'
    );
  },
  'POST /api/cache/clear'
);

export const GET = withErrorHandling(
  async (request: NextRequest) => {
    // Get cache statistics
    const stats = await cache.getCacheStats();

    return successResponse(
      { stats },
      200,
      'Cache stats retrieved'
    );
  },
  'GET /api/cache/clear'
);
