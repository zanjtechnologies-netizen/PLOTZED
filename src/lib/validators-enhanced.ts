// src/lib/validators-enhanced.ts

import { z } from 'zod'
import validator from 'validator'

// Sanitize HTML input
export const sanitizeHtml = (input: string): string => {
  return validator.escape(input.trim())
}

// Enhanced password schema with strength check
export const strongPasswordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password too long')
  .refine((password) => {
    // Check for common passwords
    const commonPasswords = ['password', '12345678', 'qwerty', 'admin']
    return !commonPasswords.some(common => password.toLowerCase().includes(common))
  }, 'Password too common')
  .refine((password) => {
    // Check strength
    const hasUpper = /[A-Z]/.test(password)
    const hasLower = /[a-z]/.test(password)
    const hasNumber = /[0-9]/.test(password)
    const hasSpecial = /[^A-Za-z0-9]/.test(password)
    return hasUpper && hasLower && hasNumber && hasSpecial
  }, 'Password must contain uppercase, lowercase, number, and special character')

// File upload validation
export const fileUploadSchema = z.object({
  name: z.string().max(255),
  size: z.number().max(10 * 1024 * 1024, 'File too large (max 10MB)'),
  type: z.enum([
    'image/jpeg',
    'image/png',
    'image/webp',
    'application/pdf',]),
Error: z.refine((val: any) => !!val,{
        message: "Invalid file type. Allowed: jpeg, png, webp, pdf ",
    })
  })

// Prevent XSS in text fields
export const sanitizedTextSchema = z.string().transform((val) => {
  return validator.escape(val.trim())
})

// URL validation
export const urlSchema = z.string().refine((url) => {
  return validator.isURL(url, {
    protocols: ['http', 'https'],
    require_protocol: true,
  })
}, 'Invalid URL')