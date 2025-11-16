// ================================================
// src/components/providers/RecaptchaProvider.tsx
// Google reCAPTCHA v3 Provider Component
// ================================================

'use client'

import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3'
import { ReactNode } from 'react'

interface RecaptchaProviderProps {
  children: ReactNode
}

/**
 * Provider component for Google reCAPTCHA v3
 *
 * Wraps the application with reCAPTCHA context
 * Only renders if NEXT_PUBLIC_RECAPTCHA_SITE_KEY is configured
 *
 * @example
 * ```tsx
 * // In app/layout.tsx
 * <RecaptchaProvider>
 *   <YourApp />
 * </RecaptchaProvider>
 * ```
 */
export function RecaptchaProvider({ children }: RecaptchaProviderProps) {
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY

  // If reCAPTCHA is not configured, render children without provider
  if (!siteKey || siteKey === '') {
    console.warn('⚠️ NEXT_PUBLIC_RECAPTCHA_SITE_KEY not configured - reCAPTCHA disabled')
    return <>{children}</>
  }

  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={siteKey}
      scriptProps={{
        async: true,
        defer: true,
        appendTo: 'head',
      }}
      container={{
        parameters: {
          badge: 'bottomright', // 'bottomright', 'bottomleft', 'inline'
          theme: 'light', // 'light' or 'dark'
        },
      }}
    >
      {children}
    </GoogleReCaptchaProvider>
  )
}
