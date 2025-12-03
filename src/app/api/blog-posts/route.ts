// src/app/api/blog-posts/route.ts - Public API for published blog posts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const slug = searchParams.get('slug');

    const skip = (page - 1) * limit;

    // Build where clause - only published posts
    const where: any = {
      is_published: true,
    };

    if (category) {
      where.category = category;
    }

    if (slug) {
      const post = await prisma.blog_posts.findUnique({
        where: { slug, is_published: true },
      });

      if (!post) {
        return NextResponse.json(
          { success: false, error: 'Blog post not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: post,
      });
    }

    const [posts, total] = await Promise.all([
      prisma.blog_posts.findMany({
        where,
        orderBy: { published_at: 'desc' },
        skip,
        take: limit,
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          featured_image: true,
          category: true,
          tags: true,
          published_at: true,
          meta_title: true,
          meta_description: true,
        },
      }),
      prisma.blog_posts.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        posts,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch blog posts' },
      { status: 500 }
    );
  }
}
