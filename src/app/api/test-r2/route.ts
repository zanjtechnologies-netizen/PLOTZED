// ================================================
// src/app/api/test-r2/route.ts - R2 Storage Test Endpoint
// ================================================

import { NextRequest, NextResponse } from 'next/server'
import { S3Client, ListBucketsCommand, PutObjectCommand } from '@aws-sdk/client-s3'

export async function GET(request: NextRequest) {
  try {
    // Check environment variables
    const envVars = {
      R2_ENDPOINT: process.env.R2_ENDPOINT ? '✓ SET' : '✗ NOT SET',
      R2_ACCESS_KEY_ID: process.env.R2_ACCESS_KEY_ID ? '✓ SET' : '✗ NOT SET',
      R2_SECRET_ACCESS_KEY: process.env.R2_SECRET_ACCESS_KEY ? '✓ SET' : '✗ NOT SET',
      R2_BUCKET: process.env.R2_BUCKET ? '✓ SET' : '✗ NOT SET',
      R2_ACCOUNT_ID: process.env.R2_ACCOUNT_ID ? '✓ SET' : '✗ NOT SET',
    }

    // Initialize R2 client
    const s3Client = new S3Client({
      region: 'auto',
      endpoint: process.env.R2_ENDPOINT,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
      },
    })

    // Test connection by listing buckets
    let connectionTest = 'NOT TESTED'
    try {
      await s3Client.send(new ListBucketsCommand({}))
      connectionTest = '✓ CONNECTION SUCCESSFUL'
    } catch (error: any) {
      connectionTest = `✗ CONNECTION FAILED: ${error.message}`
    }

    // Test upload
    let uploadTest = 'NOT TESTED'
    try {
      const testContent = `R2 Test File - ${new Date().toISOString()}`
      const testKey = `test/r2-test-${Date.now()}.txt`

      await s3Client.send(new PutObjectCommand({
        Bucket: process.env.R2_BUCKET!,
        Key: testKey,
        Body: Buffer.from(testContent),
        ContentType: 'text/plain',
      }))

      const publicUrl = `https://${process.env.R2_BUCKET}.${process.env.R2_ACCOUNT_ID}.r2.dev/${testKey}`
      uploadTest = `✓ UPLOAD SUCCESSFUL\nTest file: ${publicUrl}`
    } catch (error: any) {
      uploadTest = `✗ UPLOAD FAILED: ${error.message}`
    }

    return NextResponse.json({
      success: true,
      r2Status: {
        environmentVariables: envVars,
        connectionTest,
        uploadTest,
        endpoint: process.env.R2_ENDPOINT,
        bucket: process.env.R2_BUCKET,
        publicUrlPattern: `https://${process.env.R2_BUCKET}.${process.env.R2_ACCOUNT_ID}.r2.dev/`,
      }
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack,
    }, { status: 500 })
  }
}
