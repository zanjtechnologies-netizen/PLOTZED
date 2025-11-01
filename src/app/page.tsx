// ================================================
// src/app/page.tsx - Homepage
// ================================================

import Link from 'next/link'
import type { Plot } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import PlotCard from '@/components/plots/plotcard'

export default async function HomePage() {
  // Fetch featured plots
  const featuredPlots = await prisma.plot.findMany({
    where: {
      is_featured: true,
      is_published: true,
      status: 'AVAILABLE',
    },
    take: 6,
    orderBy: { created_at: 'desc' },
  })

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Find Your Dream Plot
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
            Direct from developer. No brokerage. No hidden costs.
          </p>
          <Link
            href="/properties"
            className="inline-block bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-50 transition"
          >
            Explore Properties
          </Link>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12">
          Why Choose Plotzed?
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🏠</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">No Brokerage</h3>
            <p className="text-gray-600">
              Buy directly from us. Save lakhs in brokerage fees.
            </p>
          </div>
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">✅</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">RERA Approved</h3>
            <p className="text-gray-600">
              All our projects are RERA registered and legally compliant.
            </p>
          </div>
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">💰</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Flexible Payment</h3>
            <p className="text-gray-600">
              Easy EMI options and flexible payment plans available.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-4xl font-bold">Featured Properties</h2>
            <Link
              href="/properties"
              className="text-blue-600 hover:underline font-semibold"
            >
              View All →
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredPlots.map((plot: Plot) => (
              <PlotCard
                key={plot.id}
                plot={{
                  ...plot,
                  price: plot.price.toNumber(),
                  plot_size: plot.plot_size.toNumber(),
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Find Your Perfect Plot?
          </h2>
          <p className="text-xl mb-8">
            Schedule a site visit today and experience the difference.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-50 transition"
          >
            Contact Us
          </Link>
        </div>
      </section>
    </main>
  )
}
