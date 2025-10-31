This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

// ================================================
// Security Checklist
// ================================================

/*
✅ Rate Limiting
  - Per-route configuration
  - IP-based tracking
  - Redis for production
  
✅ Authentication
  - JWT tokens in HTTP-only cookies
  - Role-based access control
  - Protected routes via middleware
  
✅ Data Encryption
  - AES-256-GCM for sensitive data
  - Bcrypt for passwords
  - Hashed phone numbers for indexing
  
✅ Input Validation
  - Zod schemas for all inputs
  - Type-safe validation
  - Client and server-side validation
  
✅ Security Headers
  - CSP, X-Frame-Options, HSTS
  - XSS protection
  - Referrer policy
  
✅ Attack Prevention
  - SQL injection (Prisma parameterized queries)
  - XSS (React auto-escaping + CSP)
  - CSRF (SameSite cookies)
  - Directory traversal blocking
  
✅ Monitoring
  - Suspicious activity logging
  - Failed login tracking
  - API usage monitoring
*/
