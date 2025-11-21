# Admin Page Error Diagnostic Guide

## Current Issue
Admin page at `/admin` shows "Something went wrong!" error.

## Quick Diagnostic Steps

### 1. Check Browser Console (F12)
1. Press `F12` to open Developer Tools
2. Go to "Console" tab
3. Look for error messages (usually in red)
4. Copy the error message

### 2. Check Vercel Function Logs
1. Visit: https://vercel.com/dashboard
2. Select your "plotzed-webapp" project
3. Click on the latest deployment
4. Click "Functions" tab
5. Look for errors in:
   - `/api/admin/dashboard`
   - `/admin` (server function)

### 3. Test API Endpoints Directly

**Test Dashboard API:**
```
Visit: https://plotzed.vercel.app/api/admin/dashboard
```

Expected Response:
```json
{
  "success": true,
  "data": {
    "stats": { ... },
    "recentSiteVisits": [ ... ],
    "recentInquiries": [ ... ]
  }
}
```

If you see an error, copy the full error message.

**Test Health Check:**
```
Visit: https://plotzed.vercel.app/api/health
```

Expected: `{success: true, ...}`

### 4. Check Authentication
1. Open a new incognito window
2. Visit: https://plotzed.vercel.app/login
3. Try logging in with admin credentials
4. Note if login succeeds or fails

### 5. Check Environment Variables
Visit (if enabled):
```
https://plotzed.vercel.app/api/check-env
```

Look for any "NOT SET" variables.

## Common Causes & Solutions

### Cause 1: Database Connection Error
**Symptoms:** API endpoints return 500 errors
**Solution:**
1. Go to Vercel Dashboard → Settings → Environment Variables
2. Verify `DATABASE_URL` and `DIRECT_DATABASE_URL` are set
3. Redeploy

### Cause 2: Recent Migration Not Applied
**Symptoms:** Foreign key constraint errors
**Solution:**
- Wait for current deployment to complete (check Vercel dashboard)
- The migration fix we just pushed should resolve this

### Cause 3: Authentication Error
**Symptoms:** Stuck on login or redirected to login
**Solution:**
1. Check `NEXTAUTH_URL` matches your deployment URL
2. Check `NEXTAUTH_SECRET` is set
3. See [QUICK_FIX_LOGIN.md](QUICK_FIX_LOGIN.md)

### Cause 4: Missing Dependencies
**Symptoms:** Module not found errors
**Solution:**
- Vercel will reinstall dependencies automatically
- Wait for deployment to complete

## Temporary Workaround

If you need immediate access, you can enable detailed error messages:

1. Go to Vercel Dashboard
2. Environment Variables → Add:
   - Key: `NODE_ENV`
   - Value: `development`
   - Environment: Preview only
3. Redeploy
4. Visit admin page again - you'll see the actual error

**IMPORTANT:** Remove this after fixing! Never use `NODE_ENV=development` in production.

## Need Help?

Share with me:
1. ✅ Browser console errors (F12 → Console tab)
2. ✅ Response from `/api/admin/dashboard`
3. ✅ Response from `/api/health`
4. ✅ Vercel deployment status (deploying? succeeded? failed?)
5. ✅ Any error messages from Vercel function logs

This will help me provide a precise fix!
