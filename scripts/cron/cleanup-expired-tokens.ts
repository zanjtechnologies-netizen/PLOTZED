#!/usr/bin/env tsx
// ================================================
// scripts/cron/cleanup-expired-tokens.ts
// Clean up expired verification and reset tokens
// ================================================

/**
 * Scheduled Task: Token Cleanup
 *
 * Purpose:
 * - Remove expired email verification tokens
 * - Remove expired password reset tokens
 * - Prevent database bloat
 * - Improve query performance
 *
 * Schedule: Daily at 3:00 AM
 *
 * Usage:
 *   npm run cron:cleanup-tokens
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface CleanupResult {
  expiredVerificationTokens: number
  expiredResetTokens: number
  totalCleaned: number
  duration: number
}

async function cleanupExpiredTokens(): Promise<CleanupResult> {
  const startTime = Date.now()

  console.log('╔════════════════════════════════════════════╗')
  console.log('║   TOKEN CLEANUP JOB                        ║')
  console.log('╚════════════════════════════════════════════╝')
  console.log()
  console.log(`Started at: ${new Date().toISOString()}`)
  console.log()

  try {
    const now = new Date()

    // Clean up expired email verification tokens
    console.log('🔍 Cleaning expired verification tokens...')
    const verificationResult = await prisma.users.updateMany({
      where: {
        verification_token: { not: null },
        verification_token_expires: { lt: now },
      },
      data: {
        verification_token: null,
        verification_token_expires: null,
      },
    })

    console.log(`   ✅ Cleaned ${verificationResult.count} expired verification tokens`)

    // Clean up expired password reset tokens
    console.log('🔍 Cleaning expired reset tokens...')
    const resetResult = await prisma.users.updateMany({
      where: {
        reset_token: { not: null },
        reset_token_expires: { lt: now },
      },
      data: {
        reset_token: null,
        reset_token_expires: null,
      },
    })

    console.log(`   ✅ Cleaned ${resetResult.count} expired reset tokens`)

    const totalCleaned = verificationResult.count + resetResult.count
    const duration = Date.now() - startTime

    console.log()
    console.log('╔════════════════════════════════════════════╗')
    console.log('║   CLEANUP COMPLETED                        ║')
    console.log('╚════════════════════════════════════════════╝')
    console.log(`   Verification tokens: ${verificationResult.count}`)
    console.log(`   Reset tokens: ${resetResult.count}`)
    console.log(`   Total cleaned: ${totalCleaned}`)
    console.log(`   Duration: ${duration}ms`)
    console.log()

    return {
      expiredVerificationTokens: verificationResult.count,
      expiredResetTokens: resetResult.count,
      totalCleaned,
      duration,
    }
  } catch (error: any) {
    console.error('❌ Token cleanup failed:', error.message)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Execute if run directly
if (require.main === module) {
  cleanupExpiredTokens()
    .then(() => {
      process.exit(0)
    })
    .catch((error) => {
      console.error('Fatal error:', error)
      process.exit(1)
    })
}

export { cleanupExpiredTokens }
