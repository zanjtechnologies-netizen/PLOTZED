import { Check } from 'lucide-react';
import Image from 'next/image';

export default function JourneyToOwnership() {
  const steps = [
    {
      number: '01',
      title: 'Initial Consultation',
      description: 'Discuss your property preferences, budget, and investment goals with our experts.',
    },
    {
      number: '02',
      title: 'Property Selection',
      description: 'Explore handpicked listings that match your exact lifestyle and criteria.',
    },
    {
      number: '03',
      title: 'Site Visit',
      description: 'Schedule a guided property tour to evaluate the options before making a decision.',
    },
    {
      number: '04',
      title: 'Finalization',
      description: 'Seal the deal with confidence — we handle documentation and negotiation for you.',
    },
  ];

  return (
    <section id="journeytoownership" className="py-20 bg-white">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div>
            <h2
              className="text-4xl md:text-5xl font-bold mb-6"
              style={{ fontFamily: 'var(--font-playfair)', color: '#112250' }}
            >
              Your Journey to Ownership
            </h2>
            <p className="text-xl text-gray-600 mb-12">
              From discovery to closing, we guide you through every step of the process with
              expertise and care.
            </p>

            {/* Steps */}
            <div className="space-y-8">
              {steps.map((step, index) => (
                <div key={index} className="flex gap-6 items-start">
                  {/* Number Badge */}
                  <div className="flex-shrink-0">
                    <div
                      className="w-16 h-16 rounded-xl flex items-center justify-center shadow-sm"
                      style={{ backgroundColor: '#D8B893' }}
                    >
                      <span className="font-bold text-lg" style={{ color: '#112250' }}>
                        {step.number}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3
                      className="text-xl font-bold mb-2"
                      style={{ color: '#112250', fontFamily: 'var(--font-playfair)' }}
                    >
                      {step.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <div className="mt-12">
              <button
                className="px-8 py-4 rounded-full font-semibold transition-colors inline-flex items-center gap-2"
                style={{ backgroundColor: '#D8B893', color: '#112250' }}
              >
                Start Journey
                <Check className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative">
            <div className="relative h-[600px] rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src="/images/hero-bg-fallback-1.png"
                alt="Premium plot with scenic view"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#112250]/60 via-transparent to-transparent" />

              {/* Stats overlay at bottom */}
              <div className="absolute bottom-6 left-6 right-6">
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                  <div className="grid grid-cols-3 gap-6 text-center">
                    <div>
                      <div className="text-3xl font-bold text-[#006DB8] mb-1">25+</div>
                      <div className="text-sm text-gray-600">Properties</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-[#006DB8] mb-1">98%</div>
                      <div className="text-sm text-gray-600">Satisfied</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-[#006DB8] mb-1">3+</div>
                      <div className="text-sm text-gray-600">Years</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
