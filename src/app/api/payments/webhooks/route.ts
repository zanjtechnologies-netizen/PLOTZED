// ================================================
// src/app/api/payments/webhooks/route.ts - Razorpay Webhook Handler
// ================================================
export const runtime = "nodejs";

import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'
import { successResponse, withErrorHandling } from '@/lib/api-error-handler'
import { BadRequestError } from '@/lib/errors'
import { structuredLogger } from '@/lib/structured-logger'
import { sendPaymentConfirmationEmail, sendPaymentFailedEmail, sendRefundConfirmationEmail } from '@/lib/email'
import { sendPaymentConfirmationWhatsApp, sendPaymentFailedWhatsApp } from '@/lib/whatsapp'

/**
 * Razorpay Webhook Events:
 * - payment.authorized
 * - payment.captured
 * - payment.failed
 * - refund.created
 * - refund.processed
 */

export const POST = withErrorHandling(
  async (request: NextRequest) => {
    const body = await request.text()
    const signature = request.headers.get('x-razorpay-signature')

    if (!signature) {
      throw new BadRequestError('Missing webhook signature')
    }

    // Verify webhook signature
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET!
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(body)
      .digest('hex')

    if (signature !== expectedSignature) {
      structuredLogger.warn('Invalid webhook signature', {
        type: 'webhook_signature_invalid',
      })
      throw new BadRequestError('Invalid webhook signature')
    }

    // Parse the webhook payload
    const event = JSON.parse(body)
    const { event: eventType, payload } = event

    structuredLogger.info('Razorpay webhook received', {
      eventType,
      type: 'webhook_received',
    })

    switch (eventType) {
      case 'payment.captured':
        await handlePaymentCaptured(payload.payment.entity)
        break

      case 'payment.authorized':
        await handlePaymentAuthorized(payload.payment.entity)
        break

      case 'payment.failed':
        await handlePaymentFailed(payload.payment.entity)
        break

      case 'refund.created':
        await handleRefundCreated(payload.refund.entity)
        break

      case 'refund.processed':
        await handleRefundProcessed(payload.refund.entity)
        break

      default:
        structuredLogger.info('Unhandled webhook event', {
          eventType,
          type: 'webhook_unhandled',
        })
    }

    return successResponse({ received: true })
  },
  'POST /api/payments/webhooks'
)

// Payment captured successfully
async function handlePaymentCaptured(paymentData: any) {
  const { id, order_id, amount, method, email, contact } = paymentData

  try {
    // Update payment record
    const payment = await prisma.payment.findFirst({
      where: { razorpay_order_id: order_id },
      include: {
        booking: {
          include: {
            plot: true,
            user: true,
          }
        },
        user: true,
      },
    })

    if (!payment) {
      structuredLogger.error('Payment not found for webhook order', new Error('Payment not found'), {
        razorpayOrderId: order_id,
        razorpayPaymentId: id,
        type: 'webhook_payment_not_found',
      })
      return
    }

    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        razorpay_payment_id: id,
        status: 'COMPLETED',
        payment_method: method,
        completed_at: new Date(),
      },
    })

    structuredLogger.logPayment('payment_captured', amount / 100, payment.user_id, 'COMPLETED', {
      paymentId: payment.id,
      razorpayPaymentId: id,
      method,
    })

    // Update booking status
    if (payment.booking) {
      await prisma.booking.update({
        where: { id: payment.booking_id },
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

      structuredLogger.info('Booking confirmed via webhook', {
        bookingId: payment.booking_id,
        plotId: payment.booking.plot_id,
        type: 'webhook_booking_confirmed',
      })
    }

    // Send email and WhatsApp notifications
    const user = payment.user
    const plotTitle = payment.booking?.plot?.title || 'Your Property'
    const amountInRupees = amount / 100

    if (user && user.email) {
      await sendPaymentConfirmationEmail(
        user.email,
        user.name,
        amountInRupees,
        payment.invoice_number!,
        plotTitle
      ).catch((error: Error) => {
        structuredLogger.error('Failed to send payment confirmation email', error, {
          paymentId: payment.id,
          userId: user.id,
        })
      })
    }

    if (user && user.phone) {
      await sendPaymentConfirmationWhatsApp(
        user.phone,
        user.name,
        amountInRupees,
        payment.invoice_number!,
        plotTitle
      ).catch((error) => {
        structuredLogger.error('Failed to send payment confirmation WhatsApp', error as Error, {
          paymentId: payment.id,
          userId: user.id,
        })
      })
    }
  } catch (error) {
    structuredLogger.error('Error handling payment captured webhook', error as Error, {
      razorpayPaymentId: id,
      razorpayOrderId: order_id,
    })
  }
}

