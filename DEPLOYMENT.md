# 🚀 Plotzed Real Estate - Deployment Guide

## Prerequisites

Before deploying to production, ensure you have:

- [ ] **Vercel Account** (or alternative hosting platform)
- [ ] **Production PostgreSQL Database** (Neon, Supabase, or Railway)
- [ ] **Production Redis Instance** (Upstash recommended)
- [ ] **SMTP Email Service** (SendGrid, AWS SES, or similar)
- [ ] **Domain Name** configured and ready
- [ ] **Cloudflare R2 or AWS S3** for image storage (optional but recommended)

---

## Step 1: Database Setup

### 1.1 Create Production Database

**Recommended Provider: Neon PostgreSQL**

1. Go to [Neon Console](https://console.neon.tech/)
2. Create a new project
3. Copy the connection string (looks like: `postgresql://user:password@host/dbname`)

### 1.2 Run Database Migrations

```bash
# Set your production database URL
export DATABASE_URL="postgresql://user:password@host/dbname"

# Run migrations
npx prisma migrate deploy

# Generate Prisma Client
npx prisma generate
```

### 1.3 Seed Admin User

```bash
# Create an admin user
npx ts-node -e "
import { prisma } from './src/lib/db'
import bcrypt from 'bcrypt'

async function createAdmin() {
  const hashedPassword = await bcrypt.hash('CHANGE_THIS_PASSWORD', 10)
  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@plotzed.com',
      password: hashedPassword,
      role: 'ADMIN',
      email_verified: true,
    },
  })
  console.log('Admin created:', admin.email)
}

createAdmin()
"
```

---

## Step 2: Environment Variables

Create a `.env.production` file with the following variables:

```bash
# ================================================
# DATABASE
# ================================================
DATABASE_URL="postgresql://user:password@host:5432/plotzed_production"

# ================================================
# NEXTAUTH
# ================================================
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="GENERATE_WITH: openssl rand -base64 32"

# ================================================
# EMAIL SERVICE (SendGrid Example)
# ================================================
SMTP_HOST="smtp.sendgrid.net"
SMTP_PORT="587"
SMTP_USER="apikey"
SMTP_PASSWORD="your_sendgrid_api_key"
SMTP_FROM="noreply@yourdomain.com"

# ================================================
# REDIS (Upstash Production)
# ================================================
UPSTASH_REDIS_REST_URL="https://your-redis.upstash.io"
UPSTASH_REDIS_REST_TOKEN="your_production_token"

# ================================================
# CLOUDFLARE R2 (Image Storage)
# ================================================
R2_ACCOUNT_ID="your_cloudflare_account_id"
R2_ACCESS_KEY_ID="your_r2_access_key"
R2_SECRET_ACCESS_KEY="your_r2_secret"
R2_BUCKET_NAME="plotzed-images"
R2_PUBLIC_URL="https://images.yourdomain.com"

# ================================================
# ERROR TRACKING (Optional but Recommended)
# ================================================
SENTRY_DSN="https://your-sentry-dsn@sentry.io/project-id"
NEXT_PUBLIC_SENTRY_DSN="https://your-sentry-dsn@sentry.io/project-id"

# ================================================
# ANALYTICS (Optional)
# ================================================
NEXT_PUBLIC_GA_ID="G-XXXXXXXXXX"

# ================================================
# APPLICATION
# ================================================
NEXT_PUBLIC_APP_URL="https://yourdomain.com"
NODE_ENV="production"
```

---

## Step 3: Vercel Deployment

### 3.1 Connect Repository

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New Project"
3. Import your Git repository
4. Configure build settings:
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`

### 3.2 Add Environment Variables

1. Go to **Project Settings → Environment Variables**
2. Add all variables from `.env.production`
3. Set each variable for **Production**, **Preview**, and **Development** environments

### 3.3 Deploy

```bash
# Using Vercel CLI (optional)
npm install -g vercel
vercel --prod
```

Or push to your main branch - Vercel will auto-deploy.

---

## Step 4: Domain Configuration

### 4.1 Add Custom Domain

1. Go to **Project Settings → Domains**
2. Add your custom domain (e.g., `plotzed.com`)
3. Update DNS records as instructed by Vercel:
   - **A Record**: Points to Vercel's IP
   - **CNAME Record**: `www` → `cname.vercel-dns.com`

### 4.2 SSL Certificate

Vercel automatically provisions SSL certificates. Wait 5-10 minutes for DNS propagation.

---

## Step 5: Post-Deployment Checks

### 5.1 Test Critical Flows

- [ ] **Homepage loads**: https://yourdomain.com
- [ ] **User Registration**: Create a test account
- [ ] **User Login**: Login with test account
- [ ] **Site Visit Booking**: Book a test site visit
- [ ] **Admin Login**: Login as admin
- [ ] **Admin Dashboard**: View metrics
- [ ] **Admin Actions**: Confirm/cancel a site visit
- [ ] **Email Delivery**: Check inbox for confirmation emails

### 5.2 Verify SEO

- [ ] **Sitemap**: https://yourdomain.com/sitemap.xml
- [ ] **Robots.txt**: https://yourdomain.com/robots.txt
- [ ] **Open Graph Tags**: Test with [OpenGraph.xyz](https://www.opengraph.xyz/)
- [ ] **Structured Data**: Test with [Google Rich Results](https://search.google.com/test/rich-results)

### 5.3 Performance Check

Run Lighthouse audit:

```bash
# Install Lighthouse CLI
npm install -g lighthouse

# Run audit
lighthouse https://yourdomain.com --view
```

Target scores:
- **Performance**: 90+
- **Accessibility**: 95+
- **Best Practices**: 95+
- **SEO**: 100

---

## Step 6: Security Hardening

### 6.1 Enable Security Headers

Add to `next.config.js`:

```javascript
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin'
  }
]

