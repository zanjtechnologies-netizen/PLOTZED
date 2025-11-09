#!/usr/bin/env tsx
// ================================================
// scripts/restore-database.ts - Database Restoration Script
// ================================================

/**
 * Restore PostgreSQL database from backup
 *
 * DANGER: This script will DROP the existing database and restore from backup
 * Use with extreme caution in production!
 *
 * Usage:
 *   npm run restore:database -- --file=backups/daily/plotzed-daily-backup-2025-01-15.sql.gz
 *   npm run restore:database -- --latest
 *   npm run restore:database -- --from-s3=s3://bucket/backups/daily/backup.sql.gz
 *
 * Safety Features:
 * - Requires explicit confirmation (--confirm flag)
 * - Creates pre-restore backup
 * - Validates backup file before restoration
 * - Supports dry-run mode
 */

import { exec } from 'child_process'
import { promisify } from 'util'
import * as fs from 'fs/promises'
import * as path from 'path'
import { createReadStream, createWriteStream } from 'fs'
import { createGunzip } from 'zlib'
import { pipeline } from 'stream/promises'
import * as readline from 'readline'

const execAsync = promisify(exec)

// ================================================
// CONFIGURATION
// ================================================

interface RestoreConfig {
  backupFile?: string
  latest: boolean
  fromS3?: string
  databaseUrl: string
  confirm: boolean
  dryRun: boolean
  skipPreBackup: boolean
}

const config: RestoreConfig = {
  backupFile: process.argv.find(arg => arg.startsWith('--file='))?.split('=')[1],
  latest: process.argv.includes('--latest'),
  fromS3: process.argv.find(arg => arg.startsWith('--from-s3='))?.split('=')[1],
  databaseUrl: process.env.DATABASE_URL || '',
  confirm: process.argv.includes('--confirm'),
  dryRun: process.argv.includes('--dry-run'),
  skipPreBackup: process.argv.includes('--skip-pre-backup'),
}

// ================================================
// UTILITIES
// ================================================

function parseDbUrl(url: string) {
  const parsed = new URL(url)
  return {
    host: parsed.hostname,
    port: parsed.port || '5432',
    database: parsed.pathname.slice(1),
    username: parsed.username,
    password: parsed.password,
  }
}

async function askConfirmation(message: string): Promise<boolean> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  return new Promise(resolve => {
    rl.question(`${message} (yes/no): `, answer => {
      rl.close()
      resolve(answer.toLowerCase() === 'yes')
    })
  })
}

async function decompressBackup(gzFile: string): Promise<string> {
  const sqlFile = gzFile.replace('.gz', '')
  console.log('📦 Decompressing backup...')

  const source = createReadStream(gzFile)
  const destination = createWriteStream(sqlFile)
  const gunzip = createGunzip()

  await pipeline(source, gunzip, destination)

  console.log('✅ Backup decompressed')
  return sqlFile
}

async function findLatestBackup(): Promise<string | null> {
  const backupsDir = path.join(process.cwd(), 'backups')

  try {
    const types = ['daily', 'weekly', 'monthly']
    let latestFile: string | null = null
    let latestTime = 0

    for (const type of types) {
      const typeDir = path.join(backupsDir, type)
      try {
        const files = await fs.readdir(typeDir)
        for (const file of files) {
          const filePath = path.join(typeDir, file)
          const stats = await fs.stat(filePath)
          if (stats.mtime.getTime() > latestTime) {
            latestTime = stats.mtime.getTime()
            latestFile = filePath
          }
        }
      } catch {
        continue
      }
    }

    return latestFile
  } catch {
    return null
  }
}

async function downloadFromS3(s3Path: string): Promise<string> {
  console.log(`☁️  Downloading from S3: ${s3Path}`)

  const filename = path.basename(s3Path)
  const localPath = path.join(process.cwd(), 'temp', filename)

  await fs.mkdir(path.join(process.cwd(), 'temp'), { recursive: true })

  const command = `aws s3 cp "${s3Path}" "${localPath}"`
  await execAsync(command)

  console.log('✅ Downloaded from S3')
  return localPath
}

async function createPreRestoreBackup(config: RestoreConfig): Promise<void> {
  if (config.skipPreBackup) {
    console.log('⏭️  Skipping pre-restore backup')
    return
  }

  console.log('📦 Creating pre-restore backup...')

  const dbConfig = parseDbUrl(config.databaseUrl)
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  const filename = `pre-restore-backup-${timestamp}.sql`
  const backupDir = path.join(process.cwd(), 'backups', 'pre-restore')

  await fs.mkdir(backupDir, { recursive: true })

  const filePath = path.join(backupDir, filename)

  const command = `PGPASSWORD="${dbConfig.password}" pg_dump \
    -h ${dbConfig.host} \
    -p ${dbConfig.port} \
    -U ${dbConfig.username} \
    -d ${dbConfig.database} \
    --format=plain \
    --no-owner \
    --no-acl \
    --file="${filePath}"`

  try {
    await execAsync(command)
    console.log(`✅ Pre-restore backup created: ${filename}`)
  } catch (error: any) {
    console.warn('⚠️  Pre-restore backup failed:', error.message)
    console.warn('   Continuing anyway...')
  }
}

