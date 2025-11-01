import { z } from 'zod'

const envSchema = z.object({
  // Node Environment
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  // Database
  DATABASE_URL: z
    .string()
    .url('DATABASE_URL must be a valid URL')
    .startsWith('postgresql://', 'DATABASE_URL must be a PostgreSQL connection string'),

  // NextAuth
  NEXTAUTH_URL: z
    .string()
    .url('NEXTAUTH_URL must be a valid URL'),
  
  NEXTAUTH_SECRET: z
    .string()
    .min(32, 'NEXTAUTH_SECRET must be at least 32 characters for security'),

  // Razorpay
  RAZORPAY_KEY_ID: z
    .string().default('dummy_key'),
    //.min(1, 'RAZORPAY_KEY_ID is required')
    //.startsWith('rzp_', 'RAZORPAY_KEY_ID must start with rzp_'),
  
  RAZORPAY_KEY_SECRET: z
    .string().default('dummy_secret'),
    //.min(1, 'RAZORPAY_KEY_SECRET is required'),

  // AWS S3
  AWS_REGION: z
    .string()
    .min(1, 'AWS_REGION is required (e.g., ap-south-1)'),
  
  AWS_ACCESS_KEY_ID: z
    .string()
    .min(16, 'AWS_ACCESS_KEY_ID must be at least 16 characters'),
  
  AWS_SECRET_ACCESS_KEY: z
    .string()
    .min(32, 'AWS_SECRET_ACCESS_KEY must be at least 32 characters'),
  
  AWS_S3_BUCKET: z
    .string()
    .min(3, 'AWS_S3_BUCKET name must be at least 3 characters')
    .max(63, 'AWS_S3_BUCKET name must be at most 63 characters')
    .regex(/^[a-z0-9.-]+$/, 'AWS_S3_BUCKET must contain only lowercase letters, numbers, dots, and hyphens'),

  // Encryption
  ENCRYPTION_KEY: z
    .string()
    .length(64, 'ENCRYPTION_KEY must be exactly 64 characters (32 bytes in hex format)'),

  // Redis (Upstash)
  UPSTASH_REDIS_REST_URL: z
    .string()
    .url('UPSTASH_REDIS_REST_URL must be a valid URL')
    .startsWith('https://', 'UPSTASH_REDIS_REST_URL must use HTTPS'),
  
  UPSTASH_REDIS_REST_TOKEN: z
    .string()
    .min(1, 'UPSTASH_REDIS_REST_TOKEN is required'),

  // Optional: Email (can be added later)
  RESEND_API_KEY: z.string().optional(),
  FROM_EMAIL: z.string().email().optional(),

  // Optional: SMS
  SMS_PROVIDER: z.enum(['msg91', 'twilio']).optional(),
  MSG91_AUTH_KEY: z.string().optional(),
  MSG91_SENDER_ID: z.string().optional(),

  // Optional: Google Maps
  NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: z.string().optional(),

  // Optional: reCAPTCHA
  NEXT_PUBLIC_RECAPTCHA_SITE_KEY: z.string().optional(),
  RECAPTCHA_SECRET_KEY: z.string().optional(),
})

export type Env = z.infer<typeof envSchema>

let validatedEnv: Env | null = null

export function validateEnvironment(): Env {
  // Return cached result if already validated
  if (validatedEnv) {
    return validatedEnv
  }

  try {
    validatedEnv = envSchema.parse(process.env)
    console.log('✅ Environment variables validated successfully')
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

      console.error('\n📝 Please check your .env.local file and fix the above errors.\n')
      console.error('💡 Tip: Copy from .env.example if you haven\'t set up your environment yet.\n')
    } else {
      console.error('❌ Unexpected error during environment validation:', error)
    }

    process.exit(1)
  }
}

// Helper to get validated env (type-safe)
export function getEnv(): Env {
  if (!validatedEnv) {
    return validateEnvironment()
  }
  return validatedEnv
}