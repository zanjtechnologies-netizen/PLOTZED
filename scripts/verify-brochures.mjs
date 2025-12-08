import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const plots = await prisma.plots.findMany({
    where: { is_published: true },
    select: {
      slug: true,
      title: true,
      brochure: true,
      is_featured: true,
    }
  })

  console.log('\n📋 Published Plots Brochure Status:\n')
  
  plots.forEach(plot => {
    const icon = plot.is_featured ? '⭐' : '📄'
    const status = plot.brochure ? '✅' : '❌'
    console.log(`${icon} ${status} ${plot.title}`)
    if (plot.brochure) {
      console.log(`   └─ ${plot.brochure}`)
    }
  })
}

main().finally(() => prisma.$disconnect())
