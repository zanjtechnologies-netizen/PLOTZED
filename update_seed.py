#!/usr/bin/env python3
"""
Script to add id and updated_at fields to all plot upsert operations in seed.ts
"""

import re

# Read the seed file
with open('prisma/seed.ts', 'r') as f:
    content = f.read()

# Pattern to match plot upsert create blocks
# We'll add id and updated_at after the 'create: {' line
pattern = r'(prisma\.plot\.upsert\(\{\s+where: \{ slug: \'[^\']+\' \},\s+update: \{\},\s+create: \{)'

def add_fields(match):
    return match.group(1) + '\n        id: randomUUID(),'

# Add id field after create: {
content = re.sub(pattern, add_fields, content)

# Now add updated_at before the closing brace of each create block
# This is trickier - we need to find the pattern before each },\n    }),
pattern2 = r'(\s+)(meta_description: \'[^\']*\',)\n(\s+)\},\n(\s+)\}\),\n\n(\s+// )'

def add_updated_at(match):
    indent = match.group(1)
    meta_desc = match.group(2)
    return f'{indent}{meta_desc}\n{indent}updated_at: new Date(),\n{match.group(3)}}},\n{match.group(4)}}),\n\n{match.group(5)}// '

content = re.sub(pattern2, add_updated_at, content)

# Write back
with open('prisma/seed.ts', 'w') as f:
    f.write(content)

print("Updated plot records with id and updated_at fields")
