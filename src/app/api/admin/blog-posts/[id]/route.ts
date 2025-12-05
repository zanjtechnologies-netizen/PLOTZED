// src/app/api/admin/blog-posts/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { promises } from 'dns';

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const preferredRegion = "auto";
const blogPostUpdateSchema = z.object({
  title: z.string().min(1, 'Title is required').optional(),
  slug: z.string().min(1, 'Slug is required').optional(),
  content: z.string().min(1, 'Content is required').optional(),
  excerpt: z.string().optional(),
  featured_image: z.string().optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  meta_title: z.string().optional(),
  meta_description: z.string().optional(),
  is_published: z.boolean().optional(),
});

// GET - Get single blog post
export async function GET(
  request: NextRequest,
  { params }: { params: Promise <{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const blogPost = await prisma.blog_posts.findUnique({
      where: { id: (await params).id },
    });

    if (!blogPost) {
      return NextResponse.json(
        { success: false, error: 'Blog post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: blogPost,
    });
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch blog post' },
      { status: 500 }
    );
  }
}

// PUT - Update blog post
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise <{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const existingPost = await prisma.blog_posts.findUnique({
      where: { id: (await params).id },
    });

    if (!existingPost) {
      return NextResponse.json(
        { success: false, error: 'Blog post not found' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const validatedData = blogPostUpdateSchema.parse(body);

    // Check if slug is being changed and if it conflicts
    if (validatedData.slug && validatedData.slug !== existingPost.slug) {
      const slugExists = await prisma.blog_posts.findUnique({
        where: { slug: validatedData.slug },
      });

      if (slugExists) {
        return NextResponse.json(
          { success: false, error: 'A blog post with this slug already exists' },
          { status: 400 }
        );
      }
    }

    // Update published_at if publishing status changes
    const updateData: any = {
      ...validatedData,
    };

    if (validatedData.is_published && !existingPost.is_published) {
      updateData.published_at = new Date();
    } else if (validatedData.is_published === false && existingPost.is_published) {
      updateData.published_at = null;
    }

    const blogPost = await prisma.blog_posts.update({
      where: { id: (await params).id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      data: blogPost,
      message: 'Blog post updated successfully',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.issues[0].message },
        { status: 400 }
      );
    }

    console.error('Error updating blog post:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update blog post' },
      { status: 500 }
    );
  }
}

// DELETE - Delete blog post
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise <{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const existingPost = await prisma.blog_posts.findUnique({
      where: { id: (await params).id },
    });

    if (!existingPost) {
      return NextResponse.json(
        { success: false, error: 'Blog post not found' },
        { status: 404 }
      );
    }

    await prisma.blog_posts.delete({
      where: { id: (await params).id },
    });

    return NextResponse.json({
      success: true,
      message: 'Blog post deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete blog post' },
      { status: 500 }
    );
  }
}
