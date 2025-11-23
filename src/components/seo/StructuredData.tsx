// src/components/seo/StructuredData.tsx

/**
 * StructuredData Component
 * Renders Schema.org JSON-LD structured data in pages
 *
 * Usage:
 * <StructuredData data={generateOrganizationSchema()} />
 */

interface StructuredDataProps {
  data: object | object[];
}

export default function StructuredData({ data }: StructuredDataProps) {
  const jsonLd = Array.isArray(data) ? data : [data];

  return (
    <>
      {jsonLd.map((item, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}
    </>
  );
}

/**
 * Example Usage in a page:
 *
 * import StructuredData from '@/components/seo/StructuredData';
 * import { generateOrganizationSchema } from '@/lib/seo/schemas';
 *
 * export default function Page() {
 *   return (
 *     <>
 *       <StructuredData data={generateOrganizationSchema()} />
 *       <div>Your page content</div>
 *     </>
 *   );
 * }
 */
