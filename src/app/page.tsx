// app/(main)/page.tsx
import { generateMetadata as createMetadata } from '@/lib/seo/metadata';
import HeroSection from '@/components/home/HeroSection';
import FeaturedListings from '@/components/home/FeaturedListings';
import BookingExperience from '@/components/home/BookingExperience';
import JourneyToOwnership from '@/components/home/JourneyToOwnership';
import LandscapeVideo from '@/components/home/LandscapeVideo';
import StoriesInsights from '@/components/home/StoriesInsights';
import CustomerExperiences from '@/components/home/CustomerExperiences';
import RedefineLuxury from '@/components/home/RedefineLuxury';

/**
 * Homepage Metadata - Generated using custom SEO utilities
 * See: src/lib/seo/metadata.ts
 */
export const metadata = createMetadata({
  title: 'Premium Real Estate Properties & Luxury Plots',
  description: 'Discover luxury real estate plots and premium properties with Plotzed. Book site visits, explore featured listings, and find your dream property with our expert guidance.',
  keywords: [
    'real estate',
    'luxury plots',
    'premium properties',
    'property investment',
    'land for sale',
    'site visits',
    'real estate developers',
    'residential plots',
    'villas for sale',
  ],
  path: '/',
  type: 'website',
});

export default function HomePage() {
  return (
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
  );
}
