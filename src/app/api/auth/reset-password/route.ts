// ================================================
// src/app/api/auth/reset-password/route.ts
// Password Reset Endpoint
// ================================================
export const runtime = "nodejs";

import { NextRequest } from 'next/server'
import { z } from 'zod'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { sendEmail, emailTemplates } from '@/lib/email'
import { successResponse, withErrorHandling } from '@/lib/api-error-handler'
import { BadRequestError } from '@/lib/errors'
import { structuredLogger } from '@/lib/structured-logger'

const resetPasswordSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export const POST = withErrorHandling(
  async (request: NextRequest) => {
    const body = await request.json()
    const { token, password } = resetPasswordSchema.parse(body)

    // Find user with this reset token
    const user = await prisma.user.findUnique({
      where: { reset_token: token },
    })

    if (!user) {
      throw new BadRequestError('Invalid or expired reset token')
    }

    // Check if token is expired
    if (user.reset_token_expires && user.reset_token_expires < new Date()) {
      throw new BadRequestError('Reset token has expired. Please request a new one.')
    }

    // Hash new password
    const password_hash = await bcrypt.hash(password, 12)

    // Update user password and clear reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password_hash,
        reset_token: null,
        reset_token_expires: null,
      },
    })

    structuredLogger.info('Password reset successfully', {
      userId: user.id,
      email: user.email,
      type: 'password_reset',
    })

    // Send password reset success email
    try {
      await sendEmail({
        to: user.email,
        subject: 'Password Reset Successful - Plotzed Real Estate',
        html: emailTemplates.passwordResetSuccess(user.name),
      })
    } catch (emailError) {
      structuredLogger.error('Password reset success email failed', emailError as Error, {
        userId: user.id,
        email: user.email,
      })
      // Don't fail the password reset if email fails
    }

    return successResponse({
      message: 'Password reset successfully',
    })
  },
  'POST /api/auth/reset-password'
)
    

    
    
  

