# Git Workflow Guide - Plotzed WebApp

## Branch Structure

```
main (production)
  ↑
  └── dev (development/staging)
       ↑
       ├── feature/your-feature
       └── feature/teammate-feature
```

## Team Roles

- **You**: Backend, API, Database, Configuration
- **Teammate**: Frontend, UI Components, Styling

---

## Daily Workflow

### For You (Backend Developer)

#### 1. Start Your Day - Sync with Latest Dev
```bash
git checkout dev
git pull origin dev
git checkout -b feature/your-feature-name
```

#### 2. Work on Your Feature
```bash
# Make changes to backend/API files
git add .
git commit -m "feat: description of your changes"
```

#### 3. Before Pushing - Update from Dev
```bash
git checkout dev
git pull origin dev
git checkout feature/your-feature-name
git rebase dev  # Or: git merge dev
```

#### 4. Push Your Feature
```bash
git push origin feature/your-feature-name
```

#### 5. Create PR to Dev
- Go to GitHub
- Create Pull Request: `feature/your-feature-name` → `dev`
- Wait for review/approval
- Merge to dev

---

### For Teammate (Frontend Developer)

#### 1. Start Your Day - Sync with Latest Dev
```bash
git checkout dev
git pull origin dev
git checkout -b feature/ui-component-name
```

#### 2. Work on UI/Frontend
```bash
# Make changes to components/pages
git add .
git commit -m "ui: description of UI changes"
```

#### 3. Before Pushing - Update from Dev
```bash
git checkout dev
git pull origin dev
git checkout feature/ui-component-name
git rebase dev  # Or: git merge dev
```

#### 4. Push Your Feature
```bash
git push origin feature/ui-component-name
```

#### 5. Create PR to Dev
- Go to GitHub
- Create Pull Request: `feature/ui-component-name` → `dev`
- Wait for review/approval
- Merge to dev

---

## Avoiding Conflicts - File Ownership

### Backend Developer Files (You)
```
src/app/api/**/*
src/lib/**/*
src/middleware.ts
prisma/**/*
.env.example
package.json (dependencies)
next.config.mjs
```

### Frontend Developer Files (Teammate)
```
src/components/**/*
src/app/(main)/**/page.tsx
src/app/(main)/**/layout.tsx
public/**/*
src/styles/**/*
tailwind.config.ts
```

### Shared Files (Coordinate Before Editing)
```
src/app/layout.tsx
src/types/**/*
package.json
README.md
```

---

## Handling Conflicts

### If You Get a Merge Conflict

#### Step 1: Identify Conflicted Files
```bash
git status
```

#### Step 2: Open Conflicted Files
Look for conflict markers:
```
<<<<<<< HEAD
Your changes
=======
Their changes
>>>>>>> branch-name
```

#### Step 3: Resolve Manually
- Keep your changes if it's "your" file
- Keep their changes if it's "their" file
- Merge both if it's a shared file
- Remove conflict markers

#### Step 4: Mark as Resolved
```bash
git add <resolved-file>
git commit
```

---

## Production Deployment (Main Branch)

⚠️ **IMPORTANT**: Only `main` branch deploys to Vercel production!
- Pushing to `dev` = ❌ NO deployment
- Pushing to `main` = ✅ Vercel deploys to https://plotzed.vercel.app

### When Dev is Stable and Tested

#### Option 1: Merge Dev to Main (Recommended)
```bash
git checkout main
git pull origin main
git merge dev --no-ff -m "Release: description of features"
git push origin main
# ✅ Vercel automatically deploys to production
```

#### Option 2: Create Release PR
- Create PR: `dev` → `main`
- Review all changes
- Merge when approved
- ✅ Vercel auto-deploys main branch

#### Testing Before Production
Since `dev` doesn't auto-deploy, test locally first:
```bash
npm run build
npm run start
# Test at http://localhost:3000
```

---

## Quick Commands Cheat Sheet

### Sync Your Branch
```bash
# Get latest dev
git checkout dev && git pull origin dev

# Update your feature branch
git checkout your-feature-branch
git merge dev
```

### Discard Local Changes
```bash
git checkout .        # Discard all changes
git clean -fd         # Remove untracked files
```

