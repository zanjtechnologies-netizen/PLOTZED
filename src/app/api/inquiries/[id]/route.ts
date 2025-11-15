// ================================================
// src/app/api/inquiries/[id]/route.ts - Single Inquiry Management
// ================================================
export const runtime = "nodejs";

import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { noContentResponse, successResponse, withErrorHandling } from '@/lib/api-error-handler'
import { ForbiddenError, NotFoundError, UnauthorizedError } from '@/lib/errors'
import { structuredLogger } from '@/lib/structured-logger'

// Schema for updating inquiry
const updateInquirySchema = z.object({
  status: z.enum(['NEW', 'CONTACTED', 'QUALIFIED', 'CONVERTED', 'CLOSED']).optional(),
  notes: z.string().optional(),
})

export const GET = withErrorHandling(
  async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const session = await auth()

    if (!session?.user) {
      throw new UnauthorizedError('Please login to view inquiry')
    }

    // Only admins can view inquiries
    if (session.user.role !== 'ADMIN') {
      throw new ForbiddenError('Admin access required')
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
          },
        },
        plot: {
          select: {
            id: true,
            title: true,
            slug: true,
            city: true,
            price: true,
          },
        },
      },
    })

    if (!inquiry) {
      throw new NotFoundError('Inquiry not found')
    }

    return successResponse({ inquiry })
  },
  'GET /api/inquiries/[id]'
)

export const PATCH = withErrorHandling(
  async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const session = await auth()

    if (!session?.user) {
      throw new UnauthorizedError('Please login to update inquiry')
    }

    // Only admins can update inquiries
    if (session.user.role !== 'ADMIN') {
      throw new ForbiddenError('Admin access required')
    }

    const { id } = await params
    const body = await request.json()
    const validatedData = updateInquirySchema.parse(body)

    const inquiry = await prisma.inquiry.update({
      where: { id },
      data: validatedData,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        plot: {
          select: {
            id: true,
            title: true,
            slug: true,
            city: true,
          },
        },
      },
    })

    // Log activity
    await prisma.activityLog.create({
      data: {
        user_id: session.user.id,
        action: 'INQUIRY_UPDATED',
        entity_type: 'inquiry',
        entity_id: id,
        metadata: validatedData,
      },
    })

    structuredLogger.info('Inquiry updated', {
      inquiryId: id,
      userId: session.user.id,
      status: validatedData.status,
      type: 'inquiry_update',
    })

    return successResponse({ inquiry }, 200, 'Inquiry updated successfully')
  },
  'PATCH /api/inquiries/[id]'
)

export const DELETE = withErrorHandling(
  async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const session = await auth()

    if (!session?.user) {
      throw new UnauthorizedError('Please login to delete inquiry')
    }

    // Only admins can delete inquiries
    if (session.user.role !== 'ADMIN') {
      throw new ForbiddenError('Admin access required')
    }

    const { id } = await params

    await prisma.inquiry.delete({
      where: { id },
    })

    // Log activity
    await prisma.activityLog.create({
      data: {
        user_id: session.user.id,
        action: 'INQUIRY_DELETED',
        entity_type: 'inquiry',
        entity_id: id,
      },
    })

    structuredLogger.warn('Inquiry deleted', {
      inquiryId: id,
      userId: session.user.id,
      type: 'inquiry_deletion',
    })

    return noContentResponse()
  },
  'DELETE /api/inquiries/[id]'
)
