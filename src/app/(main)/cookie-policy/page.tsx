'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Cookie, Shield, Settings, BarChart3, Megaphone, ChevronDown, ChevronUp } from 'lucide-react';
import { COOKIE_LIST, type CookieCategory } from '@/lib/cookies';

const categoryInfo: Record<CookieCategory, { label: string; icon: React.ReactNode; description: string }> = {
  necessary: {
    label: 'Necessary Cookies',
    icon: <Shield className="w-5 h-5" />,
    description: 'These cookies are essential for the website to function properly. They enable basic functions like page navigation, secure areas access, and remembering your cookie consent preferences. The website cannot function properly without these cookies.',
  },
  preferences: {
    label: 'Preference Cookies',
    icon: <Settings className="w-5 h-5" />,
    description: 'These cookies allow the website to remember choices you make (such as your preferred language or the region you are in) and provide enhanced, more personalized features.',
  },
  analytics: {
    label: 'Analytics Cookies',
    icon: <BarChart3 className="w-5 h-5" />,
    description: 'These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. This helps us improve our website and services.',
  },
  marketing: {
    label: 'Marketing Cookies',
    icon: <Megaphone className="w-5 h-5" />,
    description: 'These cookies are used to track visitors across websites. The intention is to display ads that are relevant and engaging for the individual user and thereby more valuable for publishers and third-party advertisers.',
  },
};

