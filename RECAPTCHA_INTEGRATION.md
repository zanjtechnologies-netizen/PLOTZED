# Google reCAPTCHA v3 Integration Guide

## Overview

Google reCAPTCHA v3 has been integrated into the Plotzed application to protect forms from spam and bot submissions. Unlike v2, reCAPTCHA v3 runs invisibly in the background and returns a score (0.0 - 1.0) indicating how likely the user is human.

---

## Setup

### 1. Get reCAPTCHA Credentials

1. Go to [Google reCAPTCHA Admin](https://www.google.com/recaptcha/admin)
2. Register a new site:
   - **Label:** Plotzed Real Estate
   - **reCAPTCHA type:** v3
   - **Domains:**
     - `localhost` (for development)
     - `plotzed.com` (production domain)
3. Copy the **Site Key** and **Secret Key**

### 2. Configure Environment Variables

Add to `.env.local`:

```bash
# reCAPTCHA v3
NEXT_PUBLIC_RECAPTCHA_SITE_KEY="your_site_key_here"
RECAPTCHA_SECRET_KEY="your_secret_key_here"
RECAPTCHA_MIN_SCORE="0.5"  # Minimum score to accept (0.0-1.0)
```

**Score Guidelines:**
- `0.9+` - Very likely human
- `0.7-0.9` - Probably human
- `0.5-0.7` - May be bot or suspicious
- `< 0.5` - Likely bot

**Recommended:** Start with `0.5` and adjust based on your needs.

---

## Implementation

### 1. Wrap Your App with RecaptchaProvider

Update `src/app/layout.tsx`:

```tsx
import { RecaptchaProvider } from '@/components/providers/RecaptchaProvider'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <RecaptchaProvider>
          {children}
        </RecaptchaProvider>
      </body>
    </html>
  )
}
```

### 2. Use in Forms

There are two ways to integrate reCAPTCHA into your forms:

#### Option A: Using the `useRecaptcha` Hook

```tsx
'use client'

import { useState } from 'react'
import { useRecaptcha } from '@/hooks/useRecaptcha'

export default function InquiryForm() {
  const { verifyRecaptcha, isVerifying } = useRecaptcha()
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Verify reCAPTCHA
    const verification = await verifyRecaptcha('submit_inquiry')

    if (!verification.success) {
      alert(`Verification failed: ${verification.error}`)
      return
    }

    // Proceed with form submission
    const response = await fetch('/api/inquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })

    if (response.ok) {
      alert('Inquiry submitted successfully!')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        placeholder="Your Name"
        required
      />
      <input
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        placeholder="Your Email"
        required
      />
      <textarea
        value={formData.message}
        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
        placeholder="Your Message"
        required
      />
      <button type="submit" disabled={isVerifying}>
        {isVerifying ? 'Verifying...' : 'Submit'}
      </button>
    </form>
  )
}
```

#### Option B: Using the HOC (Higher-Order Component)

```tsx
'use client'

import { withRecaptchaVerification } from '@/hooks/useRecaptcha'

function InquiryForm({ verifyRecaptcha, isVerifying }) {
  const handleSubmit = async (e) => {
    e.preventDefault()

    const verification = await verifyRecaptcha('submit_inquiry')

    if (verification.success) {
      // Submit form
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
      <button disabled={isVerifying}>Submit</button>
    </form>
  )
}

export default withRecaptchaVerification(InquiryForm)
```

---

## Action Names

Use descriptive action names for different forms:

| Form | Action Name | Description |
|------|-------------|-------------|
| Inquiry Form | `submit_inquiry` | Contact/inquiry submissions |
| Site Visit Booking | `book_site_visit` | Site visit booking requests |
| Login | `login` | User login attempts |
| Registration | `register` | New user signups |
| Password Reset | `reset_password` | Password reset requests |
| Newsletter | `subscribe_newsletter` | Newsletter subscriptions |

---

## API Endpoint

### POST /api/verify-recaptcha

Verifies a reCAPTCHA token from the client.

**Request:**
```json
{
  "token": "reCAPTCHA_token_here",
  "action": "submit_inquiry"
}
```

**Response (Success):**
```json
{
  "success": true,
  "score": 0.9,
  "action": "submit_inquiry",
  "challenge_ts": "2025-11-15T10:30:00Z",
  "hostname": "localhost"
}
```

**Response (Failure):**
```json
{
  "success": false,
  "score": 0.3,
  "error": "reCAPTCHA score too low - possible bot activity"
}
```

### GET /api/verify-recaptcha

Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "service": "reCAPTCHA Verification",
  "configured": true,
  "minScore": 0.5
}
```

---

## Testing

### 1. Test Without Configuration

If `RECAPTCHA_SECRET_KEY` is not set, the API will:
- Log a warning
- Return `success: true` with score 1.0
- Allow the request to proceed

This is useful for development when you don't want to configure reCAPTCHA.

### 2. Test with Low Score

To test bot detection, Google provides test keys:

**Site Key (always returns 0.0 score):**
```
6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI
```

**Secret Key:**
```
6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe
```

Use these in `.env.local` to test score validation.

### 3. Manual Testing

```bash
# Check if reCAPTCHA is configured
curl http://localhost:3000/api/verify-recaptcha

