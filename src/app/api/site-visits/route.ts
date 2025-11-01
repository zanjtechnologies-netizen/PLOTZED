// ================================================
// src/app/api/site-visits/route.ts - Site Visits API
// ================================================

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { auth } from '@/lib/auth'

const siteVisitSchema = z.object({
  plot_id: z.string().uuid(),
  visit_date: z.string(),
  visit_time: z.string(),
  attendees: z.number().min(1).max(10).default(1),
  notes: z.string().optional(),
})

// POST /api/site-visits - Schedule site visit
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = siteVisitSchema.parse(body)

    const siteVisit = await prisma.siteVisit.create({
      data: {
        user_id: session.user.id,
        plot_id: validatedData.plot_id,
        visit_date: new Date(validatedData.visit_date),
        visit_time: validatedData.visit_time,
        attendees: validatedData.attendees,
        notes: validatedData.notes,
        status: 'PENDING',
      },
      include: {
        plot: {
          select: {
            title: true,
            address: true,
            city: true,
          },
        },
      },
    })

    // TODO: Send confirmation email
    // TODO: Send SMS confirmation

    return NextResponse.json(
      {
        message: 'Site visit scheduled successfully',
        siteVisit,
      },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      )
    }

    console.error('Site visit creation error:', error)
    return NextResponse.json(
      { error: 'Failed to schedule site visit' },
      { status: 500 }
    )
  }
}

// GET /api/site-visits - Get user's site visits
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const siteVisits = await prisma.siteVisit.findMany({
      where: { user_id: session.user.id },
      include: {
        plot: {
          select: {
            title: true,
            address: true,
            city: true,
            images: true,
          },
        },
      },
      orderBy: { visit_date: 'desc' },
    })

    return NextResponse.json(siteVisits)
  } catch (error) {
    console.error('Site visits fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch site visits' },
      { status: 500 }
    )
  }
}