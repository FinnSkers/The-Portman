import React, { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { Shield, Lock } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'

interface ProtectedRouteProps {
  children: ReactNode
  requireAdmin?: boolean
  fallback?: ReactNode
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAdmin = false,
  fallback
}) => {
  const { user, loading, isAuthenticated } = useAuth()

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center space-y-4"
        >
          <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
          <p className="text-gray-400">Loading...</p>
        </motion.div>
      </div>
    )
  }

  // Not authenticated
  if (!isAuthenticated || !user) {
    return fallback || (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="min-h-screen flex items-center justify-center p-4"
      >
        <Card className="w-full max-w-md backdrop-blur-xl bg-white/10 border-white/20">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mb-4">
              <Lock className="h-6 w-6 text-blue-400" />
            </div>
            <CardTitle className="text-xl text-white">Authentication Required</CardTitle>
            <CardDescription className="text-gray-300">
              You need to be signed in to access this page
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={() => window.location.href = '/'}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              Go to Homepage
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  // Check admin requirement
  if (requireAdmin && !user.is_admin) {
    return fallback || (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="min-h-screen flex items-center justify-center p-4"
      >
        <Card className="w-full max-w-md backdrop-blur-xl bg-white/10 border-white/20">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-amber-500/20 rounded-full flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-amber-400" />
            </div>
            <CardTitle className="text-xl text-white">Admin Access Required</CardTitle>            <CardDescription className="text-gray-300">
              You don&apos;t have permission to access this page
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={() => window.location.href = '/dashboard'}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  // User is authenticated and has required permissions
  return <>{children}</>
}

// Hook for easier use in components
export const useRequireAuth = (requireAdmin = false) => {
  const { user, isAuthenticated } = useAuth()
  
  const canAccess = isAuthenticated && user && (!requireAdmin || user.is_admin)
  
  return {
    canAccess,
    user,
    isAuthenticated,
    isAdmin: user?.is_admin || false,
  }
}
