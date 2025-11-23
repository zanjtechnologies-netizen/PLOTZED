'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Search,
  MapPin,
  SlidersHorizontal,
  X,
  ChevronDown,
  Grid3X3,
  List,
  ArrowUpDown,
  Loader2,
  Home,
  ChevronRight
} from 'lucide-react';
import PlotCard, { type PlotData } from '@/components/plots/PlotCard';

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
}

interface Filters {
  search: string;
  city: string;
  minPrice: string;
  maxPrice: string;
  minSize: string;
  maxSize: string;
  status: string;
  sortBy: string;
  sortOrder: string;
}

const CITIES = ['Chennai', 'Coimbatore', 'Bangalore', 'Hyderabad', 'Mumbai', 'Delhi'];
const PRICE_RANGES = [
  { label: 'Any Price', min: '', max: '' },
  { label: 'Under ₹25 Lakhs', min: '', max: '2500000' },
  { label: '₹25 - 50 Lakhs', min: '2500000', max: '5000000' },
  { label: '₹50 - 75 Lakhs', min: '5000000', max: '7500000' },
  { label: '₹75 Lakhs - 1 Cr', min: '7500000', max: '10000000' },
  { label: 'Above ₹1 Cr', min: '10000000', max: '' },
];
const SIZE_RANGES = [
  { label: 'Any Size', min: '', max: '' },
  { label: 'Under 1200 sq.ft', min: '', max: '1200' },
  { label: '1200 - 1500 sq.ft', min: '1200', max: '1500' },
  { label: '1500 - 2000 sq.ft', min: '1500', max: '2000' },
  { label: '2000 - 3000 sq.ft', min: '2000', max: '3000' },
  { label: 'Above 3000 sq.ft', min: '3000', max: '' },
];

