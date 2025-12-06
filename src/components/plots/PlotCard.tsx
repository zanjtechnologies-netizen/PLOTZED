//plotcard.tsx//


'use client';

import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Heart } from 'lucide-react';
import { useState } from 'react';

export interface PlotData {
  id: string;
  title: string;
  slug?: string;
  description?: string;
  price: number;
  plot_size?: number;
  dimensions?: string;
  facing?: string;
  city?: string;
  state?: string;
  location?: string; // fallback for city
  images?: string[];
  amenities?: string[];
  status?: string;
  is_featured?: boolean;
}

interface PlotCardProps {
  plot: PlotData;
  variant?: 'grid' | 'list';
  showFavorite?: boolean;
  onFavoriteToggle?: (id: string, isFavorite: boolean) => void;
  isFavorite?: boolean;
}

export default function PlotCard({
  plot,
  variant = 'grid',
  showFavorite = true,
  onFavoriteToggle,
  isFavorite: initialFavorite = false,
}: PlotCardProps) {
  const [isFavorite, setIsFavorite] = useState(initialFavorite);

  // Format price in Indian style
  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(2)} Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(2)} Lakhs`;
    }
    return `₹${price.toLocaleString('en-IN')}`;
  };

  // Handle favorite toggle
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newValue = !isFavorite;
    setIsFavorite(newValue);
    onFavoriteToggle?.(plot.id, newValue);
  };

  // Get location display
  const locationDisplay = plot.city && plot.state
    ? `${plot.city}, ${plot.state}`
    : plot.location || 'Location TBD';

  // Get image URL
  const imageUrl = plot.images?.[0] || '/images/hero-bg-fallback-1.png';

  // Get link URL
  const linkUrl = `/properties/${plot.slug || plot.id}`;

  if (variant === 'list') {
    return (
      <Link
        href={linkUrl}
        className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 flex"
      >
        {/* Property Image */}
        <div className="relative w-72 h-48 flex-shrink-0 overflow-hidden">
          <Image
            src={imageUrl}
            alt={plot.title}
            fill
            className="object-cover transform group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#112250]/80 via-[#112250]/20 to-transparent" />

          {/* Badges */}
          <div className="absolute top-4 left-4 flex gap-2">
            {plot.is_featured && (
              <span className="px-3 py-1 bg-[#D8B893] text-[#112250] text-xs font-semibold rounded-full">
                Featured
              </span>
            )}
            {plot.status && (
              <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                plot.status === 'AVAILABLE'
                  ? 'bg-green-500 text-white'
                  : plot.status === 'BOOKED'
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-500 text-white'
              }`}>
                {plot.status}
              </span>
            )}
          </div>

          {/* Favorite Button */}
          {showFavorite && (
            <button
              onClick={handleFavoriteClick}
              className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
            >
              <Heart className={`w-5 h-5 ${
                isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-700'
              }`} />
            </button>
          )}
        </div>

        {/* Property Info */}
        <div className="flex-1 p-6">
          <div className="flex items-center text-gray-500 mb-2">
            <MapPin className="w-4 h-4 mr-2" />
            <span className="text-sm">{locationDisplay}</span>
          </div>
          <h3 className="text-xl font-bold text-[#112250] mb-2 group-hover:text-[#006DB8] transition-colors">
            {plot.title}
          </h3>
          {plot.description && (
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
              {plot.description}
            </p>
          )}
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-[#112250]">
              {formatPrice(plot.price)}
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              {plot.plot_size && <span>{plot.plot_size} sq.ft</span>}
              {plot.facing && <span>{plot.facing} Facing</span>}
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // Grid variant (default)
  return (
    <Link
      href={linkUrl}
      className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
    >
      {/* Property Image */}
      <div className="relative h-64 overflow-hidden">
        <Image
          src={imageUrl}
          alt={plot.title}
          fill
          className="object-cover transform group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#112250]/80 via-[#112250]/20 to-transparent" />

        {/* Badges */}
        <div className="absolute top-4 left-4 flex gap-2">
          {plot.is_featured && (
            <span className="px-3 py-1 bg-[#D8B893] text-[#112250] text-xs font-semibold rounded-full">
              Featured
            </span>
          )}
          {plot.status && (
            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
              plot.status === 'AVAILABLE'
                ? 'bg-green-500 text-white'
                : plot.status === 'BOOKED'
                ? 'bg-orange-500 text-white'
                : 'bg-gray-500 text-white'
            }`}>
              {plot.status}
            </span>
          )}
        </div>

        {/* Favorite Button */}
        {showFavorite && (
          <button
            onClick={handleFavoriteClick}
            className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
          >
            <Heart className={`w-5 h-5 ${
              isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-700'
            }`} />
          </button>
        )}

        {/* Price Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="flex items-center text-white/80 mb-2">
            <MapPin className="w-4 h-4 mr-2" />
            <span className="text-sm">{locationDisplay}</span>
          </div>
          <h3 className="text-xl font-bold text-white mb-2 line-clamp-1">
            {plot.title}
          </h3>
          <div className="text-2xl font-bold text-white">
            {formatPrice(plot.price)}
          </div>
        </div>
      </div>

      {/* Property Details */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center justify-between text-sm text-gray-600">
          {plot.plot_size && (
            <span className="flex items-center gap-1">
              <span className="font-medium">{plot.plot_size}</span> sq.ft
            </span>
          )}
          {plot.dimensions && (
            <span>{plot.dimensions}</span>
          )}
          {plot.facing && (
            <span>{plot.facing} Facing</span>
          )}
        </div>

        {/* Amenities */}
        {plot.amenities && plot.amenities.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {plot.amenities.slice(0, 3).map((amenity) => (
              <span
                key={amenity}
                className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
              >
                {amenity}
              </span>
            ))}
            {plot.amenities.length > 3 && (
              <span className="text-xs text-gray-500">
                +{plot.amenities.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
