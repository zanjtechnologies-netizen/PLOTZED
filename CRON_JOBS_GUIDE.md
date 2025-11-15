# ⏰ Cron Jobs & Scheduled Tasks Guide

Complete guide for setting up and managing automated scheduled tasks in Plotzed.

## 📋 Available Cron Jobs

| Job | Purpose | Schedule | Command |
|-----|---------|----------|---------|
| **Token Cleanup** | Remove expired verification & reset tokens | Daily at 3 AM | `npm run cron:cleanup-tokens` |
| **Expire Bookings** | Cancel pending bookings >48h old | Every 6 hours | `npm run cron:expire-bookings` |
| **Site Visit Reminders** | Send 24h advance reminders | Every 2 hours | `npm run cron:visit-reminders` |
| **Log Cleanup** | Delete activity logs >90 days | Weekly (Sunday 4 AM) | `npm run cron:cleanup-logs` |
| **Run All** | Execute all cron jobs | Manual | `npm run cron:all` |

---

## 🚀 Quick Start

### 1. Manual Execution

```bash
# Run individual jobs
npm run cron:cleanup-tokens
npm run cron:expire-bookings
npm run cron:visit-reminders
npm run cron:cleanup-logs

# Run all jobs at once
npm run cron:all
```

### 2. Set Up Automated Execution

#### **Option A: Linux/macOS (Cron)**

```bash
# Edit crontab
crontab -e

# Add these lines
# Token cleanup - Daily at 3 AM
0 3 * * * cd /path/to/plotzed-webapp && npm run cron:cleanup-tokens >> /var/log/plotzed-cron.log 2>&1

# Expire bookings - Every 6 hours
0 */6 * * * cd /path/to/plotzed-webapp && npm run cron:expire-bookings >> /var/log/plotzed-cron.log 2>&1

# Site visit reminders - Every 2 hours
0 */2 * * * cd /path/to/plotzed-webapp && npm run cron:visit-reminders >> /var/log/plotzed-cron.log 2>&1

# Log cleanup - Weekly on Sunday at 4 AM
0 4 * * 0 cd /path/to/plotzed-webapp && npm run cron:cleanup-logs >> /var/log/plotzed-cron.log 2>&1
```

#### **Option B: Windows (Task Scheduler)**

Create these tasks:

1. **Token Cleanup**
   - Trigger: Daily at 3:00 AM
   - Action: `npm.cmd run cron:cleanup-tokens`
   - Start in: `D:\plotzed-webapp`

2. **Expire Bookings**
   - Trigger: Daily at 12:00 AM, repeat every 6 hours for 24 hours
   - Action: `npm.cmd run cron:expire-bookings`

3. **Site Visit Reminders**
   - Trigger: Daily at 12:00 AM, repeat every 2 hours for 24 hours
   - Action: `npm.cmd run cron:visit-reminders`

4. **Log Cleanup**
   - Trigger: Weekly on Sunday at 4:00 AM
   - Action: `npm.cmd run cron:cleanup-logs`

#### **Option C: API Endpoints (Recommended for Production)**

Set `CRON_SECRET` in `.env`:
```env
CRON_SECRET=your-secure-random-secret
```

Call via external cron service (e.g., cron-job.org, EasyCron):

```bash
# Token cleanup
curl https://your-domain.com/api/cron/cleanup-tokens \
  -H "Authorization: Bearer YOUR_CRON_SECRET"

# Expire bookings
curl https://your-domain.com/api/cron/expire-bookings \
  -H "Authorization: Bearer YOUR_CRON_SECRET"

# Site visit reminders
curl https://your-domain.com/api/cron/visit-reminders \
  -H "Authorization: Bearer YOUR_CRON_SECRET"

# Log cleanup
curl https://your-domain.com/api/cron/cleanup-logs \
  -H "Authorization: Bearer YOUR_CRON_SECRET"

# Run all
curl https://your-domain.com/api/cron/all \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

#### **Option D: Vercel Cron**

Create `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron/cleanup-tokens",
      "schedule": "0 3 * * *"
    },
    {
      "path": "/api/cron/expire-bookings",
      "schedule": "0 */6 * * *"
    },
    {
      "path": "/api/cron/visit-reminders",
      "schedule": "0 */2 * * *"
    },
    {
      "path": "/api/cron/cleanup-logs",
      "schedule": "0 4 * * 0"
    }
  ]
}
```

---

## 📖 Job Details

### 1. Token Cleanup

**Purpose**: Remove expired verification and password reset tokens from database

**What it does**:
- ✅ Finds users with expired `verification_token_expires`
- ✅ Finds users with expired `reset_token_expires`
- ✅ Sets tokens to `null` for expired entries
- ✅ Prevents database bloat
- ✅ Improves query performance

**Output Example**:
```
🔍 Cleaning expired verification tokens...
   ✅ Cleaned 5 expired verification tokens
