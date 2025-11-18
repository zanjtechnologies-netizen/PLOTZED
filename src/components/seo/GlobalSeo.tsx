// src/components/seo/GlobalSeo.tsx

import StructuredData from './StructuredData';
import {
  generateOrganizationSchema,
  generateWebsiteSchema,
  generateLocalBusinessSchema,
} from '@/lib/seo/schemas';

/**
 * GlobalSeo Component
 * Adds global Schema.org structured data to every page
 * Should be included in the root layout
 */

export default function GlobalSeo() {
  const organizationSchema = generateOrganizationSchema();
  const websiteSchema = generateWebsiteSchema();
  const localBusinessSchema = generateLocalBusinessSchema();

  return (
    <StructuredData
      data={[organizationSchema, websiteSchema, localBusinessSchema]}
    />
  );
}

/**
 * Usage in app/layout.tsx:
 *
 * import GlobalSeo from '@/components/seo/GlobalSeo';
 *
 * export default function RootLayout({ children }) {
 *   return (
 *     <html>
 *       <head>
 *         <GlobalSeo />
 *       </head>
 *       <body>{children}</body>
 *     </html>
 *   );
 * }
 */
