# File Coordination Guide

> **Rule**: Both developers have full access to entire codebase. Coordinate to avoid conflicts!

## 🤝 Shared Fullstack Access

Both you and your teammate can edit **any file** in the webapp. However, to avoid merge conflicts, follow this communication guide:

---

## 📂 File Types & Coordination

### Backend Files (Usually You)
```
src/app/api/                    # All API routes
src/lib/                        # Utility libraries
src/middleware.ts               # Request middleware
prisma/                         # Database schema & migrations
src/instrumentation*.ts         # Sentry/monitoring setup
```

**Recommendation**: Notify teammate when making major changes

### Frontend Files (Usually Teammate)
```
src/components/                 # All UI components
src/app/(main)/*/page.tsx       # Page components
public/                         # Images, SVGs, fonts
src/app/globals.css             # Global styles
tailwind.config.ts              # Tailwind config
```

**Recommendation**: Notify you when making major changes

### Critical Shared Files (Always Coordinate!)
```
src/app/layout.tsx              # Root layout - affects everyone
src/types/                      # TypeScript types - affects both
package.json                    # Dependencies - affects both
README.md                       # Documentation
```

---

## 📋 Before Editing Any File

```
┌─ Need to edit a file?
│
├─ Step 1: Pull latest
│  └─ git pull origin dev
│
├─ Step 2: Check if anyone is working on it
│  └─ Ask: "Working on [filename]?"
│
├─ Step 3: Edit & test locally
│  └─ Make changes, run npm run build
│
├─ Step 4: Commit & push quickly
│  └─ git add . && git commit && git push
│
└─ Step 5: Notify
   └─ "Updated [filename], please pull"
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

| File Type | Access | Best Practice |
|-----------|--------|---------------|
| API routes | Both ✅ | Notify if major changes |
| Components | Both ✅ | Notify if major changes |
| Layout.tsx | Both ✅ | Always coordinate first! |
| Config files | Both ✅ | Always coordinate first! |
| Styles/Assets | Both ✅ | Notify if major changes |
| package.json | Both ✅ | Always coordinate first! |

**Golden Rule**: Communicate before editing! 💬
