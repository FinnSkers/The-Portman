"use client"

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { validateEmail } from '@/lib/validation'
import { forgotPassword } from '@/lib/api'

interface ForgotPasswordFormProps {
  onBack: () => void
}

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ onBack }) => {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validate email
    const emailError = validateEmail(email)
    if (emailError) {
      setError(emailError)
      return
    }

    setIsLoading(true)

    try {
      await forgotPassword(email)
      setIsSubmitted(true)
    } catch (err) {
      setError('Failed to send reset email. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="w-full max-w-md backdrop-blur-xl bg-white/10 border-white/20">
          <CardContent className="p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="mx-auto w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-6"
            >
              <CheckCircle className="h-8 w-8 text-green-400" />
            </motion.div>
            
            <h2 className="text-2xl font-bold text-white mb-2">Check Your Email</h2>
            <p className="text-gray-300 mb-6">
              We've sent a password reset link to <span className="text-blue-400">{email}</span>
            </p>
            
            <Button
              onClick={onBack}
              variant="outline"
              className="w-full border-white/20 text-white hover:bg-white/10"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Login
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="w-full max-w-md backdrop-blur-xl bg-white/10 border-white/20">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mb-4">
            <Mail className="h-6 w-6 text-blue-400" />
          </div>
          <CardTitle className="text-2xl text-white">Reset Password</CardTitle>
          <CardDescription className="text-gray-300">
            Enter your email address and we'll send you a link to reset your password
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={error && error.includes('email') ? error : ''}
                disabled={isLoading}
                className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                required
              />
            </div>

            {error && !error.includes('email') && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-400 text-sm text-center"
              >
                {error}
              </motion.div>
            )}

            <Button
              type="submit"
              disabled={isLoading || !email}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Sending Reset Link...
                </div>
              ) : (
                'Send Reset Link'
              )}
            </Button>
          </form>

          <div className="text-center">
            <Button
              variant="ghost"
              onClick={onBack}
              className="text-gray-400 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Login
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
