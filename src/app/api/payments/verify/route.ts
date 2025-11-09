// ================================================
// src/app/api/payments/verify/route.ts - Verify Razorpay Payment
// ================================================
export const runtime = "nodejs";

import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { sendEmail, emailTemplates } from '@/lib/email'
import crypto from 'crypto'
import { z } from 'zod'
import { successResponse, withErrorHandling } from '@/lib/api-error-handler'
import { BadRequestError, NotFoundError, UnauthorizedError } from '@/lib/errors'
import { structuredLogger } from '@/lib/structured-logger'

const verifyPaymentSchema = z.object({
  razorpay_order_id: z.string().min(1),
  razorpay_payment_id: z.string().min(1),
  razorpay_signature: z.string().min(1),
})

export const POST = withErrorHandling(
  async (request: NextRequest) => {
    const session = await auth()

    if (!session?.user) {
      throw new UnauthorizedError('Please login to verify payment')
    }

    const body = await request.json()
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = verifyPaymentSchema.parse(body)

    // Verify signature
    const text = `${razorpay_order_id}|${razorpay_payment_id}`
    const generated_signature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(text)
      .digest('hex')

    if (generated_signature !== razorpay_signature) {
      structuredLogger.warn('Invalid payment signature', {
        razorpayOrderId: razorpay_order_id,
        userId: session.user.id,
        type: 'payment_verification_failed',
      })
      throw new BadRequestError('Invalid payment signature')
    }

    // Update payment record
    const payment = await prisma.payment.update({
      where: { razorpay_order_id },
      data: {
        razorpay_payment_id,
        razorpay_signature,
        status: 'COMPLETED',
        completed_at: new Date(),
        invoice_number: `INV-${Date.now()}`,
      },
      include: {
        booking: {
          include: {
            plot: {
              select: {
                title: true,
              },
            },
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

    if (!payment) {
      throw new NotFoundError('Payment not found')
    }

    structuredLogger.logPayment(
      'payment_verified',
      payment.amount.toNumber(),
      session.user.id,
      'COMPLETED',
      {
        paymentId: payment.id,
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
      }
    )

    // Update booking status if it's the booking payment
    if (payment.payment_type === 'BOOKING' && payment.booking) {
      await prisma.booking.update({
        where: { id: payment.booking_id! },
        data: {
          status: 'CONFIRMED',
          confirmed_at: new Date(),
        },
      })

      // Update plot status to BOOKED
      await prisma.plot.update({
        where: { id: payment.booking.plot_id },
        data: { status: 'BOOKED' },
      })

      structuredLogger.info('Booking confirmed after payment', {
        bookingId: payment.booking_id,
        plotId: payment.booking.plot_id,
        type: 'booking_confirmed',
      })
    }

    // Send payment confirmation email
    if (payment.user.email && payment.booking) {
      try {
        await sendEmail({
          to: payment.user.email,
          subject: 'Payment Successful - Plotzed Real Estate',
          html: emailTemplates.paymentConfirmation(
            payment.user.name,
            payment.booking.plot.title,
            payment.amount.toNumber(),
            payment.razorpay_payment_id || 'N/A',
            payment.invoice_number || 'N/A'
          ),
        })
      } catch (emailError) {
        structuredLogger.error('Payment confirmation email failed', emailError as Error, {
          paymentId: payment.id,
          userId: session.user.id,
        })
        // Don't fail payment verification if email fails
      }
    }

    return successResponse({
      message: 'Payment verified successfully',
      payment,
    })
  },
  'POST /api/payments/verify'
)