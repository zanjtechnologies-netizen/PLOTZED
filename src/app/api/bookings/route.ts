// ================================================
// src/app/api/bookings/route.ts - Bookings API
// ================================================

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const bookingSchema = z.object({
  plot_id: z.string().uuid(),
  booking_date: z.string().datetime(),
  booking_time: z.string(),
  attendees: z.number().min(1).max(10),
  notes: z.string().optional(),
})

// GET /api/bookings - Get user's bookings
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
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

    return NextResponse.json(bookings)
  } catch (error) {
    console.error('Bookings fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    )
  }
}

// POST /api/bookings - Create booking
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = bookingSchema.parse(body)

    // Check if plot exists and is available
    const plot = await prisma.plot.findUnique({
      where: { id: validatedData.plot_id },
    })

    if (!plot) {
      return NextResponse.json({ error: 'Plot not found' }, { status: 404 })
    }

    if (plot.status !== 'AVAILABLE') {
      return NextResponse.json(
        { error: 'Plot is not available' },
        { status: 400 }
      )
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
        plot: true,
      },
    })

    return NextResponse.json(booking, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      )
    }

    console.error('Booking creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    )
  }
}
