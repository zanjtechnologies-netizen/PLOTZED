# API Key Security Guide

## Overview

This guide explains how to configure and manage API key authentication for the Plotzed Real Estate application. API keys provide an additional security layer for your API endpoints, allowing you to control and monitor access to your backend services.

---

## Table of Contents

1. [Understanding API Key Authentication](#understanding-api-key-authentication)
2. [Environment Configuration](#environment-configuration)
3. [Generating Secure API Keys](#generating-secure-api-keys)
4. [Production Setup](#production-setup)
5. [Using API Keys in Requests](#using-api-keys-in-requests)
6. [Protected vs Unprotected Endpoints](#protected-vs-unprotected-endpoints)
7. [Best Practices](#best-practices)
8. [Key Rotation Strategy](#key-rotation-strategy)
9. [Monitoring and Security](#monitoring-and-security)
10. [Troubleshooting](#troubleshooting)

---

## Understanding API Key Authentication

### What is API Key Authentication?

API key authentication is a simple yet effective method to control access to your API endpoints. When enabled, clients must include a valid API key in the request header to access protected endpoints.

### How It Works

1. You generate secure API keys and configure them in your environment
2. The middleware (`src/middleware.ts`) validates the API key on each request
3. Valid requests proceed; invalid requests receive a 401 Unauthorized error
4. Authentication endpoints (`/api/auth/*`) are exempt from this check

### When to Use API Keys

**✅ Enable API Keys When:**
- You have external API consumers (mobile apps, third-party integrations)
- You need to track and limit specific clients
- You want an extra security layer beyond user authentication
- You have a public API with usage quotas
- You're running in production with sensitive data

**❌ Disable API Keys When:**
- You're in local development (for convenience)
- You have a frontend-only application with no external consumers
- All requests come from authenticated users only
- You're using alternative authentication methods exclusively

---

## Environment Configuration

### Required Environment Variables

Set these variables in your environment (`.env.local` for development, platform settings for production):

```bash
# Enable or disable API key validation
REQUIRE_API_KEY=true

# Comma-separated list of valid API keys
API_KEYS=key1,key2,key3
```

### Configuration File

The security configuration is managed in `src/lib/security-config.ts`:

```typescript
apiKeys: {
  enabled: process.env.REQUIRE_API_KEY === 'true',
  headerName: 'X-API-Key',
  keys: process.env.API_KEYS?.split(',') || [],
}
```

### Development vs Production

**Local Development (.env.local):**
```bash
REQUIRE_API_KEY=false
API_KEYS=dev-key-1,dev-key-2
```

**Production (Platform Environment Variables):**
```bash
REQUIRE_API_KEY=true
API_KEYS=prod_abc123...,prod_xyz789...
```

---

## Generating Secure API Keys

### Security Requirements

**Minimum Standards:**
- At least 32 characters long
- Mix of uppercase, lowercase, numbers, and special characters
- Cryptographically random (not sequential or predictable)
- Unique for each client/service

### Generation Methods

#### Method 1: Node.js Crypto (Recommended)

```javascript
// In Node.js console or script
const crypto = require('crypto');
console.log(crypto.randomBytes(32).toString('hex'));
```

**Output Example:**
```
a7f3c9e1b2d4f6a8c9e1b2d4f6a8c9e1b2d4f6a8c9e1b2d4f6a8c9e1b2d4f6a8
```

#### Method 2: OpenSSL (CLI)

```bash
openssl rand -hex 32
```

#### Method 3: Base64 Encoding

```javascript
const crypto = require('crypto');
console.log(crypto.randomBytes(32).toString('base64'));
```

**Output Example:**
```
p/z8xKvN+qR5wT3Lb9Yc1EfGhJiMnOpQrStUvWxYz==
```

#### Method 4: UUID-based (Less secure, but readable)

```javascript
const crypto = require('crypto');
console.log(`api_${crypto.randomUUID().replace(/-/g, '')}`);
```

**Output Example:**
```
api_a7f3c9e1b2d4f6a8c9e1b2d4f6a8c9e1
```

### Naming Convention (Optional)

Use prefixes to identify key purpose and environment:

```
prod_client_mobile_a7f3c9e1b2d4f6a8c9e1b2d4f6a8c9e1
prod_client_web_b8g4d0f2c3e5g7b9d0f2c3e5g7b9d0f2
staging_integration_test_c9h5e1g3d4f6h8c0e1g3d4f6h8c0e1g3
```

---

## Production Setup

### Vercel Deployment

1. **Navigate to Project Settings**
   - Go to [Vercel Dashboard](https://vercel.com)
   - Select your project
   - Click "Settings" → "Environment Variables"

2. **Add Environment Variables**

   **Variable 1:**
   - Key: `REQUIRE_API_KEY`
   - Value: `true`
   - Environment: Production (or All)

   **Variable 2:**
   - Key: `API_KEYS`
   - Value: `abc123...,xyz789...,def456...` (your generated keys)
   - Environment: Production (or All)

3. **Redeploy**
   - Go to "Deployments" tab
   - Click "Redeploy" on the latest deployment
   - Or push a new commit to trigger deployment

### AWS Elastic Beanstalk

```bash
# Using EB CLI
eb setenv REQUIRE_API_KEY=true
eb setenv API_KEYS="key1,key2,key3"

# Or via AWS Console
# Configuration → Software → Environment Properties
```

### Railway

```bash
# Using Railway CLI
railway variables set REQUIRE_API_KEY=true
railway variables set API_KEYS="key1,key2,key3"

# Or via Railway Dashboard
# Project → Variables → Add Variable
```

### Render

```bash
# Via Render Dashboard
# Environment → Environment Variables
# Add: REQUIRE_API_KEY = true
# Add: API_KEYS = key1,key2,key3
```

### Docker / Docker Compose

```yaml
# docker-compose.yml
version: '3.8'
services:
  app:
    environment:
      - REQUIRE_API_KEY=true
      - API_KEYS=key1,key2,key3
    # Or use env_file:
    env_file:
      - .env.production
```

### Kubernetes

```yaml
# secret.yaml
apiVersion: v1
kind: Secret
metadata:
  name: api-secrets
type: Opaque
stringData:
  REQUIRE_API_KEY: "true"
  API_KEYS: "key1,key2,key3"
```

---

## Using API Keys in Requests

### HTTP Header Format

All protected API requests must include the API key in the header:

```
X-API-Key: your-api-key-here
```

### Example Requests

#### cURL

```bash
curl -X GET https://plotzedrealestate.com/api/plots \
  -H "X-API-Key: a7f3c9e1b2d4f6a8c9e1b2d4f6a8c9e1"
```

#### JavaScript (Fetch API)

```javascript
fetch('https://plotzedrealestate.com/api/plots', {
  method: 'GET',
  headers: {
    'X-API-Key': 'a7f3c9e1b2d4f6a8c9e1b2d4f6a8c9e1',
    'Content-Type': 'application/json'
  }
})
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
```

#### JavaScript (Axios)

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://plotzedrealestate.com/api',
  headers: {
    'X-API-Key': 'a7f3c9e1b2d4f6a8c9e1b2d4f6a8c9e1'
  }
});

// Make requests
api.get('/plots')
  .then(response => console.log(response.data))
  .catch(error => console.error('Error:', error));
```

#### React (with Context)

```javascript
// api-config.js
export const API_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'X-API-Key': process.env.NEXT_PUBLIC_API_KEY
  }
};

// Component
import { API_CONFIG } from './api-config';

const fetchPlots = async () => {
  const response = await fetch(`${API_CONFIG.baseURL}/plots`, {
    headers: API_CONFIG.headers
  });
  return response.json();
};
```

#### Python (Requests)

```python
import requests

headers = {
    'X-API-Key': 'a7f3c9e1b2d4f6a8c9e1b2d4f6a8c9e1'
}

response = requests.get(
    'https://plotzedrealestate.com/api/plots',
    headers=headers
)

print(response.json())
```

#### Mobile (React Native)

```javascript
const API_KEY = 'a7f3c9e1b2d4f6a8c9e1b2d4f6a8c9e1';

fetch('https://plotzedrealestate.com/api/plots', {
  method: 'GET',
  headers: {
    'X-API-Key': API_KEY,
    'Content-Type': 'application/json',
  }
})
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
```

### Error Response (Invalid/Missing Key)

```json
{
  "success": false,
  "error": "Invalid or missing API key",
  "code": "INVALID_API_KEY"
}
```

**HTTP Status:** `401 Unauthorized`

---

## Protected vs Unprotected Endpoints

### Protected Endpoints (Require API Key)

When `REQUIRE_API_KEY=true`, these endpoints require a valid API key:

- ✅ `/api/plots` - Plot listings
- ✅ `/api/plots/[id]` - Single plot details
- ✅ `/api/plots/search` - Search plots
- ✅ `/api/plots/featured` - Featured plots
- ✅ `/api/bookings` - Booking management
- ✅ `/api/bookings/[id]` - Single booking
- ✅ `/api/inquiries` - Inquiry submission
- ✅ `/api/users` - User management (admin)
- ✅ `/api/admin/*` - All admin endpoints
- ✅ `/api/payments/*` - Payment operations
- ✅ `/api/health` - Health check endpoint
- ✅ `/api/cron/*` - Cron job endpoints

### Unprotected Endpoints (No API Key Required)

These authentication endpoints are always accessible without API keys:

- ❌ `/api/auth/login` - User login
- ❌ `/api/auth/register` - User registration
- ❌ `/api/auth/logout` - User logout
- ❌ `/api/auth/forgot-password` - Password reset request
- ❌ `/api/auth/reset-password` - Password reset
- ❌ `/api/auth/verify-email` - Email verification
- ❌ `/api/auth/send-verification` - Resend verification
- ❌ `/api/auth/refresh` - Token refresh
- ❌ `/api/auth/[...nextauth]` - NextAuth endpoints

### Middleware Logic

The logic is defined in `src/middleware.ts`:

```typescript
// API key validation (lines 122-134)
if (securityConfig.apiKeys.enabled && !pathname.startsWith('/api/auth')) {
  if (!validateApiKey(request)) {
    return NextResponse.json(
      {
        success: false,
        error: 'Invalid or missing API key',
        code: 'INVALID_API_KEY',
      },
      { status: 401 }
    )
  }
}
```

---

## Best Practices

### 1. Key Generation

- ✅ Use cryptographically secure random generation
- ✅ Minimum 32 characters (64+ recommended)
- ✅ Include multiple character types
- ❌ Don't use predictable patterns
- ❌ Don't use dictionary words or common phrases
- ❌ Don't reuse keys across environments

### 2. Key Storage

**✅ DO:**
- Store in environment variables
- Use secure secrets managers (AWS Secrets Manager, HashiCorp Vault)
- Keep production keys separate from development keys
- Document key assignments (which client has which key)

**❌ DON'T:**
- Commit keys to version control (Git)
- Share keys in plain text emails
- Store in frontend code or client-side storage
- Hardcode keys in source files

### 3. Key Distribution

**Secure Methods:**
- Password-protected encrypted files
- Secure password managers (1Password, LastPass)
- Encrypted messaging (Signal, ProtonMail)
- Secure file sharing (Tresorit, SpiderOak)

**Insecure Methods to Avoid:**
- Plain text email
- Slack/Discord messages
- SMS
- Unencrypted cloud storage

### 4. Key Management

**Create a Key Registry:**

| Key ID | Client/Service | Environment | Created | Last Rotated | Status |
|--------|---------------|-------------|---------|--------------|--------|
| key-001 | Mobile App | Production | 2025-01-15 | 2025-01-15 | Active |
| key-002 | Web Frontend | Production | 2025-01-15 | 2025-01-15 | Active |
| key-003 | Integration Partner | Production | 2025-02-01 | 2025-02-01 | Active |
| key-004 | Legacy System | Production | 2024-06-01 | 2024-06-01 | Revoked |

### 5. Access Control

**Principle of Least Privilege:**
- Issue separate keys for different clients/services
- Revoke keys when they're no longer needed
- Set expiration dates for temporary access
- Monitor usage per key

### 6. Environment Separation

**Never mix environments:**

```bash
# Development
REQUIRE_API_KEY=false
API_KEYS=dev_test_key_123

# Staging
REQUIRE_API_KEY=true
API_KEYS=staging_key_abc,staging_key_xyz

# Production
REQUIRE_API_KEY=true
API_KEYS=prod_key_secure123,prod_key_secure456
```

### 7. Security Layers

API keys should be **one layer** of defense, not the only one:

- ✅ HTTPS/TLS encryption (always)
- ✅ Rate limiting (already implemented)
- ✅ CORS policies (already configured)
- ✅ User authentication (NextAuth)
- ✅ Input validation (Zod schemas)
- ✅ Error monitoring (Sentry)

---

## Key Rotation Strategy

### When to Rotate Keys

**Regular Rotation:**
- Every 3-6 months for active keys
- Annually for low-use keys

**Immediate Rotation:**
- ⚠️ Suspected compromise or exposure
- ⚠️ Employee/contractor offboarding
- ⚠️ Security audit findings
- ⚠️ Client contract termination
- ⚠️ Accidental public exposure (GitHub, logs)

### Rotation Process

#### Step 1: Generate New Keys

```bash
# Generate replacement keys
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

#### Step 2: Add New Keys Alongside Old

```bash
# Update environment with both old and new keys
API_KEYS=old-key-1,old-key-2,new-key-1,new-key-2
```

#### Step 3: Notify Clients

**Email Template:**

```
Subject: API Key Rotation - Action Required

Dear [Client],

We are rotating API keys as part of our security maintenance.

OLD KEY (will be revoked on [DATE]): old-key-1
NEW KEY (please update by [DATE]): new-key-1

Grace Period: [X] weeks

Action Required:
1. Update your application/service with the new key
2. Test in your staging environment
3. Deploy to production before [DATE]

Support: support@plotzedrealestate.com
```

#### Step 4: Monitor Transition

**Track which keys are being used:**
- Add logging to middleware to track key usage
- Monitor for old key usage patterns
- Contact clients still using old keys

#### Step 5: Grace Period

**Recommended grace periods:**
- Internal services: 1-2 weeks
- External partners: 2-4 weeks
- Critical integrations: 4-8 weeks

#### Step 6: Revoke Old Keys

```bash
# After grace period, remove old keys
API_KEYS=new-key-1,new-key-2
```

#### Step 7: Verify and Document

- Confirm no errors from removed keys
- Update key registry
- Archive old keys securely (for audit trail)

### Emergency Rotation (Compromised Key)

**Immediate Actions:**

1. **Identify Scope** (5 minutes)
   - Which key was compromised?
   - What services use this key?
   - What data could be accessed?

2. **Generate Replacement** (2 minutes)
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

3. **Update Environment** (5 minutes)
   - Remove compromised key from `API_KEYS`
   - Add new key
   - Redeploy immediately

4. **Notify Stakeholders** (10 minutes)
   - Internal teams
   - Affected clients
   - Security team

5. **Investigate** (ongoing)
   - How was key exposed?
   - Was it used by unauthorized parties?
   - What data was accessed?
   - Review logs and access patterns

6. **Post-Incident** (24-48 hours)
   - Document incident
   - Update security procedures
   - Consider additional safeguards

---

## Monitoring and Security

### 1. Logging Key Usage

**Add to middleware (optional enhancement):**

```typescript
// Log API key usage
if (apiKey) {
  structuredLogger.info('API key used', {
    key: apiKey.substring(0, 8) + '***', // Only log first 8 chars
    path: pathname,
    method: request.method,
    ip: request.ip,
  });
}
```

### 2. Failed Authentication Monitoring

**Set up alerts for:**
- Multiple failed API key attempts from same IP
- Sudden spike in 401 errors
- API key usage from unexpected locations
- Unusual request patterns

### 3. Usage Analytics

**Track metrics:**
- Requests per API key
- Success vs failure rates per key
- Geographic distribution of requests
- Endpoint usage patterns per key

### 4. Security Audits

**Regular reviews:**
- Monthly: Review active keys and usage
- Quarterly: Rotate keys used by high-value clients
- Annually: Complete security audit of API access

### 5. Rate Limiting (Already Implemented)

Your application already has rate limiting configured per endpoint type:

```typescript
// From src/lib/rate-limit-redis.ts
const rateLimits = {
  default: { limit: 100, window: 60 },  // 100 req/min
  login: { limit: 5, window: 60 },      // 5 req/min
  register: { limit: 3, window: 60 },   // 3 req/min
  payment: { limit: 10, window: 60 },   // 10 req/min
  upload: { limit: 5, window: 60 }      // 5 req/min
};
```

### 6. Additional Security Headers

Already configured in `src/middleware.ts`:

- `X-Request-ID` - Request tracking
- `Strict-Transport-Security` - Force HTTPS
- `X-Content-Type-Options` - Prevent MIME sniffing
- `X-Frame-Options` - Clickjacking protection
- `X-XSS-Protection` - XSS prevention

---

## Troubleshooting

### Error: "Invalid or missing API key"

**Symptom:**
```json
{
  "success": false,
  "error": "Invalid or missing API key",
  "code": "INVALID_API_KEY"
}
```

**Possible Causes:**

1. **Missing header**
   - Check: Header name is exactly `X-API-Key` (case-sensitive)
   - Fix: Add header to request

2. **Wrong API key**
   - Check: Key matches one in `API_KEYS` environment variable
   - Fix: Use correct key or regenerate

3. **Whitespace in key**
   - Check: No extra spaces before/after key
   - Fix: Trim whitespace from key value

4. **Environment variable not loaded**
   - Check: Server restarted after env changes
   - Fix: Restart application

5. **Key not in production environment**
   - Check: API_KEYS set in production platform
   - Fix: Add to production environment variables

### Testing API Key Configuration

#### Test 1: Verify Environment Variable

```bash
# SSH into server or check platform logs
echo $REQUIRE_API_KEY
echo $API_KEYS
```

#### Test 2: Test with Valid Key

```bash
curl -X GET https://yourdomain.com/api/health \
  -H "X-API-Key: your-valid-key"

# Expected: 200 OK with health data
```

#### Test 3: Test without Key

```bash
curl -X GET https://yourdomain.com/api/health

# Expected: 401 Unauthorized
```

#### Test 4: Test with Invalid Key

```bash
curl -X GET https://yourdomain.com/api/health \
  -H "X-API-Key: invalid-key"

# Expected: 401 Unauthorized
```

### Common Configuration Mistakes

**❌ Mistake 1: Comma in API key itself**
```bash
# WRONG - comma inside the key
API_KEYS=abc,def,ghi123
# This creates 3 keys: "abc", "def", "ghi123"
```

**✅ Solution:**
```bash
# Use keys without commas
API_KEYS=abcdefghi123,xyz789uvw456
```

**❌ Mistake 2: Quotes in environment variable**
```bash
# WRONG - quotes included in key
API_KEYS="key1,key2"
# Actual keys become: "\"key1", "key2\""
```

**✅ Solution:**
```bash
# No quotes needed
API_KEYS=key1,key2
```

**❌ Mistake 3: Missing restart**
```bash
# Changed .env.local but didn't restart
```

**✅ Solution:**
```bash
# Always restart dev server
npm run dev
```

### Debugging Checklist

- [ ] `REQUIRE_API_KEY` is set to `true` in production
- [ ] `API_KEYS` environment variable contains valid keys
- [ ] Keys are comma-separated with no extra spaces
- [ ] Application was redeployed after env changes
- [ ] Request includes `X-API-Key` header (exact spelling)
- [ ] Key value matches one in `API_KEYS`
- [ ] No extra whitespace in header value
- [ ] Endpoint is not `/api/auth/*` (those are exempt)
- [ ] HTTPS is being used (not HTTP)

---

## Additional Resources

### Related Documentation

- [Environment Variables Guide](./ENVIRONMENT_VARIABLES.md)
- [Security Configuration](./src/lib/security-config.ts)
- [Middleware Implementation](./src/middleware.ts)
- [Error Monitoring Guide](./ERROR_MONITORING_GUIDE.md)

### Security Best Practices

- [OWASP API Security Top 10](https://owasp.org/www-project-api-security/)
- [NIST Password Guidelines](https://pages.nist.gov/800-63-3/)
- [OAuth 2.0 Best Practices](https://datatracker.ietf.org/doc/html/draft-ietf-oauth-security-topics)

### Tools

**Key Generation:**
- [Random.org](https://www.random.org/strings/) - Random string generator
- [Password Generator](https://passwordsgenerator.net/) - Secure password/key generator

**Secrets Management:**
- [AWS Secrets Manager](https://aws.amazon.com/secrets-manager/)
- [HashiCorp Vault](https://www.vaultproject.io/)
- [Azure Key Vault](https://azure.microsoft.com/en-us/services/key-vault/)
- [Google Secret Manager](https://cloud.google.com/secret-manager)

---

## Support

For questions or issues related to API key configuration:

1. Check this documentation first
2. Review middleware code: `src/middleware.ts`
3. Check security config: `src/lib/security-config.ts`
4. Contact: support@plotzedrealestate.com

---

**Last Updated:** 2025-01-09
**Version:** 1.0
**Maintained by:** Development Team
