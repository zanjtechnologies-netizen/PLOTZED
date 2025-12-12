'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { Menu, X, Phone, Mail, User as UserIcon, LogOut, Shield } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';

export default function Header() {
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const dropdownRef = useRef<HTMLLIElement>(null);

  const { scrollYProgress } = useScroll();
  const headerBackground = useTransform(
    scrollYProgress,
    [0, 0.1],
    ['rgba(12, 26, 61, 0.85)', 'rgba(12, 26, 61, 0.98)']
  );

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Set scrolled state
      setScrolled(currentScrollY > 50);

      // Smart hide/show header
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down & past 100px
        setHidden(true);
        setMoreOpen(false);
      } else {
        // Scrolling up
        setHidden(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setMoreOpen(false);
      }
    }
    function handleResize() {
      setMoreOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('resize', handleResize);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('resize', handleResize);
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
    <>
      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#D8B893] via-[#E0C58F] to-[#D8B893] z-[60] origin-left"
        style={{ scaleX: scrollYProgress }}
      />

      <motion.header
        className="fixed top-0 left-0 right-0 z-50 border-b transition-all duration-300"
        initial={{ y: 0 }}
        animate={{ y: hidden ? -100 : 0 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        style={{
          backgroundColor: scrolled ? 'rgba(12, 26, 61, 0.98)' : 'rgba(12, 26, 61, 0.85)',
          backdropFilter: scrolled ? 'blur(20px) saturate(180%)' : 'blur(12px)',
          WebkitBackdropFilter: scrolled ? 'blur(20px) saturate(180%)' : 'blur(12px)',
          borderBottomColor: 'rgba(216, 184, 147, 0.3)',
          borderBottomWidth: '0.8px',
          boxShadow: scrolled ? '0 4px 20px rgba(0, 0, 0, 0.15)' : 'none',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10">
          <div className="flex items-center justify-between py-3 md:py-3">
            {/* Logo Section */}
            <Link href="/" className="flex items-center z-50 gap-2 sm:gap-3">
              <motion.img
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ duration: 0.3 }}
                src="/images/hero-logo.svg"
                alt="Plotzed Logo"
                className="h-7 w-auto sm:h-8 md:h-9"
              />
              <span className="leading-tight">
                <span
                  className="block text-xl sm:text-2xl font-bold text-white"
                  style={{ fontFamily: 'var(--font-playfair)' }}
                >
                  Plotzed
                </span>
                <span
                  className="block text-[10px] sm:text-xs text-[#D8B893] italic"
                  style={{ fontFamily: 'var(--font-libre)' }}
                >
                  Real Estate Developers
                </span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-6">
              {/* Navigation Links */}
              <ul className="flex items-center gap-6 xl:gap-8 text-sm">
                <li>
                  <Link
                    href="/"
                    className="relative group transition-colors font-medium"
                    style={{ color: '#D8B893', fontFamily: 'var(--font-libre)' }}
                  >
                    Home
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#D8B893] group-hover:w-full transition-all duration-300" />
                  </Link>
                </li>

                <li>
                  <Link
                    href="#featuredlistings"
                    className="relative group transition-colors font-medium"
                    style={{ color: '#D8B893', fontFamily: 'var(--font-libre)' }}
                  >
                    Properties
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#D8B893] group-hover:w-full transition-all duration-300" />
                  </Link>
                </li>

                <li>
                  <Link
                    href="/gallery"
                    className="relative group transition-colors font-medium"
                    style={{ color: '#D8B893', fontFamily: 'var(--font-libre)' }}
                  >
                    Gallery
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#D8B893] group-hover:w-full transition-all duration-300" />
                  </Link>
                </li>

                <li>
                  <Link
                    href="/visit"
                    className="relative group transition-colors font-medium"
                    style={{ color: '#D8B893', fontFamily: 'var(--font-libre)' }}
                  >
                    Site Visits
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#D8B893] group-hover:w-full transition-all duration-300" />
                  </Link>
                </li>

                <li>
                  <Link
                    href="/insights"
                    className="relative group transition-colors font-medium"
                    style={{ color: '#D8B893', fontFamily: 'var(--font-libre)' }}
                  >
                    Blog
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#D8B893] group-hover:w-full transition-all duration-300" />
                  </Link>
                </li>

                <li>
                  <Link
                    href="#customerexperiences"
                    className="relative group transition-colors font-medium"
                    style={{ color: '#D8B893', fontFamily: 'var(--font-libre)' }}
                  >
                    Testimonials
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#D8B893] group-hover:w-full transition-all duration-300" />
                  </Link>
                </li>

                {/* Dropdown */}
                <li className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setMoreOpen(!moreOpen)}
                    className="transition-colors font-medium group"
                    style={{ color: '#D8B893', fontFamily: 'var(--font-libre)' }}
                  >
                    More ▾
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#D8B893] group-hover:w-full transition-all duration-300" />
                  </button>

                  <AnimatePresence>
                    {moreOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 mt-2 w-44 bg-[#0C1A3D]/95 backdrop-blur-xl shadow-xl rounded-xl border overflow-hidden"
                        style={{ borderColor: 'rgba(216,184,147,0.3)' }}
                      >
                        <ul className="flex flex-col py-2">
                          <li>
                            <Link
                              href="#redefineluxury"
                              className="block px-4 py-2 text-[#D8B893] hover:text-white hover:bg-[#D8B893]/10 transition-colors"
                              style={{ fontFamily: 'var(--font-libre)' }}
                              onClick={() => setMoreOpen(false)}
                            >
                              About
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="#footer"
                              className="block px-4 py-2 text-[#D8B893] hover:text-white hover:bg-[#D8B893]/10 transition-colors"
                              style={{ fontFamily: 'var(--font-libre)' }}
                              onClick={() => setMoreOpen(false)}
                            >
                              Contact
                            </Link>
                          </li>
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              </ul>

              {/* Auth Buttons */}
              <div className="flex items-center gap-4">
                {session ? (
                  <>
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

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => signOut({ callbackUrl: '/' })}
                      className="flex items-center gap-2 px-4 sm:px-5 py-2 rounded-full font-semibold text-[#0C1A3D] text-sm transition-all shadow-lg hover:shadow-xl"
                      style={{
                        backgroundColor: '#D8B893',
                        fontFamily: 'var(--font-libre)',
                      }}
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="hidden sm:inline">Logout</span>
                    </motion.button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="text-white hover:text-[#D8B893] transition-colors font-medium"
                      style={{ fontFamily: 'var(--font-libre)' }}
                    >
                      Log In
                    </Link>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Link
                        href="/register"
                        className="px-4 sm:px-5 py-2 rounded-full font-semibold text-[#0C1A3D] text-sm transition-all shadow-lg hover:shadow-xl inline-block"
                        style={{
                          backgroundColor: '#D8B893',
                          fontFamily: 'var(--font-libre)',
                        }}
                      >
                        Sign Up
                      </Link>
                    </motion.div>
                  </>
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex lg:hidden items-center text-white z-50"
              aria-label="Toggle Menu"
            >
              <AnimatePresence mode="wait">
                {mobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="w-6 h-6" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="w-6 h-6" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        {/* Enhanced Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="lg:hidden border-t overflow-hidden"
              style={{
                backgroundColor: 'rgba(12, 26, 61, 1)',
                borderTopColor: 'rgba(216, 184, 147, 0.3)',
                borderTopWidth: '0.8px',
              }}
            >
              <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
                {/* Mobile Nav Links */}
                <motion.div
                  variants={{
                    open: {
                      transition: { staggerChildren: 0.07, delayChildren: 0.1 }
                    },
                    closed: {
                      transition: { staggerChildren: 0.05, staggerDirection: -1 }
                    }
                  }}
                  initial="closed"
                  animate="open"
                  exit="closed"
                  className="flex flex-col gap-1"
                >
                  {navigation.map((item, index) => (
                    <motion.div
                      key={item.name}
                      variants={{
                        open: { opacity: 1, x: 0 },
                        closed: { opacity: 0, x: -20 }
                      }}
                    >
                      <Link
                        href={item.href}
                        className="font-medium py-3 px-4 rounded-lg transition-colors block"
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
                    </motion.div>
                  ))}
                </motion.div>

                {/* Mobile Auth Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="pt-5 mt-5 border-t border-[#D8B893]/30 space-y-3"
                >
                  {session ? (
                    <>
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
                </motion.div>

                {/* Mobile Contact Info */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="pt-5 mt-5 border-t border-[#D8B893]/30 space-y-3"
                >
                  <a
                    href="tel:+1409999909"
                    className="flex items-center gap-3 text-[#D8B893] hover:text-white transition-colors text-sm"
                    style={{ fontFamily: 'var(--font-libre)' }}
                  >
                    <Phone className="w-4 h-4" />
                    <span>+1 40 9999909</span>
                  </a>
                  <a
                    href="mailto:reservations@plotzedrealestate.com"
                    className="flex items-center gap-3 text-[#D8B893] hover:text-white transition-colors text-sm"
                    style={{ fontFamily: 'var(--font-libre)' }}
                  >
                    <Mail className="w-4 h-4" />
                    <span className="text-xs sm:text-sm">reservations@PlotzedRealEstate.com</span>
                  </a>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
}
