// ================================================
// src/app/api/upload/video/route.ts - Video Upload API
// ================================================

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { uploadToS3 } from '@/lib/s3'
import { successResponse, withErrorHandling } from '@/lib/api-error-handler'
import { BadRequestError, UnauthorizedError } from '@/lib/errors'
import { structuredLogger } from '@/lib/structured-logger'
import { sanitizeFilename } from '@/lib/security-utils'

// Configure route for large file uploads
export const runtime = 'nodejs'
export const maxDuration = 60 // 60 seconds max execution time
export const dynamic = 'force-dynamic'

// Note: Use FormData API directly without wrapping in withErrorHandling to avoid body parsing issues
export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user || session.user.role !== 'ADMIN') {
      throw new UnauthorizedError('Admin access required to upload videos')
    }

    let formData: FormData
    try {
      formData = await request.formData()
    } catch (error) {
      console.error('FormData parsing error:', error)
      throw new BadRequestError('Failed to parse form data. Please ensure you are sending multipart/form-data.')
    }

    const file = formData.get('file') as File
    const folder = (formData.get('folder') as string) || 'videos'

    if (!file) {
      throw new BadRequestError('No file provided')
    }

    // Validate file type - support common video formats
    const allowedTypes = [
      'video/mp4',
      'video/webm',
      'video/quicktime', // .mov
      'video/x-msvideo', // .avi
    ]

    if (!allowedTypes.includes(file.type)) {
      throw new BadRequestError('Invalid video format. Only MP4, WebM, MOV, and AVI allowed.')
    }

    // Validate file size (100MB max for videos)
    const maxSize = 100 * 1024 * 1024
    if (file.size > maxSize) {
      throw new BadRequestError('Video too large. Maximum size is 100MB.')
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Generate unique key with folder organization
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(7)
    const sanitizedFilename = sanitizeFilename(file.name)
    const key = `${folder}/${session.user.id}/${timestamp}-${randomString}-${sanitizedFilename}`

    // Upload to S3
    const url = await uploadToS3(buffer, key, file.type)

    structuredLogger.info('Video uploaded successfully', {
      userId: session.user.id,
      fileKey: key,
      fileSize: file.size,
      fileType: file.type,
      type: 'video_upload',
    })

    return successResponse({ url, key })
  } catch (error) {
    console.error('Video upload error:', error)

    if (error instanceof UnauthorizedError) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 401 }
      )
    }

    if (error instanceof BadRequestError) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, error: 'Failed to upload video. Please try again.' },
      { status: 500 }
    )
  }
}
