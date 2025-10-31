// ================================================
// src/lib/validators.ts - Zod Validation Schemas
// ================================================

import { z } from 'zod'

// Phone validation (Indian format)
export const phoneSchema = z.string().regex(
  /^[6-9]\d{9}$/,
  'Invalid phone number'
)

// Email validation
export const emailSchema = z.string().email('Invalid email address')

// Password validation
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character')

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
  description: z.string().min(20),
  price: z.number().positive(),
  bookingAmount: z.number().positive(),
  plotSize: z.number().positive(),
  dimensions: z.string().optional(),
  address: z.string().min(10),
  city: z.string().min(2),
  state: z.string().min(2),
  pincode: z.string().regex(/^\d{6}$/),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  reraNumber: z.string().optional(),
  amenities: z.array(z.string()),
  isFeatured: z.boolean().default(false),
})
