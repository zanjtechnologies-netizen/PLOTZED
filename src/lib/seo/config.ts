// src/lib/seo/config.ts

/**
 * SEO Configuration for Plotzed Real Estate
 * Central configuration for all SEO-related settings
 */

export const seoConfig = {
  // Site Information
  siteName: 'Plotzed Real Estate',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://plotzedrealestate.com',
  description: 'Discover premium residential plots and villas in prime locations. Expert real estate developers offering transparent pricing, site visits, and hassle-free ownership.',

  // Default Meta Tags
  defaultTitle: 'Plotzed Real Estate - Premium Plots & Villas',
  titleTemplate: '%s | Plotzed Real Estate',

  // Social Media
  social: {
    twitter: '@plotzedrealestate',
    facebook: 'plotzedrealestate',
    instagram: 'plotzedrealestate',
    linkedin: 'company/plotzed-real-estate',
  },

  // Contact Information (for Schema.org)
  contact: {
    phone: '+1 40 9999909',
    email: 'reservations@plotzedrealestate.com',
    address: {
      streetAddress: '',
      addressLocality: '',
      addressRegion: '',
      postalCode: '',
      addressCountry: 'US',
    },
  },

  // Default Open Graph Image
  defaultOgImage: '/images/og-default.jpg',

  // Logo
  logo: '/images/hero-logo.svg',

  // Business Information
  business: {
    name: 'Plotzed Real Estate Developers',
    legalName: 'Plotzed Real Estate Developers LLC',
    foundingDate: '2020',
    priceRange: '₹₹₹',
    openingHours: 'Mo-Su 09:00-18:00',
  },

  // SEO Keywords
  keywords: [
    'real estate',
    'plots for sale',
    'residential plots',
    'villas',
    'premium properties',
    'land investment',
    'property developers',
    'real estate developers',
    'site visits',
    'property booking',
  ],

  // Robots Configuration
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // Sitemap Configuration
  sitemap: {
    changefreq: {
      homepage: 'daily' as const,
      properties: 'weekly' as const,
      pages: 'monthly' as const,
    },
    priority: {
      homepage: 1.0,
      properties: 0.9,
      propertyDetails: 0.8,
      pages: 0.7,
    },
  },

  // Core Web Vitals Thresholds
  webVitals: {
    lcp: {
      good: 2500,
      needsImprovement: 4000,
    },
    fid: {
      good: 100,
      needsImprovement: 300,
    },
    cls: {
      good: 0.1,
      needsImprovement: 0.25,
    },
  },
} as const;

/**
 * Get absolute URL
 */
export function getAbsoluteUrl(path: string): string {
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  // Remove trailing slash from siteUrl
  const baseUrl = seoConfig.siteUrl.replace(/\/$/, '');
  return `${baseUrl}/${cleanPath}`;
}

/**
 * Get canonical URL for a page
 */
export function getCanonicalUrl(path: string): string {
  return getAbsoluteUrl(path);
}

/**
 * Generate page title with template
 */
export function generateTitle(pageTitle?: string): string {
  if (!pageTitle) {
    return seoConfig.defaultTitle;
  }
  return seoConfig.titleTemplate.replace('%s', pageTitle);
}
