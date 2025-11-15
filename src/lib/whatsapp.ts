// ================================================
// src/lib/whatsapp.ts - WhatsApp Business API Service
// Using Meta (Facebook) WhatsApp Cloud API
// ================================================

import { structuredLogger } from './structured-logger'

interface SendWhatsAppParams {
  to: string // Phone number in international format (e.g., 919876543210)
  templateName: string
  templateParams?: string[]
  language?: string
}

interface WhatsAppTemplateMessage {
  messaging_product: 'whatsapp'
  to: string
  type: 'template'
  template: {
    name: string
    language: {
      code: string
    }
    components?: Array<{
      type: string
      parameters: Array<{
        type: string
        text: string
      }>
    }>
  }
}

/**
 * Send WhatsApp template message using Meta WhatsApp Cloud API
 *
 * @see https://developers.facebook.com/docs/whatsapp/cloud-api/guides/send-messages
 */
export async function sendWhatsAppMessage({
  to,
  templateName,
  templateParams = [],
  language = 'en',
}: SendWhatsAppParams) {
  const whatsappEnabled = process.env.WHATSAPP_ENABLED === 'true'

  if (!whatsappEnabled) {
    structuredLogger.info('WhatsApp notifications disabled', { to, templateName })
    return { success: true, skipped: true }
  }

  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN

  if (!phoneNumberId || !accessToken) {
    structuredLogger.error('WhatsApp credentials not configured', new Error('Missing WHATSAPP_PHONE_NUMBER_ID or WHATSAPP_ACCESS_TOKEN'))
    return { success: false, error: 'WhatsApp not configured' }
  }

  // Ensure phone number is in international format (remove + if present)
  const formattedPhone = to.replace(/^\+/, '').replace(/\D/g, '')

  try {
    const message: WhatsAppTemplateMessage = {
      messaging_product: 'whatsapp',
      to: formattedPhone,
      type: 'template',
      template: {
        name: templateName,
        language: {
          code: language,
        },
      },
    }

    // Add parameters if provided
    if (templateParams.length > 0) {
      message.template.components = [
        {
          type: 'body',
          parameters: templateParams.map((param) => ({
            type: 'text',
            text: param,
          })),
        },
      ]
    }

    const response = await fetch(
      `https://graph.facebook.com/v21.0/${phoneNumberId}/messages`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(message),
      }
    )

    const data = await response.json()

    if (!response.ok) {
      structuredLogger.error('WhatsApp API error', new Error(data.error?.message || 'Unknown error'), {
        to: formattedPhone,
        templateName,
        statusCode: response.status,
        errorData: data,
      })
      return { success: false, error: data.error?.message, data }
    }

    structuredLogger.info('WhatsApp message sent successfully', {
      to: formattedPhone,
      templateName,
      messageId: data.messages?.[0]?.id,
    })

    return { success: true, data, messageId: data.messages?.[0]?.id }
  } catch (error) {
    structuredLogger.error('WhatsApp send error', error as Error, {
      to: formattedPhone,
      templateName,
    })
    return { success: false, error }
  }
}

// ================================================
// WhatsApp Template Helper Functions
// ================================================

/**
 * Send OTP via WhatsApp
 * Template must be pre-approved in Meta Business Manager
 */
export async function sendOTPWhatsApp(phone: string, otp: string) {
  return sendWhatsAppMessage({
    to: phone,
    templateName: 'otp_verification', // Create this template in Meta Business Manager
    templateParams: [otp],
    language: 'en',
  })
}

/**
 * Send booking confirmation via WhatsApp
 * Template must be pre-approved in Meta Business Manager
 */
export async function sendBookingConfirmationWhatsApp(
  phone: string,
  name: string,
  plotTitle: string,
  bookingId: string
) {
  return sendWhatsAppMessage({
    to: phone,
    templateName: 'booking_confirmation', // Create this template in Meta Business Manager
    templateParams: [name, plotTitle, bookingId],
    language: 'en',
  })
}

