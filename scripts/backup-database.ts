#!/usr/bin/env tsx
// ================================================
// scripts/backup-database.ts - PostgreSQL Database Backup Script
// ================================================

/**
 * Automated database backup script with compression and retention
 *
 * Features:
 * - Creates compressed PostgreSQL dumps
 * - Uploads to S3/Cloudflare R2 for off-site storage
 * - Implements retention policy (keeps daily for 7 days, weekly for 4 weeks, monthly for 12 months)
 * - Sends notifications on success/failure
 * - Verifies backup integrity
 *
 * Usage:
 *   npm run backup:database
 *   npm run backup:database -- --type=daily
 *   npm run backup:database -- --type=weekly
 *   npm run backup:database -- --type=monthly
 */

import { exec } from 'child_process'
import { promisify } from 'util'
import * as fs from 'fs/promises'
import * as path from 'path'
import { createReadStream, createWriteStream } from 'fs'
import { createGzip } from 'zlib'
import { pipeline } from 'stream/promises'

const execAsync = promisify(exec)

// ================================================
// CONFIGURATION
// ================================================

interface BackupConfig {
  type: 'daily' | 'weekly' | 'monthly'
  databaseUrl: string
  backupDir: string
  s3Bucket?: string
  retention: {
    daily: number // days
    weekly: number // weeks
    monthly: number // months
  }
  notificationEmail?: string
}

const config: BackupConfig = {
  type: (process.argv.find(arg => arg.startsWith('--type='))?.split('=')[1] as any) || 'daily',
  databaseUrl: process.env.DATABASE_URL || '',
  backupDir: path.join(process.cwd(), 'backups'),
  s3Bucket: process.env.BACKUP_S3_BUCKET,
  retention: {
    daily: 7,    // Keep daily backups for 7 days
    weekly: 4,   // Keep weekly backups for 4 weeks
    monthly: 12, // Keep monthly backups for 12 months
  },
  notificationEmail: process.env.BACKUP_NOTIFICATION_EMAIL,
}

// ================================================
// UTILITIES
// ================================================

/**
 * Parse PostgreSQL connection string
 */
function parseDbUrl(url: string): {
  host: string
  port: string
  database: string
  username: string
  password: string
} {
  try {
    const parsed = new URL(url)
    return {
      host: parsed.hostname,
      port: parsed.port || '5432',
      database: parsed.pathname.slice(1),
      username: parsed.username,
      password: parsed.password,
    }
  } catch (error) {
    throw new Error(`Invalid DATABASE_URL: ${error}`)
  }
}

/**
 * Generate backup filename with timestamp
 */
function generateBackupFilename(type: string): string {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  return `plotzed-${type}-backup-${timestamp}.sql`
}

/**
 * Ensure backup directory exists
 */
async function ensureBackupDir(dir: string): Promise<void> {
  try {
    await fs.access(dir)
  } catch {
    await fs.mkdir(dir, { recursive: true })
    console.log(`✅ Created backup directory: ${dir}`)
  }
}

/**
 * Compress SQL file using gzip
 */
async function compressBackup(sqlFile: string): Promise<string> {
  const gzFile = `${sqlFile}.gz`
  const source = createReadStream(sqlFile)
  const destination = createWriteStream(gzFile)
  const gzip = createGzip({ level: 9 }) // Maximum compression

  await pipeline(source, gzip, destination)

  // Delete uncompressed file
  await fs.unlink(sqlFile)

  return gzFile
}

/**
 * Get file size in human-readable format
 */
async function getFileSize(filePath: string): Promise<string> {
  const stats = await fs.stat(filePath)
  const bytes = stats.size
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  if (bytes === 0) return '0 Bytes'
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + ' ' + sizes[i]
}

// ================================================
// BACKUP OPERATIONS
// ================================================

/**
 * Create PostgreSQL database dump
 */
async function createDatabaseDump(config: BackupConfig): Promise<string> {
  const dbConfig = parseDbUrl(config.databaseUrl)
  const filename = generateBackupFilename(config.type)
  const filePath = path.join(config.backupDir, filename)

  console.log(`📦 Creating ${config.type} backup...`)
  console.log(`   Database: ${dbConfig.database}`)
  console.log(`   Host: ${dbConfig.host}:${dbConfig.port}`)

  // Build pg_dump command
  const command = `PGPASSWORD="${dbConfig.password}" pg_dump \
    -h ${dbConfig.host} \
    -p ${dbConfig.port} \
    -U ${dbConfig.username} \
    -d ${dbConfig.database} \
    --format=plain \
    --no-owner \
    --no-acl \
    --verbose \
    --file="${filePath}"`

  try {
    const { stderr } = await execAsync(command)
    if (stderr && !stderr.includes('pg_dump')) {
      console.warn('⚠️  Warnings during backup:', stderr)
    }
    console.log(`✅ Database dump created: ${filename}`)
    return filePath
  } catch (error: any) {
    throw new Error(`Database dump failed: ${error.message}`)
  }
}

/**
 * Verify backup integrity
 */
async function verifyBackup(filePath: string): Promise<boolean> {
  console.log('🔍 Verifying backup integrity...')

  try {
    const content = await fs.readFile(filePath, 'utf8')

    // Check for key PostgreSQL dump markers
    const hasHeader = content.includes('PostgreSQL database dump')
    const hasFooter = content.includes('PostgreSQL database dump complete')
    const hasData = content.length > 1000 // At least 1KB of data

    if (!hasHeader || !hasFooter || !hasData) {
      throw new Error('Backup appears incomplete or corrupted')
    }

    console.log('✅ Backup verification passed')
    return true
  } catch (error: any) {
    console.error('❌ Backup verification failed:', error.message)
    return false
  }
}

