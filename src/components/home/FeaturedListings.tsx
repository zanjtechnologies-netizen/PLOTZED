'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Heart } from 'lucide-react';

interface FeaturedPlot {
  id: string;
  title: string;
  slug?: string;
  price: number;
  city?: string;
  state?: string;
  location?: string;
  images?: string[];
  is_featured?: boolean;
}

export default function FeaturedListings() {
  const [plots, setPlots] = useState<FeaturedPlot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFeaturedPlots() {
      try {
        const response = await fetch('/api/plots?featured=true&limit=6');
        const result = await response.json();
        if (result.success && result.data?.plots) {
          setPlots(result.data.plots);
        }
      } catch (error) {
        console.error('Failed to load featured plots:', error);
      } finally {
        setLoading(false);
      }
    }
    loadFeaturedPlots();
  }, []);

  // Fallback data for when API has no data
  const fallbackPlots: FeaturedPlot[] = [
    {
      id: '1',
      title: 'Premium Villa Plot - Riverside',
      location: 'Chennai',
      price: 4500000,
      images: ['/images/hero-bg-fallback-1.png'],
    },
    {
      id: '2',
      title: 'Gated Community Plot',
      location: 'Coimbatore',
      price: 3200000,
      images: ['/images/hero-bg-fallback-2.png'],
    },
    {
      id: '3',
      title: 'Corner Plot - Prime Location',
      location: 'Bangalore',
      price: 5800000,
      images: ['/images/hero-bg-fallback-3.png'],
    },
    {
      id: '4',
      title: 'Lake View Premium Plot',
      location: 'Hyderabad',
      price: 6500000,
      images: ['/images/hero-bg-fallback-4.png'],
    },
    {
      id: '5',
      title: 'RERA Approved Plot',
      location: 'Chennai',
      price: 2800000,
      images: ['/images/hero-bg-fallback-1.png'],
    },
    {
      id: '6',
      title: 'Highway Touch Plot',
      location: 'Coimbatore',
      price: 3900000,
      images: ['/images/hero-bg-fallback-2.png'],
    },
  ];

  const displayPlots = plots.length > 0 ? plots : fallbackPlots;

  // Format price in Indian style
  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(2)} Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(2)} Lakhs`;
    }
    return `₹${price.toLocaleString('en-IN')}`;
  };

  // Get location display
  const getLocation = (plot: FeaturedPlot) => {
    if (plot.city && plot.state) return `${plot.city}, ${plot.state}`;
    if (plot.city) return plot.city;
    return plot.location || 'Location TBD';
  };

  return (
    <section id="featuredlistings" className="py-20 bg-gray-50">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{ fontFamily: 'var(--font-playfair)', color: '#112250' }}
          >
            Featured Listings
          </h2>
          <div className="w-24 h-1 bg-[#006DB8] mx-auto" />
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-lg animate-pulse">
                <div className="h-64 bg-gray-200" />
              </div>
            ))}
          </div>
        )}

        {/* Properties Grid - Simple Overlay Style */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {displayPlots.slice(0, 6).map((plot) => (
              <Link
                key={plot.id}
                href={`/properties/${plot.slug || plot.id}`}
                className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              >
                {/* Property Image with Overlay */}
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={plot.images?.[0] || '/images/hero-bg-fallback-1.png'}
                    alt={plot.title}
                    fill
                    className="object-cover transform group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#112250]/80 via-[#112250]/30 to-transparent" />

                  {/* Favorite Button */}
                  <button
                    onClick={(e) => e.preventDefault()}
                    className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
                  >
                    <Heart className="w-5 h-5 text-gray-700" />
                  </button>

                  {/* Property Info Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="flex items-center text-white/80 mb-2">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span className="text-sm">{getLocation(plot)}</span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2 line-clamp-1">
                      {plot.title}
                    </h3>
                    <div className="text-2xl font-bold text-white">
                      {formatPrice(plot.price)}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* View All Button */}
        <div className="text-center">
          <Link
            href="/properties"
            className="inline-block px-8 py-4 rounded-full font-semibold transition-colors hover:opacity-90"
            style={{ backgroundColor: '#112250', color: '#FFFFFF' }}
          >
            Explore All Listings
          </Link>
        </div>
      </div>
    </section>
  );
}
