// ================================================
// src/app/api/payments/[id]/refund/route.ts - Razorpay Refund
// ================================================
export const runtime = "nodejs";

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Razorpay from 'razorpay'

// Lazy load Razorpay to avoid initialization errors at build time
function getRazorpay() {
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'dummy_key',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummy_secret',
  })
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Only admins can process refunds
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Forbidden. Admin access required.' },
        { status: 403 }
      )
    }

    const { id } = await params
    const body = await request.json()
    const { amount, reason, speed = 'normal' } = body

    // Get payment record
    const payment = await prisma.payment.findUnique({
      where: { id },
      include: {
        booking: {
          include: {
            plot: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    if (!payment) {
      return NextResponse.json(
        { success: false, error: 'Payment not found' },
        { status: 404 }
      )
    }

    if (payment.status !== 'COMPLETED') {
      return NextResponse.json(
        { success: false, error: 'Only completed payments can be refunded' },
        { status: 400 }
      )
    }

    if (!payment.razorpay_payment_id) {
      return NextResponse.json(
        { success: false, error: 'Payment ID not found' },
        { status: 400 }
      )
    }

    // Calculate refund amount (default to full amount)
    const refundAmount = amount
      ? Math.round(parseFloat(amount) * 100)
      : Math.round(payment.amount.toNumber() * 100)

    // Create refund via Razorpay
    const razorpay = getRazorpay()
    const refund = await razorpay.payments.refund(
      payment.razorpay_payment_id,
      {
        amount: refundAmount,
        speed: speed, // normal or optimum
        notes: {
          reason: reason || 'Refund requested',
          booking_id: payment.booking_id,
          admin_id: session.user.id,
        },
        receipt: `refund_${payment.id}_${Date.now()}`,
      }
    )

    // Update payment status
    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: 'REFUNDED',
      },
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

    // Log activity
    await prisma.activityLog.create({
      data: {
        user_id: session.user.id,
        action: 'REFUND_INITIATED',
        entity_type: 'payment',
        entity_id: payment.id,
        metadata: {
          refund_id: refund.id,
          amount: refundAmount / 100,
          reason,
          original_payment_id: payment.razorpay_payment_id,
        },
      },
    })

    // TODO: Send refund confirmation email to user

    return NextResponse.json({
      success: true,
      data: {
        refund_id: refund.id,
        payment_id: payment.id,
        amount: refundAmount / 100,
        status: refund.status,
        created_at: refund.created_at,
      },
      message: 'Refund initiated successfully',
    })
  } catch (error: any) {
    console.error('Refund error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to process refund',
      },
      { status: 500 }
    )
  }
}
