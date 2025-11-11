import { Calendar, Shield, Headphones, Award } from 'lucide-react';

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
    <section className="py-20 bg-white">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Seamless Booking Experience
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            From search to settlement, we’ve streamlined every step of your property journey
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="text-center group hover:shadow-xl p-6 rounded-2xl transition-all duration-300"
            >
              <div className="w-16 h-16 rounded-full bg-navy-900 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-6">Ready to start your property journey?</p>
          <button className="bg-navy-900 text-white px-8 py-4 rounded-full font-semibold hover:bg-navy-800 transition-colors">
            Book a Consultation
          </button>
        </div>
      </div>
    </section>
  );
}
