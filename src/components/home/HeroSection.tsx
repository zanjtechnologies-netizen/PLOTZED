'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export default function HeroSection() {
  const sectionRef = useRef(null);
  const { scrollY } = useScroll();

  // Parallax effect - background moves slower than scroll
  const backgroundY = useTransform(scrollY, [0, 500], [0, 150]);

  return (
    <section
      ref={sectionRef}
      id="herosection"
      className="relative flex items-center justify-center min-h-[90vh] md:min-h-screen pt-20"
    >
      {/* Parallax Background with Animated Gradient Overlay */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <motion.div
          style={{ y: backgroundY }}
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-110"
        >
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: 'url(/images/hero-bg-63da63.png)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        </motion.div>

        {/* Modern Animated Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#112250]/40 via-[#112250]/30 to-[#112250]/50" />

        {/* Subtle animated mesh gradient */}
        <motion.div
          className="absolute inset-0 opacity-30"
          animate={{
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{
            background: 'radial-gradient(circle at 20% 50%, rgba(216,184,147,0.2) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(0,109,184,0.2) 0%, transparent 50%)',
            backgroundSize: '200% 200%',
          }}
        />
      </div>

      {/* Content with Stagger Animations */}
      <div className="relative z-10 container-custom text-center px-4">
        <div className="max-w-4xl mx-auto">
          {/* Main Heading with Entrance Animation */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-bold mb-5 md:mb-6 text-white"
            style={{
              fontFamily: 'var(--font-playfair)',
              lineHeight: '1.2',
              fontSize: 'clamp(2rem, 5vw + 1rem, 5.625rem)'
            }}
          >
            Discover Your Perfect
            <br />
            <motion.span
              className="text-white"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              Luxury Escape
            </motion.span>
          </motion.h1>

          {/* Subheading with Delayed Animation */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mb-10 max-w-3xl mx-auto px-2 sm:px-4"
            style={{
              color: '#E9EFFF',
              fontSize: 'clamp(1rem, 2vw + 0.5rem, 1.875rem)'
            }}
          >
            Explore premium properties crafted for unmatched comfort and luxury living landscape
          </motion.p>

          {/* Floating Decorative Element */}
          <motion.div
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
            className="inline-block mt-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.9 }}
              className="w-16 h-1 bg-gradient-to-r from-[#D8B893] to-transparent mx-auto"
            />
          </motion.div>
        </div>
      </div>

      {/* Enhanced Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 10, 0] }}
        transition={{
          opacity: { duration: 1, delay: 1.2 },
          y: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
        }}
      >
        <div className="w-6 h-10 rounded-full border-2 border-white/50 flex items-start justify-center p-2 backdrop-blur-sm">
          <motion.div
            className="w-1 h-3 rounded-full bg-[#D8B893]"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    </section>
  );
}
