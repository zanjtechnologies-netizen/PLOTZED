// src/lib/email.ts
import nodemailer from 'nodemailer';

// Create reusable transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Verify connection on startup
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Email service error:', error);
  } else {
    console.log('✅ Email service ready');
  }
});

// Email templates
export const emailTemplates = {
  // OTP Email
  otpEmail: (otp: string, name: string) => `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
          .content { background: #f9fafb; padding: 30px; }
          .otp-code { 
            background: #fff; 
            border: 2px dashed #2563eb; 
            padding: 20px; 
            text-align: center; 
            font-size: 32px; 
            letter-spacing: 8px;
            font-weight: bold;
            color: #2563eb;
            margin: 20px 0;
          }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Plotzed Real Estate</h1>
          </div>
          <div class="content">
            <h2>Hello ${name}!</h2>
            <p>Your OTP for verification is:</p>
            <div class="otp-code">${otp}</div>
            <p>This OTP is valid for <strong>10 minutes</strong>.</p>
            <p>If you didn't request this, please ignore this email.</p>
          </div>
          <div class="footer">
            <p>© 2025 Plotzed Real Estate. All rights reserved.</p>
            <p>www.plotzedrealestate.com</p>
          </div>
        </div>
      </body>
    </html>
  `,

  // Booking Confirmation
  bookingConfirmation: (details: {
    customerName: string;
    propertyName: string;
    bookingId: string;
    amount: number;
    date: string;
  }) => `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #059669; color: white; padding: 20px; text-align: center; }
          .content { background: #f9fafb; padding: 30px; }
          .details { background: white; padding: 20px; border-left: 4px solid #059669; }
          .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
          .label { font-weight: bold; color: #666; }
          .value { color: #333; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Booking Confirmed!</h1>
          </div>
          <div class="content">
            <h2>Dear ${details.customerName},</h2>
            <p>Your property booking has been successfully confirmed.</p>
            
            <div class="details">
              <div class="detail-row">
                <span class="label">Booking ID:</span>
                <span class="value">${details.bookingId}</span>
              </div>
              <div class="detail-row">
                <span class="label">Property:</span>
                <span class="value">${details.propertyName}</span>
              </div>
              <div class="detail-row">
                <span class="label">Amount:</span>
                <span class="value">₹${details.amount.toLocaleString('en-IN')}</span>
              </div>
              <div class="detail-row">
                <span class="label">Date:</span>
                <span class="value">${details.date}</span>
              </div>
            </div>
            
            <p style="margin-top: 20px;">Our team will contact you shortly with further details.</p>
          </div>
          <div class="footer">
            <p>© 2025 Plotzed Real Estate. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `,

  // Contact Form Notification
  contactFormNotification: (details: {
    name: string;
    email: string;
    phone: string;
    message: string;
  }) => `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #dc2626; color: white; padding: 20px; }
          .content { background: #f9fafb; padding: 30px; }
          .info { background: white; padding: 15px; margin: 10px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>🔔 New Contact Form Submission</h2>
          </div>
          <div class="content">
            <div class="info">
              <strong>Name:</strong> ${details.name}
            </div>
            <div class="info">
              <strong>Email:</strong> ${details.email}
            </div>
            <div class="info">
              <strong>Phone:</strong> ${details.phone}
            </div>
            <div class="info">
              <strong>Message:</strong><br>${details.message}
            </div>
          </div>
        </div>
      </body>
    </html>
  `,

  // Site Visit Confirmation
  siteVisitConfirmation: (details: {
    customerName: string;
    propertyName: string;
    visitDate: string;
    visitTime: string;
  }) => `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #7c3aed; color: white; padding: 20px; text-align: center; }
          .content { background: #f9fafb; padding: 30px; }
          .highlight { background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📍 Site Visit Scheduled</h1>
          </div>
          <div class="content">
            <h2>Dear ${details.customerName},</h2>
            <p>Your site visit has been scheduled successfully.</p>

            <div class="highlight">
              <strong>Property:</strong> ${details.propertyName}<br>
              <strong>Date:</strong> ${details.visitDate}<br>
              <strong>Time:</strong> ${details.visitTime}
            </div>

            <p>Our representative will be waiting for you at the site.</p>
            <p>Please arrive on time. For any changes, contact us immediately.</p>
          </div>
        </div>
      </body>
    </html>
  `,

  // Welcome Email
  welcomeEmail: (name: string) => `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #0ea5e9; color: white; padding: 20px; text-align: center; }
          .content { background: #f9fafb; padding: 30px; }
          .button { background: #0ea5e9; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to Plotzed Real Estate!</h1>
          </div>
          <div class="content">
            <h2>Hi ${name},</h2>
            <p>Thank you for registering with Plotzed Real Estate!</p>
            <p>We're excited to help you find your dream property.</p>
            <p>Start browsing our premium plots and properties today.</p>
            <a href="http://localhost:3000/plots" class="button">Browse Properties</a>
            <p>If you have any questions, feel free to contact us.</p>
            <p>Best regards,<br>Plotzed Team</p>
          </div>
        </div>
      </body>
    </html>
  `,

  // Payment Confirmation
  paymentConfirmation: (name: string, plotTitle: string, amount: number, paymentId: string, invoiceNumber: string) => `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #10b981; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9fafb; }
          .details { background: white; padding: 15px; margin: 20px 0; border-radius: 6px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Payment Successful ✓</h1>
          </div>
          <div class="content">
            <p>Hi ${name},</p>
            <p>Your payment has been processed successfully!</p>
            <div class="details">
              <h3>Payment Details:</h3>
              <p><strong>Property:</strong> ${plotTitle}</p>
              <p><strong>Amount Paid:</strong> ₹${amount.toLocaleString('en-IN')}</p>
              <p><strong>Payment ID:</strong> ${paymentId}</p>
              <p><strong>Invoice Number:</strong> ${invoiceNumber}</p>
            </div>
            <p>Best regards,<br>Plotzed Team</p>
          </div>
        </div>
      </body>
    </html>
  `,

  // Inquiry Received
  inquiryReceived: (name: string, plotTitle: string) => `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #0ea5e9; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9fafb; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Inquiry Received</h1>
          </div>
          <div class="content">
            <p>Hi ${name},</p>
            <p>Thank you for your inquiry about <strong>${plotTitle}</strong>.</p>
            <p>Our team will contact you within 24 hours.</p>
            <p>Best regards,<br>Plotzed Team</p>
          </div>
        </div>
      </body>
    </html>
  `,

  // Admin New Inquiry Alert
  adminNewInquiry: (userName: string, userEmail: string, userPhone: string, plotTitle: string, message: string) => `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #f59e0b; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9fafb; }
          .details { background: white; padding: 15px; margin: 20px 0; border-radius: 6px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New Inquiry Received!</h1>
          </div>
          <div class="content">
            <div class="details">
              <h3>Customer Details:</h3>
              <p><strong>Name:</strong> ${userName}</p>
              <p><strong>Email:</strong> ${userEmail}</p>
              <p><strong>Phone:</strong> ${userPhone}</p>
              <p><strong>Property:</strong> ${plotTitle}</p>
              <p><strong>Message:</strong></p>
              <p>${message}</p>
            </div>
            <p>Please follow up as soon as possible.</p>
          </div>
        </div>
      </body>
    </html>
  `,

  // Booking Cancellation
  bookingCancellation: (name: string, plotTitle: string, reason: string) => `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #ef4444; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9fafb; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Booking Cancelled</h1>
          </div>
          <div class="content">
            <p>Hi ${name},</p>
            <p>Your booking for <strong>${plotTitle}</strong> has been cancelled.</p>
            <p><strong>Reason:</strong> ${reason || 'Not specified'}</p>
            <p>Refund will be processed within 5-7 business days.</p>
            <p>Best regards,<br>Plotzed Team</p>
          </div>
        </div>
      </body>
    </html>
  `,

  // Email Verification
  emailVerification: (name: string, verificationUrl: string) => `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
          .content { background: #f9fafb; padding: 30px; }
          .button {
            background: #2563eb;
            color: white;
            padding: 14px 28px;
            text-decoration: none;
            border-radius: 6px;
            display: inline-block;
            margin: 20px 0;
            font-weight: bold;
          }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Verify Your Email</h1>
          </div>
          <div class="content">
            <h2>Hello ${name}!</h2>
            <p>Thank you for registering with Plotzed Real Estate!</p>
            <p>Please verify your email address by clicking the button below:</p>
            <a href="${verificationUrl}" class="button">Verify Email Address</a>
            <p>This link will expire in <strong>24 hours</strong>.</p>
            <p>If you didn't create an account, please ignore this email.</p>
          </div>
          <div class="footer">
            <p>© 2025 Plotzed Real Estate. All rights reserved.</p>
            <p>www.plotzedrealestate.com</p>
          </div>
        </div>
      </body>
    </html>
  `,

  // Password Reset
  passwordReset: (name: string, resetUrl: string) => `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #dc2626; color: white; padding: 20px; text-align: center; }
          .content { background: #f9fafb; padding: 30px; }
          .button {
            background: #dc2626;
            color: white;
            padding: 14px 28px;
            text-decoration: none;
            border-radius: 6px;
            display: inline-block;
            margin: 20px 0;
            font-weight: bold;
          }
          .warning {
            background: #fef3c7;
            border-left: 4px solid #f59e0b;
            padding: 15px;
            margin: 20px 0;
          }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Reset Your Password</h1>
          </div>
          <div class="content">
            <h2>Hello ${name}!</h2>
            <p>We received a request to reset your password for your Plotzed account.</p>
            <p>Click the button below to reset your password:</p>
            <a href="${resetUrl}" class="button">Reset Password</a>
            <p>This link will expire in <strong>1 hour</strong>.</p>
            <div class="warning">
              <strong>⚠️ Security Notice:</strong><br>
              If you didn't request a password reset, please ignore this email and your password will remain unchanged.
            </div>
          </div>
          <div class="footer">
            <p>© 2025 Plotzed Real Estate. All rights reserved.</p>
            <p>www.plotzedrealestate.com</p>
          </div>
        </div>
      </body>
    </html>
  `,

  // Password Reset Success
  passwordResetSuccess: (name: string) => `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #10b981; color: white; padding: 20px; text-align: center; }
          .content { background: #f9fafb; padding: 30px; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✓ Password Reset Successful</h1>
          </div>
          <div class="content">
            <h2>Hello ${name}!</h2>
            <p>Your password has been successfully reset.</p>
            <p>You can now log in with your new password.</p>
            <p>If you didn't make this change, please contact us immediately.</p>
            <p>Best regards,<br>Plotzed Team</p>
          </div>
          <div class="footer">
            <p>© 2025 Plotzed Real Estate. All rights reserved.</p>
            <p>www.plotzedrealestate.com</p>
          </div>
        </div>
      </body>
    </html>
  `,
};

