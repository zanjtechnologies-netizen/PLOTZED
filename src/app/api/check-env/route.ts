// ================================================
// src/app/api/check-env/route.ts - Environment Check (No Auth Required)
// ================================================
// WARNING: This endpoint should be disabled in production after testing!

import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  // Only enable in development or if ENABLE_ENV_CHECK is set
  const isDev = process.env.NODE_ENV === 'development'
  const isEnabled = process.env.ENABLE_ENV_CHECK === 'true'

  if (!isDev && !isEnabled) {
    return NextResponse.json({
      success: false,
      error: 'This endpoint is disabled in production for security reasons',
      hint: 'Set ENABLE_ENV_CHECK=true in Vercel to temporarily enable'
    }, { status: 403 })
  }

  try {
    const envStatus = {
      // Database
      DATABASE_URL: process.env.DATABASE_URL ? '✓ SET' : '✗ NOT SET',
      DIRECT_DATABASE_URL: process.env.DIRECT_DATABASE_URL ? '✓ SET' : '✗ NOT SET',

      // NextAuth
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? '✓ SET' : '✗ NOT SET',
      NEXTAUTH_URL: process.env.NEXTAUTH_URL || '✗ NOT SET (showing value)',

      // R2 Storage
      R2_ENDPOINT: process.env.R2_ENDPOINT ? '✓ SET' : '✗ NOT SET',
      R2_ACCESS_KEY_ID: process.env.R2_ACCESS_KEY_ID ? '✓ SET' : '✗ NOT SET',
      R2_SECRET_ACCESS_KEY: process.env.R2_SECRET_ACCESS_KEY ? '✓ SET (hidden)' : '✗ NOT SET',
      R2_BUCKET: process.env.R2_BUCKET || '✗ NOT SET',
      R2_ACCOUNT_ID: process.env.R2_ACCOUNT_ID || '✗ NOT SET',

      // reCAPTCHA
      NEXT_PUBLIC_RECAPTCHA_SITE_KEY: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ? '✓ SET' : '✗ NOT SET',
      RECAPTCHA_SECRET_KEY: process.env.RECAPTCHA_SECRET_KEY ? '✓ SET' : '✗ NOT SET',

      // App
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || '✗ NOT SET',
      NODE_ENV: process.env.NODE_ENV,
    }

    // Identify missing critical variables
    const missingCritical = []
    if (!process.env.DATABASE_URL) missingCritical.push('DATABASE_URL')
    if (!process.env.NEXTAUTH_SECRET) missingCritical.push('NEXTAUTH_SECRET')
    if (!process.env.NEXTAUTH_URL) missingCritical.push('NEXTAUTH_URL')

    // Identify missing R2 variables
    const missingR2 = []
    if (!process.env.R2_ENDPOINT) missingR2.push('R2_ENDPOINT')
    if (!process.env.R2_ACCESS_KEY_ID) missingR2.push('R2_ACCESS_KEY_ID')
    if (!process.env.R2_SECRET_ACCESS_KEY) missingR2.push('R2_SECRET_ACCESS_KEY')
    if (!process.env.R2_BUCKET) missingR2.push('R2_BUCKET')
    if (!process.env.R2_ACCOUNT_ID) missingR2.push('R2_ACCOUNT_ID')

    // NEXTAUTH_URL validation
    let nextAuthUrlIssue = null
    if (process.env.NEXTAUTH_URL) {
      const currentHost = request.headers.get('host')
      const nextAuthHost = new URL(process.env.NEXTAUTH_URL).host

      if (currentHost !== nextAuthHost) {
        nextAuthUrlIssue = {
          issue: 'MISMATCH',
          currentHost,
          nextAuthHost,
          message: 'NEXTAUTH_URL does not match current deployment URL',
          fix: `Update NEXTAUTH_URL to: https://${currentHost}`
        }
      }
    }

    return NextResponse.json({
      success: missingCritical.length === 0,
      environment: envStatus,
      issues: {
        missingCritical: missingCritical.length > 0 ? missingCritical : null,
        missingR2: missingR2.length > 0 ? missingR2 : null,
        nextAuthUrl: nextAuthUrlIssue,
      },
      warnings: [
        'This endpoint exposes environment variable names',
        'Disable after testing by removing ENABLE_ENV_CHECK',
        'In production, this endpoint is automatically disabled'
      ]
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack,
    }, { status: 500 })
  }
}
