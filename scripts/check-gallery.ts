import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkGallery() {
  const items = await prisma.gallery_items.findMany({
    select: {
      id: true,
      title: true,
      type: true,
      media_url: true,
      thumbnail: true,
    }
  })

  console.log('Gallery Items:')
  console.log(JSON.stringify(items, null, 2))

  await prisma.$disconnect()
}

checkGallery()
