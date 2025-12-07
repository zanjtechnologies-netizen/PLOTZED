import Link from 'next/link';
import { ArrowRight, Clock } from 'lucide-react';

export default function StoriesInsights() {
  const insights = [
    {
      id: '1',
      badge: 'MARKET SPOTLIGHT',
      title: 'Pondicherry White Town — A Rising Luxury Investment Destination',
      excerpt:
        'Known for its colonial heritage, seaside charm, and boutique-stay culture, White Town attracts premium buyers and investors.',
      readTime: '5 min read',
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
      image: '/images/auroville.png',
      link: '/insights/auroville-sustainable-luxury',
    },
    {
      id: '3',
      badge: 'MARKET SPOTLIGHT',
      title: 'Matrimandir — The Spiritual Heart of Auroville',
      excerpt:
        'An iconic meditation space with a distinctive golden dome, symbolizing peace, inner reflection, and human unity.',
      readTime: '5 min read',
      image: '/images/matrimandir-3.jpg',
      link: '/insights/matrimandir-spiritual-heart',
    },
  ];

  return (
    <section id="storiesinsights" className="py-10 sm:py-14 md:py-20 relative overflow-visible">
      {/* INNER GRADIENT BOX — correctly wrapping content */}
      <div
        className="rounded-xl sm:rounded-2xl md:rounded-3xl mx-auto px-4 sm:px-6 md:px-8 py-10 sm:py-12 md:py-16"
        style={{
          background:
            'linear-gradient(180deg, #112250 0%, #1a3570 40%, #2c4266 100%)',
          maxWidth: '1400px',
        }}
      >
        <div className="container-custom relative z-10">
          {/* Section Header */}
          <div className="text-center mb-10 sm:mb-12 md:mb-16">
            <h2
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 px-4"
              style={{
                color: '#D8B893',
                fontFamily: 'var(--font-playfair)',
              }}
            >
              Blogs & Stories
            </h2>
            <p
              className="text-sm sm:text-base md:text-lg lg:text-xl max-w-2xl mx-auto px-4"
              style={{
                color: 'rgba(216,184,147,0.85)',
                fontFamily: 'var(--font-libre)',
              }}
            >
              Curated articles on luxury travel, refined living, and the art of the
              perfect escape
            </p>
          </div>

          {/* Insights Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 md:gap-8 mb-8 sm:mb-10 md:mb-12">
            {insights.map((insight) => (
              <Link
                key={insight.id}
                href={insight.link}
                className="group relative rounded-2xl overflow-hidden border transition-all duration-300 hover:border-[#D8B893]/50"
                style={{
                  background: 'rgba(17, 34, 80, 0.5)',
                  backdropFilter: 'blur(14px)',
                  borderColor: 'rgba(216,184,147,0.35)',
                }}
              >
                {/* Image */}
                <div className="relative h-64 overflow-hidden">
                  <div
                    className="absolute inset-0 bg-cover bg-center transform group-hover:scale-110 transition-transform duration-700"
                    style={{ backgroundImage: `url(${insight.image})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#112250]/40 via-[#112250]/20 to-transparent" />

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
      </div>
    </section>
  );
}
