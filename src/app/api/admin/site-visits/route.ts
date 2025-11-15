// ================================================
// src/app/api/admin/site-visits/route.ts
// Admin API - Fetch all site visits with filters
// ================================================

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { withErrorHandling } from '@/lib/api-error-handler'
import { prisma } from '@/lib/prisma'

export const GET = withErrorHandling(async (req: NextRequest) => {
  // Admin authentication check
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    )
  }

  if (session.user.role !== 'ADMIN') {
    return NextResponse.json(
      { success: false, error: 'Forbidden - Admin access required' },
      { status: 403 }
    )
  }

  // Get query parameters for filtering
  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status') // PENDING, CONFIRMED, COMPLETED, CANCELLED
  const sortBy = searchParams.get('sortBy') || 'desc' // asc or desc
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '50')
  const skip = (page - 1) * limit

  // Build filter conditions
  const whereConditions: any = {}

  if (status && ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'RESCHEDULED'].includes(status)) {
    whereConditions.status = status
  }

  // Fetch site visits with user and plot details
  const [siteVisits, totalCount] = await Promise.all([
    prisma.siteVisit.findMany({
      where: whereConditions,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        plot: {
          select: {
            id: true,
            title: true,
            price: true,
            plot_size: true,
            address: true,
            city: true,
            state: true,
            images: true,
          },
        },
      },
      orderBy: {
        visit_date: sortBy === 'asc' ? 'asc' : 'desc',
      },
      skip,
      take: limit,
    }),
    prisma.siteVisit.count({ where: whereConditions }),
  ])

  // Get summary statistics
  const stats = await prisma.siteVisit.groupBy({
    by: ['status'],
    _count: {
      status: true,
    },
  })

  const statusCounts = {
    PENDING: 0,
    CONFIRMED: 0,
    COMPLETED: 0,
    CANCELLED: 0,
    RESCHEDULED: 0,
  }

  stats.forEach((stat) => {
    if (stat.status) {
      statusCounts[stat.status as keyof typeof statusCounts] = stat._count.status
    }
  })

  return NextResponse.json({
    success: true,
    data: {
      siteVisits,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
      stats: statusCounts,
    },
  })
})
