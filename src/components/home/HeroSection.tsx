'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';

export default function HeroSection() {
  const [activeTab, setActiveTab] = useState('buy');
  const propertyTypes = ['Buy', 'Rent', 'Sell'];

  return (
    <section
      id="herosection"
      className="relative flex items-center justify-center pt-[120px] md:pt-[140px]"
      style={{ height: '775.2px', minHeight: '775.2px' }}
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              'linear-gradient(180deg, rgba(17, 34, 80, 0.7) 0%, rgba(17, 34, 80, 0.5) 50%, rgba(17, 34, 80, 0.8) 100%), url(/images/hero-bg-fallback-1.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 container-custom text-center">
        <div className="max-w-4xl mx-auto">
          {/* Centered Logo (from Figma) */}
          <div className="mb-8 flex justify-center">
            <img src="/images/hero-logo.svg" alt="Plotzed Mark" className="h-24 w-auto" />
          </div>

          {/* Main Heading */}
          <h1
            className="font-bold mb-6 text-white"
            style={{ fontFamily: 'var(--font-playfair)', fontSize: '80px', lineHeight: '1.2' }}
          >
            Discover Your Perfect
            <br />
            <span className="text-white">Luxury Escape</span>
          </h1>

          {/* Subheading */}
          <p
            className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto"
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
