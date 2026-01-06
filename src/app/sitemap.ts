// ================================================
// src/app/sitemap.ts - Dynamic Sitemap Generation
// ================================================

import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';
import { seoConfig } from '@/lib/seo/config';

/**
 * Dynamic Sitemap Generation
 * Automatically generates sitemap from database content
 * SEO Benefits:
 * - Helps search engines discover all pages
 * - Indicates page update frequency and priority
 * - Improves crawl efficiency
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = seoConfig.siteUrl;

  // Static pages - Core navigation
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: seoConfig.sitemap.changefreq.homepage,
      priority: seoConfig.sitemap.priority.homepage,
    },
    {
      url: `${baseUrl}/properties`,
      lastModified: new Date(),
      changeFrequency: seoConfig.sitemap.changefreq.properties,
      priority: seoConfig.sitemap.priority.properties,
    },
    {
      url: `${baseUrl}/plots`,
      lastModified: new Date(),
      changeFrequency: seoConfig.sitemap.changefreq.properties,
      priority: seoConfig.sitemap.priority.properties,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: seoConfig.sitemap.changefreq.pages,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/visit`,
      lastModified: new Date(),
      changeFrequency: seoConfig.sitemap.changefreq.pages,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/cookie-policy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: seoConfig.sitemap.changefreq.pages,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/register`,
      lastModified: new Date(),
      changeFrequency: seoConfig.sitemap.changefreq.pages,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/dashboard`,
      lastModified: new Date(),
      changeFrequency: seoConfig.sitemap.changefreq.pages,
      priority: seoConfig.sitemap.priority.pages,
    },
  ];

  try {
    // Fetch all published plots (exclude SOLD from public sitemap)
    const plots = await prisma.plots.findMany({
      where: {
        status: {
          in: ['AVAILABLE', 'BOOKED'],
        },
      },
      select: {
        id: true,
        updated_at: true,
      },
      orderBy: {
        updated_at: 'desc',
      },
    });

    // Dynamic plot pages
    const plotPages: MetadataRoute.Sitemap = plots.map((plot) => ({
      url: `${baseUrl}/plots/${plot.id}`,
      lastModified: plot.updated_at,
      changeFrequency: seoConfig.sitemap.changefreq.properties,
      priority: seoConfig.sitemap.priority.propertyDetails,
    }));

    // Fetch all published blog posts
    const blogPosts = await prisma.blog_posts.findMany({
      where: {
        is_published: true,
      },
      select: {
        slug: true,
        updated_at: true,
      },
      orderBy: {
        updated_at: 'desc',
      },
    });

    // Dynamic blog post pages
    const blogPages: MetadataRoute.Sitemap = blogPosts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: post.updated_at,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }));

    // TODO: Add properties to sitemap when Property model is created
    // For now, we only include plots
    // const propertyPages: MetadataRoute.Sitemap = [];

    // Combine all pages
    return [...staticPages, ...plotPages, ...blogPages];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    // Return static pages if database query fails
    return staticPages;
  }
}
