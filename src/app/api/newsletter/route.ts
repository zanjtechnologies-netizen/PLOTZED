// ================================================
// src/app/api/newsletter/route.ts - Newsletter Subscription API
// ================================================

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { emailService } from '@/lib/email'
import { z } from 'zod'

// Validation schema
const subscribeSchema = z.object({
  email: z.string().email('Invalid email address'),
  source: z.string().optional().default('footer'),
})

// POST - Subscribe to newsletter
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input
    const validationResult = subscribeSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: validationResult.error.errors[0].message
        },
        { status: 400 }
      )
    }

    const { email, source } = validationResult.data

    // Check if email already exists
    const existingSubscription = await prisma.newsletter_subscriptions.findUnique({
      where: { email },
    })

    if (existingSubscription) {
      // If previously unsubscribed, reactivate
      if (!existingSubscription.is_active) {
        await prisma.newsletter_subscriptions.update({
          where: { email },
          data: {
            is_active: true,
            subscribed_at: new Date(),
            unsubscribed_at: null,
          },
        })

        // Send welcome email
        await emailService.sendNewsletterConfirmation(email)

        return NextResponse.json({
          success: true,
          message: 'Welcome back! You have been resubscribed to our newsletter.',
        })
      }

      return NextResponse.json(
        {
          success: false,
          error: 'This email is already subscribed to our newsletter.',
        },
        { status: 409 }
      )
    }

    // Create new subscription
    await prisma.newsletter_subscriptions.create({
      data: {
        email,
        source,
        is_active: true,
      },
    })

    // Send confirmation email
    await emailService.sendNewsletterConfirmation(email)

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed! Check your email for confirmation.',
    })
  } catch (error) {
    console.error('Newsletter subscription error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to subscribe. Please try again later.'
      },
      { status: 500 }
    )
  }
}
