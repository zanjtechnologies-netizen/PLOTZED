import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function cleanup() {
  console.log('🧹 Starting database cleanup...\n')

  try {
    // Keep only these real properties
    const realPropertySlugs = [
      'casuarina-greens',
      'katumode-greens',
      'house-property-koonimedu',
    ]

    // Keep only the admin user
    const adminEmail = 'plotzedrealestate@gmail.com'

    // Get IDs of real properties to keep
    const realProperties = await prisma.plots.findMany({
      where: {
        slug: {
          in: realPropertySlugs,
        },
      },
      select: { id: true },
    })
    const realPropertyIds = realProperties.map((p) => p.id)

    console.log(`🏘️  Found ${realPropertyIds.length} real properties to keep\n`)

    // 1. Delete ALL inquiries (we'll start fresh)
    console.log('📋 Deleting all inquiries...')
    const deletedInquiries = await prisma.inquiries.deleteMany({})
    console.log(`   ✅ Deleted ${deletedInquiries.count} inquiries\n`)

    // 2. Delete ALL site visits (we'll start fresh)
    console.log('📅 Deleting all site visits...')
    const deletedVisits = await prisma.site_visits.deleteMany({})
    console.log(`   ✅ Deleted ${deletedVisits.count} site visits\n`)

    // 3. Delete all dummy properties
    console.log('🏘️  Deleting dummy properties...')
    const deletedProperties = await prisma.plots.deleteMany({
      where: {
        slug: {
          notIn: realPropertySlugs,
        },
      },
    })
    console.log(`   ✅ Deleted ${deletedProperties.count} dummy properties\n`)

    // 4. Delete all dummy users (keep only admin)
    console.log('👥 Deleting dummy users...')
    const deletedUsers = await prisma.users.deleteMany({
      where: {
        email: {
          not: adminEmail,
        },
      },
    })
    console.log(`   ✅ Deleted ${deletedUsers.count} dummy users\n`)

    console.log('╔════════════════════════════════════════════╗')
    console.log('║   ✅ CLEANUP COMPLETED SUCCESSFULLY        ║')
    console.log('╚════════════════════════════════════════════╝\n')

    console.log('📊 Remaining in database:')
    const remainingUsers = await prisma.users.count()
    const remainingProperties = await prisma.plots.count()
    const remainingVisits = await prisma.site_visits.count()
    const remainingInquiries = await prisma.inquiries.count()

    console.log(`   - Users: ${remainingUsers} (admin only)`)
    console.log(`   - Properties: ${remainingProperties} (real properties only)`)
    console.log(`   - Site Visits: ${remainingVisits}`)
    console.log(`   - Inquiries: ${remainingInquiries}\n`)
  } catch (error) {
    console.error('❌ Error during cleanup:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

cleanup()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
