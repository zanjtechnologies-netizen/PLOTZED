'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';

// Animated Counter Component
const AnimatedCounter = ({ end, duration = 2, suffix = '' }: { end: number; duration?: number; suffix?: string }) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(null);
  const isInView = useInView(countRef, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!isInView) return;

    let startTime: number | null = null;
    const startValue = 0;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);

      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentCount = Math.floor(easeOutQuart * (end - startValue) + startValue);

      setCount(currentCount);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    requestAnimationFrame(animate);
  }, [isInView, end, duration]);

  return <span ref={countRef}>{count}{suffix}</span>;
};

export default function RedefineLuxury() {
  const images = [
    { src: '/images/plotzed-coverpage.jpg', alt: 'Luxury interior' },
    { src: '/images/about-1.jpg', alt: 'Premium amenities' },
    { src: '/images/about-2.jpg', alt: 'Elegant design' },
    { src: '/images/hero-bg-fallback-1.png', alt: 'Premium property' },
    { src: '/images/park.jpg', alt: 'Modern architecture' },
  ];

  const stats = [
    { value: 3, label: 'Years of Excellence', suffix: '+' },
    { value: 50, label: 'Luxury Properties', suffix: '+' },
    { value: 3, label: 'Global Destinations', suffix: '+' },
    { value: 98, label: 'Client Satisfaction', suffix: '%' },
  ];

  const coreValues = [
    {
      title: 'Excellence',
      desc: 'Unwavering commitment to the highest standards',
    },
    {
      title: 'Authenticity',
      desc: 'Verified and Approved Land Titles',
    },
    {
      title: 'Sustainability',
      desc: 'Eco-friendly Development',
    },
    {
      title: 'Client Trust',
      desc: '98% Satisfaction',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <section id="redefineluxury" className="py-16 sm:py-20 bg-white">
      <div className="container-custom px-4">
        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            {/* Small Intro Label */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="uppercase tracking-widest mb-4 text-xs sm:text-sm font-semibold"
              style={{ color: '#D8B893', fontFamily: 'var(--font-libre)' }}
            >
              About Plotzed
            </motion.p>

            {/* Title */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-bold mb-6 leading-tight"
              style={{
                color: '#112250',
                fontFamily: 'var(--font-playfair)',
                fontSize: 'clamp(2rem, 4vw, 3rem)'
              }}
            >
              Redefining Luxury
              <br />
              <span
                style={{
                  color: '#D8B893',
                  fontFamily: 'var(--font-playfair)',
                }}
              >
                Real Estate
              </span>
            </motion.h2>

            {/* Description Paragraphs with Stagger */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="space-y-6 mb-8"
            >
              <motion.p
                variants={itemVariants}
                className="text-base sm:text-lg leading-relaxed"
                style={{
                  color: '#112250cc',
                  fontFamily: 'var(--font-libre)',
                }}
              >
                For over 3+ years, Plotzed Real Estate Developers has been a trusted name in premium
                property development — offers no brokage and curating exceptional residential plots, estates, and villas
                across South India's most promising destinations.
              </motion.p>

              <motion.p
                variants={itemVariants}
                className="text-base sm:text-lg leading-relaxed"
                style={{
                  color: '#112250cc',
                  fontFamily: 'var(--font-libre)',
                }}
              >
                Our vision goes beyond selling land — we craft opportunities where modern design meets
                natural harmony, creating spaces that inspire both living and investment. Every
                project is carefully planned to deliver high value, long-term growth, and a lifestyle
                rooted in sustainability.
              </motion.p>

              <motion.p
                variants={itemVariants}
                className="text-base sm:text-lg leading-relaxed"
                style={{
                  color: '#112250cc',
                  fontFamily: 'var(--font-libre)',
                }}
              >
                We combine expertise, transparency, and design-driven development to deliver
                unmatched value.
              </motion.p>
            </motion.div>

            {/* Core Values with Animation */}
            <motion.ul
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="space-y-4"
            >
              {coreValues.map((item, index) => (
                <motion.li
                  key={index}
                  variants={itemVariants}
                  whileHover={{ x: 8 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col"
                >
                  <div className="flex items-center gap-2">
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: '#D8B893' }}
                    />
                    <span
                      className="font-semibold text-sm sm:text-base"
                      style={{
                        color: '#112250',
                        fontFamily: 'var(--font-libre)',
                      }}
                    >
                      {item.title}
                    </span>
                  </div>
                  <p
                    className="ml-5 text-xs sm:text-sm"
                    style={{
                      color: '#112250b3',
                      fontFamily: 'var(--font-libre)',
                    }}
                  >
                    {item.desc}
                  </p>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>

          {/* Right Images Grid with Stagger Animation */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-3 sm:gap-4"
            >
              {images.map((image, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05, zIndex: 10 }}
                  transition={{ duration: 0.3 }}
                  className={`relative rounded-2xl overflow-hidden shadow-lg group ${
                    index === 0 ? 'col-span-2 h-48 sm:h-64' : 'h-36 sm:h-48'
                  }`}
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center transform group-hover:scale-110 transition-transform duration-700"
                    style={{
                      backgroundImage: `url(${image.src})`,
                    }}
                  />
                  {/* Gradient Overlay on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#112250]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Image Label */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                    <p
                      className="text-white text-xs sm:text-sm font-semibold"
                      style={{ fontFamily: 'var(--font-libre)' }}
                    >
                      {image.alt}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Divider Line with Animation */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2 }}
          className="my-12 sm:my-16 h-px origin-left"
          style={{
            backgroundColor: 'rgba(216,184,147,0.3)',
          }}
        />

        {/* Stats Section with Animated Counters */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ scale: 1.05, y: -8 }}
              transition={{ duration: 0.3 }}
              className="relative group"
            >
              {/* Background Glow Effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-[#D8B893]/10 to-[#112250]/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                initial={{ scale: 0.8 }}
                whileHover={{ scale: 1 }}
              />

              <div className="relative p-4 sm:p-6">
                <motion.div
                  className="font-bold mb-2"
                  style={{
                    color: '#8B5E3C',
                    fontFamily: 'var(--font-playfair)',
                    fontSize: 'clamp(2.5rem, 5vw, 3rem)'
                  }}
                >
                  <AnimatedCounter end={stat.value} duration={2} suffix={stat.suffix} />
                </motion.div>
                <div
                  className="text-sm sm:text-base"
                  style={{
                    color: '#112250',
                    fontFamily: 'var(--font-libre)',
                  }}
                >
                  {stat.label}
                </div>

                {/* Decorative Accent Bar */}
                <motion.div
                  className="w-12 h-1 bg-gradient-to-r from-[#D8B893] to-transparent mx-auto mt-3"
                  initial={{ width: 0 }}
                  whileInView={{ width: 48 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