// Send Email Function
export async function sendEmail({
  to,
  subject,
  html,
  cc,
  bcc,
}: {
  to: string | string[];
  subject: string;
  html: string;
  cc?: string | string[];
  bcc?: string | string[];
}) {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to,
      subject,
      html,
      cc,
      bcc,
    });

    console.log('✅ Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Email send failed:', error);
    return { success: false, error };
  }
}

// Utility Functions
export const emailService = {
  // Send OTP
  sendOTP: async (to: string, otp: string, name: string) => {
    return sendEmail({
      to,
      subject: 'Your OTP - Plotzed Real Estate',
      html: emailTemplates.otpEmail(otp, name),
    });
  },

  // Send Booking Confirmation
  sendBookingConfirmation: async (
    to: string,
    details: {
      customerName: string;
      propertyName: string;
      bookingId: string;
      amount: number;
      date: string;
    }
  ) => {
    return sendEmail({
      to,
      subject: 'Booking Confirmation - Plotzed Real Estate',
      html: emailTemplates.bookingConfirmation(details),
    });
  },

  // Send Contact Form to Admin
  sendContactFormToAdmin: async (
    details: {
      name: string;
      email: string;
      phone: string;
      message: string;
    }
  ) => {
    return sendEmail({
      to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER!,
      subject: `New Contact Form: ${details.name}`,
      html: emailTemplates.contactFormNotification(details),
    });
  },

  // Send Site Visit Confirmation
  sendSiteVisitConfirmation: async (
    to: string,
    details: {
      customerName: string;
      propertyName: string;
      visitDate: string;
      visitTime: string;
    }
  ) => {
    return sendEmail({
      to,
      subject: 'Site Visit Confirmation - Plotzed Real Estate',
      html: emailTemplates.siteVisitConfirmation(details),
    });
  },
};

