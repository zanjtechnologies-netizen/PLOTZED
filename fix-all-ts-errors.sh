#!/bin/bash

echo "Fixing all TypeScript errors..."

# Fix dashboard/page.tsx - change .plot to .plots
sed -i 's/visit\.plot\./visit.plots./g' "src/app/dashboard/page.tsx"

# Fix all admin API files - change .user to .users and .plot to .plots
find src/app/api/admin -name "*.ts" -exec sed -i 's/inquiry\.user\b/inquiry.users/g; s/inquiry\.plot\b/inquiry.plots/g; s/siteVisit\.user\b/siteVisit.users/g; s/siteVisit\.plot\b/siteVisit.plots/g; s/visit\.user\b/visit.users/g; s/visit\.plot\b/visit.plots/g' {} \;

# Fix site-visits API - change .user to .users and .plot to .plots  
sed -i 's/visit\.user\b/visit.users/g; s/visit\.plot\b/visit.plots/g; s/siteVisit\.user\b/siteVisit.users/g; s/siteVisit\.plot\b/siteVisit.plots/g' "src/app/api/site-visits/[id]/route.ts"

# Fix inquiries API - change .plot to .plots
sed -i 's/inquiry\.plot\b/inquiry.plots/g' "src/app/api/inquiries/route.ts"

# Fix inquiries API - change activityLog to activity_logs
find src/app/api -name "*.ts" -exec sed -i 's/prisma\.activityLog/prisma.activity_logs/g' {} \;

echo "All fixes applied!"
