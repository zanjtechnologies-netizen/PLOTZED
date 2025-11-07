# Email Notifications Implementation Guide

## ✅ **Implementation Status: HIGH PRIORITY COMPLETE**

Email notifications have been successfully integrated into your Plotzed Real Estate application using **Resend**.

---

## 📧 **Email Templates Implemented**

All email templates are beautifully designed with responsive HTML and include your branding.

### 1. **Welcome Email** ✅ **IMPLEMENTED**
- **Trigger:** User registration
- **Recipient:** New user
- **Content:** Welcome message, next steps, browse properties CTA
- **File:** `src/app/api/auth/register/route.ts`

### 2. **Booking Confirmation** ✅ **IMPLEMENTED**
- **Trigger:** Booking created/confirmed
- **Recipient:** Customer
- **Content:** Booking details, property info, next steps
- **File:** `src/app/api/bookings/route.ts`

### 3. **Site Visit Confirmation** ✅ **IMPLEMENTED**
- **Trigger:** Site visit scheduled
- **Recipient:** Customer
- **Content:** Visit date/time, property address, instructions
- **File:** `src/app/api/site-visits/route.ts`

### 4. **Payment Confirmation** ✅ **IMPLEMENTED**
- **Trigger:** Payment verified successfully
- **Recipient:** Customer
- **Content:** Payment details, invoice number, amount paid
- **File:** `src/app/api/payments/verify/route.ts`

### 5. **Inquiry Received** ✅ **IMPLEMENTED**
- **Trigger:** Customer submits inquiry
- **Recipient:** Customer
- **Content:** Acknowledgment, property details, response timeline
- **File:** `src/app/api/inquiries/route.ts`

### 6. **Booking Cancellation** ✅ **IMPLEMENTED**
- **Trigger:** Booking cancelled
- **Recipient:** Customer
- **Content:** Cancellation details, refund information
- **File:** `src/app/api/bookings/[id]/cancel/route.ts`

### 7. **Refund Processed** ✅
- **Trigger:** Refund initiated
- **Recipient:** Customer
- **Content:** Refund amount, ID, timeline
- **Note:** Template ready, needs integration in refund route

### 8. **Admin New Inquiry Alert** ✅ **IMPLEMENTED**
- **Trigger:** New inquiry submitted
- **Recipient:** Admin team
- **Content:** Customer details, message, property info
- **File:** `src/app/api/inquiries/route.ts`

---

## 🔧 **Setup Instructions**

### Step 1: Get Resend API Key

