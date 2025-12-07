'use client';

import Link from 'next/link';
import { ArrowRight, Clock, Calendar } from 'lucide-react';
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

export default function InsightsPage() {
  const articles = [
    {
      id: '1',
      badge: 'MARKET SPOTLIGHT',
      title: 'Pondicherry White Town — A Rising Luxury Investment Destination',
      excerpt:
        'Known for its colonial heritage, seaside charm, and boutique-stay culture, White Town attracts premium buyers and investors.',
      readTime: '5 min read',
      date: 'Nov 30, 2025',
      image: '/images/white-town-1.jpg',
      link: '/insights/white-town-luxury-investment',
    },
    {
      id: '2',
      badge: 'MARKET SPOTLIGHT',
      title: 'Auroville — An Emerging Hub for Sustainable Luxury Living',
      excerpt:
        'Known for its greenery, peaceful environment, and global culture, Auroville attracts conscious investors seeking lifestyle value.',
      readTime: '5 min read',
      date: 'Nov 30, 2025',
      image: '/images/auroville-1.jpg',
      link: '/insights/auroville-sustainable-luxury',
    },
    {
      id: '3',
      badge: 'MARKET SPOTLIGHT',
      title: 'Matrimandir — The Spiritual Heart of Auroville',
      excerpt:
        'An iconic meditation space with a distinctive golden dome, symbolizing peace, inner reflection, and human unity.',
      readTime: '5 min read',
      date: 'Nov 30, 2025',
      image: '/images/matrimandir-3.jpg',
      link: '/insights/matrimandir-spiritual-heart',
    },
  ];

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
              <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="font-medium">Back to Home</span>
            </Link>
          </div>

          <div className="text-center">
            <h1 className="font-playfair text-5xl md:text-6xl font-bold mb-6 text-[#D8B893]">
              Blogs & Stories
            </h1>
            <p className="font-libre text-xl text-gray-300 max-w-2xl mx-auto">
              Curated articles on luxury travel, refined living, and the art of the perfect escape
            </p>
          </div>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="container-custom mx-auto py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articles.map((article) => (
            <Link
              key={article.id}
              href={article.link}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col"
            >
              {/* Image */}
              <div className="relative h-64 overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center transform group-hover:scale-110 transition-transform duration-700"
                  style={{ backgroundImage: `url(${article.image})` }}
                />
                <div className="absolute top-4 left-4">
                  <span className="inline-block text-xs font-bold px-3 py-1 rounded-full bg-[#D8B893] text-[#112250] font-libre">
                    {article.badge}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-8 flex-grow flex flex-col">
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4 font-libre">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{article.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{article.readTime}</span>
                  </div>
                </div>

                <h3 className="font-playfair text-2xl font-bold text-[#112250] mb-3 group-hover:text-[#D8B893] transition-colors">
                  {article.title}
                </h3>

                <p className="font-libre text-gray-600 mb-6 flex-grow leading-relaxed">
                  {article.excerpt}
                </p>

                <div className="flex items-center gap-2 text-[#112250] font-semibold group-hover:gap-3 transition-all">
                  Read Article
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
