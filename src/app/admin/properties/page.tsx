export const dynamic = 'force-dynamic'
export const revalidate = 0

// ================================================
// src/app/admin/properties/page.tsx - Properties Management
// ================================================

import { MapPin, IndianRupee, Eye, Edit, Trash2, Plus, CheckCircle, XCircle } from 'lucide-react'
import Link from 'next/link'
import PropertiesClient from '@/components/admin/PropertiesClient'

const statusColors: Record<string, string> = {
  AVAILABLE: 'bg-green-100 text-green-800 border-green-200',
  BOOKED: 'bg-blue-100 text-blue-800 border-blue-200',
  SOLD: 'bg-gray-100 text-gray-800 border-gray-200',
  UNDER_OFFER: 'bg-yellow-100 text-yellow-800 border-yellow-200',
}

async function getPropertiesData() {
  const { cookies } = await import('next/headers')
  const cookieStore = await cookies()
  const cookieHeader = cookieStore.getAll().map(cookie => `${cookie.name}=${cookie.value}`).join('; ')

  const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/plots`, {
    cache: 'no-store',
    headers: {
      Cookie: cookieHeader,
    },
  })

  if (!response.ok) {
    return { properties: [], stats: { total: 0, available: 0, booked: 0, sold: 0 } }
  }

  const data = await response.json()
  return {
    properties: data.data.plots || [],
    stats: {
      total: data.data.plots?.length || 0,
      available: data.data.plots?.filter((p: any) => p.status === 'AVAILABLE').length || 0,
      booked: data.data.plots?.filter((p: any) => p.status === 'BOOKED').length || 0,
      sold: data.data.plots?.filter((p: any) => p.status === 'SOLD').length || 0,
    },
  }
}

export default async function PropertiesPage() {
  const { properties, stats } = await getPropertiesData()

  return (
    <PropertiesClient properties={properties} stats={stats} />
  )
}
