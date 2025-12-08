'use client';

import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { useState } from 'react';
import { Playfair_Display, Libre_Baskerville, Inter } from 'next/font/google';
import { Instagram, Facebook, Youtube, Linkedin } from 'lucide-react';
import Link from 'next/link';

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setMessage({ type: 'error', text: 'Please enter your email address' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          source: 'footer',
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
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 pb-12">
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

            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#D8B893]" />
                <span>plotzedrealestate@gmail.com</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#D8B893]" />
                <span>+91 7708594263</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#D8B893]" />
                <span>Auroville, India</span>
              </li>
            </ul>

            {/* Social Icons */}
            <div className="flex gap-4 mt-6">
              <a
                href="https://www.instagram.com/plotzedrealestate"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#D8B893]/20 transition-colors"
              >
                <Instagram className="w-5 h-5 text-[#D8B893]" />
              </a>
              <a
                href="https://www.facebook.com/share/19raHNyU5T/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#D8B893]/20 transition-colors"
              >
                <Facebook className="w-5 h-5 text-[#D8B893]" />
              </a>
              <a
                href="https://www.youtube.com/@PLOTZEDREALESTATE"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#D8B893]/20 transition-colors"
              >
                <Youtube className="w-5 h-5 text-[#D8B893]" />
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#D8B893]/20 transition-colors"
              >
                <Linkedin className="w-5 h-5 text-[#D8B893]" />
              </a>
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

        {/* Newsletter Section */}
        <div className="text-center mt-12 border-t border-white/10 pt-8">
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

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center text-sm mt-12 border-t border-white/10 pt-6 text-gray-400">
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
