// ================================================
// src/app/api/admin/inquiries/route.ts - Admin Inquiries Management
// ================================================
export const runtime = "nodejs";

import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { successResponse, withErrorHandling } from '@/lib/api-error-handler'
import { UnauthorizedError, ForbiddenError } from '@/lib/errors'

export const GET = withErrorHandling(async (request: NextRequest) => {
  const session = await auth()

  if (!session || !session.user) {
    throw new UnauthorizedError('Authentication required')
  }

  if (session.user.role !== 'ADMIN') {
    throw new ForbiddenError('Admin access required')
  }

  // Get query parameters for filtering
  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')

  // Build filter conditions
  const whereConditions: any = {}
  if (status && ['NEW', 'CONTACTED', 'QUALIFIED', 'CONVERTED', 'CLOSED'].includes(status)) {
    whereConditions.status = status
  }

  // Get statistics
  const [
    totalInquiries,
    newInquiries,
    contactedInquiries,
    convertedInquiries,
  ] = await Promise.all([
    prisma.inquiries.count(),
    prisma.inquiries.count({ where: { status: 'NEW' } }),
    prisma.inquiries.count({ where: { status: 'CONTACTED' } }),
    prisma.inquiries.count({ where: { status: 'CONVERTED' } }),
  ])

  // Get inquiries with user and plot details (with optional filtering)
  const inquiries = await prisma.inquiries.findMany({
    where: whereConditions,
    orderBy: { created_at: 'desc' },
    include: {
      users: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      },
      plots: {
        select: {
          id: true,
          title: true,
          city: true,
          state: true,
          price: true,
        },
      },
    },
  })

  const responseData = {
    stats: {
      total: totalInquiries,
      new: newInquiries,
      contacted: contactedInquiries,
      converted: convertedInquiries,
    },
    inquiries,
  }

  return successResponse(responseData, 200)
}, 'GET /api/admin/inquiries')
