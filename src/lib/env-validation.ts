import { z } from 'zod'

const envSchema = z.object({
  // Node Environment
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  // Database (REQUIRED)
  DATABASE_URL: z
    .string()
    .url('DATABASE_URL must be a valid URL')
    .startsWith('postgresql://', 'DATABASE_URL must be a PostgreSQL connection string'),

  // NextAuth (REQUIRED)
  NEXTAUTH_URL: z
    .string()
    .url('NEXTAUTH_URL must be a valid URL'),

  NEXTAUTH_SECRET: z
    .string()
    .min(32, 'NEXTAUTH_SECRET must be at least 32 characters for security'),

  // Razorpay (Optional for development, REQUIRED for production payments)
  RAZORPAY_KEY_ID: z
    .string()
    .default('dummy_key'),

  RAZORPAY_KEY_SECRET: z
    .string()
    .default('dummy_secret'),

  // AWS S3 (Optional - for backups and file storage)
  AWS_REGION: z
    .string()
    .min(1, 'AWS_REGION is required (e.g., ap-south-1)')
    .optional(),

  AWS_ACCESS_KEY_ID: z
    .string()
    .min(16, 'AWS_ACCESS_KEY_ID must be at least 16 characters')
    .optional(),

  AWS_SECRET_ACCESS_KEY: z
    .string()
    .min(32, 'AWS_SECRET_ACCESS_KEY must be at least 32 characters')
    .optional(),

  AWS_S3_BUCKET: z
    .string()
    .min(3, 'AWS_S3_BUCKET name must be at least 3 characters')
    .max(63, 'AWS_S3_BUCKET name must be at most 63 characters')
    .regex(/^[a-z0-9.-]+$/, 'AWS_S3_BUCKET must contain only lowercase letters, numbers, dots, and hyphens')
    .optional(),

  // Cloudflare R2 (Optional - alternative to S3)
  R2_ENDPOINT: z.string().url().optional(),
  R2_ACCESS_KEY_ID: z.string().optional(),
  R2_SECRET_ACCESS_KEY: z.string().optional(),
  R2_BUCKET: z.string().optional(),
  R2_ACCOUNT_ID: z.string().optional(),

  // Encryption (Optional for development, RECOMMENDED for production)
  ENCRYPTION_KEY: z
    .string()
    .length(64, 'ENCRYPTION_KEY must be exactly 64 characters (32 bytes in hex format)')
    .optional(),

  // Redis (Upstash) - Optional but RECOMMENDED for caching and rate limiting
  UPSTASH_REDIS_REST_URL: z
    .string()
    .url('UPSTASH_REDIS_REST_URL must be a valid URL')
    .startsWith('https://', 'UPSTASH_REDIS_REST_URL must use HTTPS')
    .optional(),

  UPSTASH_REDIS_REST_TOKEN: z
    .string()
    .min(1, 'UPSTASH_REDIS_REST_TOKEN is required when UPSTASH_REDIS_REST_URL is set')
    .optional(),

  // Email (RECOMMENDED for production) - Nodemailer SMTP
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.string().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASSWORD: z.string().optional(),
  FROM_EMAIL: z.string().email('FROM_EMAIL must be a valid email address').optional(),

  // Email (Gmail service) - Alternative to SMTP
  EMAIL_USER: z.string().email('EMAIL_USER must be a valid email address').optional(),
  EMAIL_PASSWORD: z.string().optional(),
  EMAIL_FROM: z.string().optional(),

  // Backup notifications (Optional)
  BACKUP_NOTIFICATION_EMAIL: z.string().email().optional(),
  BACKUP_S3_BUCKET: z.string().optional(),

  // Cron job security (REQUIRED for production cron endpoints)
  CRON_SECRET: z.string().min(32, 'CRON_SECRET must be at least 32 characters').optional(),

  // SMS (Optional - deprecated, use WhatsApp instead)
  SMS_PROVIDER: z.enum(['msg91', 'twilio']).optional(),
  SMS_API_KEY: z.string().optional(),
  MSG91_AUTH_KEY: z.string().optional(),
  MSG91_SENDER_ID: z.string().optional(),

  // WhatsApp Business API (Recommended - Meta/Facebook Cloud API)
  WHATSAPP_ENABLED: z.enum(['true', 'false']).optional(),
  WHATSAPP_PHONE_NUMBER_ID: z.string().optional(),
  WHATSAPP_ACCESS_TOKEN: z.string().optional(),
  WHATSAPP_BUSINESS_ACCOUNT_ID: z.string().optional(),
  WHATSAPP_VERIFY_TOKEN: z.string().optional(),

  // Google Maps (Optional)
  NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: z.string().optional(),

  // reCAPTCHA (Optional but RECOMMENDED for production)
  NEXT_PUBLIC_RECAPTCHA_SITE_KEY: z.string().optional(),
  RECAPTCHA_SECRET_KEY: z.string().optional(),

  // Sentry (Optional but RECOMMENDED for error tracking)
  SENTRY_DSN: z.string().url().optional(),
  NEXT_PUBLIC_SENTRY_DSN: z.string().url().optional(),

  // Admin user seeding (Optional)
  ADMIN_EMAIL: z.string().email().optional(),
  ADMIN_PASSWORD: z.string().min(8).optional(),
})

