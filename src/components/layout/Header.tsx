'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, Phone, Mail } from 'lucide-react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Properties', href: '/properties' },
    { name: 'Destinations', href: '/destinations' },
    { name: 'Bookings', href: '/bookings' },
    { name: 'Blog', href: '/blog' },
    { name: 'Experiences', href: '/experiences' },
    { name: 'About', href: '/about' },
    { name: 'Insights', href: '/insights' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b"
      style={{
        backgroundColor: 'rgba(12, 26, 61, 0.95)', // Brand navy
        borderBottomColor: 'rgba(216, 184, 147, 0.3)', // Sandal accent
        borderBottomWidth: '0.8px',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-10">
        <div className="flex items-center justify-between py-3 md:py-3">
          {/* Logo Section */}
          <Link href="/" className="flex items-center z-50 gap-3">
            <img
              src="/images/hero-logo.svg"
              alt="Plotzed Logo"
              className="h-8 w-auto md:h-9"
            />
            <span className="leading-tight">
              <span
                className="block text-2xl font-bold text-white"
                style={{ fontFamily: 'var(--font-playfair)' }}
              >
                Plotzed
              </span>
              <span
                className="block text-xs text-[#D8B893] italic"
                style={{ fontFamily: 'var(--font-libre)' }}
              >
                Real Estate Developers
              </span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6">
            {/* Navigation Links */}
            <ul className="flex items-center gap-8 text-sm">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="transition-colors font-medium"
                    style={{
                      color: '#D8B893',
                      fontFamily: 'var(--font-libre)',
                    }}
                    onMouseEnter={(e) =>
                      ((e.target as HTMLElement).style.color = '#FFFFFF')
                    }
                    onMouseLeave={(e) =>
                      ((e.target as HTMLElement).style.color = '#D8B893')
                    }
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Auth Buttons */}
            <div className="flex items-center gap-6">
              <Link
                href="/signin"
                className="text-white hover:text-[#D8B893] transition-colors font-medium"
                style={{ fontFamily: 'var(--font-libre)' }}
              >
                Sign In
              </Link>
              <Link
                href="/login"
                className="px-5 py-2 rounded-full font-semibold text-[#0C1A3D] text-sm transition-colors"
                style={{
                  backgroundColor: '#D8B893',
                  fontFamily: 'var(--font-libre)',
                }}
              >
                Log in
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden absolute top-full left-0 right-0 shadow-xl border-t"
          style={{
            backgroundColor: 'rgba(12, 26, 61, 1)',
            borderTopColor: 'rgba(216, 184, 147, 0.3)',
            borderTopWidth: '0.8px',
          }}
        >
          <div className="max-w-6xl mx-auto px-6 py-4">
            {/* Mobile Nav Links */}
            <div className="flex flex-col gap-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="font-medium py-3 px-4 rounded-lg transition-colors"
                  style={{
                    color: '#D8B893',
                    fontFamily: 'var(--font-libre)',
                  }}
                  onMouseEnter={(e) =>
                    ((e.target as HTMLElement).style.color = '#FFFFFF')
                  }
                  onMouseLeave={(e) =>
                    ((e.target as HTMLElement).style.color = '#D8B893')
                  }
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Mobile Contact Info */}
            <div className="pt-5 mt-5 border-t border-[#D8B893]/30 space-y-3">
              <a
                href="tel:+1409999909"
                className="flex items-center gap-3 text-[#D8B893] hover:text-white transition-colors"
                style={{ fontFamily: 'var(--font-libre)' }}
              >
                <Phone className="w-5 h-5" />
                <span>+1 40 9999909</span>
              </a>
              <a
                href="mailto:reservations@plotzedrealestate.com"
                className="flex items-center gap-3 text-[#D8B893] hover:text-white transition-colors"
                style={{ fontFamily: 'var(--font-libre)' }}
              >
                <Mail className="w-5 h-5" />
                <span>reservations@PlotzedRealEstate.com</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}