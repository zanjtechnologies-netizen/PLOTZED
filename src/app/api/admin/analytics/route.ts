// ================================================
// src/app/api/admin/analytics/route.ts - Advanced Analytics Dashboard
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
  granularity: z.enum(['day', 'week', 'month']).optional().default('day'),
  metrics: z.string().optional(), // Comma-separated: revenue,users,bookings
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

      // Booking analytics
      bookingStats,
      bookingsByStatus,
      recentBookings,

      // Payment analytics
      paymentStats,
      paymentsByType,
      paymentsByStatus,

      // User analytics
      userStats,
      newUsersCount,

      // Inquiry analytics
      inquiryStats,
      inquiryByStatus,

      // Revenue analytics
      revenueByMonth,
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
      }),

      // Booking statistics
      prisma.booking.count({
        where: { created_at: { gte: startDate } },
      }),

      prisma.booking.groupBy({
        by: ['status'],
        _count: true,
      }),

      prisma.booking.findMany({
        where: { created_at: { gte: startDate } },
        orderBy: { created_at: 'desc' },
        take: 10,
        select: {
          id: true,
          status: true,
          total_amount: true,
          created_at: true,
          user: {
            select: { name: true, email: true },
          },
          plot: {
            select: { title: true, city: true },
          },
        },
      }),

      // Payment statistics
      prisma.payment.aggregate({
        where: { created_at: { gte: startDate } },
        _sum: { amount: true },
        _count: true,
      }),

      prisma.payment.groupBy({
        by: ['payment_type'],
        _sum: { amount: true },
        _count: true,
      }),

      prisma.payment.groupBy({
        by: ['status'],
        _sum: { amount: true },
        _count: true,
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

      // Revenue by month (last 12 months)
      prisma.$queryRaw`
        SELECT
          DATE_TRUNC('month', created_at) as month,
          SUM(amount) as revenue,
          COUNT(*) as count
        FROM payments
        WHERE status = 'COMPLETED'
          AND created_at >= NOW() - INTERVAL '12 months'
        GROUP BY DATE_TRUNC('month', created_at)
        ORDER BY month DESC
        LIMIT 12
      `,
    ])

    // Calculate conversion rates
    const totalInquiries = await prisma.inquiry.count()
    const convertedInquiries = await prisma.inquiry.count({
      where: { status: 'CONVERTED' },
    })
    const conversionRate = totalInquiries > 0
      ? ((convertedInquiries / totalInquiries) * 100).toFixed(2)
      : '0.00'

    // Calculate average booking value
    const avgBookingValue = await prisma.booking.aggregate({
      _avg: { total_amount: true },
    })

    // Top performing plots (most bookings)
    const topPlots = await prisma.plot.findMany({
      where: {
        bookings: { some: {} },
      },
      select: {
        id: true,
        title: true,
        city: true,
        price: true,
        _count: {
          select: { bookings: true },
        },
      },
      orderBy: {
        bookings: { _count: 'desc' },
      },
      take: 10,
    })

    // Site visit statistics
    const siteVisitStats = await prisma.siteVisit.groupBy({
      by: ['status'],
      _count: true,
    })

    // 6. Calculate additional metrics
    const totalPlotsCount = await prisma.plot.count()
    const activePlots = await prisma.plot.count({
      where: { status: 'AVAILABLE' },
    })

    // Growth rates
    const previousPeriodStart = new Date()
    previousPeriodStart.setDate(previousPeriodStart.getDate() - (period * 2))
    previousPeriodStart.setDate(previousPeriodStart.getDate() - period)

    const previousBookings = await prisma.booking.count({
      where: {
        created_at: {
          gte: previousPeriodStart,
          lt: startDate,
        },
      },
    })

    const bookingGrowthRate = previousBookings > 0
      ? (((bookingStats - previousBookings) / previousBookings) * 100).toFixed(2)
      : bookingStats > 0 ? '100.00' : '0.00'

    const previousRevenue = await prisma.payment.aggregate({
      where: {
        status: 'COMPLETED',
        created_at: {
          gte: previousPeriodStart,
          lt: startDate,
        },
      },
      _sum: { amount: true },
    })

    const revenueGrowthRate = previousRevenue._sum.amount
      ? (((Number(paymentStats._sum.amount || 0) - Number(previousRevenue._sum.amount)) / Number(previousRevenue._sum.amount)) * 100).toFixed(2)
      : paymentStats._sum.amount ? '100.00' : '0.00'

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
        totalRevenue: paymentStats._sum.amount || 0,
        totalBookings: bookingStats,
        totalUsers: userStats,
        totalPlots: totalPlotsCount,
        activePlots,
        conversionRate: `${conversionRate}%`,
        avgBookingValue: avgBookingValue._avg.total_amount || 0,
      },

      // Growth metrics
      growth: {
        bookings: {
          current: bookingStats,
          previous: previousBookings,
          growthRate: `${bookingGrowthRate}%`,
          trend: Number(bookingGrowthRate) > 0 ? 'up' : Number(bookingGrowthRate) < 0 ? 'down' : 'stable',
        },
        revenue: {
          current: paymentStats._sum.amount || 0,
          previous: previousRevenue._sum.amount || 0,
          growthRate: `${revenueGrowthRate}%`,
          trend: Number(revenueGrowthRate) > 0 ? 'up' : Number(revenueGrowthRate) < 0 ? 'down' : 'stable',
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
          price: plot.price,
          bookingsCount: plot._count.bookings,
        })),
      },

      bookings: {
        total: bookingStats,
        byStatus: bookingsByStatus.map((booking) => ({
          status: booking.status,
          count: booking._count,
        })),
        recent: recentBookings.map((booking) => ({
          id: booking.id,
          status: booking.status,
          amount: booking.total_amount,
          createdAt: booking.created_at,
          user: booking.user,
          plot: booking.plot,
        })),
        avgValue: avgBookingValue._avg.total_amount || 0,
      },

      payments: {
        total: paymentStats._count,
        totalAmount: paymentStats._sum.amount || 0,
        byType: paymentsByType.map((payment) => ({
          type: payment.payment_type,
          count: payment._count,
          totalAmount: payment._sum.amount || 0,
        })),
        byStatus: paymentsByStatus.map((payment) => ({
          status: payment.status,
          count: payment._count,
          totalAmount: payment._sum.amount || 0,
        })),
        revenueByMonth,
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

      siteVisits: {
        byStatus: siteVisitStats.map((visit) => ({
          status: visit.status,
          count: visit._count,
        })),
      },

      // Performance metadata
      meta: {
        period,
        startDate: startDate.toISOString(),
        endDate: new Date().toISOString(),
        queryDuration: `${duration}ms`,
        dataPoints: {
          plots: plotStats.length,
          bookings: bookingsByStatus.length,
          payments: paymentsByType.length,
          inquiries: inquiryByStatus.length,
        },
      },
    })
  },
  'GET /api/admin/analytics'
)
