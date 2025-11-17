# Admin Panel Troubleshooting Guide

**Last Updated:** 2025-11-16
**Related Commit:** `67443941 - fix: Property creation and R2 storage integration issues`

---

## 🔧 Issues Fixed

### 1. Property Creation Not Working ✅ FIXED

**Problem:** "Add Property" button wasn't working properly

**Root Cause:**
- Validation schema (`createPlotSchema`) was missing required fields
- API wasn't handling new fields (`facing`, `images`, `status`, `is_published`)
- Description field was required (min 20 chars) but should be optional

**Solution Applied:**
```typescript
// Updated schema in src/lib/validators.ts
export const createPlotSchema = z.object({
  // ... existing fields
  facing: z.string().optional(),              // ✅ ADDED
  images: z.array(z.string()).default([]),    // ✅ ADDED
  status: z.enum(['AVAILABLE', 'BOOKED', 'SOLD']).default('AVAILABLE'), // ✅ ADDED
  is_published: z.boolean().default(true),    // ✅ ADDED
  description: z.string().optional(),         // ✅ CHANGED from required
})
```

**Files Modified:**
- [src/lib/validators.ts](src/lib/validators.ts:125-146) - Updated schema
- [src/app/api/plots/route.ts](src/app/api/plots/route.ts:152-174) - Fixed field mapping
- [src/app/api/plots/[id]/route.ts](src/app/api/plots/[id]/route.ts:58-77) - Fixed update mapping
- [src/components/admin/PropertyModal.tsx](src/components/admin/PropertyModal.tsx:147-210) - Added error logging

---

### 2. Image Upload Issues

**Problem:** Images might not upload to R2 storage

**Verification Steps:**

1. **Check R2 Environment Variables:**
```bash
# All should show "✓ SET"
node -e "
['R2_ENDPOINT', 'R2_ACCESS_KEY_ID', 'R2_SECRET_ACCESS_KEY', 'R2_BUCKET', 'R2_ACCOUNT_ID'].forEach(v => {
  console.log(\`\${v}: \${process.env[v] ? '✓ SET' : '✗ NOT SET'}\`);
});
"
```

2. **Test R2 Connection:**
```bash
# Visit this endpoint in browser (when logged in as admin)
https://your-domain.vercel.app/api/test-r2
```

Expected response:
```json
{
  "success": true,
  "r2Status": {
    "environmentVariables": {
      "R2_ENDPOINT": "✓ SET",
      "R2_ACCESS_KEY_ID": "✓ SET",
      "R2_SECRET_ACCESS_KEY": "✓ SET",
      "R2_BUCKET": "✓ SET",
      "R2_ACCOUNT_ID": "✓ SET"
    },
    "connectionTest": "✓ CONNECTION SUCCESSFUL",
    "uploadTest": "✓ UPLOAD SUCCESSFUL\nTest file: https://..."
  }
}
```

**Common Issues:**

#### Issue 2.1: R2 Public Access Not Enabled

**Symptoms:** Images upload but don't display (403 errors)

**Solution:**
1. Go to Cloudflare Dashboard → R2
2. Select your bucket
3. Settings → Public Access
4. Enable "Allow Access"
5. Copy the public URL domain

**OR** Use R2.dev subdomain:
1. Settings → R2.dev subdomain
2. Enable it
3. URL format: `https://bucket-name.account-id.r2.dev/`

#### Issue 2.2: CORS Issues

**Symptoms:** Browser console shows CORS errors when uploading

**Solution:**
Add CORS policy to R2 bucket:
```json
[
  {
    "AllowedOrigins": ["https://your-domain.vercel.app"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedHeaders": ["*"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3000
  }
]
```

#### Issue 2.3: File Size Limit

**Symptoms:** Upload fails with "File too large" error

**Current Limit:** 10MB per file

**Solution Options:**
1. Compress images before upload
2. Increase limit in [src/app/api/upload/route.ts](src/app/api/upload/route.ts:34-36):
```typescript
const maxSize = 20 * 1024 * 1024 // 20MB
```

---

## 🐛 Debugging Tools

### Debug Mode for Property Creation

The PropertyModal now logs detailed information:

**Browser Console will show:**
```javascript
Submitting property payload: {
  title: "...",
  description: "...",
  price: 5000000,
  // ... all fields
}

API Response: {
  success: true/false,
  data: {...},
  error: "...",  // if failed
  errors: {...}   // validation errors
}
```

**How to use:**
1. Open browser DevTools (F12)
2. Go to Console tab
3. Try to create/edit a property
4. Check the console for detailed logs

### R2 Storage Test Endpoint

**URL:** `/api/test-r2`

**Access:** Admin only (must be logged in)

**What it tests:**
- ✓ Environment variables are set
- ✓ Connection to R2 works
- ✓ Upload permission works
- ✓ Public URL generation

**Example Response:**
```json
{
  "success": true,
  "r2Status": {
    "environmentVariables": {...},
    "connectionTest": "✓ CONNECTION SUCCESSFUL",
    "uploadTest": "✓ UPLOAD SUCCESSFUL",
    "endpoint": "https://xxxxx.r2.cloudflarestorage.com",
    "bucket": "plotzed-storage",
    "publicUrlPattern": "https://plotzed-storage.xxxxx.r2.dev/"
  }
}
```

---

## 🔍 Common Error Messages

### Error: "Invalid or missing reCAPTCHA token"

