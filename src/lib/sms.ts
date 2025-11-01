// ================================================
// src/lib/sms.ts - SMS Service (Using MSG91 or Twilio)
// ================================================

interface SendSMSParams {
  to: string
  message: string
}

export async function sendSMS({ to, message }: SendSMSParams) {
  const provider = process.env.SMS_PROVIDER || 'msg91'

  if (provider === 'msg91') {
    return sendViaMSG91(to, message)
  } else if (provider === 'twilio') {
    return sendViaTwilio(to, message)
  }

  throw new Error('Invalid SMS provider')
}

async function sendViaMSG91(to: string, message: string) {
  try {
    const response = await fetch(
      `https://api.msg91.com/api/v5/flow/`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'authkey': process.env.MSG91_AUTH_KEY!,
        },
        body: JSON.stringify({
          sender: process.env.MSG91_SENDER_ID,
          route: '4',
          country: '91',
          sms: [
            {
              message,
              to: [to],
            },
          ],
        }),
      }
    )

    const data = await response.json()
    return { success: response.ok, data }
  } catch (error) {
    console.error('MSG91 SMS error:', error)
    return { success: false, error }
  }
}

async function sendViaTwilio(to: string, message: string) {
  // Implement Twilio SMS
  // This is a placeholder - install twilio package and implement
  console.log('Twilio SMS:', { to, message })
  return { success: true, data: {} }
}

// SMS Templates
export const smsTemplates = {
  bookingConfirmation: (name: string, plotTitle: string) =>
    `Hi ${name}, Your booking for ${plotTitle} is confirmed! Our team will contact you shortly. - Plotzed Real Estate`,

  siteVisitConfirmation: (name: string, date: string, time: string) =>
    `Hi ${name}, Your site visit is scheduled for ${date} at ${time}. See you there! - Plotzed Real Estate`,

  paymentConfirmation: (amount: number, invoiceNumber: string) =>
    `Payment of Rs.${amount.toLocaleString('en-IN')} received. Invoice: ${invoiceNumber}. Thank you! - Plotzed Real Estate`,

  otp: (otp: string) =>
    `Your Plotzed OTP is: ${otp}. Valid for 10 minutes. Do not share this with anyone.`,
}