/**
 * Upload backup to S3/Cloudflare R2
 */
async function uploadToS3(filePath: string, config: BackupConfig): Promise<void> {
  if (!config.s3Bucket) {
    console.log('⏭️  Skipping S3 upload (no bucket configured)')
    return
  }

  console.log(`☁️  Uploading to S3 bucket: ${config.s3Bucket}`)

  try {
    // Using AWS CLI (ensure it's installed and configured)
    const filename = path.basename(filePath)
    const s3Path = `s3://${config.s3Bucket}/backups/${config.type}/${filename}`

    const command = `aws s3 cp "${filePath}" "${s3Path}" --storage-class STANDARD_IA`

    await execAsync(command)
    console.log(`✅ Uploaded to: ${s3Path}`)
  } catch (error: any) {
    // Don't fail backup if S3 upload fails - local backup still exists
    console.error('⚠️  S3 upload failed (local backup retained):', error.message)
  }
}

/**
 * Clean up old backups based on retention policy
 */
async function cleanOldBackups(config: BackupConfig): Promise<void> {
  console.log('🧹 Cleaning old backups...')

  const typeDir = path.join(config.backupDir, config.type)

  try {
    await fs.access(typeDir)
  } catch {
    console.log('⏭️  No old backups to clean')
    return
  }

  const files = await fs.readdir(typeDir)
  const now = Date.now()

  let retention: number
  let unit: string

  switch (config.type) {
    case 'daily':
      retention = config.retention.daily * 24 * 60 * 60 * 1000 // days to ms
      unit = 'days'
      break
    case 'weekly':
      retention = config.retention.weekly * 7 * 24 * 60 * 60 * 1000 // weeks to ms
      unit = 'weeks'
      break
    case 'monthly':
      retention = config.retention.monthly * 30 * 24 * 60 * 60 * 1000 // months to ms
      unit = 'months'
      break
  }

  let deletedCount = 0

  for (const file of files) {
    const filePath = path.join(typeDir, file)
    const stats = await fs.stat(filePath)
    const age = now - stats.mtime.getTime()

    if (age > retention) {
      await fs.unlink(filePath)
      deletedCount++
      console.log(`   🗑️  Deleted old backup: ${file}`)
    }
  }

  if (deletedCount === 0) {
    console.log(`   ✅ No backups older than ${config.retention[config.type]} ${unit}`)
  } else {
    console.log(`   ✅ Deleted ${deletedCount} old backup(s)`)
  }
}

/**
 * Send notification email
 */
async function sendNotification(
  config: BackupConfig,
  success: boolean,
  details: string
): Promise<void> {
  if (!config.notificationEmail) {
    return
  }

  console.log(`📧 Sending notification to: ${config.notificationEmail}`)

  // TODO: Implement email notification using your email service
  // This is a placeholder - integrate with your existing email system
  console.log('⏭️  Email notification not implemented (add to email service)')
}

// ================================================
// MAIN EXECUTION
// ================================================

async function main() {
  console.log('╔════════════════════════════════════════════╗')
  console.log('║   PLOTZED DATABASE BACKUP SCRIPT           ║')
  console.log('╚════════════════════════════════════════════╝')
  console.log()

  const startTime = Date.now()

  try {
    // Validate configuration
    if (!config.databaseUrl) {
      throw new Error('DATABASE_URL environment variable not set')
    }

    // Ensure backup directory exists
    await ensureBackupDir(config.backupDir)
    await ensureBackupDir(path.join(config.backupDir, config.type))

    // Create database dump
    const sqlFile = await createDatabaseDump(config)

    // Verify backup
    const isValid = await verifyBackup(sqlFile)
    if (!isValid) {
      throw new Error('Backup verification failed')
    }

    // Compress backup
    console.log('🗜️  Compressing backup...')
    const gzFile = await compressBackup(sqlFile)
    const finalPath = path.join(config.backupDir, config.type, path.basename(gzFile))
    await fs.rename(gzFile, finalPath)

    const fileSize = await getFileSize(finalPath)
    console.log(`✅ Compressed backup: ${path.basename(finalPath)} (${fileSize})`)

    // Upload to S3
    await uploadToS3(finalPath, config)

    // Clean old backups
    await cleanOldBackups(config)

    // Calculate duration
    const duration = ((Date.now() - startTime) / 1000).toFixed(2)

    console.log()
    console.log('╔════════════════════════════════════════════╗')
    console.log('║   ✅ BACKUP COMPLETED SUCCESSFULLY         ║')
    console.log('╚════════════════════════════════════════════╝')
    console.log(`   Type: ${config.type}`)
    console.log(`   File: ${path.basename(finalPath)}`)
    console.log(`   Size: ${fileSize}`)
    console.log(`   Duration: ${duration}s`)
    console.log()

    // Send success notification
    await sendNotification(
      config,
      true,
      `Backup completed in ${duration}s. File size: ${fileSize}`
    )

    process.exit(0)
  } catch (error: any) {
    console.error()
    console.error('╔════════════════════════════════════════════╗')
    console.error('║   ❌ BACKUP FAILED                         ║')
    console.error('╚════════════════════════════════════════════╝')
    console.error(`   Error: ${error.message}`)
    console.error()

    // Send failure notification
    await sendNotification(config, false, error.message)

    process.exit(1)
  }
}

// Run the backup
main()
