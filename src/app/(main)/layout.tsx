// src/app/(main)/layout.tsx
// Main layout with Header and Footer for regular pages

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CookieConsent from '@/components/cookies/CookieConsent';
import BackToTop from '@/components/common/BackToTop';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
      <CookieConsent />
      <BackToTop />
    </div>
  );
}
