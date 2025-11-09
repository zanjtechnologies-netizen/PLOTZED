// ================================================
// src/app/api/bookings/[id]/route.ts
// ================================================
export const runtime = "nodejs";

import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { successResponse, withErrorHandling } from '@/lib/api-error-handler'
import { ForbiddenError, NotFoundError, UnauthorizedError } from '@/lib/errors'
import { structuredLogger } from '@/lib/structured-logger'

export const GET = withErrorHandling(
  async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const session = await auth()

    if (!session?.user) {
      throw new UnauthorizedError('Please login to view booking details')
    }

    const { id } = await params
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        plot: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        payments: true,
      },
    })

    if (!booking) {
      throw new NotFoundError('Booking not found')
    }

    // Check if user owns this booking or is admin
    if (booking.user_id !== session.user.id && session.user.role !== 'ADMIN') {
      throw new ForbiddenError('You do not have permission to view this booking')
    }

    return successResponse({ booking })
  },
  'GET /api/bookings/[id]'
)

// PATCH /api/bookings/[id] - Update booking
export const PATCH = withErrorHandling(
  async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const session = await auth()

    if (!session?.user || session.user.role !== 'ADMIN') {
      throw new UnauthorizedError('Admin access required')
    }

    const { id } = await params
    const body = await request.json()

    const booking = await prisma.booking.update({
      where: { id },
      data: body,
    })

    structuredLogger.info('Booking updated', {
      bookingId: id,
      userId: session.user.id,
      type: 'booking_update',
    })

    return successResponse({ booking }, 200, 'Booking updated successfully')
  },
  'PATCH /api/bookings/[id]'
)
