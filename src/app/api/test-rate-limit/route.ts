// ================================================
// src/app/api/test-rate-limit/route.ts - Test Rate Limiting
// ================================================

import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'Rate limiting is working!',
    ip: request.headers.get('x-forwarded-for'),
    timestamp: new Date().toISOString(),
  })
}
