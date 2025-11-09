// ================================================
// src/app/api/bookings/route.ts - Bookings API
// ================================================
export const runtime = "nodejs";

import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { sendEmail, emailTemplates } from '@/lib/email'
import { sendBookingConfirmationWhatsApp } from '@/lib/whatsapp'
import { createdResponse, successResponse, withErrorHandling } from '@/lib/api-error-handler'
import { BadRequestError, NotFoundError, UnauthorizedError } from '@/lib/errors'
import { structuredLogger } from '@/lib/structured-logger'

const bookingSchema = z.object({
  plot_id: z.string().uuid(),
})

// GET /api/bookings - Get user's bookings
export const GET = withErrorHandling(
  async (request: NextRequest) => {
    const session = await auth()

    if (!session?.user) {
      throw new UnauthorizedError('Please login to view bookings')
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    const where: any = { user_id: session.user.id }
    if (status) where.status = status

    const bookings = await prisma.booking.findMany({
      where,
      include: {
        plot: {
          select: {
            id: true,
            title: true,
            price: true,
            images: true,
            city: true,
            state: true,
          },
        },
        payments: {
          select: {
            id: true,
            amount: true,
            status: true,
            payment_type: true,
            created_at: true,
          },
        },
      },
      orderBy: { created_at: 'desc' },
    })

    return successResponse({ bookings })
  },
  'GET /api/bookings'
)

// POST /api/bookings - Create booking
export const POST = withErrorHandling(
  async (request: NextRequest) => {
    const session = await auth()

    if (!session?.user) {
      throw new UnauthorizedError('Please login to create a booking')
    }

    const body = await request.json()
    const validatedData = bookingSchema.parse(body)

    // Check if plot exists and is available
    const plot = await prisma.plot.findUnique({
      where: { id: validatedData.plot_id },
    })

    if (!plot) {
      throw new NotFoundError('Plot not found')
    }

    if (plot.status !== 'AVAILABLE') {
      throw new BadRequestError('Plot is not available for booking')
    }

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        user_id: session.user.id,
        plot_id: validatedData.plot_id,
        booking_amount: plot.booking_amount,
        total_amount: plot.price,
        status: 'PENDING',
      },
      include: {
        plot: {
          select: {
            title: true,
            price: true,
            booking_amount: true,
            address: true,
            city: true,
          },
        },
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    })

    structuredLogger.info('Booking created successfully', {
      bookingId: booking.id,
      userId: session.user.id,
      plotId: plot.id,
      type: 'booking_creation',
    })

    // Send booking confirmation email
    try {
      if (booking.user.email) {
        await sendEmail({
          to: booking.user.email,
          subject: 'Booking Confirmed - Plotzed Real Estate',
          html: emailTemplates.bookingConfirmation({
            customerName: booking.user.name,
            propertyName: booking.plot.title,
            bookingId: booking.id,
            amount: booking.booking_amount.toNumber(),
            date: booking.created_at.toLocaleDateString('en-IN', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            }),
          }),
        })
      }
    } catch (emailError) {
      structuredLogger.error('Booking confirmation email failed', emailError as Error, {
        bookingId: booking.id,
        userId: session.user.id,
      })
      // Don't fail booking if email fails
    }

    // Send booking confirmation via WhatsApp
    try {
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { phone: true }
      })

      if (user?.phone) {
        await sendBookingConfirmationWhatsApp(
          user.phone,
          booking.user.name,
          booking.plot.title,
          booking.id
        )
      }
    } catch (whatsappError) {
      structuredLogger.error('Booking confirmation WhatsApp failed', whatsappError as Error, {
        bookingId: booking.id,
        userId: session.user.id,
      })
      // Don't fail booking if WhatsApp fails
    }

    return createdResponse(booking, 'Booking created successfully')
  },
  'POST /api/bookings'
)
