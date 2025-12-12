import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function fixTourThumbnails() {
  console.log('🔍 Finding tour items without thumbnails...')

  const tours = await prisma.gallery_items.findMany({
    where: {
      type: 'TOUR',
      OR: [
        { thumbnail: null },
        { thumbnail: '' }
      ]
    }
  })

  console.log(`Found ${tours.length} tour(s) without thumbnails`)

  for (const tour of tours) {
    console.log(`\n📹 Processing: ${tour.title}`)
    console.log(`   URL: ${tour.media_url}`)

    // Extract video ID from YouTube URL (including Shorts)
    const videoId = tour.media_url.match(
      /(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    )?.[1]

    if (videoId) {
      const thumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`

      await prisma.gallery_items.update({
        where: { id: tour.id },
        data: { thumbnail }
      })

      console.log(`   ✅ Thumbnail added: ${thumbnail}`)
    } else {
      console.log(`   ⚠️  Could not extract video ID from URL`)
    }
  }

  console.log('\n✅ Done!')
  await prisma.$disconnect()
}

fixTourThumbnails()
