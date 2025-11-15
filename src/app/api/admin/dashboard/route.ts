// ================================================
// src/app/api/admin/dashboard/route.ts - Admin Dashboard Stats
// ================================================
export const runtime = "nodejs";

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { successResponse, withErrorHandling } from '@/lib/api-error-handler';
import { UnauthorizedError } from '@/lib/errors';

export const GET = withErrorHandling(async (request: NextRequest) => {
  const session = await auth()

  if (!session || session.user.role !== 'ADMIN') {
    throw new UnauthorizedError('User Unauthorized')
  }

  // Get statistics
  const [
    totalPlots,
    availablePlots,
    bookedPlots,
    soldPlots,
    totalCustomers,
    totalSiteVisits,
    pendingSiteVisits,
    pendingInquiries,
  ] = await Promise.all([
    prisma.plot.count(),
    prisma.plot.count({ where: { status: 'AVAILABLE' } }),
    prisma.plot.count({ where: { status: 'BOOKED' } }),
    prisma.plot.count({ where: { status: 'SOLD' } }),
    prisma.user.count({ where: { role: 'CUSTOMER' } }),
    prisma.siteVisit.count(),
    prisma.siteVisit.count({ where: { status: 'PENDING' } }),
    prisma.inquiry.count({ where: { status: 'NEW' } }),
  ])

  // Recent activities
  const recentSiteVisits = await prisma.siteVisit.findMany({
    take: 5,
    orderBy: { created_at: 'desc' },
    include: {
      user: {
        select: { name: true, email: true },
      },
      plot: {
        select: { title: true, city: true },
      },
    },
  })

  const recentInquiries = await prisma.inquiry.findMany({
    take: 5,
    orderBy: { created_at: 'desc' },
    include: {
      user: {
        select: { name: true, email: true },
      },
      plot: {
        select: { title: true, city: true },
      },
    },
  })

  const responseData = {
    stats: {
      plots: {
        total: totalPlots,
        available: availablePlots,
        booked: bookedPlots,
        sold: soldPlots,
      },
      customers: totalCustomers,
      siteVisits: totalSiteVisits,
      pendingSiteVisits,
      pendingInquiries,
    },
    recentSiteVisits,
    recentInquiries,
  }

  return successResponse(responseData, 200)
}, 'GET /api/admin/dashboard')
