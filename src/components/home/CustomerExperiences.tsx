'use client';

import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full md:w-[900px] mx-auto relative"
    >
      {/* Decorative Quote Mark - Top Left */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5, rotate: 180 }}
        animate={{ opacity: 0.2, scale: 1, rotate: 180 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="absolute -top-6 -left-4 md:-left-8 z-10"
      >
        <Quote
          className="w-16 h-16 md:w-20 md:h-20"
          style={{ color: '#D8B893', fill: '#D8B893' }}
        />
      </motion.div>

      {/* Main Card */}
      <motion.div
        whileHover={{ y: -4, scale: 1.01 }}
        transition={{ duration: 0.3 }}
        className="relative rounded-3xl p-6 sm:p-8 md:p-12 shadow-2xl transition-all duration-500 hover:shadow-[0_25px_70px_rgba(17,34,80,0.35)] bg-white/95 backdrop-blur-sm"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,249,250,0.95) 100%)',
          border: '2px solid rgba(216,184,147,0.3)',
        }}
      >
        {/* Accent Border */}
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: '100%' }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="absolute left-0 top-0 bottom-0 w-1 rounded-l-3xl"
          style={{ backgroundColor: '#D8B893' }}
        />

        {/* Stars with Stagger Animation */}
        <motion.div
          className="flex gap-1 mb-4 sm:mb-6 ml-4 sm:ml-6"
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.1,
                delayChildren: 0.4
              }
            }
          }}
        >
          {[...Array(t.rating)].map((_, i) => (
            <motion.div
              key={i}
              variants={{
                hidden: { opacity: 0, scale: 0 },
                visible: { opacity: 1, scale: 1 }
              }}
            >
              <Star
                className="w-5 h-5 sm:w-6 sm:h-6"
                style={{ color: '#D8B893', fill: '#D8B893' }}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Comment with Fade In */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-lg sm:text-xl md:text-2xl leading-relaxed mb-6 sm:mb-8 ml-4 sm:ml-6"
          style={{
            color: '#112250',
            fontFamily: 'var(--font-libre)',
            fontStyle: 'italic',
            lineHeight: '1.8',
          }}
        >
          "{t.comment}"
        </motion.p>

        {/* Author Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex items-center gap-3 sm:gap-4 ml-4 sm:ml-6"
        >
          {/* Avatar Circle with Gradient */}
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ duration: 0.3 }}
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-white text-lg sm:text-xl font-bold shadow-lg"
            style={{
              background: 'linear-gradient(135deg, #112250 0%, #1a3570 100%)',
            }}
          >
            {t.name.charAt(0)}
          </motion.div>

          {/* Author Info */}
          <div>
            <div
              className="font-bold text-base sm:text-lg"
              style={{ color: '#112250', fontFamily: 'var(--font-playfair)' }}
            >
              {t.name}
            </div>
            <div
              className="text-xs sm:text-sm"
              style={{ color: '#112250b3', fontFamily: 'var(--font-libre)' }}
            >
              {t.location}
            </div>
            <div
              className="text-xs sm:text-sm font-semibold mt-1"
              style={{
                color: '#D8B893',
                fontFamily: 'var(--font-libre)',
              }}
            >
              {t.title}
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Decorative Quote Mark - Bottom Right */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 0.2, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="absolute -bottom-6 -right-4 md:-right-8"
      >
        <Quote
          className="w-16 h-16 md:w-20 md:h-20"
          style={{ color: '#D8B893', fill: '#D8B893' }}
        />
      </motion.div>
    </motion.div>
  );
};

