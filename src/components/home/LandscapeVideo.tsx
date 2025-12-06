'use client';

import { useState } from 'react';

export default function LandscapeVideo() {
  const videoFeatures = [
    { label: 'Virtual Tours', count: '100+' },
    { label: 'HD Videos', count: '4K' },
    { label: 'Images', count: '50+' },
  ];

  return (
    <section id="landscapevideo" className="py-20 bg-gray-50">
      <div className="container-custom">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{ color: '#112250', fontFamily: 'var(--font-playfair)' }}
          >
            Experience the Landscape
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Take a virtual journey through breathtaking properties and stunning locations
          </p>
        </div>

        {/* Video Container */}
        <div className="relative max-w-6xl mx-auto mb-8">
          <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl">

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
            <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-navy-950/80 to-transparent">
              <h3
                className="text-3xl font-bold mb-2"
                style={{ color: '#FFFFFF', fontFamily: 'var(--font-playfair)' }}
              >
                Experience The Estate Beyond
              </h3>
              <p className="text-lg text-gray-300">
                Explore luxury properties from the comfort of your home
              </p>
            </div>
          </div>
        </div>

        {/* Feature Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-4xl mx-auto mt-10">
          {videoFeatures.map((feature, index) => (
            <button
              key={index}
              className="bg-navy-900 px-6 py-4 rounded-xl transition-all duration-300 hover:bg-navy-800"
              style={{
                border: '1px solid rgba(216,184,147,0.3)',
                color: '#D8B893',
              }}
            >
              <div
                className="text-2xl font-bold mb-1"
                style={{ color: '#D8B893', fontFamily: 'var(--font-playfair)' }}
              >
                {feature.count}
              </div>
              <div
                className="text-sm"
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