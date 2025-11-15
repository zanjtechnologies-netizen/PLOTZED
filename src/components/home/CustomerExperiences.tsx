'use client';

import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
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
    <div
      className="w-full md:w-[1000px] mx-auto rounded-2xl p-10 shadow-lg transition-all duration-700"
      style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid rgba(216,184,147,0.25)',
      }}
    >
      {/* Stars */}
      <div className="flex gap-1 mb-6">
        {[...Array(t.rating)].map((_, i) => (
          <Star
            key={i}
            className="w-5 h-5"
            style={{ color: '#D8B893', fill: '#D8B893' }}
          />
        ))}
      </div>

      {/* Comment */}
      <p
        className="leading-relaxed mb-8"
        style={{
          color: '#112250cc',
          fontFamily: 'var(--font-libre)',
          fontSize: '1.05rem',
          lineHeight: '',
        }}
      >
        "{t.comment}"
      </p>

      {/* Author */}
      <div>
        <div
          className="font-semibold"
          style={{ color: '#112250', fontFamily: 'var(--font-libre)' }}
        >
          {t.name}
        </div>
        <div
          className="text-sm mt-1"
          style={{ color: '#112250b3', fontFamily: 'var(--font-libre)' }}
        >
          {t.location}
        </div>
        <div
          className="italic text-sm mt-2"
          style={{
            color: '#D8B893',
            fontFamily: 'var(--font-playfair)',
          }}
        >
          {t.title}
        </div>
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
    const auto = setInterval(() => next(), 2000);
    return () => clearInterval(auto);
  }, []);

  return (
    <section id="customerexperiences" className="py-20 bg-[#FDFDFD]">
      <div className="container-custom text-center mb-16">
        <h2
          className="text-4xl md:text-5xl font-bold mb-4"
          style={{ color: '#112250', fontFamily: 'var(--font-playfair)' }}
        >
          Testimonials
        </h2>
        <p
          className="text-xl max-w-2xl mx-auto"
          style={{ color: '#112250b3', fontFamily: 'var(--font-libre)' }}
        >
          Hear from our distinguished guests about their unforgettable luxury escapes
        </p>
      </div>

      {/* SLIDER */}
      <div className="relative max-w-4xl mx-auto overflow-hidden">
        <div
          className="flex transition-transform duration-700"
          style={{
            transform: `translateX(-${current * 100}%)`,
          }}
        >
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="min-w-full flex justify-center"
            >
              <SlideCard t={t} />
            </div>
          ))}
        </div>

        {/* LEFT ARROW */}
        <button
          onClick={prev}
          className="absolute left-0 top-1/2 -translate-y-1/2 w-12 h-12 bg-[#112250] text-white rounded-full hidden md:flex items-center justify-center"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* RIGHT ARROW */}
        <button
          onClick={next}
          className="absolute right-0 top-1/2 -translate-y-1/2 w-12 h-12 bg-[#112250] text-white rounded-full hidden md:flex items-center justify-center"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* DOTS */}
      <div className="flex justify-center gap-3 mt-6">
        {testimonials.map((_, idx) => (
          <div
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`
              w-3 h-3 rounded-full cursor-pointer
              transition-all
              ${
                idx === current
                  ? 'bg-[#112250]'
                  : 'bg-[#11225040]'
              }
            `}
          />
        ))}
      </div>
    </section>
  );
}