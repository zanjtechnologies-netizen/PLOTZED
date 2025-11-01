// ================================================
// src/app/api/payments/create-order/route.ts - Razorpay Order Creation
// ================================================

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Razorpay from 'razorpay'

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { booking_id, amount, payment_type } = await request.json()

    // Verify booking exists
    const booking = await prisma.booking.findUnique({
      where: { id: booking_id },
      include: { plot: true },
    })

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    if (booking.user_id !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Create Razorpay order
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

    return NextResponse.json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      payment_id: payment.id,
    })
  } catch (error) {
    console.error('Order creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}