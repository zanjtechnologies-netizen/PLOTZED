// src/lib/seo/metadata.ts

import { Metadata } from 'next';
import { seoConfig, generateTitle, getCanonicalUrl, getAbsoluteUrl } from './config';

/**
 * Page SEO Metadata Interface
 */
export interface PageSeoData {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  path?: string;
  noindex?: boolean;
  nofollow?: boolean;
  type?: 'website' | 'article' | 'product';
  publishedTime?: string;
  modifiedTime?: string;
}

/**
 * Generate metadata for Next.js pages
 */
export function generateMetadata(data: PageSeoData = {}): Metadata {
  const {
    title,
    description = seoConfig.description,
    keywords = seoConfig.keywords,
    image = seoConfig.defaultOgImage,
    path = '',
    noindex = false,
    nofollow = false,
    type = 'website',
    publishedTime,
    modifiedTime,
  } = data;

  const pageTitle = generateTitle(title);
  const canonical = getCanonicalUrl(path);
  const ogImage = image.startsWith('http') ? image : getAbsoluteUrl(image);

  return {
    title: pageTitle,
    description,
    keywords: keywords.join(', '),

    // Basic Meta Tags
    metadataBase: new URL(seoConfig.siteUrl),
    alternates: {
      canonical,
    },

    // Robots
    robots: {
      index: !noindex,
      follow: !nofollow,
      googleBot: {
        index: !noindex,
        follow: !nofollow,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },

    // Open Graph
    openGraph: {
      type,
      locale: 'en_US',
      url: canonical,
      title: pageTitle,
      description,
      siteName: seoConfig.siteName,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title || seoConfig.defaultTitle,
        },
      ],
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
    },

    // Twitter Card
    twitter: {
      card: 'summary_large_image',
      site: seoConfig.social.twitter,
      creator: seoConfig.social.twitter,
      title: pageTitle,
      description,
      images: [ogImage],
    },

    // Additional Meta Tags
    other: {
      'og:phone_number': seoConfig.contact.phone,
      'og:email': seoConfig.contact.email,
    },
  };
}

/**
 * Generate metadata for property listing pages
 */
export interface PropertySeoData {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  type: string;
  images?: string[];
  squareFeet?: number;
  bedrooms?: number;
  bathrooms?: number;
  availability?: 'available' | 'sold' | 'reserved';
}

export function generatePropertyMetadata(property: PropertySeoData): Metadata {
  const propertyTitle = `${property.title} - ${property.type} in ${property.location}`;
  const propertyDescription = `${property.description.substring(0, 150)}... | Starting from ₹${property.price.toLocaleString()} | ${property.squareFeet || ''} sq.ft | ${property.availability === 'available' ? 'Available Now' : property.availability}`;

  const keywords = [
    property.type,
    property.location,
    'property for sale',
    'real estate',
    `${property.type} in ${property.location}`,
    ...seoConfig.keywords,
  ];

  return generateMetadata({
    title: propertyTitle,
    description: propertyDescription,
    keywords,
    image: property.images?.[0] || seoConfig.defaultOgImage,
    path: `/properties/${property.id}`,
    type: 'product',
  });
}

/**
 * Generate metadata for blog/article pages
 */
export interface ArticleSeoData {
  title: string;
  description: string;
  author: string;
  publishedTime: string;
  modifiedTime?: string;
  image?: string;
  tags?: string[];
  slug: string;
}

export function generateArticleMetadata(article: ArticleSeoData): Metadata {
  return generateMetadata({
    title: article.title,
    description: article.description,
    keywords: article.tags || seoConfig.keywords,
    image: article.image || seoConfig.defaultOgImage,
    path: `/blog/${article.slug}`,
    type: 'article',
    publishedTime: article.publishedTime,
    modifiedTime: article.modifiedTime || article.publishedTime,
  });
}

/**
 * Generate metadata for search/listing pages
 */
export interface ListingSeoData {
  type?: string;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  count?: number;
}

export function generateListingMetadata(data: ListingSeoData = {}): Metadata {
  const { type, location, minPrice, maxPrice, count } = data;

  let title = 'Properties for Sale';
  let description = 'Browse our collection of premium properties';

  if (type && location) {
    title = `${type}s for Sale in ${location}`;
    description = `Find the best ${type.toLowerCase()}s in ${location}. ${count ? `${count} properties available` : 'Multiple options available'}`;
  } else if (type) {
    title = `${type}s for Sale`;
    description = `Explore our exclusive ${type.toLowerCase()} listings. ${count ? `${count} properties available` : 'Premium options available'}`;
  } else if (location) {
    title = `Properties for Sale in ${location}`;
    description = `Discover premium properties in ${location}. ${count ? `${count} listings available` : 'Multiple options available'}`;
  }

  if (minPrice || maxPrice) {
    const priceRange = minPrice && maxPrice
      ? `₹${minPrice.toLocaleString()} - ₹${maxPrice.toLocaleString()}`
      : minPrice
      ? `Starting from ₹${minPrice.toLocaleString()}`
      : `Up to ₹${maxPrice.toLocaleString()}`;
    description += ` | ${priceRange}`;
  }

  return generateMetadata({
    title,
    description,
    path: '/properties',
  });
}

/**
 * Generate JSON-LD structured data
 */
export function generateJsonLd<T>(data: T): string {
  return JSON.stringify(data, null, 2);
}

/**
 * Validate meta description length
 */
export function validateMetaDescription(description: string): {
  isValid: boolean;
  length: number;
  recommendation: string;
} {
  const length = description.length;
  const ideal = length >= 120 && length <= 160;
  const acceptable = length >= 100 && length <= 200;

  return {
    isValid: acceptable,
    length,
    recommendation: ideal
      ? 'Perfect length!'
      : length < 100
      ? 'Too short. Aim for 120-160 characters.'
      : 'Too long. Keep it under 160 characters.',
  };
}

/**
 * Validate meta title length
 */
export function validateMetaTitle(title: string): {
  isValid: boolean;
  length: number;
  recommendation: string;
} {
  const length = title.length;
  const ideal = length >= 50 && length <= 60;
  const acceptable = length >= 40 && length <= 70;

  return {
    isValid: acceptable,
    length,
    recommendation: ideal
      ? 'Perfect length!'
      : length < 40
      ? 'Too short. Aim for 50-60 characters.'
      : 'Too long. Keep it under 60 characters to avoid truncation.',
  };
}

/**
 * Extract keywords from content
 */
export function extractKeywords(content: string, maxKeywords: number = 10): string[] {
  // Remove HTML tags
  const text = content.replace(/<[^>]*>/g, ' ');

  // Convert to lowercase and split into words
  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter((word) => word.length > 3);

  // Count word frequency
  const frequency: Record<string, number> = {};
  words.forEach((word) => {
    frequency[word] = (frequency[word] || 0) + 1;
  });

  // Sort by frequency and return top keywords
  return Object.entries(frequency)
    .sort(([, a], [, b]) => b - a)
    .slice(0, maxKeywords)
    .map(([word]) => word);
}

/**
 * Generate breadcrumb list for structured data
 */
export interface BreadcrumbItem {
  name: string;
  path: string;
}

export function generateBreadcrumbList(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: getAbsoluteUrl(item.path),
    })),
  };
}
