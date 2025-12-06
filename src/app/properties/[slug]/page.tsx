'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft,
  Share2,
  X,
  MapPin,
  MessageCircle,
  Link as LinkIcon,
  Check,
  Phone
} from 'lucide-react';

import { Playfair_Display, Libre_Baskerville, Inter } from 'next/font/google';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
});

const libre = Libre_Baskerville({
  weight: ['400', '700'],
  variable: '--font-libre',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export default function DynamicPropertyPage() {
  const { slug } = useParams();
  const [plot, setPlot] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  const phoneNumber = '7708594263';

  // Fetch plot details by slug
  useEffect(() => {
    if (!slug) return;

    async function loadPlot() {
      try {
        const res = await fetch(`/api/plots/search?slug=${slug}`);
        const data = await res.json();

        if (data.success && data.data?.plots?.length > 0) {
          setPlot(data.data.plots[0]);
        }

      } catch (error) {
        console.error("Failed to load plot:", error);
      }

      setLoading(false);
    }

    loadPlot();
  }, [slug]);

  // Share handlers
  const handleShare = (platform: string) => {
    const url = window.location.href;
    const title = `${plot.title} - Plotzed`;
    const text = `Check out this amazing property: ${plot.title}`;

    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank');
        break;
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        break;
    }
    setShowShareMenu(false);
  };


  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-[#112250] text-xl">
        Loading property...
      </div>
    );
  }

  if (!plot) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-600 text-xl">
        Property not found.
      </div>
    );
  }

  return (
    <main className={`${playfair.variable} ${libre.variable} ${inter.variable} bg-[#F8F9FA] min-h-screen`}>

      {/* HERO SECTION */}
      <section className="relative h-[85vh] w-full overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${plot.images?.[0] || "/images/placeholder.png"})`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />
        </div>

        {/* Nav */}
        <div className="absolute top-0 left-0 right-0 z-50 p-8 mt-24">
          <div className="container-custom flex justify-between items-center">

            <Link
              href="/properties"
              className="flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-md rounded-full text-white border"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Properties</span>
            </Link>

            <div className="flex gap-3 relative">
              <div className="relative">
                <button
                  onClick={() => setShowShareMenu(!showShareMenu)}
                  className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full text-white flex items-center justify-center border hover:bg-white/20 transition"
                >
                  <Share2 className="w-4 h-4" />
                </button>

                {/* Share Menu */}
                {showShareMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg overflow-hidden z-50">
                    <button
                      onClick={() => handleShare('facebook')}
                      className="w-full px-4 py-3 text-left hover:bg-gray-100 flex items-center gap-3 text-gray-700"
                    >
                      <Share2 className="w-4 h-4" />
                      <span>Facebook</span>
                    </button>
                    <button
                      onClick={() => handleShare('twitter')}
                      className="w-full px-4 py-3 text-left hover:bg-gray-100 flex items-center gap-3 text-gray-700"
                    >
                      <Share2 className="w-4 h-4" />
                      <span>Twitter</span>
                    </button>
                    <button
                      onClick={() => handleShare('whatsapp')}
                      className="w-full px-4 py-3 text-left hover:bg-gray-100 flex items-center gap-3 text-gray-700"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>WhatsApp</span>
                    </button>
                    <button
                      onClick={() => handleShare('copy')}
                      className="w-full px-4 py-3 text-left hover:bg-gray-100 flex items-center gap-3 text-gray-700"
                    >
                      {copied ? <Check className="w-4 h-4 text-green-600" /> : <LinkIcon className="w-4 h-4" />}
                      <span>{copied ? 'Copied!' : 'Copy Link'}</span>
                    </button>
                  </div>
                )}
              </div>

              <Link href="/" className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full text-white flex items-center justify-center border hover:bg-white/20 transition">
                <X className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Hero Text */}
        <div className="absolute bottom-0 left-0 right-0 pb-24 z-40">
          <div className="container-custom max-w-4xl">

            <h1 className="text-6xl font-bold text-white mb-4">
              {plot.title}
            </h1>

            <div className="flex items-center gap-2 text-white/90 mb-6">
              <MapPin className="w-5 h-5 text-[#D8B893]" />
              <span>{plot.address}, {plot.city}, {plot.state}</span>
            </div>

            <div className="px-8 py-3 bg-[#112250] text-[#D8B892] rounded-full text-xl font-semibold w-fit">
              From ₹{plot.price?.toLocaleString()}
            </div>

          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="py-20">
        <div className="container-custom grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* LEFT CONTENT */}
          <div className="lg:col-span-8 space-y-12">

            {/* Description */}
            <div>
              <h2 className="text-4xl font-bold text-[#112250] mb-6">
                Property Overview
              </h2>

              <p className="text-lg text-gray-700 leading-relaxed">
                {plot.description || "No description available."}
              </p>
            </div>

            {/* Gallery */}
            {plot.images && plot.images.length >= 3 && (
              <div>
                <h3 className="text-3xl font-bold text-[#112250] mb-6">
                  Gallery
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Image 1 - Start from images[1] to avoid duplicating cover */}
                  <div className="h-[350px] rounded-lg overflow-hidden relative">
                    <Image
                      src={plot.images[1]}
                      alt={`${plot.title} - Image 1`}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Image 2 */}
                  <div className="h-[350px] rounded-lg overflow-hidden relative">
                    <Image
                      src={plot.images[2]}
                      alt={`${plot.title} - Image 2`}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Image 3 - Optional, only if exists */}
                  {plot.images[3] && (
                    <div className="md:col-span-2 h-[400px] rounded-lg overflow-hidden relative">
                      <Image
                        src={plot.images[3]}
                        alt={`${plot.title} - Image 3`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>

          {/* RIGHT SIDEBAR */}
          <div className="lg:col-span-4">
            <div className="bg-[#112250] text-white rounded-2xl p-8 sticky top-8">
              {/* Location */}
              <div className="mb-6">
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">LOCATION</p>
                <h3 className="text-xl font-bold text-white">
                  {plot.address}
                </h3>
              </div>

              {/* Pricing */}
              <div className="text-center mb-8">
                <div className="text-[#D8B893] text-5xl font-bold mb-2">
                  From ₹{(plot.price / 10000000).toFixed(2)} Cr
                </div>
                <p className="text-sm text-gray-300">Exclusive pre-launch value</p>
              </div>

              {/* Property Details */}
              <div className="space-y-3 mb-6 border-t border-white/20 pt-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Plot Size</span>
                  <span className="font-semibold">{plot.plot_size} sq ft</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Facing</span>
                  <span className="font-semibold">{plot.facing || 'N/A'}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Status</span>
                  <span className="font-semibold">{plot.status}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Location</span>
                  <span className="font-semibold">{plot.city}</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="space-y-3">
                <Link
                  href="/visit"
                  className="w-full py-4 bg-[#D8B893] text-[#112250] rounded-full font-bold text-sm uppercase tracking-wider hover:bg-[#C9A883] transition flex items-center justify-center"
                >
                  BOOK A SITE VISIT
                </Link>

                <a
                  href={`tel:${phoneNumber}`}
                  className="w-full py-4 bg-white rounded-full font-bold text-sm uppercase tracking-wider hover:bg-[#4B5B8A] transition flex items-center justify-center gap-2"
                >
                  <Phone className="w-4 h-4" />
                  <span>CALL US - {phoneNumber}</span>
                </a>

                <button className="w-full py-4 bg-[#3B4B7A] rounded-full font-bold text-sm uppercase tracking-wider hover:bg-[#4B5B8A] transition">
                  DOWNLOAD BROCHURE
                </button>
              </div>

              {/* Payment Info */}
              <div className="mt-6 pt-6 border-t border-white/20 text-center">
                <p className="text-xs text-gray-400">Flexible payment plans available</p>
                <p className="text-xs text-gray-400">Loan assistance available</p>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="bg-[#112250] py-20">
        <div className="container-custom text-center">
          <h2 className="text-5xl font-bold text-white mb-6">
            Ready to Own Your Ideal Land?
          </h2>

          <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto">
            Connect with our property experts for a personalized guided visit, investment insights, and exclusive pre-launch offers.
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/visit"
              className="px-8 py-4 bg-[#D8B893] text-[#112250] rounded-full font-bold text-sm uppercase tracking-wider hover:bg-[#C9A883] transition"
            >
              Book a site visit
            </Link>

            <Link href="/properties" className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-full font-bold text-sm uppercase tracking-wider hover:bg-white hover:text-[#112250] transition">
              View More Properties
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}