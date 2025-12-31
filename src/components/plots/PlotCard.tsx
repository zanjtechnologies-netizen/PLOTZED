'use client';

import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Heart, Download, ArrowRight, Maximize2, Building2, MapPinned } from 'lucide-react';
import { useState } from 'react';

export interface PlotData {
  id: string;
  title: string;
  slug?: string;
  description?: string;
  price: number;
  original_price?: number | null;
  plot_size?: number;
  dimensions?: string;
  facing?: string;
  city?: string;
  state?: string;
  address?: string;
  location?: string; // fallback for city
  hero_image?: string | null;
  images?: string[];
  amenities?: string[];
  nearby_places?: Record<string, any>;
  status?: string;
  is_featured?: boolean;
  brochure?: string;
}

interface PlotCardProps {
  plot: PlotData;
  variant?: 'grid' | 'list' | 'compact';
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

  // Format price in Indian style with varying formats
  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      // Crores
      const crores = price / 10000000;
      return `Rs ${crores.toFixed(2)}Cr`;
    } else if (price >= 100000) {
      // Lakhs
      const lakhs = price / 100000;
      return `Rs ${lakhs.toFixed(0)}L`;
    }
    return `Rs ${price.toLocaleString('en-IN')}`;
  };

  // Create price display with original and discounted price
  const getPriceDisplay = (price: number, adminOriginalPrice?: number | null) => {
    // Use admin-provided original price if available, otherwise calculate 20% higher
    const originalPrice = adminOriginalPrice && adminOriginalPrice > price
      ? adminOriginalPrice
      : price * 1.2;
    const discountedPrice = price;

    return {
      original: formatPrice(originalPrice),
      discounted: formatPrice(discountedPrice)
    };
  };

  // Convert plot size to acres if large enough
  const formatPlotSize = (sizeInSqFt?: number) => {
    if (!sizeInSqFt) return null;

    // Convert to acres if >= 4000 sq.ft (roughly 0.1 acres)
    if (sizeInSqFt >= 4000) {
      const acres = sizeInSqFt / 43560;
      return `${acres.toFixed(2)} Acres`;
    }
    return `${sizeInSqFt.toLocaleString()} Sq.Ft`;
  };

  // Extract nearby locations from nearby_places JSON
  const getNearbyLocations = () => {
    if (!plot.nearby_places) return [];

    // If nearby_places has a 'landmarks' or 'areas' array
    if (Array.isArray(plot.nearby_places)) {
      return plot.nearby_places.slice(0, 8);
    }

    // If it's an object with categories
    const places: string[] = [];
    Object.values(plot.nearby_places).forEach((value) => {
      if (Array.isArray(value)) {
        places.push(...value);
      } else if (typeof value === 'string') {
        places.push(value);
      }
    });

    return places.slice(0, 8);
  };

  // Handle favorite toggle
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newValue = !isFavorite;
    setIsFavorite(newValue);
    onFavoriteToggle?.(plot.id, newValue);
  };

  // Handle brochure download
  const handleBrochureDownload = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (plot.brochure) {
      window.open(plot.brochure, '_blank');
    }
  };

  // Get location display
  const mainLocation = plot.city || plot.location || 'Location TBD';
  const nearbyLocations = getNearbyLocations();

  // Get image URL - prioritize hero_image, then first gallery image, then fallback
  const imageUrl = plot.hero_image || plot.images?.[0] || '/images/hero-bg-fallback-1.png';

  // Get link URL
  const linkUrl = `/properties/${plot.slug || plot.id}`;

  // Compact variant (like the reference design)
  if (variant === 'compact') {
    return (
      <div className="group bg-white rounded-lg border border-gray-200 hover:border-[#D8B893] transition-all duration-300 hover:shadow-xl overflow-hidden relative transform hover:-translate-y-1">
        {/* Property Image */}
        <div className="relative h-64 overflow-hidden">
          <Image
            src={imageUrl}
            alt={plot.title}
            fill
            className="object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />

          {/* Status Badge */}
          {plot.status && (
            <div className="absolute top-4 left-4 z-10">
              <span className={`px-4 py-1.5 text-sm font-semibold rounded shadow-md transition-all duration-300 ${
                plot.status === 'AVAILABLE'
                  ? 'bg-yellow-500 text-white'
                  : plot.status === 'BOOKED'
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-700 text-white'
              }`}>
                {plot.status === 'AVAILABLE' ? 'Ongoing' : plot.status}
              </span>
            </div>
          )}

          {/* Favorite Button */}
          {showFavorite && (
            <button
              onClick={handleFavoriteClick}
              className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center hover:shadow-lg transition-all duration-300 z-10 shadow-md hover:scale-110 active:scale-95"
            >
              <Heart className={`w-5 h-5 transition-all duration-300 ${
                isFavorite ? 'fill-red-500 text-red-500 scale-110' : 'text-gray-600 group-hover:scale-105'
              }`} />
            </button>
          )}
        </div>

        {/* Property Name & Price */}
        <div className="p-6 pb-4">
          <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-gray-700 transition-colors duration-300">
            {plot.title}
          </h3>
          <div className="mb-4 transition-all duration-300">
            <div className="flex items-center gap-2">
              <span className="text-gray-400 font-semibold text-sm line-through">
                {getPriceDisplay(plot.price, plot.original_price).original}
              </span>
              <span className="text-orange-600 font-bold text-lg">
                {getPriceDisplay(plot.price, plot.original_price).discounted}
              </span>
            </div>
          </div>

          {/* Main Location */}
          <div className="flex items-start gap-2 text-gray-700 mb-3 group-hover:text-gray-900 transition-colors duration-300">
            <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5 transition-transform duration-300 group-hover:scale-110" />
            <span className="font-medium">{mainLocation}</span>
          </div>

          {/* Serving Locations */}
          {nearbyLocations.length > 0 && (
            <div className="flex items-start gap-2 text-gray-600 mb-4 transition-colors duration-300">
              <MapPinned className="w-5 h-5 flex-shrink-0 mt-0.5 transition-transform duration-300 group-hover:scale-110" />
              <div className="flex-1">
                <span className="text-sm">
                  <span className="font-medium text-gray-700">Serving Location: </span>
                  {nearbyLocations.join(', ')}
                </span>
              </div>
            </div>
          )}

          {/* Plot Details Grid */}
          <div className="space-y-2.5 mb-4">
            {/* Plot Size */}
            {plot.plot_size && (
              <div className="flex items-center gap-2 text-gray-700 transition-colors duration-300">
                <Maximize2 className="w-5 h-5 text-gray-500 transition-transform duration-300 group-hover:scale-110" />
                <span className="font-medium">{formatPlotSize(plot.plot_size)}</span>
              </div>
            )}

            {/* Dimensions/Units Info */}
            {plot.dimensions && (
              <div className="flex items-center gap-2 text-gray-700 transition-colors duration-300">
                <Building2 className="w-5 h-5 text-gray-500 transition-transform duration-300 group-hover:scale-110" />
                <span className="font-medium">{plot.dimensions}</span>
              </div>
            )}

            {/* Amenities as property type */}
            {plot.amenities && plot.amenities.length > 0 && (
              <div className="flex items-center gap-2 text-gray-700 transition-colors duration-300">
                <svg className="w-5 h-5 text-gray-500 transition-transform duration-300 group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span className="font-medium">{plot.amenities.slice(0, 3).join(', ')}</span>
              </div>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 transition-all duration-300"></div>

        {/* Action Buttons */}
        <div className="p-4 flex gap-3">
          {plot.brochure && (
            <button
              onClick={handleBrochureDownload}
              className="group/btn flex-1 px-4 py-2.5 border-2 border-gray-800 text-gray-800 rounded-lg font-semibold hover:bg-gray-800 hover:text-white transition-all duration-300 flex items-center justify-center gap-2 hover:shadow-md active:scale-95"
            >
              <Download className="w-4 h-4 transition-transform duration-300 group-hover/btn:-translate-y-0.5" />
              Brochure
            </button>
          )}
          <Link
            href={linkUrl}
            className="group/btn flex-1 px-4 py-2.5 bg-gray-800 text-white rounded-lg font-semibold hover:bg-gray-900 transition-all duration-300 flex items-center justify-center gap-2 hover:shadow-md active:scale-95"
          >
            View More
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
          </Link>
        </div>
      </div>
    );
  }

  if (variant === 'list') {
    return (
      <Link
        href={linkUrl}
        className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col sm:flex-row"
      >
        {/* Property Image */}
        <div className="relative w-full sm:w-72 h-56 sm:h-48 flex-shrink-0 overflow-hidden">
          <Image
            src={imageUrl}
            alt={plot.title}
            fill
            className="object-cover transform group-hover:scale-110 transition-transform duration-500"
            sizes="300px"
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
            <span className="text-sm">{mainLocation}</span>
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
            <div className="flex flex-col gap-1">
              <span className="text-gray-400 font-semibold text-sm line-through">
                {getPriceDisplay(plot.price, plot.original_price).original}
              </span>
              <span className="text-2xl font-bold text-[#112250]">
                {getPriceDisplay(plot.price, plot.original_price).discounted}
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              {plot.plot_size && <span>{formatPlotSize(plot.plot_size)}</span>}
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
      className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 sm:hover:-translate-y-2"
    >
      {/* Property Image */}
      <div className="relative h-48 sm:h-56 md:h-64 overflow-hidden">
        <Image
          src={imageUrl}
          alt={plot.title}
          fill
          className="object-cover transform group-hover:scale-110 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
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
        <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 md:p-6">
          <div className="flex items-center text-white/80 mb-1 sm:mb-2">
            <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            <span className="text-xs sm:text-sm line-clamp-1">{mainLocation}</span>
          </div>
          <h3 className="text-sm sm:text-lg md:text-xl font-bold text-white mb-1 sm:mb-2 line-clamp-1">
            {plot.title}
          </h3>
          <div className="flex items-center gap-1 sm:gap-2">
            <span className="text-white/60 font-semibold text-xs sm:text-sm line-through">
              {getPriceDisplay(plot.price, plot.original_price).original}
            </span>
            <span className="text-lg sm:text-xl md:text-2xl font-bold text-white">
              {getPriceDisplay(plot.price, plot.original_price).discounted}
            </span>
          </div>
        </div>
      </div>

      {/* Property Details */}
      <div className="p-3 sm:p-4 border-t border-gray-100">
        <div className="flex items-center justify-between text-xs sm:text-sm text-gray-600 flex-wrap gap-1">
          {plot.plot_size && (
            <span className="flex items-center gap-1">
              <span className="font-medium">{formatPlotSize(plot.plot_size)}</span>
            </span>
          )}
          {plot.dimensions && (
            <span className="hidden sm:inline">{plot.dimensions}</span>
          )}
          {plot.facing && (
            <span className="hidden sm:inline">{plot.facing} Facing</span>
          )}
        </div>

        {/* Amenities */}
        {plot.amenities && plot.amenities.length > 0 && (
          <div className="flex flex-wrap gap-1 sm:gap-2 mt-2 sm:mt-3">
            {plot.amenities.slice(0, 3).map((amenity) => (
              <span
                key={amenity}
                className="text-[10px] sm:text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
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
