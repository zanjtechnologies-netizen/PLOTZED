// ================================================
// src/components/ui/loading.tsx - Reusable Loading Components
// ================================================

'use client'

import { HTMLAttributes } from 'react'

// Full Page Loading Spinner
export function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-50">
      <div className="text-center">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-gray-600 animate-pulse">Loading...</p>
      </div>
    </div>
  )
}

// Section/Component Loading Skeleton
interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  height?: string
  rounded?: boolean
}

export function Skeleton({ height = '400px', rounded = true, className = '', ...props }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] ${
        rounded ? 'rounded-lg' : ''
      } ${className}`}
      style={{ minHeight: height, animation: 'shimmer 2s infinite' }}
      {...props}
    />
  )
}

// Loading Spinner
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  color?: 'blue' | 'white' | 'gray'
}

export function LoadingSpinner({ size = 'md', color = 'blue' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
    xl: 'w-16 h-16 border-4',
  }

  const colorClasses = {
    blue: 'border-blue-600 border-t-transparent',
    white: 'border-white border-t-transparent',
    gray: 'border-gray-600 border-t-transparent',
  }

  return (
    <div
      className={`inline-block rounded-full animate-spin ${sizeClasses[size]} ${colorClasses[color]}`}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  )
}

// Button Loading State
interface ButtonLoaderProps {
  text?: string
  size?: 'sm' | 'md' | 'lg'
}

export function ButtonLoader({ text = 'Loading...', size = 'md' }: ButtonLoaderProps) {
  return (
    <span className="flex items-center justify-center gap-2">
      <LoadingSpinner size={size === 'lg' ? 'md' : 'sm'} color="white" />
      {text}
    </span>
  )
}

// Card Loading Skeleton
export function CardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-4 animate-pulse">
      <div className="h-48 bg-gray-200 rounded-lg" />
      <div className="h-6 bg-gray-200 rounded w-3/4" />
      <div className="h-4 bg-gray-200 rounded w-full" />
      <div className="h-4 bg-gray-200 rounded w-5/6" />
      <div className="flex justify-between items-center pt-4">
        <div className="h-8 bg-gray-200 rounded w-24" />
        <div className="h-10 bg-gray-200 rounded w-32" />
      </div>
    </div>
  )
}

// List Loading Skeleton
export function ListSkeleton({ items = 5 }: { items?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 bg-white rounded-lg shadow animate-pulse">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-3 bg-gray-200 rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  )
}

// Table Loading Skeleton
export function TableSkeleton({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {Array.from({ length: columns }).map((_, i) => (
              <th key={i} className="px-6 py-3">
                <div className="h-4 bg-gray-200 rounded animate-pulse" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <tr key={rowIndex}>
              {Array.from({ length: columns }).map((_, colIndex) => (
                <td key={colIndex} className="px-6 py-4">
                  <div className="h-4 bg-gray-200 rounded animate-pulse" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// Progress Bar
interface ProgressBarProps {
  progress: number // 0-100
  color?: 'blue' | 'green' | 'red' | 'yellow'
  showLabel?: boolean
}

export function ProgressBar({ progress, color = 'blue', showLabel = false }: ProgressBarProps) {
  const colorClasses = {
    blue: 'bg-blue-600',
    green: 'bg-green-600',
    red: 'bg-red-600',
    yellow: 'bg-yellow-600',
  }

  const clampedProgress = Math.min(100, Math.max(0, progress))

  return (
    <div className="w-full">
      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <div
          className={`h-full ${colorClasses[color]} transition-all duration-500 ease-out`}
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
      {showLabel && (
        <p className="text-sm text-gray-600 mt-1 text-center">{Math.round(clampedProgress)}%</p>
      )}
    </div>
  )
}

// Pulse Loader (for infinite loading states)
export function PulseLoader() {
  return (
    <div className="flex items-center justify-center gap-2">
      <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
      <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
      <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
    </div>
  )
}
