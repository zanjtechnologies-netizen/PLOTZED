// ================================================
// src/app/api/payments/history/route.ts - Payment History
// ================================================

import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { successResponse, withErrorHandling } from '@/lib/api-error-handler'
import { UnauthorizedError } from '@/lib/errors'

export const GET = withErrorHandling(
  async (request: NextRequest) => {
    const session = await auth()

    if (!session?.user) {
      throw new UnauthorizedError('Please login to view payment history')
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit
    const status = searchParams.get('status')
    const paymentType = searchParams.get('type')

    // Build where clause
    const where: any = {}

    // Admin can see all payments, users only see their own
    if (session.user.role !== 'ADMIN') {
      where.user_id = session.user.id
    }

    if (status) where.status = status
    if (paymentType) where.payment_type = paymentType

    // Get total count
    const total = await prisma.payment.count({ where })

    // Get payments
    const payments = await prisma.payment.findMany({
      where,
      skip,
      take: limit,
      orderBy: { created_at: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        booking: {
          select: {
            id: true,
            status: true,
            plot: {
              select: {
                id: true,
                title: true,
                slug: true,
                city: true,
              },
            },
          },
        },
      },
    })

    // Calculate summary
    const summary = await prisma.payment.groupBy({
      by: ['status'],
      where: session.user.role !== 'ADMIN' ? { user_id: session.user.id } : {},
      _sum: { amount: true },
      _count: true,
    })

    return successResponse({
      payments,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: skip + payments.length < total,
      },
      summary: summary.reduce((acc, item) => {
        acc[item.status] = {
          count: item._count,
          total: item._sum.amount || 0,
        }
        return acc
      }, {} as any),
    })
  },
  'GET /api/payments/history'
)
