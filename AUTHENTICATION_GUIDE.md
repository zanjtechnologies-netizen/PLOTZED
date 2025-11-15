# Authentication System Guide - Plotzed Real Estate

Complete authentication implementation with all security features.

## Features Implemented

✅ **JWT Refresh Token Endpoint**
✅ **Explicit Logout Endpoint**
✅ **Password Reset Flow**
✅ **Email Verification Flow**

---

## Table of Contents

1. [Authentication Endpoints](#authentication-endpoints)
2. [Email Verification](#email-verification)
3. [Password Reset](#password-reset)
4. [Session Management](#session-management)
5. [Testing Guide](#testing-guide)
6. [Security Features](#security-features)

---

## Authentication Endpoints

### 1. User Registration

**Endpoint:** `POST /api/auth/register`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "password": "SecurePass123!"
}
```

**Response (201 Created):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "uuid",
    "email": "john@example.com",
    "name": "John Doe",
    "role": "CUSTOMER"
  }
}
```

**Features:**
- Sends verification email automatically
- Sends welcome email
- Creates user with `email_verified: false`
- Generates 24-hour verification token

---

### 2. User Login

**Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Response (200 OK):**
```json
{
  "message": "Login successful",
  "user": {
    "id": "uuid",
    "email": "john@example.com",
    "name": "John Doe",
    "phone": "9876543210",
    "role": "CUSTOMER",
    "email_verified": true,
    "kyc_verified": false,
    "last_login": "2025-01-15T10:30:00Z"
  },
  "success": true
}
```

**Response (401 Unauthorized):**
```json
{
  "error": "Invalid email or password"
}
```

**Response (429 Too Many Requests - Account Locked):**
```json
{
  "error": "Account temporarily locked due to multiple failed login attempts. Try again in 14 minutes and 30 seconds."
}
```

**Features:**
- Account lockout after 5 failed attempts (30-minute cooldown)
- Updates last login timestamp
- Returns user data including verification status
- Creates NextAuth session automatically
- Optional email verification enforcement (currently disabled)

**Alternative:** NextAuth also handles login via `POST /api/auth/signin` (used by NextAuth client)

---

### 3. Explicit Logout

**Endpoint:** `POST /api/auth/logout`

**Headers:**
```
Authorization: Bearer <session-token>
Cookie: next-auth.session-token=<token>
```

**Response (200 OK):**
```json
{
  "message": "Logged out successfully",
  "success": true
}
```

**Alternative:** `GET /api/auth/logout`
- Redirects to `/login` after logout

---

### 4. Refresh Session/Token

**Endpoint:** `POST /api/auth/refresh`

**Headers:**
```
Authorization: Bearer <session-token>
```

**Response (200 OK):**
```json
{
  "message": "Session refreshed successfully",
  "user": {
    "id": "uuid",
    "email": "john@example.com",
    "name": "John Doe",
    "role": "CUSTOMER",
    "email_verified": true
  },
  "success": true
}
```

**Check Session:** `GET /api/auth/refresh`

**Response (200 OK):**
```json
{
  "authenticated": true,
  "user": {
    "id": "uuid",
    "email": "john@example.com",
    "name": "John Doe",
    "role": "CUSTOMER",
    "email_verified": true,
    "last_login": "2025-01-15T10:30:00Z"
  }
}
```

---

## Email Verification

### 1. Verify Email

**Endpoint:** `POST /api/auth/verify-email`

**Request Body:**
```json
{
  "token": "verification-token-from-email"
}
```

**Response (200 OK):**
```json
{
  "message": "Email verified successfully",
  "success": true
}
```

**Alternative:** `GET /api/auth/verify-email?token=<token>`

---

### 2. Resend Verification Email

**Endpoint:** `POST /api/auth/send-verification`

**Request Body:**
```json
{
  "email": "john@example.com"
}
```

**Response (200 OK):**
```json
{
  "message": "Verification email sent successfully",
  "success": true
}
```

**Features:**
- Generates new 24-hour verification token
- Sends email with verification link
- Security: Doesn't reveal if email exists

---

## Password Reset

### 1. Request Password Reset

**Endpoint:** `POST /api/auth/forgot-password`

**Request Body:**
```json
{
  "email": "john@example.com"
}
```

**Response (200 OK):**
```json
{
  "message": "Password reset email sent successfully",
  "success": true
}
```

**Features:**
- Generates 1-hour reset token
- Sends email with reset link
- Security: Doesn't reveal if email exists

---

### 2. Reset Password

**Endpoint:** `POST /api/auth/reset-password`

**Request Body:**
```json
{
  "token": "reset-token-from-email",
  "password": "NewSecurePass123!"
}
```

**Response (200 OK):**
```json
{
  "message": "Password reset successfully",
  "success": true
}
```

**Features:**
- Validates token expiration (1 hour)
- Hashes password with bcrypt (12 rounds)
- Clears reset token after use
- Sends confirmation email

---

## Session Management

### Session Configuration

**File:** `src/lib/auth.ts`

```typescript
session: {
  strategy: "jwt",
  maxAge: 7 * 24 * 60 * 60, // 7 days
}
```

### JWT Token Structure

The JWT token includes:
- `id`: User ID
- `role`: User role (ADMIN/CUSTOMER)
- `email`: User email
- `name`: User name

### Get Current Session

```typescript
import { auth } from '@/lib/auth'

// In Server Component
const session = await auth()

// In API Route
export async function GET(request: NextRequest) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  // Use session.user
}
```

---

## Testing Guide

### 1. Test Registration & Verification

```bash
# Register new user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "9876543210",
    "password": "TestPass123!"
  }'

# Check email for verification link
# Click link or use token:

# Verify email
curl -X POST http://localhost:3000/api/auth/verify-email \
  -H "Content-Type: application/json" \
  -d '{
    "token": "your-verification-token"
  }'
```

### 2. Test Password Reset

```bash
# Request password reset
curl -X POST http://localhost:3000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com"
  }'

# Check email for reset link
# Use token to reset:

# Reset password
curl -X POST http://localhost:3000/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "token": "your-reset-token",
    "password": "NewPass123!"
  }'
```

### 3. Test Session Refresh

```bash
# Get session status
curl -X GET http://localhost:3000/api/auth/refresh \
  -H "Cookie: next-auth.session-token=your-session-token"

# Refresh session
curl -X POST http://localhost:3000/api/auth/refresh \
  -H "Cookie: next-auth.session-token=your-session-token"
```

### 4. Test Logout

```bash
# Logout
curl -X POST http://localhost:3000/api/auth/logout \
  -H "Cookie: next-auth.session-token=your-session-token"
```

---

## Security Features

### 1. Token Security

- **Verification Token:** 32 bytes, hex-encoded, 24-hour expiration
- **Reset Token:** 32 bytes, hex-encoded, 1-hour expiration
- **JWT Secret:** Configured in `NEXTAUTH_SECRET` environment variable

### 2. Password Security

- **Hashing:** bcrypt with 12 salt rounds
- **Minimum Length:** 8 characters
- **Validation:** Enforced via Zod schema

### 3. Account Security

- **Email Verification:** Required after registration
- **Account Lockout:** 5 failed login attempts (implemented in auth.ts)
- **Session Expiry:** 7 days
- **Token Expiration:** Automatic cleanup after use

### 4. API Security

- **Rate Limiting:** Can be added with Upstash Redis (configured in .env)
- **Input Validation:** Zod schemas on all endpoints
- **Error Messages:** Generic messages to prevent user enumeration
- **HTTPS Only:** Configure in production

---

## Database Schema Updates

### User Model Fields Added

```prisma
model User {
  // Email Verification
  email_verified Boolean   @default(false)
  verification_token String?  @unique
  verification_token_expires DateTime?

  // Password Reset
  reset_token String?  @unique
  reset_token_expires DateTime?
}
```

### Migration Applied

```bash
npx prisma db push --accept-data-loss
```

---

## Email Templates

All email templates are in `src/lib/email.ts`:

1. **emailVerification** - Email verification with button
2. **passwordReset** - Password reset with security warning
3. **passwordResetSuccess** - Confirmation after password change
4. **welcomeEmail** - Welcome message after registration

### Customize Email Templates

Edit `src/lib/email.ts` to customize:
- Colors and branding
- Email content
- Button styles
- Footer information

---

## Environment Variables Required

```env
# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# Email Service (Gmail)
EMAIL_USER="your-email@gmail.com"
EMAIL_PASSWORD="your-app-password"
EMAIL_FROM="noreply@plotzedrealestate.com"
ADMIN_EMAIL="admin@plotzedrealestate.com"

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/plotzed"
```

---

## Frontend Integration

### Login Example

```typescript
import { signIn } from 'next-auth/react'

const handleLogin = async (email: string, password: string) => {
  const result = await signIn('credentials', {
    redirect: false,
    email,
    password,
  })

  if (result?.error) {
    console.error('Login failed:', result.error)
  } else {
    // Redirect to dashboard
    window.location.href = '/dashboard'
  }
}
```

### Logout Example

```typescript
const handleLogout = async () => {
  const response = await fetch('/api/auth/logout', {
    method: 'POST',
  })

  if (response.ok) {
    window.location.href = '/login'
  }
}
```

### Check Authentication

```typescript
import { useSession } from 'next-auth/react'

export default function ProtectedPage() {
  const { data: session, status } = useSession()

  if (status === 'loading') return <div>Loading...</div>
  if (status === 'unauthenticated') return <div>Access Denied</div>

  return <div>Welcome, {session?.user?.name}!</div>
}
```

---

## API Routes Summary

| Endpoint | Method | Purpose | Auth Required |
|----------|--------|---------|---------------|
| `/api/auth/register` | POST | Register new user | No |
| `/api/auth/login` | POST | Login user (explicit endpoint) | No |
| `/api/auth/signin` | POST | Login user (NextAuth) | No |
| `/api/auth/logout` | POST/GET | Logout user | Yes |
| `/api/auth/refresh` | POST/GET | Refresh/check session | Yes |
| `/api/auth/verify-email` | POST/GET | Verify email | No |
| `/api/auth/send-verification` | POST | Resend verification | No |
| `/api/auth/forgot-password` | POST | Request password reset | No |
| `/api/auth/reset-password` | POST | Reset password | No |

---

## Troubleshooting

### Email Not Sending

1. Check Gmail App Password is correct
2. Verify EMAIL_USER and EMAIL_PASSWORD in .env
3. Check console logs for email errors
4. Ensure "Less secure app access" is enabled (or use App Password)

### Token Expired Errors

1. Verification token: Valid for 24 hours
2. Reset token: Valid for 1 hour
3. Use "resend" endpoints to get new tokens

### Session Issues

1. Check NEXTAUTH_SECRET is set
2. Verify cookies are enabled in browser
3. Check session expiration (7 days)
4. Use refresh endpoint to extend session

### Database Errors

1. Run `npx prisma generate` after schema changes
2. Run `npx prisma db push` to sync database
3. Check DATABASE_URL is correct

---

## Next Steps

### Recommended Enhancements

1. **Two-Factor Authentication (2FA)**
   - Use existing OTP fields in User model
   - Add TOTP with `speakeasy` library

2. **OAuth Providers**
   - Add Google/Facebook login
   - Configure in NextAuth providers

3. **Rate Limiting**
   - Implement with Upstash Redis
   - Protect auth endpoints

4. **Audit Logging**
   - Log auth events to ActivityLog table
   - Track login attempts, password changes

5. **Email Templates UI**
   - Create branded templates
   - Add company logo

---

## Support

For issues or questions:
- Check logs in console
- Review API responses
- Test with provided curl examples
- Verify environment variables

---

**Last Updated:** January 2025
**Version:** 1.0.0
