# 🚀 Plotzed Real Estate - Implementation Roadmap

## 📊 Current Status Overview

### ✅ **COMPLETED PHASES (1-3)**

#### **Phase 1: Authentication System** ✅
- User registration with email verification
- Login with NextAuth credentials provider
- Password hashing with bcrypt
- Session management with JWT
- Auto-login after registration
- Redirect to homepage (not dashboard) after login/signup

#### **Phase 2: User Dashboard** ✅
- Dashboard displays upcoming and past site visits
- Color-coded status badges (PENDING, CONFIRMED, COMPLETED, CANCELLED)
- Stats cards showing visit counts
- Browse Properties CTA for empty states
- Fixed database queries to use correct schema fields

#### **Phase 3: Header & Navigation** ✅
- Dynamic header based on authentication status
- Guest users: "Log In" and "Sign Up" buttons
- Authenticated users: "Dashboard" and "Logout" buttons
- Mobile-responsive menu with auth buttons
- SessionProvider wrapper for NextAuth hooks

---

## 🔧 **PHASE 4: Admin Dashboard - PENDING TASKS**

### Current Status
- ✅ Admin UI pages exist (dashboard, site-visits, users, inquiries, properties, analytics)
- ✅ Dashboard API endpoint exists (`/api/admin/dashboard`)
- ⚠️ Admin pages use static/mock data
- ❌ Admin action buttons not functional

### Required Implementation

#### 1. **Create Admin Site Visits API Routes**

**File: `src/app/api/admin/site-visits/route.ts`**
```typescript
// GET - Fetch all site visits with filters (status, date range)
// Features:
// - Admin authentication check
// - Filter by status: PENDING, CONFIRMED, COMPLETED, CANCELLED
// - Sort by visit_date (ascending/descending)
// - Include user and plot details
// - Pagination support
```

**File: `src/app/api/admin/site-visits/[id]/route.ts`**
```typescript
// GET - Get single site visit with full details
// PUT - Update site visit (status, admin_notes, reschedule)
// DELETE - Cancel/delete site visit
// Features:
// - Admin authentication check
// - Send email notifications on status changes
// - Update confirmed_at, completed_at, cancelled_at timestamps
```

#### 2. **Make Admin Site Visits Page Dynamic**

**File: `src/app/admin/site-visits/page.tsx`**
- Replace static data with API fetch
- Implement status filter dropdown
- Add date range filter
- Connect action buttons to API
- Add loading states
- Add error handling
- Add success notifications (toast)

#### 3. **Create Client Components for Actions**

**New Files Needed:**
- `src/components/admin/SiteVisitActions.tsx` - Action buttons component
- `src/components/admin/RescheduleModal.tsx` - Reschedule modal
- `src/components/admin/SiteVisitDetails.tsx` - Detailed view modal

#### 4. **Email Notifications**

Update email templates to include:
- Site visit confirmed (to customer)
- Site visit cancelled (to customer)
- Site visit rescheduled (to customer)
- Site visit completed (to customer with feedback request)

---

## 🔒 **PHASE 5: Security & Error Handling - PENDING**

### Authentication & Authorization Checks

#### API Routes Security Audit

**Public Routes** (No auth required):
- ✅ `GET /api/plots` - List all plots
- ✅ `GET /api/plots/[id]` - Get single plot
- ✅ `POST /api/inquiries` - Submit inquiry (rate limited)

**Protected Routes** (User auth required):
- ✅ `POST /api/site-visits` - Schedule site visit
- ✅ `GET /api/site-visits` - Get user's site visits
- ⚠️ Need to add: `GET /api/site-visits/my` (alternative endpoint)

**Admin Routes** (Admin role required):
- ✅ `GET /api/admin/dashboard` - Admin dashboard data
- ✅ `GET /api/admin/users` - List all users
- ✅ `GET /api/admin/analytics` - Analytics data
- ❌ **Missing**: `GET /api/admin/site-visits` - All site visits
- ❌ **Missing**: `PUT /api/admin/site-visits/[id]` - Update site visit
- ❌ **Missing**: Admin routes for plots, inquiries

### Input Validation Checklist

**Site Visit Booking**:
- ✅ Plot ID is valid UUID
- ✅ Visit date is not in the past
- ✅ Visit date is within 3 months
- ✅ Visit time is valid time slot
- ✅ Attendees between 1-10
- ✅ Notes max 500 characters
- ✅ Phone number format (Indian 10-digit)
- ✅ Email format validation

**User Registration**:
- ✅ Name min 2 characters
- ✅ Email format validation
- ✅ Password min 8 characters
- ✅ Phone optional, but validated if provided
- ✅ Duplicate email/phone check

