// ================================================
// src/components/analytics/WebVitals.tsx - Web Vitals Monitoring
// ================================================

'use client'

import { useState } from 'react'
import { useReportWebVitals } from 'next/web-vitals'

/**
 * Web Vitals Monitoring Component
 * Tracks Core Web Vitals and sends to analytics
 *
 * Core Web Vitals Metrics:
 * - LCP (Largest Contentful Paint): Loading performance (<2.5s good)
 * - FID (First Input Delay): Interactivity (<100ms good)
 * - CLS (Cumulative Layout Shift): Visual stability (<0.1 good)
 * - FCP (First Contentful Paint): Initial render (<1.8s good)
 * - TTFB (Time to First Byte): Server response (<600ms good)
 * - INP (Interaction to Next Paint): Responsiveness (<200ms good)
 */

interface WebVitalsMetric {
  id: string
  name: 'CLS' | 'FID' | 'FCP' | 'LCP' | 'TTFB' | 'INP'
  value: number
  rating: 'good' | 'needs-improvement' | 'poor'
  delta: number
  navigationType: string
}

// Thresholds for Web Vitals ratings
const THRESHOLDS = {
  LCP: { good: 2500, poor: 4000 },
  FID: { good: 100, poor: 300 },
  CLS: { good: 0.1, poor: 0.25 },
  FCP: { good: 1800, poor: 3000 },
  TTFB: { good: 600, poor: 1500 },
  INP: { good: 200, poor: 500 },
}

function getRating(name: WebVitalsMetric['name'], value: number): 'good' | 'needs-improvement' | 'poor' {
  const threshold = THRESHOLDS[name]
  if (value <= threshold.good) return 'good'
  if (value <= threshold.poor) return 'needs-improvement'
  return 'poor'
}

export default function WebVitals() {
  useReportWebVitals((metric) => {
    const vitalsMetric: WebVitalsMetric = {
      id: metric.id,
      name: metric.name as WebVitalsMetric['name'],
      value: metric.value,
      rating: getRating(metric.name as WebVitalsMetric['name'], metric.value),
      delta: metric.delta,
      navigationType: metric.navigationType,
    }

    // Send to Google Analytics (if configured)
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', metric.name, {
        event_category: 'Web Vitals',
        value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
        event_label: metric.id,
        non_interaction: true,
      })
    }

    // Send to Vercel Analytics (if configured)
    if (typeof window !== 'undefined' && (window as any).va) {
      (window as any).va('event', {
        name: 'web-vital',
        data: vitalsMetric,
      })
    }

    // Send to Sentry (if configured)
    if (typeof window !== 'undefined' && (window as any).Sentry) {
      (window as any).Sentry.captureMessage('Web Vital', {
        level: vitalsMetric.rating === 'poor' ? 'warning' : 'info',
        tags: {
          metric: metric.name,
          rating: vitalsMetric.rating,
        },
        contexts: {
          'web-vitals': vitalsMetric,
        },
      })
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      const emoji = vitalsMetric.rating === 'good' ? '✅' : vitalsMetric.rating === 'needs-improvement' ? '⚠️' : '❌'
      console.log(
        `${emoji} ${metric.name}:`,
        metric.value.toFixed(2),
        metric.name === 'CLS' ? '' : 'ms',
        `(${vitalsMetric.rating})`
      )
    }

    // Send to custom analytics endpoint (optional)
    if (process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT) {
      sendToAnalytics(vitalsMetric)
    }
  })

  return null
}

/**
 * Send Web Vitals to custom analytics endpoint
 */
async function sendToAnalytics(metric: WebVitalsMetric) {
  try {
    const endpoint = process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT
    if (!endpoint) return

    await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'web-vitals',
        metric,
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
      }),
      // Don't wait for response
      keepalive: true,
    })
  } catch (error) {
    // Silently fail - don't break user experience
    if (process.env.NODE_ENV === 'development') {
      console.error('Failed to send web vitals:', error)
    }
  }
}

/**
 * Hook to get current Web Vitals ratings
 */
export function useWebVitalsRating() {
  const [vitals, setVitals] = useState<Record<string, WebVitalsMetric>>({})

  useReportWebVitals((metric) => {
    setVitals((prev) => ({
      ...prev,
      [metric.name]: {
        id: metric.id,
        name: metric.name as WebVitalsMetric['name'],
        value: metric.value,
        rating: getRating(metric.name as WebVitalsMetric['name'], metric.value),
        delta: metric.delta,
        navigationType: metric.navigationType,
      },
    }))
  })

  return vitals
}
