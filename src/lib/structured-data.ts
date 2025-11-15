// ================================================
// src/lib/structured-data.ts - JSON-LD Structured Data Helpers
// ================================================

interface Plot {
  id: string
  title: string
  description: string
  price: number
  size: number
  address: string
  city: string
  state: string
  images?: string[]
  property_type?: string
  availability_status?: string
}

/**
 * Generate JSON-LD structured data for a real estate listing
 */
export function generatePlotStructuredData(plot: Plot, baseUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: plot.title,
    description: plot.description,
    url: `${baseUrl}/plots/${plot.id}`,
    offers: {
      '@type': 'Offer',
      price: plot.price,
      priceCurrency: 'INR',
      availability: plot.availability_status === 'AVAILABLE'
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: plot.address,
      addressLocality: plot.city,
      addressRegion: plot.state,
      addressCountry: 'IN',
    },
    ...(plot.images && plot.images.length > 0 && {
      image: plot.images[0],
    }),
    ...(plot.size && {
      floorSize: {
        '@type': 'QuantitativeValue',
        value: plot.size,
        unitCode: 'SQM', // Square meters
      },
    }),
  }
}

/**
 * Generate JSON-LD for organization (for homepage)
 */
export function generateOrganizationStructuredData(baseUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    name: 'Plotzed',
    description: 'Premium real estate plots and luxury properties',
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      telephone: '+91-XXXXXXXXXX', // Replace with actual phone
      email: 'info@plotzed.com',
    },
    sameAs: [
      // Add social media URLs here
      // 'https://facebook.com/plotzed',
      // 'https://twitter.com/plotzed',
      // 'https://instagram.com/plotzed',
    ],
  }
}

/**
 * Generate breadcrumb structured data
 */
export function generateBreadcrumbStructuredData(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

/**
 * Convert structured data to JSON-LD string
 * Usage: <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: toJsonLdString(data) }} />
 */
export function toJsonLdString(data: any): string {
  return JSON.stringify(data)
}
