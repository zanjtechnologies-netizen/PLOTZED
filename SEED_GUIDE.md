# 🌱 Database Seeding Guide

Complete guide for seeding your Plotzed database with initial data and sample content.

---

## 📋 Table of Contents

- [Quick Start](#quick-start)
- [What Gets Seeded](#what-gets-seeded)
- [Environment Configuration](#environment-configuration)
- [Login Credentials](#login-credentials)
- [Usage](#usage)
- [Development vs Production](#development-vs-production)
- [Troubleshooting](#troubleshooting)

---

## 🚀 Quick Start

### First Time Setup

```bash
# 1. Set up environment variables (optional)
cp .env.example .env
# Edit .env and set ADMIN_EMAIL and ADMIN_PASSWORD if desired

# 2. Run migrations
npm run migrate:deploy

# 3. Seed the database
npm run db:seed
```

### Reset and Reseed

```bash
# WARNING: This will DELETE ALL DATA and reseed
npm run db:seed:reset
```

---

## 📦 What Gets Seeded

### Production Environment (NODE_ENV=production)

**Only the admin user is created:**

- 1 Admin User with full access

### Development Environment (NODE_ENV=development or not set)

**Complete sample data for testing:**

1. **Admin User** (1)
   - Full system access
   - Can manage all entities

2. **Sample Users** (3)
   - Regular users with verified emails
   - Ready to make bookings and inquiries

3. **Sample Plots** (6)
   - Diverse property types across India
   - Mix of residential, commercial, and agricultural
   - Different price ranges (₹50L to ₹3.5Cr)
   - Various statuses (AVAILABLE, BOOKED)

4. **Sample Bookings** (2)
   - 1 Confirmed booking with completed payment
   - 1 Pending booking awaiting payment

5. **Sample Payments** (1)
   - Completed payment for confirmed booking
   - Invoice generated

6. **Sample Inquiries** (1)
   - User inquiry about a property

7. **Sample Site Visits** (1)
   - Scheduled site visit for tomorrow

---

## ⚙️ Environment Configuration

### Required Environment Variables

```env
# Database connection (Required)
DATABASE_URL="postgresql://user:password@localhost:5432/plotzed"

# Admin user configuration (Optional - defaults shown)
ADMIN_EMAIL="admin@plotzed.com"
ADMIN_PASSWORD="Admin@123456"

# Environment (Optional)
NODE_ENV="development"  # or "production"
```

### Setting Custom Admin Credentials

**Option 1: Environment Variables**

```bash
# In .env file
ADMIN_EMAIL="your-email@company.com"
ADMIN_PASSWORD="YourSecurePassword123!"
```

**Option 2: Edit seed.ts directly**

```typescript
// In prisma/seed.ts
const ADMIN_USER = {
  email: 'your-email@company.com',
  password: 'YourSecurePassword123!',
  name: 'Your Name',
  phone: '+919876543210',
  role: 'ADMIN' as const,
}
```

---

## 🔑 Login Credentials

### Production

| User Type | Email | Password |
|-----------|-------|----------|
| Admin | `admin@plotzed.com` (or custom) | `Admin@123456` (or custom) |

### Development

| User Type | Email | Password |
|-----------|-------|----------|
| **Admin** | `admin@plotzed.com` | `Admin@123456` |
| User 1 | `john.doe@example.com` | `User@123456` |
| User 2 | `jane.smith@example.com` | `User@123456` |
| User 3 | `bob.johnson@example.com` | `User@123456` |

**All passwords follow the validation rules:**
- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number
- At least 1 special character

---

## 📖 Usage

### Seed Database

```bash
# Seed the database (preserves existing data, uses upsert for admin)
npm run db:seed
```

**Output:**
```
╔════════════════════════════════════════════╗
║   PLOTZED DATABASE SEEDING                 ║
╚════════════════════════════════════════════╝

Environment: development
Database: plotzed

🧹 Clearing existing data...
   ✅ Cleared 0 activity logs
   ✅ Cleared 0 site visits
   ✅ Cleared 0 payments
   ✅ Cleared 0 bookings
   ✅ Cleared 0 inquiries
   ✅ Cleared 0 plots
   ✅ Cleared 0 users

👤 Creating admin user...
   ✅ Admin created: admin@plotzed.com

👥 Creating sample users...
   ✅ User created: john.doe@example.com
   ✅ User created: jane.smith@example.com
   ✅ User created: bob.johnson@example.com

🏘️  Creating sample plots...
   ✅ Plot created: Luxury Villa Plot in Juhu, Mumbai (₹2.5 Cr)
   ✅ Plot created: Beachfront Land in Calangute, Goa (₹1.5 Cr)
   ...

✅ Database seeded successfully!
```

### Reset and Reseed

```bash
# DANGER: Drops all tables, runs migrations, then seeds
npm run db:seed:reset

# You'll be prompted to confirm
# Enter 'y' to proceed
```

### Prisma Migrate with Auto-Seed

```bash
# After running migrate:reset, Prisma will automatically run the seed
prisma migrate reset

# The "prisma.seed" in package.json tells Prisma to run the seed script
```

---

## 🔄 Development vs Production

### Development Mode

**Detected when:**
- `NODE_ENV` is not set
- `NODE_ENV=development`

**Behavior:**
```
✅ Clears all existing data
✅ Creates admin user
✅ Creates 3 sample users
✅ Creates 6 sample plots
✅ Creates 2 sample bookings
✅ Creates 1 sample payment
✅ Creates 1 sample inquiry
✅ Creates 1 sample site visit
```

**Best for:**
- Local development
- Testing features
- UI/UX development
- API testing
- Demo environments

### Production Mode

**Detected when:**
- `NODE_ENV=production`

**Behavior:**
```
⏭️  Skips clearing data
✅ Creates admin user ONLY (upsert - won't duplicate)
⏭️  Skips sample data creation
```

**Best for:**
- Live production deployment
- Staging environments
- Initial production setup

---

## 🏢 Sample Data Details

### Sample Plots

1. **Luxury Villa Plot - Mumbai**
   - Location: Juhu, Mumbai, Maharashtra
   - Price: ₹2.5 Cr
   - Size: 2000 sq ft
   - Status: AVAILABLE
   - Featured: Yes

2. **Beachfront Land - Goa**
   - Location: Calangute, Goa
   - Price: ₹1.5 Cr
   - Size: 1500 sq ft
   - Status: AVAILABLE
   - Featured: Yes

3. **Agricultural Land - Lonavala**
   - Location: Lonavala, Pune, Maharashtra
   - Price: ₹50 Lakhs
   - Size: 5000 sq ft
   - Status: AVAILABLE
   - Featured: No

4. **Commercial Plot - Bangalore**
   - Location: Whitefield, Bangalore, Karnataka
   - Price: ₹3.5 Cr
   - Size: 3000 sq ft
   - Status: AVAILABLE
   - Featured: Yes

5. **Residential Plot - Noida** ⚠️ BOOKED
   - Location: Sector 50, Noida, UP
   - Price: ₹80 Lakhs
   - Size: 1200 sq ft
   - Status: BOOKED
   - Featured: No
   - Booked by: John Doe

6. **Hill View Plot - Shimla**
   - Location: Shimla, Himachal Pradesh
   - Price: ₹60 Lakhs
   - Size: 2500 sq ft
   - Status: AVAILABLE
   - Featured: No

### Sample Bookings

1. **Confirmed Booking**
   - User: John Doe
   - Plot: Residential Plot in Noida
   - Amount: ₹20 Lakhs (booking amount)
   - Status: CONFIRMED
   - Payment: COMPLETED

2. **Pending Booking**
   - User: Jane Smith
   - Plot: Beachfront Land in Goa
   - Amount: ₹37.5 Lakhs (booking amount)
   - Status: PENDING
   - Payment: None yet

### Sample Inquiry

- **User:** Bob Johnson
- **Plot:** Luxury Villa Plot in Mumbai
- **Message:** "I'm interested in this plot. Can you provide more details about the RERA approval and possession timeline?"
- **Status:** PENDING

### Sample Site Visit

- **User:** Jane Smith
- **Plot:** Commercial Plot in Bangalore
- **Date:** Tomorrow
- **Time:** 10:00 AM
- **Status:** CONFIRMED

---

## 🐛 Troubleshooting

### Issue: "Database does not exist"

**Solution:**
```bash
# Create the database first
createdb plotzed

# Or if using psql
psql -U postgres -c "CREATE DATABASE plotzed;"

# Then run migrations
npm run migrate:deploy

# Then seed
npm run db:seed
```

### Issue: "Admin user already exists"

**Not an issue!** The seed script uses `upsert` for the admin user, so it will:
- Update the existing admin if found
- Create new admin if not found

### Issue: "Unique constraint violation"

**Solution:**
```bash
# Use the reset command to clear all data first
npm run db:seed:reset
```

### Issue: "Cannot find module 'bcryptjs'"

**Solution:**
```bash
# Install dependencies
npm install
```

### Issue: "Permission denied on database"

**Solution:**
```bash
# Grant permissions to your database user
psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE plotzed TO your_user;"
```

### Issue: Sample data not created in development

**Check:**
```bash
# Verify NODE_ENV
echo $NODE_ENV

# If it's set to "production", unset it for development
unset NODE_ENV

# Or set it to development
export NODE_ENV=development

# Then run seed again
npm run db:seed
```

### Issue: Seed script hangs or doesn't complete

**Solution:**
```bash
# Check database connection
psql $DATABASE_URL -c "SELECT 1;"

# Check for long-running queries
psql $DATABASE_URL -c "SELECT * FROM pg_stat_activity;"

# Kill the seed process and try again
# Ctrl+C to stop, then run again
npm run db:seed
```

---

## 🔐 Security Notes

1. **Change default passwords in production!**
   ```bash
   # Always set custom admin credentials
   ADMIN_EMAIL="your-email@company.com"
   ADMIN_PASSWORD="YourSecurePassword123!"
   ```

2. **Sample user passwords are intentionally simple for development**
   - All sample users use `User@123456`
   - These are for testing only
   - Never use these in production

3. **Admin password requirements:**
   - Minimum 8 characters
   - Must include uppercase, lowercase, number, special character
   - Stored as bcrypt hash in database

4. **Email verification:**
   - Admin user is automatically verified
   - Sample users are automatically verified (development only)
   - Real users must verify email in production

---

## 📊 Database Schema

The seed script populates the following tables:

```
users
  ├── admin user (always)
  └── sample users (development only)

plots
  └── 6 diverse sample properties (development only)

bookings
  ├── confirmed booking with payment
  └── pending booking (development only)

payments
  └── completed payment for confirmed booking (development only)

inquiries
  └── sample inquiry (development only)

site_visits
  └── upcoming site visit (development only)

activity_logs
  └── auto-generated for all actions
```

---

## 🎯 Next Steps

After seeding:

1. **Login to admin dashboard:**
   ```
   http://localhost:3000/admin
   Email: admin@plotzed.com
   Password: Admin@123456
   ```

2. **View the plots:**
   ```
   http://localhost:3000/plots
   ```

3. **Test user features:**
   - Login as sample user
   - Browse plots
   - Make inquiries
   - Book site visits

4. **Explore Prisma Studio:**
   ```bash
   npm run db:studio
   # Opens at http://localhost:5555
   ```

---

## 🔄 Common Workflows

### Reset Everything and Start Fresh

```bash
# Complete reset
npm run db:seed:reset

# Login with default credentials
# Email: admin@plotzed.com
# Password: Admin@123456
```

### Add More Sample Data

Edit [prisma/seed.ts](prisma/seed.ts) and add your custom data:

```typescript
const SAMPLE_PLOTS = [
  // ... existing plots
  {
    title: 'Your Custom Plot',
    price: 5000000,
    // ... other fields
  }
]
```

Then run:
```bash
npm run db:seed:reset
```

### Seed Production Database for First Time

```bash
# Set production environment
export NODE_ENV=production

# Set custom admin credentials
export ADMIN_EMAIL="admin@yourcompany.com"
export ADMIN_PASSWORD="YourSecurePassword123!"

# Seed (only creates admin, no sample data)
npm run db:seed
```

---

## 📝 Best Practices

1. **Always use `db:seed:reset` when developing**
   - Ensures clean state
   - Prevents data inconsistencies

2. **Never seed production with sample data**
   - Set `NODE_ENV=production`
   - Only admin user will be created

3. **Customize admin credentials before first production deployment**
   - Use environment variables
   - Use strong, unique password

4. **Keep seed.ts updated with your schema**
   - When adding new required fields
   - Update sample data accordingly

5. **Use Prisma Studio to verify seed data**
   ```bash
   npm run db:studio
   ```

---

## 📞 Support

If you encounter issues:

1. Check [Troubleshooting](#troubleshooting) section
2. Verify your DATABASE_URL is correct
3. Ensure PostgreSQL is running
4. Check that migrations are up to date: `npm run migrate:deploy`

---

**Happy Seeding! 🌱**
