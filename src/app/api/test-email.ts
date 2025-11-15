// src/app/api/test-email/route.ts
import { NextResponse } from 'next/server';
import { emailService } from '@/lib/email';

export async function GET() {
  try {
    // Test OTP email
    const result = await emailService.sendOTP(
      'plotzedrealestate@gmail.com', // Replace with your email
      '123456',
      'Test User'
    );

    return NextResponse.json({
      success: true,
      message: 'Test email sent!',
      result,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}