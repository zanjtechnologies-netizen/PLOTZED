'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ChevronDown } from 'lucide-react';
import { COOKIE_LIST, type CookieCategory } from '@/lib/cookies';

const categoryInfo: Record<CookieCategory, { label: string; description: string }> = {
  necessary: {
    label: 'Necessary Cookies',
    description: 'These cookies are essential for the website to function properly. They enable basic functions like page navigation and access to secure areas of the website.',
  },
  preferences: {
    label: 'Preference Cookies',
    description: 'These cookies allow the website to remember choices you make (such as your language preference) and provide enhanced, more personalized features.',
  },
  analytics: {
    label: 'Analytics Cookies',
    description: 'These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.',
  },
  marketing: {
    label: 'Marketing Cookies',
    description: 'These cookies are used to track visitors across websites to display relevant advertisements.',
  },
};

function CookieTable({ category }: { category: CookieCategory }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const cookies = COOKIE_LIST.filter((c) => c.category === category);
  const info = categoryInfo[category];

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden mb-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
      >
        <div>
          <h3 className="font-semibold text-gray-900">{info.label}</h3>
          <p className="text-sm text-gray-600 mt-1">
            {cookies.length} {cookies.length === 1 ? 'cookie' : 'cookies'}
          </p>
        </div>
        <ChevronDown
          className={`w-5 h-5 text-gray-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
        />
      </button>

      {isExpanded && (
        <div className="p-4 bg-white border-t border-gray-300">
          <p className="text-sm text-gray-700 mb-4">{info.description}</p>

          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-gray-300">
                  <th className="text-left py-2 px-3 font-semibold text-gray-700">Name</th>
                  <th className="text-left py-2 px-3 font-semibold text-gray-700">Provider</th>
                  <th className="text-left py-2 px-3 font-semibold text-gray-700">Type</th>
                  <th className="text-left py-2 px-3 font-semibold text-gray-700">Duration</th>
                  <th className="text-left py-2 px-3 font-semibold text-gray-700">Description</th>
                </tr>
              </thead>
              <tbody>
                {cookies.map((cookie) => (
                  <tr key={cookie.name} className="border-b border-gray-200 last:border-0">
                    <td className="py-2 px-3 font-mono text-xs">{cookie.name}</td>
                    <td className="py-2 px-3">{cookie.provider}</td>
                    <td className="py-2 px-3">
                      <span className="text-xs">
                        {cookie.type === 'first-party' ? '1st party' : '3rd party'}
                      </span>
                    </td>
                    <td className="py-2 px-3">{cookie.duration}</td>
                    <td className="py-2 px-3 text-gray-600">{cookie.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CookiePolicyPage() {
  const currentDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Simple Header */}
      <div className="bg-[#112250] text-white py-12">
        <div className="container-custom max-w-4xl">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold">Cookie Policy</h1>
          <p className="text-white/70 mt-2">Last updated: {currentDate}</p>
        </div>
      </div>

      {/* Content */}
      <div className="container-custom max-w-4xl py-12">
        <div className="prose prose-gray max-w-none">

          {/* Introduction */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">What are cookies?</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Cookies are small text files that are placed on your computer or mobile device when you visit a website.
              They are widely used to make websites work more efficiently and provide information to the owners of the site.
            </p>
            <p className="text-gray-700 leading-relaxed">
              We use both first-party cookies (set by Plotzed) and third-party cookies (set by our partners) to provide
              you with the best possible experience on our website.
            </p>
          </section>

          {/* How we use cookies */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">How we use cookies</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We use cookies for the following purposes:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>To keep you signed in to your account</li>
              <li>To remember your preferences and settings</li>
              <li>To understand how you use our website</li>
              <li>To improve our services based on your behavior</li>
              <li>To show you relevant advertisements</li>
              <li>To measure the effectiveness of our marketing campaigns</li>
            </ul>
          </section>

          {/* Cookie categories */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Types of cookies we use</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Below you can see detailed information about each type of cookie we use:
            </p>

            <CookieTable category="necessary" />
            <CookieTable category="preferences" />
            <CookieTable category="analytics" />
            <CookieTable category="marketing" />
          </section>

          {/* Managing cookies */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Managing your cookie preferences</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              You have control over which cookies you accept. You can manage your preferences in the following ways:
            </p>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-4">
              <h3 className="font-semibold text-gray-900 mb-2">On our website</h3>
              <p className="text-gray-700 text-sm">
                Use our cookie consent banner to accept, reject, or customize your cookie preferences when you first visit the site.
              </p>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-2">In your browser</h3>
              <p className="text-gray-700 text-sm mb-3">
                Most browsers allow you to control cookies through their settings. You can delete existing cookies
                and set your browser to block future cookies.
              </p>
              <p className="text-sm text-gray-600">
                Learn more about managing cookies in:
              </p>
              <ul className="mt-2 space-y-1 text-sm">
                <li>
                  <a
                    href="https://support.google.com/chrome/answer/95647"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Google Chrome
                  </a>
                </li>
                <li>
                  <a
                    href="https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Mozilla Firefox
                  </a>
                </li>
                <li>
                  <a
                    href="https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Apple Safari
                  </a>
                </li>
                <li>
                  <a
                    href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Microsoft Edge
                  </a>
                </li>
              </ul>
            </div>

            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-gray-700">
                <strong>Note:</strong> Blocking certain cookies may affect the functionality of our website and your overall experience.
              </p>
            </div>
          </section>

          {/* Third-party services */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Third-party services</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We use the following third-party services that may set cookies on your device:
            </p>

            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Google Analytics</h3>
                <p className="text-gray-700 text-sm mb-2">
                  We use Google Analytics to understand how visitors use our website. This helps us improve user experience.
                </p>
                <a
                  href="https://policies.google.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline"
                >
                  View Google Privacy Policy →
                </a>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Facebook Pixel</h3>
                <p className="text-gray-700 text-sm mb-2">
                  We use Facebook Pixel to measure the effectiveness of our advertising campaigns.
                </p>
                <a
                  href="https://www.facebook.com/privacy/policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline"
                >
                  View Meta Privacy Policy →
                </a>
              </div>
            </div>
          </section>

          {/* Contact */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Questions?</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              If you have any questions about our use of cookies, please contact us:
            </p>
            <div className="space-y-2 text-gray-700">
              <p>
                <strong>Email:</strong>{' '}
                <a href="mailto:plotzedrealestate@gmail.com" className="text-blue-600 hover:underline">
                  plotzedrealestate@gmail.com
                </a>
              </p>
              <p>
                <strong>Phone:</strong>{' '}
                <a href="tel:+917708594263" className="text-blue-600 hover:underline">
                  +91 7708594263
                </a>
              </p>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}