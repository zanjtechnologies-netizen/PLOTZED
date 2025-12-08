'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Play, Image as ImageIcon, Eye, ArrowLeft } from 'lucide-react';
import { Playfair_Display, Libre_Baskerville } from 'next/font/google';

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

type MediaType = 'all' | 'videos' | 'images' | 'tours';

interface GalleryItem {
  id: string;
  type: 'video' | 'image' | 'tour';
  title: string;
  description: string;
  thumbnail: string;
  videoUrl?: string;
  imageUrl?: string;
  tourUrl?: string;
  location: string;
  category: string;
}

export default function GalleryPage() {
  const [filter, setFilter] = useState<MediaType>('all');

  // Sample gallery items - will be dynamic in future
  const galleryItems: GalleryItem[] = [
    {
      id: '1',
      type: 'video',
      title: 'Auroville Landscape Tour',
      description: 'Explore the serene landscapes and architectural beauty of Auroville.',
      thumbnail: '/images/auroville-1.jpg',
      videoUrl: 'https://www.youtube.com/embed/example1',
      location: 'Auroville, Pondicherry',
      category: 'Property Tours',
    },
    {
      id: '2',
      type: 'video',
      title: 'Pondicherry White Town Heritage',
      description: 'Discover the colonial charm and French architecture of White Town.',
      thumbnail: '/images/white-town-1.jpg',
      videoUrl: 'https://www.youtube.com/embed/example2',
      location: 'White Town, Pondicherry',
      category: 'Heritage Sites',
    },
    {
      id: '3',
      type: 'image',
      title: 'Casuarina Greens Property',
      description: 'Premium land in Auroville Green Belt with stunning natural beauty.',
      thumbnail: '/images/casuarina-greens.jpg',
      imageUrl: '/images/casuarina-greens.jpg',
      location: 'Auroville Green Belt',
      category: 'Properties',
    },
    {
      id: '4',
      type: 'image',
      title: 'Katumode Greens Property',
      description: 'Luxury plot with expansive frontage and pristine environment.',
      thumbnail: '/images/katumode-greens.jpg',
      imageUrl: '/images/katumode-greens.jpg',
      location: 'Auroville Green Belt',
      category: 'Properties',
    },
    {
      id: '5',
      type: 'tour',
      title: 'Virtual Property Tour',
      description: 'Experience our premium properties through immersive 360° virtual tours.',
      thumbnail: '/images/house-property.jpg',
      tourUrl: '#',
      location: 'Koonimedu, ECR',
      category: 'Virtual Tours',
    },
  ];

  const filteredItems = galleryItems.filter((item) => {
    if (filter === 'all') return true;
    if (filter === 'videos') return item.type === 'video';
    if (filter === 'images') return item.type === 'image';
    if (filter === 'tours') return item.type === 'tour';
    return true;
  });

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

  return (
    <div className={`min-h-screen bg-[#F9FAFB] ${playfair.variable} ${libre.variable}`}>
      {/* Header */}
      <div className="bg-[#112250] text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/hero-bg.jpg')] bg-cover bg-center opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#112250]/80 to-[#112250]" />

        <div className="container-custom mx-auto relative z-10">
          {/* Back to Home Button */}
          <div className="mb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors group bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm"
            >
              <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
              <span className="font-medium">Back to Home</span>
            </Link>
          </div>

          <div className="text-center">
            <h1 className="font-playfair text-5xl md:text-6xl font-bold mb-6 text-[#D8B893]">
              Gallery
            </h1>
            <p className="font-libre text-xl text-gray-300 max-w-2xl mx-auto">
              Immerse yourself in our collection of videos, images, and virtual tours showcasing premium properties
            </p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-[72px] z-40">
        <div className="container-custom mx-auto py-6">
          <div className="flex gap-4 overflow-x-auto">
            {[
              { key: 'all', label: 'All Media' },
              { key: 'videos', label: 'Videos' },
              { key: 'images', label: 'Images' },
              { key: 'tours', label: 'Virtual Tours' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key as MediaType)}
                className={`px-6 py-2 rounded-full font-semibold transition-all whitespace-nowrap ${
                  filter === tab.key
                    ? 'bg-[#112250] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                style={{ fontFamily: 'var(--font-libre)' }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="container-custom mx-auto py-20">
        {filteredItems.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg font-libre">
              No media items available for this filter.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col"
              >
                {/* Thumbnail */}
                <div className="relative h-64 overflow-hidden">
                  <div
                    className="absolute inset-0 bg-cover bg-center transform group-hover:scale-110 transition-transform duration-700"
                    style={{ backgroundImage: `url(${item.thumbnail})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                  {/* Type Icon */}
                  <div className="absolute top-4 left-4">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#D8B893] text-[#112250]">
                      {getIcon(item.type)}
                      <span className="text-sm font-bold uppercase">
                        {item.type}
                      </span>
                    </div>
                  </div>

                  {/* Play/View Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center">
                      {getIcon(item.type)}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-grow flex flex-col">
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-3 font-libre">
                    <span className="text-[#D8B893]">📍</span>
                    <span>{item.location}</span>
                  </div>

                  <h3 className="font-playfair text-2xl font-bold text-[#112250] mb-2 group-hover:text-[#D8B893] transition-colors">
                    {item.title}
                  </h3>

                  <p className="font-libre text-gray-600 mb-4 flex-grow leading-relaxed">
                    {item.description}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className="text-xs font-semibold text-gray-500 uppercase">
                      {item.category}
                    </span>
                    <button className="flex items-center gap-2 text-[#112250] font-semibold hover:gap-3 transition-all">
                      View
                      {getIcon(item.type)}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Coming Soon Section */}
      <div className="bg-[#112250] text-white py-20">
        <div className="container-custom mx-auto text-center">
          <h2 className="font-playfair text-4xl font-bold mb-4 text-[#D8B893]">
            More Coming Soon
          </h2>
          <p className="font-libre text-gray-300 text-lg max-w-2xl mx-auto">
            We're constantly adding new videos, images, and immersive 360° virtual tours to help you explore our premium properties from anywhere in the world.
          </p>
        </div>
      </div>
    </div>
  );
}
