# Refresh Endpoint - Testing Guide

## Fixed Issues

✅ Improved null checking using optional chaining (`?.`)
✅ Better TypeScript type safety
✅ No compilation errors

## Endpoints

### 1. POST /api/auth/refresh
Refreshes the current session and updates last_login timestamp.

**Usage:**
```bash
curl -X POST http://localhost:3000/api/auth/refresh \
  -H "Cookie: next-auth.session-token=YOUR_SESSION_TOKEN"
```

**Response (Success):**
```json
{
  "message": "Session refreshed successfully",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "User Name",
    "role": "CUSTOMER",
    "email_verified": true
  },
  "success": true
}
```

**Response (Not Authenticated):**
```json
{
  "error": "Not authenticated"
}
```
Status: 401

---

### 2. GET /api/auth/refresh
Checks current session status without modifying anything.

**Usage:**
```bash
curl -X GET http://localhost:3000/api/auth/refresh \
  -H "Cookie: next-auth.session-token=YOUR_SESSION_TOKEN"
```

**Response (Authenticated):**
```json
{
  "authenticated": true,
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "User Name",
    "role": "CUSTOMER",
    "email_verified": true,
    "last_login": "2025-01-15T10:30:00.000Z"
  }
}
```

**Response (Not Authenticated):**
```json
{
  "authenticated": false
}
```
Status: 401

---

## Code Improvements Made

### Before:
```typescript
if (!session || !session.user) {
  // Issue: Doesn't check if session.user.id exists
}
```

### After:
```typescript
if (!session?.user?.id) {
  // ✅ Uses optional chaining for safer null checking
}
```

This ensures:
1. `session` exists
2. `session.user` exists
3. `session.user.id` exists

All in one concise check!

---

## Testing in Your Application

### Frontend (React/Next.js)

```typescript
// Check if user is authenticated
async function checkAuth() {
  const response = await fetch('/api/auth/refresh', {
    method: 'GET',
    credentials: 'include', // Important: Include cookies
  })

  const data = await response.json()

  if (data.authenticated) {
    console.log('User:', data.user)
  } else {
    // Redirect to login
    window.location.href = '/login'
  }
}

// Refresh session (e.g., on app startup or periodically)
async function refreshSession() {
  const response = await fetch('/api/auth/refresh', {
    method: 'POST',
    credentials: 'include',
  })

  if (response.ok) {
    const data = await response.json()
    console.log('Session refreshed:', data.user)
  }
}
```

### Using with useEffect

```typescript
import { useEffect, useState } from 'react'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check authentication on mount
    fetch('/api/auth/refresh', {
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => {
        if (data.authenticated) {
          setUser(data.user)
        }
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div>Loading...</div>
  if (!user) return <div>Please login</div>

  return <div>Welcome, {user.name}!</div>
}
```

---

## Common Issues & Solutions

### Issue 1: "Not authenticated" even though logged in
**Solution:** Make sure cookies are being sent with the request
```typescript
fetch('/api/auth/refresh', {
  credentials: 'include' // Add this!
})
```

### Issue 2: CORS errors
**Solution:** Ensure you're calling from the same domain or configure CORS in Next.js

### Issue 3: Session expired
**Solution:** Redirect user to login page
```typescript
if (!data.authenticated) {
  window.location.href = '/login'
}
```

---

## Session Lifecycle

1. **User logs in** → Session created (7 day expiration)
2. **User makes request** → Session validated
3. **Periodic refresh** → Session extended (POST /api/auth/refresh)
4. **User logs out** → Session destroyed (POST /api/auth/logout)
5. **Session expires** → Auto-logout after 7 days

---

## Security Notes

✅ Sessions are JWT-based and cryptographically signed
✅ Session tokens stored in HTTP-only cookies (not accessible via JavaScript)
✅ 7-day expiration for sessions
✅ User verification on every request
✅ Database checks ensure user still exists and is active

---

**Status:** ✅ All issues resolved, endpoint working correctly!
