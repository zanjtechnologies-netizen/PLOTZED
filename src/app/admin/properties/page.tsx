export const dynamic = 'force-dynamic'
export const revalidate = 0

// ================================================
// src/app/admin/properties/page.tsx - Properties Management
// ================================================

import { MapPin, IndianRupee, Eye, Edit, Trash2, Plus, CheckCircle, XCircle } from 'lucide-react'
import Link from 'next/link'
import PropertiesClient from '@/components/admin/PropertiesClient'
import { prisma } from '@/lib/prisma'

const statusColors: Record<string, string> = {
  AVAILABLE: 'bg-green-100 text-green-800 border-green-200',
  BOOKED: 'bg-blue-100 text-blue-800 border-blue-200',
  SOLD: 'bg-gray-100 text-gray-800 border-gray-200',
  UNDER_OFFER: 'bg-yellow-100 text-yellow-800 border-yellow-200',
}

async function getPropertiesData() {
  try {
    // Fetch data directly from database (more efficient than HTTP fetch)
    const properties = await prisma.plot.findMany({
      orderBy: { created_at: 'desc' },
    })

    // Convert Decimal objects to numbers for Client Component serialization
    const serializedProperties = properties.map((property) => ({
      ...property,
      price: property.price.toNumber(),
      booking_amount: property.booking_amount.toNumber(),
      plot_size: property.plot_size.toNumber(),
      latitude: property.latitude?.toNumber() ?? null,
      longitude: property.longitude?.toNumber() ?? null,
    }))

    return {
      properties: serializedProperties,
      stats: {
        total: properties.length,
        available: properties.filter((p) => p.status === 'AVAILABLE').length,
        booked: properties.filter((p) => p.status === 'BOOKED').length,
        sold: properties.filter((p) => p.status === 'SOLD').length,
      },
    }
  } catch (error) {
    console.error('Properties fetch error:', error)
    return { properties: [], stats: { total: 0, available: 0, booked: 0, sold: 0 } }
  }
}

export default async function PropertiesPage() {
  const { properties, stats } = await getPropertiesData()

  return (
    <PropertiesClient properties={properties} stats={stats} />
  )
}
