import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const galleryItemSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  type: z.enum(['IMAGE', 'TOUR']),
  media_url: z.string().url('Valid URL is required'),
  thumbnail: z.string().url().optional().or(z.literal('')),
  location: z.string().optional(),
  plot_id: z.string().optional(),
  is_active: z.boolean().optional(),
  display_order: z.number().optional(),
});

// GET - List all gallery items
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const isActive = searchParams.get('is_active');

    const where: any = {};
    if (type && ['IMAGE', 'TOUR'].includes(type)) {
      where.type = type;
    }
    if (isActive !== null) {
      where.is_active = isActive === 'true';
    }

    const items = await prisma.gallery_items.findMany({
      where,
      orderBy: [
        { display_order: 'asc' },
        { created_at: 'desc' },
      ],
    });

    return NextResponse.json({
      success: true,
      data: items,
    });
  } catch (error) {
    console.error('Error fetching gallery items:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch gallery items' },
      { status: 500 }
    );
  }
}

// POST - Create new gallery item
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = galleryItemSchema.parse(body);

    // Auto-generate thumbnail for YouTube tours
    let thumbnail = validatedData.thumbnail;
    if (!thumbnail && validatedData.type === 'TOUR') {
      // Extract video ID from various YouTube URL formats (including Shorts)
      const videoId = validatedData.media_url.match(
        /(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
      )?.[1];

      if (videoId) {
        thumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
      }
    }

    const item = await prisma.gallery_items.create({
      data: {
        ...validatedData,
        thumbnail: thumbnail || validatedData.thumbnail,
      },
    });

    return NextResponse.json({
      success: true,
      data: item,
      message: 'Gallery item created successfully',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.issues[0].message },
        { status: 400 }
      );
    }

    console.error('Error creating gallery item:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create gallery item' },
      { status: 500 }
    );
  }
}

// PUT - Update gallery item
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Item ID is required' },
        { status: 400 }
      );
    }

    const validatedData = galleryItemSchema.partial().parse(data);

    // Auto-generate thumbnail for YouTube tours if not provided
    let thumbnail = validatedData.thumbnail;
    if (!thumbnail && validatedData.media_url && data.type === 'TOUR') {
      // Extract video ID from various YouTube URL formats (including Shorts)
      const videoId = validatedData.media_url.match(
        /(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
      )?.[1];

      if (videoId) {
        thumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
      }
    }

    const item = await prisma.gallery_items.update({
      where: { id },
      data: {
        ...validatedData,
        ...(thumbnail && { thumbnail }),
      },
    });

    return NextResponse.json({
      success: true,
      data: item,
      message: 'Gallery item updated successfully',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.issues[0].message },
        { status: 400 }
      );
    }

    console.error('Error updating gallery item:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update gallery item' },
      { status: 500 }
    );
  }
}

// DELETE - Delete gallery item
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Item ID is required' },
        { status: 400 }
      );
    }

    await prisma.gallery_items.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Gallery item deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting gallery item:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete gallery item' },
      { status: 500 }
    );
  }
}
