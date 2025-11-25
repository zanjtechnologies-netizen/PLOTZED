# File Ownership Guide

> **Rule**: Only edit files you own. Coordinate before touching shared files.

## 🔧 Backend Developer (You)

### Full Ownership
```
src/app/api/                    # All API routes
src/lib/                        # Utility libraries
src/middleware.ts               # Request middleware
prisma/                         # Database schema & migrations
src/instrumentation-client.ts   # Sentry setup
src/instrumentation.ts          # Server instrumentation
```

### Configuration Files
```
.env.example                    # Environment template
next.config.mjs                 # Next.js config
prisma.config.ts                # Prisma config
src/lib/env-validation.ts       # Env validation
src/lib/security-config.ts      # Security headers
src/lib/rate-limit-redis.ts     # Rate limiting
src/lib/auth.ts                 # Auth configuration
```

### Cookie System (Your Recent Work)
```
src/lib/cookies.ts              # Cookie utilities
src/components/cookies/         # Cookie components
src/app/(main)/cookie-policy/   # Cookie policy page
```

---

## 🎨 Frontend Developer (Teammate)

### Full Ownership
```
src/components/                 # All UI components
  ├── home/                     # Homepage sections
  ├── layout/                   # Header, Footer
  ├── plots/                    # Plot cards, listings
  └── providers/                # Context providers (review only)
```

### Pages & Routes
```
src/app/(main)/                 # Main route pages
  ├── page.tsx                  # Homepage
  ├── properties/               # Properties pages
  ├── dashboard/                # Dashboard
  └── */page.tsx                # All page components
```

### Styling & Assets
```
public/                         # Images, SVGs, fonts
  ├── images/
  └── fonts/
src/app/globals.css             # Global styles
tailwind.config.ts              # Tailwind configuration
```

---

## ⚠️ Shared Files (Coordinate First!)

### Critical Shared Files
```
src/app/layout.tsx              # Root layout
src/types/                      # TypeScript types
package.json                    # Dependencies
README.md                       # Documentation
```

### Communication Required
Before editing shared files:
1. **Check**: `git pull origin dev` (make sure it's latest)
2. **Ask**: "Are you editing [filename]?"
3. **Wait**: For confirmation
4. **Edit**: Make your changes
5. **Push**: ASAP to avoid conflicts
6. **Notify**: "Updated [filename], please pull"

---

## 📋 Quick Decision Tree

```
┌─ Need to edit a file?
│
├─ Is it in src/app/api/ or src/lib/?
│  └─ YES → You own it, go ahead ✅
│
├─ Is it in src/components/ or public/?
│  └─ YES → Teammate owns it, ask first ⚠️
│
├─ Is it src/app/layout.tsx or package.json?
│  └─ YES → Shared file, coordinate! 🚨
│
└─ Not sure?
   └─ Ask in team chat! 💬
```

---

## 🔥 Common Conflict Hotspots

### 1. package.json
**Problem**: Both adding different dependencies

**Solution**:
```bash
# After pulling with conflicts
git checkout --theirs package.json
npm install
git add package.json
git commit
```

### 2. src/app/(main)/layout.tsx
**Problem**: Both modifying imports or structure

**Solution**: Manually merge both changes

### 3. .next/ and node_modules/
**Problem**: Build artifacts causing conflicts

**Solution**: These are gitignored, shouldn't conflict

---

## ✅ Best Practices

### Before You Start Working
```bash
git checkout dev
git pull origin dev
git checkout -b feature/your-feature
```

### During Work
- **Commit often**: Don't wait until end of day
- **Descriptive messages**: "feat: add login API" not "updates"
- **Test locally**: Run `npm run build` before pushing

### Before You Push
```bash
# Sync with latest dev first
git checkout dev && git pull origin dev
git checkout your-branch
git merge dev

# Resolve conflicts if any
git add .
git commit

# Then push
git push origin your-branch
```

---

## 🆘 Emergency Contact

**Got a conflict you can't resolve?**

1. **Don't panic**
2. **Don't force push**
3. Create a backup: `git branch backup-$(date +%Y%m%d)`
4. Ask teammate in chat
5. Share screenshot of `git status`

---

## 📅 Daily Routine

### Morning (Before Work)
```bash
npm run git:sync  # or: git checkout dev && git pull origin dev
```

### During Day
```bash
git add .
git commit -m "descriptive message"
# No need to push yet
```

### End of Day
```bash
git checkout dev && git pull origin dev
git checkout your-branch
git merge dev
git push origin your-branch
```

### Before Production Deploy
```bash
# Coordinate with teammate first!
git checkout main
git pull origin main
git merge dev --no-ff
git push origin main
```

---

## 🎯 Summary

| File Type | You | Teammate | Action |
|-----------|-----|----------|--------|
| API routes | ✅ Own | ❌ No | Edit freely |
| Components | ❌ No | ✅ Own | Ask first |
| Layout.tsx | ⚠️ Share | ⚠️ Share | Coordinate |
| Config files | ✅ Own | ❌ No | Edit freely |
| Styles/Assets | ❌ No | ✅ Own | Ask first |

**Golden Rule**: When in doubt, ask! 💬
