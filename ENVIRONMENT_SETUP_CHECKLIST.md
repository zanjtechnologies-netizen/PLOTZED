# Environment Setup Checklist

**Your `.env.local` has been updated!** Here's what you need to configure:

---

## ✅ Already Configured (Working)

### 1. Core Configuration
- ✅ **Database**: PostgreSQL connection configured
- ✅ **NextAuth**: Authentication secrets set
- ✅ **Encryption**: Encryption key configured
- ✅ **JWT Tokens**: Access and refresh token secrets set

### 2. Services Already Working
- ✅ **Redis (Upstash)**: Caching and rate limiting configured
- ✅ **Email (Gmail)**: Email service configured with app password
- ✅ **Sentry**: Error tracking configured

---

## ⚠️ Need to Configure (Required)

### 1. Payment Gateway - Razorpay
**Priority:** HIGH (Required for payments)

**Current Status:** Using dummy keys (won't work in production)

**Steps:**
1. Go to https://dashboard.razorpay.com
2. Sign up / Log in
3. Go to Settings → API Keys
4. Generate **Test Mode** keys first
5. Copy and replace in `.env.local`:
   ```bash
   NEXT_PUBLIC_RAZORPAY_KEY_ID="rzp_test_xxxxxxxxxx"
   RAZORPAY_KEY_SECRET="xxxxxxxxxxxxxxxxxx"
   ```
6. (Optional) Generate webhook secret for verification:
   - Go to Settings → Webhooks
   - Create webhook: `https://yourdomain.com/api/payments/webhooks`
   - Copy the secret
   ```bash
   RAZORPAY_WEBHOOK_SECRET="whsec_xxxxxxxxxx"
   ```

**For Production:**
- Switch to **Live Mode** keys
- Update the same variables with live keys

**Cost:** Free (0% setup fee, 2% transaction fee)

---

### 2. File Storage - Cloudflare R2
**Priority:** HIGH (Required for image/document uploads)

**Current Status:** Placeholder values

**Steps:**
1. Go to https://dash.cloudflare.com
2. Sign up / Log in
3. Go to **R2 Object Storage**
4. Create a bucket: `plotzed-storage`
5. Go to **Manage R2 API Tokens**
6. Create API token with **Object Read & Write** permissions
7. Copy credentials and update `.env.local`:
   ```bash
   R2_ENDPOINT="https://xxxxxxxxxxxxxxxx.r2.cloudflarestorage.com"
   R2_ACCESS_KEY_ID="your-access-key-id"
   R2_SECRET_ACCESS_KEY="your-secret-access-key"
   R2_BUCKET="plotzed-storage"
   R2_ACCOUNT_ID="your-cloudflare-account-id"
   ```

**Cost:** Free tier: 10 GB storage/month, 1 million Class A operations

---

### 3. WhatsApp Business API
**Priority:** HIGH (Required for customer notifications)

**Current Status:** Not configured (disabled)

**Steps:**
1. Follow the complete guide: [WHATSAPP_SETUP_GUIDE.md](WHATSAPP_SETUP_GUIDE.md)
2. Create Meta Business Manager account
3. Set up WhatsApp Business Account
4. Create 6 message templates (see guide for exact text)
5. Generate permanent access token
6. Update `.env.local`:
   ```bash
   WHATSAPP_ENABLED="true"
   WHATSAPP_PHONE_NUMBER_ID="123456789012345"
   WHATSAPP_ACCESS_TOKEN="EAAxxxxxxxxxxxxxxxx"
   WHATSAPP_BUSINESS_ACCOUNT_ID="123456789012345"  # Optional
   WHATSAPP_VERIFY_TOKEN="your-custom-token"        # Optional
   ```

**Time Required:** 2-3 hours (one-time setup)
**Cost:** Free for first 1,000 conversations/month, then ₹0.41 per conversation

---

## 🔧 Optional Services (Recommended)

### 4. Google Maps API
**Priority:** MEDIUM (Nice to have for location features)

**Steps:**
1. Go to https://console.cloud.google.com
2. Create a new project or select existing
3. Enable **Maps JavaScript API** and **Places API**
4. Go to **Credentials** → Create API Key
5. Restrict the API key:
   - Application restrictions: HTTP referrers
   - Add your domains: `localhost:3000`, `yourdomain.com`
6. Update `.env.local`:
   ```bash
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="AIzaSyxxxxxxxxxxxxxxxxxxxxxxx"
   ```

**Cost:** $200 free credit/month (covers ~28,000 map loads)

---

### 5. reCAPTCHA v3
**Priority:** MEDIUM (Recommended for spam protection)

**Steps:**
1. Go to https://www.google.com/recaptcha/admin
2. Register a new site
3. Choose **reCAPTCHA v3**
4. Add domains: `localhost`, `yourdomain.com`
5. Copy keys and update `.env.local`:
   ```bash
   NEXT_PUBLIC_RECAPTCHA_SITE_KEY="6Lexxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
   RECAPTCHA_SECRET_KEY="6Lexxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
   ```

**Cost:** Free (unlimited requests)

---

### 6. Cron Secret (Production)
**Priority:** HIGH for production (Secures backup endpoints)

**Steps:**
1. Generate a secure secret:
   ```bash
   openssl rand -base64 32
   ```
2. Update `.env.local`:
   ```bash
   CRON_SECRET="generated-secret-here"
   ```

**When to set:**
- Before deploying to production
- When setting up automated database backups

---

## 📊 Configuration Priority Summary

### For Development (Right Now):
1. ✅ **Database** - Already working
2. ✅ **Email** - Already working
3. ✅ **Redis** - Already working
4. ⚠️ **Razorpay Test Keys** - Replace dummy keys to test payments
5. ⚠️ **Cloudflare R2** - Set up if testing file uploads

### Before Production Launch:
1. ⚠️ **WhatsApp Business** - Complete setup (2-3 hours)
2. ⚠️ **Razorpay Live Keys** - Switch from test to live mode
3. ⚠️ **Cron Secret** - Generate for backup security
4. ⚠️ **API Keys** - Generate production API keys (see [API_KEY_SECURITY_GUIDE.md](API_KEY_SECURITY_GUIDE.md))
5. 🔧 **reCAPTCHA** - Add spam protection
6. 🔧 **Google Maps** - Add if using location features

### Optional (Post-Launch):
7. 🔧 **Google Analytics** - Add for traffic tracking
8. 🔧 **Tidio Chat** - Add live chat widget

---

## 🚀 Quick Start Commands

### Test your current configuration:
```bash
npm run dev
# Check http://localhost:3000/api/health
# Should show which services are enabled
```

### Verify environment variables loaded:
```bash
# In your API route or server component:
console.log('Features:', {
  email: !!process.env.EMAIL_USER,
  redis: !!process.env.UPSTASH_REDIS_REST_URL,
  payments: process.env.RAZORPAY_KEY_ID !== 'dummy_key_id',
  whatsapp: process.env.WHATSAPP_ENABLED === 'true',
  r2: !!process.env.R2_ACCESS_KEY_ID
})
```

---

## 📞 Where to Get Help

| Service | Documentation | Support |
|---------|--------------|---------|
| Razorpay | https://razorpay.com/docs | support@razorpay.com |
| Cloudflare R2 | https://developers.cloudflare.com/r2 | Community Forum |
| WhatsApp Business | [WHATSAPP_SETUP_GUIDE.md](WHATSAPP_SETUP_GUIDE.md) | Meta Business Support |
| Google Maps | https://developers.google.com/maps | Stack Overflow |
| reCAPTCHA | https://developers.google.com/recaptcha | Stack Overflow |

---

## ⚡ What Works Right Now

You can already test these features locally:
- ✅ User authentication (register, login, logout)
- ✅ Email notifications (welcome, password reset, etc.)
- ✅ Database operations (bookings, inquiries)
- ✅ Rate limiting and caching
- ✅ Error tracking (Sentry)

To enable:
- ⚠️ Payment processing → Add Razorpay test keys
- ⚠️ File uploads → Set up Cloudflare R2
- ⚠️ WhatsApp notifications → Complete WhatsApp setup

---

**Last Updated:** 2025-01-09
**Next Action:** Set up Razorpay test keys to enable payment testing
