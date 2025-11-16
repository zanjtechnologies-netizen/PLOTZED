// ================================================
// src/app/api/verify-recaptcha/route.ts
// Google reCAPTCHA v3 Verification Endpoint
// ================================================

import { NextRequest, NextResponse } from 'next/server'

/**
 * POST /api/verify-recaptcha
 *
 * Verifies Google reCAPTCHA v3 token
 *
 * Request Body:
 * {
 *   token: string          // reCAPTCHA token from client
 *   action?: string        // Optional action to verify (e.g., 'submit_inquiry')
 * }
 *
 * Response:
 * {
 *   success: boolean
 *   score?: number         // Score from 0.0 to 1.0 (higher is more likely human)
 *   action?: string        // Action that was verified
 *   challenge_ts?: string  // Timestamp of the challenge
 *   hostname?: string      // Hostname of the site
 *   error?: string         // Error message if verification fails
 * }
 */

interface RecaptchaVerifyResponse {
  success: boolean
  score?: number
  action?: string
  challenge_ts?: string
  hostname?: string
  'error-codes'?: string[]
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { token, action } = body

    // Validate request
    if (!token || typeof token !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Invalid or missing reCAPTCHA token' },
        { status: 400 }
      )
    }

    // Check if reCAPTCHA is enabled
    const recaptchaSecretKey = process.env.RECAPTCHA_SECRET_KEY

    if (!recaptchaSecretKey) {
      console.warn('[reCAPTCHA] SECRET_KEY not configured - skipping verification')

      // In development or when reCAPTCHA is not configured, allow the request
      // but return a warning
      return NextResponse.json({
        success: true,
        score: 1.0,
        action: action || 'unknown',
        warning: 'reCAPTCHA verification skipped - not configured',
      })
    }

    // Verify token with Google reCAPTCHA API
    const verificationUrl = 'https://www.google.com/recaptcha/api/siteverify'

    const verifyResponse = await fetch(verificationUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        secret: recaptchaSecretKey,
        response: token,
      }).toString(),
    })

    if (!verifyResponse.ok) {
      console.error('[reCAPTCHA] Verification request failed:', verifyResponse.statusText)
      return NextResponse.json(
        { success: false, error: 'Failed to verify reCAPTCHA' },
        { status: 500 }
      )
    }

    const data: RecaptchaVerifyResponse = await verifyResponse.json()

    // Check for errors from Google
    if (!data.success) {
      const errorCodes = data['error-codes'] || []
      console.error('[reCAPTCHA] Verification failed:', errorCodes)

      return NextResponse.json(
        {
          success: false,
          error: 'reCAPTCHA verification failed',
          errorCodes,
        },
        { status: 400 }
      )
    }

    // Validate score (for reCAPTCHA v3)
    const minScore = parseFloat(process.env.RECAPTCHA_MIN_SCORE || '0.5')

    if (data.score !== undefined && data.score < minScore) {
      console.warn(
        `[reCAPTCHA] Score too low: ${data.score} (minimum: ${minScore})`,
        {
          action: data.action,
          hostname: data.hostname,
        }
      )

      return NextResponse.json(
        {
          success: false,
          score: data.score,
          error: 'reCAPTCHA score too low - possible bot activity',
        },
        { status: 403 }
      )
    }

    // Validate action if provided
    if (action && data.action && data.action !== action) {
      console.warn(
        `[reCAPTCHA] Action mismatch: expected "${action}", got "${data.action}"`
      )

      return NextResponse.json(
        {
          success: false,
          error: 'reCAPTCHA action mismatch',
          expectedAction: action,
          receivedAction: data.action,
        },
        { status: 400 }
      )
    }

    // Verification successful
    console.log('[reCAPTCHA] Verification successful:', {
      score: data.score,
      action: data.action,
      hostname: data.hostname,
    })

    return NextResponse.json({
      success: true,
      score: data.score,
      action: data.action,
      challenge_ts: data.challenge_ts,
      hostname: data.hostname,
    })

  } catch (error) {
    console.error('[reCAPTCHA] Verification error:', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error during reCAPTCHA verification',
      },
      { status: 500 }
    )
  }
}

// Health check endpoint
export async function GET() {
  const isConfigured = !!(
    process.env.RECAPTCHA_SECRET_KEY &&
    process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY
  )

  return NextResponse.json({
    status: 'ok',
    service: 'reCAPTCHA Verification',
    configured: isConfigured,
    minScore: parseFloat(process.env.RECAPTCHA_MIN_SCORE || '0.5'),
  })
}
