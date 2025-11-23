// src/lib/seo/schemas/real-estate.ts

import { seoConfig, getAbsoluteUrl } from '../config';

/**
 * Property Data Interface
 */
export interface PropertySchemaData {
  id: string;
  name: string;
  description: string;
  price: number;
  currency?: string;
  images: string[];
  address: {
    streetAddress?: string;
    addressLocality: string;
    addressRegion: string;
    postalCode?: string;
    addressCountry: string;
  };
  geo?: {
    latitude: number;
    longitude: number;
  };
  propertyType: 'Residential' | 'Commercial' | 'Land';
  numberOfRooms?: number;
  numberOfBedrooms?: number;
  numberOfBathroomsTotal?: number;
  floorSize?: {
    value: number;
    unitCode: string; // e.g., "SQM" or "SQF"
  };
  yearBuilt?: number;
  datePosted?: string;
  availability?: 'available' | 'sold' | 'reserved';
  features?: string[];
  ratings?: {
    ratingValue: number;
    reviewCount: number;
  };
}

/**
 * Generate RealEstateListing Schema
 * https://schema.org/RealEstateListing
 */
export function generateRealEstateListingSchema(property: PropertySchemaData) {
  const schema: any = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    '@id': getAbsoluteUrl(`/properties/${property.id}`),

    name: property.name,
    description: property.description,
    url: getAbsoluteUrl(`/properties/${property.id}`),

    // Property Details
    ...generateResidenceSchema(property),

    // Offer Information
    offers: {
      '@type': 'Offer',
      price: property.price,
      priceCurrency: property.currency || 'INR',
      availability:
        property.availability === 'available'
          ? 'https://schema.org/InStock'
          : property.availability === 'sold'
          ? 'https://schema.org/OutOfStock'
          : 'https://schema.org/PreOrder',
      validFrom: property.datePosted,
      seller: {
        '@type': 'RealEstateAgent',
        name: seoConfig.business.name,
        telephone: seoConfig.contact.phone,
        email: seoConfig.contact.email,
      },
    },

    // Images
    image: property.images.map((img) =>
      img.startsWith('http') ? img : getAbsoluteUrl(img)
    ),
  };

  // Add ratings if available
  if (property.ratings) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: property.ratings.ratingValue,
      reviewCount: property.ratings.reviewCount,
    };
  }

  return schema;
}

/**
 * Generate Residence/Apartment Schema
 * https://schema.org/Residence
 */
export function generateResidenceSchema(property: PropertySchemaData) {
  const residence: any = {
    '@type':
      property.propertyType === 'Land'
        ? 'LandParcel'
        : property.propertyType === 'Commercial'
        ? 'Place'
        : 'Residence',

    // Address
    address: {
      '@type': 'PostalAddress',
      streetAddress: property.address.streetAddress,
      addressLocality: property.address.addressLocality,
      addressRegion: property.address.addressRegion,
      postalCode: property.address.postalCode,
      addressCountry: property.address.addressCountry,
    },
  };

  // Geographic Coordinates
  if (property.geo) {
    residence.geo = {
      '@type': 'GeoCoordinates',
      latitude: property.geo.latitude,
      longitude: property.geo.longitude,
    };
  }

  // Property-specific fields
  if (property.numberOfBedrooms) {
    residence.numberOfBedrooms = property.numberOfBedrooms;
  }
  if (property.numberOfBathroomsTotal) {
    residence.numberOfBathroomsTotal = property.numberOfBathroomsTotal;
  }
  if (property.numberOfRooms) {
    residence.numberOfRooms = property.numberOfRooms;
  }
  if (property.floorSize) {
    residence.floorSize = {
      '@type': 'QuantitativeValue',
      value: property.floorSize.value,
      unitCode: property.floorSize.unitCode,
    };
  }
  if (property.yearBuilt) {
    residence.yearBuilt = property.yearBuilt;
  }

  // Amenities/Features
  if (property.features && property.features.length > 0) {
    residence.amenityFeature = property.features.map((feature) => ({
      '@type': 'LocationFeatureSpecification',
      name: feature,
    }));
  }

  return residence;
}

/**
 * Generate Product Schema for property (alternative approach)
 * Useful for e-commerce style property listings
 */
export function generatePropertyProductSchema(property: PropertySchemaData) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': getAbsoluteUrl(`/properties/${property.id}`),

    name: property.name,
    description: property.description,
    image: property.images.map((img) =>
      img.startsWith('http') ? img : getAbsoluteUrl(img)
    ),
    url: getAbsoluteUrl(`/properties/${property.id}`),

    brand: {
      '@type': 'Brand',
      name: seoConfig.business.name,
    },

    offers: {
      '@type': 'Offer',
      price: property.price,
      priceCurrency: property.currency || 'INR',
      availability:
        property.availability === 'available'
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
      url: getAbsoluteUrl(`/properties/${property.id}`),
      seller: {
        '@type': 'Organization',
        name: seoConfig.business.name,
      },
    },

    ...(property.ratings && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: property.ratings.ratingValue,
        reviewCount: property.ratings.reviewCount,
      },
    }),
  };
}

/**
 * Generate ItemList Schema for property listings page
 */
export function generatePropertyListSchema(properties: PropertySchemaData[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Available Properties',
    description: 'Premium properties for sale by Plotzed Real Estate',
    numberOfItems: properties.length,
    itemListElement: properties.map((property, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'RealEstateListing',
        name: property.name,
        url: getAbsoluteUrl(`/properties/${property.id}`),
        image: property.images[0]
          ? property.images[0].startsWith('http')
            ? property.images[0]
            : getAbsoluteUrl(property.images[0])
          : undefined,
      },
    })),
  };
}

/**
 * Generate Place Schema for a property location
 */
export function generatePlaceSchema(data: {
  name: string;
  description: string;
  address: PropertySchemaData['address'];
  geo?: PropertySchemaData['geo'];
  images?: string[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Place',
    name: data.name,
    description: data.description,

    address: {
      '@type': 'PostalAddress',
      streetAddress: data.address.streetAddress,
      addressLocality: data.address.addressLocality,
      addressRegion: data.address.addressRegion,
      postalCode: data.address.postalCode,
      addressCountry: data.address.addressCountry,
    },

    ...(data.geo && {
      geo: {
        '@type': 'GeoCoordinates',
        latitude: data.geo.latitude,
        longitude: data.geo.longitude,
      },
    }),

    ...(data.images && {
      image: data.images.map((img) =>
        img.startsWith('http') ? img : getAbsoluteUrl(img)
      ),
    }),
  };
}
