# WhatsApp Business API Setup Guide

Complete guide to setting up Meta WhatsApp Business Cloud API for Plotzed Real Estate application.

---

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Step 1: Meta Business Account Setup](#step-1-meta-business-account-setup)
4. [Step 2: WhatsApp Business Account](#step-2-whatsapp-business-account)
5. [Step 3: Phone Number Configuration](#step-3-phone-number-configuration)
6. [Step 4: Create Message Templates](#step-4-create-message-templates)
7. [Step 5: Get API Credentials](#step-5-get-api-credentials)
8. [Step 6: Configure Environment Variables](#step-6-configure-environment-variables)
9. [Step 7: Testing](#step-7-testing)
10. [Troubleshooting](#troubleshooting)
11. [Template Reference](#template-reference)
12. [Best Practices](#best-practices)

---

## Overview

Meta WhatsApp Business Cloud API allows you to send template messages to customers for:
- OTP verification (authentication)
- Booking confirmations (transactional)
- Payment confirmations (transactional)
- Site visit confirmations (transactional)
- Payment failure notifications (transactional)
- Inquiry confirmations (transactional)

**Benefits:**
- ✅ Free for first 1,000 conversations/month
- ✅ ₹0.41/conversation in India (after free tier)
- ✅ Higher delivery rates than SMS (~98%)
- ✅ Better engagement from customers
- ✅ Read receipts and delivery status

---

## Prerequisites

- Meta/Facebook Business Account (free)
- Verified Meta Business Manager account
- Business phone number (can be a new number, not your personal)
- Business domain (for verification)
- Payment method (credit card - only charged after free tier)

---

## Step 1: Meta Business Account Setup

### 1.1 Create Meta Business Account

1. Go to [Meta Business Suite](https://business.facebook.com/)
2. Click **"Create Account"**
3. Enter your business details:
   - Business Name: `Plotzed Real Estate`
   - Your Name
   - Business Email
4. Click **"Next"** and complete verification

### 1.2 Verify Your Business

**Required for Production:**

1. In Meta Business Settings, go to **"Security Center"**
2. Click **"Start Verification"**
3. Upload business documents:
   - Business registration certificate
   - Tax registration (GST certificate)
   - Utility bill with business address
4. Wait 1-3 business days for approval

**Note:** You can test with a test number before verification is complete.

---

## Step 2: WhatsApp Business Account

### 2.1 Create WhatsApp Business Account

1. Open [Meta Business Suite](https://business.facebook.com/)
2. Go to **"Business Settings"** → **"Accounts"** → **"WhatsApp Accounts"**
3. Click **"Add"** → **"Create a WhatsApp Business Account"**
4. Enter details:
   - Display Name: `Plotzed Real Estate`
   - Category: `Real Estate`
   - Description: `Premium plot booking platform`
5. Click **"Next"**

### 2.2 Create WhatsApp Business App

1. In Business Settings, go to **"Apps"**
2. Click **"Add Apps"** → **"Create an App"**
3. Select **"Business"** type
4. Enter App Details:
   - App Name: `Plotzed Notifications`
   - Contact Email: `your-email@plotzed.com`
5. Click **"Create App"**

### 2.3 Add WhatsApp Product

1. In your app dashboard, find **"WhatsApp"** product
2. Click **"Set Up"**
3. Link to your WhatsApp Business Account created in step 2.1

---

## Step 3: Phone Number Configuration

### 3.1 Add Phone Number

You have two options:

**Option A: Use Meta's Test Number (Testing Only)**
- Immediately available
- Can send to 5 pre-registered numbers
- Free
- Good for development

**Option B: Add Your Own Number (Production)**

1. In WhatsApp setup, click **"Add Phone Number"**
2. Enter your business phone number
3. Verify via SMS or voice call
4. Complete 2-step verification setup

**Important:** Don't use your personal WhatsApp number!

### 3.2 Get Phone Number ID

1. Go to **"WhatsApp"** → **"API Setup"**
2. Find **"Phone Number ID"** (looks like `123456789012345`)
3. Copy this - you'll need it for `WHATSAPP_PHONE_NUMBER_ID`

### 3.3 Display Name

1. Click on your phone number
2. Set **"Display name"**: `Plotzed Real Estate`
3. This appears as the sender name to customers

---

## Step 4: Create Message Templates

### 4.1 Navigate to Templates

1. In WhatsApp setup, go to **"Message Templates"**
2. Click **"Create Template"**

### 4.2 Create Templates (Required)

Create each of these templates exactly as specified:

#### Template 1: OTP Verification

- **Name:** `otp_verification`
- **Category:** `AUTHENTICATION`
- **Languages:** `English`
- **Header:** None
- **Body:**
  ```
  Your Plotzed verification code is {{1}}. Valid for 10 minutes. Do not share this with anyone.
  ```
- **Footer:** None
- **Buttons:** None
- **Variable Example:** `123456`
- Click **"Submit"** and wait for approval (usually 15-30 minutes)

#### Template 2: Booking Confirmation

- **Name:** `booking_confirmation`
- **Category:** `TRANSACTIONAL`
- **Languages:** `English`
- **Header:** None
- **Body:**
  ```
  Hi {{1}}, your booking for {{2}} (ID: {{3}}) is confirmed! Our team will contact you shortly.
  ```
- **Footer:** `Plotzed Real Estate - Premium Properties`
- **Buttons:** None
- **Variable Examples:**
  - `{{1}}`: `Rajesh Kumar`
  - `{{2}}`: `Sunrise Villa Plot 12`
  - `{{3}}`: `BK-001-2025`

#### Template 3: Site Visit Confirmation

- **Name:** `site_visit_confirmation`
- **Category:** `TRANSACTIONAL`
- **Languages:** `English`
- **Header:** None
- **Body:**
  ```
  Hi {{1}}, your site visit for {{2}} is scheduled on {{3}} at {{4}}. See you there!
  ```
- **Footer:** `Plotzed Real Estate`
- **Buttons:** None
- **Variable Examples:**
  - `{{1}}`: `Rajesh Kumar`
  - `{{2}}`: `Sunrise Villa Plot 12`
  - `{{3}}`: `15 Jan 2025`
  - `{{4}}`: `2:00 PM`

#### Template 4: Payment Confirmation

- **Name:** `payment_confirmation`
- **Category:** `TRANSACTIONAL`
- **Languages:** `English`
- **Header:** None
- **Body:**
  ```
  Hi {{1}}, payment of ₹{{2}} received for {{4}}. Invoice: {{3}}. Thank you!
  ```
- **Footer:** `Plotzed Real Estate`
- **Buttons:** None
- **Variable Examples:**
  - `{{1}}`: `Rajesh Kumar`
  - `{{2}}`: `50,000`
  - `{{3}}`: `INV-2025-001`
  - `{{4}}`: `Sunrise Villa Plot 12`

#### Template 5: Payment Failed

- **Name:** `payment_failed`
- **Category:** `TRANSACTIONAL`
- **Languages:** `English`
- **Header:** None
- **Body:**
  ```
  Hi {{1}}, payment of ₹{{2}} for {{3}} failed. Please try again or contact our support team.
  ```
- **Footer:** `Plotzed Real Estate`
- **Buttons:** None
- **Variable Examples:**
  - `{{1}}`: `Rajesh Kumar`
  - `{{2}}`: `50,000`
  - `{{3}}`: `Sunrise Villa Plot 12`

#### Template 6: Inquiry Received

- **Name:** `inquiry_received`
- **Category:** `TRANSACTIONAL`
- **Languages:** `English`
- **Header:** None
- **Body:**
  ```
  Hi {{1}}, we received your inquiry. Our team will contact you within 24 hours. Thank you for your interest!
  ```
- **Footer:** `Plotzed Real Estate`
- **Buttons:** None
- **Variable Examples:**
  - `{{1}}`: `Rajesh Kumar`

### 4.3 Template Approval Process

- **Typical time:** 15-30 minutes
- **Status check:** Templates section shows "Approved" or "Rejected"
- **If rejected:** Review rejection reason and resubmit with corrections

**Common Rejection Reasons:**
- Too promotional language
- Missing variable examples
- Incorrect category selection
- Spelling/grammar errors

---

## Step 5: Get API Credentials

### 5.1 Get Temporary Access Token (Testing)

1. Go to **"WhatsApp"** → **"API Setup"**
2. Find **"Temporary access token"**
3. Click **"Generate Token"**
4. Copy token (valid for 24 hours - good for testing)

### 5.2 Create Permanent Access Token (Production)

**Required for Production:**

1. In Business Settings, go to **"Users"** → **"System Users"**
2. Click **"Add"** → Create system user:
   - Name: `Plotzed WhatsApp API`
   - Role: `Admin`
3. Click on the system user → **"Generate New Token"**
4. Select your WhatsApp app
5. Select permissions:
   - `whatsapp_business_management`
   - `whatsapp_business_messaging`
6. Set token expiration: **"Never"** (permanent)
7. Click **"Generate Token"**
8. **IMPORTANT:** Copy and save the token immediately (can't view again)

### 5.3 Get Business Account ID (Optional)

1. Go to **"WhatsApp"** → **"API Setup"**
2. Find **"WhatsApp Business Account ID"** (looks like `123456789012345`)
3. Copy for `WHATSAPP_BUSINESS_ACCOUNT_ID` (optional)

---

## Step 6: Configure Environment Variables

### 6.1 Update .env.local

Add these variables to your `.env.local` file:

```bash
# WhatsApp Business API
WHATSAPP_ENABLED="true"
WHATSAPP_PHONE_NUMBER_ID="your-phone-number-id-here"
WHATSAPP_ACCESS_TOKEN="your-permanent-access-token-here"
WHATSAPP_BUSINESS_ACCOUNT_ID="your-business-account-id"  # Optional
WHATSAPP_VERIFY_TOKEN="your-custom-verify-token"  # Optional for webhooks
```

### 6.2 Production Deployment (Vercel Example)

1. Go to Vercel Project → **"Settings"** → **"Environment Variables"**
2. Add variables:
   - `WHATSAPP_ENABLED` = `true`
   - `WHATSAPP_PHONE_NUMBER_ID` = `123456789012345`
   - `WHATSAPP_ACCESS_TOKEN` = `EAAxxxxxxxxxxxxx` (long token)
   - `WHATSAPP_BUSINESS_ACCOUNT_ID` = `123456789012345`
3. Click **"Save"**
4. Redeploy your application

---

## Step 7: Testing

### 7.1 Test with Meta's Test Number

1. Add test recipients:
   - Go to **"API Setup"** → **"Send and receive messages"**
   - Click **"Add phone number"**
   - Add your personal WhatsApp number
   - Verify via code sent to WhatsApp
2. Can add up to 5 test numbers

### 7.2 Test Your Implementation

**Method 1: Direct API Test**

```javascript
// Test in browser console or Node.js
const phone = '919876543210' // Your test number with country code
const response = await fetch('http://localhost:3000/api/bookings', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Cookie': 'your-session-cookie'
  },
  body: JSON.stringify({
    plot_id: 'your-plot-uuid'
  })
})
```

**Method 2: Using cURL**

```bash
curl -X POST http://localhost:3000/api/inquiries \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "9876543210",
    "message": "Testing WhatsApp integration"
  }'
```

### 7.3 Check Logs

Monitor your application logs for:

```
WhatsApp message sent successfully {
  to: '919876543210',
  templateName: 'inquiry_received',
  messageId: 'wamid.xxx'
}
```

### 7.4 Verify Message Received

- Check your WhatsApp on the test phone number
- Message should appear from "Plotzed Real Estate"
- Verify template variables are populated correctly

---

## Troubleshooting

### Issue 1: "Template not found" Error

**Cause:** Template not approved or wrong name

**Solution:**
1. Go to Message Templates in Meta Business Manager
2. Verify template status is "Approved"
3. Check template name matches exactly (case-sensitive)

### Issue 2: "Invalid phone number" Error

**Cause:** Phone number format incorrect

**Solution:**
- Phone must be in international format: `919876543210` (no + or spaces)
- Use Indian country code: `91` + 10-digit number
- Example correct: `919876543210`
- Example wrong: `+91 98765 43210`

### Issue 3: "Access token expired" Error

**Cause:** Using temporary token (expires after 24 hours)

**Solution:**
- Create permanent system user token (Step 5.2)
- Update `WHATSAPP_ACCESS_TOKEN` in environment variables
- Redeploy application

### Issue 4: Messages not sending

**Check:**
1. `WHATSAPP_ENABLED` is set to `"true"`
2. All environment variables are set correctly
3. Application restarted after env changes
4. Phone number is added to test recipients (if using test number)
5. Template is approved
6. Check application logs for error details

### Issue 5: "Rate limit exceeded"

**Cause:** Too many messages in short time

**Limits:**
- 1,000 messages/day (tier 1)
- 10,000 messages/day (tier 2 - after business verification)
- 100,000+ messages/day (tier 3 - request upgrade)

**Solution:**
- Reduce message frequency
- Request tier upgrade in Meta Business Settings
- Implement message queuing

---

## Template Reference

| Template Name | Category | Variables | Use Case |
|--------------|----------|-----------|----------|
| `otp_verification` | AUTHENTICATION | 1: OTP code | Email verification, login OTP |
| `booking_confirmation` | TRANSACTIONAL | 1: Name, 2: Property, 3: Booking ID | After booking created |
| `site_visit_confirmation` | TRANSACTIONAL | 1: Name, 2: Property, 3: Date, 4: Time | Site visit scheduled |
| `payment_confirmation` | TRANSACTIONAL | 1: Name, 2: Amount, 3: Invoice, 4: Property | Payment successful |
| `payment_failed` | TRANSACTIONAL | 1: Name, 2: Amount, 3: Property | Payment failed |
| `inquiry_received` | TRANSACTIONAL | 1: Name | Inquiry submitted |

---

## Best Practices

### 1. Message Frequency

**Do:**
- Send only important transactional messages
- Respect user preferences
- Don't send marketing messages without consent

**Don't:**
- Send promotional content via templates
- Spam users with frequent messages
- Send messages late at night (9 PM - 9 AM)

### 2. Template Design

**Do:**
- Keep messages concise (< 160 characters ideal)
- Use clear, professional language
- Include relevant information only
- Test with real data before approval

**Don't:**
- Use promotional language
- Include URLs (use buttons instead)
- Use excessive emojis or caps
- Promise unrealistic things

### 3. Error Handling

Our implementation already handles errors gracefully:

```typescript
try {
  await sendWhatsAppMessage(...)
} catch (error) {
  structuredLogger.error('WhatsApp failed', error)
  // Don't fail the main operation
}
```

This ensures:
- Booking/payment/inquiry still succeeds even if WhatsApp fails
- Errors are logged for debugging
- Users aren't blocked by notification failures

### 4. Monitoring

**Track:**
- Message delivery rates
- Template rejection rates
- API error rates
- Cost per conversation

**Tools:**
- Meta Business Manager analytics
- Sentry for error tracking
- Custom logging in your application

### 5. Compliance

**Requirements:**
- Only send to opted-in users
- Provide opt-out mechanism
- Don't send marketing content via templates
- Respect 24-hour messaging window
- Follow WhatsApp Business Policy

---

## Cost Estimation

### Pricing (India)

- **Free tier:** 1,000 conversations/month
- **After free tier:** ₹0.41/conversation
- **Conversation:** 24-hour window with user

### Example Monthly Costs

| Users | Messages/User | Total Messages | Conversations | Cost |
|-------|---------------|----------------|---------------|------|
| 100 | 3 | 300 | 300 | Free |
| 500 | 3 | 1,500 | 1,500 | ₹205 |
| 1,000 | 3 | 3,000 | 3,000 | ₹820 |
| 5,000 | 3 | 15,000 | 15,000 | ₹5,740 |

**Note:** Multiple messages within 24 hours = 1 conversation

---

## Next Steps

1. ✅ Complete Meta Business verification
2. ✅ Add your business phone number
3. ✅ Create and approve all 6 templates
4. ✅ Generate permanent access token
5. ✅ Configure environment variables
6. ✅ Test with your personal number
7. ✅ Monitor first few real transactions
8. ✅ Set up usage alerts in Meta Business Manager

---

## Support & Resources

### Official Documentation
- [WhatsApp Cloud API Docs](https://developers.facebook.com/docs/whatsapp/cloud-api)
- [Message Templates Guide](https://developers.facebook.com/docs/whatsapp/message-templates)
- [API Reference](https://developers.facebook.com/docs/whatsapp/cloud-api/reference)

### Meta Support
- [WhatsApp Business Help Center](https://www.facebook.com/business/help/whatsapp)
- [Developer Community](https://developers.facebook.com/community/)

### Internal Resources
- Code: `src/lib/whatsapp.ts`
- Environment: `ENVIRONMENT_VARIABLES.md`
- Integration Progress: `INTEGRATION_PROGRESS.md`

---

**Last Updated:** 2025-01-09
**Version:** 1.0
**Maintained by:** Development Team
