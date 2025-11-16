# Environment Variables Summary

Quick reference for all environment variables used in the Plotzed application.

---

## File Overview

| File | Purpose | Commit to Git? |
|------|---------|----------------|
| `.env` | Local PostgreSQL development | ❌ No |
| `.env.local` | Local Neon cloud development | ❌ No |
| `.env.production` | Production template | ❌ No |
| `.env.example` | Developer template | ✅ Yes |
| `.env.sentry-build-plugin` | Sentry build token | ❌ No |

---

## Variable Categories

### 🔴 Critical (Required for Production)

| Variable | Purpose | How to Generate |
|----------|---------|-----------------|
| `DATABASE_URL` | Neon PostgreSQL pooled connection | Get from [Neon Console](https://console.neon.tech/) - use `-pooler` URL |
| `DIRECT_DATABASE_URL` | Direct DB connection for migrations | Get from Neon Console - non-pooled URL |
| `NEXTAUTH_URL` | Production domain | Set to `https://plotzed.com` |
| `NEXT_PUBLIC_APP_URL` | Public app URL | Set to `https://plotzed.com` |
| `NEXTAUTH_SECRET` | NextAuth encryption | `openssl rand -base64 32` |
| `ENCRYPTION_KEY` | Data encryption | `openssl rand -hex 32` |
| `ACCESS_TOKEN_SECRET` | JWT access tokens | `openssl rand -base64 64` |
| `REFRESH_TOKEN_SECRET` | JWT refresh tokens | `openssl rand -base64 64` |

### 📦 File Storage (Required)

| Variable | Purpose | Get From |
|----------|---------|----------|
| `R2_ENDPOINT` | Cloudflare R2 endpoint | [Cloudflare Dashboard](https://dash.cloudflare.com/) |
| `R2_ACCESS_KEY_ID` | R2 access key | Cloudflare R2 API Tokens |
| `R2_SECRET_ACCESS_KEY` | R2 secret key | Cloudflare R2 API Tokens |
| `R2_BUCKET` | R2 bucket name | Set to `plotzed` |
| `R2_ACCOUNT_ID` | Cloudflare account ID | Cloudflare Dashboard |
| `CLOUDFLARE_R2_TOKEN` | R2 API token | Cloudflare R2 API Tokens |
| `CLOUDFLARE_R2_PUBLIC_URL` | Public R2 URL | Cloudflare R2 bucket settings |

### ⚡ Caching & Rate Limiting (Required)

| Variable | Purpose | Get From |
|----------|---------|----------|
| `UPSTASH_REDIS_REST_URL` | Redis REST endpoint | [Upstash Console](https://console.upstash.com/) |
| `UPSTASH_REDIS_REST_TOKEN` | Redis access token | Upstash Console |

### 📧 Email Service (Required)

| Variable | Purpose | Get From |
|----------|---------|----------|
| `EMAIL_USER` | Gmail email address | Your Gmail account |
| `EMAIL_PASSWORD` | Gmail app password | [Google App Passwords](https://myaccount.google.com/apppasswords) |
| `EMAIL_FROM` | Email sender name | Set to `Plotzed Real Estate <email@gmail.com>` |
| `ADMIN_EMAIL` | Admin notification email | Set to admin email address |

### 🐛 Error Tracking (Required)

| Variable | Purpose | Get From |
|----------|---------|----------|
| `SENTRY_DSN` | Sentry error tracking | [Sentry Dashboard](https://sentry.io/) |
| `NEXT_PUBLIC_SENTRY_DSN` | Public Sentry DSN | Sentry Dashboard (same as above) |

### 🤖 Bot Protection (Recommended)

| Variable | Purpose | Get From |
|----------|---------|----------|
| `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` | reCAPTCHA public key | [reCAPTCHA Admin](https://www.google.com/recaptcha/admin) |
| `RECAPTCHA_SECRET_KEY` | reCAPTCHA secret key | reCAPTCHA Admin |
| `RECAPTCHA_MIN_SCORE` | Minimum trust score | Set to `0.5` (recommended) |

### 🔒 Security & API (Required)

| Variable | Purpose | How to Generate |
|----------|---------|-----------------|
| `CRON_SECRET` | Secure cron endpoints | `openssl rand -base64 32` |
| `REQUIRE_API_KEY` | Enable API auth | Set to `true` in production |
| `API_KEYS` | Comma-separated API keys | Generate multiple: `openssl rand -base64 32` |

### 💬 WhatsApp Business (Optional)

| Variable | Purpose | Get From |
|----------|---------|----------|
| `WHATSAPP_ENABLED` | Enable WhatsApp | Set to `true` when ready |
| `WHATSAPP_PHONE_NUMBER_ID` | Phone number ID | [Meta Business Manager](https://business.facebook.com/) |
| `WHATSAPP_ACCESS_TOKEN` | Permanent access token | Meta Business Manager |
| `WHATSAPP_BUSINESS_ACCOUNT_ID` | Business account ID | Meta Business Manager |
| `WHATSAPP_VERIFY_TOKEN` | Webhook verification | Generate random string |

### 🚩 Feature Flags

| Variable | Purpose | Current Value |
|----------|---------|---------------|
| `FEATURE_PAYMENTS_ENABLED` | Enable payments | `false` (disabled) |
| `FEATURE_PLOT_BOOKING_ENABLED` | Enable plot booking | `false` (disabled) |
| `FEATURE_SITE_VISITS_ENABLED` | Enable site visits | `true` (active) |

### 🌐 Optional Services

| Variable | Purpose | Get From |
|----------|---------|----------|
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Google Maps | [Google Cloud Console](https://console.cloud.google.com/) |
| `NEXT_PUBLIC_GA_ID` | Google Analytics | [Google Analytics](https://analytics.google.com/) |

---

## Security Checklist

### ✅ Development

- [x] Use `.env.local` for local development
- [x] Keep `.env.local` out of Git (in `.gitignore`)
- [x] Use placeholder values in `.env.example`
- [x] Never commit real credentials to Git

### ✅ Production

- [x] Generate **NEW** secrets for production (don't reuse dev secrets)
- [x] Set variables in Vercel Dashboard (never in code)
- [x] Use connection pooling for database (`-pooler` URL)
- [x] Enable API key authentication (`REQUIRE_API_KEY=true`)
- [x] Set secure `NEXTAUTH_URL` (https only)
- [x] Monitor Sentry for errors
- [x] Use production reCAPTCHA keys (not test keys)
- [x] Rotate secrets every 90 days

---

## Quick Commands

### Generate Secrets

```bash
# NEXTAUTH_SECRET, CRON_SECRET
openssl rand -base64 32

# ENCRYPTION_KEY
openssl rand -hex 32

# ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET
openssl rand -base64 64

# API_KEYS (generate multiple)
openssl rand -base64 32
```

### Vercel CLI

```bash
# Add environment variable
vercel env add VARIABLE_NAME production

# List variables
vercel env ls

# Pull to local
vercel env pull .env.production.local

# Deploy to production
vercel --prod
```

### Database

```bash
# Run migrations
npx prisma migrate deploy

# Generate Prisma Client
npx prisma generate

# Open Prisma Studio
npx prisma studio
```

---

## Environment-Specific Values

### Development (.env.local)

```bash
NEXTAUTH_URL="http://localhost:3000"
REQUIRE_API_KEY="false"
WHATSAPP_ENABLED="false"
```

### Production (Vercel)

```bash
NEXTAUTH_URL="https://plotzed.com"
REQUIRE_API_KEY="true"
WHATSAPP_ENABLED="true"  # if configured
```

---

## Vercel Deployment Priority

### Set These First (Critical)

1. `DATABASE_URL` (with `-pooler`)
2. `DIRECT_DATABASE_URL`
3. `NEXTAUTH_SECRET` (new secret)
4. `NEXTAUTH_URL` (production domain)
5. `ENCRYPTION_KEY` (new key)
6. `ACCESS_TOKEN_SECRET` (new secret)
7. `REFRESH_TOKEN_SECRET` (new secret)

### Set These Second (Required Services)

8. All `R2_*` variables (7 variables)
9. All `UPSTASH_*` variables (2 variables)
10. All `EMAIL_*` variables (4 variables)
11. All `SENTRY_*` variables (2 variables)

### Set These Third (Security & Features)

12. `CRON_SECRET` (new secret)
13. `API_KEYS` (new keys)
14. `REQUIRE_API_KEY="true"`
15. All `RECAPTCHA_*` variables (3 variables)
16. Feature flags (3 variables)

### Set These Last (Optional)

17. WhatsApp variables (if needed)
18. Google Maps API (if needed)
19. Google Analytics (if needed)

---

## Troubleshooting

### Database Connection Issues

**Problem:** `P1001: Can't reach database server`

**Solution:** Verify you're using the **pooled** connection URL:
- ✅ Correct: `ep-xxx-pooler.region.aws.neon.tech`
- ❌ Wrong: `ep-xxx.region.aws.neon.tech` (missing `-pooler`)

### Environment Variables Not Loading

**Problem:** Variables are undefined in production

**Solution:**
1. Verify variables are set in Vercel Dashboard
2. Check correct environment (Production/Preview/Development)
3. Redeploy after adding variables
4. For `NEXT_PUBLIC_*` variables, rebuild is required

### reCAPTCHA Fails in Production

**Problem:** "reCAPTCHA verification failed"

**Solution:**
1. Register a **NEW** reCAPTCHA site with production domain
2. Don't use test keys in production
3. Verify both site key and secret key are set
4. Check domain matches registered domain exactly

---

## Documentation Links

- **Vercel Deployment:** [VERCEL_DEPLOYMENT_GUIDE.md](./VERCEL_DEPLOYMENT_GUIDE.md)
- **reCAPTCHA Setup:** [RECAPTCHA_INTEGRATION.md](./RECAPTCHA_INTEGRATION.md)
- **reCAPTCHA Frontend:** [RECAPTCHA_FRONTEND_INTEGRATION.md](./RECAPTCHA_FRONTEND_INTEGRATION.md)
- **WhatsApp Setup:** [WHATSAPP_SETUP_GUIDE.md](./WHATSAPP_SETUP_GUIDE.md)
- **Environment Template:** [.env.example](./.env.example)
- **Production Template:** [.env.production](./.env.production)

---

## Total Variables Count

- **Critical (Required):** 8 variables
- **File Storage:** 7 variables
- **Caching:** 2 variables
- **Email:** 4 variables
- **Error Tracking:** 2 variables
- **reCAPTCHA:** 3 variables
- **Security:** 3 variables
- **WhatsApp (Optional):** 5 variables
- **Feature Flags:** 3 variables
- **Optional Services:** 2 variables

**Total:** 39 environment variables (34 required, 5 optional)

---

**Last Updated:** 2025-11-15
