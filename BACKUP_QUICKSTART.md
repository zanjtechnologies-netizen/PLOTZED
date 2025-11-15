# 🗄️ Database Backup - Quick Start Guide

This guide will get you up and running with automated database backups in 5 minutes.

## ✅ Prerequisites

1. **PostgreSQL client tools installed**
   ```bash
   # Check if pg_dump is installed
   pg_dump --version

   # If not installed:
   # Ubuntu/Debian: sudo apt-get install postgresql-client
   # macOS: brew install postgresql
   # Windows: Download from https://www.postgresql.org/download/
   ```

2. **tsx installed** (already in package.json)
   ```bash
   npm install
   ```

## 🚀 Quick Setup (30 seconds)

### 1. Set Environment Variables

Add to your `.env` file:

```env
# Required
DATABASE_URL="postgresql://user:password@localhost:5432/plotzed"

# Optional (for cloud backups)
BACKUP_S3_BUCKET="plotzed-backups"
BACKUP_NOTIFICATION_EMAIL="admin@plotzed.com"
```

### 2. Create Your First Backup

```bash
npm run backup:database
```

That's it! Your backup is now in `backups/daily/`

## 📋 Common Commands

```bash
# Create backup
npm run backup:database              # Daily backup (default)
npm run backup:daily                 # Daily backup (explicit)
npm run backup:weekly                # Weekly backup
npm run backup:monthly               # Monthly backup

# Restore database
npm run restore:latest               # Restore from latest backup (dry-run first)
npm run restore:latest -- --confirm  # Actually restore (DANGEROUS!)

# View backup status (via API)
curl http://localhost:3000/api/admin/backups/status \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## ⏰ Set Up Automated Backups (2 minutes)

### Option 1: Cron (Linux/macOS)

```bash
# Edit crontab
crontab -e

# Add this line (runs daily at 2 AM)
0 2 * * * cd /path/to/plotzed-webapp && npm run backup:database >> /var/log/plotzed-backup.log 2>&1
```

### Option 2: Windows Task Scheduler

1. Open **Task Scheduler**
2. Create Basic Task: "Plotzed Daily Backup"
3. Trigger: Daily at 2:00 AM
4. Action: Start a program
   - Program: `C:\Program Files\nodejs\npm.cmd`
   - Arguments: `run backup:database`
   - Start in: `D:\plotzed-webapp`

### Option 3: Vercel Cron (if deployed to Vercel)

Create `src/app/api/cron/backup/route.ts`:

```typescript
import { NextRequest } from 'next/server'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

export async function GET(request: NextRequest) {
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
  "crons": [{
    "path": "/api/cron/backup",
    "schedule": "0 2 * * *"
  }]
}
```

## 🔍 Verify Backups

```bash
# List all backups
ls -lh backups/daily/
ls -lh backups/weekly/
ls -lh backups/monthly/

# Check backup integrity
gunzip -t backups/daily/plotzed-daily-backup-*.sql.gz

# View backup status via API
curl http://localhost:3000/api/admin/backups/status
```

## 🆘 Emergency Restore

**⚠️ WARNING: This will DELETE your current database!**

```bash
# Step 1: See what will happen (dry-run)
npm run restore:latest -- --dry-run

# Step 2: Actually restore (creates pre-restore backup first)
npm run restore:latest -- --confirm

# Step 3: Verify
psql $DATABASE_URL -c "SELECT COUNT(*) FROM users;"
```

## 📊 Backup Strategy

| Type | Frequency | Retention | Location |
|------|-----------|-----------|----------|
| **Daily** | Every day at 2 AM | 7 days | `backups/daily/` |
| **Weekly** | Every Sunday at 3 AM | 4 weeks | `backups/weekly/` |
| **Monthly** | 1st of month at 4 AM | 12 months | `backups/monthly/` |

## 📁 Where Are Backups Stored?

```
plotzed-webapp/
  └── backups/
      ├── daily/
      │   └── plotzed-daily-backup-2025-01-15T14-30-00.sql.gz
      ├── weekly/
      │   └── plotzed-weekly-backup-2025-01-12T03-00-00.sql.gz
      ├── monthly/
      │   └── plotzed-monthly-backup-2025-01-01T04-00-00.sql.gz
      └── pre-restore/
          └── pre-restore-backup-2025-01-15T10-00-00.sql
```

**Important:**
- ✅ Backups are compressed (`.gz`) to save space
- ✅ Old backups are automatically cleaned per retention policy
- ✅ Pre-restore backups are created before any restoration
- ⚠️ Add `backups/` to `.gitignore` (already done)

## 🔐 Security Best Practices

1. **Encrypt backups at rest**
   - Use S3 server-side encryption
   - Or encrypt before upload: `gpg --encrypt backup.sql.gz`

2. **Secure backup files**
   ```bash
   chmod 600 backups/**/*.sql.gz
   ```

3. **Never commit backups to Git**
   - Already in `.gitignore`

4. **Test restoration monthly**
   ```bash
   # Create test database
   createdb plotzed_test

   # Restore to test
   DATABASE_URL=postgresql://localhost/plotzed_test npm run restore:latest -- --confirm

   # Verify
   psql plotzed_test -c "SELECT COUNT(*) FROM users;"

   # Clean up
   dropdb plotzed_test
   ```

## 🚨 Troubleshooting

### "pg_dump: command not found"
```bash
# Install PostgreSQL client
sudo apt-get install postgresql-client  # Ubuntu
brew install postgresql                  # macOS
```

### "Connection refused"
```bash
# Check database connection
psql $DATABASE_URL -c "SELECT version();"
```

### "Permission denied"
```bash
# Ensure user has backup permissions
# Grant in PostgreSQL:
GRANT CONNECT ON DATABASE plotzed TO your_user;
```

### "Disk space full"
```bash
# Check disk usage
df -h

# Clean old backups manually
rm backups/daily/plotzed-daily-backup-2024-*.sql.gz
```

## 📚 Full Documentation

For detailed information, see:
- **[Complete Backup Guide](docs/DATABASE_BACKUP_GUIDE.md)** - Full documentation
- **[Backup Scripts](scripts/)** - Source code

## 📞 Support

- **View logs:** `tail -f /var/log/plotzed-backup.log`
- **Check status:** `npm run backup:database -- --help`
- **Report issues:** GitHub Issues

---

## ✨ Pro Tips

1. **Monitor backup health:**
   ```bash
   # Add to your monitoring dashboard
   curl http://localhost:3000/api/admin/backups/status
   ```

2. **Get notifications:**
   ```env
   BACKUP_NOTIFICATION_EMAIL="admin@plotzed.com"
   ```

3. **Upload to cloud:**
   ```env
   BACKUP_S3_BUCKET="plotzed-backups"
   # Requires AWS CLI configured
   ```

4. **Create backup before risky operations:**
   ```bash
   # Before running migrations
   npm run backup:database
   npx prisma migrate deploy
   ```

---

**Remember:** The best backup is the one you test! 🎯
