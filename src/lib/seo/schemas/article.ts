// src/lib/seo/schemas/article.ts

import { seoConfig, getAbsoluteUrl } from '../config';

/**
 * Article Data Interface
 */
export interface ArticleSchemaData {
  title: string;
  description: string;
  content: string;
  author: {
    name: string;
    url?: string;
    image?: string;
  };
  publishedDate: string;
  modifiedDate?: string;
  image?: string;
  tags?: string[];
  slug: string;
}

/**
 * Generate Article Schema (Schema.org)
 * https://schema.org/Article
 */
export function generateArticleSchema(article: ArticleSchemaData) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': getAbsoluteUrl(`/blog/${article.slug}`),

    headline: article.title,
    description: article.description,
    image: article.image
      ? article.image.startsWith('http')
        ? article.image
        : getAbsoluteUrl(article.image)
      : getAbsoluteUrl(seoConfig.defaultOgImage),

    datePublished: article.publishedDate,
    dateModified: article.modifiedDate || article.publishedDate,

    author: {
      '@type': 'Person',
      name: article.author.name,
      ...(article.author.url && { url: article.author.url }),
      ...(article.author.image && {
        image: article.author.image.startsWith('http')
          ? article.author.image
          : getAbsoluteUrl(article.author.image),
      }),
    },

    publisher: {
      '@type': 'Organization',
      name: seoConfig.business.name,
      logo: {
        '@type': 'ImageObject',
        url: getAbsoluteUrl(seoConfig.logo),
      },
    },

    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': getAbsoluteUrl(`/blog/${article.slug}`),
    },

    ...(article.tags && article.tags.length > 0 && { keywords: article.tags.join(', ') }),

    inLanguage: 'en-US',
  };
}

/**
 * Generate BlogPosting Schema (more specific than Article)
 * https://schema.org/BlogPosting
 */
export function generateBlogPostingSchema(article: ArticleSchemaData) {
  return {
    ...generateArticleSchema(article),
    '@type': 'BlogPosting',
  };
}

/**
 * Generate NewsArticle Schema (for news/press releases)
 * https://schema.org/NewsArticle
 */
export function generateNewsArticleSchema(article: ArticleSchemaData) {
  return {
    ...generateArticleSchema(article),
    '@type': 'NewsArticle',
  };
}

/**
 * Generate Blog Schema (for the blog listing page)
 */
export function generateBlogSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    '@id': getAbsoluteUrl('/blog'),

    name: 'Plotzed Real Estate Blog',
    description: 'Insights, stories, and updates from Plotzed Real Estate',
    url: getAbsoluteUrl('/blog'),

    publisher: {
      '@type': 'Organization',
      '@id': `${seoConfig.siteUrl}/#organization`,
      name: seoConfig.business.name,
      logo: {
        '@type': 'ImageObject',
        url: getAbsoluteUrl(seoConfig.logo),
      },
    },

    inLanguage: 'en-US',
  };
}

/**
 * Generate FAQ Schema
 * https://schema.org/FAQPage
 */
export interface FaqItem {
  question: string;
  answer: string;
}

export function generateFaqSchema(faqs: FaqItem[]) {
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
 * Generate HowTo Schema (for guides/tutorials)
 * https://schema.org/HowTo
 */
export interface HowToStep {
  name: string;
  text: string;
  image?: string;
}

export function generateHowToSchema(data: {
  name: string;
  description: string;
  steps: HowToStep[];
  totalTime?: string; // ISO 8601 duration format (e.g., "PT30M" for 30 minutes)
  image?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: data.name,
    description: data.description,

    ...(data.image && {
      image: data.image.startsWith('http') ? data.image : getAbsoluteUrl(data.image),
    }),

    ...(data.totalTime && { totalTime: data.totalTime }),

    step: data.steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text,
      ...(step.image && {
        image: step.image.startsWith('http') ? step.image : getAbsoluteUrl(step.image),
      }),
    })),
  };
}
