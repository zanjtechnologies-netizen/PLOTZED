// ================================================
// src/app/sitemap.ts - Dynamic Sitemap Generation
// ================================================

import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://plotzed.com'

  // Fetch all published plots
  const plots = await prisma.plot.findMany({
    where: {
      status: {
        in: ['AVAILABLE', 'BOOKED'], // Exclude SOLD from sitemap
      },
    },
    select: {
      id: true,
      updated_at: true,
    },
    orderBy: {
      updated_at: 'desc',
    },
  })

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/plots`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/properties`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/register`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ]

  // Dynamic plot pages
  const plotPages: MetadataRoute.Sitemap = plots.map((plot: { id: string; updated_at: Date }) => ({
    url: `${baseUrl}/plots/${plot.id}`,
    lastModified: plot.updated_at,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [...staticPages, ...plotPages]
}
