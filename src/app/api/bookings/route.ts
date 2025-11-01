// ================================================
// src/app/api/bookings/route.ts - Bookings API
// ================================================

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { bookingSchema } from '@/lib/validators'
import { z } from 'zod'

export async function POST(req: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id
    const body = await req.json()
    const validation = bookingSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.error.flatten() },
        { status: 400 }
      )
    }

    const { plotId, visitDate, attendees, notes } = validation.data
    const visitDateTime = new Date(visitDate)
    const visitTime = visitDateTime.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    })

    // 1. Check if the plot exists
    const plot = await prisma.plot.findUnique({
      where: { id: plotId },
    })

    if (!plot) {
      return NextResponse.json({ error: 'Plot not found' }, { status: 404 })
    }

    // 2. Check for conflicting site visits for the same plot at the same time
    const conflictingVisit = await prisma.siteVisit.findFirst({
      where: {
        plot_id: plotId,
        visit_date: visitDateTime,
      },
    })

    if (conflictingVisit) {
      return NextResponse.json(
        { error: 'This time slot is already booked for a site visit.' },
        { status: 409 }
      )
    }

    // 3. Create the new site visit
    const newSiteVisit = await prisma.siteVisit.create({
      data: {
        plot_id: plotId,
        user_id: userId,
        visit_date: visitDateTime,
        visit_time: visitTime,
        attendees,
        notes,
        status: 'PENDING', // Default status
      },
    })

    return NextResponse.json(newSiteVisit, { status: 201 })
  } catch (error) {
    console.error('Site visit creation error:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.flatten() },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
