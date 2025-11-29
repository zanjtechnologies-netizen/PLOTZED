// ================================================
// src/app/api/site-visits/route.ts - Site Visits API
// ================================================
export const runtime = "nodejs";

import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { auth } from '@/lib/auth'
import { sendEmail, emailTemplates } from '@/lib/email'
import { createdResponse, successResponse, withErrorHandling } from '@/lib/api-error-handler'
import { UnauthorizedError } from '@/lib/errors'
import { structuredLogger } from '@/lib/structured-logger'
import { randomUUID } from 'crypto'

const siteVisitSchema = z.object({
  plot_id: z.string().uuid(),
  visit_date: z.string(),
  visit_time: z.string(),
  attendees: z.number().min(1).max(10).default(1),
  notes: z.string().max(500).optional(),
  // Optional contact overrides
  contact_name: z.string().optional(),
  contact_phone: z.string().regex(/^[6-9]\d{9}$/).optional().or(z.literal('')),
  contact_email: z.string().email().optional().or(z.literal('')),
})

// POST /api/site-visits - Schedule site visit
export const POST = withErrorHandling(
  async (request: NextRequest) => {
    const session = await auth()

    if (!session?.user) {
      throw new UnauthorizedError('Please login to schedule a site visit')
    }

    const body = await request.json()
    const validatedData = siteVisitSchema.parse(body)

    const siteVisit = await prisma.site_visits.create({
      data: {
        id: randomUUID(),
        updated_at: new Date(),
        user_id: session.user.id,
        plot_id: validatedData.plot_id,
        visit_date: new Date(validatedData.visit_date),
        visit_time: validatedData.visit_time,
        attendees: validatedData.attendees,
        notes: validatedData.notes,
        // Optional contact overrides
        contact_name: validatedData.contact_name || undefined,
        contact_phone: validatedData.contact_phone || undefined,
        contact_email: validatedData.contact_email || undefined,
        status: 'PENDING',
      },
      include: {
        plots: {
          select: {
            title: true,
            address: true,
            city: true,
          },
        },
      },
    })

    structuredLogger.info('Site visit scheduled', {
      siteVisitId: siteVisit.id,
      userId: session.user.id,
      plotId: validatedData.plot_id,
      type: 'site_visit_scheduled',
    })

    // Send confirmation email
    const user = await prisma.users.findUnique({
      where: { id: session.user.id },
      select: { name: true, email: true },
    })

    if (user?.email) {
      try {
        await sendEmail({
          to: user.email,
          subject: 'Site Visit Scheduled - Plotzed Real Estate',
          html: emailTemplates.siteVisitConfirmation({
            customerName: user.name,
            propertyName: siteVisit.plots.title,
            visitDate: new Date(siteVisit.visit_date).toLocaleDateString('en-IN', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            }),
            visitTime: siteVisit.visit_time,
          }),
        })
      } catch (emailError) {
        structuredLogger.error('Site visit confirmation email failed', emailError as Error, {
          siteVisitId: siteVisit.id,
        })
      }
    }

    return createdResponse(
      {
        message: 'Site visit scheduled successfully',
        siteVisit,
      },
      'Site visit scheduled successfully'
    )
  },
  'POST /api/site-visits'
)

// GET /api/site-visits - Get user's site visits
export const GET = withErrorHandling(
  async (request: NextRequest) => {
    const session = await auth()

    if (!session?.user) {
      throw new UnauthorizedError('Please login to view site visits')
    }

    const siteVisits = await prisma.site_visits.findMany({
      where: { user_id: session.user.id },
      include: {
        plots: {
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

    return successResponse({ siteVisits })
  },
  'GET /api/site-visits'
)
