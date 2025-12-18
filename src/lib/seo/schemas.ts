// src/lib/seo/schemas.ts

/**
 * Schema.org Structured Data Generators
 * Generates JSON-LD structured data for SEO
 */

import { seoConfig } from './config';

/**
 * Organization Schema
 * Defines the company/organization
 */
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: seoConfig.business.name,
    legalName: seoConfig.business.legalName,
    url: seoConfig.siteUrl,
    logo: `${seoConfig.siteUrl}${seoConfig.logo}`,
    description: seoConfig.description,
    foundingDate: seoConfig.business.foundingDate,
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: seoConfig.contact.phone,
      contactType: 'Customer Service',
      email: seoConfig.contact.email,
      availableLanguage: ['English', 'Hindi'],
    },
    sameAs: [
      `https://twitter.com/${seoConfig.social.twitter.replace('@', '')}`,
      `https://facebook.com/${seoConfig.social.facebook}`,
      `https://instagram.com/${seoConfig.social.instagram}`,
      `https://linkedin.com/${seoConfig.social.linkedin}`,
    ],
    address: {
      '@type': 'PostalAddress',
      streetAddress: seoConfig.contact.address.streetAddress,
      addressLocality: seoConfig.contact.address.addressLocality,
      addressRegion: seoConfig.contact.address.addressRegion,
      postalCode: seoConfig.contact.address.postalCode,
      addressCountry: seoConfig.contact.address.addressCountry,
    },
  };
}

/**
 * Website Schema
 * Defines the website structure
 */
export function generateWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: seoConfig.siteName,
    url: seoConfig.siteUrl,
    description: seoConfig.description,
    publisher: {
      '@type': 'Organization',
      name: seoConfig.business.name,
      logo: {
        '@type': 'ImageObject',
        url: `${seoConfig.siteUrl}${seoConfig.logo}`,
      },
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${seoConfig.siteUrl}/properties?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

/**
 * Local Business Schema
 * For real estate business
 */
export function generateLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    name: seoConfig.business.name,
    image: `${seoConfig.siteUrl}${seoConfig.logo}`,
    '@id': seoConfig.siteUrl,
    url: seoConfig.siteUrl,
    telephone: seoConfig.contact.phone,
    email: seoConfig.contact.email,
    priceRange: seoConfig.business.priceRange,
    address: {
      '@type': 'PostalAddress',
      streetAddress: seoConfig.contact.address.streetAddress,
      addressLocality: seoConfig.contact.address.addressLocality,
      addressRegion: seoConfig.contact.address.addressRegion,
      postalCode: seoConfig.contact.address.postalCode,
      addressCountry: seoConfig.contact.address.addressCountry,
    },
    geo: {
      '@type': 'GeoCoordinates',
      // Add your business coordinates here
      latitude: 0,
      longitude: 0,
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '09:00',
      closes: '18:00',
    },
    sameAs: [
      `https://twitter.com/${seoConfig.social.twitter.replace('@', '')}`,
      `https://facebook.com/${seoConfig.social.facebook}`,
      `https://instagram.com/${seoConfig.social.instagram}`,
      `https://linkedin.com/${seoConfig.social.linkedin}`,
    ],
  };
}

/**
 * Real Estate Listing Schema
 * For individual property pages
 */
export interface PropertySchemaData {
  id: string;
  name: string;
  description: string;
  price: number;
  priceCurrency?: string;
  address: string;
  city: string;
  state?: string;
  postalCode?: string;
  country?: string;
  images: string[];
  floorSize?: {
    value: number;
    unit: string;
  };
  numberOfRooms?: number;
  numberOfBedrooms?: number;
  numberOfBathroomsTotal?: number;
  yearBuilt?: number;
  latitude?: number;
  longitude?: number;
  amenities?: string[];
}

