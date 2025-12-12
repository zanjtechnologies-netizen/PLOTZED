'use client';

import { Calendar, Shield, Headphones, Award } from 'lucide-react';
import { useState } from 'react';
import BookingModal from '@/components/modals/BookingModal';
import { motion } from 'framer-motion';

export default function BookingExperience() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const features = [
    {
      icon: Calendar,
      title: 'Easy Booking',
      /*description:
        'Schedule property viewings with just a few clicks. Our intuitive platform makes booking seamless.',*/
    },
    {
      icon: Shield,
      title: 'Secure Transactions',
      /*description:
        'Your data and transactions are protected with bank-level security and encryption.',
    */},
    {
      icon: Headphones,
      title: '24/7 Support',
      /*description:
        'Our dedicated team is available round the clock to assist you with any queries.',
    */},
    {
      icon: Award,
      title: 'Premium Service',
      /*description:
        'Experience white-glove service from property search to final handover and beyond.',
    */},
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <section id='bookingexperience' className="py-6 sm:py-8 relative overflow-visible">
      {/* INNER WHITE BOX — rounded container */}
      <div
        className="rounded-xl sm:rounded-2xl md:rounded-3xl mx-auto px-4 sm:px-5 md:px-6 py-6 sm:py-8 md:py-10"
        style={{
          background: 'white',
          maxWidth: '1200px',
        }}
      >
        <div className="container-custom px-4 sm:px-6">
        {/* Section Header with Animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-6 sm:mb-8"
        >
          <h2
            className="font-bold text-gray-900 mb-2 sm:mb-3 px-4"
            style={{
              fontFamily: 'var(--font-playfair)',
              fontSize: 'clamp(1.5rem, 3vw, 2.25rem)'
            }}
          >
            Seamless Booking Experience
          </h2>
          <p
            className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto px-4"
            style={{ fontFamily: 'var(--font-libre)' }}
          >
            From search to settlement, we've streamlined every step of your property journey
          </p>
        </motion.div>

        {/* Features Grid with Stagger Animation */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5 mb-6 sm:mb-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <motion.div
                whileHover={{ y: -6, scale: 1.03 }}
                transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
                className="text-center group p-3 sm:p-4 rounded-xl transition-all duration-300 bg-white/40 backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_0_rgba(17,34,80,0.08)] hover:shadow-[0_12px_40px_0_rgba(17,34,80,0.15)] cursor-pointer"
              >
                {/* Animated Icon Container */}
                <motion.div
                  whileHover={{ rotate: [0, -10, 10, 0], scale: 1.15 }}
                  transition={{ duration: 0.5 }}
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-[#112250] to-[#1a3570] flex items-center justify-center mx-auto mb-2 sm:mb-3 shadow-lg group-hover:shadow-xl transition-shadow duration-300"
                >
                  <motion.div
                    animate={{ y: [0, -2, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: index * 0.2 }}
                  >
                    <feature.icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                  </motion.div>
                </motion.div>

                <h3
                  className="text-base sm:text-lg font-bold text-gray-900 mb-1.5 group-hover:text-[#112250] transition-colors duration-300"
                  style={{ fontFamily: 'var(--font-playfair)' }}
                >
                  {feature.title}
                </h3>
                <p
                  className="text-xs sm:text-sm text-gray-600 leading-relaxed"
                  style={{ fontFamily: 'var(--font-libre)' }}
                >
                  {/*feature.description*/}
                </p>

                {/* Animated Bottom Accent Bar */}
                <motion.div
                  className="mt-2 sm:mt-3 h-1 bg-gradient-to-r from-[#D8B893] to-[#112250] rounded-full"
                  initial={{ width: 0 }}
                  whileInView={{ width: '100%' }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                />
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Box with Enhanced Animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="max-w-2xl mx-auto"
        >
          <motion.div
            whileHover={{ scale: 1.03, y: -2 }}
            transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
            className="text-center bg-gradient-to-br from-[#f8f9fa]/80 to-white/80 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-[#D8B893]/20 shadow-[0_8px_32px_0_rgba(17,34,80,0.08)] hover:shadow-[0_12px_40px_0_rgba(17,34,80,0.12)] transition-shadow duration-300"
          >
            <p
              className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 font-medium"
              style={{ fontFamily: 'var(--font-libre)' }}
            >
              Ready to start your property journey?
            </p>
            <div className="relative inline-block">
              <motion.button
                onClick={() => setIsModalOpen(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="bg-gradient-to-r from-[#112250] to-[#1a3570] text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-semibold transition-all duration-300 text-sm sm:text-base shadow-lg hover:shadow-xl active:shadow-md"
                style={{ fontFamily: 'var(--font-libre)' }}
              >
                Book a Consultation
              </motion.button>

              {/* Floating Click Here Badge */}
              <motion.div
                animate={{
                  y: [0, -8, 0],
                  rotate: [-5, 5, -5]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute -top-3 -right-3 sm:-right-4 bg-gradient-to-r from-[#D8B893] to-[#c9a879] text-[#112250] px-2 sm:px-3 py-1 rounded-full text-xs font-bold shadow-lg pointer-events-none"
                style={{ fontFamily: 'var(--font-libre)' }}
              >
                Click here
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
      </div>

      {/* Booking Modal */}
      <BookingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  );
}
