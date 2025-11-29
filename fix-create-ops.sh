#!/bin/bash

# Add randomUUID import to files that need it
echo "Adding imports..."
sed -i '6a import { randomUUID } from '\''crypto'\''' "src/app/api/inquiries/route.ts"
sed -i '6a import { randomUUID } from '\''crypto'\''' "src/app/api/inquiries/[id]/route.ts"
sed -i '6a import { randomUUID } from '\''crypto'\''' "src/app/api/plots/route.ts"

echo "All import fixes applied!"