export type Env = z.infer<typeof envSchema>

let validatedEnv: Env | null = null

/**
 * Feature detection - check which optional features are enabled
 */
export interface FeatureFlags {
  redis: boolean
  email: boolean
  sms: boolean
  whatsapp: boolean
  s3: boolean
  r2: boolean
  payments: boolean
  recaptcha: boolean
  googleMaps: boolean
  sentry: boolean
  backups: boolean
  caching: boolean
  rateLimiting: boolean
}

export function detectFeatures(env: Env): FeatureFlags {
  return {
    redis: !!(env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN),
    email: !!(env.EMAIL_USER && env.EMAIL_PASSWORD),
    sms: !!(env.SMS_PROVIDER && env.SMS_API_KEY),
    whatsapp: !!(env.WHATSAPP_ENABLED === 'true' && env.WHATSAPP_PHONE_NUMBER_ID && env.WHATSAPP_ACCESS_TOKEN),
    s3: !!(env.AWS_ACCESS_KEY_ID && env.AWS_SECRET_ACCESS_KEY && env.AWS_S3_BUCKET),
    r2: !!(env.R2_ACCESS_KEY_ID && env.R2_SECRET_ACCESS_KEY && env.R2_BUCKET),
    payments: !!(env.RAZORPAY_KEY_ID && env.RAZORPAY_KEY_SECRET && env.RAZORPAY_KEY_ID !== 'dummy_key'),
    recaptcha: !!(env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY && env.RECAPTCHA_SECRET_KEY),
    googleMaps: !!env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    sentry: !!(env.SENTRY_DSN || env.NEXT_PUBLIC_SENTRY_DSN),
    backups: !!(env.AWS_S3_BUCKET || env.R2_BUCKET) && !!env.BACKUP_S3_BUCKET,
    caching: !!(env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN),
    rateLimiting: !!(env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN),
  }
}

/**
 * Check for production readiness and warn about missing optional features
 */
