'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Eye, EyeOff } from 'lucide-react';

export default function EditBlogPost({ params }: { params: { id: string } }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    featured_image: '',
    category: '',
    tags: '',
    meta_title: '',
    meta_description: '',
    is_published: false,
  });

  useEffect(() => {
    if (session?.user?.role === 'ADMIN') {
      fetchBlogPost();
    }
  }, [session]);

  const fetchBlogPost = async () => {
    try {
      const response = await fetch(`/api/admin/blog-posts/${params.id}`);
      const result = await response.json();

      if (result.success) {
        const post = result.data;
        setFormData({
          title: post.title || '',
          slug: post.slug || '',
          content: post.content || '',
          excerpt: post.excerpt || '',
          featured_image: post.featured_image || '',
          category: post.category || '',
          tags: post.tags?.join(', ') || '',
          meta_title: post.meta_title || '',
          meta_description: post.meta_description || '',
          is_published: post.is_published || false,
        });
      } else {
        alert('Blog post not found');
        router.push('/admin/blog-posts');
      }
    } catch (error) {
      console.error('Error fetching blog post:', error);
      alert('Failed to load blog post');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent, publish?: boolean) => {
    e.preventDefault();
    setSaving(true);

    try {
      const tagsArray = formData.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag);

      const updateData = {
        ...formData,
        tags: tagsArray,
        is_published: publish !== undefined ? publish : formData.is_published,
      };

      const response = await fetch(`/api/admin/blog-posts/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });

      const result = await response.json();

      if (result.success) {
        alert('Blog post updated successfully!');
        router.push('/admin/blog-posts');
      } else {
        alert(result.error || 'Failed to update blog post');
      }
    } catch (error) {
      console.error('Error updating blog post:', error);
      alert('Failed to update blog post');
    } finally {
      setSaving(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (session?.user?.role !== 'ADMIN') {
    router.push('/dashboard');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin/blog-posts"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog Posts
          </Link>
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Edit Blog Post</h1>
            <div className="flex items-center space-x-2">
              {formData.is_published ? (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  <Eye className="w-4 h-4 mr-1" />
                  Published
                </span>
              ) : (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                  <EyeOff className="w-4 h-4 mr-1" />
                  Draft
                </span>
              )}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Main Content Card */}
          <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Post Content</h2>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Slug */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Slug *
              </label>
              <input
                type="text"
                required
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-sm text-gray-500 mt-1">
                URL: /insights/{formData.slug}
              </p>
            </div>

            {/* Excerpt */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Excerpt
              </label>
              <textarea
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content *
              </label>
              <textarea
                required
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={15}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
              />
            </div>
          </div>

          {/* Media & Organization Card */}
          <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Media & Organization</h2>

            {/* Featured Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Featured Image URL
              </label>
              <input
                type="url"
                value={formData.featured_image}
                onChange={(e) =>
                  setFormData({ ...formData, featured_image: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Category</option>
                <option value="Real Estate">Real Estate</option>
                <option value="Investment">Investment</option>
                <option value="Luxury">Luxury</option>
                <option value="Guide">Guide</option>
                <option value="Market Trends">Market Trends</option>
                <option value="Design">Design</option>
              </select>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* SEO Card */}
          <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">SEO Settings</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Meta Title
              </label>
              <input
                type="text"
                value={formData.meta_title}
                onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Meta Description
              </label>
              <textarea
                value={formData.meta_description}
                onChange={(e) =>
                  setFormData({ ...formData, meta_description: e.target.value })
                }
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-4">
            <Link
              href="/admin/blog-posts"
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>
            {formData.is_published ? (
              <button
                type="button"
                onClick={(e) => handleSubmit(e, false)}
                disabled={saving}
                className="inline-flex items-center px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
              >
                <EyeOff className="w-4 h-4 mr-2" />
                {saving ? 'Unpublishing...' : 'Unpublish'}
              </button>
            ) : (
              <button
                type="button"
                onClick={(e) => handleSubmit(e, true)}
                disabled={saving}
                className="inline-flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                <Eye className="w-4 h-4 mr-2" />
                {saving ? 'Publishing...' : 'Publish'}
              </button>
            )}
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