**Missing Validations**:
- ❌ Rate limiting on inquiry submissions
- ❌ Rate limiting on site visit bookings
- ❌ Duplicate site visit prevention (same user, plot, date)
- ❌ Admin action audit logging

### Error Handling Improvements Needed

1. **Add Global Error Boundary**
   - Create `src/app/error.tsx`
   - Create `src/app/global-error.tsx`

2. **API Error Standardization**
   - ✅ Using `withErrorHandling` wrapper
   - ✅ Structured error responses
   - ⚠️ Need consistent error codes

3. **Client-Side Error Handling**
   - Add toast notification system
   - Better error messages for users
   - Retry logic for failed requests

---

## 🎨 **PHASE 6: SEO & Performance - PENDING**

### Metadata Implementation

#### Pages Needing Metadata

**Completed**:
- ✅ Root layout has basic metadata

**Pending**:
```typescript
// src/app/page.tsx (Homepage)
export const metadata = {
  title: 'Plotzed | Premium Real Estate Properties',
  description: 'Discover luxury plots and properties...',
  openGraph: {...},
}

// src/app/plots/[id]/page.tsx (Property pages)
export async function generateMetadata({ params }) {
  // Dynamic title with property name
}

// src/app/dashboard/page.tsx
export const metadata = {
  title: 'My Dashboard | Plotzed',
  robots: { index: false, follow: false }
}

// src/app/login/page.tsx, src/app/register/page.tsx
// Proper titles, noindex
```

### Create Sitemap

**File: `src/app/sitemap.ts`**
```typescript
// Generate dynamic sitemap including:
// - Homepage
// - All published plots
// - Static pages (about, contact, etc.)
```

### Create robots.txt

**File: `public/robots.txt`**
```
User-agent: *
Allow: /
Disallow: /admin
Disallow: /dashboard
Disallow: /api

Sitemap: https://yourdomain.com/sitemap.xml
```

### Performance Optimizations

1. **Image Optimization**
   - Replace `<img>` with Next.js `<Image>` component
   - Add blur placeholders
   - Lazy loading

2. **Loading States**
   - Add skeleton loaders
   - Loading.tsx files for suspense boundaries

3. **Code Splitting**
   - Dynamic imports for heavy components
   - Route-based code splitting (already done by Next.js)

### Structured Data (JSON-LD)

Add to property pages:
```typescript
const structuredData = {
  "@context": "https://schema.org",
  "@type": "RealEstateListing",
  "name": plot.title,
  "description": plot.description,
  "price": plot.price,
  // ... etc
}
```

---

## 🧪 **PHASE 7: Testing Scenarios**

### Manual Testing Checklist

#### Guest User Journey
- [ ] Browse homepage
- [ ] View property listings (`/plots`)
- [ ] Click on a property to view details
- [ ] Try to schedule site visit → Redirected to `/login`
- [ ] Submit inquiry form → Success
- [ ] Subscribe to newsletter → Success

#### Customer Registration & Login
- [ ] Click "Sign Up" in header
- [ ] Fill registration form with valid data
- [ ] Submit → Auto-login → Redirect to homepage
- [ ] Check email for verification link
- [ ] Logout
- [ ] Click "Log In" in header
- [ ] Login with credentials → Redirect to homepage
- [ ] Header shows "Dashboard" and "Logout"

#### Customer Site Visit Booking
- [ ] Browse properties on homepage
- [ ] Click on a property
- [ ] Click "Schedule Site Visit" button
- [ ] Fill out site visit form
- [ ] Submit → Success message
- [ ] Click "Dashboard" in header
- [ ] See scheduled visit in "Upcoming Visits"
- [ ] Check status badge shows "PENDING"
- [ ] Check email for confirmation

#### Admin User Journey
- [ ] Login as admin → Redirect to `/admin`
- [ ] View dashboard metrics
- [ ] Click "Review Visits" → See all site visits
- [ ] Filter by status → Results update
- [ ] Click "Confirm" on PENDING visit
- [ ] Status updates to CONFIRMED
- [ ] Customer receives confirmation email
- [ ] Click "Mark Complete" on CONFIRMED visit
- [ ] Status updates to COMPLETED
- [ ] Click "Add Property" → Form opens
- [ ] Fill form and submit → New property created
- [ ] View all users → List appears
- [ ] Click on user → See visit history

