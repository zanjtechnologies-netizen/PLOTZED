'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  Shield,
  Wallet,
  Building2,
  BadgeCheck,
  TrendingUp,
  Zap,
  Trees,
  Car,
  Star,
  MessageCircle,
  ArrowRight,
  Loader2,
  X,
} from 'lucide-react';

// Types - matches API response from /api/plots
interface Plot {
  id: string;
  title: string;
  slug?: string;
  description?: string;
  price: number;
  plot_size: number;
  dimensions: string;
  facing?: string;
  address?: string;
  city: string;
  state?: string;
  images: string[];
  amenities?: string[];
  status: string;
  is_featured?: boolean;
}

interface FormData {
  name: string;
  phone: string;
  email: string;
  plotSize: string;
  budget: string;
  message: string;
}

interface FormErrors {
  name?: string;
  phone?: string;
  email?: string;
}

// Constants
const PHONE_NUMBER = '+91 40 9999909';
const WHATSAPP_NUMBER = '919999999999'; // Update with actual number
const EMAIL = 'reservations@plotzedrealestate.com';
const ADDRESS = 'Plotzed Real Estate, Premium Tower, Business District';

const PLOT_SIZES = [
  { value: '', label: 'Select Plot Size' },
  { value: '30x40', label: '30x40 (1200 sq.ft)' },
  { value: '40x60', label: '40x60 (2400 sq.ft)' },
  { value: '60x40', label: '60x40 (2400 sq.ft)' },
  { value: '50x80', label: '50x80 (4000 sq.ft)' },
  { value: 'custom', label: 'Custom Size' },
];

const BUDGET_RANGES = [
  { value: '', label: 'Select Budget Range' },
  { value: '10-20L', label: '₹10 - 20 Lakhs' },
  { value: '20-30L', label: '₹20 - 30 Lakhs' },
  { value: '30-50L', label: '₹30 - 50 Lakhs' },
  { value: '50L+', label: '₹50 Lakhs+' },
];

// Utility functions
function formatPrice(price: number): string {
  if (price >= 10000000) {
    return `₹${(price / 10000000).toFixed(2)} Cr`;
  } else if (price >= 100000) {
    return `₹${(price / 100000).toFixed(2)} L`;
  }
  return `₹${price.toLocaleString('en-IN')}`;
}

function formatPhoneNumber(value: string): string {
  // Remove all non-digits
  const digits = value.replace(/\D/g, '');
  // Limit to 10 digits (Indian mobile)
  return digits.slice(0, 10);
}

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePhone(phone: string): boolean {
  return /^[6-9]\d{9}$/.test(phone);
}

// ============================================
// HERO SECTION
// ============================================
function HeroSection({ onScrollToForm }: { onScrollToForm: () => void }) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#112250] via-[#0a1a3a] to-[#006DB8]" />

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-white/90 text-sm font-medium">Limited Plots Available</span>
        </div>

        {/* Main Headline */}
        <h1 className="font-playfair text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
          Own Your Dream Plot
          <span className="block text-[#D8B893]">in Prime Location</span>
        </h1>

        {/* Subheadline */}
        <p className="text-xl sm:text-2xl text-white/80 mb-8 max-w-3xl mx-auto">
          Premium Plots Starting from{' '}
          <span className="text-[#D8B893] font-semibold">₹15 Lakhs</span> |{' '}
          <span className="text-white font-semibold">Zero Brokerage</span>
        </p>

        {/* CTA Button */}
        <button
          onClick={onScrollToForm}
          className="group inline-flex items-center gap-3 bg-[#D8B893] hover:bg-[#c9a77e] text-[#112250] font-bold text-lg px-8 py-4 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-xl shadow-lg"
        >
          Schedule Free Site Visit
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>

        {/* Trust Indicators */}
        <div className="mt-12 flex flex-wrap justify-center gap-6 sm:gap-10">
          <div className="flex items-center gap-2 text-white/90">
            <CheckCircle2 className="w-5 h-5 text-green-400" />
            <span className="text-sm sm:text-base">100+ Happy Families</span>
          </div>
          <div className="flex items-center gap-2 text-white/90">
            <Shield className="w-5 h-5 text-green-400" />
            <span className="text-sm sm:text-base">RERA Approved</span>
          </div>
          <div className="flex items-center gap-2 text-white/90">
            <BadgeCheck className="w-5 h-5 text-green-400" />
            <span className="text-sm sm:text-base">Clear Titles</span>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-8 h-12 rounded-full border-2 border-white/30 flex items-start justify-center p-2">
          <div className="w-1.5 h-3 bg-white/60 rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
}

