// app/(main)/page.tsx
import type { Metadata } from 'next'
import { generateOrganizationStructuredData } from '@/lib/structured-data'
import HeroSection from '@/components/home/HeroSection';
import FeaturedListings from '@/components/home/FeaturedListings';
import BookingExperience from '@/components/home/BookingExperience';
import JourneyToOwnership from '@/components/home/JourneyToOwnership';
import LandscapeVideo from '@/components/home/LandscapeVideo';
import StoriesInsights from '@/components/home/StoriesInsights';
import CustomerExperiences from '@/components/home/CustomerExperiences';
import RedefineLuxury from '@/components/home/RedefineLuxury';
//import Footer from '@/components/home/Footer'; // ✅ Use only Footer now

export const metadata: Metadata = {
  title: 'Plotzed | Premium Real Estate Properties & Luxury Plots',
  description: 'Discover luxury real estate plots and premium properties with Plotzed. Book site visits, explore featured listings, and find your dream property with our expert guidance.',
  keywords: ['real estate', 'luxury plots', 'premium properties', 'property investment', 'land for sale', 'site visits', 'real estate India'],
  openGraph: {
    title: 'Plotzed | Premium Real Estate Properties',
    description: 'Discover luxury plots and premium properties. Book site visits and explore exclusive listings.',
    type: 'website',
    url: 'https://plotzed.com',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Plotzed - Premium Real Estate',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Plotzed | Premium Real Estate Properties',
    description: 'Discover luxury plots and premium properties',
    images: ['/images/og-image.jpg'],
  },
}

export default function HomePage() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://plotzed.com'
  const organizationData = generateOrganizationStructuredData(baseUrl)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationData) }}
      />
      <div className="overflow-hidden">
        <HeroSection />
        <FeaturedListings />
        <BookingExperience />
        <JourneyToOwnership />
        <LandscapeVideo />
        <StoriesInsights />
        <CustomerExperiences />
        <RedefineLuxury />
      </div>
    </>
  );
}
