'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Heart } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

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
  const [favorites, setFavorites] = useState<string[]>([]);
  const [favoriteLoading, setFavoriteLoading] = useState<string | null>(null);
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    async function loadFeaturedPlots() {
      try {
        const response = await fetch('/api/plots?featured=true&limit=3');
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

  // Load user's favorites
  useEffect(() => {
    async function loadFavorites() {
      if (!session?.user) return;

      try {
        const response = await fetch('/api/favorites');
        const result = await response.json();
        if (result.success && result.data?.favorites) {
          setFavorites(result.data.favorites);
        }
      } catch (error) {
        console.error('Failed to load favorites:', error);
      }
    }
    loadFavorites();
  }, [session]);

  // Toggle favorite
  const toggleFavorite = async (e: React.MouseEvent, plotId: string) => {
    e.preventDefault();
    e.stopPropagation();

    // Check if user is logged in
    if (!session?.user) {
      router.push('/login?callbackUrl=' + encodeURIComponent(window.location.pathname));
      return;
    }

    setFavoriteLoading(plotId);

    try {
      const isFavorite = favorites.includes(plotId);

      if (isFavorite) {
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
    } finally {
      setFavoriteLoading(null);
    }
  };

  // Fallback data for when API has no data
  const fallbackPlots: FeaturedPlot[] = [
    {
      id: '1',
      title: 'Casuarina Greens',
      location: 'Auroville Green Belt, Pondicherry',
      price: 40500000,
      images: ['/images/casuarina-greens.jpg'],
    },
    {
      id: '2',
      title: 'Katumode Greens',
      location: 'Auroville Green Belt, Pondicherry',
      price: 43200000,
      images: ['/images/katumode-greens.jpg'],
    },
    {
      id: '3',
      title: 'House Property',
      location: 'Koonimedu, ECR, Pondicherry',
      price: 19200000,
      images: ['/images/house-property.jpg'],
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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 }
  };

  return (
    <section id="featuredlistings" className="py-20 bg-gray-50 px-4">
      <div className="container-custom">
        {/* Section Header with Animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-3xl overflow-hidden shadow-lg">
                <div className="h-[340px] relative overflow-hidden bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer" />
                <div className="p-6 space-y-3">
                  <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded w-3/4" />
                  <div className="h-6 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded w-1/2" />
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
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto mb-16 px-4"
          >
            {displayPlots.slice(0, 3).map((plot, index) => (
              <motion.div key={plot.id} variants={itemVariants}>
                <Link
                  href={`/properties/${plot.slug || plot.id}`}
                  className="block group"
                >
                  <motion.div
                    whileHover={{ y: -8, scale: 1.02 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="relative bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden shadow-[0_10px_40px_rgba(17,34,80,0.12)] hover:shadow-[0_25px_60px_rgba(17,34,80,0.25)] transition-all duration-500"
                  >
                    {/* Property Image with Enhanced Overlay */}
                    <div className="relative h-[340px] overflow-hidden">
                      <div className="absolute inset-0">
                        <Image
                          src={plot.images?.[0] || '/images/hero-bg-fallback-1.png'}
                          alt={plot.title}
                          fill
                          unoptimized={true}
                          priority={index === 0}
                          quality={85}
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover transform group-hover:scale-110 transition-transform duration-700"
                        />
                      </div>

                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#112250]/90 via-[#112250]/40 to-transparent" />

                      {/* Animated Border Gradient on Hover */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <div className="absolute inset-0 bg-gradient-to-r from-[#D8B893]/20 via-transparent to-[#006DB8]/20" />
                      </div>

                      {/* Favorite Button with Animation */}
                      <motion.button
                        onClick={(e) => toggleFavorite(e, plot.id)}
                        disabled={favoriteLoading === plot.id}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white transition-all disabled:opacity-50 shadow-lg"
                        title={session?.user ? (favorites.includes(plot.id) ? 'Remove from favorites' : 'Add to favorites') : 'Login to save favorites'}
                      >
                        <motion.div
                          animate={favorites.includes(plot.id) ? { scale: [1, 1.2, 1] } : {}}
                          transition={{ duration: 0.3 }}
                        >
                          <Heart
                            className={`w-5 h-5 transition-colors ${
                              favorites.includes(plot.id)
                                ? 'fill-red-500 text-red-500'
                                : 'text-gray-700 group-hover:text-red-500'
                            }`}
                          />
                        </motion.div>
                      </motion.button>

                      {/* Property Info Overlay with Micro-interactions */}
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <motion.div
                          className="flex items-center text-white/80 mb-2"
                          whileHover={{ x: 4 }}
                          transition={{ duration: 0.2 }}
                        >
                          <motion.div
                            animate={{ y: [0, -2, 0] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                          >
                            <MapPin className="w-4 h-4 mr-2" />
                          </motion.div>
                          <span className="text-sm">{getLocation(plot)}</span>
                        </motion.div>
                        <h3 className="text-xl font-bold text-white mb-2 line-clamp-1 group-hover:text-[#D8B893] transition-colors duration-300">
                          {plot.title}
                        </h3>
                        <motion.div
                          className="text-2xl font-bold bg-gradient-to-r from-white to-[#D8B893] bg-clip-text text-transparent"
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.2 }}
                        >
                          {formatPrice(plot.price)}
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                </Link>
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