// ============================================
// BENEFITS SECTION
// ============================================
function BenefitsSection() {
  const benefits = [
    {
      icon: Wallet,
      title: 'Zero Brokerage',
      description: 'Direct from developer. No middlemen, no hidden charges.',
    },
    {
      icon: TrendingUp,
      title: 'Flexible EMI',
      description: 'Easy payment plans with bank financing options available.',
    },
    {
      icon: MapPin,
      title: 'Prime Locations',
      description: 'Strategic locations with excellent connectivity & amenities.',
    },
    {
      icon: Shield,
      title: 'RERA Approved',
      description: '100% legal & verified. All documents ready for transfer.',
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-center text-[#112250] mb-12">
          Why Invest With Us?
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="group bg-gradient-to-br from-gray-50 to-white p-6 rounded-2xl border border-gray-100 hover:border-[#D8B893] hover:shadow-lg transition-all duration-300"
            >
              <div className="w-14 h-14 bg-[#112250] rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#006DB8] transition-colors">
                <benefit.icon className="w-7 h-7 text-[#D8B893]" />
              </div>
              <h3 className="font-semibold text-xl text-[#112250] mb-2">{benefit.title}</h3>
              <p className="text-gray-600">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================
// FEATURED PLOTS SECTION
// ============================================
function FeaturedPlotsSection({ onScrollToForm }: { onScrollToForm: () => void }) {
  const [plots, setPlots] = useState<Plot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPlots() {
      try {
        const response = await fetch('/api/plots?status=AVAILABLE&limit=6');
        if (response.ok) {
          const result = await response.json();
          // API returns { success: true, data: { plots: [...] } }
          const plotsData = result.data?.plots || result.plots || [];
          setPlots(Array.isArray(plotsData) ? plotsData : []);
        }
      } catch (error) {
        console.error('Failed to fetch plots:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchPlots();
  }, []);

  if (loading) {
    return (
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-center text-[#112250] mb-12">
            Featured Plots
          </h2>
          <div className="flex justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-[#006DB8]" />
          </div>
        </div>
      </section>
    );
  }

  if (plots.length === 0) {
    return null;
  }

  return (
    <section className="py-16 sm:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-[#112250] mb-4">
            Featured Plots
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our handpicked premium plots in prime locations
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {plots.slice(0, 6).map((plot) => (
            <div
              key={plot.id}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
            >
              {/* Image */}
              <div className="relative h-48 bg-gradient-to-br from-[#112250] to-[#006DB8] overflow-hidden">
                {plot.images?.[0] ? (
                  <Image
                    src={plot.images[0]}
                    alt={plot.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Building2 className="w-16 h-16 text-white/30" />
                  </div>
                )}
                {/* Price Badge */}
                <div className="absolute top-4 right-4 bg-[#D8B893] text-[#112250] font-bold px-3 py-1 rounded-full text-sm">
                  {formatPrice(plot.price)}
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="font-semibold text-lg text-[#112250] mb-2">
                  {plot.title}
                </h3>
                <div className="space-y-2 text-gray-600 text-sm mb-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#006DB8]" />
                    <span>{plot.city || 'Premium Location'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-[#006DB8]" />
                    <span>
                      {plot.dimensions} | {plot.plot_size} sq.ft
                    </span>
                  </div>
                </div>

                <button
                  onClick={onScrollToForm}
                  className="w-full bg-[#112250] hover:bg-[#006DB8] text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  Schedule Visit
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================
// LEAD CAPTURE FORM
// ============================================
function LeadCaptureForm({ formRef }: { formRef: React.RefObject<HTMLDivElement | null> }) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    email: '',
    plotSize: '',
    budget: '',
    message: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;

    if (name === 'phone') {
      setFormData((prev) => ({ ...prev, phone: formatPhoneNumber(value) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  function validateForm(): boolean {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid 10-digit mobile number';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Format message to include additional form fields
      const messageLines = [
        `Site Visit Request from Landing Page`,
        ``,
        formData.plotSize ? `Preferred Plot Size: ${formData.plotSize}` : '',
        formData.budget ? `Budget Range: ${formData.budget}` : '',
        formData.message ? `Additional Notes: ${formData.message}` : '',
      ].filter(Boolean).join('\n');

      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone, // API expects 10-digit number without prefix
          email: formData.email,
          message: messageLines || 'Site Visit Request from Landing Page',
          source: 'landing-page',
        }),
      });

      if (response.ok) {
        setShowSuccess(true);
        setFormData({
          name: '',
          phone: '',
          email: '',
          plotSize: '',
          budget: '',
          message: '',
        });
      } else {
        throw new Error('Failed to submit');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      alert('Failed to submit. Please try again or call us directly.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section ref={formRef} className="py-16 sm:py-20 bg-[#112250]" id="form">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-white mb-4">
            Schedule Your Free Site Visit
          </h2>
          <p className="text-white/70 max-w-xl mx-auto">
            Fill in your details and our team will contact you within 24 hours to arrange your
            visit
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name & Phone Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  } focus:ring-2 focus:ring-[#006DB8] focus:border-transparent outline-none transition-all`}
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                    +91
                  </span>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter 10-digit mobile"
                    className={`w-full pl-12 pr-4 py-3 rounded-lg border ${
                      errors.phone ? 'border-red-500' : 'border-gray-300'
                    } focus:ring-2 focus:ring-[#006DB8] focus:border-transparent outline-none transition-all`}
                  />
                </div>
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email address"
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                } focus:ring-2 focus:ring-[#006DB8] focus:border-transparent outline-none transition-all`}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            {/* Plot Size & Budget Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Preferred Plot Size
                </label>
                <select
                  name="plotSize"
                  value={formData.plotSize}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#006DB8] focus:border-transparent outline-none transition-all bg-white"
                >
                  {PLOT_SIZES.map((size) => (
                    <option key={size.value} value={size.value}>
                      {size.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Budget Range
                </label>
                <select
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#006DB8] focus:border-transparent outline-none transition-all bg-white"
                >
                  {BUDGET_RANGES.map((range) => (
                    <option key={range.value} value={range.value}>
                      {range.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Message (Optional)
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us about your requirements..."
                rows={3}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#006DB8] focus:border-transparent outline-none transition-all resize-none"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#D8B893] hover:bg-[#c9a77e] disabled:bg-gray-400 text-[#112250] font-bold text-lg py-4 rounded-lg transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  Get Free Site Visit
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

            {/* Privacy Note */}
            <p className="text-center text-gray-500 text-sm">
              By submitting, you agree to our privacy policy. We&apos;ll never share your data.
            </p>
          </form>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center relative animate-fade-in">
            <button
              onClick={() => setShowSuccess(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>

            <h3 className="text-2xl font-bold text-[#112250] mb-2">Thank You!</h3>
            <p className="text-gray-600 mb-6">
              Your request has been submitted successfully. Our team will contact you within 24
              hours to schedule your site visit.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={`tel:${PHONE_NUMBER}`}
                className="flex-1 bg-[#112250] text-white py-3 rounded-lg font-medium hover:bg-[#006DB8] transition-colors flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4" />
                Call Now
              </a>
              <button
                onClick={() => setShowSuccess(false)}
                className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

// ============================================
// WHY CHOOSE US SECTION
// ============================================
function WhyChooseUsSection() {
  const reasons = [
    {
      icon: TrendingUp,
      title: 'High Investment Potential',
      description: 'Our locations show 15-20% annual appreciation. Invest today for tomorrow.',
    },
    {
      icon: Zap,
      title: 'Complete Infrastructure',
      description: '60ft roads, underground drainage, electricity, water supply ready.',
    },
    {
      icon: Trees,
      title: 'Green & Peaceful',
      description: 'Surrounded by nature with parks, open spaces, and tree-lined avenues.',
    },
    {
      icon: Car,
      title: 'Excellent Connectivity',
      description: 'Close to highways, IT hubs, schools, hospitals, and shopping centers.',
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-[#112250] mb-4">
            Why Choose Plotzed?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We&apos;re not just selling plots - we&apos;re helping you build your future
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {reasons.map((reason, index) => (
            <div
              key={index}
              className="flex gap-5 p-6 rounded-xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 hover:border-[#D8B893] transition-colors"
            >
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-[#006DB8]/10 rounded-lg flex items-center justify-center">
                  <reason.icon className="w-6 h-6 text-[#006DB8]" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-lg text-[#112250] mb-2">{reason.title}</h3>
                <p className="text-gray-600">{reason.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================
// TESTIMONIALS SECTION
// ============================================
function TestimonialsSection() {
  const testimonials = [
    {
      name: 'Rajesh Kumar',
      role: 'IT Professional',
      quote:
        'Excellent experience! The team was transparent about everything. Bought a 40x60 plot and the documentation was hassle-free. Highly recommended!',
      rating: 5,
    },
    {
      name: 'Priya Sharma',
      role: 'Business Owner',
      quote:
        'Found my dream plot through Plotzed. Zero brokerage saved me a lot of money. The site visit was well-organized and informative.',
      rating: 5,
    },
    {
      name: 'Anil Mehta',
      role: 'Doctor',
      quote:
        'As a first-time property buyer, I was nervous. But the team guided me through every step. Now I own a beautiful plot in a prime location.',
      rating: 5,
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-[#112250] mb-4">
            What Our Customers Say
          </h2>
          <p className="text-gray-600">Join 100+ happy families who trusted us</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-gray-600 mb-6 leading-relaxed">&quot;{testimonial.quote}&quot;</p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#112250] rounded-full flex items-center justify-center text-white font-bold">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-[#112250]">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================
// CONTACT SECTION
// ============================================
function ContactSection() {
  return (
    <section className="py-16 sm:py-20 bg-[#0a1530]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-white mb-4">
            Get In Touch
          </h2>
          <p className="text-white/70">Have questions? We&apos;re here to help</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-12">
          {/* Phone */}
          <a
            href={`tel:${PHONE_NUMBER}`}
            className="flex items-center gap-4 bg-white/10 backdrop-blur-sm p-6 rounded-xl hover:bg-white/20 transition-colors"
          >
            <div className="w-12 h-12 bg-[#D8B893] rounded-full flex items-center justify-center flex-shrink-0">
              <Phone className="w-6 h-6 text-[#112250]" />
            </div>
            <div>
              <p className="text-white/60 text-sm">Call Us</p>
              <p className="text-white font-semibold">{PHONE_NUMBER}</p>
            </div>
          </a>

          {/* Email */}
          <a
            href={`mailto:${EMAIL}`}
            className="flex items-center gap-4 bg-white/10 backdrop-blur-sm p-6 rounded-xl hover:bg-white/20 transition-colors"
          >
            <div className="w-12 h-12 bg-[#D8B893] rounded-full flex items-center justify-center flex-shrink-0">
              <Mail className="w-6 h-6 text-[#112250]" />
            </div>
            <div>
              <p className="text-white/60 text-sm">Email Us</p>
              <p className="text-white font-semibold text-sm">{EMAIL}</p>
            </div>
          </a>

          {/* Address */}
          <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm p-6 rounded-xl">
            <div className="w-12 h-12 bg-[#D8B893] rounded-full flex items-center justify-center flex-shrink-0">
              <MapPin className="w-6 h-6 text-[#112250]" />
            </div>
            <div>
              <p className="text-white/60 text-sm">Visit Us</p>
              <p className="text-white font-semibold text-sm">{ADDRESS}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center pt-8 border-t border-white/10">
          <Link href="/" className="inline-block mb-4">
            <Image
              src="/images/hero-logo.svg"
              alt="Plotzed Real Estate"
              width={150}
              height={40}
              className="h-10 w-auto brightness-0 invert"
            />
          </Link>
          <p className="text-white/50 text-sm">
            © {new Date().getFullYear()} Plotzed Real Estate. All rights reserved.
          </p>
        </div>
      </div>
    </section>
  );
}

// ============================================
// FLOATING WHATSAPP BUTTON
// ============================================
function FloatingWhatsApp() {
  return (
    <a
      href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi, I'm interested in booking a site visit for premium plots.`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all hover:scale-110"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="w-7 h-7 text-white" />
    </a>
  );
}

// ============================================
// STICKY CTA BAR (Mobile Only)
// ============================================
function StickyCTA({ onScrollToForm }: { onScrollToForm: () => void }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setIsVisible(window.scrollY > 500);
    }

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 p-4 sm:hidden shadow-lg">
      <button
        onClick={onScrollToForm}
        className="w-full bg-[#D8B893] hover:bg-[#c9a77e] text-[#112250] font-bold py-3 rounded-lg flex items-center justify-center gap-2"
      >
        Schedule Free Site Visit
        <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  );
}

// ============================================
// MAIN PAGE COMPONENT
// ============================================
export default function LandingPage() {
  const formRef = useRef<HTMLDivElement>(null);

  function scrollToForm() {
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <main className="min-h-screen">
      <HeroSection onScrollToForm={scrollToForm} />
      <BenefitsSection />
      <FeaturedPlotsSection onScrollToForm={scrollToForm} />
      <LeadCaptureForm formRef={formRef} />
      <WhyChooseUsSection />
      <TestimonialsSection />
      <ContactSection />
      <FloatingWhatsApp />
      <StickyCTA onScrollToForm={scrollToForm} />
    </main>
  );
}
