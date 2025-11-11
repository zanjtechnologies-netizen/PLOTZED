// app/(main)/page.tsx
import HeroSection from '@/components/home/HeroSection';
import FeaturedListings from '@/components/home/FeaturedListings';
import BookingExperience from '@/components/home/BookingExperience';
import JourneyToOwnership from '@/components/home/JourneyToOwnership';
import LandscapeVideo from '@/components/home/LandscapeVideo';
import StoriesInsights from '@/components/home/StoriesInsights';
import CustomerExperiences from '@/components/home/CustomerExperiences';
import RedefineLuxury from '@/components/home/RedefineLuxury';
//import Footer from '@/components/home/Footer'; // ✅ Use only Footer now

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
