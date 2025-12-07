import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkPlots() {
  try {
    console.log('🔍 Checking plots in database...\n')

    // Count all plots
    const totalPlots = await prisma.plots.count()
    console.log(`Total plots in database: ${totalPlots}`)

    if (totalPlots === 0) {
      console.log('❌ No plots found in database!')
      return
    }

    // Count published vs unpublished
    const publishedCount = await prisma.plots.count({
      where: { is_published: true }
    })
    const unpublishedCount = await prisma.plots.count({
      where: { is_published: false }
    })

    console.log(`\n📊 Publication Status:`)
    console.log(`  ✅ Published: ${publishedCount}`)
    console.log(`  ❌ Unpublished: ${unpublishedCount}`)

    // Show first 5 plots
    const plots = await prisma.plots.findMany({
      take: 5,
      select: {
        id: true,
        title: true,
        slug: true,
        is_published: true,
        is_featured: true,
        status: true,
        city: true,
      },
      orderBy: { created_at: 'desc' }
    })

    console.log(`\n📋 Sample Plots (first 5):`)
    plots.forEach((plot, i) => {
      console.log(`\n${i + 1}. ${plot.title}`)
      console.log(`   ID: ${plot.id}`)
      console.log(`   Slug: ${plot.slug}`)
      console.log(`   Published: ${plot.is_published}`)
      console.log(`   Featured: ${plot.is_featured}`)
      console.log(`   Status: ${plot.status}`)
      console.log(`   City: ${plot.city}`)
    })

  } catch (error) {
    console.error('Error checking plots:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkPlots()
