// ================================================
// src/app/api/auth/register/route.ts - Registration API
// ================================================
export const runtime = "nodejs";

import { NextRequest } from 'next/server'
import bcrypt from 'bcryptjs'
import crypto, { randomUUID } from 'crypto'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { sendEmail, emailTemplates } from '@/lib/email'
import { createdResponse, withErrorHandling } from '@/lib/api-error-handler'
import { ConflictError } from '@/lib/errors'
import { structuredLogger } from '@/lib/structured-logger'

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().regex(/^[6-9]\d{9}$/).optional().or(z.literal('')),
  password: z.string().min(8),
})

export const POST = withErrorHandling(
  async (request: NextRequest) => {
    const body = await request.json()

    // Validate input
    const validatedData = registerSchema.parse(body)

    // Check if user already exists
    const existingUser = await prisma.users.findFirst({
      where: {
        OR: [
          { email: validatedData.email },
          ...(validatedData.phone ? [{ phone: validatedData.phone }] : []),
        ],
      },
    })

    if (existingUser) {
      throw new ConflictError('User with this email or phone already exists')
    }

    // Hash password
    const password_hash = await bcrypt.hash(validatedData.password, 12)

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex')
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

    // Create user
    const user = await prisma.users.create({
      data: {
        id: randomUUID(),
        updated_at: new Date(),
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone || undefined,
        password_hash,
        role: 'CUSTOMER',
        verification_token: verificationToken,
        verification_token_expires: verificationExpires,
        email_verified: false,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    })

    structuredLogger.info('User registered successfully', {
      userId: user.id,
      email: user.email,
      type: 'user_registration',
    })

    // Send verification email
    const verificationUrl = `${process.env.NEXTAUTH_URL}/auth/verify-email?token=${verificationToken}`

    try {
      await sendEmail({
        to: validatedData.email,
        subject: 'Verify Your Email - Plotzed Real Estate',
        html: emailTemplates.emailVerification(validatedData.name, verificationUrl),
      })
    } catch (emailError) {
      structuredLogger.error('Verification email failed', emailError as Error, {
        userId: user.id,
        email: user.email,
      })
      // Don't fail registration if email fails
    }

    // Also send welcome email
    try {
      await sendEmail({
        to: validatedData.email,
        subject: 'Welcome to Plotzed Real Estate!',
        html: emailTemplates.welcomeEmail(validatedData.name),
      })
    } catch (emailError) {
      structuredLogger.error('Welcome email failed', emailError as Error, {
        userId: user.id,
        email: user.email,
      })
      // Don't fail registration if email fails
    }

    return createdResponse(
      {
        users: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      },
      'User registered successfully. Please check your email to verify your account.'
    )
  },
  'POST /api/auth/register'
)
