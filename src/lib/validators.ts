// ================================================
// src/lib/validators.ts - Zod Validation Schemas
// ================================================

import { z } from 'zod'
import validator from 'validator'

// ================================================
// Sanitization Utilities
// ================================================

/**
 * Sanitize HTML input to prevent XSS attacks
 */
export const sanitizeHtml = (input: string): string => {
  return validator.escape(input.trim())
}

/**
 * Sanitized text schema for user-generated content
 */
export const sanitizedTextSchema = z.string().transform((val) => {
  return validator.escape(val.trim())
})

// Phone validation (Indian format)
export const phoneSchema = z.string().regex(
  /^[6-9]\d{9}$/,
  'Invalid phone number'
)

// Email validation
export const emailSchema = z.string().email('Invalid email address')

// Password validation (basic)
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character')

// Enhanced password schema with strength check and common password detection
export const strongPasswordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password too long')
  .refine((password) => {
    // Check for common passwords
    const commonPasswords = ['password', '12345678', 'qwerty', 'admin', 'letmein', 'welcome']
    return !commonPasswords.some((common) => password.toLowerCase().includes(common))
  }, 'Password too common or weak')
  .refine((password) => {
    // Check strength
    const hasUpper = /[A-Z]/.test(password)
    const hasLower = /[a-z]/.test(password)
    const hasNumber = /[0-9]/.test(password)
    const hasSpecial = /[^A-Za-z0-9]/.test(password)
    return hasUpper && hasLower && hasNumber && hasSpecial
  }, 'Password must contain uppercase, lowercase, number, and special character')

// URL validation schema
export const urlSchema = z.string().refine(
  (url) => {
    return validator.isURL(url, {
      protocols: ['http', 'https'],
      require_protocol: true,
    })
  },
  { message: 'Invalid URL format' }
)

// File upload validation schema
export const fileUploadSchema = z.object({
  name: z.string().max(255, 'Filename too long'),
  size: z.number().max(10 * 1024 * 1024, 'File too large (max 10MB)'),
  type: z.enum(['image/jpeg', 'image/png', 'image/webp', 'application/pdf']).refine(
    (val) => ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'].includes(val),
    { message: 'Invalid file type. Allowed: JPEG, PNG, WebP, PDF' }
  ),
})

// User registration schema
export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: emailSchema,
  phone: phoneSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

// Login schema
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
})

// OTP schema
export const otpSchema = z.object({
  otp: z.string().length(6, 'OTP must be 6 digits'),
})

// Inquiry schema
export const inquirySchema = z.object({
  name: z.string().min(2),
  email: emailSchema,
  phone: phoneSchema,
  message: z.string().min(10, 'Message must be at least 10 characters'),
  plotId: z.string().uuid().optional(),
  recaptchaToken: z.string(),
})

// Booking schema
export const bookingSchema = z.object({
  plotId: z.string().uuid(),
  visitDate: z.string().datetime(),
  attendees: z.number().min(1).max(10),
  notes: z.string().optional(),
})

// Plot creation schema (Admin)
export const createPlotSchema = z.object({
  title: z.string().min(5),
  description: z.string().optional(),
  price: z.number().positive(),
  originalPrice: z.number().positive().optional(),
  bookingAmount: z.number().positive().optional(),
  plotSize: z.number().positive(),
  dimensions: z.string().optional(),
  facing: z.string().optional(),
  address: z.string().min(10),
  city: z.string().min(2),
  state: z.string().min(2),
  pincode: z.string().regex(/^\d{6}$/),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  reraNumber: z.string().optional(),
  amenities: z.array(z.string()).default([]),
  heroImage: z.string().optional(),
  images: z.array(z.string()).default([]),
  brochure: z.string().optional(),
  status: z.enum(['AVAILABLE', 'BOOKED', 'SOLD']).default('AVAILABLE'),
  isFeatured: z.boolean().default(false),
  is_published: z.boolean().default(true),
})

// Plot update schema (Admin)
export const updatePlotSchema = createPlotSchema.partial()
