// ================================================
// src/lib/helpers.ts - Helper Functions
// ================================================

// Generate slug from title
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    + '-' + Date.now()
}

// Format currency
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

// Format date
export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
  }).format(new Date(date))
}

// Calculate EMI
export function calculateEMI(
  principal: number,
  annualRate: number,
  months: number
): number {
  const monthlyRate = annualRate / 12 / 100
  const emi =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
    (Math.pow(1 + monthlyRate, months) - 1)
  return Math.round(emi)
}

// Validate Indian phone number
export function validatePhone(phone: string): boolean {
  return /^[6-9]\d{9}$/.test(phone)
}

// Validate email
export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

// Generate OTP
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// Sanitize filename
export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .replace(/_{2,}/g, '_')
    .toLowerCase()
}

// Get file extension
export function getFileExtension(filename: string): string {
  return filename.split('.').pop()?.toLowerCase() || ''
}