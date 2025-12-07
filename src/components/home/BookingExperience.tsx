import { Calendar, Shield, Headphones, Award } from 'lucide-react';
import Link from 'next/link';

export default function BookingExperience() {
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
    <section id='bookingexperience' className="py-12 sm:py-16 md:py-20 bg-white">
      <div className="container-custom px-4">
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 px-4">
            Seamless Booking Experience
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-4">
            From search to settlement, we've streamlined every step of your property journey
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="text-center group hover:shadow-xl p-5 sm:p-6 rounded-xl sm:rounded-2xl transition-all duration-300 bg-white border border-gray-100"
            >
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-navy-900 flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">{feature.title}</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-10 sm:mt-12 bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 sm:p-10 md:p-12 border border-gray-100">
          <p className="text-base sm:text-lg text-gray-600 mb-5 sm:mb-6 font-medium">Ready to start your property journey?</p>
          <Link
            href="/visit"
            className="inline-block bg-navy-900 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold hover:bg-navy-800 transition-colors text-sm sm:text-base"
          >
            Book a Consultation
          </Link>
        </div>
      </div>
    </section>
  );
}
