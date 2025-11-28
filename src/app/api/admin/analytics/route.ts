// ================================================
// src/app/api/admin/analytics/route.ts - Advanced Analytics Dashboard (Site Visits Only)
// ================================================
export const runtime = "nodejs";

import { NextRequest } from 'next/server'
import { z } from 'zod'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { successResponse, withErrorHandling } from '@/lib/api-error-handler'
import { ForbiddenError, UnauthorizedError } from '@/lib/errors'
import { structuredLogger } from '@/lib/structured-logger'

// Validation schema for query parameters
const analyticsQuerySchema = z.object({
  period: z.string().optional().default('30').transform(Number).pipe(z.number().min(1).max(365)),
  granularity: z.enum(['day', 'week', 'month']).nullable().optional().default('day'),
  metrics: z.string().nullable().optional(), // Comma-separated: users,plots,siteVisits
})

export const GET = withErrorHandling(
  async (request: NextRequest) => {
    const startTime = Date.now()

    // 1. Authentication & Authorization
    const session = await auth()

    if (!session?.user) {
      throw new UnauthorizedError('Authentication required')
    }

    if (session.user.role !== 'ADMIN') {
      throw new ForbiddenError('Admin access required')
    }

    // 2. Validate query parameters
    const { searchParams } = new URL(request.url)
    const { period } = analyticsQuerySchema.parse({
      period: searchParams.get('period'),
      granularity: searchParams.get('granularity'),
      metrics: searchParams.get('metrics'),
    })

    // 3. Calculate date range
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - period)

    // 4. Log analytics request
    structuredLogger.info('Admin analytics requested', {
      userId: session.user.id,
      period,
      type: 'admin_analytics',
    })

    // 5. Fetch comprehensive analytics data in parallel
    const [
      // Plot analytics
      plotStats,
      plotsByCity,
      plotsByStatus,
      recentPlots,

      // Site Visit analytics
      siteVisitStats,
      siteVisitsByStatus,
      recentSiteVisits,

      // User analytics
      userStats,
      newUsersCount,

      // Inquiry analytics
      inquiryStats,
      inquiryByStatus,
    ] = await Promise.all([
      // Plot statistics
      prisma.plot.groupBy({
        by: ['status'],
        _count: true,
      }),

      prisma.plot.groupBy({
        by: ['city'],
        _count: true,
        orderBy: { _count: { id: 'desc' } },
        take: 10,
      }),

      prisma.plot.count({ where: { is_published: true } }),

      prisma.plot.findMany({
        where: { created_at: { gte: startDate } },
        orderBy: { created_at: 'desc' },
        take: 5,
        select: {
          id: true,
          title: true,
          city: true,
          price: true,
          status: true,
          created_at: true,
        },
      }).then(plots => plots.map(plot => ({
        ...plot,
        price: plot.price.toNumber(),
      }))),

      // Site Visit statistics
      prisma.siteVisit.count({
        where: { created_at: { gte: startDate } },
      }),

      prisma.siteVisit.groupBy({
        by: ['status'],
        _count: true,
      }),

      prisma.siteVisit.findMany({
        where: { created_at: { gte: startDate } },
        orderBy: { created_at: 'desc' },
        take: 10,
        select: {
          id: true,
          status: true,
          visit_date: true,
          created_at: true,
          user: {
            select: { name: true, email: true },
          },
          plot: {
            select: { title: true, city: true },
          },
        },
      }),

      // User statistics
      prisma.user.count(),

      prisma.user.count({
        where: { created_at: { gte: startDate } },
      }),

      // Inquiry statistics
      prisma.inquiry.count({
        where: { created_at: { gte: startDate } },
      }),

      prisma.inquiry.groupBy({
        by: ['status'],
        _count: true,
      }),
    ])

    // Calculate conversion rates
    const totalInquiries = await prisma.inquiry.count()
    const convertedInquiries = await prisma.inquiry.count({
      where: { status: 'CONVERTED' },
    })
    const conversionRate = totalInquiries > 0
      ? ((convertedInquiries / totalInquiries) * 100).toFixed(2)
      : '0.00'

    // Top performing plots (most site visits)
    const topPlots = await prisma.plot.findMany({
      where: {
        site_visits: { some: {} },
      },
      select: {
        id: true,
        title: true,
        city: true,
        price: true,
        _count: {
          select: { site_visits: true },
        },
      },
      orderBy: {
        site_visits: { _count: 'desc' },
      },
      take: 10,
    })

    // 6. Calculate additional metrics
    const totalPlotsCount = await prisma.plot.count()
    const activePlots = await prisma.plot.count({
      where: { status: 'AVAILABLE' },
    })

    // Growth rates for site visits
    const previousPeriodStart = new Date()
    previousPeriodStart.setDate(previousPeriodStart.getDate() - (period * 2))

    const previousSiteVisits = await prisma.siteVisit.count({
      where: {
        created_at: {
          gte: previousPeriodStart,
          lt: startDate,
        },
      },
    })

    const siteVisitGrowthRate = previousSiteVisits > 0
      ? (((siteVisitStats - previousSiteVisits) / previousSiteVisits) * 100).toFixed(2)
      : siteVisitStats > 0 ? '100.00' : '0.00'

    // User growth rate
    const previousUsers = await prisma.user.count({
      where: {
        created_at: {
          gte: previousPeriodStart,
          lt: startDate,
        },
      },
    })

    const userGrowthRate = previousUsers > 0
      ? (((newUsersCount - previousUsers) / previousUsers) * 100).toFixed(2)
      : newUsersCount > 0 ? '100.00' : '0.00'

    // 7. Calculate performance duration
    const duration = Date.now() - startTime

    // 8. Log performance
    structuredLogger.logApiResponse('GET', '/api/admin/analytics', 200, duration)

    // 9. Return comprehensive analytics
    return successResponse({
      period: `Last ${period} days`,
      generatedAt: new Date().toISOString(),
      queryDuration: `${duration}ms`,

      // Overview metrics
      overview: {
        totalSiteVisits: siteVisitStats,
        totalUsers: userStats,
        totalPlots: totalPlotsCount,
        activePlots,
        conversionRate: `${conversionRate}%`,
      },

      // Growth metrics
      growth: {
        siteVisits: {
          current: siteVisitStats,
          previous: previousSiteVisits,
          growthRate: `${siteVisitGrowthRate}%`,
          trend: Number(siteVisitGrowthRate) > 0 ? 'up' : Number(siteVisitGrowthRate) < 0 ? 'down' : 'stable',
        },
        users: {
          current: newUsersCount,
          previous: previousUsers,
          growthRate: `${userGrowthRate}%`,
          trend: Number(userGrowthRate) > 0 ? 'up' : Number(userGrowthRate) < 0 ? 'down' : 'stable',
        },
      },

      // Detailed breakdowns
      plots: {
        total: totalPlotsCount,
        active: activePlots,
        byStatus: plotStats.map((stat) => ({
          status: stat.status,
          count: stat._count,
        })),
        byCity: plotsByCity.map((city) => ({
          city: city.city,
          count: city._count,
        })),
        published: plotsByStatus,
        recent: recentPlots,
        topPerforming: topPlots.map((plot) => ({
          id: plot.id,
          title: plot.title,
          city: plot.city,
          price: plot.price.toNumber(),
          siteVisitsCount: plot._count.site_visits,
        })),
      },

      siteVisits: {
        total: siteVisitStats,
        byStatus: siteVisitsByStatus.map((visit) => ({
          status: visit.status,
          count: visit._count,
        })),
        recent: recentSiteVisits.map((visit) => ({
          id: visit.id,
          status: visit.status,
          visitDate: visit.visit_date,
          createdAt: visit.created_at,
          user: visit.user,
          plot: visit.plot,
        })),
      },

      users: {
        total: userStats,
        newUsers: newUsersCount,
        growthRate: userStats > 0 ? ((newUsersCount / userStats) * 100).toFixed(2) + '%' : '0.00%',
      },

      inquiries: {
        total: inquiryStats,
        totalAllTime: totalInquiries,
        converted: convertedInquiries,
        byStatus: inquiryByStatus.map((inquiry) => ({
          status: inquiry.status,
          count: inquiry._count,
        })),
        conversionRate: `${conversionRate}%`,
      },

      // Performance metadata
      meta: {
        period,
        startDate: startDate.toISOString(),
        endDate: new Date().toISOString(),
        queryDuration: `${duration}ms`,
        dataPoints: {
          plots: plotStats.length,
          siteVisits: siteVisitsByStatus.length,
          inquiries: inquiryByStatus.length,
        },
      },
    })
  },
  'GET /api/admin/analytics'
)
