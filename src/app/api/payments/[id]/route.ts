// ================================================
// src/app/api/payments/[id]/route.ts - Single Payment Details
// ================================================
export const runtime = "nodejs";

import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { successResponse, withErrorHandling } from '@/lib/api-error-handler'
import { ForbiddenError, NotFoundError, UnauthorizedError } from '@/lib/errors'

export const GET = withErrorHandling(
  async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const session = await auth()

    if (!session?.user) {
      throw new UnauthorizedError('Please login to view payment details')
    }

    const { id } = await params

    const payment = await prisma.payment.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        booking: {
          include: {
            plot: {
              select: {
                id: true,
                title: true,
                slug: true,
                city: true,
                address: true,
              },
            },
          },
        },
      },
    })

    if (!payment) {
      throw new NotFoundError('Payment not found')
    }

    // Users can only see their own payments, admins can see all
    if (payment.user_id !== session.user.id && session.user.role !== 'ADMIN') {
      throw new ForbiddenError('You do not have permission to view this payment')
    }

    return successResponse({ payment })
  },
  'GET /api/payments/[id]'
)
