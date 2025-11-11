'use client';

import { Mail, Send } from 'lucide-react';
import { useState } from 'react';
import { Playfair_Display } from 'next/font/google';
import { Libre_Baskerville } from 'next/font/google';
import { Inter } from 'next/font/google'; // Replaces Geist Sans (not a Google font)

// ------------------ FONT DEFINITIONS ------------------
const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
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

// ------------------ COMPONENT ------------------
export default function Newsletter() {
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

    // Mock API delay
    await new Promise((r) => setTimeout(r, 1000));

    setLoading(false);
    setMessage({
      type: 'success',
      text: 'Successfully subscribed! Welcome to our exclusive circle.',
    });
    setEmail('');
  };

  return (
    <footer
      className={`${playfair.variable} ${libre.variable} ${inter.variable} relative bg-[#112250] text-white pt-20 pb-10`}
    >
      {/* ------------------ Main Footer ------------------ */}
      <div className="container-custom grid grid-cols-1 lg:grid-cols-4 gap-12 border-b border-white/10 pb-12">
        {/* ------------------ Brand Info ------------------ */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-[#0096FF] to-[#00C4CC] rounded-md" />
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
            Curating exceptional real estate developments across India’s most sought-after
            locations, where modern living meets timeless natural beauty.
          </p>

          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#D8B893]" />
              <span>reservations@PlotzedRealEstate.com</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="font-semibold text-[#D8B893]">+1 40 9999909</span>
            </li>
            <li className="flex items-center gap-2">
              <span>Nationwide Service</span>
            </li>
          </ul>

          <div className="flex gap-4 mt-6">
            {['instagram', 'facebook', 'twitter'].map((platform, i) => (
              <div
                key={i}
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#D8B893]/20 transition-colors cursor-pointer"
              >
                <i className={`bi bi-${platform}`} />
              </div>
            ))}
          </div>
        </div>

        {/* ------------------ Company ------------------ */}
        <div>
          <h4
            className="font-semibold mb-4 text-lg"
            style={{ fontFamily: 'var(--font-playfair)', color: '#D8B893' }}
          >
            Company
          </h4>
          <ul className="space-y-2 text-sm" style={{ fontFamily: 'var(--font-libre)' }}>
            <li>About Us</li>
            <li>Careers</li>
            <li>Press</li>
            <li>Partners</li>
          </ul>
        </div>

        {/* ------------------ Discover ------------------ */}
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
            <li>Special Offers</li>
          </ul>
        </div>

        {/* ------------------ Support ------------------ */}
        <div>
          <h4
            className="font-semibold mb-4 text-lg"
            style={{ fontFamily: 'var(--font-playfair)', color: '#D8B893' }}
          >
            Support
          </h4>
          <ul className="space-y-2 text-sm" style={{ fontFamily: 'var(--font-libre)' }}>
            <li>Help Center</li>
            <li>Safety</li>
            <li>Cancellation Policy</li>
            <li>Terms of Service</li>
          </ul>
        </div>
      </div>

      {/* ------------------ Newsletter Section ------------------ */}
      <div className="container-custom text-center mt-12">
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
          Receive curated luxury real estate insights and exclusive offers
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

      
      <div className="container-custom flex flex-col md:flex-row justify-between items-center text-sm mt-12 border-t border-white/10 pt-6 text-gray-400">
        <p style={{ fontFamily: 'var(--font-libre)' }}>
          © 2025 Plotzed Real Estate Developer. All rights reserved.
        </p>
        <div className="flex gap-6 mt-4 md:mt-0">
          <a href="#" className="hover:text-[#D8B893] transition-colors">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-[#D8B893] transition-colors">
            Cookie Policy
          </a>
          <a href="#" className="hover:text-[#D8B893] transition-colors">
            Sitemap
          </a>
        </div>
      </div>
    </footer>
  );
}

      