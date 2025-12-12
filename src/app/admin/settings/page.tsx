'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  Save,
  Building2,
  Mail,
  Phone,
  MapPin,
  MessageCircle,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Globe,
  Search,
  Loader2,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ToastContainer, type ToastType } from '@/components/admin/Toast';

interface SiteSettings {
  site_name: string;
  tagline?: string;
  company_email?: string;
  company_phone?: string;
  company_address?: string;
  whatsapp_number?: string;
  facebook_url?: string;
  twitter_url?: string;
  instagram_url?: string;
  linkedin_url?: string;
  youtube_url?: string;
  about_us?: string;
  footer_text?: string;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  logo_url?: string;
  favicon_url?: string;
  google_analytics_id?: string;
  google_maps_api_key?: string;
}

export default function SiteSettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [formData, setFormData] = useState<SiteSettings>({
    site_name: '',
  });
  const [toasts, setToasts] = useState<Array<{ id: string; message: string; type: ToastType }>>([]);
  const [hasChanges, setHasChanges] = useState(false);
  const [originalData, setOriginalData] = useState<SiteSettings>({ site_name: '' });

  const addToast = (message: string, type: ToastType) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    } else if (session?.user?.role !== 'ADMIN') {
      router.push('/dashboard');
    }
  }, [session, status, router]);

  useEffect(() => {
    if (session?.user?.role === 'ADMIN') {
      fetchSettings();
    }
  }, [session]);

  useEffect(() => {
    const changed = JSON.stringify(formData) !== JSON.stringify(originalData);
    setHasChanges(changed);
  }, [formData, originalData]);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/admin/site-settings');
      const result = await response.json();

      if (result.success) {
        setFormData(result.data);
        setOriginalData(result.data);
      } else {
        addToast('Failed to load settings', 'error');
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      addToast('Error loading settings', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch('/api/admin/site-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        addToast('Settings saved successfully!', 'success');
        setOriginalData(formData);
        setHasChanges(false);
      } else {
        addToast(result.error || 'Failed to save settings', 'error');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      addToast('Failed to save settings. Please try again.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setFormData(originalData);
    setHasChanges(false);
    addToast('Changes discarded', 'info');
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="relative">
            <Loader2 className="w-12 h-12 text-[#112250] mx-auto animate-spin" />
            <motion.div
              className="absolute inset-0"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <div className="w-12 h-12 border-2 border-[#D8B893] border-t-transparent rounded-full" />
            </motion.div>
          </div>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 text-gray-600 font-medium"
          >
            Loading settings...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  if (session?.user?.role !== 'ADMIN') {
    return null;
  }

  const tabs = [
    { id: 'general', label: 'General', icon: Building2 },
    { id: 'contact', label: 'Contact', icon: Phone },
    { id: 'social', label: 'Social Media', icon: Globe },
    { id: 'seo', label: 'SEO', icon: Search },
  ];

  return (
    <>
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
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
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                  Site Settings
                </h1>
                <p className="text-gray-600 mt-2 ml-13">Manage your website configuration and preferences</p>
              </div>

              {hasChanges && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 rounded-lg"
                >
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  <span className="text-sm font-medium text-amber-800">Unsaved changes</span>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/80 backdrop-blur-xl rounded-xl shadow-sm mb-6 border border-gray-200/50"
          >
            <div className="border-b border-gray-200">
              <nav className="flex space-x-2 sm:space-x-8 px-4 sm:px-6 overflow-x-auto" aria-label="Tabs">
                {tabs.map((tab, index) => {
                  const Icon = tab.icon;
                  return (
                    <motion.button
                      key={tab.id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + index * 0.05 }}
                      onClick={() => setActiveTab(tab.id)}
                      className={`
                        relative py-4 px-3 sm:px-4 inline-flex items-center gap-2 font-medium text-sm transition-all whitespace-nowrap
                        ${
                          activeTab === tab.id
                            ? 'text-[#112250]'
                            : 'text-gray-500 hover:text-gray-700'
                        }
                      `}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="hidden sm:inline">{tab.label}</span>

                      {activeTab === tab.id && (
                        <motion.div
                          layoutId="activeTabIndicator"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#112250] to-[#D8B893]"
                          transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                    </motion.button>
                  );
                })}
              </nav>
            </div>
          </motion.div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <AnimatePresence mode="wait">
            {/* General Tab */}
            {activeTab === 'general' && (
              <motion.div
                key="general"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-white/80 backdrop-blur-xl rounded-xl shadow-sm p-6 space-y-6 border border-gray-200/50"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#112250] to-[#1a3570] flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">General Information</h2>
                </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Site Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.site_name || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, site_name: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-white text-gray-900 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#112250] focus:border-[#112250] transition-all font-medium placeholder:text-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Tagline
                  </label>
                  <input
                    type="text"
                    value={formData.tagline || ''}
                    onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                    className="w-full px-4 py-3 bg-white text-gray-900 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#112250] focus:border-[#112250] transition-all font-medium placeholder:text-gray-400"
                    placeholder="Your Premium Real Estate Partner"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  About Us
                </label>
                <textarea
                  value={formData.about_us || ''}
                  onChange={(e) => setFormData({ ...formData, about_us: e.target.value })}
                  rows={5}
                  className="w-full px-4 py-3 bg-white text-gray-900 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#112250] focus:border-[#112250] transition-all font-medium placeholder:text-gray-400 resize-none"
                  placeholder="Brief description about your company..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Footer Text
                </label>
                <input
                  type="text"
                  value={formData.footer_text || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, footer_text: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-white text-gray-900 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#112250] focus:border-[#112250] transition-all font-medium placeholder:text-gray-400"
                  placeholder="© 2025 PLOTZED. All rights reserved."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Logo URL
                  </label>
                  <input
                    type="url"
                    value={formData.logo_url || ''}
                    onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
                    className="w-full px-4 py-3 bg-white text-gray-900 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#112250] focus:border-[#112250] transition-all font-medium placeholder:text-gray-400"
                    placeholder="https://example.com/logo.png"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Favicon URL
                  </label>
                  <input
                    type="url"
                    value={formData.favicon_url || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, favicon_url: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-white text-gray-900 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#112250] focus:border-[#112250] transition-all font-medium placeholder:text-gray-400"
                    placeholder="https://example.com/favicon.ico"
                  />
                </div>
              </div>
              </motion.div>
            )}

          {/* Contact Tab */}
          {activeTab === 'contact' && (
            <motion.div
              key="contact"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white/80 backdrop-blur-xl rounded-xl shadow-sm p-6 space-y-6 border border-gray-200/50"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#112250] to-[#1a3570] flex items-center justify-center">
                  <Phone className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Contact Information</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    <Mail className="w-4 h-4 inline mr-2" />
                    Company Email
                  </label>
                  <input
                    type="email"
                    value={formData.company_email || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, company_email: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-white text-gray-900 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#112250] focus:border-[#112250] transition-all font-medium placeholder:text-gray-400"
                    placeholder="info@plotzed.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    <Phone className="w-4 h-4 inline mr-2" />
                    Company Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.company_phone || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, company_phone: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-white text-gray-900 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#112250] focus:border-[#112250] transition-all font-medium placeholder:text-gray-400"
                    placeholder="+91 XXXX XXXXXX"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-2" />
                  Company Address
                </label>
                <textarea
                  value={formData.company_address || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, company_address: e.target.value })
                  }
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Street Address, City, State, ZIP"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MessageCircle className="w-4 h-4 inline mr-2" />
                  WhatsApp Number
                </label>
                <input
                  type="tel"
                  value={formData.whatsapp_number || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, whatsapp_number: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="+91 XXXX XXXXXX"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Include country code (e.g., +91 for India)
                </p>
              </div>
            </motion.div>
          )}

          {/* Social Media Tab */}
          {activeTab === 'social' && (
            <motion.div
              key="social"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white/80 backdrop-blur-xl rounded-xl shadow-sm p-6 space-y-6 border border-gray-200/50"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#112250] to-[#1a3570] flex items-center justify-center">
                  <Globe className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Social Media Links</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    <Facebook className="w-4 h-4 inline mr-2" />
                    Facebook URL
                  </label>
                  <input
                    type="url"
                    value={formData.facebook_url || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, facebook_url: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-white text-gray-900 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#112250] focus:border-[#112250] transition-all font-medium placeholder:text-gray-400"
                    placeholder="https://facebook.com/plotzed"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    <Twitter className="w-4 h-4 inline mr-2" />
                    Twitter URL
                  </label>
                  <input
                    type="url"
                    value={formData.twitter_url || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, twitter_url: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-white text-gray-900 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#112250] focus:border-[#112250] transition-all font-medium placeholder:text-gray-400"
                    placeholder="https://twitter.com/plotzed"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    <Instagram className="w-4 h-4 inline mr-2" />
                    Instagram URL
                  </label>
                  <input
                    type="url"
                    value={formData.instagram_url || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, instagram_url: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-white text-gray-900 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#112250] focus:border-[#112250] transition-all font-medium placeholder:text-gray-400"
                    placeholder="https://instagram.com/plotzed"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    <Linkedin className="w-4 h-4 inline mr-2" />
                    LinkedIn URL
                  </label>
                  <input
                    type="url"
                    value={formData.linkedin_url || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, linkedin_url: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-white text-gray-900 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#112250] focus:border-[#112250] transition-all font-medium placeholder:text-gray-400"
                    placeholder="https://linkedin.com/company/plotzed"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    <Youtube className="w-4 h-4 inline mr-2" />
                    YouTube URL
                  </label>
                  <input
                    type="url"
                    value={formData.youtube_url || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, youtube_url: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-white text-gray-900 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#112250] focus:border-[#112250] transition-all font-medium placeholder:text-gray-400"
                    placeholder="https://youtube.com/@plotzed"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* SEO Tab */}
          {activeTab === 'seo' && (
            <motion.div
              key="seo"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white/80 backdrop-blur-xl rounded-xl shadow-sm p-6 space-y-6 border border-gray-200/50"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#112250] to-[#1a3570] flex items-center justify-center">
                  <Search className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">SEO & Analytics</h2>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Meta Title
                </label>
                <input
                  type="text"
                  value={formData.meta_title || ''}
                  onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="PLOTZED - Premium Real Estate"
                />
                <p className="text-sm text-gray-500 mt-1">
                  {formData.meta_title?.length || 0}/60 characters
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Meta Description
                </label>
                <textarea
                  value={formData.meta_description || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, meta_description: e.target.value })
                  }
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Discover luxury properties and premium plots..."
                />
                <p className="text-sm text-gray-500 mt-1">
                  {formData.meta_description?.length || 0}/160 characters
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Meta Keywords
                </label>
                <input
                  type="text"
                  value={formData.meta_keywords || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, meta_keywords: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="real estate, property, plots, luxury (comma-separated)"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Google Analytics ID
                  </label>
                  <input
                    type="text"
                    value={formData.google_analytics_id || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, google_analytics_id: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-white text-gray-900 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#112250] focus:border-[#112250] transition-all font-medium placeholder:text-gray-400"
                    placeholder="G-XXXXXXXXXX"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Google Maps API Key
                  </label>
                  <input
                    type="text"
                    value={formData.google_maps_api_key || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, google_maps_api_key: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-white text-gray-900 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#112250] focus:border-[#112250] transition-all font-medium placeholder:text-gray-400"
                    placeholder="AIza..."
                  />
                </div>
              </div>
            </motion.div>
          )}
          </AnimatePresence>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t-2 border-gray-200"
          >
            <div className="flex items-center gap-2 text-sm text-gray-600">
              {hasChanges ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2"
                >
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  <span>You have unsaved changes</span>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>All changes saved</span>
                </motion.div>
              )}
            </div>

            <div className="flex gap-3">
              {hasChanges && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all font-semibold border-2 border-gray-300"
                >
                  Discard Changes
                </motion.button>
              )}

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={saving || !hasChanges}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#112250] to-[#1a3570] text-white rounded-lg hover:from-[#1a3570] hover:to-[#112250] transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-lg disabled:shadow-none"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5 mr-2" />
                    Save Settings
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        </form>
      </div>
    </div>
    </>
  );
}
