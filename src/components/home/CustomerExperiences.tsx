'use client';

import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

export default function CustomerExperiences() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: 'Arun Raj',
      location: 'Chennai',
      title: 'Investor, Casuarina Greens',
      rating: 5,
      comment:
        'Plotzed transformed my investment into a peaceful escape. The lush surroundings and guided process made it feel effortless. I now own a property that brings both value and serenity.',
    },
    {
      id: 2,
      name: 'Priya Sharma',
      location: 'Bengaluru',
      title: 'Homeowner, Coastal Estates',
      rating: 5,
      comment:
        'The Plotzed team made every step seamless — from virtual tours to final registration. Transparent, professional, and supportive throughout. I couldn’t have asked for a smoother experience.',
    },
    {
      id: 3,
      name: 'Prakash Raj',
      location: 'Singapore',
      title: 'Investor, Urban Enclave',
      rating: 5,
      comment:
        'As an investor, I appreciated the clear communication and detailed updates. The property exceeded expectations in design and returns. Plotzed made real estate feel both modern and meaningful.',
    },
  ];

  const visibleTestimonials = testimonials.slice(currentIndex, currentIndex + 3);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : testimonials.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < testimonials.length - 1 ? prev + 1 : 0));
  };

  return (
    <section className="py-20" style={{ backgroundColor: '#FDFDFD' }}>
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{ color: '#112250', fontFamily: 'var(--font-playfair)' }}
          >
            Customer Experiences
          </h2>
          <p
            className="text-xl max-w-2xl mx-auto"
            style={{ color: '#112250b3', fontFamily: 'var(--font-libre)' }}
          >
            Hear from our distinguished guests about their unforgettable luxury escapes
          </p>
        </div>

        {/* Testimonials */}
        <div className="relative max-w-6xl mx-auto">
          {/* Navigation Buttons */}
          <button
            onClick={handlePrevious}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-16 w-12 h-12 bg-[#112250] text-white rounded-full flex items-center justify-center hover:opacity-80 transition-all z-10 hidden lg:flex"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-16 w-12 h-12 bg-[#112250] text-white rounded-full flex items-center justify-center hover:opacity-80 transition-all z-10 hidden lg:flex"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {visibleTestimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="rounded-2xl p-8 transition-all duration-300 shadow-md hover:shadow-lg"
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid rgba(216,184,147,0.25)',
                }}
              >
                {/* Rating Stars */}
                <div className="flex items-center gap-1 mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5"
                      style={{ color: '#D8B893', fill: '#D8B893' }}
                    />
                  ))}
                </div>

                {/* Comment */}
                <p
                  className="mb-8 leading-relaxed"
                  style={{
                    color: '#112250cc',
                    fontFamily: 'var(--font-libre)',
                    fontSize: '1.05rem',
                    lineHeight: '1.8',
                  }}
                >
                  "{testimonial.comment}"
                </p>

                {/* Author */}
                <div>
                  <div
                    className="font-semibold"
                    style={{
                      color: '#112250',
                      fontFamily: 'var(--font-libre)',
                    }}
                  >
                    {testimonial.name}
                  </div>
                  <div
                    className="text-sm mt-1"
                    style={{
                      color: '#112250b3',
                      fontFamily: 'var(--font-libre)',
                    }}
                  >
                    {testimonial.location}
                  </div>
                  <div
                    className="italic text-sm mt-1"
                    style={{
                      color: '#D8B893',
                      fontFamily: 'var(--font-playfair)',
                    }}
                  >
                    {testimonial.title}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile Navigation */}
          <div className="flex lg:hidden items-center justify-center gap-4 mt-8">
            <button
              onClick={handlePrevious}
              className="w-12 h-12 bg-[#112250] text-white rounded-full flex items-center justify-center hover:opacity-80 transition-all"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={handleNext}
              className="w-12 h-12 bg-[#112250] text-white rounded-full flex items-center justify-center hover:opacity-80 transition-all"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Stats Bar */}
        <div
          className="mt-16 rounded-2xl p-8"
          style={{ backgroundColor: '#112250' }}
        >
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 text-center">
            <div>
              <div
                className="text-4xl font-bold mb-2"
                style={{ color: '#D8B893', fontFamily: 'var(--font-playfair)' }}
              >
                4.9
              </div>
              <div
                className="text-sm"
                style={{ color: '#D8B893cc', fontFamily: 'var(--font-libre)' }}
              >
                Average Rating
              </div>
            </div>
            <div>
              <div
                className="text-4xl font-bold mb-2"
                style={{ color: '#D8B893', fontFamily: 'var(--font-playfair)' }}
              >
                150+
              </div>
              <div
                className="text-sm"
                style={{ color: '#D8B893cc', fontFamily: 'var(--font-libre)' }}
              >
                Happy Guests
              </div>
            </div>
            <div>
              <div
                className="text-4xl font-bold mb-2"
                style={{ color: '#D8B893', fontFamily: 'var(--font-playfair)' }}
              >
                98%
              </div>
              <div
                className="text-sm"
                style={{ color: '#D8B893cc', fontFamily: 'var(--font-libre)' }}
              >
                Would Return
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
