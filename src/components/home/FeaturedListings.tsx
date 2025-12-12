'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import PlotCard from '@/components/plots/PlotCard';

interface FeaturedPlot {
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
  address?: string;
  location?: string;
  images?: string[];
  amenities?: string[];
  nearby_places?: Record<string, any>;
  status?: string;
  is_featured?: boolean;
  brochure?: string;
}

export default function FeaturedListings() {
  const [plots, setPlots] = useState<FeaturedPlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<string[]>([]);
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    async function loadData() {
      try {
        // Parallelize API calls for better performance
        const requests = [
          fetch('/api/plots?featured=true&limit=3').then(res => res.json())
        ];

        // Only fetch favorites if user is logged in
        if (session?.user) {
          requests.push(fetch('/api/favorites').then(res => res.json()));
        }

        const results = await Promise.all(requests);

        // Handle plots response
        if (results[0]?.success && results[0].data?.plots) {
          setPlots(results[0].data.plots);
        }

        // Handle favorites response (if user is logged in)
        if (session?.user && results[1]?.success && results[1].data?.favorites) {
          setFavorites(results[1].data.favorites);
        }
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [session]);

  // Toggle favorite
  const toggleFavorite = useCallback(async (plotId: string, _isFavorite: boolean) => {
    // Check if user is logged in
    if (!session?.user) {
      router.push('/login?callbackUrl=' + encodeURIComponent(window.location.pathname));
      return;
    }

    try {
      if (favorites.includes(plotId)) {
        // Remove from favorites
        const response = await fetch(`/api/favorites?plotId=${plotId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setFavorites(favorites.filter((id) => id !== plotId));
        }
      } else {
        // Add to favorites
        const response = await fetch('/api/favorites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ plotId }),
        });

        if (response.ok) {
          setFavorites([...favorites, plotId]);
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  }, [session, router, favorites]);

  // Fallback data for when API has no data
  const fallbackPlots: FeaturedPlot[] = [
    {
      id: '1',
      title: 'Casuarina Greens',
      location: 'Pondicherry, Puducherry',
      price: 40500000,
      plot_size: 217800,
      dimensions: '450 Units',
      amenities: ['2, 3 & 4 BHK Apts'],
      nearby_places: {
        areas: ['Chromepet', 'Kundrathur', 'Tambaram', 'Guindy', 'Pammal', 'Meenambakkam', 'Nanganallur', 'Alandur']
      },
      images: ['/images/casuarina-greens.jpg'],
      brochure: '/brochures/sample-brochure.pdf',
      status: 'AVAILABLE',
    },
    {
      id: '2',
      title: 'Katumode Greens',
      location: 'Pondicherry, Puducherry',
      price: 43200000,
      plot_size: 217800,
      dimensions: '450 Units',
      amenities: ['2, 3 & 4 BHK Apts'],
      nearby_places: {
        areas: ['Chromepet', 'Kundrathur', 'Tambaram', 'Guindy', 'Pammal', 'Meenambakkam', 'Nanganallur', 'Alandur']
      },
      images: ['/images/katumode-greens.jpg'],
      brochure: '/brochures/sample-brochure.pdf',
      status: 'AVAILABLE',
    },
    {
      id: '3',
      title: 'House Property',
      location: 'Pondicherry, Puducherry',
      price: 19200000,
      plot_size: 87120,
      dimensions: '180 Units',
      amenities: ['2, 3 & 4 BHK Apts'],
      nearby_places: {
        areas: ['Chromepet', 'Kundrathur', 'Tambaram', 'Guindy', 'Pammal', 'Meenambakkam', 'Nanganallur', 'Alandur']
      },
      images: ['/images/house-property.jpg'],
      brochure: '/brochures/sample-brochure.pdf',
      status: 'AVAILABLE',
    },
  ];

  const displayPlots = useMemo(() => plots.length > 0 ? plots : fallbackPlots, [plots]);

  // Animation variants - memoized to prevent recreation
  const containerVariants = useMemo(() => ({
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  }), []);

  const itemVariants = useMemo(() => ({
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 }
  }), []);

  return (
    <section id="featuredlistings" className="py-16 bg-gray-50 px-4">
      <div className="container-custom">
        {/* Section Header with Animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <h2
            className="font-bold mb-4"
            style={{
              fontFamily: 'var(--font-playfair)',
              color: '#112250',
              fontSize: 'clamp(2rem, 4vw, 3rem)'
            }}
          >
            Featured Listings
          </h2>
          <motion.div
            className="w-24 h-1 bg-[#D8B893] mx-auto"
            initial={{ width: 0 }}
            whileInView={{ width: 96 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          />
        </motion.div>

        {/* Enhanced Loading State with Shimmer */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 lg:gap-8 mb-16">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg overflow-hidden shadow-lg animate-pulse">
                <div className="h-64 bg-gray-200" />
                <div className="p-6 space-y-4">
                  <div className="h-6 bg-gray-200 rounded w-3/4" />
                  <div className="h-5 bg-gray-200 rounded w-1/2" />
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded" />
                    <div className="h-4 bg-gray-200 rounded w-5/6" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Properties Grid with Stagger Animation */}
        {!loading && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 lg:gap-8 max-w-7xl mx-auto mb-16"
          >
            {displayPlots.slice(0, 3).map((plot) => (
              <motion.div
                key={plot.id}
                variants={itemVariants}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <PlotCard
                  plot={plot}
                  variant="compact"
                  showFavorite={true}
                  onFavoriteToggle={toggleFavorite}
                  isFavorite={favorites.includes(plot.id)}
                />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* View All Button with Hover Animation */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
        >
          <Link href="/properties">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="px-10 py-4 rounded-full font-semibold text-lg transition-all shadow-lg hover:shadow-xl"
              style={{
                backgroundColor: '#112250',
                color: '#FFFFFF',
                fontFamily: 'var(--font-libre)'
              }}
            >
              Explore All Listings
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
