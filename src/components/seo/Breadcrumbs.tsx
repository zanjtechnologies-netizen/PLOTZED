// src/components/seo/Breadcrumbs.tsx

'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import StructuredData from './StructuredData';
import { generateBreadcrumbList, type BreadcrumbItem } from '@/lib/seo/metadata';

/**
 * Breadcrumbs Component with SEO
 * Renders visual breadcrumbs AND Schema.org BreadcrumbList structured data
 */

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export default function Breadcrumbs({ items, className = '' }: BreadcrumbsProps) {
  // Don't render if only one item (usually just "Home")
  if (items.length <= 1) {
    return null;
  }

  const breadcrumbSchema = generateBreadcrumbList(items);

  return (
    <>
      {/* Schema.org Structured Data */}
      <StructuredData data={breadcrumbSchema} />

      {/* Visual Breadcrumbs */}
      <nav
        aria-label="Breadcrumb"
        className={`flex items-center gap-2 text-sm ${className}`}
      >
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <div key={item.path} className="flex items-center gap-2">
              {isLast ? (
                <span className="text-gray-600 dark:text-gray-400" aria-current="page">
                  {item.name}
                </span>
              ) : (
                <>
                  <Link
                    href={item.path}
                    className="text-[#D8B893] hover:text-white transition-colors"
                  >
                    {item.name}
                  </Link>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </>
              )}
            </div>
          );
        })}
      </nav>
    </>
  );
}

/**
 * Example Usage:
 *
 * <Breadcrumbs
 *   items={[
 *     { name: 'Home', path: '/' },
 *     { name: 'Properties', path: '/properties' },
 *     { name: 'Villa Oak Hills', path: '/properties/123' },
 *   ]}
 * />
 */
