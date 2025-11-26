import HeroSection from '@/components/home/HeroSection';
import FeaturedListings from '@/components/home/FeaturedListings';
import BookingExperience from '@/components/home/BookingExperience';
import JourneyToOwnership from '@/components/home/JourneyToOwnership';
import LandscapeVideo from '@/components/home/LandscapeVideo';
import StoriesInsights from '@/components/home/StoriesInsights';
import CustomerExperiences from '@/components/home/CustomerExperiences';
import RedefineLuxury from '@/components/home/RedefineLuxury';
import { ChatBot, WhatsAppButton } from '@/components/chat';

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
      {/* Hero (layout_M1YPX) */}
      <HeroSection />

      {/* DestinationsSection background gradient fill_OCQIKX with padding layout_5IFD3D */}
      <section
        style={{
          padding: "96px 123.2px 0px 123.2px",
          background:
            "linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(249,250,251,1) 100%)",
        }}
      >
        <FeaturedListings />
      </section>

      {/* BookingsSection layout_543I5W with white fill */}
      <section
        style={{
          padding: "96px 155.2px 0px 155.2px",
          gap: "64px",
          background: "#FFFFFF",
        }}
      >
        <BookingExperience />
        <JourneyToOwnership />
      </section>

      {/* VideoBanner layout_PL6TQW */}
      <section
        style={{
          padding: "96px 155.2px 0px 155.2px",
          gap: "48px",
          background: "#FFFFFF",
        }}
      >
        <LandscapeVideo />
      </section>

      {/* BlogSection fill_SDZOLB (#112250) */}
      <section style={{ background: "#112250" }}>
        <div className="container-custom py-16 md:py-24">
          <StoriesInsights />
        </div>
      </section>

      {/* TestimonialsSection gradient fill_TBM4LT with padding layout_HOSBY7 */}
      <section
        style={{
          padding: "96px 123.2px 0px 123.2px",
          background:
            "linear-gradient(180deg, rgba(249,250,251,1) 0%, rgba(255,255,255,1) 100%)",
        }}
      >
        <CustomerExperiences />
      </section>

      {/* AboutSection fill_OCQIKX with padding layout_5RM73D */}
      <section
        style={{
          padding: "96px 123.2px 0px 123.2px",
          background:
            "linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(249,250,251,1) 100%)",
        }}
      >
        <RedefineLuxury />
      </section>
      </div>
    </>
  );
}
