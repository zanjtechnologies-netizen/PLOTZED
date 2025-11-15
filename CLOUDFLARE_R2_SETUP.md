# Cloudflare R2 Setup Guide

## 🚀 Migration from AWS S3 to Cloudflare R2

Your Plotzed application has been successfully migrated to use **Cloudflare R2** for file storage!

---

## ✅ What Changed

The application now uses **Cloudflare R2** instead of AWS S3. R2 is S3-compatible, so:
- ✅ All S3 SDK code remains the same
- ✅ Only configuration changes were needed
- ✅ **Zero egress fees** on R2 (vs. AWS S3's expensive egress costs)
- ✅ **Lower storage costs** ($0.015/GB vs S3's $0.023/GB)

---

## 📋 Prerequisites

1. **Cloudflare Account** (free tier available)
2. **R2 Access** (enable R2 in your Cloudflare dashboard)

---

## 🔧 Setup Steps

### Step 1: Create R2 Bucket

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navigate to **R2** in the sidebar
3. Click **"Create bucket"**
4. Enter bucket name (e.g., `plotzed-storage`)
5. Select location (automatic)
6. Click **"Create bucket"**

### Step 2: Enable Public Access (for images)

**Option A: R2.dev subdomain (Quick & Easy)**
1. In your bucket settings, click **"Settings"**
2. Under **"Public Access"**, click **"Allow Access"**
3. Click **"Connect Domain"**
4. Choose **"R2.dev subdomain"**
5. Note the URL: `https://<bucket-name>.<account-id>.r2.dev`

**Option B: Custom Domain (Recommended for Production)**
1. In your bucket settings, click **"Settings"**
2. Under **"Public Access"**, click **"Allow Access"**
3. Click **"Connect Domain"**
4. Choose **"Custom domain"**
5. Enter your domain (e.g., `cdn.plotzed.com`)
6. Add the CNAME record to your DNS settings
7. Wait for DNS propagation

### Step 3: Create API Token

1. In Cloudflare Dashboard, go to **R2** → **Overview**
2. Click **"Manage R2 API Tokens"**
3. Click **"Create API Token"**
4. Configure permissions:
   - **Token name:** `plotzed-api`
   - **Permissions:** Object Read & Write
   - **Apply to buckets:** Select your bucket
5. Click **"Create API Token"**
6. **IMPORTANT:** Copy the following:
   - Access Key ID
   - Secret Access Key
   - Endpoint URL (format: `https://<account-id>.r2.cloudflarestorage.com`)

---

## 🔐 Environment Variables

Update your `.env.local` file with these new variables:

```env
# ========================================
# Cloudflare R2 Configuration
# ========================================

# R2 Endpoint (from API token page)
R2_ENDPOINT=https://<account-id>.r2.cloudflarestorage.com

# R2 Credentials (from API token)
R2_ACCESS_KEY_ID=your_access_key_id_here
R2_SECRET_ACCESS_KEY=your_secret_access_key_here

# R2 Bucket Name
R2_BUCKET=plotzed-storage

# R2 Account ID (find in R2 dashboard URL)
R2_ACCOUNT_ID=your_account_id_here

# Public URL Configuration
# Option 1: R2.dev subdomain (if enabled)
# R2_PUBLIC_URL=https://plotzed-storage.1234567890abcdef.r2.dev

# Option 2: Custom domain (recommended)
# R2_PUBLIC_URL=https://cdn.plotzed.com
```

### How to Find Your Account ID:
1. Go to R2 Dashboard
2. Look at the URL: `https://dash.cloudflare.com/<account-id>/r2`
3. Copy the `<account-id>` part

---

## ✅ Old Environment Variables (Remove These)

```env
# ❌ Remove these AWS S3 variables
AWS_REGION=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_S3_BUCKET=
```

---

## 🧪 Testing the Setup

### 1. Test File Upload

```bash
# Start your dev server
npm run dev

# Use curl or Postman to test upload
curl -X POST http://localhost:3000/api/upload \
  -H "Cookie: your-auth-cookie" \
  -F "file=@/path/to/test-image.jpg"
```

Expected response:
```json
{
  "url": "https://plotzed-storage.1234567890abcdef.r2.dev/uploads/user-id/timestamp-image.jpg"
}
```

### 2. Test Multiple File Upload

```bash
curl -X POST http://localhost:3000/api/upload/multiple \
  -H "Cookie: your-auth-cookie" \
  -F "files=@image1.jpg" \
  -F "files=@image2.jpg" \
  -F "folder=plots"
```

### 3. Test File Deletion

```bash
curl -X POST http://localhost:3000/api/upload/delete \
  -H "Cookie: your-auth-cookie" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://plotzed-storage.1234567890abcdef.r2.dev/uploads/user-id/file.jpg"
  }'
```

---

## 🔄 Migrating Existing Files from S3 to R2

If you have existing files in AWS S3, you can migrate them:

### Option 1: Using Rclone (Recommended)

1. Install [rclone](https://rclone.org/downloads/)

2. Configure S3 remote:
```bash
rclone config
# Name: s3
# Type: s3
# Provider: AWS
# Enter your AWS credentials
```

3. Configure R2 remote:
```bash
rclone config
# Name: r2
# Type: s3
# Provider: Cloudflare
# Endpoint: <account-id>.r2.cloudflarestorage.com
# Enter your R2 credentials
```

4. Copy files:
```bash
rclone copy s3:your-bucket-name r2:plotzed-storage --progress
```

### Option 2: Using AWS CLI + R2 Endpoint

```bash
# Sync from S3 to R2
aws s3 sync s3://your-s3-bucket s3://plotzed-storage \
  --endpoint-url https://<account-id>.r2.cloudflarestorage.com \
  --profile r2
```

---

## 💰 Cost Comparison: AWS S3 vs Cloudflare R2

| Feature | AWS S3 | Cloudflare R2 | Savings |
|---------|--------|---------------|---------|
| **Storage** | $0.023/GB/month | $0.015/GB/month | **35% cheaper** |
| **Egress (Download)** | $0.09/GB | **$0.00/GB** | **100% savings!** |
| **Operations (Class A)** | $0.005/1000 | $0.0045/1000 | 10% cheaper |
| **Operations (Class B)** | $0.0004/1000 | $0.00036/1000 | 10% cheaper |

**Example for 100GB storage + 500GB monthly downloads:**
- **AWS S3:** ~$47.40/month
- **Cloudflare R2:** ~$1.50/month
- **Savings:** ~$45.90/month (97% reduction!)

---

## 🛡️ Security Best Practices

### 1. Token Permissions
✅ Use separate tokens for different environments (dev, staging, prod)
✅ Set minimum required permissions
✅ Rotate tokens regularly

### 2. Bucket Configuration
✅ Enable public access only for necessary buckets
✅ Use custom domains with HTTPS
✅ Configure CORS if needed:

```javascript
// In Cloudflare R2 bucket settings → CORS
[
  {
    "AllowedOrigins": ["https://plotzed.com"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedHeaders": ["*"],
    "MaxAgeSeconds": 3000
  }
]
```

### 3. File Organization
```
plotzed-storage/
├── plots/
│   ├── user-id-1/
│   ├── user-id-2/
├── uploads/
│   ├── user-id-1/
│   ├── user-id-2/
├── kyc/
│   ├── user-id-1/
├── documents/
```

---

## 🐛 Troubleshooting

### Issue: "Access Denied" Error

**Solution:**
1. Check API token has correct permissions
2. Verify bucket name in `.env.local`
3. Ensure token is applied to the correct bucket

### Issue: "Cannot read properties of undefined"

**Solution:**
Check all R2 environment variables are set:
```bash
echo $R2_ENDPOINT
echo $R2_ACCESS_KEY_ID
echo $R2_SECRET_ACCESS_KEY
echo $R2_BUCKET
echo $R2_ACCOUNT_ID
```

### Issue: Files Upload but URLs Don't Work

**Solution:**
1. Ensure public access is enabled on bucket
2. Check if R2.dev subdomain is activated
3. Verify DNS settings if using custom domain
4. Wait 5-10 minutes for DNS propagation

### Issue: "SignatureDoesNotMatch" Error

**Solution:**
1. Verify credentials are correct
2. Check endpoint URL format
3. Ensure no trailing slashes in endpoint

---

## 📚 Additional Resources

- [Cloudflare R2 Documentation](https://developers.cloudflare.com/r2/)
- [R2 Pricing](https://developers.cloudflare.com/r2/pricing/)
- [R2 API Reference](https://developers.cloudflare.com/r2/api/)
- [AWS SDK for JavaScript v3](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/)

---

## ✅ Migration Checklist

- [ ] Create Cloudflare account
- [ ] Enable R2
- [ ] Create R2 bucket
- [ ] Enable public access (R2.dev or custom domain)
- [ ] Generate API token
- [ ] Update `.env.local` with R2 credentials
- [ ] Remove old AWS S3 environment variables
- [ ] Test file upload
- [ ] Test file deletion
- [ ] Migrate existing files (if any)
- [ ] Update production environment variables
- [ ] Monitor for errors in production

---

## 🎉 Benefits You'll Enjoy

✅ **Zero egress fees** - Save significantly on bandwidth
✅ **Lower storage costs** - 35% cheaper than S3
✅ **S3-compatible API** - No code changes needed
✅ **Global edge network** - Faster file delivery
✅ **Simple pricing** - No complex pricing tiers
✅ **Free tier** - 10GB storage included

---

**Migration Status:** ✅ **COMPLETE**

Your application is now configured to use Cloudflare R2! Just add the environment variables and you're ready to go.

For support, check the [Cloudflare Community](https://community.cloudflare.com/c/developers/r2/76) or [Discord](https://discord.gg/cloudflaredev).
