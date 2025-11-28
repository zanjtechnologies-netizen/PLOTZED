import dynamic from 'next/dynamic';
import HeroSection from '@/components/home/HeroSection';
import FeaturedListings from '@/components/home/FeaturedListings';
import { ChatBot, WhatsAppButton } from '@/components/home/ClientComponents';

// Lazy load below-the-fold components for better performance
const BookingExperience = dynamic(() => import('@/components/home/BookingExperience'), {
  loading: () => <div className="min-h-[400px] animate-pulse bg-gray-100" />,
});
const JourneyToOwnership = dynamic(() => import('@/components/home/JourneyToOwnership'), {
  loading: () => <div className="min-h-[400px] animate-pulse bg-gray-100" />,
});
const LandscapeVideo = dynamic(() => import('@/components/home/LandscapeVideo'), {
  loading: () => <div className="min-h-[500px] animate-pulse bg-gray-100" />,
});
const StoriesInsights = dynamic(() => import('@/components/home/StoriesInsights'), {
  loading: () => <div className="min-h-[400px] animate-pulse bg-gray-800" />,
});
const CustomerExperiences = dynamic(() => import('@/components/home/CustomerExperiences'), {
  loading: () => <div className="min-h-[400px] animate-pulse bg-gray-100" />,
});
const RedefineLuxury = dynamic(() => import('@/components/home/RedefineLuxury'), {
  loading: () => <div className="min-h-[400px] animate-pulse bg-gray-100" />,
});

export default function HomePage() {
  return (
    <>
      <WhatsAppButton
        phoneNumber="+917708594263"
        message="Hi, I'm interested in learning more about your premium plots."
        position="left"
      />
      <ChatBot />
      <div className="overflow-hidden">
      {/* Hero Section */}
      <HeroSection />

      {/* Featured Listings - White to Gray Gradient */}
      <section className="pt-16 md:pt-20 lg:pt-24 px-6 md:px-12 lg:px-24 xl:px-32 bg-gradient-to-b from-white to-gray-50">
        <FeaturedListings />
      </section>

      {/* Booking & Journey Section - White Background */}
      <section className="pt-16 md:pt-20 lg:pt-24 px-6 md:px-12 lg:px-24 xl:px-40 space-y-12 md:space-y-16 bg-white">
        <BookingExperience />
        <JourneyToOwnership />
      </section>

      {/* Video Banner Section */}
      <section className="pt-16 md:pt-20 lg:pt-24 px-6 md:px-12 lg:px-24 xl:px-40 bg-white">
        <LandscapeVideo />
      </section>

      {/* Blog/Stories Section - Dark Navy Background */}
      <section className="bg-[#112250]">
        <div className="container-custom py-16 md:py-24">
          <StoriesInsights />
        </div>
      </section>

      {/* Testimonials Section - Gray to White Gradient */}
      <section className="pt-16 md:pt-20 lg:pt-24 px-6 md:px-12 lg:px-24 xl:px-32 bg-gradient-to-b from-gray-50 to-white">
        <CustomerExperiences />
      </section>

      {/* About/Luxury Section - White to Gray Gradient */}
      <section className="pt-16 md:pt-20 lg:pt-24 px-6 md:px-12 lg:px-24 xl:px-32 bg-gradient-to-b from-white to-gray-50">
        <RedefineLuxury />
      </section>
      </div>
    </>
  );
}
