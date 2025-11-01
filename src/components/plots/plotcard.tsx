// ================================================
// src/components/plots/PlotCard.tsx
// ================================================

import Link from 'next/link'
import Image from 'next/image'

interface PlotCardProps {
  plot: {
    id: string
    title: string
    slug: string
    price: number
    plot_size: number
    city: string
    state: string
    images: string[]
    amenities: string[]
  }
}

export default function PlotCard({ plot }: PlotCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price)
  }

  return (
    <Link href={`/properties/${plot.slug}`}>
      <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow">
        {/* Image */}
        <div className="relative h-48">
          <Image
            src={plot.images[0] || '/placeholder.jpg'}
            alt={plot.title}
            fill
            className="object-cover"
          />
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-2 line-clamp-2">
            {plot.title}
          </h3>
          
          <p className="text-gray-600 text-sm mb-3">
            📍 {plot.city}, {plot.state}
          </p>

          <div className="flex justify-between items-center mb-3">
            <span className="text-2xl font-bold text-blue-600">
              {formatPrice(plot.price)}
            </span>
            <span className="text-gray-600">
              {plot.plot_size} sq ft
            </span>
          </div>

          {/* Amenities */}
          <div className="flex flex-wrap gap-2">
            {plot.amenities.slice(0, 3).map((amenity) => (
              <span
                key={amenity}
                className="text-xs bg-gray-100 px-2 py-1 rounded"
              >
                {amenity}
              </span>
            ))}
            {plot.amenities.length > 3 && (
              <span className="text-xs text-gray-600">
                +{plot.amenities.length - 3} more
              </span>
            )}
          </div>

          <button className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
            View Details
          </button>
        </div>
      </div>
    </Link>
  )
}