// ================================================
// src/lib/email.ts - Email Service (Using Resend)
// ================================================

import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

interface SendEmailParams {
  to: string
  subject: string
  html: string
}

export async function sendEmail({ to, subject, html }: SendEmailParams) {
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.FROM_EMAIL || 'onboarding@resend.dev',
      to,
      subject,
      html,
    })

    if (error) {
      console.error('Email send error:', error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Email send error:', error)
    return { success: false, error }
  }
}

// Email Templates

export const emailTemplates = {
  welcomeEmail: (name: string) => `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #0ea5e9; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9fafb; }
          .button { display: inline-block; padding: 12px 24px; background: #0ea5e9; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to Plotzed Real Estate!</h1>
          </div>
          <div class="content">
            <p>Hi ${name},</p>
            <p>Thank you for registering with Plotzed Real Estate. We're excited to help you find your dream property!</p>
            <p>What's next?</p>
            <ul>
              <li>Browse our available properties</li>
              <li>Schedule site visits</li>
              <li>Pre-book your favorite plots</li>
            </ul>
            <a href="${process.env.NEXTAUTH_URL}/properties" class="button">Browse Properties</a>
            <p>If you have any questions, feel free to reach out to us.</p>
            <p>Best regards,<br>Plotzed Team</p>
          </div>
        </div>
      </body>
    </html>
  `,

  bookingConfirmation: (name: string, plotTitle: string, bookingAmount: number) => `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #10b981; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9fafb; }
          .details { background: white; padding: 15px; margin: 20px 0; border-radius: 6px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Booking Confirmed! 🎉</h1>
          </div>
          <div class="content">
            <p>Hi ${name},</p>
            <p>Congratulations! Your booking has been confirmed.</p>
            <div class="details">
              <h3>Booking Details:</h3>
              <p><strong>Property:</strong> ${plotTitle}</p>
              <p><strong>Booking Amount:</strong> ₹${bookingAmount.toLocaleString('en-IN')}</p>
              <p><strong>Status:</strong> Confirmed</p>
            </div>
            <p>Our team will contact you shortly to complete the documentation process.</p>
            <p>Best regards,<br>Plotzed Team</p>
          </div>
        </div>
      </body>
    </html>
  `,

  inquiryReceived: (name: string, plotTitle: string) => `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #0ea5e9; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9fafb; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Thank You for Your Inquiry</h1>
          </div>
          <div class="content">
            <p>Hi ${name},</p>
            <p>We have received your inquiry about <strong>${plotTitle}</strong>.</p>
            <p>Our team will contact you within 24 hours to answer your questions and provide more information.</p>
            <p>In the meantime, feel free to explore more properties on our website.</p>
            <p>Best regards,<br>Plotzed Team</p>
          </div>
        </div>
      </body>
    </html>
  `,

  siteVisitConfirmation: (name: string, plotTitle: string, visitDate: string, visitTime: string) => `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #8b5cf6; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9fafb; }
          .details { background: white; padding: 15px; margin: 20px 0; border-radius: 6px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Site Visit Scheduled 📅</h1>
          </div>
          <div class="content">
            <p>Hi ${name},</p>
            <p>Your site visit has been scheduled successfully!</p>
            <div class="details">
              <h3>Visit Details:</h3>
              <p><strong>Property:</strong> ${plotTitle}</p>
              <p><strong>Date:</strong> ${visitDate}</p>
              <p><strong>Time:</strong> ${visitTime}</p>
            </div>
            <p>Please arrive 10 minutes early. Our representative will meet you at the site.</p>
            <p>Looking forward to seeing you!</p>
            <p>Best regards,<br>Plotzed Team</p>
          </div>
        </div>
      </body>
    </html>
  `,
}