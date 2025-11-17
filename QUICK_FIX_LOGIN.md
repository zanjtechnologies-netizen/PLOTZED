# 🚨 URGENT FIX: Login Stuck on "Signing in..."

**Status:** ❌ BLOCKING ALL ADMIN FEATURES
**Cause:** NEXTAUTH_URL mismatch
**Fix Time:** 2-3 minutes

---

## ⚡ Quick Fix Steps

### Step 1: Check Current Issue

Visit this endpoint (no login required):
```
https://plotzed-af06qc6o5-zanj-technologies.vercel.app/api/check-env
```

If you see:
```json
{
  "issues": {
    "nextAuthUrl": {
      "issue": "MISMATCH",
      "currentHost": "plotzed-af06qc6o5-zanj-technologies.vercel.app",
      "nextAuthHost": "localhost:3000",
      "fix": "Update NEXTAUTH_URL to: https://plotzed-af06qc6o5-zanj-technologies.vercel.app"
    }
  }
}
```

This confirms the issue!

---

### Step 2: Fix in Vercel (Option A - Recommended)

1. **Go to Vercel Dashboard:**
   - Visit: https://vercel.com/dashboard
   - Select your "plotzed-webapp" project

2. **Update Environment Variable:**
   - Click "Settings" tab
   - Click "Environment Variables" in left sidebar
   - Find `NEXTAUTH_URL`
   - Click "Edit" (pencil icon)
   - Change value to:
     ```
     https://plotzed-af06qc6o5-zanj-technologies.vercel.app
     ```
     *(Or your custom domain if you have one)*

3. **Redeploy:**
   - Go to "Deployments" tab
   - Click "..." on latest deployment
   - Click "Redeploy"
   - **IMPORTANT:** Uncheck "Use existing Build Cache"
   - Click "Redeploy"

4. **Wait for deployment to complete** (usually 1-2 minutes)

---

### Step 3: Verify Fix

After redeployment:

1. **Test Login:**
   ```
   https://plotzed-af06qc6o5-zanj-technologies.vercel.app/login
   ```
   - Should successfully log in
   - Should redirect to dashboard
   - Should NOT be stuck on "Signing in..."

2. **Test Admin Access:**
   ```
   https://plotzed-af06qc6o5-zanj-technologies.vercel.app/admin
   ```
   - Should show admin dashboard
   - Should see property stats

3. **Test R2 Storage:**
   ```
   https://plotzed-af06qc6o5-zanj-technologies.vercel.app/api/test-r2
   ```
   - Should return R2 connection status
   - Should show upload test results

---

## 🔧 Alternative: Fix via Vercel CLI

If you prefer command line:

```bash
# Install Vercel CLI (if not already installed)
npm i -g vercel

# Login to Vercel
vercel login

# Set environment variable
vercel env add NEXTAUTH_URL production
# When prompted, enter: https://plotzed-af06qc6o5-zanj-technologies.vercel.app

# Or if updating existing:
vercel env rm NEXTAUTH_URL production
vercel env add NEXTAUTH_URL production

# Redeploy
vercel --prod
```

---

## 📋 Verification Checklist

After fix, confirm:

- [ ] Login page works (no infinite loading)
- [ ] Redirects to dashboard after login
- [ ] Admin pages accessible
- [ ] /api/check-env shows no NEXTAUTH_URL mismatch
- [ ] /api/test-r2 shows R2 connection success
- [ ] Property creation form opens
- [ ] No console errors

---

## 🆘 If Still Not Working

### Check 1: Clear Browser Cache
```
Hard refresh: Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)
Or open in incognito/private window
```

### Check 2: Verify Environment Variable Updated
Visit `/api/check-env` again - should show:
```json
{
  "environment": {
    "NEXTAUTH_URL": "https://plotzed-af06qc6o5-zanj-technologies.vercel.app"
  },
  "issues": {
    "nextAuthUrl": null  // Should be null (no issue)
  }
}
```

### Check 3: Check Vercel Function Logs
1. Go to Vercel Dashboard
2. Click on latest deployment
3. Click "Functions" tab
4. Look for errors in `/api/auth/*` functions

### Check 4: Verify Deployment Used New Environment
1. Vercel Dashboard → Deployments
2. Click on latest deployment
3. Scroll to "Environment Variables" section
4. Confirm NEXTAUTH_URL shows correct value

---

## 🎯 Why This Fixes Everything

**The Problem:**
- NEXTAUTH_URL was set to `http://localhost:3000`
- But you're accessing via `https://plotzed-af06qc6o5-zanj-technologies.vercel.app`
- NextAuth rejects authentication from different domains (security feature)
- This causes "Invalid or missing API key" error
- Which blocks login and all admin features

**The Fix:**
- Updating NEXTAUTH_URL to match your deployment URL
- NextAuth will accept authentication from the correct domain
- Login will complete successfully
- All admin features will work

---

## ⏱️ Timeline

- **Update env var:** 30 seconds
- **Redeploy:** 1-2 minutes
- **Test login:** 10 seconds
- **Total:** ~3 minutes

---

## 🔐 Security Note

After fixing, consider:

1. **Disable env check endpoint** (add to Vercel):
   ```
   ENABLE_ENV_CHECK=false
   ```

2. **Set up custom domain:**
   - More professional
   - Easier to remember
   - Stable URL (won't change with deployments)

3. **Add to .env.production.template:**
   ```bash
   # Update this template file
   NEXTAUTH_URL=https://your-domain.com
   ```

---

**Priority:** 🔴 **CRITICAL** - This must be fixed before testing any other admin features!

**Next Steps After Fix:**
1. ✅ Login works
2. ✅ Test property creation
3. ✅ Test image upload
4. ✅ Test user management
