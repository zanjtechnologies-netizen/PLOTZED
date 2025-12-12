'use client';

import Link from 'next/link';
import { ArrowRight, Clock, Calendar } from 'lucide-react';
import { Playfair_Display, Libre_Baskerville } from 'next/font/google';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useMemo } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  display: 'swap',
  variable: '--font-playfair',
});

const libre = Libre_Baskerville({
  subsets: ['latin'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-libre',
});

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  featured_image: string | null;
  category: string | null;
  published_at: Date | null;
}

function calculateReadTime(content: string): string {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return `${minutes} min read`;
}

export default function InsightsClient({ posts }: { posts: BlogPost[] }) {
  const headerRef = useRef(null);
  const { scrollY } = useScroll();
  const prefersReducedMotion = useReducedMotion();
  const headerY = useTransform(scrollY, [0, 300], prefersReducedMotion ? [0, 0] : [0, 100]);

  // Animation variants - respect user's motion preferences
  const containerVariants = useMemo(() => ({
    hidden: { opacity: prefersReducedMotion ? 1 : 0 },
    visible: {
      opacity: 1,
      transition: prefersReducedMotion ? {} : {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  }), [prefersReducedMotion]);

  const itemVariants = useMemo(() => ({
    hidden: { opacity: prefersReducedMotion ? 1 : 0, y: prefersReducedMotion ? 0 : 30, scale: 1 },
    visible: { opacity: 1, y: 0, scale: 1, transition: prefersReducedMotion ? { duration: 0 } : {} }
  }), [prefersReducedMotion]);

  return (
    <div className={`min-h-screen bg-[#F9FAFB] ${playfair.variable} ${libre.variable}`}>
      {/* Header with Parallax and Blended Background */}
      <div ref={headerRef} className="relative overflow-hidden pb-20">
        {/* Parallax Background with Seamless Blend */}
        <div className="absolute inset-0 h-[calc(100%+150px)]">
          <motion.div
            style={{ y: headerY }}
            className="absolute inset-0 bg-[url('/images/blog-overlay.jpg')] bg-cover bg-center opacity-100 scale-110 brightness-90 contrast-110"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#F9FAFB]/30 via-[#F9FAFB]/10 to-[#F9FAFB]" />
          <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#F9FAFB] via-[#F9FAFB]/95 to-transparent backdrop-blur-sm" />
        </div>

        <div className="container-custom mx-auto relative z-10 pt-24 pb-12">
          {/* Back to Home Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-[#112250] hover:text-[#112250] transition-colors group bg-white/70 hover:bg-white/90 px-4 py-2 rounded-full backdrop-blur-md border border-white/40 shadow-lg"
            >
              <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="font-medium">Back to Home</span>
            </Link>
          </motion.div>

          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="font-playfair text-5xl md:text-6xl font-bold mb-6 text-[#D8B893] drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)]"
              style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.2)' }}
            >
              Blogs & Stories
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="font-libre text-xl text-[#112250] max-w-2xl mx-auto drop-shadow-[0_2px_6px_rgba(255,255,255,0.8)] font-semibold"
              style={{ textShadow: '1px 1px 3px rgba(255,255,255,0.9), -1px -1px 3px rgba(255,255,255,0.9)' }}
            >
              Curated articles on luxury travel, refined living, and the art of the perfect escape
            </motion.p>
          </div>
        </div>
      </div>

      {/* Articles Grid with Stagger Animation */}
      <div className="container-custom mx-auto py-12 -mt-8">
        {posts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center py-20"
          >
            <p className="text-gray-500 text-lg font-libre">
              No blog posts available yet. Check back soon for insights and stories!
            </p>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {posts.map((post, index) => (
              <motion.div
                key={post.id}
                variants={itemVariants}
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <Link
                  href={`/insights/${post.slug}`}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100 flex flex-col h-full"
                >
                  {/* Image */}
                  <div className="relative h-64 overflow-hidden">
                    <motion.div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{
                        backgroundImage: `url(${post.featured_image || '/images/placeholder-blog.jpg'})`
                      }}
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                    {post.category && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="absolute top-4 left-4"
                      >
                        <span className="inline-block text-xs font-bold px-3 py-1 rounded-full bg-[#D8B893] text-[#112250] font-libre backdrop-blur-sm">
                          {post.category.toUpperCase()}
                        </span>
                      </motion.div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-8 flex-grow flex flex-col">
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4 font-libre">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {post.published_at
                            ? new Date(post.published_at).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })
                            : 'Coming Soon'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{calculateReadTime(post.content)}</span>
                      </div>
                    </div>

                    <h3 className="font-playfair text-2xl font-bold text-[#112250] mb-3 group-hover:text-[#D8B893] transition-colors">
                      {post.title}
                    </h3>

                    <p className="font-libre text-gray-600 mb-6 flex-grow leading-relaxed">
                      {post.excerpt || post.content.substring(0, 150) + '...'}
                    </p>

                    <motion.div
                      className="flex items-center gap-2 text-[#112250] font-semibold"
                      whileHover={{ x: 5 }}
                    >
                      Read Article
                      <ArrowRight className="w-4 h-4" />
                    </motion.div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Inspiration Section */}
      <div className="bg-[#112250] text-white py-20 relative overflow-hidden">
        {/* Animated Background Gradient */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 animated-gradient" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="container-custom mx-auto text-center relative z-10"
        >
          <motion.h2
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-playfair text-4xl font-bold mb-4 text-[#D8B893]"
          >
            Stay Inspired
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="font-libre text-gray-300 text-lg max-w-2xl mx-auto"
          >
            Subscribe to our newsletter for the latest insights on luxury real estate, investment opportunities, and lifestyle inspiration.
          </motion.p>

          {/* Decorative Elements */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex justify-center gap-2 mt-8"
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ y: [0, -10, 0] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
                className="w-2 h-2 rounded-full bg-[#D8B893]"
              />
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
