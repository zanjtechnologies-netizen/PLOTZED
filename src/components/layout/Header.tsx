'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { Menu, X, Phone, Mail, User as UserIcon, LogOut, Shield } from 'lucide-react';

export default function Header() {
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const dropdownRef = useRef<HTMLLIElement>(null);

  useEffect(()=> {
    function handleClickOutside(event: MouseEvent){
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node)
      ){
        setMoreOpen(false);
      }
    }
    function handleScroll(){
      setMoreOpen(false);
    }
    function handleResize(){
      setMoreOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);

    return() =>{
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Properties', href: '#featuredlistings' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Site Visits', href: '/visit' },
    { name: 'Blog', href: '/insights' },
    { name: 'Testimonials', href: '#customerexperiences' },
    { name: 'About', href: '#redefineluxury' },
    { name: 'Contact', href: '#footer' },
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

  {/* Normal Nav Items */}
  <li>
    <Link
      href="/"
      className="transition-colors font-medium"
      style={{ color: '#D8B893', fontFamily: 'var(--font-libre)' }}
    >
      Home
    </Link>
  </li>

  <li>
    <Link
      href="#featuredlistings"
      className="transition-colors font-medium"
      style={{ color: '#D8B893', fontFamily: 'var(--font-libre)' }}
    >
      Properties
    </Link>
  </li>

  <li>
    <Link
      href="/gallery"
      className="transition-colors font-medium"
      style={{ color: '#D8B893', fontFamily: 'var(--font-libre)' }}
    >
      Gallery
    </Link>
  </li>

  <li>
    <Link
      href="/visit"
      className="transition-colors font-medium"
      style={{ color: '#D8B893', fontFamily: 'var(--font-libre)' }}
    >
      Site Visits
    </Link>
  </li>

  <li>
    <Link
      href="/insights"
      className="transition-colors font-medium"
      style={{ color: '#D8B893', fontFamily: 'var(--font-libre)' }}
    >
      Blog
    </Link>
  </li>

  <li>
    <Link
      href="#customerexperiences"
      className="transition-colors font-medium"
      style={{ color: '#D8B893', fontFamily: 'var(--font-libre)' }}
    >
      Testimonials
    </Link>
  </li>

  {/* ⭐ DROPDOWN START */}
  <li className="relative" ref={dropdownRef}>
    <button
      onClick={() => setMoreOpen(!moreOpen)}
      className="transition-colors font-medium" 
      style={{ color: '#D8B893', fontFamily: 'var(--font-libre)' }}
    >
      More ▾
    </button>

    {moreOpen && (
      <div
        className="absolute top-full left-0 mt-2 w-44 bg-[#0C1A3D] shadow-xl rounded-xl border"
        style={{ borderColor: 'rgba(216,184,147,0.3)' }}
      >
        <ul className="flex flex-col py-2">

          <li>
            <Link
              href="#redefineluxury"
              className="block px-4 py-2 text-[#D8B893] hover:text-white hover:bg-[#D8B893]/10"
              style={{ fontFamily: 'var(--font-libre)' }}
              onClick={() => setMoreOpen(false)}
            >
              About
            </Link>
          </li>

          <li>
            <Link
              href="#footer"
              className="block px-4 py-2 text-[#D8B893] hover:text-white hover:bg-[#D8B893]/10"
              style={{ fontFamily: 'var(--font-libre)' }}
              onClick={() => setMoreOpen(false)}
            >
              Contact
            </Link>
          </li>

        </ul>
      </div>
    )}
  </li>
  {/* ⭐ DROPDOWN END */}

</ul>

            {/* Auth Buttons */}
            <div className="flex items-center gap-6">
              {session ? (
                // Authenticated user - show Dashboard/Admin Panel and Logout
                <>
                  {/* Admin Panel - Only for ADMIN users */}
                  {session.user?.role === 'ADMIN' ? (
                    <Link
                      href="/admin"
                      className="flex items-center gap-2 text-white hover:text-[#D8B893] transition-colors font-medium"
                      style={{ fontFamily: 'var(--font-libre)' }}
                    >
                      <Shield className="w-4 h-4" />
                      Admin Panel
                    </Link>
                  ) : (
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-2 text-white hover:text-[#D8B893] transition-colors font-medium"
                      style={{ fontFamily: 'var(--font-libre)' }}
                    >
                      <UserIcon className="w-4 h-4" />
                      Dashboard
                    </Link>
                  )}

                  <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="flex items-center gap-2 px-5 py-2 rounded-full font-semibold text-[#0C1A3D] text-sm transition-colors"
                    style={{
                      backgroundColor: '#D8B893',
                      fontFamily: 'var(--font-libre)',
                    }}
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </>
              ) : (
                // Not authenticated - show Login and Sign Up
                <>
                  <Link
                    href="/login"
                    className="text-white hover:text-[#D8B893] transition-colors font-medium"
                    style={{ fontFamily: 'var(--font-libre)' }}
                  >
                    Log In
                  </Link>
                  <Link
                    href="/register"
                    className="px-5 py-2 rounded-full font-semibold text-[#0C1A3D] text-sm transition-colors"
                    style={{
                      backgroundColor: '#D8B893',
                      fontFamily: 'var(--font-libre)',
                    }}
                  >
                    Sign Up
                  </Link>
                </>
              )}
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

            {/* Mobile Auth Buttons */}
            <div className="pt-5 mt-5 border-t border-[#D8B893]/30 space-y-3">
              {session ? (
                // Authenticated user - show Dashboard/Admin Panel and Logout
                <>
                  {/* Admin Panel - Only for ADMIN users, Dashboard for regular users */}
                  {session.user?.role === 'ADMIN' ? (
                    <Link
                      href="/admin"
                      className="flex items-center justify-center gap-2 w-full text-center py-3 px-4 rounded-lg text-white hover:text-[#D8B893] transition-colors font-medium border border-[#D8B893]/30"
                      style={{ fontFamily: 'var(--font-libre)' }}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Shield className="w-4 h-4" />
                      Admin Panel
                    </Link>
                  ) : (
                    <Link
                      href="/dashboard"
                      className="flex items-center justify-center gap-2 w-full text-center py-3 px-4 rounded-lg text-white hover:text-[#D8B893] transition-colors font-medium border border-[#D8B893]/30"
                      style={{ fontFamily: 'var(--font-libre)' }}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <UserIcon className="w-4 h-4" />
                      Dashboard
                    </Link>
                  )}

                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      signOut({ callbackUrl: '/' });
                    }}
                    className="flex items-center justify-center gap-2 w-full text-center py-3 px-4 rounded-lg font-semibold text-[#0C1A3D] transition-colors"
                    style={{
                      backgroundColor: '#D8B893',
                      fontFamily: 'var(--font-libre)',
                    }}
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </>
              ) : (
                // Not authenticated - show Login and Sign Up
                <>
                  <Link
                    href="/login"
                    className="block w-full text-center py-3 px-4 rounded-lg text-white hover:text-[#D8B893] transition-colors font-medium border border-[#D8B893]/30"
                    style={{ fontFamily: 'var(--font-libre)' }}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Log In
                  </Link>
                  <Link
                    href="/register"
                    className="block w-full text-center py-3 px-4 rounded-lg font-semibold text-[#0C1A3D] transition-colors"
                    style={{
                      backgroundColor: '#D8B893',
                      fontFamily: 'var(--font-libre)',
                    }}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
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
