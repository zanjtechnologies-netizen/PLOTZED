import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkSubscriptions() {
  try {
    console.log('📧 Checking newsletter subscriptions...\n')

    // Count total subscriptions
    const totalSubs = await prisma.newsletter_subscriptions.count()
    const activeSubs = await prisma.newsletter_subscriptions.count({
      where: { is_active: true }
    })

    console.log(`Total subscriptions: ${totalSubs}`)
    console.log(`Active subscriptions: ${activeSubs}\n`)

    // Show recent subscriptions
    const recentSubs = await prisma.newsletter_subscriptions.findMany({
      orderBy: { subscribed_at: 'desc' },
      take: 5,
    })

    if (recentSubs.length > 0) {
      console.log('Recent subscriptions:')
      recentSubs.forEach((sub, i) => {
        console.log(`\n${i + 1}. ${sub.email}`)
        console.log(`   Source: ${sub.source || 'N/A'}`)
        console.log(`   Active: ${sub.is_active}`)
        console.log(`   Subscribed: ${sub.subscribed_at.toISOString().split('T')[0]}`)
      })
    } else {
      console.log('No subscriptions found.')
    }
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkSubscriptions()