export function generatePropertySchema(property: PropertySchemaData) {
  return {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: property.name,
    description: property.description,
    url: `${seoConfig.siteUrl}/properties/${property.id}`,
    image: property.images.map((img) => (img.startsWith('http') ? img : `${seoConfig.siteUrl}${img}`)),
    offers: {
      '@type': 'Offer',
      price: property.price,
      priceCurrency: property.priceCurrency || 'INR',
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: seoConfig.business.name,
      },
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: property.address,
      addressLocality: property.city,
      addressRegion: property.state || '',
      postalCode: property.postalCode || '',
      addressCountry: property.country || 'IN',
    },
    ...(property.latitude && property.longitude && {
      geo: {
        '@type': 'GeoCoordinates',
        latitude: property.latitude,
        longitude: property.longitude,
      },
    }),
    ...(property.floorSize && {
      floorSize: {
        '@type': 'QuantitativeValue',
        value: property.floorSize.value,
        unitText: property.floorSize.unit,
      },
    }),
    ...(property.numberOfRooms && { numberOfRooms: property.numberOfRooms }),
    ...(property.numberOfBedrooms && { numberOfBedrooms: property.numberOfBedrooms }),
    ...(property.numberOfBathroomsTotal && { numberOfBathroomsTotal: property.numberOfBathroomsTotal }),
    ...(property.yearBuilt && { yearBuilt: property.yearBuilt }),
    ...(property.amenities && { amenityFeature: property.amenities.map((amenity) => ({
      '@type': 'LocationFeatureSpecification',
      name: amenity,
    })) }),
  };
}

/**
 * FAQ Schema
 * For FAQ pages or sections
 */
export interface FAQItem {
  question: string;
  answer: string;
}

export function generateFAQSchema(faqs: FAQItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/**
 * Review/Rating Schema
 * For testimonials and reviews
 */
export interface ReviewSchemaData {
  author: string;
  rating: number;
  reviewBody: string;
  datePublished: string;
}

export function generateReviewSchema(reviews: ReviewSchemaData[]) {
  const aggregateRating = {
    ratingValue: reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length,
    reviewCount: reviews.length,
    bestRating: 5,
    worstRating: 1,
  };

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: seoConfig.business.name,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: aggregateRating.ratingValue.toFixed(1),
      reviewCount: aggregateRating.reviewCount,
      bestRating: aggregateRating.bestRating,
      worstRating: aggregateRating.worstRating,
    },
    review: reviews.map((review) => ({
      '@type': 'Review',
      author: {
        '@type': 'Person',
        name: review.author,
      },
      datePublished: review.datePublished,
      reviewBody: review.reviewBody,
      reviewRating: {
        '@type': 'Rating',
        ratingValue: review.rating,
        bestRating: 5,
        worstRating: 1,
      },
    })),
  };
}

/**
 * Breadcrumb Schema
 * For breadcrumb navigation
 */
export interface BreadcrumbItem {
  name: string;
  url: string;
}

export function generateBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${seoConfig.siteUrl}${item.url}`,
    })),
  };
}

/**
 * Article/Blog Schema
 * For blog posts
 */
export interface ArticleSchemaData {
  headline: string;
  description: string;
  image: string;
  datePublished: string;
  dateModified: string;
  author: string;
  url: string;
}

export function generateArticleSchema(article: ArticleSchemaData) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.headline,
    description: article.description,
    image: article.image.startsWith('http') ? article.image : `${seoConfig.siteUrl}${article.image}`,
    datePublished: article.datePublished,
    dateModified: article.dateModified,
    author: {
      '@type': 'Person',
      name: article.author,
    },
    publisher: {
      '@type': 'Organization',
      name: seoConfig.business.name,
      logo: {
        '@type': 'ImageObject',
        url: `${seoConfig.siteUrl}${seoConfig.logo}`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': article.url.startsWith('http') ? article.url : `${seoConfig.siteUrl}${article.url}`,
    },
  };
}

/**
 * Video Schema
 * For property tour videos
 */
export interface VideoSchemaData {
  name: string;
  description: string;
  thumbnailUrl: string;
  uploadDate: string;
  duration: string; // ISO 8601 duration format (e.g., "PT2M30S" for 2:30)
  contentUrl: string;
  embedUrl?: string;
}

export function generateVideoSchema(video: VideoSchemaData) {
  return {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: video.name,
    description: video.description,
    thumbnailUrl: video.thumbnailUrl.startsWith('http') ? video.thumbnailUrl : `${seoConfig.siteUrl}${video.thumbnailUrl}`,
    uploadDate: video.uploadDate,
    duration: video.duration,
    contentUrl: video.contentUrl,
    ...(video.embedUrl && { embedUrl: video.embedUrl }),
  };
}
