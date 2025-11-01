// ================================================
// src/app/api/admin/dashboard/route.ts - Admin Dashboard Stats
// ================================================

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get statistics
    const [
      totalPlots,
      availablePlots,
      bookedPlots,
      soldPlots,
      totalCustomers,
      totalBookings,
      pendingInquiries,
      totalRevenue,
    ] = await Promise.all([
      prisma.plot.count(),
      prisma.plot.count({ where: { status: 'AVAILABLE' } }),
      prisma.plot.count({ where: { status: 'BOOKED' } }),
      prisma.plot.count({ where: { status: 'SOLD' } }),
      prisma.user.count({ where: { role: 'CUSTOMER' } }),
      prisma.booking.count(),
      prisma.inquiry.count({ where: { status: 'NEW' } }),
      prisma.payment.aggregate({
        where: { status: 'COMPLETED' },
        _sum: { amount: true },
      }),
    ])

    // Recent activities
    const recentBookings = await prisma.booking.findMany({
      take: 5,
      orderBy: { created_at: 'desc' },
      include: {
        user: {
          select: { name: true, email: true },
        },
        plot: {
          select: { title: true },
        },
      },
    })

    return NextResponse.json({
      stats: {
        plots: {
          total: totalPlots,
          available: availablePlots,
          booked: bookedPlots,
          sold: soldPlots,
        },
        customers: totalCustomers,
        bookings: totalBookings,
        pendingInquiries,
        revenue: totalRevenue._sum.amount || 0,
      },
      recentBookings,
    })
  } catch (error) {
    console.error('Dashboard stats error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    )
  }
}