function CookieTable({ category }: { category: CookieCategory }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const cookies = COOKIE_LIST.filter((c) => c.category === category);
  const info = categoryInfo[category];

  return (
    <div className="border rounded-xl overflow-hidden mb-6">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#112250] flex items-center justify-center text-white">
            {info.icon}
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-gray-900">{info.label}</h3>
            <p className="text-sm text-gray-500">{cookies.length} cookies</p>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500" />
        )}
      </button>

      {isExpanded && (
        <div className="p-4 border-t">
          <p className="text-gray-600 text-sm mb-4">{info.description}</p>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-3 font-semibold text-gray-700">Cookie Name</th>
                  <th className="text-left py-2 px-3 font-semibold text-gray-700">Provider</th>
                  <th className="text-left py-2 px-3 font-semibold text-gray-700">Type</th>
                  <th className="text-left py-2 px-3 font-semibold text-gray-700">Duration</th>
                  <th className="text-left py-2 px-3 font-semibold text-gray-700">Description</th>
                </tr>
              </thead>
              <tbody>
                {cookies.map((cookie) => (
                  <tr key={cookie.name} className="border-b last:border-0">
                    <td className="py-2 px-3 font-mono text-xs bg-gray-50">{cookie.name}</td>
                    <td className="py-2 px-3">{cookie.provider}</td>
                    <td className="py-2 px-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          cookie.type === 'first-party'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        {cookie.type === 'first-party' ? '1st Party' : '3rd Party'}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-gray-600">{cookie.duration}</td>
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
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-[#112250] text-white py-16">
        <div className="container-custom">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <Cookie className="w-10 h-10 text-[#D8B893]" />
            <h1 className="text-3xl md:text-4xl font-bold">Cookie Policy</h1>
          </div>
          <p className="text-white/80 max-w-2xl">
            Last updated: November 2024
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container-custom py-12">
        <div className="max-w-4xl mx-auto">
          {/* Introduction */}
          <section className="bg-white rounded-2xl p-6 md:p-8 shadow-sm mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">What are Cookies?</h2>
            <p className="text-gray-600 mb-4">
              Cookies are small text files that are stored on your device (computer, tablet, or mobile)
              when you visit a website. They are widely used to make websites work more efficiently,
              provide a better user experience, and give website owners information about how their
              site is being used.
            </p>
            <p className="text-gray-600">
              We use both <strong>first-party cookies</strong> (set by Plotzed) and{' '}
              <strong>third-party cookies</strong> (set by our partners) to provide you with the
              best possible experience on our website.
            </p>
          </section>

          {/* How We Use Cookies */}
          <section className="bg-white rounded-2xl p-6 md:p-8 shadow-sm mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">How We Use Cookies</h2>
            <p className="text-gray-600 mb-4">
              We use cookies for several purposes:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>To keep you signed in to your account</li>
              <li>To remember your preferences and settings</li>
              <li>To understand how you use our website</li>
              <li>To improve our services based on your behavior</li>
              <li>To show you relevant advertisements</li>
              <li>To measure the effectiveness of our marketing campaigns</li>
            </ul>
          </section>

          {/* Cookie Categories */}
          <section className="bg-white rounded-2xl p-6 md:p-8 shadow-sm mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Cookies We Use</h2>
            <p className="text-gray-600 mb-6">
              Click on each category below to see the specific cookies we use:
            </p>

            <CookieTable category="necessary" />
            <CookieTable category="preferences" />
            <CookieTable category="analytics" />
            <CookieTable category="marketing" />
          </section>

          {/* Managing Cookies */}
          <section className="bg-white rounded-2xl p-6 md:p-8 shadow-sm mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Managing Your Cookie Preferences</h2>
            <p className="text-gray-600 mb-4">
              You can manage your cookie preferences at any time:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
              <li>
                <strong>On our website:</strong> Use our cookie consent banner to accept, reject,
                or customize your cookie preferences.
              </li>
              <li>
                <strong>In your browser:</strong> Most browsers allow you to control cookies through
                their settings. You can delete existing cookies and set your browser to block cookies
                in the future.
              </li>
            </ul>
            <p className="text-gray-600 text-sm">
              <strong>Note:</strong> Blocking certain cookies may affect the functionality of our
              website and your experience.
            </p>
          </section>

          {/* Browser Settings */}
          <section className="bg-white rounded-2xl p-6 md:p-8 shadow-sm mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Browser Cookie Settings</h2>
            <p className="text-gray-600 mb-4">
              Here are links to manage cookies in popular browsers:
            </p>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://support.google.com/chrome/answer/95647"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#006DB8] hover:underline"
                >
                  Google Chrome
                </a>
              </li>
              <li>
                <a
                  href="https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#006DB8] hover:underline"
                >
                  Mozilla Firefox
                </a>
              </li>
              <li>
                <a
                  href="https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#006DB8] hover:underline"
                >
                  Apple Safari
                </a>
              </li>
              <li>
                <a
                  href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#006DB8] hover:underline"
                >
                  Microsoft Edge
                </a>
              </li>
            </ul>
          </section>

          {/* Third-Party Cookies */}
          <section className="bg-white rounded-2xl p-6 md:p-8 shadow-sm mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Third-Party Cookies</h2>
            <p className="text-gray-600 mb-4">
              We use services from third parties that may set cookies on your device:
            </p>
            <ul className="space-y-4">
              <li>
                <strong className="text-gray-900">Google Analytics:</strong>
                <p className="text-gray-600 text-sm">
                  Helps us understand how visitors use our website.{' '}
                  <a
                    href="https://policies.google.com/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#006DB8] hover:underline"
                  >
                    Google Privacy Policy
                  </a>
                </p>
              </li>
              <li>
                <strong className="text-gray-900">Facebook Pixel:</strong>
                <p className="text-gray-600 text-sm">
                  Helps us measure the effectiveness of our advertising.{' '}
                  <a
                    href="https://www.facebook.com/privacy/policy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#006DB8] hover:underline"
                  >
                    Meta Privacy Policy
                  </a>
                </p>
              </li>
            </ul>
          </section>

          {/* Contact */}
          <section className="bg-white rounded-2xl p-6 md:p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
            <p className="text-gray-600 mb-4">
              If you have any questions about our use of cookies, please contact us:
            </p>
            <ul className="text-gray-600 space-y-2">
              <li>
                <strong>Email:</strong>{' '}
                <a href="mailto:privacy@plotzed.com" className="text-[#006DB8] hover:underline">
                  privacy@plotzed.com
                </a>
              </li>
              <li>
                <strong>Phone:</strong> +91 77085 94263
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
