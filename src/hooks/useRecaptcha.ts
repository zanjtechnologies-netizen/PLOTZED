// ================================================
// src/hooks/useRecaptcha.ts
// Custom hook for Google reCAPTCHA v3 integration
// ================================================

'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'

interface RecaptchaVerifyResponse {
  success: boolean
  score?: number
  action?: string
  error?: string
  warning?: string
}

/**
 * Custom hook for reCAPTCHA v3 verification
 *
 * @returns Object with executeRecaptcha function and loading state
 *
 * @example
 * ```tsx
 * const { verifyRecaptcha, isVerifying } = useRecaptcha()
 *
 * const handleSubmit = async (e) => {
 *   e.preventDefault()
 *
 *   const verification = await verifyRecaptcha('submit_form')
 *
 *   if (!verification.success) {
 *     alert('Verification failed')
 *     return
 *   }
 *
 *   // Proceed with form submission
 * }
 * ```
 */
export function useRecaptcha() {
  const { executeRecaptcha } = useGoogleReCaptcha()
  const [isVerifying, setIsVerifying] = useState(false)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    setIsReady(!!executeRecaptcha)
  }, [executeRecaptcha])

  /**
   * Verify reCAPTCHA token
   *
   * @param action - Action name for this verification (e.g., 'submit_inquiry', 'login', 'register')
   * @returns Verification result with success status and score
   */
  const verifyRecaptcha = useCallback(
    async (action: string = 'submit'): Promise<RecaptchaVerifyResponse> => {
      // Check if reCAPTCHA is available
      if (!executeRecaptcha) {
        console.warn('⚠️ reCAPTCHA not ready yet')

        // If reCAPTCHA is not configured, allow the request
        return {
          success: true,
          warning: 'reCAPTCHA not configured - verification skipped',
        }
      }

      setIsVerifying(true)

      try {
        // Get token from Google reCAPTCHA
        const token = await executeRecaptcha(action)

        if (!token) {
          console.error('❌ Failed to get reCAPTCHA token')
          return {
            success: false,
            error: 'Failed to get reCAPTCHA token',
          }
        }

        // Verify token with backend
        const response = await fetch('/api/verify-recaptcha', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            token,
            action,
          }),
        })

        const data: RecaptchaVerifyResponse = await response.json()

        if (!response.ok) {
          console.error('❌ reCAPTCHA verification failed:', data.error)
          return {
            success: false,
            error: data.error || 'Verification failed',
            score: data.score,
          }
        }

        return data

      } catch (error) {
        console.error('❌ reCAPTCHA verification error:', error)

        return {
          success: false,
          error: error instanceof Error ? error.message : 'Verification failed',
        }
      } finally {
        setIsVerifying(false)
      }
    },
    [executeRecaptcha]
  )

  return {
    verifyRecaptcha,
    isVerifying,
    isReady,
  }
}

/**
 * Higher-order component to wrap forms with reCAPTCHA verification
 *
 * @example
 * ```tsx
 * const MyForm = withRecaptchaVerification(({ verifyRecaptcha }) => {
 *   const handleSubmit = async (e) => {
 *     e.preventDefault()
 *     const result = await verifyRecaptcha('submit_form')
 *     if (result.success) {
 *       // Submit form
 *     }
 *   }
 *
 *   return <form onSubmit={handleSubmit}>...</form>
 * })
 * ```
 */
export function withRecaptchaVerification<P extends object>(
  Component: React.ComponentType<P & {
    verifyRecaptcha: (action: string) => Promise<RecaptchaVerifyResponse>
    isVerifying?: boolean
    isReady?: boolean
  }>
): React.FC<P> {
  const WithRecaptchaVerification: React.FC<P> = (props) => {
    const { verifyRecaptcha, isVerifying, isReady } = useRecaptcha()

    const componentProps = Object.assign({}, props, {
      verifyRecaptcha,
      isVerifying,
      isReady,
    })

    return React.createElement(Component, componentProps as any)
  }

  WithRecaptchaVerification.displayName = `WithRecaptchaVerification(${Component.displayName || Component.name || 'Component'})`

  return WithRecaptchaVerification
}
