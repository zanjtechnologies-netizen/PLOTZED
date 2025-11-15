// ================================================
// src/app/api/admin/backups/status/route.ts - Backup Status Monitoring
// ================================================

import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import * as fs from 'fs/promises'
import * as path from 'path'
import { successResponse, withErrorHandling } from '@/lib/api-error-handler'
import { ForbiddenError, UnauthorizedError } from '@/lib/errors'

/**
 * GET /api/admin/backups/status
 * Monitor backup status and health
 *
 * Returns:
 * - Latest backup timestamps for each type
 * - Backup sizes and counts
 * - Backup health status
 * - Warnings if backups are stale
 */
export const GET = withErrorHandling(
  async (request: NextRequest) => {
    const session = await auth()

    if (!session?.user) {
      throw new UnauthorizedError('Please login to view backup status')
    }

    if (session.user.role !== 'ADMIN') {
      throw new ForbiddenError('Admin access required')
    }

    const backupsDir = path.join(process.cwd(), 'backups')

    // Check each backup type
    const types = ['daily', 'weekly', 'monthly']
    const status: any = {
      healthy: true,
      warnings: [],
      backups: {},
    }

    for (const type of types) {
      const typeDir = path.join(backupsDir, type)

      try {
        const files = await fs.readdir(typeDir)
        const backupFiles = files.filter(f => f.endsWith('.sql.gz'))

        if (backupFiles.length === 0) {
          status.healthy = false
          status.warnings.push(`No ${type} backups found`)
          status.backups[type] = {
            count: 0,
            latest: null,
            totalSize: 0,
            status: 'missing',
          }
          continue
        }

        // Get latest backup
        let latestFile: string | null = null
        let latestTime = 0
        let totalSize = 0

        for (const file of backupFiles) {
          const filePath = path.join(typeDir, file)
          const stats = await fs.stat(filePath)
          totalSize += stats.size

          if (stats.mtime.getTime() > latestTime) {
            latestTime = stats.mtime.getTime()
            latestFile = file
          }
        }

        // Check if backup is stale
        const now = Date.now()
        const hoursSinceBackup = (now - latestTime) / (1000 * 60 * 60)

        let staleThreshold: number
        switch (type) {
          case 'daily':
            staleThreshold = 25 // 25 hours
            break
          case 'weekly':
            staleThreshold = 8 * 24 // 8 days
            break
          case 'monthly':
            staleThreshold = 32 * 24 // 32 days
            break
          default:
            staleThreshold = 24
        }

        const isStale = hoursSinceBackup > staleThreshold

        if (isStale) {
          status.healthy = false
          status.warnings.push(
            `${type.charAt(0).toUpperCase() + type.slice(1)} backup is ${Math.floor(hoursSinceBackup)} hours old (threshold: ${staleThreshold} hours)`
          )
        }

        status.backups[type] = {
          count: backupFiles.length,
          latest: latestFile,
          latestTimestamp: new Date(latestTime).toISOString(),
          hoursSinceBackup: Math.floor(hoursSinceBackup),
          totalSize: formatBytes(totalSize),
          totalSizeBytes: totalSize,
          status: isStale ? 'stale' : 'healthy',
          files: backupFiles.map(file => ({
            name: file,
            path: `${type}/${file}`,
          })),
        }
      } catch (error) {
        status.healthy = false
        status.warnings.push(`Failed to check ${type} backups: ${error}`)
        status.backups[type] = {
          count: 0,
          latest: null,
          status: 'error',
        }
      }
    }

    // Add summary
    status.summary = {
      totalBackups:
        (status.backups.daily?.count || 0) +
        (status.backups.weekly?.count || 0) +
        (status.backups.monthly?.count || 0),
      totalSize: formatBytes(
        (status.backups.daily?.totalSizeBytes || 0) +
          (status.backups.weekly?.totalSizeBytes || 0) +
          (status.backups.monthly?.totalSizeBytes || 0)
      ),
      healthStatus: status.healthy ? 'healthy' : 'warning',
      lastCheck: new Date().toISOString(),
    }

    return successResponse(status)
  },
  'GET /api/admin/backups/status'
)

/**
 * Format bytes to human-readable string
 */
function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}
