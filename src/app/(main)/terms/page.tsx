import { Metadata } from 'next'
import Link from 'next/link'
import { FileText, Mail, Phone, ArrowLeft } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Plotzed Real Estate terms of service. Read our terms and conditions for using our website and services.',
  keywords: 'terms of service, terms and conditions, user agreement, Plotzed',
  openGraph: {
    title: 'Terms of Service | Plotzed Real Estate',
    description: 'Read our terms and conditions for using our website and services.',
    type: 'website',
  },
}

export default function TermsOfServicePage() {
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
            <FileText className="w-12 h-12 text-[#D8B893]" />
            <h1 className="text-4xl md:text-5xl font-bold text-white">Terms of Service</h1>
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
                Welcome to Plotzed Real Estate. These Terms of Service (&quot;Terms&quot;) govern your use of our website and services. By accessing or using our services, you agree to be bound by these Terms.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Please read these terms carefully before using our services. If you do not agree to these terms, do not use our website or services.
              </p>
            </div>

            {/* Acceptance of Terms */}
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-[#112250] mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-700 mb-3">
                By accessing and using Plotzed Real Estate (&quot;Plotzed,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) services, you accept and agree to be bound by these Terms of Service and our Privacy Policy. These Terms apply to all users, including visitors, registered users, and customers.
              </p>
              <p className="text-gray-700">
                We reserve the right to update, change, or replace any part of these Terms by posting updates on our website. Your continued use of our services following any changes constitutes acceptance of those changes.
              </p>
            </div>

            {/* Use of Services */}
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-[#112250] mb-4">2. Use of Services</h2>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Eligibility</h3>
              <p className="text-gray-700 mb-4">
                You must be at least 18 years old to use our services. By using our services, you represent and warrant that you are of legal age to form a binding contract.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Account Registration</h3>
              <p className="text-gray-700 mb-3">To access certain features, you may need to create an account. You agree to:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
                <li>Provide accurate and complete registration information</li>
                <li>Maintain the security of your account credentials</li>
                <li>Accept responsibility for all activities under your account</li>
                <li>Notify us immediately of any unauthorized access</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Prohibited Activities</h3>
              <p className="text-gray-700 mb-3">You agree NOT to:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Use our services for any unlawful purpose</li>
                <li>Impersonate any person or entity</li>
                <li>Interfere with or disrupt our services</li>
                <li>Attempt unauthorized access to our systems</li>
                <li>Collect user information without consent</li>
                <li>Upload malicious code or viruses</li>
                <li>Violate any applicable laws or regulations</li>
              </ul>
            </div>

            {/* Property Listings */}
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-[#112250] mb-4">3. Property Listings and Information</h2>
              <p className="text-gray-700 mb-3">
                Property listings on our website are for informational purposes only. We strive to provide accurate information, but we do not guarantee:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
                <li>Accuracy, completeness, or timeliness of property information</li>
                <li>Availability of listed properties</li>
                <li>Prices shown (subject to change without notice)</li>
              </ul>
              <p className="text-gray-700">
                All property transactions are subject to separate agreements between buyers and property developers. Plotzed acts as a facilitator and is not a party to property transactions.
              </p>
            </div>

            {/* Site Visits and Inquiries */}
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-[#112250] mb-4">4. Site Visits and Inquiries</h2>
              <p className="text-gray-700 mb-3">
                When you request a site visit or submit an inquiry:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
                <li>You consent to be contacted by us and our partners</li>
                <li>Site visits are subject to availability and confirmation</li>
                <li>You agree to provide accurate contact information</li>
                <li>Cancellation of confirmed visits should be done with reasonable notice</li>
              </ul>
              <p className="text-gray-700">
                We reserve the right to refuse or cancel site visit requests at our discretion.
              </p>
            </div>

            {/* Intellectual Property */}
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-[#112250] mb-4">5. Intellectual Property Rights</h2>
              <p className="text-gray-700 mb-3">
                All content on our website, including text, graphics, logos, images, and software, is the property of Plotzed Real Estate or its content suppliers and is protected by intellectual property laws.
              </p>
              <p className="text-gray-700 mb-3">You may not:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Reproduce, distribute, or modify our content without permission</li>
                <li>Use our trademarks or branding without authorization</li>
                <li>Create derivative works from our content</li>
                <li>Remove or alter copyright notices</li>
              </ul>
            </div>

            {/* User Content */}
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-[#112250] mb-4">6. User-Generated Content</h2>
              <p className="text-gray-700 mb-3">
                If you submit content (reviews, comments, feedback) to our website:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
                <li>You grant us a non-exclusive, worldwide license to use your content</li>
                <li>You represent that you own or have rights to the content</li>
                <li>You agree your content does not violate any rights or laws</li>
                <li>We reserve the right to remove any content at our discretion</li>
              </ul>
            </div>

            {/* Payments and Fees */}
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-[#112250] mb-4">7. Payments and Fees</h2>
              <p className="text-gray-700 mb-3">
                If you make payments through our website:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
                <li>All payments are processed through secure third-party payment gateways</li>
                <li>You agree to provide accurate payment information</li>
                <li>Prices are subject to change without notice</li>
                <li>Refund policies depend on the specific service or property</li>
              </ul>
              <p className="text-gray-700">
                Booking amounts and deposits are generally non-refundable unless otherwise stated in the specific property agreement.
              </p>
            </div>

            {/* Disclaimer of Warranties */}
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-[#112250] mb-4">8. Disclaimer of Warranties</h2>
              <p className="text-gray-700 mb-3">
                Our services are provided &quot;as is&quot; and &quot;as available&quot; without warranties of any kind, either express or implied, including but not limited to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Merchantability or fitness for a particular purpose</li>
                <li>Non-infringement of third-party rights</li>
                <li>Uninterrupted or error-free service</li>
                <li>Accuracy, reliability, or completeness of information</li>
              </ul>
            </div>

            {/* Limitation of Liability */}
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-[#112250] mb-4">9. Limitation of Liability</h2>
              <p className="text-gray-700 mb-3">
                To the fullest extent permitted by law, Plotzed Real Estate shall not be liable for:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
                <li>Indirect, incidental, special, or consequential damages</li>
                <li>Loss of profits, data, or business opportunities</li>
                <li>Actions or omissions of third-party property developers</li>
                <li>Errors or inaccuracies in property listings</li>
              </ul>
              <p className="text-gray-700">
                Our total liability shall not exceed the amount you paid us in the past 12 months.
              </p>
            </div>

            {/* Indemnification */}
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-[#112250] mb-4">10. Indemnification</h2>
              <p className="text-gray-700">
                You agree to indemnify, defend, and hold harmless Plotzed Real Estate and its affiliates from any claims, damages, losses, liabilities, and expenses arising from your use of our services, violation of these Terms, or infringement of any rights of others.
              </p>
            </div>

            {/* Termination */}
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-[#112250] mb-4">11. Termination</h2>
              <p className="text-gray-700 mb-3">
                We reserve the right to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
                <li>Suspend or terminate your account for violation of these Terms</li>
                <li>Discontinue our services at any time without notice</li>
                <li>Remove or refuse any content or listings</li>
              </ul>
              <p className="text-gray-700">
                Upon termination, your right to use our services will immediately cease.
              </p>
            </div>

            {/* Governing Law */}
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-[#112250] mb-4">12. Governing Law and Dispute Resolution</h2>
              <p className="text-gray-700 mb-4">
                These Terms shall be governed by and construed in accordance with the laws of India. Any disputes arising from these Terms shall be subject to the exclusive jurisdiction of the courts in Tamil Nadu, India.
              </p>
              <p className="text-gray-700">
                We encourage you to contact us first to resolve any disputes informally before pursuing formal legal action.
              </p>
            </div>

            {/* Severability */}
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-[#112250] mb-4">13. Severability</h2>
              <p className="text-gray-700">
                If any provision of these Terms is found to be unenforceable or invalid, that provision shall be limited or eliminated to the minimum extent necessary, and the remaining provisions shall remain in full force and effect.
              </p>
            </div>

            {/* Contact Information */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-[#112250] mb-4">14. Contact Us</h2>
              <p className="text-gray-700 mb-4">
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-[#112250] flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-900">Email</p>
                    <a href="mailto:legal@plotzed.com" className="text-blue-600 hover:underline">
                      legal@plotzed.com
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
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  )
}