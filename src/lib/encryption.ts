// ================================================
// src/lib/encryption.ts - Data Encryption Utilities
// ================================================

import crypto from 'crypto'

const ALGORITHM = 'aes-256-gcm'
const KEY = Buffer.from(process.env.ENCRYPTION_KEY || '', 'hex')

if (!process.env.ENCRYPTION_KEY || KEY.length !== 32) {
  throw new Error('ENCRYPTION_KEY must be a 32-byte hex string')
}

export function encrypt(text: string): string {
  const iv = crypto.randomBytes(16)
  const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv)
  
  let encrypted = cipher.update(text, 'utf8', 'hex')
  encrypted += cipher.final('hex')
  
  const authTag = cipher.getAuthTag()
  
  // Combine IV + authTag + encrypted
  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`
}

export function decrypt(encryptedData: string): string {
  const parts = encryptedData.split(':')
  
  if (parts.length !== 3) {
    throw new Error('Invalid encrypted data format')
  }
  
  const iv = Buffer.from(parts[0], 'hex')
  const authTag = Buffer.from(parts[1], 'hex')
  const encrypted = parts[2]
  
  const decipher = crypto.createDecipheriv(ALGORITHM, KEY, iv)
  decipher.setAuthTag(authTag)
  
  let decrypted = decipher.update(encrypted, 'hex', 'utf8')
  decrypted += decipher.final('utf8')
  
  return decrypted
}

// Hash function for phone numbers (for indexing while keeping encrypted)
export function hashPhone(phone: string): string {
  return crypto.createHash('sha256').update(phone).digest('hex')
}