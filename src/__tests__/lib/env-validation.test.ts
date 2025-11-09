/**
 * Unit tests for environment validation
 */

import { detectFeatures, getEnv } from '@/lib/env-validation'

describe('Environment Validation', () => {
  const originalEnv = process.env

  beforeEach(() => {
    jest.resetModules()
    process.env = { ...originalEnv }
  })

  afterAll(() => {
    process.env = originalEnv
  })

  describe('detectFeatures', () => {
    it('should detect Redis/caching when credentials provided', () => {
      const env: any = {
        UPSTASH_REDIS_REST_URL: 'https://redis.upstash.io',
        UPSTASH_REDIS_REST_TOKEN: 'test_token',
      }

      const features = detectFeatures(env)

      expect(features.redis).toBe(true)
      expect(features.caching).toBe(true)
      expect(features.rateLimiting).toBe(true)
    })

    it('should detect email when credentials provided', () => {
      const env: any = {
        EMAIL_USER: 'test@example.com',
        EMAIL_PASSWORD: 'password',
      }

      const features = detectFeatures(env)

      expect(features.email).toBe(true)
    })

    it('should detect WhatsApp when enabled and credentials provided', () => {
      const env: any = {
        WHATSAPP_ENABLED: 'true',
        WHATSAPP_PHONE_NUMBER_ID: '123456789',
        WHATSAPP_ACCESS_TOKEN: 'test_token',
      }

      const features = detectFeatures(env)

      expect(features.whatsapp).toBe(true)
    })

    it('should not detect WhatsApp when disabled', () => {
      const env: any = {
        WHATSAPP_ENABLED: 'false',
        WHATSAPP_PHONE_NUMBER_ID: '123456789',
        WHATSAPP_ACCESS_TOKEN: 'test_token',
      }

      const features = detectFeatures(env)

      expect(features.whatsapp).toBe(false)
    })

    it('should detect payments when Razorpay credentials provided', () => {
      const env: any = {
        RAZORPAY_KEY_ID: 'rzp_test_123',
        RAZORPAY_KEY_SECRET: 'secret',
      }

      const features = detectFeatures(env)

      expect(features.payments).toBe(true)
    })

    it('should not detect payments with dummy key', () => {
      const env: any = {
        RAZORPAY_KEY_ID: 'dummy_key',
        RAZORPAY_KEY_SECRET: 'secret',
      }

      const features = detectFeatures(env)

      expect(features.payments).toBe(false)
    })

    it('should detect S3 when AWS credentials provided', () => {
      const env: any = {
        AWS_ACCESS_KEY_ID: 'test_key',
        AWS_SECRET_ACCESS_KEY: 'test_secret',
        AWS_S3_BUCKET: 'test-bucket',
      }

      const features = detectFeatures(env)

      expect(features.s3).toBe(true)
    })

    it('should detect R2 when Cloudflare credentials provided', () => {
      const env: any = {
        R2_ACCESS_KEY_ID: 'test_key',
        R2_SECRET_ACCESS_KEY: 'test_secret',
        R2_BUCKET: 'test-bucket',
      }

      const features = detectFeatures(env)

      expect(features.r2).toBe(true)
    })

    it('should detect Sentry when DSN provided', () => {
      const env: any = {
        SENTRY_DSN: 'https://test@sentry.io/123',
      }

      const features = detectFeatures(env)

      expect(features.sentry).toBe(true)
    })

    it('should detect reCAPTCHA when keys provided', () => {
      const env: any = {
        NEXT_PUBLIC_RECAPTCHA_SITE_KEY: 'test_site_key',
        RECAPTCHA_SECRET_KEY: 'test_secret_key',
      }

      const features = detectFeatures(env)

      expect(features.recaptcha).toBe(true)
    })

    it('should detect Google Maps when API key provided', () => {
      const env: any = {
        NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: 'test_api_key',
      }

      const features = detectFeatures(env)

      expect(features.googleMaps).toBe(true)
    })

    it('should detect backups when S3 and backup bucket provided', () => {
      const env: any = {
        AWS_S3_BUCKET: 'test-bucket',
        BACKUP_S3_BUCKET: 'backup-bucket',
      }

      const features = detectFeatures(env)

      expect(features.backups).toBe(true)
    })

    it('should return all false when no optional features configured', () => {
      const env: any = {}

      const features = detectFeatures(env)

      expect(features.redis).toBe(false)
      expect(features.email).toBe(false)
      expect(features.whatsapp).toBe(false)
      expect(features.s3).toBe(false)
      expect(features.r2).toBe(false)
      expect(features.payments).toBe(false)
      expect(features.sentry).toBe(false)
      expect(features.recaptcha).toBe(false)
      expect(features.googleMaps).toBe(false)
      expect(features.backups).toBe(false)
      expect(features.caching).toBe(false)
      expect(features.rateLimiting).toBe(false)
    })

    it('should handle multiple features enabled at once', () => {
      const env: any = {
        UPSTASH_REDIS_REST_URL: 'https://redis.upstash.io',
        UPSTASH_REDIS_REST_TOKEN: 'token',
        EMAIL_USER: 'test@example.com',
        EMAIL_PASSWORD: 'password',
        WHATSAPP_ENABLED: 'true',
        WHATSAPP_PHONE_NUMBER_ID: '123456789',
        WHATSAPP_ACCESS_TOKEN: 'token',
        RAZORPAY_KEY_ID: 'rzp_test_123',
        RAZORPAY_KEY_SECRET: 'secret',
        SENTRY_DSN: 'https://test@sentry.io/123',
      }

      const features = detectFeatures(env)

      expect(features.redis).toBe(true)
      expect(features.caching).toBe(true)
      expect(features.rateLimiting).toBe(true)
      expect(features.email).toBe(true)
      expect(features.whatsapp).toBe(true)
      expect(features.payments).toBe(true)
      expect(features.sentry).toBe(true)
    })
  })

  describe('getEnv', () => {
    it('should return cached env on subsequent calls', () => {
      (process.env as any) .NODE_ENV = 'test'
      process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test'
      //process.env.NEXTAUTH_SECRET = "test-secret-key-for-testing-purposes-only-1234567890";
      process.env.NEXTAUTH_URL = 'http://localhost:3000'
      process.env.RAZORPAY_KEY_ID = 'test'
      process.env.RAZORPAY_KEY_SECRET = 'test'

      const env1 = getEnv()
      const env2 = getEnv()

      expect(env1).toBe(env2) // Same reference
    })
  })

  describe('Environment variable types', () => {
    it('should validate email format for EMAIL_USER', () => {
      const env: any = {
        EMAIL_USER: 'invalid-email',
        EMAIL_PASSWORD: 'password',
      }

      // detectFeatures should still work even with invalid email
      const features = detectFeatures(env)
      expect(features.email).toBe(true) // Feature detection doesn't validate format
    })

    it('should handle SMS provider enum', () => {
      const env: any = {
        SMS_PROVIDER: 'msg91',
        SMS_API_KEY: 'test_key',
      }

      const features = detectFeatures(env)
      expect(features.sms).toBe(true)
    })

    it('should handle boolean string for WhatsApp enabled', () => {
      const envTrue: any = {
        WHATSAPP_ENABLED: 'true',
        WHATSAPP_PHONE_NUMBER_ID: '123',
        WHATSAPP_ACCESS_TOKEN: 'token',
      }

      const envFalse: any = {
        WHATSAPP_ENABLED: 'false',
        WHATSAPP_PHONE_NUMBER_ID: '123',
        WHATSAPP_ACCESS_TOKEN: 'token',
      }

      expect(detectFeatures(envTrue).whatsapp).toBe(true)
      expect(detectFeatures(envFalse).whatsapp).toBe(false)
    })
  })
})
