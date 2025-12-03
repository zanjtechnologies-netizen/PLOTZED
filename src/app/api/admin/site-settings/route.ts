// src/app/api/admin/site-settings/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const siteSettingsSchema = z.object({
  site_name: z.string().optional(),
  tagline: z.string().optional(),
  company_email: z.string().email().optional().or(z.literal('')),
  company_phone: z.string().optional(),
  company_address: z.string().optional(),
  whatsapp_number: z.string().optional(),
  facebook_url: z.string().url().optional().or(z.literal('')),
  twitter_url: z.string().url().optional().or(z.literal('')),
  instagram_url: z.string().url().optional().or(z.literal('')),
  linkedin_url: z.string().url().optional().or(z.literal('')),
  youtube_url: z.string().url().optional().or(z.literal('')),
  about_us: z.string().optional(),
  footer_text: z.string().optional(),
  meta_title: z.string().optional(),
  meta_description: z.string().optional(),
  meta_keywords: z.string().optional(),
  logo_url: z.string().url().optional().or(z.literal('')),
  favicon_url: z.string().url().optional().or(z.literal('')),
  google_analytics_id: z.string().optional(),
  google_maps_api_key: z.string().optional(),
  business_hours: z.any().optional(),
  settings: z.any().optional(),
});

// GET - Get site settings
export async function GET(request: NextRequest) {
  try {
    let settings = await prisma.site_settings.findUnique({
      where: { id: 'global' },
    });

    // If settings don't exist, create default settings
    if (!settings) {
      settings = await prisma.site_settings.create({
        data: {
          id: 'global',
          site_name: 'PLOTZED',
          tagline: 'Your Premium Real Estate Partner',
          company_email: 'plotzedrealestate@gmail.com',
          company_phone: '+91 XXXX XXXXXX',
          company_address: 'Pondicherry, India',
          footer_text: '© 2025 PLOTZED. All rights reserved.',
          meta_title: 'PLOTZED - Premium Real Estate in Pondicherry',
          meta_description: 'Discover luxury properties and premium plots in Pondicherry',
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: settings,
    });
  } catch (error) {
    console.error('Error fetching site settings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch site settings' },
      { status: 500 }
    );
  }
}

// PUT - Update site settings
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = siteSettingsSchema.parse(body);

    // Ensure settings exist
    let existingSettings = await prisma.site_settings.findUnique({
      where: { id: 'global' },
    });

    if (!existingSettings) {
      // Create if doesn't exist
      const settings = await prisma.site_settings.create({
        data: {
          id: 'global',
          ...validatedData,
        },
      });

      return NextResponse.json({
        success: true,
        data: settings,
        message: 'Site settings created successfully',
      });
    }

    // Update existing settings
    const settings = await prisma.site_settings.update({
      where: { id: 'global' },
      data: {
        ...validatedData,
      },
    });

    return NextResponse.json({
      success: true,
      data: settings,
      message: 'Site settings updated successfully',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.issues[0].message },
        { status: 400 }
      );
    }

    console.error('Error updating site settings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update site settings' },
      { status: 500 }
    );
  }
}