**Cause:** NEXTAUTH_URL mismatch (from previous session)

**Solution:**
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Update `NEXTAUTH_URL` to match your deployment URL:
   ```
   https://plotzed-af06qc6o5-zanj-technologies.vercel.app
   ```
   OR your custom domain:
   ```
   https://plotzed.com
   ```
3. Redeploy the application

### Error: "Validation failed" with field errors

**Cause:** Form data doesn't match schema

**Debug:**
1. Check browser console for "Submitting property payload"
2. Compare with schema in [src/lib/validators.ts](src/lib/validators.ts:125-146)
3. Look for missing required fields:
   - title (min 5 chars)
   - price (positive number)
   - bookingAmount (positive number)
   - plotSize (positive number)
   - address (min 10 chars)
   - city (min 2 chars)
   - state (min 2 chars)
   - pincode (exactly 6 digits)

### Error: "File upload failed"

**Possible Causes:**
1. R2 credentials invalid
2. R2 bucket doesn't exist
3. Network issue
4. File type not allowed

**Debug Steps:**
1. Visit `/api/test-r2` to test R2 connection
2. Check browser network tab for failed requests
3. Verify file type is one of: JPEG, PNG, WebP, PDF
4. Check Vercel function logs for detailed errors

### Error: "Only admins can create plot listings"

**Cause:** User doesn't have ADMIN role

**Solution:**
1. Verify you're logged in
2. Check your user role in database:
   ```sql
   SELECT id, email, role FROM users WHERE email = 'your-email@example.com';
   ```
3. If needed, update role to ADMIN:
   ```sql
   UPDATE users SET role = 'ADMIN' WHERE email = 'your-email@example.com';
   ```

---

## 📊 Vercel Deployment Checklist

### Environment Variables Required

Make sure ALL these are set in Vercel:

**Database:**
- ✅ `DATABASE_URL`
- ✅ `DIRECT_DATABASE_URL`

**Authentication:**
- ✅ `NEXTAUTH_SECRET`
- ✅ `NEXTAUTH_URL` (must match deployment URL!)

**R2 Storage:**
- ✅ `R2_ENDPOINT`
- ✅ `R2_ACCESS_KEY_ID`
- ✅ `R2_SECRET_ACCESS_KEY`
- ✅ `R2_BUCKET`
- ✅ `R2_ACCOUNT_ID`

**reCAPTCHA:**
- ✅ `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`
- ✅ `RECAPTCHA_SECRET_KEY`

**Other:**
- ✅ `NEXT_PUBLIC_APP_URL`
- ⚠️ `SENTRY_AUTH_TOKEN` (optional, for source maps)

### Post-Deployment Verification

1. **Test Login:**
   ```
   https://your-domain.vercel.app/login
   ```
   Should successfully log in (not stuck on "Signing in...")

2. **Test Admin Access:**
   ```
   https://your-domain.vercel.app/admin
   ```
   Should show dashboard with stats

3. **Test R2 Storage:**
   ```
   https://your-domain.vercel.app/api/test-r2
   ```
   Should return success with connection test

4. **Test Property Creation:**
   - Go to Admin → Properties
   - Click "Add Property"
   - Fill form and upload images
   - Click "Create Property"
   - Should succeed without errors

---

## 🚨 Quick Fixes

### Fix 1: Clear Browser Cache
Sometimes old JavaScript is cached:
```bash
# In browser
Ctrl + Shift + R (Windows/Linux)
Cmd + Shift + R (Mac)
```

### Fix 2: Rebuild on Vercel
If environment variables changed:
1. Go to Vercel Dashboard
2. Deployments tab
3. Click "..." on latest deployment
4. "Redeploy"
5. Check "Use existing Build Cache" = OFF

### Fix 3: Check Vercel Function Logs
Real-time debugging:
1. Vercel Dashboard → Your Project
2. Click on latest deployment
3. "Functions" tab
4. Click on failing function
5. View logs in real-time

### Fix 4: Test Locally First
Before deploying:
```bash
# Set all environment variables in .env.local
npm run dev

# Test at http://localhost:3000/admin
# Check browser console for errors
```

---

## 📞 Getting Help

### Error Log Template

When reporting issues, include:

```
**What I'm trying to do:**
Creating a new property with images

**What's happening:**
Getting "Validation failed" error

**Error Message:**
[Paste exact error from browser console]

**Environment:**
- Deployment URL: https://...
- Browser: Chrome 120
- Logged in as: admin@example.com

**Browser Console Logs:**
[Paste console.log output]

**Steps to Reproduce:**
1. Go to /admin/properties
2. Click "Add Property"
3. Fill form
4. Click submit
```

### Useful Debug Commands

```bash
# Check environment in Vercel
vercel env pull .env.local

# View Vercel logs
vercel logs

# Test API endpoint
curl https://your-domain.vercel.app/api/test-r2

# Check database connection
npx prisma db pull
```

---

## ✅ Resolution Checklist

After fixing issues:

- [ ] Property creation works
- [ ] Image upload works
- [ ] Images display publicly
- [ ] Property edit works
- [ ] Property delete works
- [ ] User management works
- [ ] Filters work on all pages
- [ ] No console errors
- [ ] No Vercel function errors
- [ ] All environment variables set

---

**Status:** All known issues have been fixed as of commit `67443941`

If you encounter any new issues, check the browser console first, then visit `/api/test-r2` to verify R2 integration.
