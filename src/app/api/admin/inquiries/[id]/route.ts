// ================================================
// src/app/api/admin/inquiries/[id]/route.ts
// Admin API - Get and Update individual inquiry
// ================================================

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { withErrorHandling } from '@/lib/api-error-handler'
import { z } from 'zod'
import { sendEmail } from '@/lib/email'
import { logInquiryStatusChange } from '@/lib/audit-log'
import { getClientIp } from '@/lib/rate-limit'
import { sanitizeString } from '@/lib/security-utils'

// Validation schema for updating inquiry
const updateInquirySchema = z.object({
  status: z.enum(['NEW', 'CONTACTED', 'QUALIFIED', 'CONVERTED', 'CLOSED']).optional(),
  admin_notes: z.string().max(1000).optional(),
})

// GET - Get single inquiry with full details
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

  const inquiry = await prisma.inquiry.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          created_at: true,
        },
      },
      plot: {
        select: {
          id: true,
          title: true,
          price: true,
          plot_size: true,
          address: true,
          city: true,
          state: true,
          images: true,
          //property_type: true,
        },
      },
    },
  })

  if (!inquiry) {
    return NextResponse.json(
      { success: false, error: 'Inquiry not found' },
      { status: 404 }
    )
  }

  return NextResponse.json({
    success: true,
    data: inquiry,
  })
})

// PUT - Update inquiry status
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
  const validatedData = updateInquirySchema.parse(body)

  // Get existing inquiry
  const existingInquiry = await prisma.inquiry.findUnique({
    where: { id },
    include: {
      user: true,
      plot: true,
    },
  })

  if (!existingInquiry) {
    return NextResponse.json(
      { success: false, error: 'Inquiry not found' },
      { status: 404 }
    )
  }

  // Prepare update data
  const updateData: any = {}

  if (validatedData.status) {
    updateData.status = validatedData.status

    // Update responded_at timestamp if changing from NEW
    if (validatedData.status !== 'NEW' && existingInquiry.status === 'NEW') {
      updateData.responded_at = new Date()
    }
  }

  if (validatedData.admin_notes !== undefined) {
    updateData.admin_notes = validatedData.admin_notes
  }

  // Update inquiry
  const updatedInquiry = await prisma.inquiry.update({
    where: { id },
    data: updateData,
    include: {
      user: true,
      plot: true,
    },
  })

  // Audit log the action
  if (validatedData.status && validatedData.status !== existingInquiry.status) {
    await logInquiryStatusChange(
      session.user.id!,
      session.user.email!,
      id,
      existingInquiry.status,
      validatedData.status,
      getClientIp(req)
    )
  }

  // Send email notification based on status change
  if (
    validatedData.status &&
    validatedData.status !== existingInquiry.status &&
    existingInquiry.user &&
    existingInquiry.plot
  ) {
    const emailPromises = []

    switch (validatedData.status) {
      case 'CONTACTED':
        emailPromises.push(
          sendEmail({
            to: existingInquiry.user.email,
            subject: 'Thank You for Your Inquiry - Plotzed',
            html: `
              <h2>We've Received Your Inquiry!</h2>
              <p>Dear ${sanitizeString(existingInquiry.user.name)},</p>
              <p>Thank you for your interest in <strong>${sanitizeString(existingInquiry.plot.title)}</strong>.</p>
              <p>Our team has received your inquiry and will be in touch with you shortly to discuss your requirements.</p>
              <p>If you have any immediate questions, please don't hesitate to contact us.</p>
              <p>Best regards,<br>Plotzed Team</p>
            `,
          })
        )
        break

      case 'QUALIFIED':
        emailPromises.push(
          sendEmail({
            to: existingInquiry.user.email,
            subject: 'Exciting Update on Your Property Inquiry - Plotzed',
            html: `
              <h2>Great News About Your Inquiry!</h2>
              <p>Dear ${sanitizeString(existingInquiry.user.name)},</p>
              <p>We're pleased to inform you that based on your requirements, <strong>${sanitizeString(existingInquiry.plot.title)}</strong> appears to be an excellent match for you!</p>
              <p>Our property consultant will be reaching out to you soon to schedule a detailed discussion and site visit.</p>
              ${validatedData.admin_notes ? `<p><strong>Note from our team:</strong> ${sanitizeString(validatedData.admin_notes)}</p>` : ''}
              <p>We're excited to help you find your perfect property!</p>
              <p>Best regards,<br>Plotzed Team</p>
            `,
          })
        )
        break

      case 'CONVERTED':
        emailPromises.push(
          sendEmail({
            to: existingInquiry.user.email,
            subject: 'Congratulations! - Plotzed',
            html: `
              <h2>Congratulations on Your Decision!</h2>
              <p>Dear ${sanitizeString(existingInquiry.user.name)},</p>
              <p>We're thrilled to be part of your journey to owning <strong>${sanitizeString(existingInquiry.plot.title)}</strong>!</p>
              <p>Our team will guide you through the next steps to make this process smooth and hassle-free.</p>
              <p>Thank you for choosing Plotzed. We look forward to serving you!</p>
              <p>Best regards,<br>Plotzed Team</p>
            `,
          })
        )
        break

      case 'CLOSED':
        emailPromises.push(
          sendEmail({
            to: existingInquiry.user.email,
            subject: 'Thank You for Considering Plotzed',
            html: `
              <h2>Thank You for Your Interest</h2>
              <p>Dear ${sanitizeString(existingInquiry.user.name)},</p>
              <p>Thank you for your inquiry about <strong>${sanitizeString(existingInquiry.plot.title)}</strong>.</p>
              <p>While this particular property may not have been the right fit, we have many other excellent properties that might interest you.</p>
              <p>Please feel free to browse our listings or contact us anytime. We'd love to help you find your perfect property!</p>
              <p>Best regards,<br>Plotzed Team</p>
            `,
          })
        )
        break
    }

    // Send emails asynchronously
    Promise.all(emailPromises).catch((error) => {
      console.error('Error sending email notifications:', error)
    })
  }

  return NextResponse.json({
    success: true,
    data: updatedInquiry,
    message: 'Inquiry updated successfully',
  })
})
