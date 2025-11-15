// ================================================
// src/components/error-boundary.tsx - React Error Boundary
// ================================================

'use client'

import React from 'react'
import * as Sentry from '@sentry/nextjs'

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

/**
 * Error Boundary Component
 *
 * Catches React errors in the component tree and displays a fallback UI
 * Automatically reports errors to Sentry
 */
class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to Sentry
    Sentry.captureException(error, {
      contexts: {
        react: {
          componentStack: errorInfo.componentStack,
        },
      },
    })

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error Boundary caught an error:', error, errorInfo)
    }
  }

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Default fallback UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full space-y-8 p-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Oops! Something went wrong
              </h1>
              <p className="text-gray-600 mb-6">
                We're sorry for the inconvenience. Our team has been notified and is working to fix the issue.
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => window.location.reload()}
                  className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition"
                >
                  Reload Page
                </button>
                <button
                  onClick={() => (window.location.href = '/')}
                  className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition"
                >
                  Go to Homepage
                </button>
              </div>
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="mt-6 text-left">
                  <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                    Error Details (Development Only)
                  </summary>
                  <pre className="mt-2 p-4 bg-red-50 border border-red-200 rounded text-xs text-red-900 overflow-auto">
                    {this.state.error.toString()}
                    {'\n\n'}
                    {this.state.error.stack}
                  </pre>
                </details>
              )}
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

/**
 * Sentry-enhanced Error Boundary
 *
 * Wrapper around Sentry's built-in error boundary with custom UI
 */
export function SentryErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <Sentry.ErrorBoundary
      fallback={({ error, resetError }) => {
        const errorMessage = error instanceof Error ? error : new Error('Unknown error')
        return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full space-y-8 p-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Oops! Something went wrong
              </h1>
              <p className="text-gray-600 mb-6">
                We're sorry for the inconvenience. Our team has been notified and is working to fix the issue.
              </p>
              <div className="space-y-3">
                <button
                  onClick={resetError}
                  className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition"
                >
                  Try Again
                </button>
                <button
                  onClick={() => (window.location.href = '/')}
                  className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition"
                >
                  Go to Homepage
                </button>
              </div>
              {process.env.NODE_ENV === 'development' && errorMessage && (
                <details className="mt-6 text-left">
                  <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                    Error Details (Development Only)
                  </summary>
                  <pre className="mt-2 p-4 bg-red-50 border border-red-200 rounded text-xs text-red-900 overflow-auto">
                    {errorMessage.toString()}
                    {'\n\n'}
                    {errorMessage.stack}
                  </pre>
                </details>
              )}
            </div>
          </div>
        </div>
        )
      }}
      showDialog={false}
    >
      {children}
    </Sentry.ErrorBoundary>
  )
}

export default ErrorBoundary
