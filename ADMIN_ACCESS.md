# Admin Panel Access Guide

## 🔐 How to Access Admin Panel

### Method 1: Direct Login
1. Go to `/login` page
2. Enter admin credentials
3. System automatically redirects ADMIN users to `/admin`
4. Regular CUSTOMER users are redirected to `/dashboard`

### Method 2: Direct URL
1. Navigate to `/admin` directly
2. If not logged in, you'll be redirected to `/login?callbackUrl=/admin`
3. After login, you'll be sent back to `/admin`

## 👤 Admin Credentials (from seed file)

**Email:** `admin@plotzedrealestate.com`
**Password:** `PlotAdmin@2024!Secure`

⚠️ **IMPORTANT:** Change this password after first login in production!

## 📊 Admin Panel Features

### Available Pages:
- **Dashboard** (`/admin`) - Overview statistics and recent activity
- **Analytics** (`/admin/analytics`) - Advanced analytics and metrics
- **Site Visits** (`/admin/site-visits`) - Manage property site visit requests
- **Inquiries** (`/admin/inquiries`) - Handle customer inquiries and leads
- **Properties** (`/admin/properties`) - Manage property listings
- **Users** (`/admin/users`) - User management and verification

### Security Features:
✅ Server-side authentication check
✅ Role-based access control (ADMIN only)
✅ Automatic redirect for unauthorized access
✅ Protected API routes
✅ Session management with NextAuth

## 🎨 Login Page Features

### New Improvements:
- 🎨 Beautiful gradient background
- 👁️ Password visibility toggle
- 📧 Email/password icons
- ⚡ Loading spinner animation
- 💡 Admin access hint
- 🔄 Remember me checkbox
- 🔗 Forgot password link
- 📱 Responsive design
- ✨ Smooth animations and transitions

### Smart Redirect:
- Admins → `/admin`
- Customers → `/dashboard`
- Respects `callbackUrl` parameter for deep linking

## 🚀 Quick Start

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Navigate to: `http://localhost:3000/login`

3. Login with admin credentials

4. You'll be automatically redirected to `/admin`

## 📝 Test Credentials

### Admin User:
- Email: `admin@plotzedrealestate.com`
- Password: `PlotAdmin@2024!Secure`
- Role: ADMIN
- Access: Full admin panel

### Customer Users (from seed):
- **Rajesh Kumar**: `rajesh.kumar@gmail.com` / `Customer@123`
- **Priya Sharma**: `priya.sharma@yahoo.com` / `Customer@123`
- **Amit Patel**: `amit.patel@outlook.com` / `Customer@123`
- **Sunita Reddy**: `sunita.reddy@gmail.com` / `Customer@123`
- **Vikram Singh**: `vikram.singh@hotmail.com` / `Customer@123`

Role: CUSTOMER
Access: User dashboard only

## 🔒 Security Notes

1. **Never commit** admin credentials to git
2. **Change default password** in production
3. **Enable 2FA** for admin accounts (future enhancement)
4. **Monitor admin activity** through activity logs
5. **Regular security audits** recommended
