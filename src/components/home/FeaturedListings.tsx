'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
<<<<<<< HEAD
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
=======
import { MapPin, Heart } from 'lucide-react';
import { api } from '@/lib/api';
import type { Property } from '@/types';

export default function FeaturedListings() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFeaturedProperties() {
      const response = await api.properties.getFeatured();
      if (response.success && response.data) {
        setProperties(response.data);
      }
      setLoading(false);
    }
    // loadFeaturedProperties();
  }, []);

  // Fallback data
  const fallbackProperties = [
    {
      id: '1',
      title: 'Casuarina Greens',
      location: 'Auroville Green Belt',
      price: 40500000,
      images: [{ id: '1', url: '/images/casuarina-greens.png', order: 1, propertyId: '1' }],
    },
    {
      id: '2',
      title: 'Katumode Greens',
      location: 'Auroville Ring Road',
      price: 43200000,
      images: [{ id: '2', url: '/images/katumode-greens.png', order: 1, propertyId: '2' }],
    },
    {
      id: '3',
      title: 'House Property',
      location: 'Koonimedu, ECR',
      price: 19200000,
      images: [{ id: '3', url: '/images/house-property.png', order: 1, propertyId: '3' }],
    },
    {
      id: '4',
      title: 'Beachfront Estate',
      location: 'Malibu',
      price: 8500000,
      images: [{ id: '4', url: '/images/property-4.jpg', order: 1, propertyId: '4' }],
    },
    {
      id: '5',
      title: 'Mountain Retreat',
      location: 'Aspen',
      price: 5500000,
      images: [{ id: '5', url: '/images/property-5.jpg', order: 1, propertyId: '5' }],
    },
    {
      id: '6',
      title: 'Urban Luxury',
      location: 'New York',
      price: 3900000,
      images: [{ id: '6', url: '/images/property-6.jpg', order: 1, propertyId: '6' }],
    },
  ];

  const displayProperties = properties.length > 0 ? properties : fallbackProperties;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <section id='featuredlistings' className="py-20 bg-gray-50">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Featured Listings
          </h2>
          <div className="w-24 h-1 bg-teal-500 mx-auto" />
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-20 mb-12">
          {displayProperties.slice(0, 3).map((property, index) => {
            let href = `/properties/${property.id}`;
            if (index === 0) href = '/properties/casuarina-greens';
            if (index === 1) href = '/properties/katumode-greens';
            if (index === 2) href = '/properties/house-property-koonimedu';

            return (
              <Link
                key={property.id}
                href={href}
                className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              >
                {/* Property Image */}
                <div className="relative h-[380px] overflow-hidden">
                  <div
                    className="absolute inset-0 bg-cover bg-center transform group-hover:scale-110 transition-transform duration-500"
                    style={{
                      backgroundImage: `url(${property.images?.[0]?.url || '/images/property-placeholder.jpg'})`,
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-navy-950/20 to-transparent" />

                  {/* Favorite Button */}
                  <button className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors">
>>>>>>> 82485807befa8b6652d353a9219b02a1a1361183
                    <Heart className="w-5 h-5 text-gray-700" />
                  </button>

                  {/* Property Info Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
<<<<<<< HEAD
                    <div className="flex items-center text-white/80 mb-2">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span className="text-sm">{getLocation(plot)}</span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2 line-clamp-1">
                      {plot.title}
                    </h3>
                    <div className="text-2xl font-bold text-white">
                      {formatPrice(plot.price)}
=======
                    <div className="flex items-center text-white mb-2">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span className="text-sm">{property.location}</span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      {property.title}
                    </h3>
                    <div className="text-2xl font-bold text-white">
                      {formatPrice(property.price)}
>>>>>>> 82485807befa8b6652d353a9219b02a1a1361183
                    </div>
                  </div>
                </div>
              </Link>
<<<<<<< HEAD
            ))}
          </div>
        )}
=======
            );
          })}
        </div>
>>>>>>> 82485807befa8b6652d353a9219b02a1a1361183

        {/* View All Button */}
        <div className="text-center">
          <Link
            href="/properties"
<<<<<<< HEAD
            className="inline-block px-8 py-4 rounded-full font-semibold transition-colors hover:opacity-90"
            style={{ backgroundColor: '#112250', color: '#FFFFFF' }}
=======
            className="inline-block bg-navy-900 text-white px-8 py-4 rounded-full font-semibold hover:bg-navy-800 transition-colors"
>>>>>>> 82485807befa8b6652d353a9219b02a1a1361183
          >
            Explore All Listings
          </Link>
        </div>
      </div>
    </section>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> 82485807befa8b6652d353a9219b02a1a1361183
