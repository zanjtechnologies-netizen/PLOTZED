# Plotzed API Documentation

## 📋 Overview

Complete REST API for Plotzed Real Estate Platform built with Next.js 16, Prisma, PostgreSQL, and NextAuth v5.

**Base URL:** `http://localhost:3000/api` (development)

**Authentication:** JWT tokens via NextAuth v5 (HTTP-only cookies)

---

## 🔐 Authentication

### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "password": "SecureP@ss123",
  "confirmPassword": "SecureP@ss123"
}
```

**Response (201):**
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### Login
```http
POST /api/auth/callback/credentials
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecureP@ss123"
}
```

---

## 🏘️ Properties/Plots

### List All Plots (with filters & pagination)
```http
GET /api/plots?page=1&limit=10&city=Bangalore&minPrice=5000000&maxPrice=10000000&status=AVAILABLE&featured=true&search=villa&sortBy=price&sortOrder=asc
```

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 10)
- `city` - Filter by city
- `state` - Filter by state
- `status` - AVAILABLE | BOOKED | SOLD
- `minPrice` - Minimum price
- `maxPrice` - Maximum price
- `minSize` - Minimum plot size (sq ft)
- `maxSize` - Maximum plot size (sq ft)
- `featured` - true | false
- `published` - true | false (default: true)
- `search` - Search in title, description, address
- `sortBy` - Field to sort by (default: created_at)
- `sortOrder` - asc | desc (default: desc)

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Premium Villa Plot",
      "slug": "premium-villa-plot",
      "description": "...",
      "price": 8500000,
      "booking_amount": 850000,
      "plot_size": 2400,
      "dimensions": "40x60 ft",
      "facing": "East",
      "address": "...",
      "city": "Bangalore",
      "state": "Karnataka",
      "pincode": "560001",
      "latitude": 12.9716,
      "longitude": 77.5946,
      "images": ["url1", "url2"],
      "amenities": ["Water", "Electricity"],
      "status": "AVAILABLE",
      "is_featured": true,
      "is_published": true,
      "created_at": "2025-01-01T00:00:00Z",
      "_count": { "bookings": 5 }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10,
    "hasMore": true
  }
}
```

### Advanced Search
```http
POST /api/plots/search
Content-Type: application/json

{
  "search": "villa",
  "city": "Bangalore",
  "minPrice": 5000000,
  "maxPrice": 15000000,
  "minSize": 2000,
  "amenities": ["Water", "Electricity"],
  "facing": ["East", "North"],
  "latitude": 12.9716,
  "longitude": 77.5946,
  "radiusKm": 10,
  "page": 1,
  "limit": 10
}
```

**Response (200):** Same as list plots, with additional `distance` field if geolocation search used.

### Get Featured Plots
```http
GET /api/plots/featured?limit=6&city=Bangalore
```

### Get Single Plot
```http
GET /api/plots/{id}
```

### Create Plot (Admin Only)
```http
POST /api/plots
Content-Type: application/json
Authorization: Required

{
  "title": "Premium Villa Plot",
  "description": "...",
  "price": 8500000,
  "bookingAmount": 850000,
  "plotSize": 2400,
  "dimensions": "40x60 ft",
  "facing": "East",
  "address": "...",
  "city": "Bangalore",
  "state": "Karnataka",
  "pincode": "560001",
  "latitude": 12.9716,
  "longitude": 77.5946,
  "reraNumber": "RERA123",
  "amenities": ["Water", "Electricity"],
  "isFeatured": true
}
```

### Update Plot (Admin Only)
```http
PUT /api/plots/{id}
Content-Type: application/json
Authorization: Required
```

### Delete Plot (Admin Only)
```http
DELETE /api/plots/{id}
Authorization: Required
```

---

## 📝 Inquiries/Leads

### Create Inquiry
```http
POST /api/inquiries
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "message": "Interested in plot XYZ",
  "plotId": "uuid-optional",
  "recaptchaToken": "token"
}
```

### Get All Inquiries (Admin Only)
```http
GET /api/inquiries?page=1&limit=20&status=NEW
Authorization: Required
```

