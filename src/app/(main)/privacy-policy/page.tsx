import { Metadata } from 'next'
import Link from 'next/link'
import { Shield, Mail, Phone, MapPin, ArrowLeft } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Plotzed Real Estate privacy policy. Learn how we collect, use, and protect your personal information.',
  keywords: 'privacy policy, data protection, GDPR, personal information, Plotzed',
  openGraph: {
    title: 'Privacy Policy | Plotzed Real Estate',
    description: 'Learn how we collect, use, and protect your personal information.',
    type: 'website',
  },
}

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-[#112250] py-16 md:py-24">
        <div className="container-custom">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-6 group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Back to Home
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <Shield className="w-12 h-12 text-[#D8B893]" />
            <h1 className="text-4xl md:text-5xl font-bold text-white">Privacy Policy</h1>
          </div>
          <p className="text-white/80 text-lg max-w-3xl">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12 md:py-16">
        <div className="container-custom max-w-4xl">
          <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm">

            {/* Introduction */}
            <div className="mb-10">
              <p className="text-gray-700 leading-relaxed mb-4">
                Plotzed Real Estate (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site or use our services.
              </p>
            </div>

            {/* Information We Collect */}
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-[#112250] mb-4">1. Information We Collect</h2>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Personal Information</h3>
              <p className="text-gray-700 mb-3">We collect information that you provide directly to us, including:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                <li>Name, email address, phone number</li>
                <li>Mailing address and property preferences</li>
                <li>Account credentials (username and password)</li>
                <li>Payment information (processed securely through third-party payment providers)</li>
                <li>Communication history with us (inquiries, site visit requests, feedback)</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Automatically Collected Information</h3>
              <p className="text-gray-700 mb-3">When you visit our website, we automatically collect:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>IP address, browser type, and device information</li>
                <li>Pages visited, time spent on pages, and navigation patterns</li>
                <li>Referring website and search terms</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>
            </div>

            {/* How We Use Your Information */}
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-[#112250] mb-4">2. How We Use Your Information</h2>
              <p className="text-gray-700 mb-3">We use the collected information for the following purposes:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>To provide and maintain our services</li>
                <li>To process your property inquiries and site visit requests</li>
                <li>To communicate with you about properties, services, and updates</li>
                <li>To improve our website and user experience</li>
                <li>To send you marketing communications (with your consent)</li>
                <li>To comply with legal obligations and protect our rights</li>
                <li>To detect, prevent, and address fraud or security issues</li>
              </ul>
            </div>

            {/* Information Sharing */}
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-[#112250] mb-4">3. Information Sharing and Disclosure</h2>
              <p className="text-gray-700 mb-3">We may share your information with:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
                <li><strong>Service Providers:</strong> Third-party vendors who assist in operating our website and services</li>
                <li><strong>Property Developers:</strong> When you inquire about specific properties</li>
                <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                <li><strong>Business Transfers:</strong> In connection with a merger, sale, or acquisition</li>
              </ul>
              <p className="text-gray-700">
                We do not sell your personal information to third parties.
              </p>
            </div>

            {/* Cookies */}
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-[#112250] mb-4">4. Cookies and Tracking Technologies</h2>
              <p className="text-gray-700 mb-3">We use cookies and similar tracking technologies to:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
                <li>Maintain your session and remember your preferences</li>
                <li>Analyze website traffic and user behavior</li>
                <li>Provide personalized content and advertisements</li>
              </ul>
              <p className="text-gray-700">
                You can control cookies through your browser settings. For more information, see our{' '}
                <Link href="/cookie-policy" className="text-blue-600 hover:underline">Cookie Policy</Link>.
              </p>
            </div>

            {/* Data Security */}
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-[#112250] mb-4">5. Data Security</h2>
              <p className="text-gray-700 mb-3">
                We implement appropriate technical and organizational security measures to protect your personal information, including:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
                <li>Encryption of data in transit and at rest</li>
                <li>Regular security assessments and updates</li>
                <li>Restricted access to personal information</li>
                <li>Secure authentication and password protection</li>
              </ul>
              <p className="text-gray-700">
                However, no method of transmission over the internet or electronic storage is 100% secure. We cannot guarantee absolute security.
              </p>
            </div>

            {/* Your Rights */}
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-[#112250] mb-4">6. Your Privacy Rights</h2>
              <p className="text-gray-700 mb-3">You have the right to:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Access the personal information we hold about you</li>
                <li>Request correction of inaccurate or incomplete information</li>
                <li>Request deletion of your personal information</li>
                <li>Object to or restrict processing of your information</li>
                <li>Data portability (receive your data in a structured format)</li>
                <li>Withdraw consent for marketing communications</li>
                <li>Lodge a complaint with a supervisory authority</li>
              </ul>
            </div>

            {/* Third-Party Links */}
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-[#112250] mb-4">7. Third-Party Links</h2>
              <p className="text-gray-700">
                Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of these external sites. We encourage you to read their privacy policies.
              </p>
            </div>

            {/* Children's Privacy */}
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-[#112250] mb-4">8. Children&apos;s Privacy</h2>
              <p className="text-gray-700">
                Our services are not directed to children under 18. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.
              </p>
            </div>

            {/* Changes to Policy */}
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-[#112250] mb-4">9. Changes to This Privacy Policy</h2>
              <p className="text-gray-700">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the &quot;Last updated&quot; date. Your continued use of our services after such changes constitutes acceptance of the updated policy.
              </p>
            </div>

            {/* Contact Information */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-[#112250] mb-4">10. Contact Us</h2>
              <p className="text-gray-700 mb-4">
                If you have any questions about this Privacy Policy or wish to exercise your privacy rights, please contact us:
              </p>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-[#112250] flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-900">Email</p>
                    <a href="mailto:privacy@plotzed.com" className="text-blue-600 hover:underline">
                      privacy@plotzed.com
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-[#112250] flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-900">Phone</p>
                    <a href="tel:7708594263" className="text-blue-600 hover:underline">
                      +91 7708594263
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#112250] flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-900">Address</p>
                    <p className="text-gray-700">
                      Plotzed Real Estate<br />
                      Tamil Nadu, India
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  )
}