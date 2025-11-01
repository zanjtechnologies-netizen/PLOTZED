// src/lib/encryption-enhanced.ts

import crypto from 'crypto'

const ALGORITHM = 'aes-256-gcm'
const KEY = Buffer.from(process.env.ENCRYPTION_KEY!, 'hex')
const IV_LENGTH = 16
const AUTH_TAG_LENGTH = 16

// Encrypt sensitive data before storing
export function encryptSensitiveData(text: string): string {
  const iv = crypto.randomBytes(IV_LENGTH)
  const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv)
  
  let encrypted = cipher.update(text, 'utf8', 'hex')
  encrypted += cipher.final('hex')
  
  const authTag = cipher.getAuthTag()
  
  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`
}

// Decrypt sensitive data
export function decryptSensitiveData(encryptedData: string): string {
  const [ivHex, authTagHex, encrypted] = encryptedData.split(':')
  
  const iv = Buffer.from(ivHex, 'hex')
  const authTag = Buffer.from(authTagHex, 'hex')
  
  const decipher = crypto.createDecipheriv(ALGORITHM, KEY, iv)
  decipher.setAuthTag(authTag)
  
  let decrypted = decipher.update(encrypted, 'hex', 'utf8')
  decrypted += decipher.final('utf8')
  
  return decrypted
}

// Hash PII for searching while keeping encrypted
export function hashPII(data: string): string {
  return crypto.createHash('sha256').update(data).digest('hex')
}

// Encrypt email before storing
export function encryptEmail(email: string): {
  encrypted: string
  searchHash: string
} {
  return {
    encrypted: encryptSensitiveData(email),
    searchHash: hashPII(email.toLowerCase()),
  }
}

// Encrypt phone before storing
export function encryptPhone(phone: string): {
  encrypted: string
  searchHash: string
} {
  return {
    encrypted: encryptSensitiveData(phone),
    searchHash: hashPII(phone),
  }
}