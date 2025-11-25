# Vercel Branch Configuration

## Deployment Strategy

| Branch | Vercel Deployment | Purpose |
|--------|------------------|---------|
| `main` | ✅ Production | Live website at plotzed.vercel.app |
| `dev` | ❌ No deployment | Development/testing only |

---

## Configuration Steps

### 1. ✅ vercel.json File (Already Configured)

The `vercel.json` file now includes:
```json
{
  "git": {
    "deploymentEnabled": {
      "main": true,
      "dev": false
    }
  }
}
```

### 2. Vercel Dashboard Configuration

Go to: https://vercel.com/zanj-technologies/plotzed/settings/git

#### Step 1: Set Production Branch
1. Click **Settings** → **Git**
2. Under **Production Branch**, select: `main`
3. Save changes

#### Step 2: Disable Preview Deployments for Dev
1. In **Settings** → **Git**
2. Under **Ignored Build Step**, add this command:
   ```bash
   if [ "$VERCEL_GIT_COMMIT_REF" != "main" ]; then exit 1; fi
   ```
3. This prevents builds from any branch except `main`

#### Alternative: Branch Protection
1. Go to **Settings** → **Domains**
2. Ensure only `main` branch is linked to production domain

---

## How It Works

### When You Push to `dev`:
```bash
git push origin dev
```
**Result**:
- ❌ No Vercel deployment triggered
- ✅ GitHub receives the push
- ✅ Code available for review/testing

### When You Push to `main`:
```bash
git push origin main
```
**Result**:
- ✅ Vercel deployment triggered
- ✅ Builds production bundle
- ✅ Deploys to https://plotzed.vercel.app

---

## Workflow

### Daily Development (dev branch)
```bash
# Work on features in dev
git checkout dev
git pull origin dev

# Make changes
git add .
git commit -m "feat: new feature"
git push origin dev

# ❌ No Vercel deployment happens
```

### Production Deployment (main branch)
```bash
# When dev is stable and tested
git checkout main
git pull origin main
git merge dev --no-ff -m "Release: version x.x.x"
git push origin main

# ✅ Vercel deploys to production
```

---

## Testing Before Production

Since `dev` doesn't deploy, test locally:

```bash
# Run production build locally
npm run build
npm run start

# Or use Vercel CLI for preview
vercel --prod=false
```

---

## Vercel CLI Commands

```bash
# Check deployment status
vercel ls

# Deploy specific branch manually (if needed)
vercel --prod

# View production logs
vercel logs https://plotzed.vercel.app
```

---

## Emergency: Force Deploy from Dashboard

If you need to manually trigger deployment:

1. Go to: https://vercel.com/zanj-technologies/plotzed
2. Click **Deployments**
3. Click **Redeploy** on any previous `main` branch deployment

---

## Summary

✅ **Configured**: `vercel.json` prevents auto-deploy from `dev`
✅ **Next Step**: Update Vercel dashboard settings
✅ **Production**: Only `main` branch deploys automatically
✅ **Development**: Test locally or use Vercel CLI preview

---

**Last Updated**: 2025-11-25