async function restoreDatabase(sqlFile: string, config: RestoreConfig): Promise<void> {
  const dbConfig = parseDbUrl(config.databaseUrl)

  console.log('🔄 Restoring database...')
  console.log(`   Database: ${dbConfig.database}`)
  console.log(`   Host: ${dbConfig.host}:${dbConfig.port}`)

  if (config.dryRun) {
    console.log('🔍 DRY RUN MODE - No changes will be made')
    return
  }

  // Terminate existing connections
  console.log('🔌 Terminating existing database connections...')
  const terminateCommand = `PGPASSWORD="${dbConfig.password}" psql \
    -h ${dbConfig.host} \
    -p ${dbConfig.port} \
    -U ${dbConfig.username} \
    -d postgres \
    -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = '${dbConfig.database}' AND pid <> pg_backend_pid();"`

  try {
    await execAsync(terminateCommand)
  } catch (error: any) {
    console.warn('⚠️  Warning:', error.message)
  }

  // Drop and recreate database
  console.log('💥 Dropping existing database...')
  const dropCommand = `PGPASSWORD="${dbConfig.password}" psql \
    -h ${dbConfig.host} \
    -p ${dbConfig.port} \
    -U ${dbConfig.username} \
    -d postgres \
    -c "DROP DATABASE IF EXISTS ${dbConfig.database};"`

  await execAsync(dropCommand)

  console.log('🏗️  Creating new database...')
  const createCommand = `PGPASSWORD="${dbConfig.password}" psql \
    -h ${dbConfig.host} \
    -p ${dbConfig.port} \
    -U ${dbConfig.username} \
    -d postgres \
    -c "CREATE DATABASE ${dbConfig.database};"`

  await execAsync(createCommand)

  // Restore from backup
  console.log('📥 Restoring data from backup...')
  const restoreCommand = `PGPASSWORD="${dbConfig.password}" psql \
    -h ${dbConfig.host} \
    -p ${dbConfig.port} \
    -U ${dbConfig.username} \
    -d ${dbConfig.database} \
    -f "${sqlFile}" \
    --quiet`

  await execAsync(restoreCommand)

  console.log('✅ Database restored successfully')
}

async function verifyRestoration(config: RestoreConfig): Promise<void> {
  console.log('🔍 Verifying restoration...')

  const dbConfig = parseDbUrl(config.databaseUrl)

  const command = `PGPASSWORD="${dbConfig.password}" psql \
    -h ${dbConfig.host} \
    -p ${dbConfig.port} \
    -U ${dbConfig.username} \
    -d ${dbConfig.database} \
    -t \
    -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';"`

  const { stdout } = await execAsync(command)
  const tableCount = parseInt(stdout.trim())

  if (tableCount === 0) {
    throw new Error('Restoration verification failed: No tables found in database')
  }

  console.log(`✅ Verification passed: ${tableCount} tables found`)
}

// ================================================
// MAIN EXECUTION
// ================================================

async function main() {
  console.log('╔════════════════════════════════════════════╗')
  console.log('║   PLOTZED DATABASE RESTORATION SCRIPT      ║')
  console.log('╚════════════════════════════════════════════╝')
  console.log()

  try {
    // Validate configuration
    if (!config.databaseUrl) {
      throw new Error('DATABASE_URL environment variable not set')
    }

    // Determine backup file to restore
    let backupFile: string

    if (config.fromS3) {
      backupFile = await downloadFromS3(config.fromS3)
    } else if (config.latest) {
      const latest = await findLatestBackup()
      if (!latest) {
        throw new Error('No backup files found')
      }
      backupFile = latest
      console.log(`📋 Latest backup found: ${path.basename(backupFile)}`)
    } else if (config.backupFile) {
      backupFile = config.backupFile
    } else {
      throw new Error('No backup file specified. Use --file, --latest, or --from-s3')
    }

    // Verify backup file exists
    await fs.access(backupFile)
    const stats = await fs.stat(backupFile)
    console.log(`📦 Backup file: ${path.basename(backupFile)} (${(stats.size / 1024 / 1024).toFixed(2)} MB)`)

    // Safety confirmation
    if (!config.confirm && !config.dryRun) {
      console.log()
      console.log('⚠️  WARNING: This will DELETE all existing data in the database!')
      console.log('⚠️  Make sure you have a recent backup before proceeding.')
      console.log()

      const confirmed = await askConfirmation(
        'Are you absolutely sure you want to restore this backup?'
      )

      if (!confirmed) {
        console.log('❌ Restoration cancelled by user')
        process.exit(0)
      }
    }

    // Decompress if needed
    let sqlFile = backupFile
    if (backupFile.endsWith('.gz')) {
      sqlFile = await decompressBackup(backupFile)
    }

    // Create pre-restore backup
    if (!config.dryRun) {
      await createPreRestoreBackup(config)
    }

    // Restore database
    await restoreDatabase(sqlFile, config)

    // Verify restoration
    if (!config.dryRun) {
      await verifyRestoration(config)
    }

    // Clean up temp files
    if (backupFile.endsWith('.gz') && sqlFile !== backupFile) {
      await fs.unlink(sqlFile)
    }

    console.log()
    console.log('╔════════════════════════════════════════════╗')
    console.log('║   ✅ RESTORATION COMPLETED SUCCESSFULLY    ║')
    console.log('╚════════════════════════════════════════════╝')
    console.log()

    process.exit(0)
  } catch (error: any) {
    console.error()
    console.error('╔════════════════════════════════════════════╗')
    console.error('║   ❌ RESTORATION FAILED                    ║')
    console.error('╚════════════════════════════════════════════╝')
    console.error(`   Error: ${error.message}`)
    console.error()
    process.exit(1)
  }
}

// Run the restoration
main()
