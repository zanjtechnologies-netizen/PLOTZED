// ================================================
// src/app/plots/[id]/page.tsx - Plot Detail Page
// ================================================

'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import SiteVisitForm from '@/components/forms/SiteVisitForm'

interface Plot {
  id: string
  title: string
  description: string
  price: number
  area: number
  city: string
  state: string
  address: string
  images: string[]
  amenities: string[]
  status: string
  latitude?: number
  longitude?: number
}

export default function PlotDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { data: session, status } = useSession()
  const [plot, setPlot] = useState<Plot | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showSiteVisitForm, setShowSiteVisitForm] = useState(false)
  const [activeImageIndex, setActiveImageIndex] = useState(0)

  useEffect(() => {
    if (params.id) {
      fetchPlot(params.id as string)
    }
  }, [params.id])

  const fetchPlot = async (id: string) => {
    try {
      const response = await fetch(`/api/plots/${id}`)
      const data = await response.json()

      if (data.success) {
        setPlot(data.data)
      } else {
        setError(data.error?.message || 'Failed to load plot')
      }
    } catch (err) {
      setError('An error occurred while loading the plot')
    } finally {
      setLoading(false)
    }
  }

  const handleRequestSiteVisit = () => {
    if (status === 'unauthenticated') {
      router.push('/login')
      return
    }
    setShowSiteVisitForm(true)
  }

  const handleSiteVisitSuccess = () => {
    setShowSiteVisitForm(false)
    // Could show a success message here
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading plot details...</div>
      </div>
    )
  }

  if (error || !plot) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            {error || 'Plot not found'}
          </h1>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go Back Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Image Gallery */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image Gallery */}
            <div>
              {plot.images && plot.images.length > 0 ? (
                <div className="space-y-4">
                  {/* Main Image */}
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-200">
                    <Image
                      src={plot.images[activeImageIndex]}
                      alt={`${plot.title} - Image ${activeImageIndex + 1}`}
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>

                  {/* Thumbnail Gallery */}
                  {plot.images.length > 1 && (
                    <div className="grid grid-cols-4 gap-2">
                      {plot.images.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => setActiveImageIndex(index)}
                          className={`relative aspect-video rounded-lg overflow-hidden ${
                            activeImageIndex === index
                              ? 'ring-2 ring-blue-600'
                              : 'opacity-70 hover:opacity-100'
                          }`}
                        >
                          <Image
                            src={image}
                            alt={`Thumbnail ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="aspect-video rounded-lg bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400">No images available</span>
                </div>
              )}
            </div>

            {/* Plot Details */}
            <div>
              <div className="mb-4">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    plot.status === 'AVAILABLE'
                      ? 'bg-green-100 text-green-800'
                      : plot.status === 'BOOKED'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {plot.status}
                </span>
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {plot.title}
              </h1>

              <div className="flex items-center text-gray-600 mb-6">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                {plot.city}, {plot.state}
              </div>

              <div className="mb-6">
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  ₹{plot.price.toLocaleString('en-IN')}
                </div>
                <div className="text-gray-600">
                  {plot.area} sq. ft
                  <span className="mx-2">•</span>
                  ₹{Math.round(plot.price / plot.area).toLocaleString('en-IN')}/sq. ft
                </div>
              </div>

              {plot.status === 'AVAILABLE' && (
                <button
                  onClick={handleRequestSiteVisit}
                  className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition mb-4"
                >
                  Request Site Visit
                </button>
              )}

              {plot.status === 'BOOKED' && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                  <p className="text-yellow-800">
                    This property is currently booked. Contact us for availability.
                  </p>
                </div>
              )}

              {plot.status === 'SOLD' && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                  <p className="text-red-800">
                    This property has been sold.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Description and Details */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">Description</h2>
          <p className="text-gray-700 whitespace-pre-line">{plot.description}</p>
        </div>

        {plot.amenities && plot.amenities.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold mb-4">Amenities</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {plot.amenities.map((amenity, index) => (
                <div key={index} className="flex items-center">
                  <svg
                    className="w-5 h-5 text-green-600 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {plot.address && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-4">Location</h2>
            <p className="text-gray-700 mb-4">{plot.address}</p>
            {plot.latitude && plot.longitude && (
              <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-gray-400">Map integration would go here</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Site Visit Form Modal */}
      {showSiteVisitForm && plot && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Request Site Visit</h2>
                <button
                  onClick={() => setShowSiteVisitForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <SiteVisitForm
                plotId={plot.id}
                plotTitle={plot.title}
                onSuccess={handleSiteVisitSuccess}
                onCancel={() => setShowSiteVisitForm(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
