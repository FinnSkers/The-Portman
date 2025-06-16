// API Configuration and Base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// API Response Types
export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
  status: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  is_admin: boolean;
  created_at: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface CV {
  id: string;
  filename: string;
  file_type: string;
  uploaded_at: string;
  status: 'processing' | 'completed' | 'error';
  analysis?: {
    ats_score: number;
    keywords: string[];
    suggestions: string[];
  };
}

export interface Portfolio {
  id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
  is_public: boolean;
  template: string;
}

export interface CVAnalysis {
  ats_score: number;
  keywords: string[];
  suggestions: string[];
  improvements: string[];
  industry_match: number;
}

export interface DashboardAnalytics {
  total_cvs: number;
  total_applications: number;
  interview_rate: number;
  avg_ats_score: number;
  recent_activity: Array<{
    type: string;
    description: string;
    timestamp: string;
  }>;
}

export interface HealthStatus {
  message: string;
  version: string;
  status: string;
  features: string[];
}

// Base API Class
class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    // Get token from localStorage if available
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token');
    }
  }

  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  }

  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Add any additional headers from options
    if (options.headers) {
      Object.assign(headers, options.headers);
    }

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      return {
        data: response.ok ? data : undefined,
        error: !response.ok ? data.detail || 'An error occurred' : undefined,
        message: data.message,
        status: response.status,
      };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Network error',
        status: 0,
      };
    }
  }

  // Authentication Methods
  async login(email: string, password: string): Promise<ApiResponse<AuthResponse>> {
    const formData = new FormData();
    formData.append('username', email);
    formData.append('password', password);

    return this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      headers: {}, // Remove Content-Type to let browser set it for FormData
      body: formData,
    });
  }

  async register(name: string, email: string, password: string): Promise<ApiResponse<User>> {
    return this.request<User>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
  }

  async logout(): Promise<void> {
    this.clearToken();
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    return this.request<User>('/auth/me');
  }

  // CV Methods
  async uploadCV(file: File): Promise<ApiResponse<CV>> {
    const formData = new FormData();
    formData.append('file', file);

    return this.request<CV>('/cv/upload', {
      method: 'POST',
      headers: {}, // Remove Content-Type for FormData
      body: formData,
    });
  }

  async getCVs(): Promise<ApiResponse<CV[]>> {
    return this.request<CV[]>('/cv/list');
  }

  async getCV(id: string): Promise<ApiResponse<CV>> {
    return this.request<CV>(`/cv/${id}`);
  }

  async deleteCV(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/cv/${id}`, {
      method: 'DELETE',
    });
  }
  async analyzeCV(id: string): Promise<ApiResponse<CVAnalysis>> {
    return this.request<CVAnalysis>(`/cv/${id}/analyze`, {
      method: 'POST',
    });
  }

  // Portfolio Methods
  async getPortfolios(): Promise<ApiResponse<Portfolio[]>> {
    return this.request<Portfolio[]>('/portfolio/list');
  }

  async createPortfolio(data: {
    name: string;
    description: string;
    template: string;
  }): Promise<ApiResponse<Portfolio>> {
    return this.request<Portfolio>('/portfolio/create', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getPortfolio(id: string): Promise<ApiResponse<Portfolio>> {
    return this.request<Portfolio>(`/portfolio/${id}`);
  }

  async updatePortfolio(id: string, data: Partial<Portfolio>): Promise<ApiResponse<Portfolio>> {
    return this.request<Portfolio>(`/portfolio/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deletePortfolio(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/portfolio/${id}`, {
      method: 'DELETE',
    });
  }
  // Analytics Methods
  async getAnalytics(): Promise<ApiResponse<DashboardAnalytics>> {
    return this.request<DashboardAnalytics>('/analytics/dashboard');
  }

  async getCVAnalytics(id: string): Promise<ApiResponse<CVAnalysis>> {
    return this.request<CVAnalysis>(`/analytics/cv/${id}`);
  }
  // Health Check
  async healthCheck(): Promise<ApiResponse<HealthStatus>> {
    return this.request<HealthStatus>('/');
  }
}

// Create and export the API client instance
export const apiClient = new ApiClient(API_BASE_URL);

// Export individual API functions for convenience
export const auth = {
  login: (email: string, password: string) => apiClient.login(email, password),
  register: (name: string, email: string, password: string) => apiClient.register(name, email, password),
  logout: () => apiClient.logout(),
  getCurrentUser: () => apiClient.getCurrentUser(),
  setToken: (token: string) => apiClient.setToken(token),
};

export const cv = {
  upload: (file: File) => apiClient.uploadCV(file),
  list: () => apiClient.getCVs(),
  get: (id: string) => apiClient.getCV(id),
  delete: (id: string) => apiClient.deleteCV(id),
  analyze: (id: string) => apiClient.analyzeCV(id),
};

export const portfolio = {
  list: () => apiClient.getPortfolios(),
  create: (data: { name: string; description: string; template: string }) => 
    apiClient.createPortfolio(data),
  get: (id: string) => apiClient.getPortfolio(id),
  update: (id: string, data: Partial<Portfolio>) => apiClient.updatePortfolio(id, data),
  delete: (id: string) => apiClient.deletePortfolio(id),
};

export const analytics = {
  dashboard: () => apiClient.getAnalytics(),
  cv: (id: string) => apiClient.getCVAnalytics(id),
};

export default apiClient;
