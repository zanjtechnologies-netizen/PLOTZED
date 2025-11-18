// src/app/robots.ts

import { MetadataRoute } from 'next';
import { seoConfig } from '@/lib/seo/config';

/**
 * Dynamic Robots.txt Generation
 * Controls which pages search engines can crawl
 * https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/*',      // Admin panel - private
          '/dashboard/*',  // User dashboard - private
          '/api/*',        // API routes - no need to index
          '/login',        // Auth pages - no SEO value
          '/register',
          '/forgot-password',
          '/reset-password',
          '/verify-email',
          '/404',          // Error pages
          '/500',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: [
          '/',
          '/properties/*',
          '/plots/*',
        ],
        disallow: [
          '/admin/*',
          '/dashboard/*',
          '/api/*',
        ],
      },
      {
        userAgent: 'Bingbot',
        allow: [
          '/',
          '/properties/*',
          '/plots/*',
        ],
        disallow: [
          '/admin/*',
          '/dashboard/*',
          '/api/*',
        ],
      },
    ],
    sitemap: `${seoConfig.siteUrl}/sitemap.xml`,
  };
}
