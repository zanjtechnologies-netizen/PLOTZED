// ================================================
// src/app/api/inquiries/route.ts - Inquiries API
// ================================================

import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { auth } from '@/lib/auth'
import { sendEmail, emailTemplates } from '@/lib/email'
import { createdResponse, successResponse, withErrorHandling } from '@/lib/api-error-handler'
import { UnauthorizedError } from '@/lib/errors'
import { structuredLogger } from '@/lib/structured-logger'

const inquirySchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().regex(/^[6-9]\d{9}$/),
  message: z.string().min(10),
  plot_id: z.string().uuid().optional(),
  source: z.string().default('website'),
})

// POST /api/inquiries - Create inquiry
export const POST = withErrorHandling(
  async (request: NextRequest) => {
    const body = await request.json()
    const validatedData = inquirySchema.parse(body)

    const inquiry = await prisma.inquiry.create({
      data: {
        ...validatedData,
        status: 'NEW',
      },
      include: {
        plot: {
          select: {
            title: true,
          },
        },
      },
    })

    structuredLogger.info('New inquiry received', {
      inquiryId: inquiry.id,
      email: validatedData.email,
      plotId: validatedData.plot_id,
      type: 'inquiry_creation',
    })

    // Send confirmation email to customer
    try {
      await sendEmail({
        to: validatedData.email,
        subject: 'Inquiry Received - Plotzed Real Estate',
        html: emailTemplates.inquiryReceived(
          validatedData.name,
          inquiry.plot?.title || 'General Inquiry'
        ),
      })
    } catch (emailError) {
      structuredLogger.error('Customer inquiry email failed', emailError as Error, {
        inquiryId: inquiry.id,
      })
      // Don't fail inquiry if email fails
    }

    // Send notification email to admin
    try {
      const adminEmail = process.env.ADMIN_EMAIL
      if (adminEmail) {
        await sendEmail({
          to: adminEmail,
          subject: 'New Inquiry Received - Plotzed Admin',
          html: emailTemplates.adminNewInquiry(
            validatedData.name,
            validatedData.email,
            validatedData.phone,
            inquiry.plot?.title || 'General Inquiry',
            validatedData.message
          ),
        })
      }
    } catch (emailError) {
      structuredLogger.error('Admin inquiry notification failed', emailError as Error, {
        inquiryId: inquiry.id,
      })
      // Don't fail inquiry if email fails
    }

    return createdResponse(
      {
        message: 'Inquiry submitted successfully',
        inquiry,
      },
      'Inquiry submitted successfully'
    )
  },
  'POST /api/inquiries'
)

// GET /api/inquiries - Get all inquiries (Admin only)
export const GET = withErrorHandling(
  async (request: NextRequest) => {
    const session = await auth()

    if (!session?.user || session.user.role !== 'ADMIN') {
      throw new UnauthorizedError('Admin access required')
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const skip = (page - 1) * limit

    const where: any = {}
    if (status) where.status = status

    const [inquiries, total] = await Promise.all([
      prisma.inquiry.findMany({
        where,
        include: {
          plot: {
            select: {
              id: true,
              title: true,
            },
          },
        },
        orderBy: { created_at: 'desc' },
        skip,
        take: limit,
      }),
      prisma.inquiry.count({ where }),
    ])

    return successResponse({
      inquiries,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  },
  'GET /api/inquiries'
)
