// ================================================
// src/components/admin/BlogPostModal.tsx
// Unified Modal for creating/editing blog posts
// ================================================

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { X, Upload, Trash2, Tag, FileText, Eye, Calendar } from 'lucide-react'

interface BlogPostModalProps {
  isOpen: boolean
  onClose: () => void
  post?: any // Existing post for editing, undefined for new
  onSuccess?: () => void
}

export default function BlogPostModal({
  isOpen,
  onClose,
  post,
  onSuccess,
}: BlogPostModalProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    category: '',
    meta_title: '',
    meta_description: '',
    is_published: false,
  })
  const [featuredImage, setFeaturedImage] = useState<string>('')
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')

  // Predefined categories
  const categories = ['Real Estate', 'Investment', 'Luxury', 'Guide', 'Market Trends', 'Tips']

  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title || '',
        slug: post.slug || '',
        content: post.content || '',
        excerpt: post.excerpt || '',
        category: post.category || '',
        meta_title: post.meta_title || '',
        meta_description: post.meta_description || '',
        is_published: post.is_published || false,
      })
      setFeaturedImage(post.featured_image || '')
      setTags(post.tags || [])
    } else {
      // Reset for new post
      setFormData({
        title: '',
        slug: '',
        content: '',
        excerpt: '',
        category: '',
        meta_title: '',
        meta_description: '',
        is_published: false,
      })
      setFeaturedImage('')
      setTags([])
    }
  }, [post, isOpen])

  // Auto-generate slug from title
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value
    setFormData((prev) => ({
      ...prev,
      title,
      // Auto-generate slug if it's a new post or slug was auto-generated
      slug: !post || prev.slug === generateSlug(prev.title) ? generateSlug(title) : prev.slug,
      // Auto-generate meta_title if empty
      meta_title: prev.meta_title || title,
    }))
  }

  const generateSlug = (text: string): string => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/[\s-]+/g, '-')
      .substring(0, 100)
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleAddTag = () => {
    const trimmedTag = tagInput.trim()
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags((prev) => [...prev, trimmedTag])
      setTagInput('')
    }
  }

  const handleRemoveTag = (tag: string) => {
    setTags((prev) => prev.filter((t) => t !== tag))
  }

  const handleFeaturedImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file')
      return
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB')
      return
    }

    setUploadingImage(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', 'blog')

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()
      if (data.success && data.data?.url) {
        setFeaturedImage(data.data.url)
        alert('Featured image uploaded successfully!')
      } else {
        throw new Error(data.error || 'Upload failed')
      }
    } catch (error) {
      console.error('Image upload error:', error)
      alert('Failed to upload image. Please try again.')
    } finally {
      setUploadingImage(false)
    }
  }

  const handleRemoveFeaturedImage = () => {
    if (confirm('Are you sure you want to remove the featured image?')) {
      setFeaturedImage('')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Validation
      if (!formData.title.trim()) {
        alert('Title is required')
        setLoading(false)
        return
      }

      if (!formData.slug.trim()) {
        alert('Slug is required')
        setLoading(false)
        return
      }

      if (!formData.content.trim()) {
        alert('Content is required')
        setLoading(false)
        return
      }

      const payload = {
        title: formData.title,
        slug: formData.slug,
        content: formData.content,
        excerpt: formData.excerpt || undefined,
        featured_image: featuredImage || undefined,
        category: formData.category || undefined,
        tags: tags,
        meta_title: formData.meta_title || undefined,
        meta_description: formData.meta_description || undefined,
        is_published: formData.is_published,
      }

      const url = post ? `/api/admin/blog-posts/${post.id}` : '/api/admin/blog-posts'
      const method = post ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (data.success) {
        alert(post ? 'Blog post updated successfully!' : 'Blog post created successfully!')
        router.refresh()
        if (onSuccess) {
          onSuccess()
        }
        onClose()
      } else {
        const errorMessage = data.error || 'Unknown error occurred'
        alert(`Error: ${errorMessage}`)
        console.error('Error:', data)
      }
    } catch (error) {
      console.error('Submit error:', error)
      alert('Failed to save blog post. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white rounded-lg max-w-5xl w-full mx-4 my-8 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-2xl font-bold text-gray-900">
            {post ? 'Edit Blog Post' : 'Create New Blog Post'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            disabled={loading}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Basic Information
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleTitleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
                placeholder="Enter blog post title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Slug * <span className="text-xs text-gray-500">(Auto-generated from title)</span>
              </label>
              <input
                type="text"
                name="slug"
                required
                value={formData.slug}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
                placeholder="post-slug-here"
              />
              <p className="text-xs text-gray-500 mt-1">URL: /blog/{formData.slug || 'post-slug'}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  Publishing Status
                </label>
                <label className="flex items-center mt-2">
                  <input
                    type="checkbox"
                    name="is_published"
                    checked={formData.is_published}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Publish immediately</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Excerpt / Short Description
              </label>
              <textarea
                name="excerpt"
                value={formData.excerpt}
                onChange={handleInputChange}
                rows={3}
                maxLength={300}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
                placeholder="Brief description shown in post previews (max 300 characters)"
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.excerpt.length}/300 characters
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-4 border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900">Content *</h3>
            <div>
              <textarea
                name="content"
                required
                value={formData.content}
                onChange={handleInputChange}
                rows={16}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 font-mono text-sm"
                placeholder="Write your blog post content here... (Supports Markdown)"
              />
              <p className="text-xs text-gray-500 mt-1">
                You can use Markdown syntax for formatting. Rich text editor can be added later.
              </p>
            </div>
          </div>

          {/* Featured Image */}
          <div className="space-y-4 border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Upload className="w-5 h-5 mr-2" />
              Featured Image
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Featured Image
              </label>
              <div className="flex items-center space-x-4">
                <label className="flex items-center justify-center px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition">
                  <Upload className="w-5 h-5 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600">
                    {uploadingImage ? 'Uploading...' : 'Choose Image'}
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFeaturedImageUpload}
                    disabled={uploadingImage}
                  />
                </label>

                {featuredImage && (
                  <div className="flex items-center space-x-3 flex-1">
                    <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-gray-200">
                      <img
                        src={featuredImage}
                        alt="Featured"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveFeaturedImage}
                      className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                      title="Remove image"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                PNG, JPG, WEBP formats, max 5MB. Recommended size: 1200x630px
              </p>
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-4 border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Tag className="w-5 h-5 mr-2" />
              Tags
            </h3>

            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
                placeholder="Add tag (e.g., real estate, investment)"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* SEO Meta Fields */}
          <div className="space-y-4 border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900">SEO Meta Tags</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Meta Title
              </label>
              <input
                type="text"
                name="meta_title"
                value={formData.meta_title}
                onChange={handleInputChange}
                maxLength={60}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
                placeholder="SEO title for search engines"
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.meta_title.length}/60 characters (optimal for Google)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Meta Description
              </label>
              <textarea
                name="meta_description"
                value={formData.meta_description}
                onChange={handleInputChange}
                rows={3}
                maxLength={160}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
                placeholder="SEO description shown in search results"
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.meta_description.length}/160 characters (optimal for Google)
              </p>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 border-t border-gray-200 pt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || uploadingImage}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {loading ? (
                'Saving...'
              ) : (
                <>
                  {post ? 'Update Post' : 'Create Post'}
                  {formData.is_published && <Eye className="w-4 h-4 ml-2" />}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
