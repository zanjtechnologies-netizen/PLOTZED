// src/components/seo/SeoEnhancements.tsx

/**
 * Additional SEO Enhancement Components
 * Place these in the <head> section for better SEO
 */

/**
 * Preconnect to external domains for performance
 */
export function PreconnectDomains() {
  return (
    <>
      {/* Google Services */}
      <link rel="preconnect" href="https://www.googletagmanager.com" />
      <link rel="preconnect" href="https://www.google-analytics.com" />
      <link rel="preconnect" href="https://stats.g.doubleclick.net" />

      {/* Google Fonts */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

      {/* Cloudflare R2 (if using) */}
      <link rel="preconnect" href="https://pub-56b50bd6691b4c6bbabbefee2d6ffeb8.r2.dev" />
    </>
  );
}

/**
 * DNS Prefetch for additional domains
 */
export function DnsPrefetch() {
  return (
    <>
      <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
      <link rel="dns-prefetch" href="https://www.google-analytics.com" />
      <link rel="dns-prefetch" href="https://recaptcha.google.com" />
      <link rel="dns-prefetch" href="https://api.razorpay.com" />
    </>
  );
}

/**
 * Language and regional alternatives
 * Add this when you have multiple language versions
 */
export function AlternateLanguages({ currentPath }: { currentPath: string }) {
  return (
    <>
      <link rel="alternate" hrefLang="en" href={`https://www.plotzedrealestate.com${currentPath}`} />
      <link rel="alternate" hrefLang="x-default" href={`https://www.plotzedrealestate.com${currentPath}`} />
      {/* Add more languages as needed */}
      {/* <link rel="alternate" hrefLang="hi" href={`https://www.plotzedrealestate.com/hi${currentPath}`} /> */}
    </>
  );
}

/**
 * Rich Snippet Helpers
 */

// Price formatting for structured data
export function formatPriceForSchema(price: number, currency: string = 'INR') {
  return {
    '@type': 'MonetaryAmount',
    currency,
    value: price,
  };
}

// Generate offer schema for properties
export function generateOfferSchema(price: number, availability: string = 'InStock') {
  return {
    '@type': 'Offer',
    price,
    priceCurrency: 'INR',
    availability: `https://schema.org/${availability}`,
    priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
  };
}

/**
 * Geolocation coordinates for properties
 * Helps with local SEO
 */
export interface GeoCoordinates {
  latitude: number;
  longitude: number;
}

export function generateGeoSchema(coords: GeoCoordinates) {
  return {
    '@type': 'GeoCoordinates',
    latitude: coords.latitude,
    longitude: coords.longitude,
  };
}

/**
 * Generate Place schema for property locations
 */
export function generatePlaceSchema(
  name: string,
  address: string,
  coords?: GeoCoordinates
) {
  return {
    '@type': 'Place',
    name,
    address: {
      '@type': 'PostalAddress',
      streetAddress: address,
    },
    ...(coords && { geo: generateGeoSchema(coords) }),
  };
}