export default function PropertiesPage() {
  const [plots, setPlots] = useState<PlotData[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const [filters, setFilters] = useState<Filters>({
    search: '',
    city: '',
    minPrice: '',
    maxPrice: '',
    minSize: '',
    maxSize: '',
    status: 'AVAILABLE',
    sortBy: 'created_at',
    sortOrder: 'desc',
  });

  const [currentPage, setCurrentPage] = useState(1);

  // Fetch plots from API
  const fetchPlots = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('page', currentPage.toString());
      params.set('limit', '12');

      if (filters.search) params.set('search', filters.search);
      if (filters.city) params.set('city', filters.city);
      if (filters.minPrice) params.set('minPrice', filters.minPrice);
      if (filters.maxPrice) params.set('maxPrice', filters.maxPrice);
      if (filters.minSize) params.set('minSize', filters.minSize);
      if (filters.maxSize) params.set('maxSize', filters.maxSize);
      if (filters.status) params.set('status', filters.status);
      params.set('sortBy', filters.sortBy);
      params.set('sortOrder', filters.sortOrder);

      const response = await fetch(`/api/plots?${params.toString()}`);
      const result = await response.json();

      if (result.success) {
        setPlots(result.data?.plots || []);
        setPagination(result.data?.pagination || null);
      }
    } catch (error) {
      console.error('Failed to fetch plots:', error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, filters]);

  useEffect(() => {
    fetchPlots();
  }, [fetchPlots]);

  // Handle favorite toggle from PlotCard
  const handleFavoriteToggle = (id: string, isFavorite: boolean) => {
    setFavorites(prev => {
      const newSet = new Set(prev);
      if (isFavorite) {
        newSet.add(id);
      } else {
        newSet.delete(id);
      }
      return newSet;
    });
  };

  // Handle filter change
  const handleFilterChange = (key: keyof Filters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  // Handle price range selection
  const handlePriceRangeChange = (min: string, max: string) => {
    setFilters(prev => ({ ...prev, minPrice: min, maxPrice: max }));
    setCurrentPage(1);
  };

  // Handle size range selection
  const handleSizeRangeChange = (min: string, max: string) => {
    setFilters(prev => ({ ...prev, minSize: min, maxSize: max }));
    setCurrentPage(1);
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      search: '',
      city: '',
      minPrice: '',
      maxPrice: '',
      minSize: '',
      maxSize: '',
      status: 'AVAILABLE',
      sortBy: 'created_at',
      sortOrder: 'desc',
    });
    setCurrentPage(1);
  };

  // Check if any filters are active
  const hasActiveFilters = filters.search || filters.city || filters.minPrice || filters.maxPrice || filters.minSize || filters.maxSize;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-[#112250] py-16 md:py-24">
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src="/images/hero-bg-fallback-2.png"
            alt="Properties background"
            fill
            className="object-cover opacity-20"
          />
        </div>
        <div className="container-custom relative z-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-white/70 text-sm mb-6">
            <Link href="/" className="hover:text-white transition-colors flex items-center gap-1">
              <Home className="w-4 h-4" />
              Home
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white">Properties</span>
          </nav>

          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            Explore Premium Plots
          </h1>
          <p className="text-xl text-white/80 mb-8 max-w-2xl">
            Discover RERA-approved plots in prime locations across India.
            Your dream property is just a click away.
          </p>

          {/* Search Bar */}
          <div className="bg-white rounded-2xl p-4 shadow-xl max-w-4xl">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by location, title, or address..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#006DB8]/20 focus:border-[#006DB8] text-gray-800"
                />
              </div>
              <div className="relative min-w-[180px]">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={filters.city}
                  onChange={(e) => handleFilterChange('city', e.target.value)}
                  className="w-full pl-12 pr-10 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#006DB8]/20 focus:border-[#006DB8] text-gray-800 appearance-none cursor-pointer"
                >
                  <option value="">All Cities</option>
                  {CITIES.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors text-gray-700 font-medium"
              >
                <SlidersHorizontal className="w-5 h-5" />
                Filters
                {hasActiveFilters && (
                  <span className="w-2 h-2 bg-[#006DB8] rounded-full" />
                )}
              </button>
              <button
                onClick={fetchPlots}
                className="px-8 py-3 bg-[#D8B893] hover:bg-[#c4a57f] text-[#112250] rounded-xl font-semibold transition-colors"
              >
                Search
              </button>
            </div>

            {/* Expanded Filters */}
            {showFilters && (
              <div className="mt-4 pt-4 border-t border-gray-200 animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Price Range */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                    <select
                      onChange={(e) => {
                        const range = PRICE_RANGES[parseInt(e.target.value)];
                        handlePriceRangeChange(range.min, range.max);
                      }}
                      className="w-full px-4 py-2.5 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#006DB8]/20 text-gray-800"
                    >
                      {PRICE_RANGES.map((range, idx) => (
                        <option key={idx} value={idx}>{range.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Plot Size */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Plot Size</label>
                    <select
                      onChange={(e) => {
                        const range = SIZE_RANGES[parseInt(e.target.value)];
                        handleSizeRangeChange(range.min, range.max);
                      }}
                      className="w-full px-4 py-2.5 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#006DB8]/20 text-gray-800"
                    >
                      {SIZE_RANGES.map((range, idx) => (
                        <option key={idx} value={idx}>{range.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Sort By */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                    <select
                      value={`${filters.sortBy}-${filters.sortOrder}`}
                      onChange={(e) => {
                        const [sortBy, sortOrder] = e.target.value.split('-');
                        setFilters(prev => ({ ...prev, sortBy, sortOrder }));
                      }}
                      className="w-full px-4 py-2.5 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#006DB8]/20 text-gray-800"
                    >
                      <option value="created_at-desc">Newest First</option>
                      <option value="created_at-asc">Oldest First</option>
                      <option value="price-asc">Price: Low to High</option>
                      <option value="price-desc">Price: High to Low</option>
                      <option value="plot_size-asc">Size: Small to Large</option>
                      <option value="plot_size-desc">Size: Large to Small</option>
                    </select>
                  </div>
                </div>

                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="mt-4 text-sm text-[#006DB8] hover:underline flex items-center gap-1"
                  >
                    <X className="w-4 h-4" />
                    Clear all filters
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-12 md:py-16">
        <div className="container-custom">
          {/* Results Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-bold text-[#112250]">
                {loading ? 'Loading...' : `${pagination?.total || 0} Properties Found`}
              </h2>
              {hasActiveFilters && (
                <p className="text-gray-600 text-sm mt-1">
                  Showing filtered results
                </p>
              )}
            </div>

            <div className="flex items-center gap-4">
              {/* View Toggle */}
              <div className="flex items-center bg-white rounded-lg border border-gray-200 p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'grid' ? 'bg-[#112250] text-white' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Grid3X3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'list' ? 'bg-[#112250] text-white' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>

              {/* Sort Dropdown (Mobile) */}
              <div className="md:hidden relative">
                <button className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gray-200 text-gray-700">
                  <ArrowUpDown className="w-4 h-4" />
                  Sort
                </button>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-[#006DB8]" />
            </div>
          )}

          {/* Empty State */}
          {!loading && plots.length === 0 && (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No properties found</h3>
              <p className="text-gray-600 mb-6">Try adjusting your filters or search criteria</p>
              <button
                onClick={clearFilters}
                className="px-6 py-3 bg-[#112250] text-white rounded-xl font-medium hover:bg-[#1a3470] transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}

          {/* Properties Grid */}
          {!loading && plots.length > 0 && (
            <div className={viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'
              : 'space-y-6'
            }>
              {plots.map((plot) => (
                <PlotCard
                  key={plot.id}
                  plot={plot}
                  variant={viewMode}
                  isFavorite={favorites.has(plot.id)}
                  onFavoriteToggle={handleFavoriteToggle}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-12">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                .filter(page => {
                  // Show first, last, current, and adjacent pages
                  return page === 1 ||
                         page === pagination.totalPages ||
                         Math.abs(page - currentPage) <= 1;
                })
                .map((page, idx, arr) => {
                  // Add ellipsis
                  const showEllipsisBefore = idx > 0 && page - arr[idx - 1] > 1;
                  return (
                    <span key={page} className="flex items-center">
                      {showEllipsisBefore && <span className="px-2 text-gray-400">...</span>}
                      <button
                        onClick={() => setCurrentPage(page)}
                        className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                          currentPage === page
                            ? 'bg-[#112250] text-white'
                            : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    </span>
                  );
                })}

              <button
                onClick={() => setCurrentPage(p => Math.min(pagination.totalPages, p + 1))}
                disabled={currentPage === pagination.totalPages}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[#112250]">
        <div className="container-custom text-center">
          <h2
            className="text-3xl md:text-4xl font-bold text-white mb-4"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            Can&apos;t find what you&apos;re looking for?
          </h2>
          <p className="text-white/80 mb-8 max-w-2xl mx-auto">
            Let our property experts help you find the perfect plot that matches your requirements.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="px-8 py-4 bg-[#D8B893] text-[#112250] rounded-full font-semibold hover:bg-[#c4a57f] transition-colors"
            >
              Talk to an Expert
            </Link>
            <Link
              href="/#journeytoownership"
              className="px-8 py-4 bg-white/10 text-white rounded-full font-semibold hover:bg-white/20 transition-colors border border-white/30"
            >
              Schedule Site Visit
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
