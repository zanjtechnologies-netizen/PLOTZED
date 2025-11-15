// ================================================
// src/components/admin/StatusFilter.tsx
// Client component for status filtering
// ================================================

'use client'

import { useRouter, usePathname } from 'next/navigation'

interface StatusFilterProps {
  currentStatus?: string
}

export default function StatusFilter({ currentStatus }: StatusFilterProps) {
  const router = useRouter()
  const pathname = usePathname()

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const status = e.target.value
    if (status) {
      router.push(`${pathname}?status=${status}`)
    } else {
      router.push(pathname)
    }
  }

  return (
    <div className="flex items-center space-x-3">
      <select
        value={currentStatus || ''}
        onChange={handleStatusChange}
        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500"
      >
        <option value="">All Status</option>
        <option value="PENDING">Pending</option>
        <option value="CONFIRMED">Confirmed</option>
        <option value="COMPLETED">Completed</option>
        <option value="CANCELLED">Cancelled</option>
        <option value="RESCHEDULED">Rescheduled</option>
      </select>
    </div>
  )
}
