"use client"

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Lock, ArrowRight, Github, Chrome } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { useAuth } from '@/contexts/AuthContext'
import { validateLoginForm } from '@/lib/validation'
import { ValidationErrors } from '@/types/auth'

interface LoginFormProps {
  onSwitchToSignup: () => void
  onForgotPassword?: () => void
  onClose?: () => void
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToSignup, onForgotPassword, onClose }) => {
  const { login } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear error when user starts typing
    if (errors[name as keyof ValidationErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate form
    const validationErrors = validateLoginForm(formData.email, formData.password)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setIsLoading(true)
    setErrors({})

    try {
      await login(formData)
      onClose?.()
    } catch (error) {
      setErrors({ general: error instanceof Error ? error.message : 'Login failed. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full max-w-md mx-auto"
    >
      <Card className="backdrop-blur-xl bg-white/10 border-white/20 shadow-2xl">
        <CardHeader className="text-center">
          <motion.div variants={itemVariants}>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-gray-300 mt-2">
              Sign in to your PORTMAN account
            </CardDescription>
          </motion.div>
        </CardHeader>

        <CardContent className="space-y-6">
          {errors.general && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-400 text-sm text-center"
            >
              {errors.general}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <motion.div variants={itemVariants}>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleInputChange}
                  error={errors.email}
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                  disabled={isLoading}
                />
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange}
                  error={errors.password}
                  showPasswordToggle
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                  disabled={isLoading}
                />
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="flex items-center justify-between">
              <label className="flex items-center space-x-2 text-sm text-gray-300">
                <input type="checkbox" className="rounded border-white/20 bg-white/5" />
                <span>Remember me</span>
              </label>
              <button
                type="button"
                className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
              >
                Forgot password?
              </button>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Signing in...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <span>Sign In</span>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                )}
              </Button>            </motion.div>

            {onForgotPassword && (
              <motion.div variants={itemVariants} className="text-center">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={onForgotPassword}
                  className="text-gray-400 hover:text-white text-sm"
                >
                  Forgot your password?
                </Button>
              </motion.div>
            )}
          </form>

          <motion.div variants={itemVariants} className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-background text-gray-400">Or continue with</span>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              className="bg-white/5 border-white/10 text-white hover:bg-white/10"
              disabled={isLoading}
            >
              <Github className="h-4 w-4 mr-2" />
              GitHub
            </Button>
            <Button
              variant="outline"
              className="bg-white/5 border-white/10 text-white hover:bg-white/10"
              disabled={isLoading}
            >
              <Chrome className="h-4 w-4 mr-2" />
              Google
            </Button>
          </motion.div>

          <motion.div variants={itemVariants} className="text-center">
            <p className="text-gray-400">
              Don&apos;t have an account?{' '}
              <button
                type="button"
                onClick={onSwitchToSignup}
                className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                disabled={isLoading}
              >
                Sign up
              </button>
            </p>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
