import { prisma } from '@/lib/prisma';
import GalleryClient, { type GalleryItem } from '@/components/gallery/GalleryClient';

async function getGalleryData() {
  try {
    // Fetch only admin-managed gallery items (independent from properties)
    const galleryItems = await prisma.gallery_items.findMany({
      where: {
        is_active: true,
      },
      orderBy: [
        { display_order: 'asc' },
        { created_at: 'desc' },
      ],
    });

    const images: GalleryItem[] = [];
    const tours: GalleryItem[] = [];

    // Organize gallery items by type (excluding videos)
    galleryItems.forEach((item) => {
      const galleryItem: GalleryItem = {
        id: item.id,
        type: item.type.toLowerCase() as 'image' | 'video' | 'tour',
        title: item.title,
        description: item.description || undefined,
        thumbnail: item.thumbnail || item.media_url,
        mediaUrl: item.media_url,
        location: item.location || 'Plotzed Properties',
      };

      if (item.type === 'IMAGE') {
        images.push(galleryItem);
      } else if (item.type === 'TOUR') {
        tours.push(galleryItem);
      }
      // Videos are excluded from display
    });

    return { images, videos: [], tours };
  } catch (error) {
    console.error('Error fetching gallery data:', error);
    return { images: [], videos: [], tours: [] };
  }
}

export default async function GalleryPage() {
  const { images, videos, tours } = await getGalleryData();

  return <GalleryClient images={images} videos={videos} tours={tours} />;
}
