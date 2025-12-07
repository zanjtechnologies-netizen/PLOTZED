import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkStatus() {
  try {
    console.log('🔍 Checking plot status distribution...\n')

    // Count by status
    const available = await prisma.plots.count({ where: { status: 'AVAILABLE', is_published: true } })
    const booked = await prisma.plots.count({ where: { status: 'BOOKED', is_published: true } })
    const sold = await prisma.plots.count({ where: { status: 'SOLD', is_published: true } })

    console.log('📊 Published Plots by Status:')
    console.log(`  🟢 AVAILABLE: ${available}`)
    console.log(`  🟡 BOOKED: ${booked}`)
    console.log(`  🔴 SOLD: ${sold}`)
    console.log(`  📌 TOTAL: ${available + booked + sold}`)

    // Show all plots with their status
    const plots = await prisma.plots.findMany({
      where: { is_published: true },
      select: {
        id: true,
        title: true,
        slug: true,
        status: true,
        city: true,
        is_featured: true,
      },
      orderBy: { created_at: 'desc' }
    })

    console.log(`\n📋 All Published Plots:\n`)
    plots.forEach((plot, i) => {
      const statusEmoji = plot.status === 'AVAILABLE' ? '🟢' : plot.status === 'BOOKED' ? '🟡' : '🔴'
      const featuredTag = plot.is_featured ? ' ⭐' : ''
      console.log(`${i + 1}. ${statusEmoji} [${plot.status}] ${plot.title}${featuredTag}`)
      console.log(`   City: ${plot.city}`)
      console.log(`   Slug: ${plot.slug}\n`)
    })

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkStatus()