/**
 * Send site visit confirmation via WhatsApp
 * Template must be pre-approved in Meta Business Manager
 */
export async function sendSiteVisitConfirmationWhatsApp(
  phone: string,
  name: string,
  plotTitle: string,
  visitDate: string,
  visitTime: string
) {
  return sendWhatsAppMessage({
    to: phone,
    templateName: 'site_visit_confirmation', // Create this template in Meta Business Manager
    templateParams: [name, plotTitle, visitDate, visitTime],
    language: 'en',
  })
}

/**
 * Send payment confirmation via WhatsApp
 * Template must be pre-approved in Meta Business Manager
 */
export async function sendPaymentConfirmationWhatsApp(
  phone: string,
  name: string,
  amount: number,
  invoiceNumber: string,
  plotTitle: string
) {
  const formattedAmount = amount.toLocaleString('en-IN')

  return sendWhatsAppMessage({
    to: phone,
    templateName: 'payment_confirmation', // Create this template in Meta Business Manager
    templateParams: [name, formattedAmount, invoiceNumber, plotTitle],
    language: 'en',
  })
}

/**
 * Send payment failed notification via WhatsApp
 * Template must be pre-approved in Meta Business Manager
 */
export async function sendPaymentFailedWhatsApp(
  phone: string,
  name: string,
  amount: number,
  plotTitle: string
) {
  const formattedAmount = amount.toLocaleString('en-IN')

  return sendWhatsAppMessage({
    to: phone,
    templateName: 'payment_failed', // Create this template in Meta Business Manager
    templateParams: [name, formattedAmount, plotTitle],
    language: 'en',
  })
}

/**
 * Send inquiry received confirmation via WhatsApp
 * Template must be pre-approved in Meta Business Manager
 */
export async function sendInquiryReceivedWhatsApp(
  phone: string,
  name: string
) {
  return sendWhatsAppMessage({
    to: phone,
    templateName: 'inquiry_received', // Create this template in Meta Business Manager
    templateParams: [name],
    language: 'en',
  })
}

// ================================================
// Template Names Reference (for Meta Business Manager)
// ================================================

/**
 * IMPORTANT: These templates must be created and approved in Meta Business Manager
 * before they can be used. Below are the suggested template structures:
 *
 * 1. otp_verification
 *    Category: AUTHENTICATION
 *    Body: "Your Plotzed verification code is {{1}}. Valid for 10 minutes."
 *
 * 2. booking_confirmation
 *    Category: TRANSACTIONAL
 *    Body: "Hi {{1}}, your booking for {{2}} (ID: {{3}}) is confirmed! Our team will contact you shortly."
 *
 * 3. site_visit_confirmation
 *    Category: TRANSACTIONAL
 *    Body: "Hi {{1}}, your site visit for {{2}} is scheduled on {{3}} at {{4}}. See you there!"
 *
 * 4. payment_confirmation
 *    Category: TRANSACTIONAL
 *    Body: "Hi {{1}}, payment of ₹{{2}} received for {{4}}. Invoice: {{3}}. Thank you!"
 *
 * 5. payment_failed
 *    Category: TRANSACTIONAL
 *    Body: "Hi {{1}}, payment of ₹{{2}} for {{3}} failed. Please try again or contact support."
 *
 * 6. inquiry_received
 *    Category: TRANSACTIONAL
 *    Body: "Hi {{1}}, we received your inquiry. Our team will contact you within 24 hours."
 */

export const whatsappTemplateNames = {
  OTP_VERIFICATION: 'otp_verification',
  BOOKING_CONFIRMATION: 'booking_confirmation',
  SITE_VISIT_CONFIRMATION: 'site_visit_confirmation',
  PAYMENT_CONFIRMATION: 'payment_confirmation',
  PAYMENT_FAILED: 'payment_failed',
  INQUIRY_RECEIVED: 'inquiry_received',
} as const
