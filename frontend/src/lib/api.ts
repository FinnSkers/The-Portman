import { LoginCredentials, RegisterCredentials, AuthResponse, User } from '@/types/auth'

// API client for backend communication
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

// Token management
export const getToken = (): string | null => {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('auth_token')
}

export const setToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('auth_token', token)
  }
}

export const removeToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_token')
  }
}

// API request helper with auth
export async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const token = getToken()
  const url = `${API_BASE_URL}${endpoint}`
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  }

  const response = await fetch(url, config)
  if (!response.ok) {
    let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
    let errorData: any = {};
    try {
      errorData = await response.json();
      if (errorData.detail) errorMessage = errorData.detail;
    } catch {}
    if (response.status === 401) {
      removeToken();
      throw new Error(errorMessage || 'Authentication failed');
    }
    throw new Error(errorMessage);
  }
  return response.json()
}

// Authentication API methods
export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  return apiRequest('/users/login/', {
    method: 'POST',
    body: JSON.stringify(credentials),
  })
}

export async function register(credentials: RegisterCredentials): Promise<{ username: string; email: string; registered: boolean }> {
  return apiRequest('/users/register/', {
    method: 'POST',
    body: JSON.stringify(credentials),
  })
}

export async function getCurrentUser(): Promise<User> {
  return apiRequest('/users/me/')
}

export async function refreshToken(): Promise<AuthResponse> {
  return apiRequest('/users/refresh/', {
    method: 'POST',
  })
}

export async function forgotPassword(email: string): Promise<{ message: string }> {
  return apiRequest('/users/forgot-password/', {
    method: 'POST',
    body: JSON.stringify({ email }),
  })
}

export async function resetPassword(token: string, password: string): Promise<{ message: string }> {
  return apiRequest('/users/reset-password/', {
    method: 'POST',
    body: JSON.stringify({ token, password }),
  })
}

// CV API methods
export async function uploadCV(file: File) {
  const token = getToken()
  const formData = new FormData();
  formData.append('file', file);
  
  const res = await fetch(`${API_BASE_URL}/cv/upload/`, {
    method: 'POST',
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: formData,
  });
  
  if (!res.ok) throw new Error('Upload failed');
  return res.json();
}

export async function parseCV(filename: string) {
  return apiRequest('/cv/parse/', {
    method: 'POST',
    body: JSON.stringify({ filename }),
  });
}

// User Profile API methods
export async function updateProfileFromCV(parsedData: any) {
  return apiRequest('/users/update-profile-from-cv/', {
    method: 'PUT',
    body: JSON.stringify({ parsed_data: parsedData }),
  });
}

export async function getUserProfile() {
  return apiRequest('/users/profile/');
}
