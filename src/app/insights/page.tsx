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
      badge: 'CULTURAL DISCOVERY',
      title: 'Mediterranean Coastal Heritage',
      excerpt:
        'Discover the rich cultural tapestry of ancient coastal villages, pristine beaches, and timeless Mediterranean charm.',
      readTime: '8 min read',
      date: 'Nov 26, 2025',
      image: '/images/blog-1.jpg',
      link: '/insights/mediterranean-coastal-heritage',
    },
    {
      id: '2',
      badge: 'INTERIOR DESIGN',
      title: 'Timeless Designs That Elevate Property Value',
      excerpt:
        "Learn how classic interior design choices can significantly increase your home's worth.",
      readTime: '7 min read',
      date: 'Nov 20, 2025',
      image: '/images/blog-2.jpg',
      link: '/insights/interior-design-value',
    },
    {
      id: '3',
      badge: "BUYER'S GUIDE",
      title: 'A Complete Guide to Purchasing Luxury Properties',
      excerpt:
        'Everything you need to know about buying high-end real estate with confidence.',
      readTime: '10 min read',
      date: 'Nov 15, 2025',
      image: '/images/blog-3.jpg',
      link: '/insights/buying-luxury-properties',
    },
  ];

  return (
    <div className={`min-h-screen bg-[#F9FAFB] ${playfair.variable} ${libre.variable}`}>
      {/* Header */}
      <div className="bg-[#112250] text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/hero-bg.jpg')] bg-cover bg-center opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#112250]/80 to-[#112250]" />
        
        <div className="container-custom mx-auto relative z-10 text-center">
          <h1 className="font-playfair text-5xl md:text-6xl font-bold mb-6 text-[#D8B893]">
            Insights & Stories
          </h1>
          <p className="font-libre text-xl text-gray-300 max-w-2xl mx-auto">
            Curated articles on luxury travel, refined living, and the art of the perfect escape
          </p>
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
