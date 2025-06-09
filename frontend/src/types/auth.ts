export interface User {
  id: string
  username: string
  email: string
  is_active: boolean
  is_admin: boolean
  created_at: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  email: string
  password: string
  username?: string
}

export interface AuthResponse {
  access_token: string
  token_type: string
  user?: {
    email: string
    name: string
  }
}

export interface AuthContextType {
  user: User | null
  loading: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  register: (credentials: RegisterCredentials) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

export interface ValidationErrors {
  email?: string
  password?: string
  username?: string
  general?: string
}