function checkProductionReadiness(env: Env): void {
  const isProduction = env.NODE_ENV === 'production'
  const features = detectFeatures(env)

  if (!isProduction) {
    return // Skip checks for development
  }

  const warnings: string[] = []

  // Critical for production
  if (!features.redis) {
    warnings.push('⚠️  Redis not configured - Rate limiting and caching will be disabled')
  }

  if (!features.email) {
    warnings.push('⚠️  Email service not configured - User notifications will not work')
  }

  if (!features.payments) {
    warnings.push('⚠️  Razorpay not configured - Payment processing will not work')
  }

  if (!env.CRON_SECRET) {
    warnings.push('⚠️  CRON_SECRET not set - Cron job endpoints are not secured')
  }

  if (!features.backups) {
    warnings.push('⚠️  Backup storage not configured - Database backups will not work')
  }

  if (!features.sentry) {
    warnings.push('⚠️  Sentry not configured - Error tracking and monitoring disabled')
  }

  // Recommended for production
  if (!features.recaptcha) {
    warnings.push('💡 reCAPTCHA not configured - Consider enabling to prevent spam')
  }

  if (!env.ENCRYPTION_KEY) {
    warnings.push('💡 ENCRYPTION_KEY not set - Sensitive data encryption disabled')
  }

  if (warnings.length > 0) {
    console.warn('\n⚠️  Production Configuration Warnings:\n')
    warnings.forEach((warning) => console.warn(`   ${warning}`))
    console.warn('\n   These features are optional but recommended for production.\n')
  }
}

/**
 * Print enabled features
 */
function printEnabledFeatures(env: Env): void {
  const features = detectFeatures(env)

  console.log('\n📋 Enabled Features:')
  console.log(`   ✅ Database: PostgreSQL`)
  console.log(`   ✅ Authentication: NextAuth`)
  console.log(`   ${features.redis ? '✅' : '❌'} Redis (Caching & Rate Limiting)`)
  console.log(`   ${features.email ? '✅' : '❌'} Email Service`)
  console.log(`   ${features.whatsapp ? '✅' : '❌'} WhatsApp Business API`)
  console.log(`   ${features.payments ? '✅' : '❌'} Payment Gateway (Razorpay)`)
  console.log(`   ${features.s3 ? '✅' : '❌'} AWS S3 Storage`)
  console.log(`   ${features.r2 ? '✅' : '❌'} Cloudflare R2 Storage`)
  console.log(`   ${features.sms ? '✅' : '❌'} SMS Service`)
  console.log(`   ${features.recaptcha ? '✅' : '❌'} reCAPTCHA`)
  console.log(`   ${features.googleMaps ? '✅' : '❌'} Google Maps`)
  console.log(`   ${features.sentry ? '✅' : '❌'} Error Tracking (Sentry)`)
  console.log(`   ${features.backups ? '✅' : '❌'} Automated Backups`)
  console.log()
}

export function validateEnvironment(options: { silent?: boolean; skipProductionCheck?: boolean } = {}): Env {
  // Return cached result if already validated
  if (validatedEnv) {
    return validatedEnv
  }

  try {
    validatedEnv = envSchema.parse(process.env)

    if (!options.silent) {
      console.log('✅ Environment variables validated successfully')
      printEnabledFeatures(validatedEnv)

      if (!options.skipProductionCheck) {
        checkProductionReadiness(validatedEnv)
      }
    }

    return validatedEnv
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('\n❌ Environment Validation Failed!\n')
      console.error('The following environment variables have issues:\n')

      error.issues.forEach((err, index) => {
        const field = err.path.join('.')
        const message = err.message
        console.error(`  ${index + 1}. ${field}:`)
        console.error(`     ${message}`)
      })

      console.error('\n📝 Please check your .env or .env.local file and fix the above errors.\n')
      console.error('💡 Tip: Copy from .env.example if you haven\'t set up your environment yet.\n')
    } else {
      console.error('❌ Unexpected error during environment validation:', error)
    }
   // only exit in non-test environments
   if (process.env.NODE_ENV === 'test'){
    throw error;
   }else {
    process.exit(1);
  }
}
}

/**
 * Helper to get validated env (type-safe)
 */
export function getEnv(): Env {
  if (!validatedEnv) {
    return validateEnvironment({ silent: true })
  }
  return validatedEnv
}

/**
 * Check if a specific feature is enabled
 */
export function isFeatureEnabled(feature: keyof FeatureFlags): boolean {
  const env = getEnv()
  const features = detectFeatures(env)
  return features[feature]
}

/**
 * Get all feature flags
 */
export function getFeatureFlags(): FeatureFlags {
  const env = getEnv()
  return detectFeatures(env)
}