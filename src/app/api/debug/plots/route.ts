// ================================================
// src/app/api/debug/plots/route.ts
// Debug endpoint to check plot visibility
// ================================================
export const runtime = "nodejs";

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, withErrorHandling } from '@/lib/api-error-handler';

export const GET = withErrorHandling(
  async (request: NextRequest) => {
    // Count all plots
    const totalPlots = await prisma.plots.count();
    const publishedPlots = await prisma.plots.count({ where: { is_published: true } });
    const unpublishedPlots = await prisma.plots.count({ where: { is_published: false } });

    // Count by status
    const availablePlots = await prisma.plots.count({
      where: { is_published: true, status: 'AVAILABLE' }
    });
    const bookedPlots = await prisma.plots.count({
      where: { is_published: true, status: 'BOOKED' }
    });
    const soldPlots = await prisma.plots.count({
      where: { is_published: true, status: 'SOLD' }
    });

    // Get sample plots
    const samplePlots = await prisma.plots.findMany({
      where: { is_published: true },
      take: 5,
      select: {
        id: true,
        title: true,
        slug: true,
        status: true,
        is_published: true,
        is_featured: true,
        city: true,
      },
      orderBy: { created_at: 'desc' }
    });

    // Check environment
    const hasRedis = !!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);

    return successResponse({
      database: {
        total: totalPlots,
        published: publishedPlots,
        unpublished: unpublishedPlots,
      },
      byStatus: {
        available: availablePlots,
        booked: bookedPlots,
        sold: soldPlots,
      },
      environment: {
        redis: hasRedis ? 'configured' : 'not configured',
        nodeEnv: process.env.NODE_ENV,
      },
      samplePlots: samplePlots.map(plot => ({
        title: plot.title,
        slug: plot.slug,
        status: plot.status,
        published: plot.is_published,
        featured: plot.is_featured,
        city: plot.city,
      })),
    });
  },
  'GET /api/debug/plots'
);
