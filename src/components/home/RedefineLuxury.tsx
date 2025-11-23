export default function RedefineLuxury() {
  const images = [
    { src: '/images/luxury-1.jpg', alt: 'Luxury interior' },
    { src: '/images/luxury-2.jpg', alt: 'Premium amenities' },
    { src: '/images/luxury-3.jpg', alt: 'Elegant design' },
    { src: '/images/luxury-4.jpg', alt: 'Modern architecture' },
  ];

  const stats = [
    { value: '15+', label: 'Years of Excellence' },
    { value: '200+', label: 'Luxury Properties' },
    { value: '150+', label: 'Global Destinations' },
    { value: '98%', label: 'Client Satisfaction' },
  ];

  return (
    <section id="redefineluxury" className="py-20" style={{ backgroundColor: '#FFFFFF' }}>
      <div className="container-custom">
        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div>
            {/* Small Intro Label */}
            <p
              className="uppercase tracking-widest mb-4 text-sm font-semibold"
              style={{ color: '#D8B893', fontFamily: 'var(--font-libre)' }}
            >
              About Plotzed
            </p>

            {/* Title */}
            <h2
              className="text-4xl md:text-5xl font-bold mb-6 leading-tight"
              style={{
                color: '#112250',
                fontFamily: 'var(--font-playfair)',
              }}
            >
              Redefining Luxury
              <br />
              <span
                style={{
                  color: '#D8B893',
                  fontFamily: 'var(--font-playfair)',
                }}
              >
                Real Estate
              </span>
            </h2>

            {/* Description */}
            <p
              className="text-lg mb-6 leading-relaxed"
              style={{
                color: '#112250cc',
                fontFamily: 'var(--font-libre)',
              }}
            >
              For over 15 years, Plotzed Real Estate Developers has been a trusted name in premium
              property development — curating exceptional residential plots, estates, and villas
              across South India's most promising destinations.
            </p>

            <p
              className="text-lg mb-8 leading-relaxed"
              style={{
                color: '#112250cc',
                fontFamily: 'var(--font-libre)',
              }}
            >
              Our vision goes beyond selling land — we craft opportunities where modern design meets
              natural harmony, creating spaces that inspire both living and investment. Every
              project is carefully planned to deliver high value, long-term growth, and a lifestyle
              rooted in sustainability.
            </p>

            <p
              className="text-lg mb-8 leading-relaxed"
              style={{
                color: '#112250cc',
                fontFamily: 'var(--font-libre)',
              }}
            >
              We combine expertise, transparency, and design-driven development to deliver
              unmatched value.
            </p>

            {/* Core Values */}
            <ul className="space-y-4">
              {[
                {
                  title: 'Excellence',
                  desc: 'Unwavering commitment to the highest standards',
                },
                {
                  title: 'Authenticity',
                  desc: 'Verified and Approved Land Titles',
                },
                {
                  title: 'Sustainability',
                  desc: 'Eco-friendly Development',
                },
                {
                  title: 'Client Trust',
                  desc: '98% Satisfaction',
                },
              ].map((item, index) => (
                <li key={index} className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: '#D8B893' }}
                    />
                    <span
                      className="font-semibold"
                      style={{
                        color: '#112250',
                        fontFamily: 'var(--font-libre)',
                      }}
                    >
                      {item.title}
                    </span>
                  </div>
                  <p
                    className="ml-5 text-sm"
                    style={{
                      color: '#112250b3',
                      fontFamily: 'var(--font-libre)',
                    }}
                  >
                    {item.desc}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Images Grid */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              {images.map((image, index) => (
                <div
                  key={index}
                  className={`relative rounded-2xl overflow-hidden shadow-lg ${
                    index === 0 ? 'col-span-2 h-64' : 'h-48'
                  }`}
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center hover:scale-105 transition-transform duration-500"
                    style={{
                      backgroundImage: `url(${image.src})`,
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Divider Line */}
        <div
          className="my-16"
          style={{
            height: '1px',
            backgroundColor: 'rgba(216,184,147,0.3)',
          }}
        />

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, index) => (
            <div key={index}>
              <div
                className="text-5xl font-bold mb-2"
                style={{
                  color: '#8B5E3C',
                  fontFamily: 'var(--font-playfair)',
                }}
              >
                {stat.value}
              </div>
              <div
                className="text-base"
                style={{
                  color: '#112250',
                  fontFamily: 'var(--font-libre)',
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
