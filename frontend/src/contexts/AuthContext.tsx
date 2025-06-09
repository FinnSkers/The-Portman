"use client"

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User, AuthContextType, LoginCredentials, RegisterCredentials } from '@/types/auth'
import { login as apiLogin, register as apiRegister, getCurrentUser, setToken, removeToken, getToken } from '@/lib/api'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const token = getToken()
      if (token) {
        try {
          const userData = await getCurrentUser()
          setUser(userData)
        } catch (error) {
          console.error('Failed to get user data:', error)
          removeToken()
        }
      }
      setLoading(false)
    }

    initializeAuth()
  }, [])

  const login = async (credentials: LoginCredentials): Promise<void> => {
    try {
      const response = await apiLogin(credentials)
      setToken(response.access_token)
      
      // Get user data after successful login
      const userData = await getCurrentUser()
      setUser(userData)
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    }
  }

  const register = async (credentials: RegisterCredentials): Promise<void> => {
    try {
      await apiRegister(credentials)
      // After successful registration, automatically log in
      await login({ email: credentials.email, password: credentials.password })
    } catch (error) {
      console.error('Registration failed:', error)
      throw error
    }
  }

  const logout = (): void => {
    removeToken()
    setUser(null)
  }

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
