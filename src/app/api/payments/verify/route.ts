// ================================================
// src/app/api/payments/verify/route.ts - Verify Razorpay Payment
// ================================================

import { NextRequest, NextResponse } from 'next/server'
import  getServerSession from 'next-auth'
import { authOptions } from '@/lib/authOption'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = await request.json()

    // Verify signature
    const text = `${razorpay_order_id}|${razorpay_payment_id}`
    const generated_signature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(text)
      .digest('hex')

    if (generated_signature !== razorpay_signature) {
      return NextResponse.json(
        { error: 'Invalid payment signature' },
        { status: 400 }
      )
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
        booking: true,
      },
    })

    // Update booking status if it's the booking payment
    if (payment.payment_type === 'BOOKING') {
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
    }

    // TODO: Send confirmation email
    // TODO: Send SMS

    return NextResponse.json({
      success: true,
      message: 'Payment verified successfully',
      payment,
    })
  } catch (error) {
    console.error('Payment verification error:', error)
    return NextResponse.json(
      { error: 'Payment verification failed' },
      { status: 500 }
    )
  }
}