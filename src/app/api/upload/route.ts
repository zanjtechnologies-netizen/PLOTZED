// ================================================
// src/app/api/upload/route.ts - File Upload API
// ================================================

import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { uploadToS3 } from '@/lib/s3'
import { successResponse, withErrorHandling } from '@/lib/api-error-handler'
import { BadRequestError, UnauthorizedError } from '@/lib/errors'
import { structuredLogger } from '@/lib/structured-logger'

export const POST = withErrorHandling(
  async (request: NextRequest) => {
    const session = await auth()

    if (!session?.user) {
      throw new UnauthorizedError('Please login to upload files')
    }

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      throw new BadRequestError('No file provided')
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
    if (!allowedTypes.includes(file.type)) {
      throw new BadRequestError('Invalid file type. Only JPEG, PNG, WEBP, and PDF allowed.')
    }

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024
    if (file.size > maxSize) {
      throw new BadRequestError('File too large. Maximum size is 10MB.')
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Generate unique key
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(7)
    const key = `uploads/${session.user.id}/${timestamp}-${randomString}-${file.name}`

    // Upload to S3
    const url = await uploadToS3(buffer, key, file.type)

    structuredLogger.info('File uploaded successfully', {
      userId: session.user.id,
      fileKey: key,
      fileSize: file.size,
      fileType: file.type,
      type: 'file_upload',
    })

    return successResponse({ url, key })
  },
  'POST /api/upload'
)