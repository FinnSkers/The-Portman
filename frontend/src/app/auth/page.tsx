'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Shield, Users, BarChart3 } from 'lucide-react'
import { AuthModal, useAuth } from '@/components/auth'
import { Button } from '@/components/ui'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui'
import Link from 'next/link'

export default function AuthTestPage() {
  const { user, isAuthenticated, logout } = useAuth()
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'forgot-password'>('login')

  const openAuthModal = (mode: 'login' | 'signup' | 'forgot-password') => {
    setAuthMode(mode)
    setAuthModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-white mb-4">
            PORTMAN Authentication System
          </h1>
          <p className="text-gray-300 text-lg">
            Complete authentication system with login, signup, forgot password, and protected routes
          </p>
        </motion.div>

        {/* Authentication Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card className="backdrop-blur-xl bg-white/10 border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Authentication Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isAuthenticated ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Status:</span>
                    <span className="text-green-400 font-medium">Authenticated ✓</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Username:</span>
                    <span className="text-white font-medium">{user?.username}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Email:</span>
                    <span className="text-white font-medium">{user?.email}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Role:</span>
                    <span className={`font-medium ${user?.is_admin ? 'text-purple-400' : 'text-blue-400'}`}>
                      {user?.is_admin ? 'Admin' : 'User'}
                    </span>
                  </div>
                  <Button
                    onClick={logout}
                    variant="outline"
                    className="w-full border-red-500/50 text-red-400 hover:bg-red-500/10"
                  >
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="text-center space-y-4">
                  <p className="text-gray-300">Not authenticated</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    <Button
                      onClick={() => openAuthModal('login')}
                      className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                    >
                      Login
                    </Button>
                    <Button
                      onClick={() => openAuthModal('signup')}
                      variant="outline"
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      Sign Up
                    </Button>
                    <Button
                      onClick={() => openAuthModal('forgot-password')}
                      variant="ghost"
                      className="text-gray-400 hover:text-white"
                    >
                      Forgot Password
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Protected Routes Demo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
        >
          <Card className="backdrop-blur-xl bg-white/10 border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Dashboard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 mb-4">
                Protected user dashboard with analytics and file management
              </p>
              <Link href="/dashboard">
                <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                  Go to Dashboard
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-xl bg-white/10 border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Admin Panel
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 mb-4">
                Admin-only panel for user management and system configuration
              </p>
              <Link href="/admin">
                <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                  Go to Admin
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-xl bg-white/10 border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Upload
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 mb-4">
                Document upload and processing (requires authentication)
              </p>
              <Link href="/upload">
                <Button className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600">
                  Upload Document
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>

        {/* Features List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="backdrop-blur-xl bg-white/10 border-white/20">
            <CardHeader>
              <CardTitle className="text-white">✨ Authentication Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="text-white font-medium">🔐 Core Features</h4>
                  <ul className="space-y-1 text-gray-300 text-sm">
                    <li>• JWT-based authentication</li>
                    <li>• User registration & login</li>
                    <li>• Password reset functionality</li>
                    <li>• Protected routes</li>
                    <li>• Admin role management</li>
                    <li>• Session persistence</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="text-white font-medium">🎨 UI/UX Features</h4>
                  <ul className="space-y-1 text-gray-300 text-sm">
                    <li>• Smooth animations</li>
                    <li>• Form validation</li>
                    <li>• Password strength indicator</li>
                    <li>• Social login buttons</li>
                    <li>• Responsive design</li>
                    <li>• Error handling</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultMode={authMode}
      />
    </div>
  )
}