// ================================================
// src/app/api/admin/cache/clear-all/route.ts
// ================================================
export const runtime = "nodejs";

import { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';
import { cache } from '@/lib/cache';
import { successResponse, withErrorHandling } from '@/lib/api-error-handler';
import { ForbiddenError, UnauthorizedError } from '@/lib/errors';

export const POST = withErrorHandling(
  async (request: NextRequest) => {
    const session = await auth();

    if (!session?.user) {
      throw new UnauthorizedError('Unauthorized');
    }

    if (session.user.role !== 'ADMIN') {
      throw new ForbiddenError('Admin access required');
    }

    // Clear all Redis cache
    await cache.invalidateAll();

    return successResponse(
      { message: 'All caches cleared successfully' },
      200,
      'Cache cleared'
    );
  },
  'POST /api/admin/cache/clear-all'
);
