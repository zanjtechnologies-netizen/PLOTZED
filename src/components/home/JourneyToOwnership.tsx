import { Check, MapPin, Calendar, Clock, ChevronDown } from 'lucide-react';

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
    <section className="py-20 bg-white">
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
                <div key={index} className="flex gap-6">
                  <div key={index} className="flex gap-6 items-start">
                    {/* Number Badge */}
                    <div className="flex-shrink-0">
                      <div
                        className="w-16 h-16 rounded-xl flex items-center justify-center shadow-sm"
                        style={{ backgroundColor: '#D8B893' }}
                      >
                        <span
                          className="font-bold text-lg"
                          style={{ color: '#112250' }}
                        >
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

          {/* Right Image + Glass Form Card */}
          <div className="relative">
            <div className="relative h-[600px] rounded-3xl overflow-hidden shadow-2xl">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: "url('/images/journey-ownership.jpg')",
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 to-transparent" />

              {/* Glass form panel */}
              <div
                className="absolute top-6 left-6 right-6 rounded-2xl p-4 md:p-6"
                style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(8px)' }}
              >
                <h4 className="text-navy-900 font-semibold mb-4">
                  Choose your properties
                </h4>
                


                {/* Overlay Stats */}
                <div className="mt-4">
                  <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6">
                    <div className="grid grid-cols-3 gap-6 text-center">
                      <div>
                        <div className="text-3xl font-bold text-teal-600 mb-1">500+</div>
                        <div className="text-sm text-gray-600">Properties</div>
                      </div>
                      <div>
                        <div className="text-3xl font-bold text-teal-600 mb-1">98%</div>
                        <div className="text-sm text-gray-600">Satisfied</div>
                      </div>
                      <div>
                        <div className="text-3xl font-bold text-teal-600 mb-1">15+</div>
                        <div className="text-sm text-gray-600">Years</div>
                      </div>
                    </div>

                    {/* Destination */}
                    <div className="mt-4">
                      <div className="flex items-center gap-3 bg-white rounded-xl py-3 border border-gray-200">
                        <MapPin className="w-5 h-5 text-gray-500" />
                        <span className="text-gray-500">Destination</span>
                      </div>
                    </div>

                    {/* Date of Visit */}
                    <div className="mt-4">
                      <div className="flex items-center gap-3 bg-white rounded-xl py-3 border border-gray-200">
                        <Calendar className="w-5 h-5 text-gray-500" />
                        <span className="text-gray-500">DD/MM/YYYY</span>
                      </div>
                    </div>

                    {/* Timing Slots */}
                    <div className="mb-6 mt-4">
                      <div className="flex items-center gap-3 bg-white rounded-xl py-3 border border-gray-200 justify-between">
                        <div className="flex items-center gap-3">
                          <Clock className="w-5 h-5 text-gray-500" />
                          <span className="text-gray-500">Select your time slots</span>
                        </div>
                        <ChevronDown className="w-5 h-5 text-gray-500" />
                      </div>
                    </div>

                    {/* Link */}
                    <div className="mb-6">
                      <a href="#" className="text-navy-900 underline text-sm">
                        What value do our consultants bring?
                      </a>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute -top-6 right-6 w-24 h-24 bg-teal-400/20 rounded-full blur-2xl" />
                    <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-amber-400/20 rounded-full blur-2xl" />

                    {/* Button */}
                    <button
                      className="w-full py-4 rounded-xl font-semibold"
                      style={{ backgroundColor: '#D8B893', color: '#112250' }}
                    >
                      Book for consultants
                    </button>
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
