// ================================================
// src/lib/s3.ts - Cloudflare R2 File Storage (S3-Compatible)
// ================================================

import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

// Cloudflare R2 Configuration (S3-compatible)
const s3Client = new S3Client({
  region: 'auto', // R2 uses 'auto' for region
  endpoint: process.env.R2_ENDPOINT!, // https://<account_id>.r2.cloudflarestorage.com
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
})

export async function uploadToS3(
  file: Buffer,
  key: string,
  contentType: string
): Promise<string> {
  try {
    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET!,
      Key: key,
      Body: file,
      ContentType: contentType,
      // Note: R2 doesn't support ACL - use R2 bucket settings for public access
    })

    await s3Client.send(command)

    // Return R2 public URL
    // Option 1: Use custom domain (recommended)
    // return `https://${process.env.R2_PUBLIC_DOMAIN}/${key}`

    // Option 2: Use R2.dev subdomain (if enabled)
    return `https://${process.env.R2_BUCKET}.${process.env.R2_ACCOUNT_ID}.r2.dev/${key}`
  } catch (error) {
    console.error('R2 upload error:', error)
    throw new Error('File upload failed')
  }
}

export async function deleteFromS3(key: string): Promise<void> {
  try {
    const command = new DeleteObjectCommand({
      Bucket: process.env.R2_BUCKET!,
      Key: key,
    })

    await s3Client.send(command)
  } catch (error) {
    console.error('R2 delete error:', error)
    throw new Error('File deletion failed')
  }
}

export async function getPresignedUrl(key: string, expiresIn: number = 3600): Promise<string> {
  try {
    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET!,
      Key: key,
    })

    const url = await getSignedUrl(s3Client, command, { expiresIn })
    return url
  } catch (error) {
    console.error('Presigned URL error:', error)
    throw new Error('Failed to generate presigned URL')
  }
}