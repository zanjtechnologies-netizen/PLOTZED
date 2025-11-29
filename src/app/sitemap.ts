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

    // TODO: Add properties to sitemap when Property model is created
    // For now, we only include plots
    // const propertyPages: MetadataRoute.Sitemap = [];

    // Combine all pages
    return [...staticPages, ...plotPages];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    // Return static pages if database query fails
    return staticPages;
  }
}
