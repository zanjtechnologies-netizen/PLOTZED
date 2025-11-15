// ================================================
// src/app/api/auth/send-verification/route.ts
// Resend Email Verification
// ================================================
export const runtime = "nodejs";

import { NextRequest } from 'next/server'
import { z } from 'zod'
import crypto from 'crypto'
import { prisma } from '@/lib/prisma'
import { sendEmail, emailTemplates } from '@/lib/email'
import { successResponse, withErrorHandling } from '@/lib/api-error-handler'
import { BadRequestError, InternalServerError } from '@/lib/errors'
import { structuredLogger } from '@/lib/structured-logger'

const sendVerificationSchema = z.object({
  email: z.string().email(),
})

export const POST = withErrorHandling(
  async (request: NextRequest) => {
    const body = await request.json()
    const { email } = sendVerificationSchema.parse(body)

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      // Don't reveal if user exists for security
      structuredLogger.info('Verification email requested for non-existent user', {
        email,
        type: 'send_verification',
      })
      return successResponse({
        message: 'If the email exists, a verification link has been sent.',
      })
    }

    // Check if already verified
    if (user.email_verified) {
      throw new BadRequestError('Email is already verified')
    }

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex')
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

    // Update user with verification token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        verification_token: verificationToken,
        verification_token_expires: verificationExpires,
      },
    })

    // Send verification email
    const verificationUrl = `${process.env.NEXTAUTH_URL}/auth/verify-email?token=${verificationToken}`

    try {
      await sendEmail({
        to: user.email,
        subject: 'Verify Your Email - Plotzed Real Estate',
        html: emailTemplates.emailVerification(user.name, verificationUrl),
      })

      structuredLogger.info('Verification email sent', {
        userId: user.id,
        email: user.email,
        type: 'send_verification',
      })
    } catch (emailError) {
      structuredLogger.error('Verification email failed', emailError as Error, {
        userId: user.id,
        email: user.email,
      })
      throw new InternalServerError('Failed to send verification email')
    }

    return successResponse({
      message: 'Verification email sent successfully',
    })
  },
  'POST /api/auth/send-verification'
)