export default function CustomerExperiences() {
  const sectionRef = useRef(null);

  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: 'Arun Raj',
      location: 'Chennai',
      title: 'Investor, serene villas',
      rating: 5,
      comment:
        'Plotzed transformed my investment into a peaceful escape. The lush surroundings and guided process made it feel effortless.',
    },
    {
      id: 2,
      name: 'Prijul',
      location: 'Bengaluru',
      title: 'Land Owner, Coastal Estates',
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
    const auto = setInterval(() => next(), 6000);
    return () => clearInterval(auto);
  }, []);

  return (
    <section
      ref={sectionRef}
      id="customerexperiences"
      className="py-16 sm:py-20 md:py-24 relative overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/images/testimonials-bg.jpg')",
          }}
        />
      </div>

      {/* Dark overlay with gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#112250]/85 via-[#0a1536]/90 to-[#112250]/85 z-0" />

      {/* Animated Subtle Background Pattern */}
      <motion.div
        className="absolute inset-0 opacity-10 z-0"
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%'],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: "reverse"
        }}
        style={{
          backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(216,184,147,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(216,184,147,0.3) 0%, transparent 50%)',
          backgroundSize: '200% 200%',
        }}
      />

      {/* Header Section with Animation */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="container-custom text-center mb-12 sm:mb-16 md:mb-20 relative z-10 px-4"
      >
        <h2
          className="font-bold mb-4 text-white"
          style={{
            fontFamily: 'var(--font-playfair)',
            fontSize: 'clamp(2rem, 5vw, 3rem)'
          }}
        >
          Testimonials
        </h2>
        <motion.div
          className="w-24 h-1 mx-auto mb-4 sm:mb-6"
          initial={{ width: 0 }}
          whileInView={{ width: 96 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{ backgroundColor: '#D8B893' }}
        />
        <p
          className="text-base sm:text-lg md:text-xl max-w-2xl mx-auto px-4"
          style={{ color: 'rgba(255,255,255,0.85)', fontFamily: 'var(--font-libre)' }}
        >
          Hear from our distinguished clients about their exceptional experiences
        </p>
      </motion.div>

      {/* SLIDER with AnimatePresence */}
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 md:px-8 z-10">
        <div className="relative overflow-hidden">
          <AnimatePresence mode="wait">
            <div key={current} className="flex justify-center py-4 sm:py-6 md:py-8">
              <SlideCard t={testimonials[current]} />
            </div>
          </AnimatePresence>
        </div>

        {/* LEFT ARROW - Enhanced */}
        <motion.button
          onClick={prev}
          whileHover={{ scale: 1.1, x: -4 }}
          whileTap={{ scale: 0.95 }}
          className="absolute left-0 sm:left-2 md:-left-6 top-1/2 -translate-y-1/2 w-12 h-12 sm:w-14 sm:h-14 text-white rounded-full transition-all duration-300 flex items-center justify-center shadow-lg backdrop-blur-sm"
          style={{ backgroundColor: 'rgba(17, 34, 80, 0.9)' }}
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </motion.button>

        {/* RIGHT ARROW - Enhanced */}
        <motion.button
          onClick={next}
          whileHover={{ scale: 1.1, x: 4 }}
          whileTap={{ scale: 0.95 }}
          className="absolute right-0 sm:right-2 md:-right-6 top-1/2 -translate-y-1/2 w-12 h-12 sm:w-14 sm:h-14 text-white rounded-full transition-all duration-300 flex items-center justify-center shadow-lg backdrop-blur-sm"
          style={{ backgroundColor: 'rgba(17, 34, 80, 0.9)' }}
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </motion.button>
      </div>

      {/* DOTS - Enhanced with Animation */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5 }}
        className="flex justify-center gap-2 sm:gap-3 mt-8 sm:mt-12 relative z-10"
      >
        {testimonials.map((_, idx) => (
          <motion.button
            key={idx}
            onClick={() => setCurrent(idx)}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            className={`
              h-2 sm:h-3 rounded-full cursor-pointer transition-all duration-300
              ${idx === current
                ? 'w-10 sm:w-12 bg-[#D8B893]'
                : 'w-2 sm:w-3 bg-white/30 hover:bg-white/50'
              }
            `}
          />
        ))}
      </motion.div>
    </section>
  );
}
