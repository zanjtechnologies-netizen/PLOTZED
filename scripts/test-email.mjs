import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

console.log('\n📧 Email Configuration Test\n');
console.log('EMAIL_USER:', process.env.EMAIL_USER ? '✅ Set' : '❌ Missing');
console.log('EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD ? '✅ Set' : '❌ Missing');
console.log('EMAIL_FROM:', process.env.EMAIL_FROM || '❌ Not set');
console.log('ADMIN_EMAIL:', process.env.ADMIN_EMAIL || '❌ Not set');
console.log('');

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
  console.error('❌ Email credentials not found in environment variables');
  process.exit(1);
}

console.log('Testing SMTP connection to Gmail...\n');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
  debug: true,
});

try {
  await transporter.verify();
  console.log('\n✅ SMTP Connection Successful!');
  console.log('Email service is configured correctly.\n');
  
  // Optionally send test email
  console.log('Sending test email...');
  const info = await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: process.env.ADMIN_EMAIL,
    subject: 'Test Email from Plotzed',
    text: 'This is a test email to verify email functionality.',
    html: '<p>This is a <strong>test email</strong> to verify email functionality.</p>',
  });
  
  console.log('✅ Test email sent successfully!');
  console.log('Message ID:', info.messageId);
  
} catch (error) {
  console.error('\n❌ SMTP Connection Failed:', error.message);
  console.error('\nPossible issues:');
  console.error('1. Check if EMAIL_USER and EMAIL_PASSWORD are correct');
  console.error('2. Make sure 2FA is enabled and App Password is used');
  console.error('3. Check if "Less secure app access" is enabled (if not using App Password)');
  console.error('4. Verify firewall/network settings');
  process.exit(1);
}
