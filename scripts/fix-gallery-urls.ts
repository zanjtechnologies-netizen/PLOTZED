// Script to fix gallery item URLs from old R2 hostname to new one
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function fixGalleryUrls() {
  try {
    console.log('🔍 Checking gallery items with old URLs...')

    const oldHostname = 'plotzed.b65ec9b1c1faaea81471e55d1504a815.r2.dev'
    const newHostname = 'pub-56b50bd6691b4c6bbabbefee2d6ffeb8.r2.dev'

    // Find all gallery items with old URL
    const items = await prisma.gallery_items.findMany()

    let updatedCount = 0

    for (const item of items) {
      let updated = false
      let newMediaUrl = item.media_url
      let newThumbnail = item.thumbnail

      // Update media_url if it contains old hostname
      if (item.media_url?.includes(oldHostname)) {
        newMediaUrl = item.media_url.replace(oldHostname, newHostname)
        updated = true
      }

      // Update thumbnail if it contains old hostname
      if (item.thumbnail?.includes(oldHostname)) {
        newThumbnail = item.thumbnail.replace(oldHostname, newHostname)
        updated = true
      }

      if (updated) {
        await prisma.gallery_items.update({
          where: { id: item.id },
          data: {
            media_url: newMediaUrl,
            thumbnail: newThumbnail,
          },
        })

        console.log(`✅ Updated: ${item.title}`)
        console.log(`   Old: ${item.media_url}`)
        console.log(`   New: ${newMediaUrl}`)
        updatedCount++
      }
    }

    if (updatedCount === 0) {
      console.log('✅ No gallery items needed updating!')
    } else {
      console.log(`\n✅ Successfully updated ${updatedCount} gallery item(s)!`)
    }

  } catch (error) {
    console.error('❌ Error fixing URLs:', error)
  } finally {
    await prisma.$disconnect()
  }
}

fixGalleryUrls()
