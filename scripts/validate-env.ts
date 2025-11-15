#!/usr/bin/env tsx
// ================================================
// scripts/validate-env.ts - Startup Environment Validation
// ================================================

/**
 * Validate environment variables before starting the application
 *
 * This script checks:
 * - All required environment variables are set
 * - Optional features are properly configured
 * - Production readiness checks
 * - Database connectivity
 * - Redis connectivity (if configured)
 *
 * Usage:
 *   npm run validate:env
 *   tsx scripts/validate-env.ts
 */

import { validateEnvironment, getFeatureFlags } from '@/lib/env-validation'

console.log('╔════════════════════════════════════════════╗')
console.log('║   ENVIRONMENT VALIDATION                   ║')
console.log('╚════════════════════════════════════════════╝')
console.log()

// Validate environment variables
const env = validateEnvironment()

// Get feature flags
const features = getFeatureFlags()

console.log('✅ All required environment variables are properly configured!')
console.log()

// Connectivity checks
async function checkConnectivity() {
  console.log('🔌 Testing Connectivity...')
  console.log()

  let allHealthy = true

  // 1. Database connectivity
  try {
    const { PrismaClient } = await import('@prisma/client')
    const prisma = new PrismaClient()

    await prisma.$connect()
    await prisma.$queryRaw`SELECT 1`
    await prisma.$disconnect()

    console.log('   ✅ Database (PostgreSQL): Connected')
  } catch (error: any) {
    console.error('   ❌ Database (PostgreSQL): Connection failed')
    console.error(`      Error: ${error.message}`)
    allHealthy = false
  }

  // 2. Redis connectivity (if configured)
  if (features.redis) {
    try {
      const { Redis } = await import('@upstash/redis')
      const redis = new Redis({
        url: env.UPSTASH_REDIS_REST_URL!,
        token: env.UPSTASH_REDIS_REST_TOKEN!,
      })

      await redis.ping()
      console.log('   ✅ Redis (Upstash): Connected')
    } catch (error: any) {
      console.error('   ❌ Redis (Upstash): Connection failed')
      console.error(`      Error: ${error.message}`)
      allHealthy = false
    }
  } else {
    console.log('   ⏭️  Redis: Not configured (optional)')
  }

  // 3. Email service (if configured)
  if (features.email) {
    try {
      const nodemailer = await import('nodemailer')
      const transporter = nodemailer.default.createTransport({
        host: env.SMTP_HOST!,
        port: parseInt(env.SMTP_PORT!),
        secure: parseInt(env.SMTP_PORT!) === 465,
        auth: {
          user: env.SMTP_USER!,
          pass: env.SMTP_PASSWORD!,
        },
      })

      // Test connection
      await transporter.verify()
      console.log('   ✅ Email Service (SMTP): Connected')
    } catch (error: any) {
      console.error('   ❌ Email Service (SMTP): Connection failed')
      console.error(`      Error: ${error.message}`)
      allHealthy = false
    }
  } else {
    console.log('   ⏭️  Email Service: Not configured (optional)')
  }

  // 4. S3/R2 Storage (if configured)
  if (features.s3) {
    try {
      const { S3Client, HeadBucketCommand } = await import('@aws-sdk/client-s3')
      const s3 = new S3Client({
        region: env.AWS_REGION!,
        credentials: {
          accessKeyId: env.AWS_ACCESS_KEY_ID!,
          secretAccessKey: env.AWS_SECRET_ACCESS_KEY!,
        },
      })

      await s3.send(new HeadBucketCommand({ Bucket: env.AWS_S3_BUCKET! }))
      console.log('   ✅ AWS S3 Storage: Connected')
    } catch (error: any) {
      console.error('   ❌ AWS S3 Storage: Connection failed')
      console.error(`      Error: ${error.message}`)
      allHealthy = false
    }
  } else if (features.r2) {
    try {
      const { S3Client, HeadBucketCommand } = await import('@aws-sdk/client-s3')
      const r2 = new S3Client({
        region: 'auto',
        endpoint: env.R2_ENDPOINT,
        credentials: {
          accessKeyId: env.R2_ACCESS_KEY_ID!,
          secretAccessKey: env.R2_SECRET_ACCESS_KEY!,
        },
      })

      await r2.send(new HeadBucketCommand({ Bucket: env.R2_BUCKET! }))
      console.log('   ✅ Cloudflare R2 Storage: Connected')
    } catch (error: any) {
      console.error('   ❌ Cloudflare R2 Storage: Connection failed')
      console.error(`      Error: ${error.message}`)
      allHealthy = false
    }
  } else {
    console.log('   ⏭️  Cloud Storage: Not configured (optional)')
  }

  console.log()

  if (allHealthy) {
    console.log('✅ All connectivity checks passed!')
  } else {
    console.error('❌ Some connectivity checks failed. Please fix the issues above.')
    process.exit(1)
  }
}

// Run connectivity checks
checkConnectivity()
  .then(() => {
    console.log()
    console.log('╔════════════════════════════════════════════╗')
    console.log('║   VALIDATION COMPLETE                      ║')
    console.log('╚════════════════════════════════════════════╝')
    console.log()
    console.log('✅ Your environment is properly configured!')
    console.log('   You can now start the application with: npm run dev')
    console.log()
    process.exit(0)
  })
  .catch((error) => {
    console.error('Fatal error during connectivity checks:', error)
    process.exit(1)
  })
