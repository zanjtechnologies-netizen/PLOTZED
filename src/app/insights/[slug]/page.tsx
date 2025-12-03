'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, Tag } from 'lucide-react';
import { Playfair_Display, Libre_Baskerville } from 'next/font/google';

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
  excerpt?: string;
  featured_image?: string;
  category?: string;
  tags: string[];
  published_at?: string;
  meta_title?: string;
  meta_description?: string;
}

export default function BlogPostPage() {
  const params = useParams();
  const router = useRouter();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (params.slug) {
      fetchBlogPost(params.slug as string);
    }
  }, [params.slug]);

  const fetchBlogPost = async (slug: string) => {
    try {
      const response = await fetch(`/api/blog-posts?slug=${slug}`);
      const result = await response.json();

      if (result.success && result.data) {
        setPost(result.data);
      } else {
        setNotFound(true);
      }
    } catch (error) {
      console.error('Error fetching blog post:', error);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date?: string) => {
    if (!date) return 'Recently';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const estimateReadTime = (content: string) => {
    const words = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    const minutes = Math.ceil(words / 200);
    return `${minutes} min read`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading article...</p>
        </div>
      </div>
    );
  }

  if (notFound || !post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Article Not Found</h1>
          <p className="text-gray-600 mb-8">The article you're looking for doesn't exist.</p>
          <Link
            href="/insights"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Insights
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-[#F9FAFB] ${playfair.variable} ${libre.variable}`}>
      {/* Hero Section */}
      <div className="bg-[#112250] text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#112250]/80 to-[#112250]" />
        {post.featured_image && (
          <div
            className="absolute inset-0 bg-cover bg-center opacity-20"
            style={{ backgroundImage: `url(${post.featured_image})` }}
          />
        )}

        <div className="container-custom mx-auto relative z-10">
          <Link
            href="/insights"
            className="inline-flex items-center text-gray-300 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Insights
          </Link>

          {post.category && (
            <div className="mb-4">
              <span className="inline-block text-xs font-bold px-3 py-1 rounded-full bg-[#D8B893] text-[#112250] font-libre uppercase">
                {post.category}
              </span>
            </div>
          )}

          <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white max-w-4xl">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-gray-300 font-libre">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span>{formatDate(post.published_at)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <span>{estimateReadTime(post.content)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <article className="container-custom mx-auto py-16">
        <div className="max-w-4xl mx-auto">
          {/* Featured Image */}
          {post.featured_image && (
            <div className="mb-12 rounded-2xl overflow-hidden shadow-xl">
              <img
                src={post.featured_image}
                alt={post.title}
                className="w-full h-auto"
              />
            </div>
          )}

          {/* Excerpt */}
          {post.excerpt && (
            <div className="text-xl text-gray-700 font-libre italic mb-12 pb-12 border-b-2 border-gray-200">
              {post.excerpt}
            </div>
          )}

          {/* Content */}
          <div
            className="prose prose-lg max-w-none font-libre
              prose-headings:font-playfair prose-headings:text-[#112250]
              prose-p:text-gray-700 prose-p:leading-relaxed
              prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
              prose-strong:text-gray-900 prose-strong:font-bold
              prose-ul:list-disc prose-ol:list-decimal
              prose-blockquote:border-l-4 prose-blockquote:border-[#D8B893] prose-blockquote:pl-6 prose-blockquote:italic
              prose-img:rounded-lg prose-img:shadow-lg
            "
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t-2 border-gray-200">
              <div className="flex items-center gap-3 flex-wrap">
                <Tag className="w-5 h-5 text-gray-500" />
                {post.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-libre"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Back to Insights */}
          <div className="mt-16 text-center">
            <Link
              href="/insights"
              className="inline-flex items-center px-6 py-3 bg-[#112250] text-white rounded-lg hover:bg-[#1a2f6f] transition-colors font-semibold"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to All Insights
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
}
