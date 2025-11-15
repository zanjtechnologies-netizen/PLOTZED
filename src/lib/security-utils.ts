// src/lib/security-utils.ts
import { BadRequestError } from './errors';

/**
 * Sanitize string input to prevent XSS attacks
 */
export function sanitizeString(input: string): string {
  if (!input) return '';
  
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim();
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate phone number (Indian format)
 */
export function isValidPhone(phone: string): boolean {
  // Remove spaces, dashes, and parentheses
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');
  
  // Check if it's a valid Indian phone number
  // Formats: +91XXXXXXXXXX, 91XXXXXXXXXX, 0XXXXXXXXXX, XXXXXXXXXX
  const phoneRegex = /^(\+91|91|0)?[6-9]\d{9}$/;
  return phoneRegex.test(cleaned);
}

/**
 * Validate URL format
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validate UUID format
 */
export function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

/**
 * Validate CUID format (Prisma default ID)
 */
export function isValidCUID(cuid: string): boolean {
  // CUID format: c + timestamp + counter + fingerprint + random
  const cuidRegex = /^c[a-z0-9]{24}$/;
  return cuidRegex.test(cuid);
}

/**
 * Sanitize filename to prevent path traversal
 */
export function sanitizeFilename(filename: string): string {
  // Remove path separators and null bytes
  return filename
    .replace(/[\/\\]/g, '')
    .replace(/\0/g, '')
    .replace(/\.\./g, '')
    .trim();
}

/**
 * Validate file extension
 */
export function isAllowedFileExtension(
  filename: string,
  allowedExtensions: string[]
): boolean {
  const ext = filename.toLowerCase().split('.').pop();
  return ext ? allowedExtensions.includes(ext) : false;
}

/**
 * Validate file size
 */
export function isValidFileSize(size: number, maxSizeMB: number): boolean {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return size <= maxSizeBytes;
}

/**
 * Generate secure random token
 */
export function generateSecureToken(length: number = 32): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  
  // Use crypto.getRandomValues for secure random generation
  const randomValues = new Uint8Array(length);
  crypto.getRandomValues(randomValues);
  
  for (let i = 0; i < length; i++) {
    token += chars[randomValues[i] % chars.length];
  }
  
  return token;
}

/**
 * Generate OTP (One-Time Password)
 */
export function generateOTP(length: number = 6): string {
  const digits = '0123456789';
  let otp = '';
  
  const randomValues = new Uint8Array(length);
  crypto.getRandomValues(randomValues);
  
  for (let i = 0; i < length; i++) {
    otp += digits[randomValues[i] % digits.length];
  }
  
  return otp;
}

/**
 * Hash sensitive data (for comparison, not for passwords - use bcrypt for passwords)
 */
export async function hashData(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Mask sensitive data for logging
 */
export function maskEmail(email: string): string {
  const [username, domain] = email.split('@');
  if (!username || !domain) return '***@***.***';
  
  const visibleChars = Math.min(3, Math.floor(username.length / 2));
  const masked = username.slice(0, visibleChars) + '***';
  return `${masked}@${domain}`;
}

/**
 * Mask phone number
 */
export function maskPhone(phone: string): string {
  if (phone.length < 4) return '****';
  return '****' + phone.slice(-4);
}

/**
 * Mask credit card number
 */
export function maskCardNumber(cardNumber: string): string {
  if (cardNumber.length < 4) return '****';
  return '**** **** **** ' + cardNumber.slice(-4);
}

/**
 * Validate request body size
 */
export function validateBodySize(body: any, maxSizeKB: number = 100): void {
  const bodySize = JSON.stringify(body).length;
  const maxSizeBytes = maxSizeKB * 1024;
  
  if (bodySize > maxSizeBytes) {
    throw new BadRequestError(
      `Request body too large. Maximum size: ${maxSizeKB}KB`,
      'BODY_TOO_LARGE'
    );
  }
}

/**
 * SQL Injection prevention (basic check - Prisma handles most of this)
 */
export function containsSQLInjection(input: string): boolean {
  const sqlKeywords = [
    'DROP',
    'DELETE',
    'INSERT',
    'UPDATE',
    'SELECT',
    'UNION',
    'CREATE',
    'ALTER',
    'EXEC',
    'SCRIPT',
  ];
  
  const upperInput = input.toUpperCase();
  return sqlKeywords.some(keyword => upperInput.includes(keyword));
}

/**
 * Check for common XSS patterns
 */
export function containsXSS(input: string): boolean {
  const xssPatterns = [
    /<script[^>]*>.*?<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi, // Event handlers like onclick=
    /<iframe/gi,
    /<object/gi,
    /<embed/gi,
  ];
  
  return xssPatterns.some(pattern => pattern.test(input));
}

/**
 * Validate and sanitize user input
 */
export function validateInput(input: string, fieldName: string): string {
  if (!input || typeof input !== 'string') {
    throw new BadRequestError(`${fieldName} is required and must be a string`);
  }
  
  if (containsSQLInjection(input)) {
    throw new BadRequestError(
      `${fieldName} contains potentially dangerous content`,
      'INVALID_INPUT'
    );
  }
  
  if (containsXSS(input)) {
    throw new BadRequestError(
      `${fieldName} contains potentially dangerous content`,
      'INVALID_INPUT'
    );
  }
  
  return sanitizeString(input);
}

/**
 * Time-constant string comparison to prevent timing attacks
 */
export function secureCompare(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }
  
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  
  return result === 0;
}

/**
 * Rate limit check (client-side helper)
 */
export function shouldThrottle(
  key: string,
  limit: number,
  windowMs: number
): boolean {
  if (typeof window === 'undefined') return false;
  
  const now = Date.now();
  const storageKey = `throttle_${key}`;
  
  try {
    const stored = localStorage.getItem(storageKey);
    
    if (!stored) {
      localStorage.setItem(storageKey, JSON.stringify({ count: 1, timestamp: now }));
      return false;
    }
    
    const { count, timestamp } = JSON.parse(stored);
    
    // Reset if window expired
    if (now - timestamp > windowMs) {
      localStorage.setItem(storageKey, JSON.stringify({ count: 1, timestamp: now }));
      return false;
    }
    
    // Increment count
    const newCount = count + 1;
    localStorage.setItem(storageKey, JSON.stringify({ count: newCount, timestamp }));
    
    return newCount > limit;
  } catch {
    return false;
  }
}