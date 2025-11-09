# Database Backup & Recovery Guide

Complete guide for backing up and restoring the Plotzed PostgreSQL database.

## Table of Contents
- [Quick Start](#quick-start)
- [Backup Types](#backup-types)
- [Manual Backups](#manual-backups)
- [Automated Backups](#automated-backups)
- [Restoration](#restoration)
- [Verification](#verification)
- [Troubleshooting](#troubleshooting)

---

## Quick Start

### Prerequisites

1. **PostgreSQL Client Tools** (pg_dump, psql)
   ```bash
   # Ubuntu/Debian
   sudo apt-get install postgresql-client

   # macOS
   brew install postgresql

   # Windows
   # Download from https://www.postgresql.org/download/windows/
   ```

2. **AWS CLI** (for S3 backups - optional)
   ```bash
   # Install AWS CLI
   curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
   unzip awscliv2.zip
   sudo ./aws/install

   # Configure
   aws configure
   ```

3. **Environment Variables**
   ```bash
   # Required
   DATABASE_URL=postgresql://user:password@host:5432/plotzed

   # Optional (for S3 backups)
   BACKUP_S3_BUCKET=my-backup-bucket
   BACKUP_NOTIFICATION_EMAIL=admin@plotzed.com
   ```

### Install Dependencies

```bash
npm install tsx --save-dev
```

---

## Backup Types

The system supports three backup types with different retention policies:

| Type | Frequency | Retention | Use Case |
|------|-----------|-----------|----------|
| **Daily** | Every day at 2 AM | 7 days | Recent recovery, development |
| **Weekly** | Every Sunday at 3 AM | 4 weeks | Mid-term recovery |
| **Monthly** | 1st of month at 4 AM | 12 months | Long-term compliance, audits |

---

## Manual Backups

### Create a Backup

```bash
# Daily backup
npm run backup:database

# Weekly backup
npm run backup:database -- --type=weekly

# Monthly backup
npm run backup:database -- --type=monthly
```

### What Happens During Backup

1. ✅ Connects to PostgreSQL database
2. ✅ Creates complete SQL dump using `pg_dump`
3. ✅ Verifies backup integrity
4. ✅ Compresses backup with gzip (9x compression)
5. ✅ Uploads to S3 (if configured)
6. ✅ Cleans old backups per retention policy
7. ✅ Sends notification email (if configured)

### Backup Locations

**Local backups:**
```
backups/
  ├── daily/
  │   └── plotzed-daily-backup-2025-01-15T14-30-00.sql.gz
  ├── weekly/
  │   └── plotzed-weekly-backup-2025-01-12T03-00-00.sql.gz
  └── monthly/
      └── plotzed-monthly-backup-2025-01-01T04-00-00.sql.gz
```

**S3 backups:**
```
s3://your-bucket/backups/
  ├── daily/
  ├── weekly/
  └── monthly/
```

---

## Automated Backups

### Option 1: Cron (Linux/macOS)

Edit crontab:
```bash
crontab -e
```

Add these lines:
```cron
# Daily backup at 2 AM
0 2 * * * cd /path/to/plotzed-webapp && npm run backup:database >> /var/log/plotzed-backup.log 2>&1

# Weekly backup at 3 AM every Sunday
0 3 * * 0 cd /path/to/plotzed-webapp && npm run backup:database -- --type=weekly >> /var/log/plotzed-backup.log 2>&1

# Monthly backup at 4 AM on the 1st
0 4 1 * * cd /path/to/plotzed-webapp && npm run backup:database -- --type=monthly >> /var/log/plotzed-backup.log 2>&1
```

### Option 2: Vercel Cron (if deployed to Vercel)

Create API endpoint at `src/app/api/cron/backup/route.ts`:

```typescript
import { NextRequest } from 'next/server'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

export async function GET(request: NextRequest) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 })
  }

  try {
    await execAsync('npm run backup:database')
    return Response.json({ success: true })
  } catch (error) {
    return Response.json({ success: false, error }, { status: 500 })
  }
}
```

Add to `vercel.json`:
```json
{
  "crons": [
    {
      "path": "/api/cron/backup",
      "schedule": "0 2 * * *"
    }
  ]
}
```

### Option 3: GitHub Actions

Create `.github/workflows/backup.yml`:

```yaml
name: Database Backup

on:
  schedule:
    # Daily at 2 AM UTC
    - cron: '0 2 * * *'
  workflow_dispatch: # Allow manual trigger

jobs:
  backup:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm install

      - name: Install PostgreSQL client
        run: sudo apt-get install -y postgresql-client

      - name: Run backup
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          BACKUP_S3_BUCKET: ${{ secrets.BACKUP_S3_BUCKET }}
        run: npm run backup:database
```

### Option 4: Windows Task Scheduler

1. Open **Task Scheduler**
2. Create Basic Task: "Plotzed Daily Backup"
3. Trigger: Daily at 2:00 AM
4. Action: Start a program
   - Program: `C:\Program Files\nodejs\npm.cmd`
   - Arguments: `run backup:database`
   - Start in: `D:\plotzed-webapp`

---

## Restoration

### ⚠️ CRITICAL WARNING

**Restoration will DELETE all existing data in your database!**

Always:
1. ✅ Verify you're restoring to the correct database
2. ✅ Have a recent backup before restoration
3. ✅ Test restoration in staging environment first
4. ✅ Notify team members before production restoration

### Restore from Latest Backup

```bash
# Dry run (see what would happen without making changes)
npm run restore:database -- --latest --dry-run

# Actual restoration
npm run restore:database -- --latest --confirm
```

### Restore from Specific Backup

```bash
npm run restore:database -- --file=backups/daily/plotzed-daily-backup-2025-01-15.sql.gz --confirm
```

### Restore from S3

```bash
npm run restore:database -- --from-s3=s3://my-bucket/backups/daily/backup.sql.gz --confirm
```

### Skip Pre-Restore Backup

```bash
# Not recommended, but faster
npm run restore:database -- --latest --confirm --skip-pre-backup
```

### What Happens During Restoration

1. ✅ Validates backup file exists
2. ✅ Creates pre-restore backup (safety measure)
3. ✅ Decompresses backup if needed
4. ✅ Terminates existing database connections
5. ✅ Drops existing database
6. ✅ Creates new empty database
7. ✅ Restores data from backup
8. ✅ Verifies restoration (checks table count)
9. ✅ Cleans up temporary files

---

## Verification

### Verify Backup Integrity

Backups are automatically verified during creation, but you can manually verify:

```bash
# Decompress and check
gunzip -c backups/daily/plotzed-daily-backup-2025-01-15.sql.gz | head -n 50

# Should see:
# - "PostgreSQL database dump" header
# - Database version info
# - CREATE TABLE statements
```

### Test Restoration (Safe Method)

1. Create a test database:
   ```sql
   CREATE DATABASE plotzed_test;
   ```

2. Modify DATABASE_URL temporarily:
   ```bash
   export DATABASE_URL=postgresql://user:password@host:5432/plotzed_test
   ```

3. Restore to test database:
   ```bash
   npm run restore:database -- --latest --confirm
   ```

4. Verify data:
   ```bash
   psql $DATABASE_URL -c "SELECT COUNT(*) FROM users;"
   ```

5. Drop test database:
   ```sql
   DROP DATABASE plotzed_test;
   ```

### Check Backup Size

```bash
# List all backups with sizes
du -h backups/*/*.gz | sort -h

# Expected sizes (approximate):
# - Daily: 5-50 MB (compressed)
# - Weekly: 10-100 MB
# - Monthly: 20-200 MB
```

---

## Monitoring

### Set Up Backup Alerts

1. **Email Notifications** (configure in `.env`):
   ```env
   BACKUP_NOTIFICATION_EMAIL=admin@plotzed.com
   ```

2. **Slack Webhook** (add to backup script):
   ```typescript
   // In scripts/backup-database.ts
   async function sendSlackNotification(success: boolean, details: string) {
     await fetch(process.env.SLACK_WEBHOOK_URL!, {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({
         text: success
           ? `✅ Database backup completed: ${details}`
           : `❌ Database backup failed: ${details}`
       })
     })
   }
   ```

3. **Uptime Monitoring** (use UptimeRobot, Pingdom, etc.):
   - Monitor backup log file size (should increase daily)
   - Monitor S3 bucket (should have new files)

### Check Backup Status

```bash
# View recent backups
ls -lh backups/daily/

# Check backup logs
tail -f /var/log/plotzed-backup.log

# Verify S3 backups
aws s3 ls s3://your-bucket/backups/daily/ --human-readable
```

---

## Troubleshooting

### Issue: "pg_dump: command not found"

**Solution:** Install PostgreSQL client tools
```bash
# Ubuntu/Debian
sudo apt-get install postgresql-client

# macOS
brew install postgresql
```

### Issue: "Connection refused"

**Solution:** Check database connection
```bash
# Test connection
psql $DATABASE_URL -c "SELECT version();"

# Check if PostgreSQL is running
sudo systemctl status postgresql
```

### Issue: "Permission denied"

**Solution:** Check database user permissions
```sql
-- Grant necessary permissions
GRANT CONNECT ON DATABASE plotzed TO your_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO your_user;
```

### Issue: "Disk space full"

**Solution:** Clean old backups or increase storage
```bash
# Check disk usage
df -h

# Manually delete old backups
rm backups/daily/plotzed-daily-backup-2025-01-*.sql.gz

# Or reduce retention in config
```

### Issue: "Backup verification failed"

**Solution:** Check backup file integrity
```bash
# Test decompression
gunzip -t backups/daily/backup.sql.gz

# If corrupted, delete and create new backup
rm backups/daily/backup.sql.gz
npm run backup:database
```

### Issue: "S3 upload failed"

**Solution:** Check AWS credentials and permissions
```bash
# Test AWS CLI
aws s3 ls s3://your-bucket/

# Check IAM permissions (needs s3:PutObject)
```

---

## Best Practices

### 1. 3-2-1 Backup Rule
- **3** copies of data
- **2** different storage types (local + cloud)
- **1** off-site backup (S3)

### 2. Regular Testing
- Test restoration monthly
- Verify backup integrity weekly
- Monitor backup success/failure daily

### 3. Security
- Encrypt backups at rest (use S3 encryption)
- Encrypt backups in transit (use SSL)
- Limit access to backup files
- Never commit backup files to Git

### 4. Documentation
- Document restoration procedures
- Keep runbook updated
- Train team on recovery process

### 5. Automation
- Automate backups (don't rely on manual)
- Automate verification
- Automate alerts

---

## Emergency Recovery

### Scenario: Complete Database Loss

1. **Stay calm** - You have backups!

2. **Assess the situation:**
   ```bash
   # Check if database exists
   psql $DATABASE_URL -c "SELECT 1;"
   ```

3. **Restore from latest backup:**
   ```bash
   npm run restore:database -- --latest --confirm
   ```

4. **Verify restoration:**
   ```bash
   psql $DATABASE_URL -c "SELECT COUNT(*) FROM users;"
   psql $DATABASE_URL -c "SELECT COUNT(*) FROM plots;"
   ```

5. **Check data consistency:**
   ```bash
   # Run Prisma migrations
   npx prisma migrate deploy

   # Seed critical data if needed
   npm run db:seed
   ```

6. **Notify team:**
   - Inform team of incident
   - Document what happened
   - Update recovery procedures

---

## Additional Resources

- [PostgreSQL Backup Documentation](https://www.postgresql.org/docs/current/backup.html)
- [AWS S3 Backup Best Practices](https://aws.amazon.com/s3/backup-and-restore/)
- [Disaster Recovery Planning](https://www.postgresql.org/docs/current/backup-dump.html)

---

## Support

For issues or questions:
- Open an issue in the GitHub repository
- Contact the DevOps team
- Check logs in `/var/log/plotzed-backup.log`
