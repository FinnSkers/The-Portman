"use client"

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Lock, User, ArrowRight, Github, Chrome } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { useAuth } from '@/contexts/AuthContext'
import { validateRegisterForm } from '@/lib/validation'
import { ValidationErrors } from '@/types/auth'

interface SignupFormProps {
  onSwitchToLogin: () => void
  onClose?: () => void
}

export const SignupForm: React.FC<SignupFormProps> = ({ onSwitchToLogin, onClose }) => {
  const { register } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
  })
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)

  const calculatePasswordStrength = (password: string): number => {
    let strength = 0
    if (password.length >= 8) strength += 25
    if (/[a-z]/.test(password)) strength += 25
    if (/[A-Z]/.test(password)) strength += 25
    if (/\d/.test(password)) strength += 25
    return strength
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Calculate password strength
    if (name === 'password') {
      setPasswordStrength(calculatePasswordStrength(value))
    }
    
    // Clear error when user starts typing
    if (errors[name as keyof ValidationErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate form
    const validationErrors = validateRegisterForm(formData.email, formData.password, formData.username)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setIsLoading(true)
    setErrors({})

    try {
      await register({
        email: formData.email,
        password: formData.password,
        username: formData.username || undefined,
      })
      onClose?.()
    } catch (error) {
      setErrors({ general: error instanceof Error ? error.message : 'Registration failed. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  const getPasswordStrengthColor = (strength: number): string => {
    if (strength < 25) return 'bg-red-500'
    if (strength < 50) return 'bg-orange-500'
    if (strength < 75) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  const getPasswordStrengthText = (strength: number): string => {
    if (strength < 25) return 'Weak'
    if (strength < 50) return 'Fair'
    if (strength < 75) return 'Good'
    return 'Strong'
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
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
              Join PORTMAN
            </CardTitle>
            <CardDescription className="text-gray-300 mt-2">
              Create your account and start building amazing portfolios
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
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  name="username"
                  placeholder="Username (optional)"
                  value={formData.username}
                  onChange={handleInputChange}
                  error={errors.username}
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
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleInputChange}
                  error={errors.password}
                  showPasswordToggle
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                  disabled={isLoading}
                />
              </div>
              
              {formData.password && (
                <div className="mt-2 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-400">Password strength:</span>
                    <span className={`font-medium ${
                      passwordStrength >= 75 ? 'text-green-400' : 
                      passwordStrength >= 50 ? 'text-yellow-400' : 
                      passwordStrength >= 25 ? 'text-orange-400' : 'text-red-400'
                    }`}>
                      {getPasswordStrengthText(passwordStrength)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-1.5">
                    <motion.div
                      className={`h-1.5 rounded-full transition-all duration-300 ${getPasswordStrengthColor(passwordStrength)}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${passwordStrength}%` }}
                    />
                  </div>
                </div>
              )}
            </motion.div>

            <motion.div variants={itemVariants}>
              <label className="flex items-start space-x-3 text-sm text-gray-300">
                <input type="checkbox" className="mt-0.5 rounded border-white/20 bg-white/5" required />
                <span>
                  I agree to the{' '}
                  <button type="button" className="text-blue-400 hover:text-blue-300 underline">
                    Terms of Service
                  </button>{' '}
                  and{' '}
                  <button type="button" className="text-blue-400 hover:text-blue-300 underline">
                    Privacy Policy
                  </button>
                </span>
              </label>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-medium"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Creating account...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <span>Create Account</span>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                )}
              </Button>
            </motion.div>
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
              Already have an account?{' '}
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                disabled={isLoading}
              >
                Sign in
              </button>
            </p>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
