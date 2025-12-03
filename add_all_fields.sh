#!/bin/bash
# Comprehensive script to add id and updated_at to ALL records in seed.ts

cd /Users/Apple/Downloads/PLOTZED-main

# Backup the file first
cp prisma/seed.ts prisma/seed.ts.backup

# Add id after every "create: {" (for plots)
perl -i -pe 's/(^\s+create: \{)$/$1\n        id: randomUUID(),/g' prisma/seed.ts

# Add id after every "data: {" (for site_visits and inquiries)
perl -i -pe 's/(^\s+data: \{)$/$1\n        id: randomUUID(),/g' prisma/seed.ts

# Add updated_at before every closing brace of upsert/create blocks
# For plots: add before },\n    }),
perl -i -0777 -pe 's/(rera_number: [^\n]+,)\n(\s+)\},\n(\s+)\}\),/$1\n$2updated_at: new Date(),\n$2},\n$3}),/g' prisma/seed.ts

# For plots without rera_number: add before },\n    }),
perl -i -0777 -pe 's/(images: \[[^\]]*\],)\n(\s+)\},\n(\s+)\}\),(?!\n\s+updated_at)/$1\n$2updated_at: new Date(),\n$2},\n$3}),/g' prisma/seed.ts

# For site_visits: add before },\n    }),
perl -i -0777 -pe 's/(status: .(?:PENDING|CONFIRMED|COMPLETED|CANCELLED|RESCHEDULED).,)\n(\s+)\},\n(\s+)\}\),(?!\n\s+updated_at)/$1\n$2updated_at: new Date(),\n$2},\n$3}),/g' prisma/seed.ts

# For inquiries: add before },\n    }),
perl -i -0777 -pe 's/((?:source|plot_id): [^\n]+,)\n(\s+)\},\n(\s+)\}\),(?!\n\s+updated_at)/$1\n$2updated_at: new Date(),\n$2},\n$3}),/g' prisma/seed.ts

echo "✅ Added id and updated_at to all records"
