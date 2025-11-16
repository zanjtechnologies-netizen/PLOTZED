export const dynamic = 'force-dynamic'
export const revalidate = 0

// ================================================
// src/app/admin/properties/page.tsx - Properties Management
// ================================================

import { MapPin, IndianRupee, Eye, Edit, Trash2, Plus, CheckCircle, XCircle } from 'lucide-react'
import Link from 'next/link'

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
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Properties</h1>
          <p className="text-gray-600 mt-2">Manage all property listings</p>
        </div>
        <div className="flex items-center space-x-3">
          <select className="px-4 py-2 border border-gray-300 rounded-lg">
            <option value="">All Status</option>
            <option value="AVAILABLE">Available</option>
            <option value="BOOKED">Booked</option>
            <option value="SOLD">Sold</option>
            <option value="UNDER_OFFER">Under Offer</option>
          </select>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center">
            <Plus className="w-4 h-4 mr-2" />
            Add Property
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          <div className="text-sm text-gray-600">Total Properties</div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-green-900">{stats.available}</div>
          <div className="text-sm text-green-700">Available</div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-blue-900">{stats.booked}</div>
          <div className="text-sm text-blue-700">Booked</div>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-gray-900">{stats.sold}</div>
          <div className="text-sm text-gray-700">Sold</div>
        </div>
      </div>

      {/* Properties Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.length === 0 ? (
          <div className="col-span-3 text-center py-12 text-gray-500">
            <MapPin className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p>No properties found</p>
          </div>
        ) : (
          properties.map((property: any) => (
            <div
              key={property.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition"
            >
              {/* Property Image */}
              <div className="relative h-48 bg-gray-200">
                {property.images && property.images.length > 0 ? (
                  <img
                    src={property.images[0]}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <MapPin className="w-12 h-12" />
                  </div>
                )}
                <div className="absolute top-3 right-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium border ${
                      statusColors[property.status]
                    }`}
                  >
                    {property.status}
                  </span>
                </div>
                {property.is_published ? (
                  <div className="absolute top-3 left-3 bg-green-600 text-white px-2 py-1 rounded-full text-xs flex items-center">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Published
                  </div>
                ) : (
                  <div className="absolute top-3 left-3 bg-gray-600 text-white px-2 py-1 rounded-full text-xs flex items-center">
                    <XCircle className="w-3 h-3 mr-1" />
                    Draft
                  </div>
                )}
              </div>

              {/* Property Details */}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                  {property.title}
                </h3>

                <div className="flex items-center text-sm text-gray-600 mb-3">
                  <MapPin className="w-4 h-4 mr-1" />
                  {property.city}, {property.state}
                </div>

                <div className="flex items-center text-lg font-bold text-blue-600 mb-4">
                  <IndianRupee className="w-5 h-5" />
                  {(property.price / 10000000).toFixed(2)} Cr
                </div>

                {/* Property Stats */}
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 mb-4">
                  <div>
                    <span className="font-medium">Area:</span> {property.area_sqft} sq.ft
                  </div>
                  <div>
                    <span className="font-medium">Type:</span> {property.property_type}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <Link
                    href={`/plots/${property.id}`}
                    className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium text-center flex items-center justify-center"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Link>
                  <button className="flex-1 px-3 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 text-sm font-medium flex items-center justify-center">
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </button>
                  <button className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 text-sm font-medium">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
