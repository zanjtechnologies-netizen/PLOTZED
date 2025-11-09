import '@testing-library/jest-dom'
import "whatwg-fetch";
import { NextResponse } from 'next/server';

Object.defineProperty(NextResponse, 'json', {
  value: (data: any, init?: ResponseInit) =>
    new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
      status: init?.status ?? 200,
    }),
});
// Mock environment variables for testing
(process.env as any).NODE_ENV = 'test';
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/plotzed_test'
process.env.NEXTAUTH_SECRET = "test-secret-key-for-testing-purposes-only-1234567890";
process.env.NEXTAUTH_URL = 'http://localhost:3000'

// Mock external services
jest.mock('@/lib/email', () => ({
  sendEmail: jest.fn().mockResolvedValue({ success: true, messageId: 'test-message-id' }),
  sendPaymentConfirmationEmail: jest.fn().mockResolvedValue({ success: true }),
  sendPaymentFailedEmail: jest.fn().mockResolvedValue({ success: true }),
  sendRefundConfirmationEmail: jest.fn().mockResolvedValue({ success: true }),
  emailService: {
    sendOTP: jest.fn().mockResolvedValue({ success: true }),
    sendBookingConfirmation: jest.fn().mockResolvedValue({ success: true }),
    sendContactFormToAdmin: jest.fn().mockResolvedValue({ success: true }),
    sendSiteVisitConfirmation: jest.fn().mockResolvedValue({ success: true }),
  },
}))

jest.mock('@/lib/whatsapp', () => ({
  sendWhatsAppMessage: jest.fn().mockResolvedValue({ success: true, messageId: 'test-whatsapp-id' }),
  sendOTPWhatsApp: jest.fn().mockResolvedValue({ success: true }),
  sendBookingConfirmationWhatsApp: jest.fn().mockResolvedValue({ success: true }),
  sendSiteVisitConfirmationWhatsApp: jest.fn().mockResolvedValue({ success: true }),
  sendPaymentConfirmationWhatsApp: jest.fn().mockResolvedValue({ success: true }),
  sendPaymentFailedWhatsApp: jest.fn().mockResolvedValue({ success: true }),
  sendInquiryReceivedWhatsApp: jest.fn().mockResolvedValue({ success: true }),
}))

// Mock Sentry
jest.mock('@sentry/nextjs', () => ({
  captureException: jest.fn(),
  captureMessage: jest.fn(),
  init: jest.fn(),
}))

// Mock Prisma
jest.mock('@/lib/prisma', () => ({
  prisma: {
    $queryRaw: jest.fn(),
    $disconnect: jest.fn(),
  },
}))

// Suppress console errors in tests (optional)
global.console = {
  ...console,
  error: jest.fn(),
  warn: jest.fn(),
}
