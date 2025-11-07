# Login Endpoint Guide

## Why a Dedicated Login Endpoint?

While NextAuth v5 provides authentication through `/api/auth/[...nextauth]`, having an explicit `/api/auth/login` endpoint offers several benefits:

1. **Better API Clarity** - Clear, RESTful endpoint for API consumers
2. **Direct Response** - Returns user data immediately after login
3. **Custom Logic** - Easier to add custom business logic
4. **Better Error Messages** - More detailed error responses
5. **API-First Design** - Works better with mobile apps and external clients

---

## Endpoint: POST /api/auth/login

### Request

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123!"
  }'
```

### Success Response (200 OK)

```json
{
  "message": "Login successful",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "john@example.com",
    "name": "John Doe",
    "phone": "9876543210",
    "role": "CUSTOMER",
    "email_verified": true,
    "kyc_verified": false,
    "last_login": "2025-01-15T10:30:00.000Z"
  },
  "success": true
}
```

### Error Responses

#### Invalid Credentials (401)
```json
{
  "error": "Invalid email or password"
}
```

#### Account Lockout (429)
```json
{
  "error": "Account temporarily locked due to multiple failed login attempts. Try again in 14 minutes and 30 seconds."
}
```

#### Validation Error (400)
```json
{
  "error": "Validation failed",
  "details": [
    {
      "code": "invalid_string",
      "message": "Invalid email address",
      "path": ["email"]
    }
  ]
}
```

---

## Security Features

### 1. Account Lockout
- **Max Attempts:** 5 failed attempts
- **Lockout Duration:** 30 minutes
- **Countdown Display:** Shows remaining lockout time
- **Per Email:** Lockout is per email address (stored in Redis/memory)

### 2. Password Security
- **Hashing:** bcrypt with 12 salt rounds
- **No Plaintext:** Password never stored in plaintext
- **Validation:** Minimum 8 characters enforced

### 3. Attempt Tracking
```typescript
// After failed login
const attempts = 4 // Example
const remaining = 5 - 4 = 1

Response: "Invalid email or password. 1 attempt remaining."
```

### 4. Last Login Tracking
- Updates `last_login` timestamp on successful login
- Useful for security monitoring and user activity tracking

---

## Optional Features (Currently Disabled)

### Email Verification Requirement

You can enforce email verification before allowing login by uncommenting this code in [src/app/api/auth/login/route.ts](src/app/api/auth/login/route.ts:92-97):

```typescript
// Check if email is verified (optional enforcement)
if (!user.email_verified) {
  return NextResponse.json(
    { error: 'Please verify your email address before logging in' },
    { status: 403 }
  )
}
```

**Why it's disabled by default:**
- Allows users to log in immediately after registration
- Better UX for testing and development
- Email verification can be prompted after login

**When to enable:**
- Production environment
- High-security applications
- When email verification is critical

---

## Integration Examples

### Frontend (React/Next.js)

```typescript
async function login(email: string, password: string) {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Important: Include cookies
      body: JSON.stringify({ email, password }),
    })

    const data = await response.json()

    if (response.ok) {
      // Login successful
      console.log('Logged in as:', data.user.name)

      // Store user data in state/context
      setUser(data.user)

      // Redirect to dashboard
      router.push('/dashboard')
    } else {
      // Handle error
      setError(data.error)

      // Show error message
      toast.error(data.error)
    }
  } catch (error) {
    console.error('Login failed:', error)
    setError('Network error. Please try again.')
  }
}
```

### With React Hook Form

```typescript
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

type LoginFormData = z.infer<typeof loginSchema>

function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    })

    const result = await response.json()

    if (response.ok) {
      // Success
      window.location.href = '/dashboard'
    } else {
      // Error
      alert(result.error)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        type="email"
        {...register('email')}
        placeholder="Email"
      />
      {errors.email && <span>{errors.email.message}</span>}

      <input
        type="password"
        {...register('password')}
        placeholder="Password"
      />
      {errors.password && <span>{errors.password.message}</span>}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Logging in...' : 'Login'}
      </button>
    </form>
  )
}
```

### Mobile App (React Native / Flutter)

```typescript
// React Native / Expo
async function login(email: string, password: string) {
  try {
    const response = await fetch('https://api.plotzed.com/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })

    const data = await response.json()

    if (response.ok) {
      // Store user data in AsyncStorage
      await AsyncStorage.setItem('user', JSON.stringify(data.user))

      // Store session token (from Set-Cookie header)
      // Navigate to home screen
      navigation.navigate('Home')
    } else {
      Alert.alert('Login Failed', data.error)
    }
  } catch (error) {
    Alert.alert('Error', 'Network error. Please try again.')
  }
}
```

---

## Comparison: `/api/auth/login` vs `/api/auth/signin`

| Feature | `/api/auth/login` | `/api/auth/signin` (NextAuth) |
|---------|------------------|------------------------------|
| **Usage** | Direct API calls | NextAuth client (useSession) |
| **Response** | User data + success | Redirect or callback |
| **Error Handling** | Detailed JSON errors | Generic error codes |
| **Customization** | Full control | Limited to NextAuth config |
| **Best For** | Mobile apps, external APIs | Web apps using NextAuth |
| **Session Creation** | Yes (via NextAuth) | Yes (native) |
| **Account Lockout** | Yes (explicit) | Yes (in authorize callback) |

### When to Use Each:

**Use `/api/auth/login`:**
- Mobile applications
- External API integrations
- Need detailed user data in response
- Want explicit error messages
- Building a REST API

**Use `/api/auth/signin` (NextAuth):**
- Web applications using NextAuth client
- Using `useSession()` hook
- Want NextAuth's built-in features
- OAuth providers integration

**Both work together!** They use the same authentication logic and session system.

---

## Testing

### Test Successful Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123!"
  }'
```

### Test Invalid Password
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "wrongpassword"
  }'
```

### Test Invalid Email Format
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "not-an-email",
    "password": "TestPass123!"
  }'
```

### Test Account Lockout
Run this 6 times to trigger lockout:
```bash
for i in {1..6}; do
  curl -X POST http://localhost:3000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email": "test@example.com", "password": "wrong"}'
  echo "\nAttempt $i"
done
```

---

## Monitoring & Logging

The login endpoint logs the following:

1. **Failed Login Attempts** - Tracked in Redis/memory
2. **Account Lockouts** - Logged to console
3. **Successful Logins** - Updates `last_login` in database
4. **Login Errors** - Logged with full error details

### Example Log Output:
```
✅ Login successful: john@example.com
❌ Failed login attempt for: test@example.com (3 attempts remaining)
🔒 Account locked: test@example.com (30 minutes)
```

---

## Security Best Practices

1. **Always use HTTPS** in production
2. **Enable CSRF protection** (built-in with NextAuth)
3. **Rate limit the endpoint** (use Upstash Redis)
4. **Monitor failed attempts** (track patterns)
5. **Enable email verification** in production
6. **Use strong password policy** (enforce in registration)
7. **Implement 2FA** (optional enhancement)

---

## Troubleshooting

### Issue: Session not persisting
**Solution:** Make sure cookies are enabled and credentials: 'include' is set

### Issue: CORS errors
**Solution:** Configure CORS in Next.js or ensure same-origin requests

### Issue: Account locked unexpectedly
**Solution:** Check Redis/memory store for failed attempt counters

### Issue: Password always fails
**Solution:** Verify bcrypt is working correctly and password was hashed during registration

---

**Created:** 2025-11-04
**Status:** ✅ Production Ready
