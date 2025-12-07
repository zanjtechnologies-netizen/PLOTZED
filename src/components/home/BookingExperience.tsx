'use client';

import { Calendar, Shield, Headphones, Award } from 'lucide-react';
import { useState } from 'react';
import BookingModal from '@/components/modals/BookingModal';

export default function BookingExperience() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const features = [
    {
      icon: Calendar,
      title: 'Easy Booking',
      description:
        'Schedule property viewings with just a few clicks. Our intuitive platform makes booking seamless.',
    },
    {
      icon: Shield,
      title: 'Secure Transactions',
      description:
        'Your data and transactions are protected with bank-level security and encryption.',
    },
    {
      icon: Headphones,
      title: '24/7 Support',
      description:
        'Our dedicated team is available round the clock to assist you with any queries.',
    },
    {
      icon: Award,
      title: 'Premium Service',
      description:
        'Experience white-glove service from property search to final handover and beyond.',
    },
  ];

  return (
    <section id='bookingexperience' className="py-8 sm:py-10 md:py-12 relative overflow-visible">
      {/* INNER WHITE BOX — rounded container */}
      <div
        className="rounded-xl sm:rounded-2xl md:rounded-3xl mx-auto px-4 sm:px-5 md:px-6 py-8 sm:py-10 md:py-12"
        style={{
          background: 'white',
          maxWidth: '1200px',
        }}
      >
        <div className="container-custom px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 px-4">
            Seamless Booking Experience
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto px-4">
            From search to settlement, we've streamlined every step of your property journey
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-10 md:mb-12">
          {features.map((feature, index) => (
            <div
              key={index}
              className="text-center group hover:shadow-xl p-4 sm:p-5 rounded-xl transition-all duration-300 bg-white border border-gray-100"
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-navy-900 flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* CTA Box */}
        <div className="max-w-2xl mx-auto">
          <div className="text-center bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 sm:p-8 border border-gray-100 shadow-md hover:shadow-lg transition-shadow duration-300">
            <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-5 font-medium">Ready to start your property journey?</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-block bg-navy-900 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-semibold hover:bg-navy-800 transition-all duration-300 text-sm sm:text-base hover:scale-105"
            >
              Book a Consultation
            </button>
          </div>
        </div>
      </div>
      </div>

      {/* Booking Modal */}
      <BookingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  );
}
