import { Metadata } from 'next'
import Link from 'next/link'
import { Building2, Target, Heart, Award, Users, TrendingUp, ArrowLeft } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about Plotzed Real Estate - Your trusted partner in finding perfect plots and properties in Tamil Nadu. Discover our mission, values, and commitment to excellence.',
  keywords: 'about Plotzed, real estate company, property developers, Tamil Nadu real estate, company mission, our values',
  openGraph: {
    title: 'About Us | Plotzed Real Estate',
    description: 'Your trusted partner in finding perfect plots and properties in Tamil Nadu.',
    type: 'website',
  },
}

export default function AboutPage() {
  return (  
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-[#112250] py-16 md:py-24">
        <div className="container-custom">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-6 group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Back to Home
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <Building2 className="w-12 h-12 text-[#D8B893]" />
            <h1 className="text-4xl md:text-5xl font-bold text-white">About Plotzed</h1>
          </div>
          <p className="text-white/80 text-lg max-w-3xl">
            Your trusted partner in finding the perfect plot for your dream home
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12 md:py-16">
        <div className="container-custom max-w-6xl">

          {/* Introduction */}
          <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm mb-8">
            <h2 className="text-3xl font-bold text-[#112250] mb-6">Who We Are</h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                Plotzed Real Estate is a premier real estate platform dedicated to simplifying the process of finding and purchasing plots in Tamil Nadu. We understand that buying land is one of the most important investments you'll make, and we're here to make that journey seamless, transparent, and rewarding.
              </p>
              <p>
                Founded with a vision to revolutionize the real estate experience, we connect buyers with verified, high-quality plots from trusted developers. Our platform combines cutting-edge technology with personalized service to ensure you find the perfect plot that matches your requirements and budget.
              </p>
              <p>
                Whether you're looking for residential plots to build your dream home, investment properties for future appreciation, or commercial land for business ventures, Plotzed is your one-stop destination for all your land purchasing needs.
              </p>
            </div>
          </div>

          {/* Mission & Vision */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-[#112250]/10 rounded-full flex items-center justify-center">
                  <Target className="w-6 h-6 text-[#112250]" />
                </div>
                <h3 className="text-2xl font-bold text-[#112250]">Our Mission</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                To empower every individual and family with the opportunity to own their dream plot through transparent transactions, verified listings, and exceptional customer service. We strive to make land ownership accessible, affordable, and hassle-free for everyone.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-[#112250]/10 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-[#112250]" />
                </div>
                <h3 className="text-2xl font-bold text-[#112250]">Our Vision</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                To become the most trusted and preferred real estate platform in Tamil Nadu, known for integrity, innovation, and customer-centric approach. We envision a future where finding and purchasing the perfect plot is as simple as a few clicks.
              </p>
            </div>
          </div>

          {/* Core Values */}
          <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm mb-8">
            <h2 className="text-3xl font-bold text-[#112250] mb-8 text-center">Our Core Values</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-[#112250]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-[#112250]" />
                </div>
                <h3 className="text-xl font-bold text-[#112250] mb-3">Integrity</h3>
                <p className="text-gray-700">
                  We believe in complete transparency and honesty in all our dealings. Every property listing is verified, and we provide accurate information to help you make informed decisions.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-[#112250]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-[#112250]" />
                </div>
                <h3 className="text-xl font-bold text-[#112250] mb-3">Excellence</h3>
                <p className="text-gray-700">
                  We are committed to delivering exceptional service at every touchpoint. From browsing listings to closing deals, we ensure a premium experience that exceeds expectations.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-[#112250]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-[#112250]" />
                </div>
                <h3 className="text-xl font-bold text-[#112250] mb-3">Customer Focus</h3>
                <p className="text-gray-700">
                  Your satisfaction is our priority. We listen to your needs, understand your goals, and work tirelessly to help you find the perfect plot that fits your vision and budget.
                </p>
              </div>
            </div>
          </div>

          {/* Why Choose Plotzed */}
          <div className="bg-gradient-to-br from-[#112250] to-[#1a3570] rounded-2xl p-8 md:p-12 shadow-lg mb-8 text-white">
            <h2 className="text-3xl font-bold mb-8 text-center">Why Choose Plotzed?</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-[#D8B893] rounded-full flex items-center justify-center">
                    <span className="text-[#112250] font-bold">✓</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Verified Properties</h3>
                  <p className="text-white/80">
                    All our listings are thoroughly verified for legal compliance, RERA registration, and documentation authenticity.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-[#D8B893] rounded-full flex items-center justify-center">
                    <span className="text-[#112250] font-bold">✓</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Transparent Process</h3>
                  <p className="text-white/80">
                    No hidden charges or surprises. We provide complete information upfront, including pricing, amenities, and terms.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-[#D8B893] rounded-full flex items-center justify-center">
                    <span className="text-[#112250] font-bold">✓</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Expert Guidance</h3>
                  <p className="text-white/80">
                    Our experienced team provides personalized assistance throughout your property journey, from selection to registration.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-[#D8B893] rounded-full flex items-center justify-center">
                    <span className="text-[#112250] font-bold">✓</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Prime Locations</h3>
                  <p className="text-white/80">
                    We curate properties in strategic locations with excellent connectivity, infrastructure, and appreciation potential.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-[#D8B893] rounded-full flex items-center justify-center">
                    <span className="text-[#112250] font-bold">✓</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Seamless Site Visits</h3>
                  <p className="text-white/80">
                    Schedule site visits at your convenience with our easy booking system and get a firsthand look at your future investment.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-[#D8B893] rounded-full flex items-center justify-center">
                    <span className="text-[#112250] font-bold">✓</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Post-Purchase Support</h3>
                  <p className="text-white/80">
                    Our relationship doesn't end at purchase. We provide continued support for documentation, registration, and more.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Our Commitment */}
          <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm">
            <h2 className="text-3xl font-bold text-[#112250] mb-6">Our Commitment to You</h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                At Plotzed, we understand that purchasing land is not just a financial transaction—it's the foundation for your dreams, your family's future, and your legacy. That's why we're committed to:
              </p>
              <ul className="space-y-3 ml-6">
                <li className="flex gap-3">
                  <span className="text-[#D8B893] font-bold mt-1">•</span>
                  <span><strong>Quality Assurance:</strong> Partnering only with reputable developers and ensuring all properties meet our stringent quality standards.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#D8B893] font-bold mt-1">•</span>
                  <span><strong>Legal Compliance:</strong> Verifying all legal documentation, RERA approvals, and ensuring clear titles for every property.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#D8B893] font-bold mt-1">•</span>
                  <span><strong>Fair Pricing:</strong> Providing competitive pricing with no hidden costs or last-minute surprises.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#D8B893] font-bold mt-1">•</span>
                  <span><strong>Customer Education:</strong> Empowering you with knowledge about market trends, investment potential, and property selection.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#D8B893] font-bold mt-1">•</span>
                  <span><strong>Responsive Support:</strong> Being available to answer your questions, address concerns, and provide timely assistance.</span>
                </li>
              </ul>
              <p className="mt-6">
                We invite you to explore our curated collection of premium plots and experience the Plotzed difference. Your dream plot is just a few clicks away!
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16 bg-gray-100">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold text-[#112250] mb-4">Ready to Find Your Perfect Plot?</h2>
          <p className="text-gray-700 text-lg mb-8 max-w-2xl mx-auto">
            Browse our extensive collection of verified plots and start your journey to land ownership today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/plots"
              className="bg-[#112250] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#1a3570] transition-colors"
            >
              Browse Properties
            </Link>
            <Link
              href="/visit"
              className="bg-white text-[#112250] px-8 py-3 rounded-lg font-semibold border-2 border-[#112250] hover:bg-gray-50 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}