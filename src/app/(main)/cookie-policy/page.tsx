'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Cookie,
  Shield,
  Settings,
  BarChart3,
  Megaphone,
  ChevronDown,
  ChevronUp,
  Mail,
  Phone,
  Info,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { COOKIE_LIST, type CookieCategory } from '@/lib/cookies';

const categoryInfo: Record<CookieCategory, { label: string; icon: React.ReactNode; description: string; color: string }> = {
  necessary: {
    label: 'Necessary Cookies',
    icon: <Shield className="w-5 h-5" />,
    description: 'These cookies are essential for the website to function properly. They enable basic functions like page navigation, secure areas access, and remembering your cookie consent preferences. The website cannot function properly without these cookies.',
    color: 'from-green-500 to-emerald-600',
  },
  preferences: {
    label: 'Preference Cookies',
    icon: <Settings className="w-5 h-5" />,
    description: 'These cookies allow the website to remember choices you make (such as your preferred language or the region you are in) and provide enhanced, more personalized features.',
    color: 'from-blue-500 to-indigo-600',
  },
  analytics: {
    label: 'Analytics Cookies',
    icon: <BarChart3 className="w-5 h-5" />,
    description: 'These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. This helps us improve our website and services.',
    color: 'from-purple-500 to-violet-600',
  },
  marketing: {
    label: 'Marketing Cookies',
    icon: <Megaphone className="w-5 h-5" />,
    description: 'These cookies are used to track visitors across websites. The intention is to display ads that are relevant and engaging for the individual user and thereby more valuable for publishers and third-party advertisers.',
    color: 'from-orange-500 to-amber-600',
  },
};

