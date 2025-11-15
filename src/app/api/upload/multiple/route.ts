// ================================================
// src/app/api/upload/multiple/route.ts - Multiple File Upload to S3
// ================================================

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { uploadToS3 } from '@/lib/s3'
import { verifyFileType, scanFileContent } from '@/lib/file-security'

const MAX_FILES = 10
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB per file

export async function POST(request: NextRequest) {
  try {
    // Authentication check
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    const files = formData.getAll('files') as File[]

    if (!files || files.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No files provided' },
        { status: 400 }
      )
    }

    if (files.length > MAX_FILES) {
      return NextResponse.json(
        { success: false, error: `Maximum ${MAX_FILES} files allowed` },
        { status: 400 }
      )
    }

    // Validate all files first
    for (const file of files) {
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          {
            success: false,
            error: `File ${file.name} exceeds maximum size of 10MB`,
          },
          { status: 400 }
        )
      }

      // Verify file type
      const buffer = Buffer.from(await file.arrayBuffer())
      const fileTypeCheck = await verifyFileType(buffer)
      if (!fileTypeCheck.valid) {
        return NextResponse.json(
          {
            success: false,
            error: `File ${file.name}: Invalid file type`,
          },
          { status: 400 }
        )
      }

      // Scan for malicious content
      if (!scanFileContent(buffer)) {
        return NextResponse.json(
          {
            success: false,
            error: `File ${file.name}: Potentially malicious content detected`,
          },
          { status: 400 }
        )
      }
    }

    // Upload all files
    const uploadResults = await Promise.allSettled(
      files.map(async (file) => {
        const buffer = Buffer.from(await file.arrayBuffer())
        const folder = formData.get('folder') as string || 'uploads'
        const key = `${folder}/${session.user.id}/${Date.now()}-${file.name}`

        return uploadToS3(buffer, key, file.type)
      })
    )

    // Process results
    const successfulUploads: any[] = []
    const failedUploads: any[] = []

    uploadResults.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        successfulUploads.push({
          filename: files[index].name,
          url: result.value,
          size: files[index].size,
          type: files[index].type,
        })
      } else {
        failedUploads.push({
          filename: files[index].name,
          error: result.reason?.message || 'Upload failed',
        })
      }
    })

    return NextResponse.json({
      success: failedUploads.length === 0,
      data: {
        uploaded: successfulUploads,
        failed: failedUploads,
        total: files.length,
        successful: successfulUploads.length,
        failed_count: failedUploads.length,
      },
    })
  } catch (error) {
    console.error('Multiple upload error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to upload files' },
      { status: 500 }
    )
  }
}
