// ================================================
// src/app/api/upload/presigned-url/route.ts - Generate Presigned URLs for Direct S3 Uploads
// ================================================

import { NextRequest, NextResponse } from 'next/server'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { auth } from '@/lib/auth'
import { sanitizeFilename } from '@/lib/security-utils'

const s3Client = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT!,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
})

export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Admin access required' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { filename, contentType, folder } = body

    if (!filename || !contentType) {
      return NextResponse.json(
        { success: false, error: 'Filename and content type are required' },
        { status: 400 }
      )
    }

    // Validate content type
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'video/mp4',
      'video/webm',
      'video/quicktime',
      'video/x-msvideo',
    ]

    if (!allowedTypes.includes(contentType)) {
      return NextResponse.json(
        { success: false, error: 'Invalid file type' },
        { status: 400 }
      )
    }

    // Generate unique key
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(7)
    const sanitized = sanitizeFilename(filename)
    const key = `${folder || 'uploads'}/${session.user.id}/${timestamp}-${randomString}-${sanitized}`

    // Generate presigned URL for upload (expires in 10 minutes)
    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET!,
      Key: key,
      ContentType: contentType,
    })

    const presignedUrl = await getSignedUrl(s3Client, command, { expiresIn: 600 })

    // The public URL that will be accessible after upload
    const publicUrl = `${process.env.CLOUDFLARE_R2_PUBLIC_URL}/${key}`

    return NextResponse.json({
      success: true,
      data: {
        presignedUrl,
        publicUrl,
        key,
      },
    })
  } catch (error) {
    console.error('Presigned URL generation error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to generate upload URL' },
      { status: 500 }
    )
  }
}