function CookieTable({ category }: { category: CookieCategory }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const cookies = COOKIE_LIST.filter((c) => c.category === category);
  const info = categoryInfo[category];

  return (
    <div className="border-2 border-gray-200 rounded-xl overflow-hidden mb-6 transition-all duration-300 hover:border-gray-300 hover:shadow-lg">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-5 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 transition-all duration-200"
      >
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${info.color} flex items-center justify-center text-white shadow-md`}>
            {info.icon}
          </div>
          <div className="text-left">
            <h3 className="font-bold text-gray-900 text-lg">{info.label}</h3>
            <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
              <Cookie className="w-3 h-3" />
              {cookies.length} {cookies.length === 1 ? 'cookie' : 'cookies'}
            </p>
          </div>
        </div>
        <div className={`p-2 rounded-lg bg-white shadow-sm transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
          <ChevronDown className="w-5 h-5 text-gray-600" />
        </div>
      </button>

      {isExpanded && (
        <div className="p-6 border-t-2 border-gray-200 bg-white animate-fadeIn">
          <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
            <p className="text-gray-700 text-sm leading-relaxed flex items-start gap-2">
              <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <span>{info.description}</span>
            </p>
          </div>

          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4 font-bold text-gray-700">Cookie Name</th>
                  <th className="text-left py-3 px-4 font-bold text-gray-700">Provider</th>
                  <th className="text-left py-3 px-4 font-bold text-gray-700">Type</th>
                  <th className="text-left py-3 px-4 font-bold text-gray-700">Duration</th>
                  <th className="text-left py-3 px-4 font-bold text-gray-700">Description</th>
                </tr>
              </thead>
              <tbody>
                {cookies.map((cookie, index) => (
                  <tr
                    key={cookie.name}
                    className={`border-b last:border-0 transition-colors hover:bg-gray-50 ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                    }`}
                  >
                    <td className="py-3 px-4 font-mono text-xs font-semibold text-blue-600 bg-blue-50/50">
                      {cookie.name}
                    </td>
                    <td className="py-3 px-4 text-gray-700 font-medium">{cookie.provider}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1 ${
                          cookie.type === 'first-party'
                            ? 'bg-green-100 text-green-700 border border-green-200'
                            : 'bg-blue-100 text-blue-700 border border-blue-200'
                        }`}
                      >
                        {cookie.type === 'first-party' ? (
                          <>
                            <CheckCircle className="w-3 h-3" />
                            1st Party
                          </>
                        ) : (
                          <>
                            <AlertCircle className="w-3 h-3" />
                            3rd Party
                          </>
                        )}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600 font-medium">{cookie.duration}</td>
                    <td className="py-3 px-4 text-gray-600">{cookie.description}</td>
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
    year: 'numeric'
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-[#112250] via-[#1a2f6b] to-[#112250] text-white py-20 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }} />
        </div>

        <div className="container-custom relative z-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-8 transition-all duration-200 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to Home</span>
          </Link>

          <div className="flex items-center gap-5 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#D8B893] to-[#c9a67c] flex items-center justify-center shadow-lg">
              <Cookie className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2">Cookie Policy</h1>
              <p className="text-white/80 text-lg">
                Understanding how we use cookies to enhance your experience
              </p>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-white/90 text-sm font-medium">Last updated: {currentDate}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container-custom py-16">
        <div className="max-w-5xl mx-auto">
          {/* Introduction */}
          <section className="bg-white rounded-2xl p-8 md:p-10 shadow-lg mb-8 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white flex-shrink-0">
                <Info className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">What are Cookies?</h2>
                <div className="h-1 w-20 bg-gradient-to-r from-[#D8B893] to-[#c9a67c] rounded-full" />
              </div>
            </div>

            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p className="text-lg">
                Cookies are small text files that are stored on your device (computer, tablet, or mobile)
                when you visit a website. They are widely used to make websites work more efficiently,
                provide a better user experience, and give website owners information about how their
                site is being used.
              </p>
              <p className="text-lg">
                We use both <span className="font-semibold text-gray-900">first-party cookies</span> (set by Plotzed) and{' '}
                <span className="font-semibold text-gray-900">third-party cookies</span> (set by our partners) to provide you with the
                best possible experience on our website.
              </p>
            </div>
          </section>

          {/* How We Use Cookies */}
          <section className="bg-white rounded-2xl p-8 md:p-10 shadow-lg mb-8 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center text-white flex-shrink-0">
                <Settings className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">How We Use Cookies</h2>
                <div className="h-1 w-20 bg-gradient-to-r from-[#D8B893] to-[#c9a67c] rounded-full" />
              </div>
            </div>

            <p className="text-gray-700 mb-6 text-lg">
              We use cookies for several important purposes to enhance your experience:
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              {[
                'To keep you signed in to your account',
                'To remember your preferences and settings',
                'To understand how you use our website',
                'To improve our services based on your behavior',
                'To show you relevant advertisements',
                'To measure the effectiveness of our marketing campaigns'
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                  <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 font-medium">{item}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Cookie Categories */}
          <section className="bg-white rounded-2xl p-8 md:p-10 shadow-lg mb-8 border border-gray-100">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white flex-shrink-0">
                <Cookie className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Cookies We Use</h2>
                <div className="h-1 w-20 bg-gradient-to-r from-[#D8B893] to-[#c9a67c] rounded-full" />
              </div>
            </div>

            <p className="text-gray-700 mb-8 text-lg">
              Click on each category below to see detailed information about the specific cookies we use:
            </p>

            <CookieTable category="necessary" />
            <CookieTable category="preferences" />
            <CookieTable category="analytics" />
            <CookieTable category="marketing" />
          </section>

          {/* Managing Cookies */}
          <section className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-2xl p-8 md:p-10 shadow-lg mb-8">
            <h2 className="text-3xl font-bold mb-6">Managing Your Cookie Preferences</h2>

            <p className="text-white/90 mb-6 text-lg">
              You have full control over your cookie preferences. Here's how you can manage them:
            </p>

            <div className="space-y-4 bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-green-300 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-lg mb-1">On our website</p>
                  <p className="text-white/80">
                    Use our cookie consent banner to accept, reject, or customize your cookie preferences.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-green-300 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-lg mb-1">In your browser</p>
                  <p className="text-white/80">
                    Most browsers allow you to control cookies through their settings. You can delete existing cookies
                    and set your browser to block cookies in the future.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-yellow-500/20 border border-yellow-400/30 rounded-lg">
              <p className="text-white/90 text-sm flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-300 flex-shrink-0 mt-0.5" />
                <span>
                  <strong className="text-yellow-200">Important:</strong> Blocking certain cookies may affect the functionality of our
                  website and your overall experience.
                </span>
              </p>
            </div>
          </section>

          {/* Browser Settings */}
          <section className="bg-white rounded-2xl p-8 md:p-10 shadow-lg mb-8 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Browser Cookie Settings</h2>

            <p className="text-gray-700 mb-6 text-lg">
              Here are direct links to manage cookies in popular browsers:
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              {[
                { name: 'Google Chrome', url: 'https://support.google.com/chrome/answer/95647', color: 'from-yellow-400 to-orange-500' },
                { name: 'Mozilla Firefox', url: 'https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer', color: 'from-orange-500 to-red-500' },
                { name: 'Apple Safari', url: 'https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac', color: 'from-blue-400 to-cyan-500' },
                { name: 'Microsoft Edge', url: 'https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09', color: 'from-blue-500 to-indigo-600' },
              ].map((browser) => (
                <a
                  key={browser.name}
                  href={browser.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-5 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 rounded-xl border-2 border-gray-200 hover:border-blue-500 transition-all duration-200 group"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${browser.color} flex items-center justify-center text-white shadow-md`}>
                    <ArrowLeft className="w-6 h-6 rotate-180 group-hover:translate-x-1 transition-transform" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{browser.name}</p>
                    <p className="text-sm text-gray-600">Cookie management guide →</p>
                  </div>
                </a>
              ))}
            </div>
          </section>

          {/* Third-Party Cookies */}
          <section className="bg-white rounded-2xl p-8 md:p-10 shadow-lg mb-8 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Third-Party Services</h2>

            <p className="text-gray-700 mb-6 text-lg">
              We use services from trusted third parties that may set cookies on your device:
            </p>

            <div className="space-y-4">
              <div className="p-6 bg-gradient-to-r from-red-50 to-pink-50 rounded-xl border-2 border-red-100">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center text-white shadow-md flex-shrink-0">
                    <BarChart3 className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 text-lg mb-2">Google Analytics</h3>
                    <p className="text-gray-700 mb-3">
                      Helps us understand how visitors use our website to improve user experience.
                    </p>
                    <a
                      href="https://policies.google.com/privacy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 font-medium transition-colors"
                    >
                      <span>View Google Privacy Policy</span>
                      <ArrowLeft className="w-4 h-4 rotate-180" />
                    </a>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-100">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-md flex-shrink-0">
                    <Megaphone className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 text-lg mb-2">Facebook Pixel</h3>
                    <p className="text-gray-700 mb-3">
                      Helps us measure the effectiveness of our advertising campaigns.
                    </p>
                    <a
                      href="https://www.facebook.com/privacy/policy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
                    >
                      <span>View Meta Privacy Policy</span>
                      <ArrowLeft className="w-4 h-4 rotate-180" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Contact */}
          <section className="bg-gradient-to-br from-[#112250] to-[#1a2f6b] text-white rounded-2xl p-8 md:p-10 shadow-xl">
            <h2 className="text-3xl font-bold mb-6">Questions? Get in Touch</h2>

            <p className="text-white/90 mb-8 text-lg">
              If you have any questions about our use of cookies or this policy, we're here to help:
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <a
                href="mailto:plotzedrealestate@gmail.com"
                className="flex items-center gap-4 p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-200 group"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#D8B893] to-[#c9a67c] flex items-center justify-center shadow-lg">
                  <Mail className="w-7 h-7 text-white" />
                </div>
                <div>
                  <p className="text-white/70 text-sm mb-1">Email us at</p>
                  <p className="font-bold text-lg text-white group-hover:text-[#D8B893] transition-colors">
                    plotzedrealestate@gmail.com
                  </p>
                </div>
              </a>

              <a
                href="tel:+917708594263"
                className="flex items-center gap-4 p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-200 group"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg">
                  <Phone className="w-7 h-7 text-white" />
                </div>
                <div>
                  <p className="text-white/70 text-sm mb-1">Call us at</p>
                  <p className="font-bold text-lg text-white group-hover:text-green-300 transition-colors">
                    +91 77085 94263
                  </p>
                </div>
              </a>
            </div>
          </section>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