// Payment Email Functions (for webhook integration)
export async function sendPaymentConfirmationEmail(
  to: string,
  name: string,
  amount: number,
  invoiceNumber: string,
  plotTitle: string
) {
  return sendEmail({
    to,
    subject: 'Payment Confirmation - Plotzed Real Estate',
    html: emailTemplates.paymentConfirmation(name, plotTitle, amount, '', invoiceNumber),
  });
}

export async function sendPaymentFailedEmail(
  to: string,
  name: string,
  amount: number,
  plotTitle: string,
  errorDescription?: string
) {
  const failedTemplate = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #ef4444; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9fafb; }
          .details { background: white; padding: 15px; margin: 20px 0; border-radius: 6px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Payment Failed ✗</h1>
          </div>
          <div class="content">
            <p>Hi ${name},</p>
            <p>Unfortunately, your payment could not be processed.</p>
            <div class="details">
              <h3>Payment Details:</h3>
              <p><strong>Property:</strong> ${plotTitle}</p>
              <p><strong>Amount:</strong> ₹${amount.toLocaleString('en-IN')}</p>
              ${errorDescription ? `<p><strong>Reason:</strong> ${errorDescription}</p>` : ''}
            </div>
            <p>Please try again or contact our support team for assistance.</p>
            <p>Best regards,<br>Plotzed Team</p>
          </div>
        </div>
      </body>
    </html>
  `;

  return sendEmail({
    to,
    subject: 'Payment Failed - Plotzed Real Estate',
    html: failedTemplate,
  });
}

export async function sendRefundConfirmationEmail(
  to: string,
  name: string,
  amount: number,
  plotTitle: string,
  invoiceNumber: string
) {
  const refundTemplate = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #f59e0b; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9fafb; }
          .details { background: white; padding: 15px; margin: 20px 0; border-radius: 6px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Refund Processed</h1>
          </div>
          <div class="content">
            <p>Hi ${name},</p>
            <p>Your refund has been processed successfully.</p>
            <div class="details">
              <h3>Refund Details:</h3>
              <p><strong>Property:</strong> ${plotTitle}</p>
              <p><strong>Refund Amount:</strong> ₹${amount.toLocaleString('en-IN')}</p>
              <p><strong>Original Invoice:</strong> ${invoiceNumber}</p>
            </div>
            <p>The refund will be credited to your original payment method within 5-7 business days.</p>
            <p>Best regards,<br>Plotzed Team</p>
          </div>
        </div>
      </body>
    </html>
  `;

  return sendEmail({
    to,
    subject: 'Refund Confirmation - Plotzed Real Estate',
    html: refundTemplate,
  });
}