🔍 Cleaning expired reset tokens...
   ✅ Cleaned 2 expired reset tokens

Total cleaned: 7
Duration: 145ms
```

---

### 2. Expire Pending Bookings

**Purpose**: Automatically cancel bookings that remain in PENDING status for more than 48 hours

**What it does**:
- ✅ Finds bookings in PENDING status created >48 hours ago
- ✅ Updates booking status to CANCELLED
- ✅ Releases plot back to AVAILABLE status
- ✅ Cancels associated pending payments
- ✅ Sends email notification to user
- ✅ Logs activity for audit trail

**Business Logic**:
- Pending bookings expire after 48 hours
- Plot is automatically released for others to book
- User receives email with option to re-book

**Output Example**:
```
🔍 Finding bookings pending since before: 2025-01-13T14:30:00Z
   Found 3 expired bookings

📦 Processing booking abc123:
   User: John Doe (john@example.com)
   Plot: Luxury Villa in Mumbai
   Created: 2025-01-11T10:00:00Z
   ✅ Booking cancelled
   ✅ Plot released
   ✅ 1 payment(s) cancelled
   ✅ Notification email sent

Expired bookings: 3
Released plots: 3
Cancelled payments: 3
Emails sent: 3
Duration: 2145ms
```

---

### 3. Site Visit Reminders

**Purpose**: Send email reminders 24 hours before scheduled site visits

**What it does**:
- ✅ Finds site visits scheduled 22-26 hours from now (24h ± 2h buffer)
- ✅ Sends email reminder with visit details
- ✅ Includes property information and location
- ✅ Provides Google Maps link for directions
- ✅ Sends SMS reminder (if configured)
- ✅ Logs activity

**Email includes**:
- Visit date and time
- Property details
- Location with map link
- What to bring
- Reschedule link

**Output Example**:
```
🔍 Finding site visits between:
   Start: 2025-01-16T14:00:00Z
   End: 2025-01-16T18:00:00Z
   Found 2 upcoming site visits

📅 Processing site visit xyz789:
   User: Jane Smith
   Plot: Beachfront Plot in Goa
   Date: Jan 17, 2025
   Time: 10:00 AM
   ✅ Email reminder sent
   ✅ SMS reminder sent

Checked: 2
Emails sent: 2
SMS sent: 2
Errors: 0
Duration: 1523ms
```

---

### 4. Activity Log Cleanup

**Purpose**: Delete old activity logs to prevent database bloat

**What it does**:
- ✅ Deletes activity logs older than 90 days
- ✅ Maintains compliance with data retention policies
- ✅ Keeps recent logs for audit purposes
- ✅ Improves database performance

**Retention Policy**:
- Keep logs for 90 days
- Delete older logs automatically
- Critical logs (payments, bookings) may have different retention

**Output Example**:
```
🔍 Deleting logs older than: 2024-10-17T00:00:00Z

Deleted logs: 1,234
Retention: 90 days
Duration: 456ms
```

---

## 🔐 Security

### Secure API Endpoints

1. **Generate secret**:
   ```bash
   openssl rand -base64 32
   ```

2. **Add to `.env`**:
   ```env
   CRON_SECRET=your-generated-secret-here
   ```

3. **Use in requests**:
   ```bash
   curl https://your-domain.com/api/cron/cleanup-tokens \
     -H "Authorization: Bearer YOUR_CRON_SECRET"
   ```

### IP Whitelisting (Optional)

In your middleware or API endpoint:

```typescript
const ALLOWED_IPS = [
  '127.0.0.1', // localhost
  '::1', // localhost IPv6
  // Add your server IPs
]

