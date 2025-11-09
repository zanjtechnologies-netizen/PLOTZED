// ================================================
// src/app/api/payments/create-order/route.ts - Razorpay Order Creation
// ================================================
export const runtime = "nodejs";

import { NextRequest } from 'next/server'
import { z } from 'zod'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Razorpay from 'razorpay'
import { successResponse, withErrorHandling } from '@/lib/api-error-handler'
import { ExternalServiceError, ForbiddenError, NotFoundError, UnauthorizedError } from '@/lib/errors'
import { structuredLogger } from '@/lib/structured-logger'

// Lazy load Razorpay to avoid initialization errors at build time
function getRazorpay() {
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'dummy_key',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummy_secret',
  })
}

const createOrderSchema = z.object({
  booking_id: z.string().uuid(),
  amount: z.number().positive(),
  payment_type: z.enum(['BOOKING', 'INSTALLMENT', 'FULL_PAYMENT']),
})

export const POST = withErrorHandling(
  async (request: NextRequest) => {
    const session = await auth()

    if (!session?.user) {
      throw new UnauthorizedError('Please login to create payment order')
    }

    const body = await request.json()
    const { booking_id, amount, payment_type } = createOrderSchema.parse(body)

    // Verify booking exists
    const booking = await prisma.booking.findUnique({
      where: { id: booking_id },
      include: { plot: true },
    })

    if (!booking) {
      throw new NotFoundError('Booking not found')
    }

    if (booking.user_id !== session.user.id) {
      throw new ForbiddenError('You do not have permission to create payment for this booking')
    }

    // Create Razorpay order
    try {
      const razorpay = getRazorpay()
      const order = await razorpay.orders.create({
        amount: Math.round(amount * 100), // Convert to paise
        currency: 'INR',
        receipt: `receipt_${booking_id}_${Date.now()}`,
        notes: {
          booking_id,
          user_id: session.user.id,
          plot_id: booking.plot_id,
        },
      })

      // Create payment record
      const payment = await prisma.payment.create({
        data: {
          user_id: session.user.id,
          booking_id,
          amount,
          currency: 'INR',
          payment_type,
          razorpay_order_id: order.id,
          status: 'PENDING',
        },
      })

      structuredLogger.logPayment('order_created', amount, session.user.id, 'PENDING')

      return successResponse({
        order_id: order.id,
        amount: order.amount,
        currency: order.currency,
        payment_id: payment.id,
      })
    } catch (error) {
      structuredLogger.error('Razorpay order creation failed', error as Error, {
        userId: session.user.id,
        bookingId: booking_id,
        amount,
      })
      throw new ExternalServiceError('Razorpay', 'Failed to create payment order')
    }
  },
  'POST /api/payments/create-order'
)
