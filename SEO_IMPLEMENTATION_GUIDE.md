# SEO Implementation Guide - Plotzed Real Estate

This guide explains how to use the custom SEO system built into Plotzed application.

## 📋 Table of Contents

1. [Quick Start](#quick-start)
2. [Core Features](#core-features)
3. [Implementation Examples](#implementation-examples)
4. [Phase 2 Features (Coming Soon)](#phase-2-features)
5. [Best Practices](#best-practices)
6. [Troubleshooting](#troubleshooting)

---

## 🚀 Quick Start

### 1. Set Environment Variables

Add these to your `.env.local` and Vercel environment variables:

```bash
# REQUIRED
NEXT_PUBLIC_SITE_URL="https://plotzedrealestate.com"

# OPTIONAL
NEXT_PUBLIC_DEFAULT_OG_IMAGE="/images/og-default.jpg"
NEXT_PUBLIC_GA_MEASUREMENT_ID="G-XXXXXXXXXX"
NEXT_PUBLIC_VERCEL_ANALYTICS="true"
NEXT_PUBLIC_CLARITY_PROJECT_ID="your-clarity-id"
```

### 2. Add Global SEO to Root Layout

Update `src/app/layout.tsx`:

```tsx
import { GlobalSeo } from '@/components/seo';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <GlobalSeo />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

### 3. Add Metadata to Pages

Update your page files (e.g., `src/app/page.tsx`):

```tsx
import { generateMetadata as createMetadata } from '@/lib/seo/metadata';

export const metadata = createMetadata({
  title: 'Premium Plots & Villas',
  description: 'Discover premium residential plots...',
  path: '/',
});

export default function HomePage() {
  return <div>Your content</div>;
}
```

✅ **Done!** Your pages now have:
- Optimized meta tags
- Open Graph tags for social sharing
- Twitter Card tags
- Structured data (Schema.org)
- Dynamic sitemap at `/sitemap.xml`
- Robots.txt at `/robots.txt`

---

## 🎯 Core Features

### 1. **Meta Tag Management**

Location: `src/lib/seo/metadata.ts`

#### Basic Page Metadata

```tsx
import { generateMetadata } from '@/lib/seo/metadata';

export const metadata = generateMetadata({
  title: 'About Us',
  description: 'Learn about Plotzed Real Estate...',
  path: '/about',
});
```

#### Property Page Metadata

```tsx
import { generatePropertyMetadata } from '@/lib/seo/metadata';

export async function generateMetadata({ params }) {
  const property = await getProperty(params.id);

  return generatePropertyMetadata({
    id: property.id,
    title: property.name,
    description: property.description,
    price: property.price,
    location: property.location,
    type: property.type,
    images: property.images,
    squareFeet: property.squareFeet,
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    availability: property.availability,
  });
}
```

#### Blog Article Metadata

```tsx
import { generateArticleMetadata } from '@/lib/seo/metadata';

export const metadata = generateArticleMetadata({
  title: 'How to Buy Your First Plot',
  description: 'A comprehensive guide...',
  author: 'John Doe',
  publishedTime: '2024-01-15',
  tags: ['real estate', 'property', 'guide'],
  slug: 'how-to-buy-first-plot',
});
```

#### Property Listing Page Metadata

```tsx
import { generateListingMetadata } from '@/lib/seo/metadata';

export const metadata = generateListingMetadata({
  type: 'Villa',
  location: 'Oak Hills',
  minPrice: 5000000,
  maxPrice: 10000000,
  count: 12,
});
// Result: "Villas for Sale in Oak Hills | ₹50,00,000 - ₹1,00,00,000 | 12 properties available"
```

---

### 2. **Schema.org Structured Data**

Location: `src/lib/seo/schemas/`

#### Property Listing Schema

```tsx
import { StructuredData } from '@/components/seo';
import { generateRealEstateListingSchema } from '@/lib/seo/schemas';

export default async function PropertyPage({ params }) {
  const property = await getProperty(params.id);

  const schema = generateRealEstateListingSchema({
    id: property.id,
    name: property.name,
    description: property.description,
    price: property.price,
    currency: 'INR',
    images: property.images,
    address: {
      streetAddress: property.address,
      addressLocality: property.city,
      addressRegion: property.state,
      postalCode: property.zipCode,
      addressCountry: 'IN',
    },
    geo: {
      latitude: property.latitude,
      longitude: property.longitude,
    },
    propertyType: 'Residential',
    numberOfBedrooms: property.bedrooms,
    numberOfBathroomsTotal: property.bathrooms,
    floorSize: {
      value: property.squareFeet,
      unitCode: 'SQF',
    },
    availability: property.status,
    features: ['Swimming Pool', 'Parking', 'Garden'],
    ratings: {
      ratingValue: 4.5,
      reviewCount: 24,
    },
  });

  return (
    <>
      <StructuredData data={schema} />
      <div>{/* Your page content */}</div>
    </>
  );
}
```

#### Blog Article Schema

```tsx
import { generateBlogPostingSchema } from '@/lib/seo/schemas';

const articleSchema = generateBlogPostingSchema({
  title: 'Real Estate Investment Tips',
  description: 'Learn how to invest wisely...',
  content: articleContent,
  author: {
    name: 'John Doe',
    url: '/authors/john-doe',
    image: '/authors/john-doe.jpg',
  },
  publishedDate: '2024-01-15',
  modifiedDate: '2024-01-20',
  image: '/blog/real-estate-tips.jpg',
  tags: ['real estate', 'investment'],
  slug: 'real-estate-investment-tips',
});

// Use in component
<StructuredData data={articleSchema} />
```

#### FAQ Schema

```tsx
import { generateFaqSchema } from '@/lib/seo/schemas';

const faqSchema = generateFaqSchema([
  {
    question: 'How do I book a property?',
    answer: 'You can book a property by visiting our properties page...',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept bank transfers, UPI, and financing options.',
  },
]);

<StructuredData data={faqSchema} />
```

#### How-To Schema (for guides)

```tsx
import { generateHowToSchema } from '@/lib/seo/schemas';

const howToSchema = generateHowToSchema({
  name: 'How to Schedule a Site Visit',
  description: 'Step-by-step guide to booking a site visit',
  totalTime: 'PT10M', // 10 minutes
  image: '/guides/site-visit.jpg',
  steps: [
    {
      name: 'Browse Properties',
      text: 'Visit our properties page and select your preferred plot.',
      image: '/steps/browse.jpg',
    },
    {
      name: 'Click "Schedule Visit"',
      text: 'Click the Schedule Visit button on the property page.',
    },
    {
      name: 'Select Date & Time',
      text: 'Choose your preferred date and time slot.',
    },
    {
      name: 'Confirm Booking',
      text: 'Receive confirmation via email and SMS.',
    },
  ],
});

<StructuredData data={howToSchema} />
```

---

### 3. **Breadcrumbs with Structured Data**

Location: `src/components/seo/Breadcrumbs.tsx`

```tsx
import { Breadcrumbs } from '@/components/seo';

export default function PropertyPage() {
  return (
    <div>
      <Breadcrumbs
        items={[
          { name: 'Home', path: '/' },
          { name: 'Properties', path: '/properties' },
          { name: 'Villa Oak Hills', path: '/properties/123' },
        ]}
      />
      {/* Rest of your page */}
    </div>
  );
}
```

This renders:
- Visual breadcrumb navigation
- Schema.org BreadcrumbList structured data (automatically)

---

### 4. **Dynamic Sitemap**

Location: `src/app/sitemap.ts`

✅ **Automatically generated** from your database!

Access at: `https://yourdomain.com/sitemap.xml`

**What's included:**
- Homepage
- Static pages (login, register, dashboard)
- All available plots
- All available properties

**Configuration:** Edit `src/lib/seo/config.ts`:

```ts
sitemap: {
  changefreq: {
    homepage: 'daily',
    properties: 'weekly',
    pages: 'monthly',
  },
  priority: {
    homepage: 1.0,
    properties: 0.9,
    propertyDetails: 0.8,
    pages: 0.7,
  },
}
```

---

### 5. **Robots.txt**

Location: `src/app/robots.ts`

✅ **Automatically configured!**

Access at: `https://yourdomain.com/robots.txt`

**Default configuration:**
- ✅ Allow all crawlers
- ❌ Disallow `/admin`, `/dashboard`, `/api`
- ❌ Disallow auth pages (`/login`, `/register`, etc.)
- ✅ Allow `/properties`, `/plots`
- Points to sitemap automatically

---

### 6. **Utility Functions**

#### Validate Meta Description

```tsx
import { validateMetaDescription } from '@/lib/seo/metadata';

const validation = validateMetaDescription('Your description here');
console.log(validation);
// {
//   isValid: true,
//   length: 145,
//   recommendation: "Perfect length!"
// }
```

#### Validate Meta Title

```tsx
import { validateMetaTitle } from '@/lib/seo/metadata';

const validation = validateMetaTitle('Your page title');
console.log(validation);
// {
//   isValid: true,
//   length: 52,
//   recommendation: "Perfect length!"
// }
```

#### Extract Keywords

```tsx
import { extractKeywords } from '@/lib/seo/metadata';

const keywords = extractKeywords(
  'This is a long article about real estate investment...',
  10
);
console.log(keywords);
// ['real', 'estate', 'investment', 'property', ...]
```

---

## 📚 Implementation Examples

### Example 1: Homepage with SEO

```tsx
// src/app/page.tsx
import { generateMetadata as createMetadata } from '@/lib/seo/metadata';
import { StructuredData } from '@/components/seo';
import { generatePropertyListSchema } from '@/lib/seo/schemas';

export const metadata = createMetadata({
  title: 'Premium Plots & Villas for Sale',
  description: 'Discover premium residential plots and villas in prime locations...',
  path: '/',
});

export default async function HomePage() {
  const featuredProperties = await getFeaturedProperties();

  const propertiesSchema = generatePropertyListSchema(
    featuredProperties.map((p) => ({
      id: p.id,
      name: p.name,
      description: p.description,
      price: p.price,
      images: p.images,
      address: p.address,
      propertyType: 'Residential',
    }))
  );

  return (
    <>
      <StructuredData data={propertiesSchema} />
      <div>{/* Your homepage content */}</div>
    </>
  );
}
```

---

### Example 2: Property Details Page

```tsx
// src/app/properties/[id]/page.tsx
import { generatePropertyMetadata } from '@/lib/seo/metadata';
import { StructuredData, Breadcrumbs } from '@/components/seo';
import { generateRealEstateListingSchema } from '@/lib/seo/schemas';

export async function generateMetadata({ params }) {
  const property = await getProperty(params.id);

  return generatePropertyMetadata({
    id: property.id,
    title: property.name,
    description: property.description,
    price: property.price,
    location: property.location,
    type: property.type,
    images: property.images,
    squareFeet: property.area,
    availability: property.status,
  });
}

export default async function PropertyPage({ params }) {
  const property = await getProperty(params.id);

  const schema = generateRealEstateListingSchema({
    id: property.id,
    name: property.name,
    description: property.description,
    price: property.price,
    currency: 'INR',
    images: property.images,
    address: {
      addressLocality: property.city,
      addressRegion: property.state,
      addressCountry: 'IN',
    },
    propertyType: 'Residential',
    floorSize: { value: property.area, unitCode: 'SQF' },
    availability: property.status,
  });

  return (
    <>
      <StructuredData data={schema} />
      <Breadcrumbs
        items={[
          { name: 'Home', path: '/' },
          { name: 'Properties', path: '/properties' },
          { name: property.name, path: `/properties/${property.id}` },
        ]}
      />
      <div>{/* Property details */}</div>
    </>
  );
}
```

---

### Example 3: Properties Listing Page

```tsx
// src/app/properties/page.tsx
import { generateListingMetadata } from '@/lib/seo/metadata';

export const metadata = generateListingMetadata({
  type: 'Residential Plot',
  location: 'Bangalore',
  count: 25,
  minPrice: 3000000,
  maxPrice: 8000000,
});

export default function PropertiesPage() {
  return <div>{/* Properties grid */}</div>;
}
```

---

## 🔮 Phase 2 Features (Coming Soon)

### 1. **Google Search Console Integration**

```tsx
// Future: src/lib/seo/google-search-console.ts
import { getSearchAnalytics } from '@/lib/seo/google-search-console';

const analytics = await getSearchAnalytics({
  startDate: '2024-01-01',
  endDate: '2024-01-31',
});

console.log(analytics);
// {
//   clicks: 12450,
//   impressions: 150320,
//   ctr: 0.083,
//   position: 4.2,
//   topQueries: [...],
//   topPages: [...]
// }
```

### 2. **Core Web Vitals Tracking**

```tsx
// Future: src/lib/seo/web-vitals.ts
import { reportWebVitals } from '@/lib/seo/web-vitals';

reportWebVitals({
  lcp: 1200,
  fid: 45,
  cls: 0.05,
});
// Stores in database for admin dashboard
```

### 3. **SEO Health Checker**

```tsx
// Future: src/lib/seo/audit.ts
import { runSeoAudit } from '@/lib/seo/audit';

const audit = await runSeoAudit('/properties/123');
console.log(audit);
// {
//   score: 85,
//   issues: [
//     { type: 'missing_alt', message: '3 images missing alt text' },
//     { type: 'slow_page', message: 'Page load time: 3.2s (should be < 2.5s)' }
//   ],
//   recommendations: [...]
// }
```

### 4. **SEO Dashboard (Admin Panel)**

Access at: `/admin/seo` (Coming in Phase 2)

**Features:**
- Search performance analytics (GSC data)
- Core Web Vitals monitoring
- SEO health score
- Page-level SEO editor
- Ranking tracker
- Automated reports

---

## ✅ Best Practices

### 1. **Meta Descriptions**

✅ **DO:**
- Keep between 120-160 characters
- Include target keywords naturally
- Make it compelling (users should want to click)
- Unique for every page

❌ **DON'T:**
- Stuff keywords
- Use generic descriptions
- Go over 160 characters (gets truncated in search results)

### 2. **Page Titles**

✅ **DO:**
- Keep between 50-60 characters
- Put important keywords first
- Include brand name at the end
- Make it unique for every page

❌ **DON'T:**
- Exceed 60 characters
- Use ALL CAPS
- Keyword stuff

### 3. **Structured Data**

✅ **DO:**
- Add RealEstateListing schema to all property pages
- Add BreadcrumbList to all pages (use Breadcrumbs component)
- Add FAQ schema to FAQ sections
- Test with [Google Rich Results Test](https://search.google.com/test/rich-results)

### 4. **Images**

✅ **DO:**
- Optimize images (use Next.js Image component)
- Add descriptive alt text to all images
- Use WebP or AVIF format
- Lazy load images

### 5. **Internal Linking**

✅ **DO:**
- Link related properties
- Use descriptive anchor text
- Add breadcrumbs to all pages
- Create content hub pages (property guides, location pages)

---

## 🐛 Troubleshooting

### Issue: Sitemap not showing all pages

**Solution:** Check Prisma queries in `src/app/sitemap.ts`. Make sure database connection is working.

### Issue: Metadata not appearing in Google

**Solution:**
1. Submit sitemap to Google Search Console
2. Request indexing for specific pages
3. Wait 24-48 hours for Google to crawl

### Issue: Structured data errors

**Solution:**
1. Test with [Google Rich Results Test](https://search.google.com/test/rich-results)
2. Check required fields in schema
3. Validate JSON-LD syntax

### Issue: Robots.txt blocking pages

**Solution:** Check `src/app/robots.ts` configuration. Make sure important pages are in `allow` list.

---

## 🚀 Next Steps

1. ✅ Set `NEXT_PUBLIC_SITE_URL` in environment variables
2. ✅ Add `<GlobalSeo />` to root layout
3. ✅ Add metadata to all pages using helpers
4. ✅ Test sitemap: `https://yourdomain.com/sitemap.xml`
5. ✅ Test robots.txt: `https://yourdomain.com/robots.txt`
6. ✅ Submit sitemap to Google Search Console
7. ⏳ Wait for Phase 2 features (Google Search Console integration, Web Vitals, SEO Dashboard)

---

## 📖 Additional Resources

- [Google SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)
- [Schema.org Documentation](https://schema.org/)
- [Next.js Metadata API](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)
- [Google Search Console](https://search.google.com/search-console)
- [Google Rich Results Test](https://search.google.com/test/rich-results)

---

**Questions?** Check `src/lib/seo/` for implementation details or create an issue in the repository.