module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ]
  },
}
```

### 6.2 Rate Limiting

Rate limiting is already implemented in the codebase using Redis. Verify it's working:

```bash
# Test rate limit (should block after 5 attempts)
for i in {1..10}; do
  curl -X POST https://yourdomain.com/api/inquiries \
    -H "Content-Type: application/json" \
    -d '{"message":"test"}'
done
```

---

## Step 7: Monitoring & Error Tracking

### 7.1 Setup Sentry (Recommended)

1. Create account at [Sentry.io](https://sentry.io/)
2. Create new Next.js project
3. Copy DSN to environment variables
4. Install Sentry SDK:

```bash
npm install @sentry/nextjs
npx @sentry/wizard -i nextjs
```

### 7.2 Setup Uptime Monitoring

Use services like:
- **Uptime Robot**: https://uptimerobot.com
- **Better Uptime**: https://betteruptime.com
- **Pingdom**: https://www.pingdom.com

Configure alerts for:
- Website downtime
- API endpoint failures
- Slow response times (> 3 seconds)

### 7.3 Database Monitoring

**For Neon PostgreSQL:**
- Enable connection pooling
- Set up query performance monitoring
- Configure automated backups (daily)

---

## Step 8: Backup Strategy

### 8.1 Database Backups

**Automated (Recommended):**

```bash
# Create backup script: scripts/backup-db.sh
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump $DATABASE_URL > backups/db_backup_$DATE.sql
gzip backups/db_backup_$DATE.sql

# Keep only last 30 days
find backups/ -name "*.sql.gz" -mtime +30 -delete
```

Run daily via cron:

```bash
0 2 * * * /path/to/scripts/backup-db.sh
```

### 8.2 Media/Image Backups

If using Cloudflare R2 or AWS S3:
- Enable versioning
- Configure lifecycle policies
- Set up cross-region replication (for critical files)

---

## Step 9: Performance Optimization

### 9.1 Enable Vercel Edge Caching

Add `Cache-Control` headers to API routes:

```typescript
// Example: src/app/api/plots/route.ts
export async function GET() {
  return NextResponse.json(data, {
    headers: {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
    },
  })
}
```

### 9.2 Image Optimization

Ensure all images use Next.js `<Image>` component:

```tsx
import Image from 'next/image'

<Image
  src="/property.jpg"
  alt="Property"
  width={800}
  height={600}
  priority
  quality={85}
/>
```

---

## Step 10: Maintenance & Updates

### 10.1 Regular Updates

```bash
# Update dependencies monthly
npm update

# Check for security vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix
```

### 10.2 Database Maintenance

```sql
-- Vacuum and analyze (run monthly)
VACUUM ANALYZE;

-- Reindex (run quarterly)
REINDEX DATABASE plotzed_production;
```

---

## Troubleshooting

### Build Fails on Vercel

**Error**: `Prisma Client is not generated`

**Fix**:
```bash
# Add postinstall script to package.json
"scripts": {
  "postinstall": "prisma generate"
}
```

### Database Connection Errors

**Error**: `Can't reach database server`

**Fix**:
- Check DATABASE_URL is correct
- Verify database allows connections from Vercel IPs
- Enable connection pooling (set `?pgbouncer=true` in connection string for Neon)

### Email Not Sending

**Fix**:
- Verify SMTP credentials
- Check sender domain is verified (for SendGrid/AWS SES)
- Review email service logs
- Test with: `curl -v smtp://smtp.sendgrid.net:587`

---

## Support

For deployment issues:
- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Prisma Docs**: https://www.prisma.io/docs

---

## Checklist Summary

- [ ] Database created and migrated
- [ ] Admin user created
- [ ] All environment variables set in Vercel
- [ ] Domain configured with SSL
- [ ] Critical user flows tested
- [ ] SEO elements verified (sitemap, robots.txt, metadata)
- [ ] Security headers enabled
- [ ] Error tracking (Sentry) configured
- [ ] Uptime monitoring set up
- [ ] Database backups automated
- [ ] Performance audit passed (Lighthouse > 90)

---

**Deployment Complete! 🎉**

Your Plotzed Real Estate application is now live in production!
