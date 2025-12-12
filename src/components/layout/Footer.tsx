'use client';

import { Mail, Phone, MapPin, Send, MessageCircle, Instagram, Facebook, Youtube, Linkedin } from 'lucide-react';
import { useState } from 'react';
import { Playfair_Display, Libre_Baskerville, Inter } from 'next/font/google';
import Link from 'next/link';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { motion } from 'framer-motion';

// X (Twitter) Icon Component
const XIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  display: 'swap',
});

const libre = Libre_Baskerville({
  variable: '--font-libre',
  subsets: ['latin'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
});

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
});

export default function Footer() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const { executeRecaptcha } = useGoogleReCaptcha();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setMessage({ type: 'error', text: 'Please enter your email address' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      // Get reCAPTCHA token
      let recaptchaToken = null;
      if (executeRecaptcha) {
        try {
          recaptchaToken = await executeRecaptcha('newsletter_subscribe');
        } catch (error) {
          console.warn('reCAPTCHA token generation failed:', error);
          // Continue without token - server will handle gracefully
        }
      }

      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          source: 'footer',
          token: recaptchaToken,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage({
          type: 'success',
          text: data.message || 'Successfully subscribed! Check your email for confirmation.',
        });
        setEmail('');
      } else {
        setMessage({
          type: 'error',
          text: data.error || 'Failed to subscribe. Please try again.',
        });
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      setMessage({
        type: 'error',
        text: 'An error occurred. Please try again later.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer
      id="footer"
      className={`${playfair.variable} ${libre.variable} ${inter.variable} bg-[#0C1A3D] text-white pt-20 pb-10`}
    >
      <div className="container-custom">
        {/* Contact Information - Highlighted Section (Moved to Top) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 pb-12 border-b border-white/10"
        >
          <div className="text-center mb-8">
            <h3
              className="text-3xl font-bold mb-2"
              style={{ fontFamily: 'var(--font-playfair)', color: '#D8B893' }}
            >
              Get in Touch
            </h3>
            <p
              className="text-sm"
              style={{ color: '#C7C9D1', fontFamily: 'var(--font-libre)' }}
            >
              We're here to help you find your dream property
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {/* Email */}
            <motion.a
              href="mailto:plotzedrealestate@gmail.com"
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#D8B893]/50 transition-all group"
            >
              <div className="w-14 h-14 rounded-full bg-[#D8B893]/20 flex items-center justify-center group-hover:bg-[#D8B893]/30 transition-colors">
                <Mail className="w-7 h-7 text-[#D8B893]" />
              </div>
              <div className="text-center">
                <p className="text-xs font-semibold text-[#D8B893] mb-1" style={{ fontFamily: 'var(--font-inter)' }}>
                  EMAIL US
                </p>
                <p className="text-sm font-semibold text-white" style={{ fontFamily: 'var(--font-libre)' }}>
                  plotzedrealestate@gmail.com
                </p>
              </div>
            </motion.a>

            {/* Phone */}
            <motion.a
              href="tel:+917708594263"
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#D8B893]/50 transition-all group"
            >
              <div className="w-14 h-14 rounded-full bg-[#D8B893]/20 flex items-center justify-center group-hover:bg-[#D8B893]/30 transition-colors">
                <Phone className="w-7 h-7 text-[#D8B893]" />
              </div>
              <div className="text-center">
                <p className="text-xs font-semibold text-[#D8B893] mb-1" style={{ fontFamily: 'var(--font-inter)' }}>
                  CALL US
                </p>
                <p className="text-sm font-semibold text-white" style={{ fontFamily: 'var(--font-libre)' }}>
                  +91 7708594263
                </p>
              </div>
            </motion.a>

            {/* Location */}
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#D8B893]/50 transition-all group"
            >
              <div className="w-14 h-14 rounded-full bg-[#D8B893]/20 flex items-center justify-center group-hover:bg-[#D8B893]/30 transition-colors">
                <MapPin className="w-7 h-7 text-[#D8B893]" />
              </div>
              <div className="text-center">
                <p className="text-xs font-semibold text-[#D8B893] mb-1" style={{ fontFamily: 'var(--font-inter)' }}>
                  VISIT US
                </p>
                <p className="text-sm font-medium" style={{ fontFamily: 'var(--font-libre)' }}>
                  Auroville, Tamil Nadu / Puducherry
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Newsletter Section (Moved to Middle) */}
        <div className="text-center mb-12 pb-12 border-b border-white/10">
          <h3
            className="text-2xl font-bold mb-2"
            style={{ fontFamily: 'var(--font-playfair)', color: '#D8B893' }}
          >
            Join Our Exclusive Circle
          </h3>
          <p
            className="text-sm mb-6"
            style={{ color: '#C7C9D1', fontFamily: 'var(--font-libre)' }}
          >
            Receive curated luxury travel insights and exclusive offers
          </p>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row justify-center items-center gap-4 max-w-lg mx-auto"
          >
            <input
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              className="flex-1 px-6 py-4 rounded-full bg-[#162D6A] text-white placeholder-gray-400 border border-[#1D377B] outline-none"
              style={{ fontFamily: 'var(--font-libre)' }}
            />
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-4 rounded-full font-semibold text-[#112250] transition-all flex items-center justify-center gap-2 bg-[#D8B893] hover:bg-[#caa579]"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-[#112250] border-t-transparent rounded-full animate-spin" />
                  <span>Subscribing...</span>
                </>
              ) : (
                <>
                  Subscribe
                  <Send className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {message && (
            <p
              className={`mt-4 text-sm ${
                message.type === 'success' ? 'text-[#D8B893]' : 'text-red-400'
              }`}
              style={{ fontFamily: 'var(--font-libre)' }}
            >
              {message.text}
            </p>
          )}
        </div>

        {/* Company Info Section (Moved to Bottom) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 pb-12 mb-12 border-b border-white/10">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <img
                src="/images/hero-logo.svg"
                alt="Plotzed Logo"
                className="w-10 h-10 object-contain"
              />
              <div>
                <h3
                  className="text-2xl font-bold"
                  style={{ fontFamily: 'var(--font-playfair)', color: '#FFFFFF' }}
                >
                  Plotzed
                </h3>
                <p
                  className="text-sm italic"
                  style={{ fontFamily: 'var(--font-libre)', color: '#D8B893' }}
                >
                  Real Estate Developers
                </p>
              </div>
            </div>

            <p
              className="text-sm leading-relaxed mb-6 max-w-xs"
              style={{ color: '#C7C9D1', fontFamily: 'var(--font-libre)' }}
            >
              Curating exceptional real estate developments across India's most sought-after
              locations where modern living meets timeless natural beauty.
            </p>

            {/* Social Icons */}
            <div className="flex gap-3 mt-6">
              <motion.a
                href="https://www.instagram.com/plotzedrealestate"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, y: -3 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#D8B893]/20 transition-colors"
              >
                <Instagram className="w-5 h-5 text-[#D8B893]" />
              </motion.a>
              <motion.a
                href="https://www.facebook.com/share/19raHNyU5T/"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, y: -3 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#D8B893]/20 transition-colors"
              >
                <Facebook className="w-5 h-5 text-[#D8B893]" />
              </motion.a>
              <motion.a
                href="https://x.com/OFFICIALPLOTZED"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, y: -3 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#D8B893]/20 transition-colors"
              >
                <XIcon className="w-5 h-5 text-[#D8B893]" />
              </motion.a>
              <motion.a
                href="https://www.youtube.com/@PLOTZEDREALESTATE"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, y: -3 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#D8B893]/20 transition-colors"
              >
                <Youtube className="w-5 h-5 text-[#D8B893]" />
              </motion.a>
              <motion.a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, y: -3 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#D8B893]/20 transition-colors"
              >
                <Linkedin className="w-5 h-5 text-[#D8B893]" />
              </motion.a>
            </div>
          </div>

          {/* Company */}
          <div>
            <h4
              className="font-semibold mb-4 text-lg"
              style={{ fontFamily: 'var(--font-playfair)', color: '#D8B893' }}
            >
              Company
            </h4>
            <ul className="space-y-2 text-sm" style={{ fontFamily: 'var(--font-libre)' }}>
              <li>About Us</li>
            </ul>
          </div>

          {/* Discover */}
          <div>
            <h4
              className="font-semibold mb-4 text-lg"
              style={{ fontFamily: 'var(--font-playfair)', color: '#D8B893' }}
            >
              Discover
            </h4>
            <ul className="space-y-2 text-sm" style={{ fontFamily: 'var(--font-libre)' }}>
              <li>Featured Properties</li>
              <li>New Listings</li>
              <li>Popular Destinations</li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4
              className="font-semibold mb-4 text-lg"
              style={{ fontFamily: 'var(--font-playfair)', color: '#D8B893' }}
            >
              Support
            </h4>
            <ul className="space-y-2 text-sm" style={{ fontFamily: 'var(--font-libre)' }}>
              <li>Cancellation Policy</li>
              <li>Terms of Service</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center text-sm mt-12 pt-6 text-gray-400">
          <p style={{ fontFamily: 'var(--font-libre)' }}>
            © 2023 Plotzed Real Estate Developer. All rights reserved.
          </p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-[#D8B893] transition-colors">
              Privacy Policy
            </a>
            <Link href="/cookie-policy" className="hover:text-[#D8B893] transition-colors">
              Cookie Policy
            </Link>
            <a href="#" className="hover:text-[#D8B893] transition-colors">
              Sitemap
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
