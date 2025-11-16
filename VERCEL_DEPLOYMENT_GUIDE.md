# Vercel Deployment Guide - Plotzed Real Estate

Complete guide for deploying the Plotzed application to Vercel for production.

---

## Table of Contents

1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Environment Variables Setup](#environment-variables-setup)
3. [Vercel Configuration](#vercel-configuration)
4. [Deployment Steps](#deployment-steps)
5. [Post-Deployment](#post-deployment)
6. [Troubleshooting](#troubleshooting)

---

## Pre-Deployment Checklist

### 1. Generate Production Secrets

Before deploying, generate **NEW** secrets for production (never reuse development secrets):

```bash
# NEXTAUTH_SECRET
openssl rand -base64 32

# ENCRYPTION_KEY
openssl rand -hex 32

# ACCESS_TOKEN_SECRET
openssl rand -base64 64

# REFRESH_TOKEN_SECRET
openssl rand -base64 64

# CRON_SECRET
openssl rand -base64 32

# API_KEYS (generate multiple)
openssl rand -base64 32
openssl rand -base64 32
```

**Save these securely** - you'll need them for Vercel environment variables.

### 2. Required External Services

Ensure you have credentials for:

- ✅ **Neon PostgreSQL** - Database (https://neon.tech/)
- ✅ **Cloudflare R2** - File storage (https://dash.cloudflare.com/)
- ✅ **Upstash Redis** - Caching/rate limiting (https://upstash.com/)
- ✅ **Gmail App Password** - Email notifications (https://myaccount.google.com/apppasswords)
- ✅ **Sentry** - Error tracking (https://sentry.io/)
- ✅ **Google reCAPTCHA v3** - Bot protection (https://www.google.com/recaptcha/admin)
- ⚠️ **WhatsApp Business** - Optional messaging (https://business.facebook.com/)

### 3. Database Migration

Ensure your database schema is up-to-date:

```bash
# Run migrations on production database
npx prisma migrate deploy

# Generate Prisma Client
npx prisma generate
```

---

## Environment Variables Setup

### Understanding the .env Files

| File | Purpose | Usage |
|------|---------|-------|
| `.env` | Local development (PostgreSQL) | Development only |
| `.env.local` | Local development (Neon) | Development only |
| `.env.example` | Template for developers | Reference/documentation |
| `.env.production` | Production template | **DO NOT COMMIT** |
| `.env.sentry-build-plugin` | Sentry build token | Local builds only |

**IMPORTANT:** Only `.env.example` should be committed to Git. All others should be in `.gitignore`.

### Vercel Environment Variables

You must set these variables in the Vercel dashboard:

#### 1. Database (REQUIRED)

```bash
# Use POOLED connection URL for serverless
DATABASE_URL="postgresql://neondb_owner:npg_cxSw1P3BlXep@ep-wispy-sun-a1nkq9e8-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"

# Direct connection (for migrations only)
DIRECT_DATABASE_URL="postgresql://neondb_owner:npg_cxSw1P3BlXep@ep-wispy-sun-a1nkq9e8.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
```

> **Critical:** Use the **pooled** connection URL (`-pooler` suffix) for `DATABASE_URL` to avoid connection limit issues in serverless environments.

#### 2. NextAuth (REQUIRED)

```bash
NEXTAUTH_URL="https://plotzed.com"  # Your production domain
NEXT_PUBLIC_APP_URL="https://plotzed.com"
NEXTAUTH_SECRET="<GENERATED_SECRET_FROM_STEP_1>"
```

#### 3. Encryption & JWT (REQUIRED)

```bash
ENCRYPTION_KEY="<GENERATED_KEY_FROM_STEP_1>"
ACCESS_TOKEN_SECRET="<GENERATED_SECRET_FROM_STEP_1>"
REFRESH_TOKEN_SECRET="<GENERATED_SECRET_FROM_STEP_1>"
```

#### 4. Cloudflare R2 (REQUIRED)

```bash
R2_ENDPOINT="https://b65ec9b1c1faaea81471e55d1504a815.r2.cloudflarestorage.com"
R2_ACCESS_KEY_ID="29c6a3ea52a366909d562b40d34b9cdf"
R2_SECRET_ACCESS_KEY="949af03dcd2ef91f84c3cd35837cb98b684fbfedf270f2458ada9409a152b697"
R2_BUCKET="plotzed"
R2_ACCOUNT_ID="b65ec9b1c1faaea81471e55d1504a815"
CLOUDFLARE_R2_TOKEN="l6hh8wE0tn91RVvB8aMJVuYYlOtBtq7aOkX1wwEe"
CLOUDFLARE_R2_PUBLIC_URL="https://pub-c13dac54df714071ace17115295f0523.r2.dev"
```

#### 5. Upstash Redis (REQUIRED)

```bash
UPSTASH_REDIS_REST_URL="https://emerging-viper-17771.upstash.io"
UPSTASH_REDIS_REST_TOKEN="AUVrAAIncDI0NzAyZTllNTY0ZjM0YmUyYmM2MzU4MWU5ZDA3YmJmMHAyMTc3NzE"
```

#### 6. Email Service (REQUIRED)

```bash
EMAIL_USER="plotzedrealestate@gmail.com"
EMAIL_PASSWORD="aurd uhir twky xywj"  # Gmail App Password
EMAIL_FROM="Plotzed Real Estate <plotzedrealestate@gmail.com>"
ADMIN_EMAIL="plotzedrealestate@gmail.com"
```

#### 7. Sentry Error Tracking (REQUIRED)

```bash
SENTRY_DSN="https://1e87a08bfbf991734a675e7a1453bde4@o4510328887967744.ingest.us.sentry.io/4510328960974848"
NEXT_PUBLIC_SENTRY_DSN="https://1e87a08bfbf991734a675e7a1453bde4@o4510328887967744.ingest.us.sentry.io/4510328960974848"
```

> **Note:** DO NOT add `SENTRY_AUTH_TOKEN` to Vercel - this is only used for local builds.

#### 8. Google reCAPTCHA v3 (REQUIRED)

```bash
NEXT_PUBLIC_RECAPTCHA_SITE_KEY="6LfXyg0sAAAAAFmlUWRDmnVnIJpHswKydIaaY6c9"
RECAPTCHA_SECRET_KEY="6LfXyg0sAAAAADa3rCtruqiCDk8GYaj63QkZyhAI"
RECAPTCHA_MIN_SCORE="0.5"
```

> **Important:** Register a **NEW** reCAPTCHA v3 site with your production domain at https://www.google.com/recaptcha/admin

#### 9. Security & API (REQUIRED)

```bash
CRON_SECRET="<GENERATED_SECRET_FROM_STEP_1>"
REQUIRE_API_KEY="true"
API_KEYS="<API_KEY_1>,<API_KEY_2>"
```

#### 10. WhatsApp Business (OPTIONAL)

```bash
WHATSAPP_ENABLED="false"  # Set to "true" when ready
WHATSAPP_PHONE_NUMBER_ID=""
WHATSAPP_ACCESS_TOKEN=""
WHATSAPP_BUSINESS_ACCOUNT_ID=""
WHATSAPP_VERIFY_TOKEN=""
```

#### 11. Feature Flags

```bash
FEATURE_PAYMENTS_ENABLED="false"
FEATURE_PLOT_BOOKING_ENABLED="false"
FEATURE_SITE_VISITS_ENABLED="true"
```

---

## Vercel Configuration

### 1. Install Vercel CLI (Optional)

```bash
npm i -g vercel
```

### 2. Link Project to Vercel

```bash
vercel login
vercel link
```

### 3. Configure Build Settings

In **Vercel Dashboard → Project Settings → Build & Development Settings**:

```
Framework Preset: Next.js
Build Command: npm run build
Output Directory: .next
Install Command: npm install
Development Command: npm run dev
```

### 4. Environment Variables in Vercel

**Option A: Via Vercel Dashboard**

1. Go to **Project Settings → Environment Variables**
2. Add all variables from the list above
3. Set **Environments:**
   - ✅ Production
   - ✅ Preview (optional)
   - ⚠️ Development (don't set - use local `.env.local`)

**Option B: Via Vercel CLI**

```bash
# Add a single variable
vercel env add DATABASE_URL production

# Pull environment variables to local
vercel env pull .env.production.local
```

### 5. Domain Configuration

1. Go to **Project Settings → Domains**
2. Add your custom domain: `plotzed.com`
3. Add `www.plotzed.com` (optional)
4. Configure DNS records as instructed by Vercel

**Example DNS Records:**

```
Type    Name    Value
A       @       76.76.21.21
CNAME   www     cname.vercel-dns.com
```

---

## Deployment Steps

### 1. Initial Deployment

```bash
# Deploy to production
vercel --prod

# Or commit to main branch (auto-deploys if GitHub integration is set up)
git push origin main
```

### 2. Post-Deployment Verification

After deployment, verify:

1. **Health Check:**
   ```bash
   curl https://plotzed.com/api/health
   ```

2. **Database Connection:**
   - Check Vercel logs for Prisma connection success

3. **reCAPTCHA:**
   ```bash
   curl https://plotzed.com/api/verify-recaptcha
   ```

4. **Test Site Visit Form:**
   - Visit https://plotzed.com/plots
   - Submit a site visit request
   - Verify email notification received

5. **Admin Dashboard:**
   - Login at https://plotzed.com/admin
   - Check analytics, plots, users, site visits

### 3. Monitor Deployments

Check **Vercel Dashboard → Deployments** for:
- ✅ Build logs
- ✅ Function execution
- ✅ Error tracking
- ✅ Performance metrics

---

## Post-Deployment

### 1. Set Up Monitoring

**Sentry Error Tracking:**
- Monitor at: https://sentry.io/organizations/plotzed-real-estate-developers/issues/
- Set up alerts for critical errors

**Vercel Analytics:**
- Enable in **Project Settings → Analytics**
- Monitor page views, performance, Web Vitals

**Google reCAPTCHA Dashboard:**
- Monitor at: https://www.google.com/recaptcha/admin
- Track score distribution and bot activity

### 2. Configure Cron Jobs (Optional)

If using Vercel Cron:

Create `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron/backup-database",
      "schedule": "0 2 * * *"
    }
  ]
}
```

### 3. Database Backups

Set up automated backups:

1. Use Neon's built-in backups: https://console.neon.tech/
2. Configure point-in-time recovery (PITR)
3. Set up manual backup endpoint: `/api/cron/backup-database`

### 4. SSL/TLS Certificate

Vercel automatically provisions SSL certificates. Verify:

```bash
curl -I https://plotzed.com
# Should return: HTTP/2 200
```

### 5. Security Headers

Verify security headers are set:

```bash
curl -I https://plotzed.com
```

Check for:
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Strict-Transport-Security`
- `Content-Security-Policy`

---

## Troubleshooting

### Issue: Database Connection Errors

**Symptom:** `P1001: Can't reach database server`

**Solution:**
1. Verify `DATABASE_URL` uses the **pooled** connection (`-pooler` suffix)
2. Check Neon database is active (not hibernated)
3. Verify SSL mode: `?sslmode=require`

### Issue: Build Fails with Prisma Error

**Symptom:** `@prisma/client did not initialize yet`

**Solution:**
1. Ensure `prisma generate` runs in build
2. Add to `package.json`:
   ```json
   {
     "scripts": {
       "postinstall": "prisma generate"
     }
   }
   ```

### Issue: Environment Variables Not Loading

**Symptom:** `process.env.XXX is undefined`

**Solution:**
1. Check variable is set in Vercel Dashboard
2. Verify correct environment (Production/Preview)
3. Redeploy after adding variables
4. For `NEXT_PUBLIC_*` variables, rebuild is required

### Issue: reCAPTCHA Not Working

**Symptom:** "reCAPTCHA verification failed"

**Solution:**
1. Register reCAPTCHA with production domain
2. Verify `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` is set
3. Check `RECAPTCHA_SECRET_KEY` is correct
4. Test with: `curl -X POST https://plotzed.com/api/verify-recaptcha`

### Issue: Email Notifications Not Sending

**Symptom:** Site visits not sending emails

**Solution:**
1. Verify Gmail App Password is correct (16 chars, no spaces)
2. Check `EMAIL_USER` matches the Gmail account
3. Test SMTP connection
4. Check Vercel function logs for errors

### Issue: File Upload Fails

**Symptom:** "Failed to upload file to R2"

**Solution:**
1. Verify R2 credentials are correct
2. Check bucket permissions (public read access)
3. Verify `CLOUDFLARE_R2_PUBLIC_URL` is accessible
4. Test with: Upload a plot image in admin dashboard

### Issue: 500 Internal Server Error

**Symptom:** Random 500 errors

**Solution:**
1. Check **Vercel → Functions** logs
2. Check **Sentry** for error details
3. Verify all required environment variables are set
4. Check database connection pooling

### Issue: Rate Limiting Not Working

**Symptom:** No rate limiting on API requests

**Solution:**
1. Verify `UPSTASH_REDIS_REST_URL` is correct
2. Check `UPSTASH_REDIS_REST_TOKEN` is valid
3. Test Redis connection in Vercel logs
4. Ensure Redis is on a paid plan (free tier has limits)

---

## Environment Variables Checklist

### Required Variables

- [ ] `DATABASE_URL` (pooled connection)
- [ ] `DIRECT_DATABASE_URL` (non-pooled)
- [ ] `NEXTAUTH_URL` (production domain)
- [ ] `NEXT_PUBLIC_APP_URL` (production domain)
- [ ] `NEXTAUTH_SECRET` (new secret)
- [ ] `ENCRYPTION_KEY` (new key)
- [ ] `ACCESS_TOKEN_SECRET` (new secret)
- [ ] `REFRESH_TOKEN_SECRET` (new secret)
- [ ] `R2_ENDPOINT`
- [ ] `R2_ACCESS_KEY_ID`
- [ ] `R2_SECRET_ACCESS_KEY`
- [ ] `R2_BUCKET`
- [ ] `R2_ACCOUNT_ID`
- [ ] `CLOUDFLARE_R2_TOKEN`
- [ ] `CLOUDFLARE_R2_PUBLIC_URL`
- [ ] `UPSTASH_REDIS_REST_URL`
- [ ] `UPSTASH_REDIS_REST_TOKEN`
- [ ] `EMAIL_USER`
- [ ] `EMAIL_PASSWORD`
- [ ] `EMAIL_FROM`
- [ ] `ADMIN_EMAIL`
- [ ] `SENTRY_DSN`
- [ ] `NEXT_PUBLIC_SENTRY_DSN`
- [ ] `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` (production key)
- [ ] `RECAPTCHA_SECRET_KEY` (production key)
- [ ] `RECAPTCHA_MIN_SCORE`
- [ ] `CRON_SECRET` (new secret)
- [ ] `REQUIRE_API_KEY` (set to "true")
- [ ] `API_KEYS` (new keys)

### Optional Variables

- [ ] `WHATSAPP_ENABLED`
- [ ] `WHATSAPP_PHONE_NUMBER_ID`
- [ ] `WHATSAPP_ACCESS_TOKEN`
- [ ] `WHATSAPP_BUSINESS_ACCOUNT_ID`
- [ ] `WHATSAPP_VERIFY_TOKEN`
- [ ] `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
- [ ] `NEXT_PUBLIC_GA_ID`

---

## Security Best Practices

1. **Never commit secrets to Git**
   - Use `.gitignore` for all `.env*` files except `.env.example`

2. **Rotate secrets regularly**
   - Change `NEXTAUTH_SECRET`, `ENCRYPTION_KEY`, etc. every 90 days

3. **Use different secrets for dev/prod**
   - Never reuse development secrets in production

4. **Enable API key authentication**
   - Set `REQUIRE_API_KEY="true"` in production

5. **Monitor Sentry for errors**
   - Set up alerts for critical issues

6. **Review Vercel function logs**
   - Check for suspicious activity

7. **Keep dependencies updated**
   ```bash
   npm audit
   npm update
   ```

---

## Quick Reference

### Vercel CLI Commands

```bash
# Deploy to production
vercel --prod

# Deploy to preview
vercel

# View logs
vercel logs

# List environment variables
vercel env ls

# Add environment variable
vercel env add VARIABLE_NAME production

# Remove environment variable
vercel env rm VARIABLE_NAME production

# Pull environment variables locally
vercel env pull .env.production.local
```

### Database Commands

```bash
# Run migrations
npx prisma migrate deploy

# Generate Prisma Client
npx prisma generate

# Open Prisma Studio (production)
npx prisma studio --browser none
```

### Testing Production

```bash
# Health check
curl https://plotzed.com/api/health

# reCAPTCHA check
curl https://plotzed.com/api/verify-recaptcha

# Test with local production build
npm run build
npm run start
```

---

## Support

- **Vercel Docs:** https://vercel.com/docs
- **Next.js Docs:** https://nextjs.org/docs
- **Prisma Docs:** https://www.prisma.io/docs
- **Neon Docs:** https://neon.tech/docs

---

**Deployment complete!** 🚀

Your Plotzed application is now live at **https://plotzed.com**
