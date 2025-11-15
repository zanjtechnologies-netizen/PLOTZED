# 🔐 Environment Variables Guide

Complete guide for configuring environment variables in Plotzed.

---

## 📋 Table of Contents

- [Quick Start](#quick-start)
- [Required Variables](#required-variables)
- [Optional Variables](#optional-variables)
- [Feature-Specific Configuration](#feature-specific-configuration)
- [Environment-Specific Settings](#environment-specific-settings)
- [Security Best Practices](#security-best-practices)
- [Validation](#validation)
- [Troubleshooting](#troubleshooting)

---

## 🚀 Quick Start

### 1. Copy Example File

```bash
cp .env.example .env.local
```

### 2. Set Required Variables

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/plotzed"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-32-char-secret-here"
```

### 3. Validate Configuration

```bash
npm run validate:env
```

### 4. Start Development

```bash
npm run dev
```

---

## ✅ Required Variables

These variables **must** be set for the application to work.

### Database

```env
DATABASE_URL="postgresql://user:password@localhost:5432/plotzed"
```

- **Description**: PostgreSQL database connection string
- **Format**: `postgresql://[user]:[password]@[host]:[port]/[database]`
- **Example**: `postgresql://postgres:mypassword@localhost:5432/plotzed`
- **Required**: ✅ Yes
- **Validation**: Must be a valid PostgreSQL URL starting with `postgresql://`

### Authentication

```env
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-32-character-secret-here-minimum"
```

**`NEXTAUTH_URL`**
- **Description**: Base URL of your application
- **Development**: `http://localhost:3000`
- **Production**: `https://your-domain.com`
- **Required**: ✅ Yes
- **Validation**: Must be a valid URL

**`NEXTAUTH_SECRET`**
- **Description**: Secret key for encrypting session tokens
- **Required**: ✅ Yes
- **Minimum length**: 32 characters
- **Generate**:
  ```bash
  openssl rand -base64 32
  ```

---

## 🔧 Optional Variables

These variables enable additional features but are not required for basic functionality.

### Redis (Caching & Rate Limiting)

```env
UPSTASH_REDIS_REST_URL="https://your-redis.upstash.io"
UPSTASH_REDIS_REST_TOKEN="your-token"
```

**`UPSTASH_REDIS_REST_URL`**
- **Description**: Upstash Redis REST API URL
- **Required**: ⚠️  Recommended for production
- **Enables**: Caching, rate limiting
- **Get free Redis**: https://upstash.com
- **Validation**: Must be HTTPS URL

**`UPSTASH_REDIS_REST_TOKEN`**
- **Description**: Upstash Redis authentication token
- **Required**: ⚠️  Required if `UPSTASH_REDIS_REST_URL` is set
- **Validation**: Must not be empty

**Impact if not set:**
- ❌ No caching (slower response times)
- ❌ No rate limiting (vulnerable to abuse)
- ✅ App still works, just slower

### Email Service (Nodemailer SMTP)

```env
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-app-password"
FROM_EMAIL="noreply@yourdomain.com"
```

**`SMTP_HOST`**
- **Description**: SMTP server hostname
- **Required**: ⚠️  Recommended for production
- **Examples**:
  - Gmail: `smtp.gmail.com`
  - Outlook: `smtp.office365.com`
  - SendGrid: `smtp.sendgrid.net`
  - Custom: `mail.yourdomain.com`

**`SMTP_PORT`**
- **Description**: SMTP server port
- **Required**: ⚠️  Required if SMTP is configured
- **Common ports**:
  - `587` - TLS (recommended)
  - `465` - SSL
  - `25` - Plain (not recommended)

**`SMTP_USER`**
- **Description**: SMTP authentication username (usually your email)
- **Required**: ⚠️  Required if SMTP is configured
- **Example**: `noreply@yourdomain.com`

**`SMTP_PASSWORD`**
- **Description**: SMTP authentication password
- **Required**: ⚠️  Required if SMTP is configured
- **Gmail users**: Use App Password, not your regular password
  - Create at: https://myaccount.google.com/apppasswords
- **Keep secret**: Never commit to version control

**`FROM_EMAIL`**
- **Description**: Email address for outgoing emails
- **Required**: ⚠️  Required if SMTP is configured
- **Format**: Must be a valid email address
- **Example**: `noreply@plotzed.com`

**Impact if not set:**
- ❌ No email notifications
- ❌ Users can't reset passwords via email
- ❌ No booking confirmation emails

**Popular SMTP Providers:**
- **Gmail**: Free (500 emails/day with limits)
- **SendGrid**: Free tier (100 emails/day)
- **Mailgun**: Free tier (5,000 emails/month)
- **Amazon SES**: Pay as you go ($0.10/1000 emails)

### Payment Gateway

```env
RAZORPAY_KEY_ID="rzp_live_your_key_id"
RAZORPAY_KEY_SECRET="your_key_secret"
```

**`RAZORPAY_KEY_ID`**
- **Description**: Razorpay API key ID
- **Required**: ⚠️  Required for production payments
- **Development default**: `dummy_key` (for testing without payments)
- **Get keys**: https://dashboard.razorpay.com/app/keys
- **Format**: Starts with `rzp_test_` (test) or `rzp_live_` (production)

**`RAZORPAY_KEY_SECRET`**
- **Description**: Razorpay API secret key
- **Required**: ⚠️  Required for production payments
- **Development default**: `dummy_secret`
- **Keep secret**: Never commit to version control

**Impact if not set:**
- ❌ Payment processing disabled
- ✅ Booking and plot browsing still work

### Cloud Storage (Backups & File Uploads)

#### Option A: AWS S3

```env
AWS_REGION="ap-south-1"
AWS_ACCESS_KEY_ID="your-access-key-id"
AWS_SECRET_ACCESS_KEY="your-secret-access-key"
AWS_S3_BUCKET="plotzed-uploads"
BACKUP_S3_BUCKET="plotzed-backups"
```

**`AWS_REGION`**
- **Description**: AWS region for S3 bucket
- **Example**: `ap-south-1` (Mumbai), `us-east-1` (Virginia)
- **Required**: ⚠️  Required if using S3

**`AWS_ACCESS_KEY_ID`**
- **Description**: AWS access key for S3
- **Minimum length**: 16 characters
- **Get credentials**: AWS IAM console

**`AWS_SECRET_ACCESS_KEY`**
- **Description**: AWS secret key for S3
- **Minimum length**: 32 characters
- **Keep secret**: Never expose publicly

**`AWS_S3_BUCKET`**
- **Description**: S3 bucket name for file uploads
- **Format**: 3-63 characters, lowercase, numbers, dots, hyphens
- **Example**: `plotzed-uploads`

**`BACKUP_S3_BUCKET`**
- **Description**: S3 bucket name for database backups
- **Example**: `plotzed-backups`
- **Required**: ⚠️  Recommended for automated backups

#### Option B: Cloudflare R2

```env
R2_ACCOUNT_ID="your-account-id"
R2_ACCESS_KEY_ID="your-access-key"
R2_SECRET_ACCESS_KEY="your-secret-key"
R2_BUCKET="plotzed-uploads"
R2_ENDPOINT="https://your-account.r2.cloudflarestorage.com"
```

**Cloudflare R2** is S3-compatible storage with no egress fees.

**Impact if not set:**
- ❌ No automated database backups
- ❌ File uploads may not work
- ✅ Core functionality still works

### Cron Job Security

```env
CRON_SECRET="your-secure-random-secret-32-chars-min"
```

**`CRON_SECRET`**
- **Description**: Secret for securing cron job API endpoints
- **Required**: ⚠️  Required for production cron jobs
- **Minimum length**: 32 characters
- **Generate**:
  ```bash
  openssl rand -base64 32
  ```
- **Usage**: Sent as `Authorization: Bearer YOUR_CRON_SECRET` header

**Impact if not set:**
- ⚠️  Cron endpoints not secured (anyone can trigger jobs)
- ✅ Manual cron job execution still works

### Encryption

```env
ENCRYPTION_KEY="your-64-character-hex-encryption-key"
```

**`ENCRYPTION_KEY`**
- **Description**: Key for encrypting sensitive data
- **Required**: ⚠️  Recommended for production
- **Format**: Exactly 64 hex characters (32 bytes)
- **Generate**:
  ```bash
  openssl rand -hex 32
  ```

**Impact if not set:**
- ⚠️  Sensitive data not encrypted at rest
- ✅ App still functions normally

### Error Tracking

```env
SENTRY_DSN="https://your-sentry-dsn@sentry.io/project-id"
NEXT_PUBLIC_SENTRY_DSN="https://your-sentry-dsn@sentry.io/project-id"
```

**`SENTRY_DSN`**
- **Description**: Sentry DSN for server-side error tracking
- **Required**: ⚠️  Recommended for production
- **Get DSN**: https://sentry.io
- **Free tier**: 5,000 errors/month

**`NEXT_PUBLIC_SENTRY_DSN`**
- **Description**: Sentry DSN for client-side error tracking
- **Can be the same**: Usually same as `SENTRY_DSN`

**Impact if not set:**
- ❌ No error tracking and monitoring
- ❌ Harder to debug production issues
- ✅ App still works

### SMS Service

```env
SMS_PROVIDER="msg91"
SMS_API_KEY="your-sms-api-key"
MSG91_AUTH_KEY="your-msg91-auth-key"
MSG91_SENDER_ID="PLOTZD"
```

**`SMS_PROVIDER`**
- **Description**: SMS service provider
- **Options**: `msg91`, `twilio`
- **Required**: ⚠️  Optional

**`SMS_API_KEY`**
- **Description**: Generic SMS API key
- **Required**: ⚠️  Required if SMS is enabled

**Impact if not set:**
- ❌ No SMS notifications
- ✅ Email notifications still work

### Google Maps

```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="your-google-maps-api-key"
```

**`NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`**
- **Description**: Google Maps JavaScript API key
- **Required**: ⚠️  Optional but recommended
- **Enables**: Interactive maps, location search, directions
- **Get API key**: https://console.cloud.google.com
- **Free tier**: $200/month credit

**Impact if not set:**
- ❌ No interactive maps
- ✅ Plot listings and static locations still work

### reCAPTCHA

```env
NEXT_PUBLIC_RECAPTCHA_SITE_KEY="your-site-key"
RECAPTCHA_SECRET_KEY="your-secret-key"
```

**`NEXT_PUBLIC_RECAPTCHA_SITE_KEY`**
- **Description**: reCAPTCHA site key (public)
- **Required**: ⚠️  Recommended for production
- **Enables**: Bot protection on forms
- **Get keys**: https://www.google.com/recaptcha/admin

**`RECAPTCHA_SECRET_KEY`**
- **Description**: reCAPTCHA secret key (private)
- **Keep secret**: Never expose publicly

**Impact if not set:**
- ⚠️  Forms vulnerable to spam/bots
- ✅ Forms still work normally

### Admin Seeding

```env
ADMIN_EMAIL="admin@plotzed.com"
ADMIN_PASSWORD="SecurePassword123!"
```

**`ADMIN_EMAIL`**
- **Description**: Email for seeded admin user
- **Default**: `admin@plotzed.com`
- **Required**: ⚠️  Optional
- **Format**: Valid email address

**`ADMIN_PASSWORD`**
- **Description**: Password for seeded admin user
- **Default**: `Admin@123456`
- **Minimum**: 8 characters
- **Requirements**: Uppercase, lowercase, number, special char

**Usage**: Only used by `npm run db:seed`

### Backup Notifications

```env
BACKUP_NOTIFICATION_EMAIL="devops@plotzed.com"
```

**`BACKUP_NOTIFICATION_EMAIL`**
- **Description**: Email to receive backup notifications
- **Required**: ⚠️  Optional
- **Format**: Valid email address

---

## 🎯 Feature-Specific Configuration

### To Enable Caching

```env
✅ Required:
UPSTASH_REDIS_REST_URL="https://your-redis.upstash.io"
UPSTASH_REDIS_REST_TOKEN="your-token"
```

**Benefits:**
- 90% faster response times
- 90% fewer database queries
- Better scalability

### To Enable Email Notifications

```env
✅ Required:
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-app-password"
FROM_EMAIL="noreply@yourdomain.com"
```

**Enables:**
- Password reset emails
- Booking confirmations
- Site visit reminders
- Payment receipts

**Gmail Setup Example:**
1. Enable 2-Factor Authentication on your Google account
2. Go to https://myaccount.google.com/apppasswords
3. Generate an App Password for "Mail"
4. Use the generated password as `SMTP_PASSWORD`

### To Enable Payments

```env
✅ Required:
RAZORPAY_KEY_ID="rzp_live_your_key_id"
RAZORPAY_KEY_SECRET="your_key_secret"
```

**Enables:**
- Online payments
- Booking confirmations
- Payment tracking

### To Enable Automated Backups

```env
✅ Required (Option A - AWS S3):
AWS_REGION="ap-south-1"
AWS_ACCESS_KEY_ID="your-access-key-id"
AWS_SECRET_ACCESS_KEY="your-secret-access-key"
BACKUP_S3_BUCKET="plotzed-backups"

OR

✅ Required (Option B - Cloudflare R2):
R2_ACCOUNT_ID="your-account-id"
R2_ACCESS_KEY_ID="your-access-key"
R2_SECRET_ACCESS_KEY="your-secret-key"
R2_BUCKET="plotzed-backups"
R2_ENDPOINT="https://your-account.r2.cloudflarestorage.com"
```

**Enables:**
- Daily database backups
- Weekly backup rotation
- Off-site backup storage

---

## 🌍 Environment-Specific Settings

### Development (.env.local)

```env
NODE_ENV="development"
DATABASE_URL="postgresql://postgres:password@localhost:5432/plotzed_dev"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="development-secret-at-least-32-chars"

# Optional - use dummy values for development
RAZORPAY_KEY_ID="dummy_key"
RAZORPAY_KEY_SECRET="dummy_secret"
```

### Production (.env.production)

```env
NODE_ENV="production"
DATABASE_URL="postgresql://user:pass@prod-db.example.com:5432/plotzed"
NEXTAUTH_URL="https://plotzed.com"
NEXTAUTH_SECRET="production-secret-very-secure-32-chars-minimum"

# ✅ Set all production services
UPSTASH_REDIS_REST_URL="https://prod-redis.upstash.io"
UPSTASH_REDIS_REST_TOKEN="prod-token"

# Email (SMTP)
SMTP_HOST="smtp.yourdomain.com"
SMTP_PORT="587"
SMTP_USER="noreply@yourdomain.com"
SMTP_PASSWORD="your-smtp-password"
FROM_EMAIL="noreply@plotzed.com"

# Payments
RAZORPAY_KEY_ID="rzp_live_your_key_id"
RAZORPAY_KEY_SECRET="your_prod_secret"

# Security
CRON_SECRET="secure-cron-secret-32-chars-minimum"
SENTRY_DSN="https://sentry-dsn@sentry.io/project"
```

---

## 🔐 Security Best Practices

### 1. Never Commit Secrets

```bash
# ✅ Good - in .gitignore
.env
.env.local
.env.production

# ❌ Bad - committed to git
.env.example  # OK - no real secrets
```

### 2. Use Different Secrets Per Environment

```env
# ❌ Bad - same secret everywhere
NEXTAUTH_SECRET="same-secret-dev-and-prod"

# ✅ Good - different secrets
# Development:
NEXTAUTH_SECRET="dev-secret-32-chars"

# Production:
NEXTAUTH_SECRET="prod-secret-completely-different-32-chars"
```

### 3. Rotate Secrets Regularly

- Change `NEXTAUTH_SECRET` every 90 days
- Rotate API keys annually
- Update `CRON_SECRET` after any security incident

### 4. Use Strong Secrets

```bash
# ✅ Good - cryptographically secure
openssl rand -base64 32
# Output: 3K7q9wL5mN2pR8tY4vX1zA0sD6fG3hJ9

# ❌ Bad - weak, guessable
NEXTAUTH_SECRET="mysecret123"
```

### 5. Restrict Access

- Use environment variables, not hardcoded values
- Limit who can access production secrets
- Use secret management tools (AWS Secrets Manager, Vault)

---

## ✅ Validation

### Validate Environment

```bash
# Check environment variables
npm run validate:env
```

### Check Features

```bash
# Start app and check health
npm run dev
curl http://localhost:3000/api/health
```

### Expected Output

```json
{
  "status": "healthy",
  "environment": "development",
  "services": {
    "database": { "status": "connected", "responseTime": 15 },
    "redis": { "status": "connected", "responseTime": 5 }
  },
  "features": {
    "caching": true,
    "rateLimiting": true,
    "email": true,
    "payments": true,
    "backups": true
  }
}
```

---

## 🐛 Troubleshooting

### Error: DATABASE_URL is required

```
❌ DATABASE_URL is required
```

**Solution:**
```bash
# Add to .env.local
echo 'DATABASE_URL="postgresql://postgres:password@localhost:5432/plotzed"' >> .env.local
```

### Error: NEXTAUTH_SECRET too short

```
❌ NEXTAUTH_SECRET must be at least 32 characters
```

**Solution:**
```bash
# Generate new secret
openssl rand -base64 32

# Add to .env.local
echo 'NEXTAUTH_SECRET="paste-generated-secret-here"' >> .env.local
```

### Warning: Redis not configured

```
⚠️  Redis not configured - Caching disabled
```

**Impact**: Slower response times but app still works.

**Solution** (optional):
1. Go to https://upstash.com
2. Create free Redis database
3. Copy URL and token to `.env.local`

### Warning: Email not configured

```
⚠️  Email service not configured
```

**Impact**: No email notifications.

**Solution** (optional):

**For Gmail (Free):**
1. Enable 2-Factor Authentication on your Google account
2. Go to https://myaccount.google.com/apppasswords
3. Generate an App Password for "Mail"
4. Add to `.env.local`:
   ```env
   SMTP_HOST="smtp.gmail.com"
   SMTP_PORT="587"
   SMTP_USER="your-email@gmail.com"
   SMTP_PASSWORD="generated-app-password"
   FROM_EMAIL="your-email@gmail.com"
   ```

**For SendGrid (Free tier: 100 emails/day):**
1. Sign up at https://sendgrid.com
2. Create an API key
3. Add to `.env.local`:
   ```env
   SMTP_HOST="smtp.sendgrid.net"
   SMTP_PORT="587"
   SMTP_USER="apikey"
   SMTP_PASSWORD="your-sendgrid-api-key"
   FROM_EMAIL="noreply@yourdomain.com"
   ```

---

## 📝 .env.example Reference

See [.env.example](.env.example) for a complete template with all available variables.

---

## 🆘 Need Help?

1. Check validation errors: `npm run validate:env`
2. Test connectivity: `curl http://localhost:3000/api/health`
3. Review logs for specific error messages
4. Ensure `.env.local` exists and has correct values

---

**Remember:** Keep your `.env` files secure and never commit them to version control!
