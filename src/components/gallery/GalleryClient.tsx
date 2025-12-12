'use client';

import Link from 'next/link';
import { useState, useMemo } from 'react';
import { Play, Image as ImageIcon, Eye, ArrowLeft } from 'lucide-react';
import { Playfair_Display, Libre_Baskerville } from 'next/font/google';
import { motion, AnimatePresence } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import Image from 'next/image';

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  display: 'swap',
  variable: '--font-playfair',
});

const libre = Libre_Baskerville({
  subsets: ['latin'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-libre',
});

type MediaType = 'all' | 'images' | 'tours';

export interface GalleryItem {
  id: string;
  type: 'video' | 'image' | 'tour';
  title: string;
  description?: string;
  thumbnail: string;
  mediaUrl: string;
  location: string;
}

interface GalleryClientProps {
  images: GalleryItem[];
  videos: GalleryItem[];
  tours: GalleryItem[];
}

export default function GalleryClient({ images, tours }: GalleryClientProps) {
  const [filter, setFilter] = useState<MediaType>('all');
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const prefersReducedMotion = useReducedMotion();

  // Combine all items
  const allItems = useMemo(() => {
    const combined = [...images, ...tours];
    return combined;
  }, [images, tours]);

  // Filter items based on selected filter
  const filteredItems = useMemo(() => {
    if (filter === 'all') return allItems;
    if (filter === 'images') return images;
    if (filter === 'tours') return tours;
    return allItems;
  }, [filter, allItems, images, tours]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Play className="w-6 h-6" />;
      case 'image':
        return <ImageIcon className="w-6 h-6" />;
      case 'tour':
        return <Eye className="w-6 h-6" />;
      default:
        return null;
    }
  };

  // Animation variants - respect user's motion preferences
  const containerVariants = useMemo(() => ({
    hidden: { opacity: prefersReducedMotion ? 1 : 0 },
    visible: {
      opacity: 1,
      transition: prefersReducedMotion ? {} : {
        staggerChildren: 0.1,
        delayChildren: 0.05
      }
    }
  }), [prefersReducedMotion]);

  const itemVariants = useMemo(() => ({
    hidden: { opacity: prefersReducedMotion ? 1 : 0, y: prefersReducedMotion ? 0 : 20, scale: 1 },
    visible: { opacity: 1, y: 0, scale: 1, transition: prefersReducedMotion ? { duration: 0 } : { duration: 0.4 } }
  }), [prefersReducedMotion]);

  const getYouTubeEmbedUrl = (url: string) => {
    // Extract video ID from various YouTube URL formats (including Shorts)
    const videoId = url.match(
      /(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    )?.[1];
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  };

  return (
    <div className={`min-h-screen bg-[#F9FAFB] ${playfair.variable} ${libre.variable}`}>
      {/* Header with Blended Background */}
      <div className="relative overflow-hidden pb-32">
        {/* Background Image with Seamless Blend */}
        <div className="absolute inset-0 h-[calc(100%+150px)]">
          <div className="absolute inset-0 bg-[url('/images/gallery-bg.jpg')] bg-cover bg-center opacity-100 brightness-90 contrast-110" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#F9FAFB]/30 via-[#F9FAFB]/10 to-[#F9FAFB]" />
          <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#F9FAFB] via-[#F9FAFB]/95 to-transparent backdrop-blur-sm" />
        </div>

        <div className="container-custom mx-auto relative z-10 pt-24 pb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-[#112250] hover:text-[#112250] transition-colors group bg-white/70 hover:bg-white/90 px-4 py-2 rounded-full backdrop-blur-md border border-white/40 shadow-lg"
            >
              <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
              <span className="font-medium">Back to Home</span>
            </Link>
          </motion.div>

          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="font-playfair text-5xl md:text-6xl font-bold mb-6 text-[#D8B893] drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)]"
              style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.2)' }}
            >
              Gallery
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="font-libre text-xl text-[#112250] max-w-2xl mx-auto drop-shadow-[0_2px_6px_rgba(255,255,255,0.8)] font-semibold"
              style={{ textShadow: '1px 1px 3px rgba(255,255,255,0.9), -1px -1px 3px rgba(255,255,255,0.9)' }}
            >
              Explore our curated collection through stunning images and immersive virtual tours
            </motion.p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-40 shadow-sm -mt-32"
      >
        <div className="container-custom mx-auto py-6">
          <div className="flex gap-4 overflow-x-auto scrollbar-thin">
            {[
              { key: 'all', label: `All Media (${allItems.length})` },
              { key: 'images', label: `Images (${images.length})` },
              { key: 'tours', label: `Virtual Tours (${tours.length})` },
            ].map((tab, index) => (
              <motion.button
                key={tab.key}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFilter(tab.key as MediaType)}
                className={`px-6 py-2 rounded-full font-semibold transition-all whitespace-nowrap relative overflow-hidden ${
                  filter === tab.key
                    ? 'bg-[#112250] text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                style={{ fontFamily: 'var(--font-libre)' }}
              >
                {filter === tab.key && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-[#112250]"
                    style={{ borderRadius: '9999px' }}
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10">{tab.label}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Gallery Masonry Grid */}
      <div className="container-custom mx-auto py-20 px-4">
        <AnimatePresence mode="wait">
          {filteredItems.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center py-20"
            >
              <p className="text-gray-500 text-lg font-libre">
                No media items available for this filter.
              </p>
            </motion.div>
          ) : (
            <motion.div
              key={filter}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0 }}
              className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 auto-rows-[200px]"
            >
              {filteredItems.map((item, index) => {
                // Create varying sizes for masonry effect
                const sizeClasses = [
                  'col-span-2 row-span-2', // Large square
                  'col-span-1 row-span-2', // Tall
                  'col-span-2 row-span-1', // Wide
                  'col-span-1 row-span-1', // Small square
                  'col-span-2 row-span-2', // Large square
                  'col-span-1 row-span-1', // Small square
                  'col-span-1 row-span-2', // Tall
                  'col-span-2 row-span-1', // Wide
                ];
                const sizeClass = sizeClasses[index % sizeClasses.length];

                return (
                  <motion.div
                    key={item.id}
                    variants={itemVariants}
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                    className={`group relative overflow-hidden rounded-3xl cursor-pointer shadow-md hover:shadow-2xl ${sizeClass}`}
                    onClick={() => setSelectedItem(item)}
                  >
                    {/* Image/Video/Tour Thumbnail */}
                    <Image
                      src={item.thumbnail}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      unoptimized={item.type === 'tour'} // Don't optimize external YouTube thumbnails
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

                    {/* Type Icon Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-16 h-16 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center shadow-lg">
                        {getIcon(item.type)}
                      </div>
                    </div>

                    {/* Bottom Info (visible on hover) */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <h3 className="font-playfair text-lg font-bold text-white mb-1 line-clamp-2">
                        {item.title}
                      </h3>
                      <p className="font-libre text-sm text-white/80 flex items-center gap-1">
                        <span>📍</span>
                        {item.location}
                      </p>
                    </div>

                    {/* Type Badge */}
                    <div className="absolute top-3 right-3">
                      <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-semibold">
                        {getIcon(item.type)}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Modal for viewing media */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-w-6xl w-full bg-white rounded-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                {selectedItem.type === 'image' && (
                  <div className="relative w-full h-[600px]">
                    <Image
                      src={selectedItem.mediaUrl}
                      alt={selectedItem.title}
                      fill
                      className="object-contain"
                      sizes="(max-width: 1536px) 100vw"
                    />
                  </div>
                )}
                {(selectedItem.type === 'video' || selectedItem.type === 'tour') && (
                  <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                    <iframe
                      src={getYouTubeEmbedUrl(selectedItem.mediaUrl)}
                      className="absolute inset-0 w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                )}
                <button
                  onClick={() => setSelectedItem(null)}
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-gray-800 hover:bg-white transition-colors"
                >
                  ✕
                </button>
              </div>
              <div className="p-6">
                <h3 className="font-playfair text-2xl font-bold text-[#112250] mb-2">
                  {selectedItem.title}
                </h3>
                <p className="font-libre text-gray-600 flex items-center gap-2">
                  <span className="text-[#D8B893]">📍</span>
                  {selectedItem.location}
                </p>
                {selectedItem.description && (
                  <p className="font-libre text-gray-700 mt-4">
                    {selectedItem.description}
                  </p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