**Query Parameters:**
- `page`, `limit`
- `status` - NEW | CONTACTED | QUALIFIED | CONVERTED | CLOSED

### Get Single Inquiry (Admin Only)
```http
GET /api/inquiries/{id}
Authorization: Required
```

### Update Inquiry (Admin Only)
```http
PATCH /api/inquiries/{id}
Content-Type: application/json
Authorization: Required

{
  "status": "CONTACTED",
  "notes": "Called customer, interested in site visit"
}
```

### Delete Inquiry (Admin Only)
```http
DELETE /api/inquiries/{id}
Authorization: Required
```

---

## 📅 Bookings

### Create Booking
```http
POST /api/bookings
Content-Type: application/json
Authorization: Required

{
  "plotId": "uuid",
  "bookingAmount": 850000,
  "totalAmount": 8500000,
  "paymentPlan": {
    "installments": []
  }
}
```

### Get User's Bookings
```http
GET /api/bookings?status=CONFIRMED
Authorization: Required
```

### Get Single Booking
```http
GET /api/bookings/{id}
Authorization: Required
```

### Update Booking Status (Admin Only)
```http
PATCH /api/bookings/{id}
Content-Type: application/json
Authorization: Required

{
  "status": "CONFIRMED"
}
```

### Cancel Booking
```http
POST /api/bookings/{id}/cancel
Content-Type: application/json
Authorization: Required

{
  "reason": "Changed my mind"
}
```

---

## 🗓️ Site Visits

### Schedule Site Visit
```http
POST /api/site-visits
Content-Type: application/json
Authorization: Required

{
  "plotId": "uuid",
  "visitDate": "2025-02-01",
  "visitTime": "10:00 AM",
  "attendees": 2
}
```

### Get User's Site Visits
```http
GET /api/site-visits
Authorization: Required
```

---

## 💳 Payments

### Create Razorpay Order
```http
POST /api/payments/create-order
Content-Type: application/json
Authorization: Required

{
  "booking_id": "uuid",
  "amount": 850000,
  "payment_type": "BOOKING"
}
```

**Response (200):**
```json
{
  "orderId": "order_xyz",
  "amount": 85000000,
  "currency": "INR",
  "key": "rzp_key_id",
  "payment": { ... }
}
```

### Verify Payment
```http
POST /api/payments/verify
Content-Type: application/json
Authorization: Required

{
  "razorpay_order_id": "order_xyz",
  "razorpay_payment_id": "pay_xyz",
  "razorpay_signature": "signature"
}
```

### Get Payment History
```http
GET /api/payments/history?page=1&status=COMPLETED&type=BOOKING
Authorization: Required
```

**Query Parameters:**
- `page`, `limit`
- `status` - PENDING | PROCESSING | COMPLETED | FAILED | REFUNDED
- `type` - BOOKING | INSTALLMENT | FULL_PAYMENT

### Get Single Payment
```http
GET /api/payments/{id}
Authorization: Required
```

### Initiate Refund (Admin Only)
```http
POST /api/payments/{id}/refund
Content-Type: application/json
Authorization: Required

{
  "amount": 850000,
  "reason": "Customer request",
  "speed": "normal"
}
```

### Razorpay Webhooks
```http
POST /api/payments/webhooks
Content-Type: application/json
X-Razorpay-Signature: signature

{
  "event": "payment.captured",
  "payload": { ... }
}
```

---

## 👥 Users

### Get User Profile
```http
GET /api/users/{id}
Authorization: Required
```

### Update User Profile
```http
PATCH /api/users/{id}
Content-Type: application/json
Authorization: Required

{
  "name": "John Updated",
  "phone": "9876543211"
}
```

### List All Users (Admin Only)
```http
GET /api/users?page=1&limit=50
Authorization: Required
```

---

## 🛠️ Admin

### Dashboard Statistics
```http
GET /api/admin/dashboard
Authorization: Required (Admin)
```

**Response (200):**
```json
{
  "stats": {
    "plots": {
      "total": 100,
      "available": 60,
      "booked": 30,
      "sold": 10
    },
    "customers": 500,
    "bookings": 150,
    "pendingInquiries": 45,
    "revenue": 12500000
  },
  "recentBookings": [...]
}
```

