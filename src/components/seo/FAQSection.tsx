// src/components/seo/FAQSection.tsx

'use client';

import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import StructuredData from './StructuredData';
import { generateFAQSchema, type FAQItem } from '@/lib/seo/schemas';

interface FAQSectionProps {
  faqs: FAQItem[];
  title?: string;
  description?: string;
}

/**
 * FAQ Section Component with Schema.org structured data
 * Includes FAQ rich snippets for search engines
 */
export default function FAQSection({ faqs, title = 'Frequently Asked Questions', description }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 bg-white">
      <StructuredData data={generateFAQSchema(faqs)} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#112250] mb-4">{title}</h2>
          {description && <p className="text-gray-600 text-lg">{description}</p>}
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg overflow-hidden hover:border-[#D8B893] transition-colors"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between p-6 text-left bg-white hover:bg-gray-50 transition-colors"
                aria-expanded={openIndex === index}
              >
                <span className="text-lg font-semibold text-[#112250] pr-8">{faq.question}</span>
                <ChevronDown
                  className={`w-6 h-6 text-[#006DB8] transition-transform flex-shrink-0 ${
                    openIndex === index ? 'transform rotate-180' : ''
                  }`}
                />
              </button>
              {openIndex === index && (
                <div className="px-6 pb-6 text-gray-700 leading-relaxed">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * Usage example:
 *
 * const propertyFAQs = [
 *   {
 *     question: 'What is the process for buying a plot?',
 *     answer: 'The process involves site visit, documentation verification, payment, and registration...',
 *   },
 *   {
 *     question: 'Do you provide financing options?',
 *     answer: 'Yes, we have tie-ups with major banks and financial institutions...',
 *   },
 * ];
 *
 * <FAQSection faqs={propertyFAQs} />
 */
