// src/lib/seo/schemas/index.ts

/**
 * Central export for all Schema.org structured data generators
 */

// Organization Schemas
export {
  generateOrganizationSchema,
  generateLocalBusinessSchema,
  generateWebsiteSchema,
} from './organization';

// Real Estate Schemas
export {
  generateRealEstateListingSchema,
  generateResidenceSchema,
  generatePropertyProductSchema,
  generatePropertyListSchema,
  generatePlaceSchema,
  type PropertySchemaData,
} from './real-estate';

// Article/Blog Schemas
export {
  generateArticleSchema,
  generateBlogPostingSchema,
  generateNewsArticleSchema,
  generateBlogSchema,
  generateFaqSchema,
  generateHowToSchema,
  type ArticleSchemaData,
  type FaqItem,
  type HowToStep,
} from './article';