### See What Changed
```bash
git status                    # What files changed
git diff                      # Line-by-line changes
git diff dev                  # Compare with dev
git log --oneline -10         # Recent commits
```

### Undo Last Commit (Keep Changes)
```bash
git reset --soft HEAD~1
```

### Force Sync with Remote (⚠️ Destructive)
```bash
git fetch origin
git reset --hard origin/dev
```

---

## Commit Message Convention

### Format
```
<type>: <description>

[optional body]
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `ui`: UI/styling changes
- `refactor`: Code refactoring
- `docs`: Documentation
- `chore`: Build/config changes
- `test`: Testing

### Examples
```bash
git commit -m "feat: add user authentication API"
git commit -m "ui: update header navigation design"
git commit -m "fix: resolve login form validation bug"
```

---

## Emergency: Merge Conflicts After Pull

### Scenario: You pulled dev and got conflicts

```bash
# 1. Check what's conflicted
git status

# 2. Option A: Abort and try rebase
git merge --abort
git rebase dev

# 3. Option B: Resolve conflicts manually
# - Edit conflicted files
# - Remove <<<<<<, ======, >>>>>> markers
git add .
git commit

# 4. Continue with your work
```

---

## Best Practices

### ✅ DO
- Pull from `dev` before starting work
- Create feature branches for all work
- Commit frequently with clear messages
- Test locally before pushing
- Coordinate on shared files
- Use Pull Requests for code review

### ❌ DON'T
- Work directly on `dev` or `main`
- Force push to shared branches
- Commit broken/untested code
- Edit your teammate's files without asking
- Merge without testing
- Push secrets or `.env` files

---

## Communication Protocol

### Before Working on Shared Files
**You**: "Hey, I need to update `src/app/layout.tsx` for auth. Are you working on it?"

**Teammate**: "No, go ahead!" OR "Yes, let me finish first"

### After Major Changes
Post in team chat:
- "Pushed cookie consent system to dev"
- "Updated main layout, please pull latest dev"

### Before Deploying to Production
1. Announce: "Planning to deploy dev → main in 30 mins"
2. Wait for teammate confirmation
3. Deploy
4. Notify team: "Deployed to production"

---

## Troubleshooting

### "Your branch is behind origin/dev"
```bash
git pull origin dev
```

### "Your branch is ahead of origin/dev"
```bash
git push origin dev
```

### "Merge conflict in package.json"
```bash
# Usually from dependencies
git checkout --theirs package.json  # Use remote version
npm install                         # Reinstall dependencies
git add package.json
git commit
```

### "File casing issues (Windows/Mac vs Linux)"
```bash
# Remove duplicate from git
git rm --cached path/to/File.tsx
git commit -m "fix: remove duplicate file casing"
git push
```

### "Accidentally committed to main"
```bash
git reset --soft HEAD~1  # Undo commit, keep changes
git stash                # Save changes
git checkout dev         # Switch to dev
git stash pop            # Restore changes
```

---

## GitHub Settings Recommendations

### Branch Protection Rules (Ask repo admin to enable)

**For `main` branch:**
- ✅ Require pull request reviews (1 reviewer)
- ✅ Require status checks (CI/CD passing)
- ✅ Require branches to be up to date
- ✅ Do not allow force push
- ✅ Do not allow deletion

**For `dev` branch:**
- ✅ Require pull request reviews (optional)
- ✅ Require status checks
- ⚠️ Allow force push (with lease) - for emergencies only

---

## Quick Reference Card

```bash
# START WORK
git checkout dev && git pull origin dev
git checkout -b feature/my-feature

# SAVE WORK
git add .
git commit -m "type: description"

# UPDATE FROM DEV
git checkout dev && git pull origin dev
git checkout feature/my-feature
git merge dev

# PUSH WORK
git push origin feature/my-feature

# DEPLOY TO PRODUCTION
git checkout main && git pull origin main
git merge dev --no-ff
git push origin main
```

---

## Support

- **Merge conflicts?** Ask in team chat
- **Lost code?** `git reflog` can help recover
- **Unsure?** Create a backup branch first: `git checkout -b backup-$(date +%Y%m%d)`

---

**Last Updated**: 2025-11-25
