// ================================================
// src/app/api/auth/verify-email/route.ts
// Email Verification Endpoint
// ================================================

import { NextRequest } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { successResponse, withErrorHandling } from '@/lib/api-error-handler'
import { BadRequestError } from '@/lib/errors'
import { structuredLogger } from '@/lib/structured-logger'

const verifySchema = z.object({
  token: z.string().min(1),
})

export const POST = withErrorHandling(
  async (request: NextRequest) => {
    const body = await request.json()
    const { token } = verifySchema.parse(body)

    // Find user with this verification token
    const user = await prisma.user.findUnique({
      where: { verification_token: token },
    })

    if (!user) {
      throw new BadRequestError('Invalid verification token')
    }

    // Check if token is expired
    if (user.verification_token_expires && user.verification_token_expires < new Date()) {
      throw new BadRequestError('Verification token has expired. Please request a new one.')
    }

    // Check if already verified
    if (user.email_verified) {
      return successResponse({
        message: 'Email is already verified',
      })
    }

    // Verify the email
    await prisma.user.update({
      where: { id: user.id },
      data: {
        email_verified: true,
        verification_token: null,
        verification_token_expires: null,
      },
    })

    structuredLogger.info('Email verified successfully', {
      userId: user.id,
      email: user.email,
      type: 'email_verification',
    })

    return successResponse({
      message: 'Email verified successfully',
    })
  },
  'POST /api/auth/verify-email'
)

// GET endpoint for clicking verification link
export const GET = withErrorHandling(
  async (request: NextRequest) => {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    if (!token) {
      throw new BadRequestError('Token is required')
    }

    // Find user with this verification token
    const user = await prisma.user.findUnique({
      where: { verification_token: token },
    })

    if (!user) {
      throw new BadRequestError('Invalid verification token')
    }

    // Check if token is expired
    if (user.verification_token_expires && user.verification_token_expires < new Date()) {
      throw new BadRequestError('Verification token has expired. Please request a new one.')
    }

    // Check if already verified
    if (user.email_verified) {
      return successResponse({
        message: 'Email is already verified',
      })
    }

    // Verify the email
    await prisma.user.update({
      where: { id: user.id },
      data: {
        email_verified: true,
        verification_token: null,
        verification_token_expires: null,
      },
    })

    structuredLogger.info('Email verified successfully via link', {
      userId: user.id,
      email: user.email,
      type: 'email_verification',
    })

    return successResponse({
      message: 'Email verified successfully',
    })
  },
  'GET /api/auth/verify-email'
)
