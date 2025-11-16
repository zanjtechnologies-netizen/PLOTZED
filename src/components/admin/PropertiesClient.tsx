// ================================================
// src/components/admin/PropertiesClient.tsx
// Client component for properties management
// ================================================

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MapPin, IndianRupee, Eye, Edit, Trash2, Plus, CheckCircle, XCircle } from 'lucide-react'
import Link from 'next/link'
import PropertyModal from './PropertyModal'

const statusColors: Record<string, string> = {
  AVAILABLE: 'bg-green-100 text-green-800 border-green-200',
  BOOKED: 'bg-blue-100 text-blue-800 border-blue-200',
  SOLD: 'bg-gray-100 text-gray-800 border-gray-200',
}

interface PropertiesClientProps {
  properties: any[]
  stats: {
    total: number
    available: number
    booked: number
    sold: number
  }
}

export default function PropertiesClient({ properties: initialProperties, stats: initialStats }: PropertiesClientProps) {
  const router = useRouter()
  const [properties, setProperties] = useState(initialProperties)
  const [stats, setStats] = useState(initialStats)
  const [statusFilter, setStatusFilter] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedProperty, setSelectedProperty] = useState<any>(null)
  const [deleting, setDeleting] = useState<string | null>(null)

  const filteredProperties = statusFilter
    ? properties.filter((p) => p.status === statusFilter)
    : properties

  const handleAddNew = () => {
    setSelectedProperty(null)
    setIsModalOpen(true)
  }

  const handleEdit = (property: any) => {
    setSelectedProperty(property)
    setIsModalOpen(true)
  }

  const handleDelete = async (propertyId: string) => {
    if (!confirm('Are you sure you want to delete this property? This action cannot be undone.')) {
      return
    }

    setDeleting(propertyId)
    try {
      const response = await fetch(`/api/plots/${propertyId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        alert('Property deleted successfully!')
        router.refresh()
      } else {
        const data = await response.json()
        alert(`Error: ${data.error || 'Failed to delete property'}`)
      }
    } catch (error) {
      console.error('Delete error:', error)
      alert('Failed to delete property. Please try again.')
    } finally {
      setDeleting(null)
    }
  }

  const handleModalSuccess = () => {
    router.refresh()
  }

  return (
    <>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Properties</h1>
            <p className="text-gray-600 mt-2">Manage all property listings</p>
          </div>
          <div className="flex items-center space-x-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-900"
            >
              <option value="">All Status</option>
              <option value="AVAILABLE">Available</option>
              <option value="BOOKED">Booked</option>
              <option value="SOLD">Sold</option>
            </select>
            <button
              onClick={handleAddNew}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center"
            >
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
          {filteredProperties.length === 0 ? (
            <div className="col-span-3 text-center py-12 text-gray-500">
              <MapPin className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p>No properties found</p>
            </div>
          ) : (
            filteredProperties.map((property: any) => (
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
                      <span className="font-medium">Size:</span> {property.plot_size} sq.ft
                    </div>
                    <div>
                      <span className="font-medium">Facing:</span> {property.facing || 'N/A'}
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
                    <button
                      onClick={() => handleEdit(property)}
                      className="flex-1 px-3 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 text-sm font-medium flex items-center justify-center"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(property.id)}
                      disabled={deleting === property.id}
                      className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {deleting === property.id ? (
                        <span className="w-4 h-4">...</span>
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <PropertyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        property={selectedProperty}
        onSuccess={handleModalSuccess}
      />
    </>
  )
}
