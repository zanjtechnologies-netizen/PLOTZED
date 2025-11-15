// ================================================
// src/components/admin/InquiryStatusFilter.tsx
// Client component for inquiry status filtering
// ================================================

'use client'

import { useRouter, usePathname } from 'next/navigation'

interface InquiryStatusFilterProps {
  currentStatus?: string
}

export default function InquiryStatusFilter({ currentStatus }: InquiryStatusFilterProps) {
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
        <option value="NEW">New</option>
        <option value="CONTACTED">Contacted</option>
        <option value="QUALIFIED">Qualified</option>
        <option value="CONVERTED">Converted</option>
        <option value="CLOSED">Closed</option>
      </select>
    </div>
  )
}
