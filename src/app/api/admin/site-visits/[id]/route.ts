// ================================================
// src/app/api/admin/site-visits/[id]/route.ts
// Admin API - Get, Update, Delete individual site visit
// ================================================

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { withErrorHandling } from '@/lib/api-error-handler'
import { z } from 'zod'
import { sendEmail } from '@/lib/email'
import { logSiteVisitStatusChange } from '@/lib/audit-log'
import { getClientIp } from '@/lib/rate-limit'
import { sanitizeString } from '@/lib/security-utils'

// Validation schema for updating site visit
const updateSiteVisitSchema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'RESCHEDULED']).optional(),
  admin_notes: z.string().max(1000).optional(),
  visit_date: z.string().datetime().optional(),
  visit_time: z.string().optional(),
})

// GET - Get single site visit with full details
export const GET = withErrorHandling(async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    )
  }

  if (session.user.role !== 'ADMIN') {
    return NextResponse.json(
      { success: false, error: 'Forbidden - Admin access required' },
      { status: 403 }
    )
  }

  const { id } = await params

  const siteVisit = await prisma.site_visits.findUnique({
    where: { id },
    include: {
      users: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          created_at: true,
        },
      },
      plots: {
        select: {
          id: true,
          title: true,
          price: true,
          plot_size: true,
          address: true,
          city: true,
          state: true,
          images: true,
          //property_type: true;
          //availability_status: true;
        },
      },
    },
  })

  if (!siteVisit) {
    return NextResponse.json(
      { success: false, error: 'Site visit not found' },
      { status: 404 }
    )
  }

  return NextResponse.json({
    success: true,
    data: siteVisit,
  })
})

// PUT - Update site visit (status, notes, reschedule)
export const PUT = withErrorHandling(async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    )
  }

  if (session.user.role !== 'ADMIN') {
    return NextResponse.json(
      { success: false, error: 'Forbidden - Admin access required' },
      { status: 403 }
    )
  }

  const { id } = await params
  const body = await req.json()

  // Validate request body
  const validatedData = updateSiteVisitSchema.parse(body)

  // Get existing site visit
  const existingSiteVisit = await prisma.site_visits.findUnique({
    where: { id },
    include: {
      users: true,
      plots: true,
    },
  })

  if (!existingSiteVisit) {
    return NextResponse.json(
      { success: false, error: 'Site visit not found' },
      { status: 404 }
    )
  }

  // Prepare update data
  const updateData: any = {}

  if (validatedData.status) {
    updateData.status = validatedData.status

    // Update timestamps based on status
    if (validatedData.status === 'CONFIRMED' && existingSiteVisit.status !== 'CONFIRMED') {
      updateData.confirmed_at = new Date()
    } else if (validatedData.status === 'COMPLETED' && existingSiteVisit.status !== 'COMPLETED') {
      updateData.completed_at = new Date()
    } else if (validatedData.status === 'CANCELLED' && existingSiteVisit.status !== 'CANCELLED') {
      updateData.cancelled_at = new Date()
    }
  }

  if (validatedData.admin_notes !== undefined) {
    updateData.admin_notes = validatedData.admin_notes
  }

  if (validatedData.visit_date) {
    updateData.visit_date = new Date(validatedData.visit_date)
    updateData.status = 'RESCHEDULED'
  }

  if (validatedData.visit_time) {
    updateData.visit_time = validatedData.visit_time
  }

  // Update site visit
  const updatedSiteVisit = await prisma.site_visits.update({
    where: { id },
    data: updateData,
    include: {
      users: true,
      plots: true,
    },
  })

  // Audit log the action
  if (validatedData.status && validatedData.status !== existingSiteVisit.status) {
    await logSiteVisitStatusChange(
      session.user.id!,
      session.user.email!,
      id,
      existingSiteVisit.status,
      validatedData.status,
      getClientIp(req)
    )
  }

  // Send email notification based on status change
  if (validatedData.status && validatedData.status !== existingSiteVisit.status) {
    const emailPromises = []

    switch (validatedData.status) {
      case 'CONFIRMED':
        emailPromises.push(
          sendEmail({
            to: existingSiteVisit.users.email,
            subject: 'Site Visit Confirmed - Plotzed',
            html: `
              <h2>Your Site Visit has been Confirmed!</h2>
              <p>Dear ${sanitizeString(existingSiteVisit.users.name)},</p>
              <p>We're pleased to confirm your site visit for:</p>
              <ul>
                <li><strong>Property:</strong> ${sanitizeString(existingSiteVisit.plots.title)}</li>
                <li><strong>Date:</strong> ${updatedSiteVisit.visit_date.toLocaleDateString('en-IN', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}</li>
                <li><strong>Time:</strong> ${sanitizeString(updatedSiteVisit.visit_time)}</li>
                <li><strong>Location:</strong> ${sanitizeString(existingSiteVisit.plots.city)}, ${sanitizeString(existingSiteVisit.plots.state)}</li>
              </ul>
              <p>Please arrive 10 minutes early. If you need to reschedule, please contact us.</p>
              <p>We look forward to meeting you!</p>
              <p>Best regards,<br>Plotzed Team</p>
            `,
          })
        )
        break

      case 'CANCELLED':
        emailPromises.push(
          sendEmail({
            to: existingSiteVisit.users.email,
            subject: 'Site Visit Cancelled - Plotzed',
            html: `
              <h2>Site Visit Cancelled</h2>
              <p>Dear ${sanitizeString(existingSiteVisit.users.name)},</p>
              <p>We regret to inform you that your site visit for <strong>${sanitizeString(existingSiteVisit.plots.title)}</strong> scheduled on ${updatedSiteVisit.visit_date.toLocaleDateString('en-IN')} has been cancelled.</p>
              ${validatedData.admin_notes ? `<p><strong>Reason:</strong> ${sanitizeString(validatedData.admin_notes)}</p>` : ''}
              <p>If you would like to reschedule, please visit our website or contact us directly.</p>
              <p>We apologize for any inconvenience.</p>
              <p>Best regards,<br>Plotzed Team</p>
            `,
          })
        )
        break

      case 'RESCHEDULED':
        emailPromises.push(
          sendEmail({
            to: existingSiteVisit.users.email,
            subject: 'Site Visit Rescheduled - Plotzed',
            html: `
              <h2>Your Site Visit has been Rescheduled</h2>
              <p>Dear ${sanitizeString(existingSiteVisit.users.name)},</p>
              <p>Your site visit for <strong>${sanitizeString(existingSiteVisit.plots.title)}</strong> has been rescheduled to:</p>
              <ul>
                <li><strong>New Date:</strong> ${updatedSiteVisit.visit_date.toLocaleDateString('en-IN', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}</li>
                <li><strong>Time:</strong> ${sanitizeString(updatedSiteVisit.visit_time)}</li>
              </ul>
              ${validatedData.admin_notes ? `<p><strong>Note:</strong> ${sanitizeString(validatedData.admin_notes)}</p>` : ''}
              <p>We look forward to meeting you at the new time!</p>
              <p>Best regards,<br>Plotzed Team</p>
            `,
          })
        )
        break

      case 'COMPLETED':
        emailPromises.push(
          sendEmail({
            to: existingSiteVisit.users.email,
            subject: 'Thank You for Your Visit - Plotzed',
            html: `
              <h2>Thank You for Visiting!</h2>
              <p>Dear ${sanitizeString(existingSiteVisit.users.name)},</p>
              <p>Thank you for visiting <strong>${sanitizeString(existingSiteVisit.plots.title)}</strong>.</p>
              <p>We hope you enjoyed the tour. If you have any questions or would like to proceed further, please don't hesitate to contact us.</p>
              <p>We'd love to hear your feedback about your visit experience!</p>
              <p>Best regards,<br>Plotzed Team</p>
            `,
          })
        )
        break
    }

    // Send emails asynchronously (don't wait for completion)
    Promise.all(emailPromises).catch((error) => {
      console.error('Error sending email notifications:', error)
    })
  }

  return NextResponse.json({
    success: true,
    data: updatedSiteVisit,
    message: 'Site visit updated successfully',
  })
})

