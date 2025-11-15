// src/lib/file-security.ts

import crypto from 'crypto'
import { fileTypeFromBuffer } from 'file-type'

// Verify file type by magic numbers (not just extension)
export async function verifyFileType(buffer: Buffer): Promise<{
  valid: boolean
  mimeType?: string
}> {
  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'application/pdf',
  ]

  const type = await fileTypeFromBuffer(buffer)
  
  if (!type || !allowedTypes.includes(type.mime)) {
    return { valid: false }
  }

  return { valid: true, mimeType: type.mime }
}

// Scan for malicious content (basic check)
export function scanFileContent(buffer: Buffer): boolean {
  const content = buffer.toString('utf8')
  
  // Check for common malicious patterns
  const maliciousPatterns = [
    /<script/i,
    /javascript:/i,
    /onerror=/i,
    /onload=/i,
    /<iframe/i,
  ]

  return !maliciousPatterns.some(pattern => pattern.test(content))
}

// Generate secure random filename
export function generateSecureFilename(originalName: string): string {
  const timestamp = Date.now()
  const randomBytes = crypto.randomBytes(16).toString('hex')
  const ext = originalName.split('.').pop()?.toLowerCase() || ''
  
  return `${timestamp}-${randomBytes}.${ext}`
}
