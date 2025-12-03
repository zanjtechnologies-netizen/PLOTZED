'use client';

import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Testimonial {
  id: number;
  name: string;
  location: string;
  title: string;
  rating: number;
  comment: string;
}

const SlideCard = ({ t }: { t: Testimonial }) => {
  return (
    <div className="w-full md:w-[900px] mx-auto relative">
      {/* Decorative Quote Mark - Top Left */}
      <div className="absolute -top-6 -left-4 md:-left-8 z-10">
        <Quote
          className="w-16 h-16 md:w-20 md:h-20 opacity-20"
          style={{ color: '#D8B893', fill: '#D8B893', transform: 'rotate(180deg)' }}
        />
      </div>

      {/* Main Card */}
      <div
        className="relative rounded-3xl p-8 md:p-12 shadow-2xl transition-all duration-500 hover:shadow-[0_20px_60px_rgba(17,34,80,0.3)] hover:-translate-y-1"
        style={{
          background: 'linear-gradient(135deg, #FFFFFF 0%, #F8F9FA 100%)',
          border: '2px solid rgba(216,184,147,0.3)',
        }}
      >
        {/* Accent Border */}
        <div
          className="absolute left-0 top-8 bottom-8 w-1 rounded-full"
          style={{ backgroundColor: '#D8B893' }}
        />

        {/* Stars */}
        <div className="flex gap-1 mb-6 ml-6">
          {[...Array(t.rating)].map((_, i) => (
            <Star
              key={i}
              className="w-6 h-6"
              style={{ color: '#D8B893', fill: '#D8B893' }}
            />
          ))}
        </div>

        {/* Comment */}
        <p
          className="text-xl md:text-2xl leading-relaxed mb-8 ml-6"
          style={{
            color: '#112250',
            fontFamily: 'var(--font-libre)',
            fontStyle: 'italic',
            lineHeight: '1.8',
          }}
        >
          "{t.comment}"
        </p>

        {/* Author Section */}
        <div className="flex items-center gap-4 ml-6">
          {/* Avatar Circle */}
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center text-white text-xl font-bold"
            style={{
              background: 'linear-gradient(135deg, #112250 0%, #1a3570 100%)',
            }}
          >
            {t.name.charAt(0)}
          </div>

          {/* Author Info */}
          <div>
            <div
              className="font-bold text-lg"
              style={{ color: '#112250', fontFamily: 'var(--font-playfair)' }}
            >
              {t.name}
            </div>
            <div
              className="text-sm"
              style={{ color: '#112250b3', fontFamily: 'var(--font-libre)' }}
            >
              {t.location}
            </div>
            <div
              className="text-sm font-semibold mt-1"
              style={{
                color: '#D8B893',
                fontFamily: 'var(--font-libre)',
              }}
            >
              {t.title}
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Quote Mark - Bottom Right */}
      <div className="absolute -bottom-6 -right-4 md:-right-8">
        <Quote
          className="w-16 h-16 md:w-20 md:h-20 opacity-20"
          style={{ color: '#D8B893', fill: '#D8B893' }}
        />
      </div>
    </div>
  );
};

export default function CustomerExperiences() {
  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: 'Arun Raj',
      location: 'Chennai',
      title: 'Investor, Casuarina Greens',
      rating: 5,
      comment:
        'Plotzed transformed my investment into a peaceful escape. The lush surroundings and guided process made it feel effortless.',
    },
    {
      id: 2,
      name: 'Priya Sharma',
      location: 'Bengaluru',
      title: 'Homeowner, Coastal Estates',
      rating: 5,
      comment:
        'The Plotzed team made every step seamless — Transparent, professional, and supportive throughout.',
    },
    {
      id: 3,
      name: 'Prakash Raj',
      location: 'Singapore',
      title: 'Investor, Urban Enclave',
      rating: 5,
      comment:
        'As an investor, I appreciated the clear communication and detailed updates. Real estate felt both modern and meaningful.',
    },
  ];

  const [current, setCurrent] = useState(0);

  const next = () => {
    setCurrent((prev) => (prev + 1) % testimonials.length);
  };

  const prev = () => {
    setCurrent((prev) =>
      prev === 0 ? testimonials.length - 1 : prev - 1
    );
  };

  // Auto slide
  useEffect(() => {
    const auto = setInterval(() => next(), 5000);
    return () => clearInterval(auto);
  }, []);

  return (
    <section
      id="customerexperiences"
      className="py-24 relative overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #112250 0%, #1a3570 100%)',
      }}
    >
      {/* Subtle Background Pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(216,184,147,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(216,184,147,0.3) 0%, transparent 50%)',
        }}
      />

      <div className="container-custom text-center mb-20 relative z-10">
        <h2
          className="text-4xl md:text-5xl font-bold mb-4 text-white"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          Testimonials
        </h2>
        <div className="w-24 h-1 mx-auto mb-6" style={{ backgroundColor: '#D8B893' }} />
        <p
          className="text-xl max-w-2xl mx-auto"
          style={{ color: 'rgba(255,255,255,0.85)', fontFamily: 'var(--font-libre)' }}
        >
          Hear from our distinguished clients about their exceptional experiences
        </p>
      </div>

      {/* SLIDER */}
      <div className="relative max-w-5xl mx-auto overflow-hidden px-4 md:px-0">
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{
            transform: `translateX(-${current * 100}%)`,
          }}
        >
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="min-w-full flex justify-center py-8"
            >
              <SlideCard t={t} />
            </div>
          ))}
        </div>

        {/* LEFT ARROW */}
        <button
          onClick={prev}
          className="absolute left-0 md:-left-6 top-1/2 -translate-y-1/2 w-14 h-14 text-white rounded-full hover:opacity-90 transition-all duration-300 flex items-center justify-center shadow-lg hover:scale-110"
          style={{ backgroundColor: '#112250' }}
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* RIGHT ARROW */}
        <button
          onClick={next}
          className="absolute right-0 md:-right-6 top-1/2 -translate-y-1/2 w-14 h-14 text-white rounded-full hover:opacity-90 transition-all duration-300 flex items-center justify-center shadow-lg hover:scale-110"
          style={{ backgroundColor: '#112250' }}
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* DOTS */}
      <div className="flex justify-center gap-3 mt-12 relative z-10">
        {testimonials.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`
              h-3 rounded-full cursor-pointer transition-all duration-300
              ${idx === current
                ? 'w-12 bg-[#D8B893]'
                : 'w-3 bg-white/30 hover:bg-white/50'
              }
            `}
          />
        ))}
      </div>
    </section>
  );
}