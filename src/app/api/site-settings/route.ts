// src/app/api/site-settings/route.ts - Public API for site settings
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    let settings = await prisma.site_settings.findUnique({
      where: { id: 'global' },
      select: {
        site_name: true,
        tagline: true,
        company_email: true,
        company_phone: true,
        company_address: true,
        whatsapp_number: true,
        facebook_url: true,
        twitter_url: true,
        instagram_url: true,
        linkedin_url: true,
        youtube_url: true,
        about_us: true,
        footer_text: true,
        meta_title: true,
        meta_description: true,
        meta_keywords: true,
        logo_url: true,
        favicon_url: true,
        google_analytics_id: true,
        business_hours: true,
        // Exclude sensitive fields like google_maps_api_key
      },
    });

    // Return default settings if not found
    if (!settings) {
      settings = {
        site_name: 'PLOTZED',
        tagline: 'Your Premium Real Estate Partner',
        company_email: 'plotzedrealestate@gmail.com',
        company_phone: null,
        company_address: 'Pondicherry, India',
        whatsapp_number: null,
        facebook_url: null,
        twitter_url: null,
        instagram_url: null,
        linkedin_url: null,
        youtube_url: null,
        about_us: null,
        footer_text: '© 2025 PLOTZED. All rights reserved.',
        meta_title: 'PLOTZED - Premium Real Estate in Pondicherry',
        meta_description: 'Discover luxury properties and premium plots in Pondicherry',
        meta_keywords: null,
        logo_url: null,
        favicon_url: null,
        google_analytics_id: null,
        business_hours: null,
      };
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
