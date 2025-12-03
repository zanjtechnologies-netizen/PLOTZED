#!/usr/bin/env python3
"""
Add id and updated_at fields to seed.ts for new schema
"""
import re

with open('prisma/seed.ts', 'r') as f:
    content = f.read()

# Add crypto import
content = content.replace(
    "import * as bcrypt from 'bcryptjs'",
    "import * as bcrypt from 'bcryptjs'\nimport { randomUUID } from 'crypto'"
)

# For upsert operations (users and plots)
# Add id after "create: {"
content = re.sub(
    r'(create: \{)\n',
    r'\1\n        id: randomUUID(),\n',
    content
)

# For create operations (site_visits and inquiries)
# Add id after "data: {"
content = re.sub(
    r'(data: \{)\n',
    r'\1\n        id: randomUUID(),\n',
    content
)

# Add updated_at before closing braces of create blocks
# Pattern: find },\n    }), and add updated_at before the first }
content = re.sub(
    r'(\n\s+)((?:images|amenities|legal_docs|videos): \[[^\]]*\],?)\n(\s+)\},\n(\s+)\}\),',
    r'\1\2\n\1updated_at: new Date(),\n\3},\n\4}),',
    content
)

# For records without arrays at the end, look for simple field: value pattern
content = re.sub(
    r'(\n\s+)((?:rera_number|meta_description|pincode|phone|email_verified|kyc_verified|is_published|is_featured): [^,\n]+,?)\n(\s+)\},\n(\s+)\}\),',
    r'\1\2\n\1updated_at: new Date(),\n\3},\n\4}),',
    content
)

# For site_visits and inquiries (they use create instead of upsert)
# Pattern: },\n    }), for create operations
content = re.sub(
    r'(\n\s+)((?:status|source|notes): [^,\n]+,?)\n(\s+)\},\n(\s+)\}\),',
    r'\1\2\n\1updated_at: new Date(),\n\3},\n\4}),',
    content
)

with open('prisma/seed.ts', 'w') as f:
    f.write(content)

print("✅ Added id and updated_at fields to seed.ts")
