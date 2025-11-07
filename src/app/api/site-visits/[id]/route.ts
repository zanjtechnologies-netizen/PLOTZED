// ================================================
// src/app/api/site-visits/[id]/route.ts - Single Site Visit Management
// ================================================

import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { noContentResponse, successResponse, withErrorHandling } from '@/lib/api-error-handler'
import { BadRequestError, ForbiddenError, NotFoundError, UnauthorizedError } from '@/lib/errors'
import { structuredLogger } from '@/lib/structured-logger'
import { sendEmail, emailTemplates } from '@/lib/email'

/**
 * Schema for updating site visit
 */
const updateSiteVisitSchema = z.object({
  visit_date: z.string().optional(),
  visit_time: z.string().optional(),
  attendees: z.number().min(1).max(10).optional(),
  notes: z.string().optional(),
  status: z.enum(['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED']).optional(),
})

/**
 * GET /api/site-visits/:id
 * Fetch a single site visit by ID
 *
 * Authorization:
 * - Users can only view their own site visits
 * - Admins can view all site visits
 */
export const GET = withErrorHandling(
  async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const session = await auth()

    if (!session?.user) {
      throw new UnauthorizedError('Please login to view site visit details')
    }

    const { id } = await params

    const siteVisit = await prisma.siteVisit.findUnique({
      where: { id },
      include: {
        plot: {
          select: {
            id: true,
            title: true,
            address: true,
            city: true,
            state: true,
            pincode: true,
            images: true,
            price: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    })

    if (!siteVisit) {
      throw new NotFoundError('Site visit not found')
    }

    // Check if user owns this site visit or is admin
    if (siteVisit.user_id !== session.user.id && session.user.role !== 'ADMIN') {
      throw new ForbiddenError('You do not have permission to view this site visit')
    }

    return successResponse({ siteVisit })
  },
  'GET /api/site-visits/[id]'
)

/**
 * PATCH /api/site-visits/:id
 * Update a site visit (reschedule or change status)
 *
 * Authorization:
 * - Users can update their own site visits (except status)
 * - Admins can update any site visit including status
 *
 * Business Rules:
 * - Cannot update a COMPLETED or CANCELLED site visit
 * - Only admins can change status
 */
export const PATCH = withErrorHandling(
  async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const session = await auth()

    if (!session?.user) {
      throw new UnauthorizedError('Please login to update site visit')
    }

    const { id } = await params
    const body = await request.json()
    const validatedData = updateSiteVisitSchema.parse(body)

    // Fetch existing site visit
    const existingSiteVisit = await prisma.siteVisit.findUnique({
      where: { id },
      include: {
        plot: {
          select: {
            title: true,
            address: true,
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

    if (!existingSiteVisit) {
      throw new NotFoundError('Site visit not found')
    }

    // Check ownership
    const isOwner = existingSiteVisit.user_id === session.user.id
    const isAdmin = session.user.role === 'ADMIN'

    if (!isOwner && !isAdmin) {
      throw new ForbiddenError('You do not have permission to update this site visit')
    }

    // Business rule: Cannot update COMPLETED or CANCELLED visits
    if (['COMPLETED', 'CANCELLED'].includes(existingSiteVisit.status)) {
      throw new BadRequestError(
        `Cannot update a ${existingSiteVisit.status.toLowerCase()} site visit`
      )
    }

    // Only admins can change status
    if (validatedData.status && !isAdmin) {
      throw new ForbiddenError('Only admins can change site visit status')
    }

    // Prepare update data
    const updateData: any = {}

    if (validatedData.visit_date) {
      updateData.visit_date = new Date(validatedData.visit_date)
    }
    if (validatedData.visit_time !== undefined) {
      updateData.visit_time = validatedData.visit_time
    }
    if (validatedData.attendees !== undefined) {
      updateData.attendees = validatedData.attendees
    }
    if (validatedData.notes !== undefined) {
      updateData.notes = validatedData.notes
    }
    if (validatedData.status && isAdmin) {
      updateData.status = validatedData.status
    }

    // Update site visit
    const updatedSiteVisit = await prisma.siteVisit.update({
      where: { id },
      data: updateData,
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

    structuredLogger.info('Site visit updated', {
      siteVisitId: id,
      userId: session.user.id,
      changes: Object.keys(updateData),
      type: 'site_visit_update',
    })

    // Send notification email if rescheduled
    if (validatedData.visit_date || validatedData.visit_time) {
      try {
        if (existingSiteVisit.user.email) {
          await sendEmail({
            to: existingSiteVisit.user.email,
            subject: 'Site Visit Rescheduled - Plotzed Real Estate',
            html: emailTemplates.siteVisitConfirmation({
              customerName: existingSiteVisit.user.name,
              propertyName: updatedSiteVisit.plot.title,
              visitDate: new Date(updatedSiteVisit.visit_date).toLocaleDateString('en-IN', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              }),
              visitTime: updatedSiteVisit.visit_time,
            }),
          })
        }
      } catch (emailError) {
        structuredLogger.error('Site visit update email failed', emailError as Error, {
          siteVisitId: id,
        })
        // Don't fail the update if email fails
      }
    }

    return successResponse({ siteVisit: updatedSiteVisit }, 200, 'Site visit updated successfully')
  },
  'PATCH /api/site-visits/[id]'
)

/**
 * DELETE /api/site-visits/:id
 * Cancel a site visit
 *
 * Authorization:
 * - Users can cancel their own site visits
 * - Admins can cancel any site visit
 *
 * Business Rules:
 * - Cannot cancel a COMPLETED or already CANCELLED visit
 * - Sets status to CANCELLED instead of deleting (for audit trail)
 */
export const DELETE = withErrorHandling(
  async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const session = await auth()

    if (!session?.user) {
      throw new UnauthorizedError('Please login to cancel site visit')
    }

    const { id } = await params

    // Fetch existing site visit
    const siteVisit = await prisma.siteVisit.findUnique({
      where: { id },
      include: {
        plot: {
          select: {
            title: true,
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

    if (!siteVisit) {
      throw new NotFoundError('Site visit not found')
    }

    // Check ownership
    const isOwner = siteVisit.user_id === session.user.id
    const isAdmin = session.user.role === 'ADMIN'

    if (!isOwner && !isAdmin) {
      throw new ForbiddenError('You do not have permission to cancel this site visit')
    }

    // Business rule: Cannot cancel COMPLETED visits
    if (siteVisit.status === 'COMPLETED') {
      throw new BadRequestError('Cannot cancel a completed site visit')
    }

    // Business rule: Already cancelled
    if (siteVisit.status === 'CANCELLED') {
      throw new BadRequestError('Site visit is already cancelled')
    }

    // Update status to CANCELLED instead of deleting (for audit trail)
    await prisma.siteVisit.update({
      where: { id },
      data: {
        status: 'CANCELLED',
      },
    })

    structuredLogger.warn('Site visit cancelled', {
      siteVisitId: id,
      userId: session.user.id,
      plotId: siteVisit.plot_id,
      type: 'site_visit_cancelled',
    })

    // Send cancellation email
    try {
      if (siteVisit.user.email) {
        await sendEmail({
          to: siteVisit.user.email,
          subject: 'Site Visit Cancelled - Plotzed Real Estate',
          html: `
            <h2>Site Visit Cancelled</h2>
            <p>Dear ${siteVisit.user.name},</p>
            <p>Your site visit for <strong>${siteVisit.plot.title}</strong> has been cancelled.</p>
            <p>If you would like to reschedule, please contact us or book a new visit through our website.</p>
            <p>Best regards,<br>Plotzed Real Estate Team</p>
          `,
        })
      }
    } catch (emailError) {
      structuredLogger.error('Site visit cancellation email failed', emailError as Error, {
        siteVisitId: id,
      })
      // Don't fail the cancellation if email fails
    }

    return noContentResponse()
  },
  'DELETE /api/site-visits/[id]'
)
