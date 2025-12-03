#!/usr/bin/env node
/**
 * Script to add id and updated_at fields to all records in seed.ts
 */

const fs = require('fs');
const path = require('path');

const seedPath = path.join(__dirname, 'prisma', 'seed.ts');
let content = fs.readFileSync(seedPath, 'utf8');

// 1. Add crypto import
if (!content.includes("import { randomUUID } from 'crypto'")) {
    content = content.replace(
        "import * as bcrypt from 'bcryptjs'",
        "import * as bcrypt from 'bcryptjs'\nimport { randomUUID } from 'crypto'"
    );
}

// 2. Add id and updated_at to admin user
content = content.replace(
    /const admin = await prisma\.users\.upsert\(\{\s+where: \{ email: 'plotzedrealestate@gmail\.com' \},\s+update: \{\},\s+create: \{/,
    `const admin = await prisma.users.upsert({
    where: { email: 'plotzedrealestate@gmail.com' },
    update: {},
    create: {
      id: randomUUID(),`
);

content = content.replace(
    /(email: 'plotzedrealestate@gmail\.com',[\s\S]*?kyc_verified: true,)/,
    `$1
      updated_at: new Date(),`
);

// 3. Add id and updated_at to customer users (3 instances)
const customerEmails = ['rajesh.kumar@example.com', 'priya.sharma@example.com', 'amit.patel@example.com'];
customerEmails.forEach(email => {
    const emailEscaped = email.replace(/\./g, '\\.');
    content = content.replace(
        new RegExp(`prisma\\.users\\.upsert\\(\\{\\s+where: \\{ email: '${emailEscaped}' \\},\\s+update: \\{\\},\\s+create: \\{`),
        `prisma.users.upsert({
      where: { email: '${email}' },
      update: {},
      create: {
        id: randomUUID(),`
    );
});

// Add updated_at after kyc_verified for all users
let userMatches = 0;
content = content.replace(/kyc_verified: (true|false),\n(\s+)\},\n(\s+)\}\),/g, (match, value, indent1, indent2) => {
    userMatches++;
    if (userMatches <= 4) { // Admin + 3 customers
        return `kyc_verified: ${value},\n${indent1}updated_at: new Date(),\n${indent1}},\n${indent2}),`;
    }
    return match;
});

// 4. Add id and updated_at to all plots
content = content.replace(/prisma\.plots\.upsert\(\{\s+where: \{ slug: '([^']+)' \},\s+update: \{\},\s+create: \{/g,
    (match, slug) => {
        return `prisma.plots.upsert({
      where: { slug: '${slug}' },
      update: {},
      create: {
        id: randomUUID(),`;
    }
);

// Add updated_at before closing brace of plot creates
// Look for patterns like: rera_number: 'XXX',\n      },\n    }),
content = content.replace(/(rera_number: '[^']*',)\n(\s+)\},\n(\s+)\}\),\n\s+(?:prisma\.plots|\/\/)/g,
    (match, reraLine, indent1, indent2) => {
        return `${reraLine}\n${indent1}updated_at: new Date(),\n${indent1}},\n${indent2}),\n    ${match.includes('prisma.plots') ? 'prisma.plots' : '//'}`;
    }
);

// For plots without rera_number, look for other ending patterns
content = content.replace(/(images: \[[^\]]*\],)\n(\s+)\},\n(\s+)\}\),\n\s+(?:prisma\.plots|\/\/|\])/g,
    (match, imagesLine, indent1, indent2) => {
        if (!match.includes('updated_at')) {
            return `${imagesLine}\n${indent1}updated_at: new Date(),\n${indent1}},\n${indent2}),\n    ${match.includes('prisma.plots') ? 'prisma.plots' : match.includes('//') ? '//' : ']'}`;
        }
        return match;
    }
);

// 5. Add id and updated_at to site visits
content = content.replace(/prisma\.site_visits\.create\(\{\s+data: \{/g,
    `prisma.site_visits.create({
      data: {
        id: randomUUID(),`
);

content = content.replace(/(status: '(?:PENDING|CONFIRMED|COMPLETED|CANCELLED|RESCHEDULED)',)\n(\s+)\},\n(\s+)\}\),/g,
    `$1\n$2updated_at: new Date(),\n$2},\n$3}),`
);

// 6. Add id and updated_at to inquiries
content = content.replace(/prisma\.inquiries\.create\(\{\s+data: \{/g,
    `prisma.inquiries.create({
      data: {
        id: randomUUID(),`
);

content = content.replace(/(source: '(?:website|phone)',)\n(\s+)\},\n(\s+)\}\),/g,
    `$1\n$2updated_at: new Date(),\n$2},\n$3}),`
);

// For inquiries without plot_id (third inquiry)
content = content.replace(/(plot_id: plots\[\d+\]\.id,)\n(\s+)\},\n(\s+)\}\),/g,
    `$1\n$2updated_at: new Date(),\n$2},\n$3}),`
);

fs.writeFileSync(seedPath, content, 'utf8');
console.log('✅ Successfully added id and updated_at fields to seed.ts');
