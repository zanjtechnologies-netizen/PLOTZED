// src/app/visit/layout.tsx
// Landing page layout - no header/footer, just metadata

import type { Metadata } from 'next';

// Landing page specific metadata
export const metadata: Metadata = {
  title: 'Schedule Free Site Visit | Premium Plots | Plotzed Real Estate',
  description:
    'Book your free site visit to explore premium plots. Zero brokerage, prime locations. Starting at your Budget.',
  keywords: [
    'site visit',
    'premium plots',
    'RERA approved',
    'zero brokerage',
    'land investment',
    'residential plots',
    'book site visit',
  ],
  openGraph: {
    title: 'Schedule Free Site Visit | Plotzed Real Estate',
    description:
      'Book your free site visit to explore premium RERA-approved plots. Zero brokerage, flexible EMI.',
    type: 'website',
    images: [
      {
        url: '/images/og-landing.jpg',
        width: 1200,
        height: 630,
        alt: 'Plotzed Real Estate - Premium Plots',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Schedule Free Site Visit | Plotzed Real Estate',
    description: 'Book your free site visit to explore premium RERA-approved plots.',
    images: ['/images/og-landing.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

// Simple layout wrapper - no html/body (inherited from root)
// This layout doesn't include Header/Footer for landing page isolation
export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
