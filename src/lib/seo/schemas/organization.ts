// src/lib/seo/schemas/organization.ts

import { seoConfig, getAbsoluteUrl } from '../config';

/**
 * Generate Organization Schema (Schema.org)
 * Used for the company/business information
 */
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${seoConfig.siteUrl}/#organization`,
    name: seoConfig.business.name,
    legalName: seoConfig.business.legalName,
    url: seoConfig.siteUrl,
    logo: {
      '@type': 'ImageObject',
      url: getAbsoluteUrl(seoConfig.logo),
      width: 512,
      height: 512,
    },
    image: getAbsoluteUrl(seoConfig.defaultOgImage),
    description: seoConfig.description,

    // Contact Information
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: seoConfig.contact.phone,
        contactType: 'customer service',
        email: seoConfig.contact.email,
        availableLanguage: ['English'],
      },
      {
        '@type': 'ContactPoint',
        telephone: seoConfig.contact.phone,
        contactType: 'sales',
        email: seoConfig.contact.email,
        availableLanguage: ['English'],
      },
    ],

    // Social Media Profiles
    sameAs: [
      `https://twitter.com/${seoConfig.social.twitter.replace('@', '')}`,
      `https://facebook.com/${seoConfig.social.facebook}`,
      `https://instagram.com/${seoConfig.social.instagram}`,
      `https://linkedin.com/${seoConfig.social.linkedin}`,
    ],

    // Address
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
 * Generate Local Business Schema
 * More specific for real estate businesses
 */
export function generateLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    '@id': `${seoConfig.siteUrl}/#realestate`,
    name: seoConfig.business.name,
    image: getAbsoluteUrl(seoConfig.defaultOgImage),
    description: seoConfig.description,
    url: seoConfig.siteUrl,

    telephone: seoConfig.contact.phone,
    email: seoConfig.contact.email,

    priceRange: seoConfig.business.priceRange,
    openingHours: seoConfig.business.openingHours,

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
      // TODO: Add actual coordinates
      latitude: 0,
      longitude: 0,
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
 * Generate Website Schema
 */
export function generateWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${seoConfig.siteUrl}/#website`,
    url: seoConfig.siteUrl,
    name: seoConfig.siteName,
    description: seoConfig.description,
    publisher: {
      '@id': `${seoConfig.siteUrl}/#organization`,
    },

    // Search Action for Google Search Box
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
