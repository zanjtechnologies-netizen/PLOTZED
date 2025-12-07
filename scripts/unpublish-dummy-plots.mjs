// ================================================
// Script to unpublish dummy plot listings
// Keeps only the 3 main properties with real images
// ================================================

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🧹 Unpublishing dummy plot listings...\n')

  // The 3 plots to keep published (have real images)
  const keepPublished = [
    'casuarina-greens',
    'katumode-greens',
    'house-property-koonimedu',
  ]

  // Unpublish all plots except the 3 main ones
  const result = await prisma.plots.updateMany({
    where: {
      slug: {
        notIn: keepPublished,
      },
      is_published: true, // Only update currently published plots
    },
    data: {
      is_published: false,
      updated_at: new Date(),
    },
  })

  console.log(`✅ Unpublished ${result.count} dummy plot listings`)
  console.log('\n📊 Keeping published:')
  console.log('   - Casuarina Greens')
  console.log('   - Katumode Greens')
  console.log('   - House Property')
  console.log('\n✨ Production ready!\n')
}

main()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
