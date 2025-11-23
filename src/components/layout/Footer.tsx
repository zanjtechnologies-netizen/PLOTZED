'use client';

import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { useState } from 'react';
import { Playfair_Display, Libre_Baskerville, Inter } from 'next/font/google';
<<<<<<< HEAD
import { Instagram, Facebook, Twitter } from 'lucide-react'; // ✅ Add real icons
=======
import { Instagram, Facebook, Twitter, Youtube, Linkedin } from 'lucide-react'; // ✅ Add real icons
>>>>>>> 82485807befa8b6652d353a9219b02a1a1361183

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
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    setMessage({ type: 'success', text: 'Successfully subscribed! Welcome to our circle.' });
    setEmail('');
  };

  return (
    <footer id='footer'
<<<<<<< HEAD
      className={`${playfair.variable} ${libre.variable} ${inter.variable} bg-[#0C1A3D] text-white pt-20 pb-10`}
    >
      <div className="container-custom">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 pb-12">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
=======
      className={`${playfair.variable} ${libre.variable} ${inter.variable} bg-[#0C1A3D] text-white py-8`}
    >
      <div className="container-custom">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-3">
>>>>>>> 82485807befa8b6652d353a9219b02a1a1361183
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
<<<<<<< HEAD
              className="text-sm leading-relaxed mb-6 max-w-xs"
=======
              className="text-base leading-relaxed mb-4 max-w-xs"
>>>>>>> 82485807befa8b6652d353a9219b02a1a1361183
              style={{ color: '#C7C9D1', fontFamily: 'var(--font-libre)' }}
            >
              Curating exceptional real estate developments across India’s most sought-after
              locations where modern living meets timeless natural beauty.
            </p>

<<<<<<< HEAD
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#D8B893]" />
                <span>reservations@PlotzedRealEstate.com</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#D8B893]" />
                <span>+1 40 9999909</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#D8B893]" />
                <span>Nationwide Service</span>
=======
            <ul className="space-y-2 text-base">
              <li className="flex items-center gap-2">
                <Mail className="w-6 h-6 text-[#D8B893]" />
                <span>plotzedrealestate@gmail.com</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-6 h-6 text-[#D8B893]" />
                <span>+91 7708594263</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-6 h-6 text-[#D8B893]" />
                <span>Auroville</span>
>>>>>>> 82485807befa8b6652d353a9219b02a1a1361183
              </li>
            </ul>

            {/* ✅ Social Icons in Sandal */}
<<<<<<< HEAD
            <div className="flex gap-4 mt-6">
              <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#D8B893]/20 transition-colors cursor-pointer">
                <Instagram className="w-5 h-5 text-[#D8B893]" />
              </div>
              <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#D8B893]/20 transition-colors cursor-pointer">
                <Facebook className="w-5 h-5 text-[#D8B893]" />
              </div>
              <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#D8B893]/20 transition-colors cursor-pointer">
                <Twitter className="w-5 h-5 text-[#D8B893]" />
              </div>
            </div>
          </div>

=======
            <div className="flex gap-4 mt-4">
              <a
                href="https://www.instagram.com/plotzedrealestate?igsh=MzRlODBiNWFlZA=="
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#D8B893]/20 transition-colors"
              >
                <Instagram className="w-8 h-8 text-[#D8B893]" />
              </a>

              <a
                href="https://www.facebook.com/share/19raHNyU5T/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#D8B893]/20 transition-colors"
              >
                <Facebook className="w-8 h-8 text-[#D8B893]" />
              </a>

              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#D8B893]/20 transition-colors"
              >
                {/* Twitter icon is often used for X, but let's check if X exists or just use a custom SVG if needed. 
                    Lucide usually has 'X' or we can stick with Twitter for now if X isn't imported. 
                    Wait, I imported Twitter. Let me check if I can import X. 
                    Actually, let's stick to the requested change. 
                    I'll use the 'X' icon from lucide-react if available, but I need to import it. 
                    I'll assume 'X' is available or use a path. 
                    Let's just use the Twitter icon but styled as X if possible, or better, import X.
                    I'll update the import above first. 
                    Actually, I'll just use the Twitter icon for now but rename it to X in the UI if I could, 
                    but the user specifically asked for "the x one". 
                    Lucide has an 'X' icon. I will use that. 
                */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-8 h-8 text-[#D8B893]"
                >
                  <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
                  <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
                </svg>
              </a>

              <a
                href="https://www.youtube.com/@PLOTZEDREALESTATE"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#D8B893]/20 transition-colors"
              >
                <Youtube className="w-8 h-8 text-[#D8B893]" />
              </a>

              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#D8B893]/20 transition-colors"
              >
                <Linkedin className="w-8 h-8 text-[#D8B893]" />
              </a>
            </div>
          </div>



>>>>>>> 82485807befa8b6652d353a9219b02a1a1361183
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
<<<<<<< HEAD
              <li>Careers</li>
              <li>Press</li>
              <li>Partners</li>
=======

>>>>>>> 82485807befa8b6652d353a9219b02a1a1361183
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
<<<<<<< HEAD
              <li>Popular Destinations</li>
              <li>Special Offers</li>
=======

>>>>>>> 82485807befa8b6652d353a9219b02a1a1361183
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
              <li>Help Center</li>
<<<<<<< HEAD
              <li>Safety</li>
=======

>>>>>>> 82485807befa8b6652d353a9219b02a1a1361183
              <li>Cancellation Policy</li>
              <li>Terms of Service</li>
            </ul>
          </div>
        </div>

        {/* ✅ Newsletter Section — ONLY ONE DIVIDER ABOVE */}
<<<<<<< HEAD
        <div className="text-center mt-12 border-t border-white/10 pt-8">
=======
        <div className="text-center border-t border-white/10 pt-6 mb-6">
>>>>>>> 82485807befa8b6652d353a9219b02a1a1361183
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
<<<<<<< HEAD
              className={`mt-4 text-sm ${
                message.type === 'success' ? 'text-[#D8B893]' : 'text-red-400'
              }`}
=======
              className={`mt-4 text-sm ${message.type === 'success' ? 'text-[#D8B893]' : 'text-red-400'
                }`}
>>>>>>> 82485807befa8b6652d353a9219b02a1a1361183
              style={{ fontFamily: 'var(--font-libre)' }}
            >
              {message.text}
            </p>
          )}
        </div>

        {/* ✅ Single Bottom Bar */}
<<<<<<< HEAD
        <div className="flex flex-col md:flex-row justify-between items-center text-sm mt-12 border-t border-white/10 pt-6 text-gray-400">
=======
        <div className="flex flex-col md:flex-row justify-between items-center text-base border-t border-white/10 pt-6 text-gray-400">
>>>>>>> 82485807befa8b6652d353a9219b02a1a1361183
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
      </div>
    </footer>
  );
}
<<<<<<< HEAD


=======
>>>>>>> 82485807befa8b6652d353a9219b02a1a1361183