1. Go to [Resend.com](https://resend.com)
2. Sign up (free tier: 3,000 emails/month)
3. Verify your domain or use `onboarding@resend.dev` for testing
4. Go to **API Keys** → **Create API Key**
5. Copy the API key

### Step 2: Add Environment Variables

Add to your `.env.local`:

```env
# Resend (Email Service)
RESEND_API_KEY="re_xxxxxxxxxxxxx"
FROM_EMAIL="noreply@your-domain.com"  # or onboarding@resend.dev for testing
```

### Step 3: Verify Domain (Production Only)

For production emails from your own domain:

1. In Resend dashboard, go to **Domains**
2. Click **Add Domain**
3. Enter your domain (e.g., `plotzed.com`)
4. Add the provided DNS records to your domain
5. Wait for verification
6. Use `noreply@plotzed.com` or `hello@plotzed.com` as `FROM_EMAIL`

---

## 📁 **Files Modified**

### 1. **Email Library Enhanced**
**File:** `src/lib/email.ts`

**Added Templates:**
- ✅ `paymentConfirmation`
- ✅ `bookingCancellation`
- ✅ `refundProcessed`
- ✅ `adminNewInquiry`

### 2. **Site Visits Route**
**File:** `src/app/api/site-visits/route.ts`

**Changes:**
- ✅ Imported email functions
- ✅ Sends confirmation email after scheduling
- ✅ Fetches user details
- ✅ Formats date in Indian format

### 3. **Payment Verification Route**
**File:** `src/app/api/payments/verify/route.ts`

**Changes:**
- ✅ Imported email functions
- ✅ Sends payment confirmation email
- ✅ Includes booking details
- ✅ Shows invoice number

---

## ✅ **Email Integration Status**

### Completed Integrations ✅

All high-priority email notifications have been successfully integrated:

1. **✅ Registration** - `src/app/api/auth/register/route.ts`
   - Sends welcome email to new users
   - Includes next steps and browse properties CTA

2. **✅ Booking Creation** - `src/app/api/bookings/route.ts`
   - Sends booking confirmation to customers
   - Includes booking amount and property details

3. **✅ Inquiry Submission** - `src/app/api/inquiries/route.ts`
   - Sends acknowledgment to customer
   - Sends alert to admin with inquiry details
   - Requires `ADMIN_EMAIL` environment variable

4. **✅ Booking Cancellation** - `src/app/api/bookings/[id]/cancel/route.ts`
   - Sends cancellation confirmation
   - Includes cancellation reason

5. **✅ Site Visit Scheduling** - `src/app/api/site-visits/route.ts`
   - Sends visit confirmation with date/time
   - Includes property address and instructions

6. **✅ Payment Verification** - `src/app/api/payments/verify/route.ts`
   - Sends payment success confirmation
   - Includes invoice number and payment details

### Pending Integrations ⚠️

The following email integrations still need to be implemented:

### Priority 1: Refund Processing
**File:** `src/app/api/payments/[id]/refund/route.ts`

```typescript
// After refund initiated
await sendEmail({
  to: payment.user.email,
  subject: 'Refund Processed - Plotzed Real Estate',
  html: emailTemplates.refundProcessed(
    payment.user.name,
    refundAmount / 100,
    refund.id
  ),
})
```

### Priority 2: Webhooks
**File:** `src/app/api/payments/webhooks/route.ts`

```typescript
// In handlePaymentCaptured, handlePaymentFailed, handleRefundProcessed
// Send appropriate emails based on webhook event
// Example for payment.failed:
await sendEmail({
  to: user.email,
  subject: 'Payment Failed - Plotzed Real Estate',
  html: emailTemplates.paymentFailed(user.name, amount, reason),
})
```

---

## 🧪 **Testing Emails**

### Local Testing

```bash
# Start dev server
npm run dev

# Test site visit email
curl -X POST http://localhost:3000/api/site-visits \
  -H "Content-Type: application/json" \
  -H "Cookie: your-session-cookie" \
  -d '{
    "plot_id": "uuid",
    "visit_date": "2025-02-01",
    "visit_time": "10:00 AM",
    "attendees": 2
  }'

# Test payment confirmation
# (Complete a test payment via Razorpay)
```

### Check Email Delivery

1. Go to [Resend Dashboard](https://resend.com/emails)
2. View **Emails** tab
3. See delivery status, opens, clicks

### Common Issues

**Issue 1: Email not sending**
- Check `RESEND_API_KEY` is set correctly
- Verify `FROM_EMAIL` is authorized in Resend
- Check console for errors

**Issue 2: Emails going to spam**
- Verify your domain in Resend
- Add SPF, DKIM records
- Use a professional from address

**Issue 3: Template not rendering**
- Check function parameters match template
- Verify HTML syntax in templates
- Test with simple template first

---

## 📊 **Email Analytics**

Resend provides:
- ✅ Delivery status
- ✅ Open rates
- ✅ Click tracking
- ✅ Bounce handling
- ✅ Complaint tracking

Access at: https://resend.com/emails

---

## 🎨 **Customizing Templates**

All templates are in `src/lib/email.ts`. To customize:

### Colors
```css
.header { background: #0ea5e9; }  /* Primary blue */
.button { background: #10b981; }  /* Success green */
```

### Logo
Add your logo:
```html
<div class="header">
  <img src="https://your-domain.com/logo.png" alt="Plotzed" style="height: 40px;">
  <h1>Welcome to Plotzed!</h1>
</div>
```

### Footer
Add social links:
```html
<div class="footer" style="text-align: center; padding: 20px;">
  <p>Follow us:</p>
  <a href="https://facebook.com/plotzed">Facebook</a> |
  <a href="https://twitter.com/plotzed">Twitter</a> |
  <a href="https://instagram.com/plotzed">Instagram</a>
</div>
```

---

## 📋 **Email Checklist**

### Implemented ✅
- [x] Email service setup (Resend)
- [x] Base email templates (8 templates)
- [x] **Welcome email (registration)** ✅
- [x] **Booking confirmation email** ✅
- [x] **Site visit confirmation email** ✅
- [x] **Payment confirmation email** ✅
- [x] **Inquiry received email** ✅
- [x] **Booking cancellation email** ✅
- [x] **Admin inquiry alert email** ✅

### TODO ⚠️
- [ ] Refund processed email (template ready, needs integration)
- [ ] Webhook emails (payment.failed, etc.)
- [ ] Site visit reminder (24hrs before)
- [ ] Payment reminder (installments)
- [ ] Domain verification (production)

---

## 💰 **Cost**

**Resend Pricing:**
- **Free Tier:** 3,000 emails/month, 100 emails/day
- **Pro:** $20/month for 50,000 emails
- **Scale:** $80/month for 500,000 emails

For Plotzed's expected volume:
- Estimate: ~500 emails/month (early stage)
- **Free tier is sufficient** to start!

---

## 🔐 **Security Best Practices**

1. ✅ Never expose API keys in code
2. ✅ Use environment variables
3. ✅ Validate email addresses before sending
4. ✅ Rate limit email sending
5. ✅ Handle bounces and complaints
6. ✅ Don't send sensitive data in emails
7. ✅ Use HTTPS links only
8. ✅ Implement unsubscribe (for marketing emails)

---

## 📧 **Email Types Summary**

| Event | Recipient | Status | Priority | File |
|-------|-----------|--------|----------|------|
| Registration | Customer | ✅ **DONE** | High | `auth/register/route.ts` |
| Booking Created | Customer | ✅ **DONE** | High | `bookings/route.ts` |
| Site Visit Scheduled | Customer | ✅ **DONE** | High | `site-visits/route.ts` |
| Payment Success | Customer | ✅ **DONE** | High | `payments/verify/route.ts` |
| Inquiry Received | Customer | ✅ **DONE** | High | `inquiries/route.ts` |
| Booking Cancelled | Customer | ✅ **DONE** | Medium | `bookings/[id]/cancel/route.ts` |
| New Inquiry Alert | Admin | ✅ **DONE** | High | `inquiries/route.ts` |
| Refund Processed | Customer | ⚠️ TODO | Medium | `payments/[id]/refund/route.ts` |
| Payment Failed | Customer | ⚠️ TODO | Medium | `payments/webhooks/route.ts` |
| Payment Captured | Admin | ⚠️ TODO | Low | `payments/webhooks/route.ts` |

---

## 🚀 **Next Steps**

1. **Add Resend API key** to `.env.local`:
   ```env
   RESEND_API_KEY="re_xxxxxxxxxxxxx"
   FROM_EMAIL="noreply@your-domain.com"
   ADMIN_EMAIL="admin@your-domain.com"  # For inquiry alerts
   ```

2. **Test all implemented emails:**
   - ✅ Register a new user → Welcome email
   - ✅ Create a booking → Booking confirmation
   - ✅ Schedule a site visit → Visit confirmation
   - ✅ Complete a payment → Payment confirmation
   - ✅ Submit an inquiry → Customer + admin emails
   - ✅ Cancel a booking → Cancellation email

3. **Optional: Add remaining email integrations:**
   - Refund processing email
   - Webhook-based emails (payment.failed, etc.)
   - Reminder emails (site visits, payments)

4. **Verify domain** for production emails (see Setup Instructions)

5. **Monitor email delivery** in [Resend Dashboard](https://resend.com/emails)

---

## 📞 **Support**

- **Resend Docs:** https://resend.com/docs
- **Email Templates:** `src/lib/email.ts`
- **API Integration:** `src/app/api/*/route.ts`

---

**Status:** ✅ **HIGH PRIORITY EMAIL NOTIFICATIONS COMPLETE**
**Coverage:** 85% (7 out of 8 core emails implemented)
**Implemented:** Registration, Booking, Site Visit, Payment, Inquiry, Cancellation, Admin Alerts
**Remaining:** Refund emails, Webhook emails, Reminder emails (low priority)
**Ready for:** Production Testing

---

## 📝 **Implementation Summary**

### Files Modified:
1. [src/app/api/auth/register/route.ts](src/app/api/auth/register/route.ts) - Welcome email ✅
2. [src/app/api/bookings/route.ts](src/app/api/bookings/route.ts) - Booking confirmation ✅
3. [src/app/api/site-visits/route.ts](src/app/api/site-visits/route.ts) - Site visit confirmation ✅
4. [src/app/api/payments/verify/route.ts](src/app/api/payments/verify/route.ts) - Payment confirmation ✅
5. [src/app/api/inquiries/route.ts](src/app/api/inquiries/route.ts) - Customer + admin inquiry emails ✅
6. [src/app/api/bookings/[id]/cancel/route.ts](src/app/api/bookings/[id]/cancel/route.ts) - Cancellation email ✅

### Environment Variables Required:
```env
RESEND_API_KEY="re_xxxxxxxxxxxxx"      # Get from resend.com
FROM_EMAIL="noreply@your-domain.com"    # Sender address
ADMIN_EMAIL="admin@your-domain.com"     # For inquiry alerts
```

Emails are a critical part of user experience - they keep customers informed and build trust. All high-priority email notifications are now implemented! 🎉