const clientIP = request.headers.get('x-forwarded-for') || 'unknown'
if (!ALLOWED_IPS.includes(clientIP)) {
  throw new UnauthorizedError('IP not whitelisted')
}
```

---

## 📊 Monitoring

### Check Cron Logs

```bash
# View recent logs
tail -f /var/log/plotzed-cron.log

# Search for errors
grep "❌" /var/log/plotzed-cron.log

# Check last execution time
grep "COMPLETED" /var/log/plotzed-cron.log | tail -5
```

### Set Up Alerts

#### Email on Failure

Add to crontab:

```cron
0 3 * * * cd /path/to/plotzed-webapp && npm run cron:cleanup-tokens >> /var/log/plotzed-cron.log 2>&1 || echo "Token cleanup failed" | mail -s "Cron Job Alert" admin@plotzed.com
```

#### Slack Webhook

```typescript
// In cron script
if (error) {
  await fetch(process.env.SLACK_WEBHOOK_URL!, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text: `❌ Cron job failed: ${error.message}`
    })
  })
}
```

---

## 🐛 Troubleshooting

### Job Not Running

**Check 1**: Verify cron service is running
```bash
sudo systemctl status cron
```

**Check 2**: Check cron logs
```bash
grep CRON /var/log/syslog
```

**Check 3**: Test manually
```bash
npm run cron:cleanup-tokens
```

**Check 4**: Verify PATH in cron
```cron
# Add to crontab
PATH=/usr/local/bin:/usr/bin:/bin
SHELL=/bin/bash
```

### Database Connection Issues

**Error**: `Connection refused`

**Solution**:
- Verify `DATABASE_URL` in environment
- Check database is running
- Test connection: `psql $DATABASE_URL -c "SELECT 1;"`

### Permission Errors

**Error**: `EACCES: permission denied`

**Solution**:
```bash
chmod +x scripts/cron/*.ts
```

### No Emails Sent

**Check 1**: Verify email service configuration
```env
RESEND_API_KEY=your-api-key
FROM_EMAIL=noreply@plotzed.com
```

**Check 2**: Check email service status
- Resend dashboard
- Check quota limits

---

## 📈 Best Practices

1. **Log Everything**: All cron jobs output to `/var/log/plotzed-cron.log`

2. **Monitor Execution**: Set up alerts for failures

3. **Test Locally**: Always test jobs manually before scheduling

4. **Idempotent Operations**: Jobs should be safe to run multiple times

5. **Graceful Failures**: Continue processing even if one item fails

6. **Activity Logging**: All critical operations logged to database

7. **Email Notifications**: Users notified of important state changes

8. **Performance**: Keep jobs fast (<30 seconds if possible)

---

## 🔄 Adding New Cron Jobs

### 1. Create Job Script

```typescript
// scripts/cron/my-new-job.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function myNewJob() {
  try {
    // Your logic here
    console.log('Job executed successfully')
    return { success: true }
  } finally {
    await prisma.$disconnect()
  }
}

if (require.main === module) {
  myNewJob().then(() => process.exit(0))
}
```

### 2. Add NPM Script

In `package.json`:
```json
{
  "scripts": {
    "cron:my-job": "tsx scripts/cron/my-new-job.ts"
  }
}
```

### 3. Add to API Endpoint

In `src/app/api/cron/[task]/route.ts`:
```typescript
import { myNewJob } from '@/../scripts/cron/my-new-job'

const CRON_TASKS = {
  // ...existing tasks
  'my-job': {
    name: 'My New Job',
    description: 'Description of what it does',
    handler: myNewJob,
  },
}
```

### 4. Schedule Execution

Add to crontab:
```cron
0 */4 * * * cd /path/to/plotzed-webapp && npm run cron:my-job
```

---

## 📞 Support

- **View logs**: `/var/log/plotzed-cron.log`
- **Test jobs**: `npm run cron:all`
- **API health**: `https://your-domain.com/api/health`

---

**Remember**: Test all cron jobs in development before deploying to production! 🎯