#### Edge Cases & Error Handling
- [ ] Try scheduling visit for yesterday → Error shown
- [ ] Submit form with invalid email → Validation error
- [ ] Try accessing `/admin` as customer → Denied (403)
- [ ] Submit inquiry without required fields → Error
- [ ] Try scheduling 2 visits same time/plot → Handled
- [ ] Disconnect internet → Proper error message
- [ ] Submit very long text (> max length) → Validation
- [ ] SQL injection attempts → Sanitized
- [ ] XSS attempts in text fields → Escaped

---

## 🌐 **PHASE 8: Production Environment Setup**

### Environment Variables Documentation

**File: `.env.production.example`**
```bash
# Database
DATABASE_URL="postgresql://user:pass@host:5432/dbname"

# NextAuth
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="GENERATE_NEW_32_CHAR_SECRET_HERE"

# Email (Production SMTP)
SMTP_HOST="smtp.sendgrid.net"
SMTP_PORT="587"
SMTP_USER="apikey"
SMTP_PASSWORD="your_sendgrid_api_key"
SMTP_FROM="noreply@yourdomain.com"

# Redis (Upstash Production)
UPSTASH_REDIS_REST_URL="https://your-redis.upstash.io"
UPSTASH_REDIS_REST_TOKEN="your_token"

# Error Tracking
SENTRY_DSN="https://sentry.io/your-project-dsn"

# AWS S3 / Cloudflare R2 (for images)
R2_ACCOUNT_ID="your_account_id"
R2_ACCESS_KEY_ID="your_key"
R2_SECRET_ACCESS_KEY="your_secret"
R2_BUCKET_NAME="plotzed-images"

# Analytics (Optional)
NEXT_PUBLIC_GA_ID="G-XXXXXXXXXX"
```

### Deployment Checklist

**File: `DEPLOYMENT.md`**
```markdown
# Deployment Guide

## Prerequisites
- [ ] Vercel account created
- [ ] Production PostgreSQL database (Neon/Supabase/Railway)
- [ ] Production Redis instance (Upstash)
- [ ] SMTP credentials (SendGrid/AWS SES)
- [ ] Domain name configured

## Step 1: Database Setup
1. Create production PostgreSQL database
2. Run migrations: `npx prisma migrate deploy`
3. Create admin user: `npm run seed:admin`

## Step 2: Vercel Deployment
1. Connect GitHub repo to Vercel
2. Set all environment variables
3. Deploy main branch
4. Configure custom domain

## Step 3: Post-Deployment
1. Test admin login
2. Test customer registration
3. Test site visit booking
4. Check email delivery
5. Verify database connections
6. Monitor error logs (Sentry)

## Step 4: Security Hardening
1. Enable HTTPS only
2. Set secure cookie flags
3. Configure CORS properly
4. Enable rate limiting
5. Set CSP headers
```

---

## 📋 **PRIORITY IMPLEMENTATION ORDER**

### **Week 1: Admin Dashboard Functionality**
1. Create admin site visits API routes
2. Make admin pages dynamic
3. Implement action button handlers
4. Add email notifications

### **Week 2: Security & Testing**
1. Add missing admin routes
2. Implement rate limiting
3. Add audit logging
4. Manual testing (all scenarios)
5. Fix discovered bugs

### **Week 3: SEO & Performance**
1. Add metadata to all pages
2. Create sitemap
3. Add structured data
4. Optimize images
5. Add loading states

### **Week 4: Production Preparation**
1. Create deployment documentation
2. Set up production environment
3. Database migration testing
4. Final security audit
5. Production deployment

---

## 🎯 **SUCCESS CRITERIA**

### Admin Dashboard
- [ ] Admin can view all site visits
- [ ] Admin can filter by status and date
- [ ] Admin can confirm/cancel/reschedule visits
- [ ] Customers receive email on status changes
- [ ] Action audit trail is logged

### Security
- [ ] All API routes have proper auth checks
- [ ] Input validation on all forms
- [ ] Rate limiting implemented
- [ ] No SQL injection vulnerabilities
- [ ] No XSS vulnerabilities

### Performance
- [ ] Homepage loads < 2 seconds
- [ ] All pages have proper metadata
- [ ] Sitemap is generated
- [ ] Images are optimized
- [ ] Core Web Vitals pass

### Production Ready
- [ ] Deployment documentation complete
- [ ] All environment variables documented
- [ ] Database migrations tested
- [ ] Error monitoring set up
- [ ] Backup strategy in place

---

## 📞 **Support & Maintenance**

### Monitoring
- Set up error tracking (Sentry)
- Monitor API response times
- Track user analytics
- Database performance monitoring

### Backups
- Daily database backups
- Keep 30-day backup history
- Test restore process monthly

### Updates
- Security updates (monthly)
- Dependency updates (quarterly)
- Feature updates (as needed)