### Advanced Analytics
```http
GET /api/admin/analytics?period=30
Authorization: Required (Admin)
```

**Query Parameters:**
- `period` - Number of days (default: 30)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "period": "Last 30 days",
    "plots": { ... },
    "bookings": { ... },
    "payments": {
      "total": 45,
      "totalAmount": 38250000,
      "revenueByMonth": [...]
    },
    "users": { ... },
    "inquiries": {
      "conversionRate": "12.5%"
    },
    "summary": { ... }
  }
}
```

### User Management
```http
GET /api/admin/users?page=1&search=john&role=CUSTOMER&kycVerified=true
Authorization: Required (Admin)
```

---

## 📤 File Upload (Cloudflare R2)

**Note:** Files are stored in **Cloudflare R2** (S3-compatible storage with zero egress fees)

### Single File Upload
```http
POST /api/upload
Content-Type: multipart/form-data
Authorization: Required

files: (binary)
```

**Response (200):**
```json
{
  "url": "https://plotzed-storage.accountid.r2.dev/uploads/user-id/1234567890-image.jpg"
}
```

### Multiple Files Upload
```http
POST /api/upload/multiple
Content-Type: multipart/form-data
Authorization: Required

files: (binary array - max 10 files)
folder: "plots" (optional)
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "uploaded": [
      {
        "filename": "image1.jpg",
        "url": "https://plotzed-storage.accountid.r2.dev/plots/user-id/image1.jpg",
        "size": 1024000,
        "type": "image/jpeg"
      },
      {
        "filename": "image2.jpg",
        "url": "https://plotzed-storage.accountid.r2.dev/plots/user-id/image2.jpg",
        "size": 2048000,
        "type": "image/jpeg"
      }
    ],
    "failed": [],
    "total": 2,
    "successful": 2,
    "failed_count": 0
  }
}
```

**File Constraints:**
- Max file size: 10MB per file
- Max files per request: 10
- Allowed types: JPEG, PNG, WEBP, PDF
- Automatic malware scanning

### Delete File
```http
POST /api/upload/delete
Content-Type: application/json
Authorization: Required

{
  "url": "https://plotzed-storage.accountid.r2.dev/uploads/user-id/file.jpg"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "File deleted successfully",
  "deletedKey": "uploads/user-id/file.jpg"
}
```

**Security:**
- Users can only delete their own files (unless admin)
- URL validation ensures proper file paths

---

## 🏥 Health Check

```http
GET /api/health
```

**Response (200):**
```json
{
  "status": "ok",
  "database": "connected",
  "timestamp": "2025-01-01T00:00:00Z"
}
```

---

## 📊 Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional success message"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message"
}
```

### Validation Error
```json
{
  "success": false,
  "error": [
    {
      "field": "email",
      "message": "Invalid email"
    }
  ]
}
```

---

## 🔒 Security Features

✅ **Rate Limiting** - Redis-backed per-route limits
✅ **Authentication** - JWT with HTTP-only cookies
✅ **Authorization** - Role-based access control (RBAC)
✅ **Input Validation** - Zod schemas on all endpoints
✅ **File Security** - Type verification, malware scanning
✅ **CORS** - Configured for production
✅ **Security Headers** - CSP, HSTS, X-Frame-Options
✅ **SQL Injection Prevention** - Prisma ORM
✅ **XSS Prevention** - Input sanitization

---

## 📝 Notes

1. All authenticated endpoints require valid session cookie
2. Admin-only endpoints return 403 for non-admin users
3. Timestamps are in ISO 8601 format (UTC)
4. Prices are in INR (Indian Rupees)
5. Pagination defaults: page=1, limit=10
6. File uploads limited to 10MB per file
7. Multiple file uploads limited to 10 files
8. Razorpay webhook requires valid signature

---

## 🚀 Implementation Status

**✅ Completed:** 95% of endpoints
**⚠️ TODO:**
- Email notifications integration
- SMS notifications
- Invoice PDF generation
- Advanced reports

---

**Version:** 1.0.0
**Last Updated:** 2025-01-02
