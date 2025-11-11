// types/index.ts

// Property Types
export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  propertyType: PropertyType;
  status: PropertyStatus;
  bedrooms?: number;
  bathrooms?: number;
  squareFeet?: number;
  lotSize?: number;
  yearBuilt?: number;
  images: PropertyImage[];
  features?: string[];
  amenities?: string[];
  virtualTourUrl?: string;
  videoUrl?: string;
  featured?: boolean;
  createdAt: string;
  updatedAt: string;
  userId?: string;
  user?: User;
}

export enum PropertyType {
  HOUSE = 'HOUSE',
  APARTMENT = 'APARTMENT',
  CONDO = 'CONDO',
  TOWNHOUSE = 'TOWNHOUSE',
  LAND = 'LAND',
  COMMERCIAL = 'COMMERCIAL',
  LUXURY_ESTATE = 'LUXURY_ESTATE',
}

export enum PropertyStatus {
  AVAILABLE = 'AVAILABLE',
  PENDING = 'PENDING',
  SOLD = 'SOLD',
  OFF_MARKET = 'OFF_MARKET',
}

export interface PropertyImage {
  id: string;
  url: string;
  alt?: string;
  order: number;
  propertyId: string;
}

// User Types
export interface User {
  id: string;
  email: string;
  name?: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export enum UserRole {
  USER = 'USER',
  AGENT = 'AGENT',
  ADMIN = 'ADMIN',
}

// Authentication Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name?: string;
  phone?: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  user?: User;
  token?: string;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Filter Types
export interface PropertyFilters {
  propertyType?: PropertyType;
  status?: PropertyStatus;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  location?: string;
  featured?: boolean;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: 'price' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
}

// Booking/Inquiry Types
export interface PropertyInquiry {
  id?: string;
  propertyId: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  preferredContactMethod?: 'email' | 'phone';
  preferredTime?: string;
  createdAt?: string;
}

export interface BookingRequest {
  propertyId: string;
  date: string;
  time: string;
  visitorName: string;
  visitorEmail: string;
  visitorPhone: string;
  notes?: string;
}

// Blog/Insights Types
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: {
    name: string;
    avatar?: string;
  };
  category: string;
  tags: string[];
  publishedAt: string;
  readTime?: number;
}

// Testimonial Types
export interface Testimonial {
  id: string;
  name: string;
  role?: string;
  avatar?: string;
  rating: number;
  comment: string;
  propertyId?: string;
  createdAt: string;
}

// Newsletter Types
export interface NewsletterSubscription {
  email: string;
  name?: string;
}

// Statistics Types
export interface SiteStatistics {
  totalProperties: number;
  propertiesSold: number;
  happyClients: number;
  yearsExperience: number;
}

// Form Types
export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

// Component Props Types
export interface PropertyCardProps {
  property: Property;
  featured?: boolean;
  onBooking?: (propertyId: string) => void;
  onInquiry?: (propertyId: string) => void;
}

export interface TestimonialCardProps {
  testimonial: Testimonial;
}

export interface StatsCounterProps {
  value: number;
  label: string;
  prefix?: string;
  suffix?: string;
}
