import Link from 'next/link';
import { ArrowRight, Clock } from 'lucide-react';

export default function StoriesInsights() {
  const insights = [
    {
      id: '1',
      badge: 'MARKET TRENDS',
      title: 'Top Regions to Invest in Luxury Real Estate',
      excerpt:
        'Discover emerging markets and prime locations for your next property investment.',
      readTime: '5 min read',
      image: '/images/blog-1.svg',
      link: '/insights/luxury-real-estate-trends',
    },
    {
      id: '2',
      badge: 'INTERIOR DESIGN',
      title: 'Timeless Designs That Elevate Property Value',
      excerpt:
        "Learn how classic interior design choices can significantly increase your home's worth.",
      readTime: '7 min read',
      image: '/images/blog-2.svg',
      link: '/insights/interior-design-value',
    },
    {
      id: '3',
      badge: "BUYER'S GUIDE",
      title: 'A Complete Guide to Purchasing Luxury Properties',
      excerpt:
        'Everything you need to know about buying high-end real estate with confidence.',
      readTime: '10 min read',
      image: '/images/blog-3.svg',
      link: '/insights/buying-luxury-properties',
    },
  ];

  return (
    <section id='storiesinsights'
      className="py-20 relative overflow-hidden"
      style={{ backgroundColor: '#112250' }}
    >
      {/* Subtle background glow */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 40% 10%, rgba(216,184,147,0.1), transparent 60%)',
        }}
      />

      <div className="container-custom relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{
              color: '#D8B893',
              fontFamily: 'var(--font-playfair)',
            }}
          >
            Blogs & Stories
          </h2>
          <p
            className="text-xl max-w-2xl mx-auto"
            style={{
              color: 'rgba(216,184,147,0.85)',
              fontFamily: 'var(--font-libre)',
            }}
          >
            Curated articles on luxury travel, refined living, and the art of the perfect
            escape
          </p>
        </div>

        {/* Insights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {insights.map((insight) => (
            <Link
              key={insight.id}
              href={insight.link}
              className="group relative rounded-2xl overflow-hidden border transition-all duration-300 hover:border-[#D8B893]/50"
              style={{
                background: 'rgba(255, 255, 255, 0.06)',
                backdropFilter: 'blur(14px)',
                borderColor: 'rgba(216,184,147,0.25)',
              }}
            >
              {/* Image */}
              <div className="relative h-64 overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center transform group-hover:scale-110 transition-transform duration-700"
                  style={{ backgroundImage: `url(${insight.image})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#112250] via-[#112250]/50 to-transparent" />

                {/* Badge */}
                <div className="absolute top-4 left-4">
                  <span
                    className="inline-block text-xs font-bold px-3 py-1 rounded-full"
                    style={{
                      backgroundColor: '#D8B893',
                      color: '#112250',
                      fontFamily: 'var(--font-libre)',
                    }}
                  >
                    {insight.badge}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3
                  className="text-xl font-bold mb-3 line-clamp-2 transition-colors group-hover:opacity-90"
                  style={{
                    color: '#D8B893',
                    fontFamily: 'var(--font-playfair)',
                  }}
                >
                  {insight.title}
                </h3>

                <p
                  className="mb-4 line-clamp-2"
                  style={{
                    color: 'rgba(216,184,147,0.7)',
                    fontFamily: 'var(--font-libre)',
                  }}
                >
                  {insight.excerpt}
                </p>

                {/* Meta */}
                <div className="flex items-center justify-between">
                  <div
                    className="flex items-center gap-2 text-sm"
                    style={{ color: 'rgba(216,184,147,0.6)' }}
                  >
                    <Clock className="w-4 h-4" />
                    <span>{insight.readTime}</span>
                  </div>

                  <span
                    className="font-semibold flex items-center gap-1 transition-all group-hover:gap-2"
                    style={{ color: '#D8B893' }}
                  >
                    Read More
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Link
            href="/insights"
            className="inline-block px-8 py-4 rounded-full font-semibold transition-all duration-300 hover:opacity-90"
            style={{
              backgroundColor: '#D8B893',
              color: '#112250',
              border: '1px solid rgba(216,184,147,0.5)',
              backdropFilter: 'blur(8px)',
              fontFamily: 'var(--font-libre)',
            }}
          >
            View All Articles
          </Link>
        </div>
      </div>
    </section>
  );
}

