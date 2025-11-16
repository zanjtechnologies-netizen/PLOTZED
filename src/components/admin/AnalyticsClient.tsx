// ================================================
// src/components/admin/AnalyticsClient.tsx
// Client wrapper for analytics page with period selector
// ================================================

'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

interface AnalyticsClientProps {
  children: React.ReactNode
  currentPeriod: string
}

export default function AnalyticsClient({ children, currentPeriod }: AnalyticsClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [selectedPeriod, setSelectedPeriod] = useState(currentPeriod || '30')

  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period)
    const params = new URLSearchParams(searchParams)
    params.set('period', period)
    router.push(`/admin/analytics?${params.toString()}`)
    router.refresh()
  }

  return (
    <div className="space-y-8">
      {/* Period Selector Header */}
      <div className="flex items-center justify-end">
        <select
          value={selectedPeriod}
          onChange={(e) => handlePeriodChange(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white"
        >
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
          <option value="90">Last 90 days</option>
          <option value="365">Last 365 days</option>
        </select>
      </div>

      {/* Analytics Content */}
      {children}
    </div>
  )
}
