# reCAPTCHA Frontend Integration Summary

## ✅ Integration Complete!

Google reCAPTCHA v3 has been successfully integrated into all user-facing forms in the Plotzed application.

---

## What Was Integrated

### 1. Root Layout - RecaptchaProvider

**File:** `src/app/layout.tsx`

Added the `RecaptchaProvider` wrapper to enable reCAPTCHA across the entire application:

```tsx
<RecaptchaProvider>
  <SessionProvider>
    <Header />
    <main>{children}</main>
    <Footer />
  </SessionProvider>
</RecaptchaProvider>
```

### 2. Site Visit Form

**File:** `src/components/forms/SiteVisitForm.tsx`

**Action:** `book_site_visit`

**Features:**
- Verifies user before submitting site visit requests
- Shows "Verifying..." state during reCAPTCHA check
- Displays error message if verification fails
- Prevents submission if score is too low

**Integration:**
```tsx
const { verifyRecaptcha, isVerifying } = useRecaptcha()

const handleSubmit = async (e) => {
  // Verify reCAPTCHA first
  const verification = await verifyRecaptcha('book_site_visit')

  if (!verification.success) {
    setError(verification.error)
    return
  }

  // Proceed with submission
}
```

### 3. Login Page

**File:** `src/app/login/page.tsx`

**Action:** `login`

**Features:**
- Protects against brute force login attempts
- Verifies users before authentication
- Shows "Verifying..." loading state
- Works with existing rate limiting

**Integration:**
```tsx
const { verifyRecaptcha, isVerifying } = useRecaptcha()

const handleSubmit = async (e) => {
  // Verify reCAPTCHA
  const verification = await verifyRecaptcha('login')

  if (!verification.success) {
    setError(verification.error)
    return
  }

  // Proceed with sign in
  await signIn('credentials', { email, password })
}
```

### 4. Registration Page

**File:** `src/app/register/page.tsx`

**Action:** `register`

**Features:**
- Prevents bot registrations
- Verifies new users before account creation
- Shows verification progress
- Validates before backend call

**Integration:**
```tsx
const { verifyRecaptcha, isVerifying } = useRecaptcha()

const handleSubmit = async (e) => {
  // Verify reCAPTCHA
  const verification = await verifyRecaptcha('register')

  if (!verification.success) {
    setError(verification.error)
    return
  }

  // Create account
  await fetch('/api/auth/register', { ... })
}
```

---

## User Experience

### Loading States

All forms now show three states:

1. **Normal:** "Sign In" / "Request Site Visit" / "Create Account"
2. **Verifying:** "Verifying..." with spinner (reCAPTCHA check)
3. **Submitting:** "Signing in..." / "Submitting..." / "Creating account..." (backend processing)

### Button States

Buttons are disabled during both verification and submission:
```tsx
<button disabled={loading || isVerifying}>
  {isVerifying ? 'Verifying...' : loading ? 'Submitting...' : 'Submit'}
</button>
```

---

## Actions by Form

| Form | Action Name | Purpose |
|------|-------------|---------|
| Login | `login` | Prevent brute force attacks |
| Register | `register` | Prevent bot signups |
| Site Visit | `book_site_visit` | Prevent spam bookings |

These action names are tracked in Google reCAPTCHA Analytics for monitoring.

---

## Configuration

### Environment Variables Required

```bash
# Public site key (visible in frontend)
NEXT_PUBLIC_RECAPTCHA_SITE_KEY="your_site_key_here"

# Secret key (server-side only)
RECAPTCHA_SECRET_KEY="your_secret_key_here"

# Minimum score to accept (0.0 - 1.0)
RECAPTCHA_MIN_SCORE="0.5"
```

### Development Mode

If `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` is not set:
- ⚠️ Warning logged to console
- ✅ Forms still work (verification is skipped)
- ✅ No errors or blocking

This allows development without configuring reCAPTCHA.

---

## Error Handling

### Verification Failures

When reCAPTCHA verification fails, users see:

```
Security verification failed. Please try again.
```

Or specific errors:
- "reCAPTCHA score too low - possible bot activity"
- "Failed to get reCAPTCHA token"
- "reCAPTCHA action mismatch"

### User Actions

Users can:
1. Refresh the page
2. Try submitting again (new token generated automatically)
3. Contact support if issue persists

---

## Testing

### Test Without Configuration

1. Don't set `RECAPTCHA_SECRET_KEY`
2. Forms will work normally
3. Check browser console for warnings:
   ```
   ⚠️ RECAPTCHA_SECRET_KEY not configured - skipping verification
   ```

### Test With Configuration

1. Add reCAPTCHA credentials to `.env.local`
2. Submit forms
3. Check browser console for:
   ```
   ✅ reCAPTCHA verification successful: { score: 0.9, action: 'login' }
   ```

### Test Low Scores

Use Google's test keys:
```bash
NEXT_PUBLIC_RECAPTCHA_SITE_KEY="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
RECAPTCHA_SECRET_KEY="6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe"
```

These always return score `0.0` for testing bot detection.

---

## Monitoring

### Client-Side Logs

Check browser console for:
```javascript
✅ reCAPTCHA verification successful: { score: 0.9, action: 'book_site_visit' }
❌ reCAPTCHA verification failed: score too low
```

### Server-Side Logs

Check server logs for:
```
✅ reCAPTCHA verification successful: { score: 0.9, action: 'login', hostname: 'localhost' }
⚠️ reCAPTCHA score too low: 0.3 (minimum: 0.5)
```

### Google reCAPTCHA Admin

Monitor at: https://www.google.com/recaptcha/admin

Track:
- Request volume by action
- Score distribution
- Challenge rate
- Error rates

---

## Next Steps

1. **Get reCAPTCHA credentials** from [Google reCAPTCHA Admin](https://www.google.com/recaptcha/admin)
2. **Add to .env.local:**
   ```bash
   NEXT_PUBLIC_RECAPTCHA_SITE_KEY="your_site_key_here"
   RECAPTCHA_SECRET_KEY="your_secret_key_here"
   ```
3. **Test on localhost** - Ensure forms work as expected
4. **Monitor scores** - Check Google reCAPTCHA admin after going live
5. **Adjust threshold** - Modify `RECAPTCHA_MIN_SCORE` based on false positives

---

## Files Modified

✅ `src/app/layout.tsx` - Added RecaptchaProvider wrapper
✅ `src/components/forms/SiteVisitForm.tsx` - Integrated verification
✅ `src/app/login/page.tsx` - Integrated verification
✅ `src/app/register/page.tsx` - Integrated verification

---

## Benefits

- ✅ **Bot Protection** - Prevents automated submissions
- ✅ **Invisible** - No CAPTCHAs or challenges for legitimate users
- ✅ **Score-Based** - Flexible threshold configuration
- ✅ **Action Tracking** - Monitor different forms separately
- ✅ **Graceful Degradation** - Works without configuration during development
- ✅ **User-Friendly** - Clear loading states and error messages

---

**Integration completed successfully!** All user-facing forms now have reCAPTCHA v3 protection.
