// src/app/api/testimonials/route.ts - Public API for published testimonials
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured');
    const limit = parseInt(searchParams.get('limit') || '10');

    const where: any = {
      is_published: true,
    };

    if (featured === 'true') {
      where.is_featured = true;
    }

    const testimonials = await prisma.testimonials.findMany({
      where,
      orderBy: [/*{ is_featured: 'desc' },*/ { createdAt: 'desc' }],
      take: limit,
      select: {
        id: true,
        name: true,
        role: true,
        company: true,
        content: true,
        rating: true,
        avatar_url: true,
        //is_featured: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: testimonials,
    });
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch testimonials' },
      { status: 500 }
    );
  }
}
