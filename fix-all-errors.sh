#!/bin/bash

# Fix UserModal.tsx - change users to user in interface
sed -i '15s/users: any/user: any/' "src/components/admin/UserModal.tsx"

# Fix site-visits/route.ts - add missing fields
cat > temp_site_visits_fix.txt << 'EOF'
import { randomUUID } from 'crypto'
EOF

# Add import to site-visits route
sed -i '4a import { randomUUID } from '\''crypto'\''' "src/app/api/site-visits/route.ts"

# Fix the create statement with id and updated_at
sed -i 's/const siteVisit = await prisma.site_visits.create({/const siteVisit = await prisma.site_visits.create({\n      data: {\n        id: randomUUID(),\n        updated_at: new Date(),/' "src/app/api/site-visits/route.ts"

# Fix the .plot reference to .plots
sed -i 's/siteVisit\.plot\./siteVisit.plots./g' "src/app/api/site-visits/route.ts"

echo "All fixes applied!"