// DELETE - Cancel/delete site visit
export const DELETE = withErrorHandling(async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    )
  }

  if (session.user.role !== 'ADMIN') {
    return NextResponse.json(
      { success: false, error: 'Forbidden - Admin access required' },
      { status: 403 }
    )
  }

  const { id } = await params

  // Get existing site visit
  const existingSiteVisit = await prisma.site_visits.findUnique({
    where: { id },
    include: {
      users: true,
      plots: true,
    },
  })

  if (!existingSiteVisit) {
    return NextResponse.json(
      { success: false, error: 'Site visit not found' },
      { status: 404 }
    )
  }

  // Soft delete by marking as cancelled
  const deletedSiteVisit = await prisma.site_visits.update({
    where: { id },
    data: {
      status: 'CANCELLED',
      //cancelled_at: new Date(),
      //admin_notes: 'Deleted by admin',
    },
  })

  // Send cancellation email
  sendEmail({
    to: existingSiteVisit.users.email,
    subject: 'Site Visit Cancelled - Plotzed',
    html: `
      <h2>Site Visit Cancelled</h2>
      <p>Dear ${existingSiteVisit.users.name},</p>
      <p>Your site visit for <strong>${existingSiteVisit.plots.title}</strong> scheduled on ${existingSiteVisit.visit_date.toLocaleDateString('en-IN')} has been cancelled.</p>
      <p>If you would like to reschedule, please visit our website or contact us directly.</p>
      <p>We apologize for any inconvenience.</p>
      <p>Best regards,<br>Plotzed Team</p>
    `,
  }).catch((error) => {
    console.error('Error sending cancellation email:', error)
  })

  return NextResponse.json({
    success: true,
    message: 'Site visit cancelled successfully',
  })
})
