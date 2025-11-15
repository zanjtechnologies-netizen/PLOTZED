'use client';

import { Play } from 'lucide-react';
import { useState } from 'react';

export default function LandscapeVideo() {
  const [isPlaying, setIsPlaying] = useState(false);

  const videoFeatures = [
    { label: 'Virtual Tours', count: '100+' },
    { label: 'HD Videos', count: '4K' },
    { label: '360° Views', count: '50+' },
    { label: 'Live Streams', count: '24/7' },
  ];

  return (
    <section id='landscapevideo' className="py-20 bg-gray-50">
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
            {!isPlaying ? (
              <>
                {/* Video Thumbnail */}
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: 'url(/images/video-thumbnail.jpg)',
                  }}
                />

                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-navy-950/30" />

                {/* Play Button */}
                <button
                  onClick={() => setIsPlaying(true)}
                  className="absolute inset-0 flex items-center justify-center group"
                >
                  <div
                    className="w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl group-hover:scale-110"
                    style={{
                      backgroundColor: '#112250',
                      boxShadow: '0 8px 24px rgba(17, 34, 80, 0.5)',
                    }}
                  >
                    <Play
                      className="w-12 h-12 ml-2"
                      fill="currentColor"
                      style={{ color: '#D8B893' }}
                    />
                  </div>
                </button>

                {/* Bottom Text Overlay */}
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
              </>
            ) : (
              <video
                className="w-full h-full object-cover"
                controls
                autoPlay
                src="/videos/landscape.mp4"
              >
                Your browser does not support the video tag.
              </video>
            )}
          </div>
        </div>

        {/* Feature Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
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
                style={{
                  color: '#D8B893',
                  fontFamily: 'var(--font-playfair)',
                }}
              >
                {feature.count}
              </div>
              <div
                className="text-sm"
                style={{
                  color: '#D8B893',
                  fontFamily: 'var(--font-libre)',
                }}
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

