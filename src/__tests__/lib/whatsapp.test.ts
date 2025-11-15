/**
 * Unit tests for WhatsApp service
 */

import {
  sendWhatsAppMessage,
  sendOTPWhatsApp,
  sendBookingConfirmationWhatsApp,
  sendPaymentConfirmationWhatsApp,
  sendPaymentFailedWhatsApp,
  sendInquiryReceivedWhatsApp,
} from '@/lib/whatsapp'

// Unmock for unit testing
jest.unmock('@/lib/whatsapp')

// Mock fetch globally
global.fetch = jest.fn()

describe('WhatsApp Service', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    process.env.WHATSAPP_ENABLED = 'true'
    process.env.WHATSAPP_PHONE_NUMBER_ID = '123456789'
    process.env.WHATSAPP_ACCESS_TOKEN = 'test_token'
  })

  describe('sendWhatsAppMessage', () => {
    it('should send WhatsApp message successfully', async () => {
      const mockResponse = {
        messages: [{ id: 'wamid.test123' }],
      }

      ;(global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      })

      const result = await sendWhatsAppMessage({
        to: '919876543210',
        templateName: 'test_template',
        templateParams: ['param1', 'param2'],
      })

      expect(result.success).toBe(true)
      expect(result.messageId).toBe('wamid.test123')
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/messages'),
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Authorization': 'Bearer test_token',
          }),
        })
      )
    })

    it('should return skipped when WhatsApp is disabled', async () => {
      process.env.WHATSAPP_ENABLED = 'false'

      const result = await sendWhatsAppMessage({
        to: '919876543210',
        templateName: 'test_template',
      })

      expect(result.success).toBe(true)
      expect(result.skipped).toBe(true)
      expect(global.fetch).not.toHaveBeenCalled()
    })

    it('should handle API errors gracefully', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 400,
        json: async () => ({
          error: { message: 'Template not found' },
        }),
      })

      const result = await sendWhatsAppMessage({
        to: '919876543210',
        templateName: 'invalid_template',
      })

      expect(result.success).toBe(false)
      expect(result.error).toBe('Template not found')
    })

    it('should format phone number correctly', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({ messages: [{ id: 'test' }] }),
      })

      await sendWhatsAppMessage({
        to: '+91 98765 43210', // Phone with + and spaces
        templateName: 'test',
      })

      const callBody = JSON.parse(
        (global.fetch as jest.Mock).mock.calls[0][1].body
      )
      expect(callBody.to).toBe('919876543210') // Should be cleaned
    })

    it('should return error when credentials missing', async () => {
      delete process.env.WHATSAPP_ACCESS_TOKEN

      const result = await sendWhatsAppMessage({
        to: '919876543210',
        templateName: 'test',
      })

      expect(result.success).toBe(false)
      expect(result.error).toBe('WhatsApp not configured')
    })
  })

  describe('sendOTPWhatsApp', () => {
    it('should send OTP via WhatsApp', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({ messages: [{ id: 'test' }] }),
      })

      const result = await sendOTPWhatsApp('919876543210', '123456')

      expect(result.success).toBe(true)
      const callBody = JSON.parse(
        (global.fetch as jest.Mock).mock.calls[0][1].body
      )
      expect(callBody.template.name).toBe('otp_verification')
      expect(callBody.template.components[0].parameters[0].text).toBe('123456')
    })
  })

  describe('sendBookingConfirmationWhatsApp', () => {
    it('should send booking confirmation', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({ messages: [{ id: 'test' }] }),
      })

      const result = await sendBookingConfirmationWhatsApp(
        '919876543210',
        'John Doe',
        'Sunrise Villa Plot 12',
        'BK-001-2025'
      )

      expect(result.success).toBe(true)
      const callBody = JSON.parse(
        (global.fetch as jest.Mock).mock.calls[0][1].body
      )
      expect(callBody.template.name).toBe('booking_confirmation')
      expect(callBody.template.components[0].parameters).toHaveLength(3)
    })
  })

  describe('sendPaymentConfirmationWhatsApp', () => {
    it('should send payment confirmation with formatted amount', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({ messages: [{ id: 'test' }] }),
      })

      const result = await sendPaymentConfirmationWhatsApp(
        '919876543210',
        'John Doe',
        50000,
        'INV-2025-001',
        'Sunrise Villa Plot 12'
      )

      expect(result.success).toBe(true)
      const callBody = JSON.parse(
        (global.fetch as jest.Mock).mock.calls[0][1].body
      )
      expect(callBody.template.name).toBe('payment_confirmation')
      // Check amount is formatted with Indian locale
      expect(callBody.template.components[0].parameters[1].text).toBe('50,000')
    })
  })

  describe('sendPaymentFailedWhatsApp', () => {
    it('should send payment failed notification', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({ messages: [{ id: 'test' }] }),
      })

      const result = await sendPaymentFailedWhatsApp(
        '919876543210',
        'John Doe',
        50000,
        'Sunrise Villa Plot 12'
      )

      expect(result.success).toBe(true)
      const callBody = JSON.parse(
        (global.fetch as jest.Mock).mock.calls[0][1].body
      )
      expect(callBody.template.name).toBe('payment_failed')
    })
  })

  describe('sendInquiryReceivedWhatsApp', () => {
    it('should send inquiry confirmation', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({ messages: [{ id: 'test' }] }),
      })

      const result = await sendInquiryReceivedWhatsApp(
        '919876543210',
        'John Doe'
      )

      expect(result.success).toBe(true)
      const callBody = JSON.parse(
        (global.fetch as jest.Mock).mock.calls[0][1].body
      )
      expect(callBody.template.name).toBe('inquiry_received')
      expect(callBody.template.components[0].parameters).toHaveLength(1)
    })
  })

  describe('Error handling', () => {
    it('should handle network errors', async () => {
      ;(global.fetch as jest.Mock).mockRejectedValue(
        new Error('Network error')
      )

      const result = await sendWhatsAppMessage({
        to: '919876543210',
        templateName: 'test',
      })

      expect(result.success).toBe(false)
      expect(result.error).toBeInstanceOf(Error)
    })

    it('should handle missing template parameters', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({ messages: [{ id: 'test' }] }),
      })

      const result = await sendWhatsAppMessage({
        to: '919876543210',
        templateName: 'test',
        templateParams: [], // No parameters
      })

      expect(result.success).toBe(true)
      const callBody = JSON.parse(
        (global.fetch as jest.Mock).mock.calls[0][1].body
      )
      expect(callBody.template.components).toBeUndefined()
    })
  })
})
