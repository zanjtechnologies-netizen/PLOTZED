// ================================================
// src/app/api/bookings/[id]/cancel/route.ts - Cancel Booking
// ================================================

import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { sendEmail, emailTemplates } from '@/lib/email'
import { z } from 'zod'
import { successResponse, withErrorHandling } from '@/lib/api-error-handler'
import { BadRequestError, ForbiddenError, NotFoundError, UnauthorizedError } from '@/lib/errors'
import { structuredLogger } from '@/lib/structured-logger'

const cancelBookingSchema = z.object({
  reason: z.string().optional(),
})

export const POST = withErrorHandling(
  async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const session = await auth()

    if (!session?.user) {
      throw new UnauthorizedError('Please login to cancel booking')
    }

    const { id } = await params
    const body = await request.json()
    const { reason } = cancelBookingSchema.parse(body)

    // Get booking
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        plot: {
          select: {
            title: true,
          },
        },
        payments: true,
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    })

    if (!booking) {
      throw new NotFoundError('Booking not found')
    }

    // Check authorization (user owns booking or is admin)
    if (booking.user_id !== session.user.id && session.user.role !== 'ADMIN') {
      throw new ForbiddenError('Unauthorized to cancel this booking')
    }

    // Check if booking can be cancelled
    if (booking.status === 'CANCELLED') {
      throw new BadRequestError('Booking is already cancelled')
    }

    if (booking.status === 'COMPLETED') {
      throw new BadRequestError('Cannot cancel completed booking')
    }

    // Update booking status
    await prisma.booking.update({
      where: { id },
      data: {
        status: 'CANCELLED',
      },
    })

    // Update plot status back to AVAILABLE
    await prisma.plot.update({
      where: { id: booking.plot_id },
      data: { status: 'AVAILABLE' },
    })

    // Mark any pending payments as FAILED
    await prisma.payment.updateMany({
      where: {
        booking_id: id,
        status: { in: ['PENDING', 'PROCESSING'] },
      },
      data: {
        status: 'FAILED',
      },
    })

    // Log activity
    await prisma.activityLog.create({
      data: {
        user_id: session.user.id,
        action: 'BOOKING_CANCELLED',
        entity_type: 'booking',
        entity_id: id,
        metadata: { reason },
      },
    })

    structuredLogger.warn('Booking cancelled', {
      bookingId: id,
      userId: session.user.id,
      plotId: booking.plot_id,
      reason: reason || 'No reason provided',
      type: 'booking_cancelled',
    })

    // Send cancellation email
    try {
      if (booking.user.email) {
        await sendEmail({
          to: booking.user.email,
          subject: 'Booking Cancelled - Plotzed Real Estate',
          html: emailTemplates.bookingCancellation(
            booking.user.name,
            booking.plot.title,
            reason || 'No reason provided'
          ),
        })
      }
    } catch (emailError) {
      structuredLogger.error('Cancellation email failed', emailError as Error, {
        bookingId: id,
      })
      // Don't fail cancellation if email fails
    }

    // TODO: Process refund if applicable

    return successResponse({ message: 'Booking cancelled successfully' })
  },
  'POST /api/bookings/[id]/cancel'
)
