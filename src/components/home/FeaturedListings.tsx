'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
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
    loadFeaturedProperties();
  }, []);

  // Fallback data
  const fallbackProperties = [
    {
      id: '1',
      title: 'Luxury Ocean View',
      location: 'Miami Beach',
      price: 2500000,
      images: [{ id: '1', url: '/images/property-1.jpg', order: 1, propertyId: '1' }],
    },
    {
      id: '2',
      title: 'Modern Villa',
      location: 'Beverly Hills',
      price: 4800000,
      images: [{ id: '2', url: '/images/property-2.jpg', order: 1, propertyId: '2' }],
    },
    {
      id: '3',
      title: 'Penthouse Suite',
      location: 'Manhattan',
      price: 6200000,
      images: [{ id: '3', url: '/images/property-3.jpg', order: 1, propertyId: '3' }],
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
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Featured Listings
          </h2>
          <div className="w-24 h-1 bg-teal-500 mx-auto" />
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {displayProperties.slice(0, 6).map((property) => (
            <Link
              key={property.id}
              href={`/properties/${property.id}`}
              className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
            >
              {/* Property Image */}
              <div className="relative h-64 overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center transform group-hover:scale-110 transition-transform duration-500"
                  style={{
                    backgroundImage: `url(${property.images?.[0]?.url || '/images/property-placeholder.jpg'})`,
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-navy-950/20 to-transparent" />
                
                {/* Favorite Button */}
                <button className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors">
                  <Heart className="w-5 h-5 text-gray-700" />
                </button>

                {/* Property Info Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-center text-white mb-2">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span className="text-sm">{property.location}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {property.title}
                  </h3>
                  <div className="text-2xl font-bold text-white">
                    {formatPrice(property.price)}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Link
            href="/properties"
            className="inline-block bg-navy-900 text-white px-8 py-4 rounded-full font-semibold hover:bg-navy-800 transition-colors"
          >
            Explore All Listings
          </Link>
        </div>
      </div>
    </section>
  );
}