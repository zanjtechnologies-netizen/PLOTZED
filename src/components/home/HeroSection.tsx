'use client';

export default function HeroSection() {
  return (
    <section
      id="herosection"
      className="relative flex items-center justify-center"
      style={{ height: '775.2px', minHeight: '775.2px', paddingTop: '80px' }}
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              'linear-gradient(180deg, rgba(17, 34, 80, 0.3) 0%, rgba(17, 34, 80, 0.2) 50%, rgba(17, 34, 80, 0.3) 100%), url(/images/hero-bg-63da63.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 container-custom text-center px-4">
        <div className="max-w-4xl mx-auto">
          {/* Main Heading */}
          <h1
            className="font-bold mb-5 md:mb-6 text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[80px] 2xl:text-[90px]"
            style={{ fontFamily: 'var(--font-playfair)', lineHeight: '1.2' }}
          >
            Discover Your Perfect
            <br />
            <span className="text-white">Luxury Escape</span>
          </h1>

          {/* Subheading */}
          <p
            className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl mb-10 max-w-3xl mx-auto px-2 sm:px-4"
            style={{ color: '#E9EFFF' }}
          >
            Immerse yourself in unparalleled comfort and sophistication with our curated selection
            of premier properties
          </p>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-white/50 flex items-start justify-center p-2">
          <div className="w-1 h-3 rounded-full bg-teal-400" />
        </div>
      </div>
    </section>
  );
}