// Payment authorized (for later capture)
async function handlePaymentAuthorized(paymentData: any) {
  const { id, order_id } = paymentData

  try {
    const payment = await prisma.payment.findFirst({
      where: { razorpay_order_id: order_id },
    })

    if (payment) {
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          razorpay_payment_id: id,
          status: 'PROCESSING',
        },
      })

      structuredLogger.info('Payment authorized via webhook', {
        paymentId: payment.id,
        razorpayPaymentId: id,
        type: 'webhook_payment_authorized',
      })
    }
  } catch (error) {
    structuredLogger.error('Error handling payment authorized webhook', error as Error, {
      razorpayPaymentId: id,
      razorpayOrderId: order_id,
    })
  }
}

// Payment failed
async function handlePaymentFailed(paymentData: any) {
  const { id, order_id, error_code, error_description, amount } = paymentData

  try {
    const payment = await prisma.payment.findFirst({
      where: { razorpay_order_id: order_id },
      include: {
        user: true,
        booking: {
          include: {
            plot: true,
          }
        }
      },
    })

    if (payment) {
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          razorpay_payment_id: id,
          status: 'FAILED',
        },
      })

      structuredLogger.warn('Payment failed via webhook', {
        paymentId: payment.id,
        razorpayPaymentId: id,
        errorCode: error_code,
        errorDescription: error_description,
        type: 'webhook_payment_failed',
      })

      // Send failure notification
      const user = payment.user
      const plotTitle = payment.booking?.plot?.title || 'Property'
      const amountInRupees = amount / 100

      if (user && user.email) {
        await sendPaymentFailedEmail(
          user.email,
          user.name,
          amountInRupees,
          plotTitle,
          error_description
        ).catch((error: Error) => {
          structuredLogger.error('Failed to send payment failed email', error, {
            paymentId: payment.id,
            userId: user.id,
          })
        })
      }

      if (user && user.phone) {
        await sendPaymentFailedWhatsApp(
          user.phone,
          user.name,
          amountInRupees,
          plotTitle
        ).catch((error) => {
          structuredLogger.error('Failed to send payment failed WhatsApp', error as Error, {
            paymentId: payment.id,
            userId: user.id,
          })
        })
      }
    }
  } catch (error) {
    structuredLogger.error('Error handling payment failed webhook', error as Error, {
      razorpayPaymentId: id,
      razorpayOrderId: order_id,
    })
  }
}

// Refund created
async function handleRefundCreated(refundData: any) {
  const { id, payment_id, amount, status } = refundData

  try {
    const payment = await prisma.payment.findFirst({
      where: { razorpay_payment_id: payment_id },
      include: {
        user: true,
        booking: {
          include: {
            plot: true,
          }
        }
      },
    })

    if (payment) {
      await prisma.payment.update({
        where: { id: payment.id },
        data: { status: 'REFUNDED' },
      })

      // Update booking status to CANCELLED
      if (payment.booking) {
        await prisma.booking.update({
          where: { id: payment.booking_id },
          data: {
            status: 'CANCELLED',
          },
        })

        // Update plot status back to AVAILABLE
        await prisma.plot.update({
          where: { id: payment.booking.plot_id },
          data: { status: 'AVAILABLE' },
        })
      }

      structuredLogger.info('Refund created via webhook', {
        paymentId: payment.id,
        refundId: id,
        amount: amount / 100,
        status,
        type: 'webhook_refund_created',
      })

      // Send refund notification email
      const user = payment.user
      const plotTitle = payment.booking?.plot?.title || 'Property'
      const amountInRupees = amount / 100

      if (user && user.email) {
        await sendRefundConfirmationEmail(
          user.email,
          user.name,
          amountInRupees,
          plotTitle,
          payment.invoice_number!
        ).catch((error: Error) => {
          structuredLogger.error('Failed to send refund confirmation email', error, {
            paymentId: payment.id,
            userId: user.id,
          })
        })
      }
    }
  } catch (error) {
    structuredLogger.error('Error handling refund created webhook', error as Error, {
      refundId: id,
      razorpayPaymentId: payment_id,
    })
  }
}

// Refund processed (money transferred)
async function handleRefundProcessed(refundData: any) {
  const { id, payment_id } = refundData

  try {
    structuredLogger.info('Refund processed via webhook', {
      refundId: id,
      razorpayPaymentId: payment_id,
      type: 'webhook_refund_processed',
    })
  } catch (error) {
    structuredLogger.error('Error handling refund processed webhook', error as Error, {
      refundId: id,
      razorpayPaymentId: payment_id,
    })
  }
}
