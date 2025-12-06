// ================================================
// src/app/api/admin/property-images/route.ts
// ================================================
export const runtime = "nodejs";

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    // Check authentication and admin role
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Admin access required' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { slug, imageUrls, action } = body;

    if (!slug || !imageUrls || !Array.isArray(imageUrls)) {
      return NextResponse.json(
        { success: false, error: 'Invalid request data' },
        { status: 400 }
      );
    }

    // Find the property
    const existingPlot = await prisma.plots.findUnique({
      where: { slug },
      select: { id: true, images: true },
    });

    if (!existingPlot) {
      return NextResponse.json(
        { success: false, error: `Property with slug "${slug}" not found` },
        { status: 404 }
      );
    }

    // Update images based on action
    let updatedImages: string[];

    if (action === 'replace') {
      // Replace all existing images
      updatedImages = imageUrls;
    } else {
      // Default: add to existing images
      const currentImages = existingPlot.images || [];
      updatedImages = [...currentImages, ...imageUrls];
    }

    // Update the plot
    const updatedPlot = await prisma.plots.update({
      where: { slug },
      data: {
        images: updatedImages,
        updated_at: new Date(),
      },
      select: {
        id: true,
        slug: true,
        title: true,
        images: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        plot: updatedPlot,
        imageCount: updatedImages.length,
        addedCount: imageUrls.length,
      },
      message: `Successfully updated images for ${slug}`,
    });

  } catch (error) {
    console.error('Error updating property images:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update property images' },
      { status: 500 }
    );
  }
}

// GET - Fetch current images for a property
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (!slug) {
      return NextResponse.json(
        { success: false, error: 'Slug parameter required' },
        { status: 400 }
      );
    }

    const plot = await prisma.plots.findUnique({
      where: { slug },
      select: {
        id: true,
        slug: true,
        title: true,
        images: true,
      },
    });

    if (!plot) {
      return NextResponse.json(
        { success: false, error: 'Property not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        plot,
        imageCount: plot.images?.length || 0,
      },
    });

  } catch (error) {
    console.error('Error fetching property images:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch property images' },
      { status: 500 }
    );
  }
}
