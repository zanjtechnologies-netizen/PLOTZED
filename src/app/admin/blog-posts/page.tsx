'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Search,
  Filter,
  Calendar,
  FileText,
} from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  category?: string;
  tags: string[];
  is_published: boolean;
  published_at?: string;
  created_at: string;
  updated_at: string;
}

export default function BlogPostsManagement() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPublished, setFilterPublished] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    } else if (session?.user?.role !== 'ADMIN') {
      router.push('/dashboard');
    }
  }, [session, status, router]);

  useEffect(() => {
    if (session?.user?.role === 'ADMIN') {
      fetchBlogPosts();
    }
  }, [session, currentPage, filterPublished, filterCategory, searchQuery]);

  const fetchBlogPosts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
      });

      if (filterPublished !== 'all') {
        params.append('published', filterPublished);
      }

      if (filterCategory !== 'all') {
        params.append('category', filterCategory);
      }

      if (searchQuery) {
        params.append('search', searchQuery);
      }

      const response = await fetch(`/api/admin/blog-posts?${params}`);
      const result = await response.json();

      if (result.success) {
        setPosts(result.data.posts);
        setTotalPages(result.data.pagination.totalPages);
      }
    } catch (error) {
      console.error('Error fetching blog posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;

    try {
      const response = await fetch(`/api/admin/blog-posts/${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        alert('Blog post deleted successfully');
        fetchBlogPosts();
      } else {
        alert(result.error || 'Failed to delete blog post');
      }
    } catch (error) {
      console.error('Error deleting blog post:', error);
      alert('Failed to delete blog post');
    }
  };

  const togglePublish = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/blog-posts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_published: !currentStatus }),
      });

      const result = await response.json();

      if (result.success) {
        alert(`Blog post ${!currentStatus ? 'published' : 'unpublished'} successfully`);
        fetchBlogPosts();
      } else {
        alert(result.error || 'Failed to update blog post');
      }
    } catch (error) {
      console.error('Error updating blog post:', error);
      alert('Failed to update blog post');
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (session?.user?.role !== 'ADMIN') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Blog Posts</h1>
            <p className="text-gray-600 mt-1">Manage your blog content</p>
          </div>
          <Link
            href="/admin/blog-posts/new"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            New Post
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Published Filter */}
            <select
              value={filterPublished}
              onChange={(e) => setFilterPublished(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="true">Published</option>
              <option value="false">Draft</option>
            </select>

            {/* Category Filter */}
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              <option value="Real Estate">Real Estate</option>
              <option value="Investment">Investment</option>
              <option value="Luxury">Luxury</option>
              <option value="Guide">Guide</option>
            </select>
          </div>
        </div>

        {/* Posts Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Post
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Published
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {posts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600">No blog posts found</p>
                    <Link
                      href="/admin/blog-posts/new"
                      className="text-blue-600 hover:underline mt-2 inline-block"
                    >
                      Create your first post
                    </Link>
                  </td>
                </tr>
              ) : (
                posts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">{post.title}</div>
                        <div className="text-sm text-gray-500">/{post.slug}</div>
                        {post.excerpt && (
                          <div className="text-sm text-gray-600 mt-1 line-clamp-1">
                            {post.excerpt}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {post.category && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {post.category}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {post.is_published ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <Eye className="w-3 h-3 mr-1" />
                          Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          <EyeOff className="w-3 h-3 mr-1" />
                          Draft
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {post.published_at
                        ? new Date(post.published_at).toLocaleDateString()
                        : '-'}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => togglePublish(post.id, post.is_published)}
                        className="inline-flex items-center px-3 py-1 text-sm text-gray-700 hover:text-blue-600 transition-colors"
                        title={post.is_published ? 'Unpublish' : 'Publish'}
                      >
                        {post.is_published ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                      <Link
                        href={`/admin/blog-posts/${post.id}/edit`}
                        className="inline-flex items-center px-3 py-1 text-sm text-gray-700 hover:text-blue-600 transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="inline-flex items-center px-3 py-1 text-sm text-gray-700 hover:text-red-600 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex justify-center">
            <nav className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              <span className="text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
}
