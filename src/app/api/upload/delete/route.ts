// ================================================
// src/app/api/upload/delete/route.ts - Delete File from S3
// ================================================

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { deleteFromS3 } from '@/lib/s3'

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

    const body = await request.json()
    const { url, key } = body

    if (!url && !key) {
      return NextResponse.json(
        { success: false, error: 'URL or key is required' },
        { status: 400 }
      )
    }

    let s3Key = key

    // Extract key from URL if key not provided
    if (!s3Key && url) {
      try {
        const urlObj = new URL(url)
        const pathParts = urlObj.pathname.split('/')
        s3Key = pathParts.slice(1).join('/') // Remove leading slash
      } catch (error) {
        return NextResponse.json(
          { success: false, error: 'Invalid URL format' },
          { status: 400 }
        )
      }
    }

    // Security check: Only allow deletion of user's own files or admin
    if (session.user.role !== 'ADMIN') {
      if (!s3Key.includes(session.user.id)) {
        return NextResponse.json(
          { success: false, error: 'Unauthorized to delete this file' },
          { status: 403 }
        )
      }
    }

    await deleteFromS3(s3Key)

    return NextResponse.json({
      success: true,
      message: 'File deleted successfully',
      deletedKey: s3Key,
    })
  } catch (error) {
    console.error('File deletion error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete file' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  // Also support DELETE method
  return POST(request)
}
