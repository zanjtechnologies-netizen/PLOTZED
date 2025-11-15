#!/usr/bin/env tsx
// ================================================
// scripts/cron/cleanup-activity-logs.ts
// Clean up old activity logs to prevent database bloat
// ================================================

/**
 * Scheduled Task: Activity Log Cleanup
 *
 * Purpose:
 * - Delete activity logs older than 90 days
 * - Prevent database bloat
 * - Maintain compliance with data retention policies
 * - Keep recent logs for audit purposes
 *
 * Schedule: Weekly on Sunday at 4:00 AM
 *
 * Usage:
 *   npm run cron:cleanup-logs
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const RETENTION_DAYS = 90 // Keep logs for 90 days

interface CleanupResult {
  deletedLogs: number
  retentionDays: number
  cutoffDate: Date
  duration: number
}

async function cleanupActivityLogs(): Promise<CleanupResult> {
  const startTime = Date.now()

  console.log('╔════════════════════════════════════════════╗')
  console.log('║   ACTIVITY LOG CLEANUP JOB                 ║')
  console.log('╚════════════════════════════════════════════╝')
  console.log()
  console.log(`Started at: ${new Date().toISOString()}`)
  console.log(`Retention period: ${RETENTION_DAYS} days`)
  console.log()

  try {
    const cutoffDate = new Date(Date.now() - RETENTION_DAYS * 24 * 60 * 60 * 1000)

    console.log(`🔍 Deleting logs older than: ${cutoffDate.toISOString()}`)

    const result = await prisma.activityLog.deleteMany({
      where: {
        created_at: { lt: cutoffDate },
      },
    })

    const duration = Date.now() - startTime

    console.log()
    console.log('╔════════════════════════════════════════════╗')
    console.log('║   CLEANUP COMPLETED                        ║')
    console.log('╚════════════════════════════════════════════╝')
    console.log(`   Deleted logs: ${result.count}`)
    console.log(`   Retention: ${RETENTION_DAYS} days`)
    console.log(`   Duration: ${duration}ms`)
    console.log()

    return {
      deletedLogs: result.count,
      retentionDays: RETENTION_DAYS,
      cutoffDate,
      duration,
    }
  } catch (error: any) {
    console.error('❌ Activity log cleanup failed:', error.message)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Execute if run directly
if (require.main === module) {
  cleanupActivityLogs()
    .then(() => {
      process.exit(0)
    })
    .catch((error) => {
      console.error('Fatal error:', error)
      process.exit(1)
    })
}

export { cleanupActivityLogs }
