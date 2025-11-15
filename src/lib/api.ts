import type {
  Property,
  PropertyFilters,
  User,
  LoginCredentials,
  RegisterData,
  AuthResponse,
  ApiResponse,
  PaginatedResponse,
  PropertyInquiry,
  BookingRequest,
  NewsletterSubscription,
  ContactFormData,
} from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

/**
 * Generic API request handler (final safe version)
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include',
    });

    // ✅ Read body ONCE as text
    const text = await response.text();

    // Try to parse JSON safely
    let data: any;
    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      console.error(`Non-JSON response from ${endpoint}:`, text.slice(0, 200));
      return {
        success: false,
        error: `Invalid response from server at ${endpoint}`,
      };
    }

    // Handle non-200 responses
    if (!response.ok) {
      return {
        success: false,
        error: data?.message || `Request failed with status ${response.status}`,
      };
    }

    // Return consistent success format
    return {
      success: true,
      data: data.data || data,
      message: data.message,
    };
  } catch (error: any) {
    console.error('API Request Error:', error);
    return {
      success: false,
      error: error?.message || 'Network error',
    };
  }
}

/**
 * Authentication API
 */
export const auth = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiRequest<{ user: User; token?: string }>(
      '/api/auth/login',
      {
        method: 'POST',
        body: JSON.stringify(credentials),
      }
    );

    return {
      success: response.success,
      user: response.data?.user,
      token: response.data?.token,
      message: response.message || response.error,
    };
  },

  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await apiRequest<{ user: User; token?: string }>(
      '/api/auth/register',
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );

    return {
      success: response.success,
      user: response.data?.user,
      token: response.data?.token,
      message: response.message || response.error,
    };
  },

  logout: async (): Promise<ApiResponse> => {
    return apiRequest('/api/auth/logout', {
      method: 'POST',
    });
  },

  getCurrentUser: async (): Promise<ApiResponse<User>> => {
    return apiRequest<User>('/api/auth/me');
  },
};

/**
 * Properties API
 */
export const properties = {
  getAll: async (
    filters?: PropertyFilters
  ): Promise<PaginatedResponse<Property>> => {
    const params = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }

    const endpoint = `/api/plots${
      params.toString() ? `?${params.toString()}` : ''
    }`;
    const response = await apiRequest<PaginatedResponse<Property>>(endpoint);

    return (
      response.data || {
        success: false,
        data: [],
        pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
      }
    );
  },

  getFeatured: async (): Promise<ApiResponse<Property[]>> => {
    return apiRequest<Property[]>('/api/plots/featured?limit=6');
  },

  getById: async (id: string): Promise<ApiResponse<Property>> => {
    return apiRequest<Property>(`/api/plots/${id}`);
  },

  create: async (data: Partial<Property>): Promise<ApiResponse<Property>> => {
    return apiRequest<Property>('/api/plots', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (
    id: string,
    data: Partial<Property>
  ): Promise<ApiResponse<Property>> => {
    return apiRequest<Property>(`/api/plots/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string): Promise<ApiResponse> => {
    return apiRequest(`/api/plots/${id}`, {
      method: 'DELETE',
    });
  },
};

/**
 * Inquiries API
 */
export const inquiries = {
  submit: async (
    inquiry: PropertyInquiry
  ): Promise<ApiResponse<PropertyInquiry>> => {
    return apiRequest<PropertyInquiry>('/api/inquiries', {
      method: 'POST',
      body: JSON.stringify(inquiry),
    });
  },

  getMy: async (): Promise<ApiResponse<PropertyInquiry[]>> => {
    return apiRequest<PropertyInquiry[]>('/api/inquiries/my');
  },
};

/**
 * Bookings API
 */
export const bookings = {
  create: async (booking: BookingRequest): Promise<ApiResponse> => {
    return apiRequest('/api/bookings', {
      method: 'POST',
      body: JSON.stringify(booking),
    });
  },

  getMy: async (): Promise<ApiResponse<BookingRequest[]>> => {
    return apiRequest<BookingRequest[]>('/api/bookings/my');
  },
};

/**
 * Newsletter API
 */
export const newsletter = {
  subscribe: async (
    data: NewsletterSubscription
  ): Promise<ApiResponse> => {
    return apiRequest('/api/newsletter/subscribe', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

/**
 * Contact API (mapped to inquiries endpoint)
 */
export const contact = {
  submit: async (data: ContactFormData): Promise<ApiResponse> => {
    return apiRequest('/api/inquiries', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

/**
 * Users API (admin only)
 */
export const users = {
  getAll: async (): Promise<ApiResponse<User[]>> => {
    return apiRequest<User[]>('/api/users');
  },

  getById: async (id: string): Promise<ApiResponse<User>> => {
    return apiRequest<User>(`/api/users/${id}`);
  },

  update: async (
    id: string,
    data: Partial<User>
  ): Promise<ApiResponse<User>> => {
    return apiRequest<User>(`/api/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string): Promise<ApiResponse> => {
    return apiRequest(`/api/users/${id}`, {
      method: 'DELETE',
    });
  },
};

/**
 * Export all API modules
 */
export const api = {
  auth,
  properties,
  inquiries,
  bookings,
  newsletter,
  contact,
  users,
};

export default api;
