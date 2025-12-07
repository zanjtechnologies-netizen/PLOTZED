'use client';

import { useState } from 'react';

export default function LandscapeVideo() {
  const videoFeatures = [
    { label: 'Virtual Tours', count: '100+' },
    { label: 'HD Videos', count: '4K' },
    { label: 'Images', count: '50+' },
  ];

  return (
    <section id="landscapevideo" className="py-10 sm:py-14 md:py-20 bg-gray-50">
      <div className="container-custom px-4">

        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          <h2
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4"
            style={{ color: '#112250', fontFamily: 'var(--font-playfair)' }}
          >
            Experience the Landscape
          </h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto px-4">
            Take a virtual journey through breathtaking properties and stunning locations
          </p>
        </div>

        {/* Video Container */}
        <div className="relative max-w-6xl mx-auto mb-6 sm:mb-8">
          <div className="relative aspect-video rounded-lg sm:rounded-2xl md:rounded-3xl overflow-hidden shadow-xl sm:shadow-2xl">

            {/* Auto_play Video */}
            <video
              className="w-full h-full object-cover"
              autoPlay
              loop
              muted
              playsInline
              src="/videos/main-1.mp4"
            >
              Your browser does not support the video tag.
            </video>

            {/* Bottom Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8 bg-gradient-to-t from-navy-950/90 via-navy-950/50 to-transparent">
              <h3
                className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-1 sm:mb-2"
                style={{ color: '#FFFFFF', fontFamily: 'var(--font-playfair)' }}
              >
                Experience The Estate Beyond
              </h3>
              <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-300">
                Explore luxury properties from the comfort of your home
              </p>
            </div>
          </div>
        </div>

        {/* Feature Stats */}
        <div className="grid grid-cols-3 md:grid-cols-3 gap-3 sm:gap-6 md:gap-8 lg:gap-12 max-w-4xl mx-auto mt-6 sm:mt-8 md:mt-10">
          {videoFeatures.map((feature, index) => (
            <button
              key={index}
              className="bg-navy-900 px-3 sm:px-4 md:px-6 py-3 sm:py-4 rounded-lg sm:rounded-xl transition-all duration-300 hover:bg-navy-800"
              style={{
                border: '1px solid rgba(216,184,147,0.3)',
                color: '#D8B893',
              }}
            >
              <div
                className="text-lg sm:text-xl md:text-2xl font-bold mb-0.5 sm:mb-1"
                style={{ color: '#D8B893', fontFamily: 'var(--font-playfair)' }}
              >
                {feature.count}
              </div>
              <div
                className="text-xs sm:text-sm"
                style={{ color: '#D8B893', fontFamily: 'var(--font-libre)' }}
              >
                {feature.label}
              </div>
            </button>
          ))}
        </div>

      </div>
    </section>
  );
}