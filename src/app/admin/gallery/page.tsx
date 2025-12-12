'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  Image as ImageIcon,
  Video,
  Eye,
  Plus,
  Edit,
  Trash2,
  Loader2,
  X,
  Save,
  AlertCircle,
  Upload,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ToastContainer, type ToastType } from '@/components/admin/Toast';
import Image from 'next/image';

interface GalleryItem {
  id: string;
  title: string;
  description?: string | null;
  type: 'IMAGE' | 'TOUR';
  media_url: string;
  thumbnail?: string | null;
  location?: string | null;
  plot_id?: string | null;
  is_active: boolean;
  display_order: number;
  created_at: Date;
  updated_at: Date;
}

interface FormData {
  title: string;
  description: string;
  type: 'IMAGE' | 'TOUR';
  media_url: string;
  thumbnail: string;
  location: string;
  is_active: boolean;
  display_order: number;
}

export default function AdminGalleryPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [filterType, setFilterType] = useState<'ALL' | 'IMAGE' | 'TOUR'>('ALL');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [toasts, setToasts] = useState<Array<{ id: string; message: string; type: ToastType }>>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    type: 'IMAGE',
    media_url: '',
    thumbnail: '',
    location: '',
    is_active: true,
    display_order: 0,
  });

  const addToast = (message: string, type: ToastType) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  useEffect(() => {
    // Still loading → don't redirect
  if (status === 'loading') return;
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    } else if (session?.user?.role !== 'ADMIN') {
      router.push('/dashboard');
    }
  }, [session, status, router]);

  useEffect(() => {
    if (session?.user?.role === 'ADMIN') {
      fetchItems();
    }
  }, [session]);

  const fetchItems = async () => {
    try {
      const response = await fetch('/api/admin/gallery');
      const result = await response.json();

      if (result.success) {
        setItems(result.data);
      } else {
        addToast('Failed to load gallery items', 'error');
      }
    } catch (error) {
      console.error('Error fetching gallery items:', error);
      addToast('Error loading gallery items', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      let mediaUrl = formData.media_url;

      // For IMAGE type
      if (formData.type === 'IMAGE') {
        // Upload file if selected
        if (selectedFile) {
          const uploadedUrl = await handleFileUpload();
          if (!uploadedUrl) {
            setSaving(false);
            return;
          }
          mediaUrl = uploadedUrl;
        } else if (!editingItem) {
          // If creating new item, file is required
          addToast('Please select an image file to upload', 'error');
          setSaving(false);
          return;
        }
        // If editing and no new file selected, keep existing mediaUrl
      }

      // For TOUR type, validate YouTube URL
      if (formData.type === 'TOUR') {
        if (!mediaUrl) {
          addToast('Please provide a YouTube URL for the tour', 'error');
          setSaving(false);
          return;
        }

        // Validate it's a valid YouTube URL (including Shorts)
        const isYouTubeUrl = /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/.test(mediaUrl);
        if (!isYouTubeUrl) {
          addToast('Please enter a valid YouTube URL', 'error');
          setSaving(false);
          return;
        }
      }

      const url = '/api/admin/gallery';
      const method = editingItem ? 'PUT' : 'POST';
      const body = editingItem
        ? { id: editingItem.id, ...formData, media_url: mediaUrl }
        : { ...formData, media_url: mediaUrl };

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const result = await response.json();

      if (result.success) {
        addToast(result.message || 'Gallery item saved successfully!', 'success');
        setShowModal(false);
        setEditingItem(null);
        resetForm();
        fetchItems();
      } else {
        addToast(result.error || 'Failed to save gallery item', 'error');
      }
    } catch (error) {
      console.error('Error saving gallery item:', error);
      addToast('Failed to save gallery item. Please try again.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this gallery item?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/gallery?id=${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        addToast('Gallery item deleted successfully!', 'success');
        fetchItems();
      } else {
        addToast(result.error || 'Failed to delete gallery item', 'error');
      }
    } catch (error) {
      console.error('Error deleting gallery item:', error);
      addToast('Failed to delete gallery item', 'error');
    }
  };

  const handleEdit = (item: GalleryItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description || '',
      type: item.type,
      media_url: item.media_url,
      thumbnail: item.thumbnail || '',
      location: item.location || '',
      is_active: item.is_active,
      display_order: item.display_order,
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      type: 'IMAGE',
      media_url: '',
      thumbnail: '',
      location: '',
      is_active: true,
      display_order: 0,
    });
    setSelectedFile(null);
    setPreviewUrl('');
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (formData.type === 'IMAGE') {
      if (!file.type.startsWith('image/')) {
        addToast('Please select an image file', 'error');
        return;
      }
    }

    // Validate file size (10MB max for images)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      addToast('File too large. Maximum size is 10MB', 'error');
      return;
    }

    setSelectedFile(file);

    // Create preview URL for images
    if (formData.type === 'IMAGE') {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) return null;

    setUploading(true);
    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', selectedFile);
      uploadFormData.append('folder', 'gallery/images');

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      });

      const result = await response.json();

      if (result.success) {
        return result.data.url;
      } else {
        addToast(result.error || 'Upload failed', 'error');
        return null;
      }
    } catch (error) {
      console.error('Upload error:', error);
      addToast('Failed to upload file', 'error');
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingItem(null);
    resetForm();
  };

  const filteredItems = items.filter((item) => {
    if (filterType === 'ALL') return true;
    return item.type === filterType;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'IMAGE':
        return <ImageIcon className="w-5 h-5" />;
      case 'TOUR':
        return <Eye className="w-5 h-5" />;
      default:
        return null;
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <Loader2 className="w-12 h-12 text-[#112250] mx-auto animate-spin" />
          <p className="mt-6 text-gray-600 font-medium">Loading gallery...</p>
        </motion.div>
      </div>
    );
  }

  if (session?.user?.role !== 'ADMIN') {
    return null;
  }

  return (
    <>
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#112250] to-[#1a3570] flex items-center justify-center">
                    <ImageIcon className="w-6 h-6 text-white" />
                  </div>
                  Gallery Management
                </h1>
                <p className="text-gray-600 mt-2 ml-13">Manage images, videos, and virtual tours</p>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowModal(true)}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#112250] to-[#1a3570] text-white rounded-lg hover:from-[#1a3570] hover:to-[#112250] transition-all font-semibold shadow-lg"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Gallery Item
              </motion.button>
            </div>
          </motion.div>

          {/* Filter Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/80 backdrop-blur-xl rounded-xl shadow-sm mb-6 border border-gray-200/50 p-4"
          >
            <div className="flex gap-3 overflow-x-auto">
              {[
                { key: 'ALL', label: `All (${items.length})`, icon: ImageIcon },
                { key: 'IMAGE', label: `Images (${items.filter(i => i.type === 'IMAGE').length})`, icon: ImageIcon },
                { key: 'TOUR', label: `Tours (${items.filter(i => i.type === 'TOUR').length})`, icon: Eye },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <motion.button
                    key={tab.key}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setFilterType(tab.key as any)}
                    className={`px-6 py-2 rounded-lg font-semibold transition-all whitespace-nowrap inline-flex items-center gap-2 ${
                      filterType === tab.key
                        ? 'bg-[#112250] text-white shadow-md'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>

          {/* Gallery Grid */}
          {filteredItems.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl p-12 text-center shadow-sm"
            >
              <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No gallery items found</p>
              <p className="text-gray-400 text-sm mt-2">Create your first gallery item to get started</p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all border border-gray-200/50"
                >
                  {/* Thumbnail */}
                  <div className="relative h-48 bg-gray-100">
                    {item.type === 'IMAGE' && item.media_url ? (
                      <Image
                        src={item.thumbnail || item.media_url}
                        alt={item.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : (
                      <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${item.thumbnail || '/images/placeholder.jpg'})` }}
                      />
                    )}
                    <div className="absolute top-3 left-3">
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#D8B893] text-[#112250] font-semibold text-sm">
                        {getIcon(item.type)}
                        {item.type}
                      </div>
                    </div>
                    {!item.is_active && (
                      <div className="absolute top-3 right-3">
                        <div className="px-3 py-1.5 rounded-full bg-red-500 text-white font-semibold text-sm">
                          Inactive
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">
                      {item.title}
                    </h3>
                    {item.description && (
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {item.description}
                      </p>
                    )}
                    {item.location && (
                      <p className="text-gray-500 text-sm mb-4">
                        📍 {item.location}
                      </p>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2 pt-4 border-t border-gray-100">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleEdit(item)}
                        className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-[#112250] text-white rounded-lg hover:bg-[#1a3570] transition-colors font-medium text-sm"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDelete(item.id)}
                        className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium text-sm"
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal for Create/Edit */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={handleCloseModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingItem ? 'Edit Gallery Item' : 'Add Gallery Item'}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Type *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {['IMAGE', 'TOUR'].map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => {
                          setFormData({ ...formData, type: type as any, media_url: '' });
                          setSelectedFile(null);
                          setPreviewUrl('');
                        }}
                        className={`px-4 py-3 rounded-lg font-semibold transition-all inline-flex items-center justify-center gap-2 ${
                          formData.type === type
                            ? 'bg-[#112250] text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {getIcon(type)}
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 bg-white text-gray-900 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#112250] focus:border-[#112250] transition-all font-medium"
                    placeholder="Enter title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 bg-white text-gray-900 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#112250] focus:border-[#112250] transition-all font-medium resize-none"
                    placeholder="Enter description"
                  />
                </div>

                {/* File Upload for Images */}
                {formData.type === 'IMAGE' && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Upload Image *
                    </label>
                    <div className="space-y-3">
                      <div className="flex items-center justify-center w-full">
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="w-10 h-10 mb-3 text-gray-400" />
                            <p className="mb-2 text-sm text-gray-500">
                              <span className="font-semibold">Click to upload</span> or drag and drop
                            </p>
                            <p className="text-xs text-gray-500">
                              PNG, JPG, WEBP (max 10MB)
                            </p>
                          </div>
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleFileSelect}
                          />
                        </label>
                      </div>

                      {selectedFile && (
                        <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <div className="flex-shrink-0">
                            {formData.type === 'IMAGE' ? (
                              <ImageIcon className="w-5 h-5 text-blue-600" />
                            ) : (
                              <Video className="w-5 h-5 text-blue-600" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{selectedFile.name}</p>
                            <p className="text-xs text-gray-500">
                              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedFile(null);
                              setPreviewUrl('');
                            }}
                            className="flex-shrink-0 text-red-600 hover:text-red-800"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      )}

                      {previewUrl && formData.type === 'IMAGE' && (
                        <div className="relative w-full h-48 rounded-lg overflow-hidden border-2 border-gray-200">
                          <Image
                            src={previewUrl}
                            alt="Preview"
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}

                      {uploading && (
                        <div className="flex items-center gap-2 text-sm text-blue-600">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Uploading...</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* YouTube URL for Tours */}
                {formData.type === 'TOUR' && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      YouTube URL *
                    </label>
                    <input
                      type="url"
                      required
                      value={formData.media_url}
                      onChange={(e) => setFormData({ ...formData, media_url: e.target.value })}
                      className="w-full px-4 py-3 bg-white text-gray-900 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#112250] focus:border-[#112250] transition-all font-medium"
                      placeholder="https://youtube.com/watch?v=..."
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      <span className="font-semibold">YouTube videos & Shorts supported</span>
                      <br />
                      Examples: youtube.com/watch?v=... or youtube.com/shorts/...
                    </p>
                  </div>
                )}


                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-4 py-3 bg-white text-gray-900 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#112250] focus:border-[#112250] transition-all font-medium"
                    placeholder="e.g., Auroville, Pondicherry"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Display Order
                    </label>
                    <input
                      type="number"
                      value={formData.display_order}
                      onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-3 bg-white text-gray-900 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#112250] focus:border-[#112250] transition-all font-medium"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Status
                    </label>
                    <select
                      value={formData.is_active ? 'active' : 'inactive'}
                      onChange={(e) => setFormData({ ...formData, is_active: e.target.value === 'active' })}
                      className="w-full px-4 py-3 bg-white text-gray-900 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#112250] focus:border-[#112250] transition-all font-medium"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-[#112250] to-[#1a3570] text-white rounded-lg hover:from-[#1a3570] hover:to-[#112250] transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-lg"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5 mr-2" />
                        {editingItem ? 'Update' : 'Create'}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