# Test verification (will fail without valid token)
curl -X POST http://localhost:3000/api/verify-recaptcha \
  -H "Content-Type: application/json" \
  -d '{"token":"test_token","action":"test"}'
```

---

## Badge Customization

The reCAPTCHA badge appears in the bottom-right corner by default. To customize:

Edit `src/components/providers/RecaptchaProvider.tsx`:

```tsx
container={{
  parameters: {
    badge: 'inline',  // 'bottomright', 'bottomleft', 'inline'
    theme: 'dark',     // 'light' or 'dark'
  },
}}
```

### Hide Badge (Not Recommended)

If you hide the badge, you **must** include this text in your UI:

```
This site is protected by reCAPTCHA and the Google
Privacy Policy and Terms of Service apply.
```

Add to your CSS:
```css
.grecaptcha-badge {
  visibility: hidden;
}
```

---

## Error Handling

Common error codes from Google:

| Error Code | Description | Solution |
|------------|-------------|----------|
| `missing-input-secret` | Secret key missing | Add `RECAPTCHA_SECRET_KEY` to `.env.local` |
| `invalid-input-secret` | Invalid secret key | Check your secret key is correct |
| `missing-input-response` | Token missing | Client didn't send token |
| `invalid-input-response` | Invalid token | Token expired or incorrect |
| `timeout-or-duplicate` | Token used twice | Get a new token |

---

## Security Best Practices

1. **Never expose secret key** - Keep it server-side only
2. **Validate on server** - Always verify tokens on the backend
3. **Use unique actions** - Different actions for different forms
4. **Monitor scores** - Track scores and adjust threshold as needed
5. **Rate limiting** - Use with existing rate limiting (already implemented)
6. **HTTPS only** - reCAPTCHA requires HTTPS in production

---

## Monitoring

Check reCAPTCHA analytics at:
https://www.google.com/recaptcha/admin/site/{YOUR_SITE_KEY}/analytics

Monitor:
- Request volume
- Score distribution
- Action breakdown
- Error rates

---

## Integration Checklist

- [ ] Get reCAPTCHA site key and secret key
- [ ] Add keys to `.env.local`
- [ ] Set `RECAPTCHA_MIN_SCORE` (recommended: 0.5)
- [ ] Wrap app with `RecaptchaProvider` in `layout.tsx`
- [ ] Add verification to inquiry form
- [ ] Add verification to site visit booking form
- [ ] Add verification to contact forms
- [ ] Test with valid submissions
- [ ] Test with bot-like behavior
- [ ] Monitor scores in Google reCAPTCHA admin
- [ ] Adjust `RECAPTCHA_MIN_SCORE` based on false positives

---

## Files Created

- `src/app/api/verify-recaptcha/route.ts` - API endpoint
- `src/hooks/useRecaptcha.ts` - Custom React hook
- `src/components/providers/RecaptchaProvider.tsx` - Provider component

---

**Note:** reCAPTCHA v3 is optional. If not configured, forms will work without verification. This is useful for development and testing.
