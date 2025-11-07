// ================================================
// src/app/api/auth/forgot-password/route.ts
// Password Reset Request
// ================================================

import { NextRequest } from 'next/server'
import { z } from 'zod'
import crypto from 'crypto'
import { prisma } from '@/lib/prisma'
import { sendEmail, emailTemplates } from '@/lib/email'
import { withErrorHandling, successResponse } from '@/lib/api-error-handler'
import { InternalServerError } from '@/lib/errors'
import { structuredLogger } from '@/lib/structured-logger'

const forgotPasswordSchema = z.object({
  email: z.string().email(),
})

export const POST = withErrorHandling(
  async (request: NextRequest) => {
    const body = await request.json()
    const { email } = forgotPasswordSchema.parse(body)

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    })

    // Don't reveal if user exists for security reasons
    if (!user) {
      structuredLogger.info('Password reset requested for non-existent email', {
        email,
        type: 'password_reset',
      })
      return successResponse(
        { message: 'If the email exists, a password reset link has been sent.' }
      )
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetExpires = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

    // Update user with reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        reset_token: resetToken,
        reset_token_expires: resetExpires,
      },
    })

    // Send password reset email
    const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${resetToken}`

    try {
      await sendEmail({
        to: user.email,
        subject: 'Reset Your Password - Plotzed Real Estate',
        html: emailTemplates.passwordReset(user.name, resetUrl),
      })

      structuredLogger.info('Password reset email sent', {
        userId: user.id,
        email: user.email,
        type: 'password_reset',
      })
    } catch (emailError) {
      structuredLogger.error('Password reset email failed', emailError as Error, {
        userId: user.id,
        email: user.email,
      })
      throw new InternalServerError('Failed to send password reset email')
    }

    return successResponse({
      message: 'Password reset email sent successfully',
    })
  },
  'POST /api/auth/forgot-password'
)
