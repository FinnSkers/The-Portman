"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { LoginForm } from './LoginForm'
import { SignupForm } from './SignupForm'
import { ForgotPasswordForm } from './ForgotPasswordForm'
import { Button } from '@/components/ui/Button'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  defaultMode?: 'login' | 'signup' | 'forgot-password'
}

export const AuthModal: React.FC<AuthModalProps> = ({ 
  isOpen, 
  onClose, 
  defaultMode = 'login' 
}) => {
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot-password'>(defaultMode)

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  }

  const modalVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.8,
      y: 50
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        duration: 0.5,
        bounce: 0.3
      }
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: 50,
      transition: {
        duration: 0.2
      }
    }
  }

  const contentVariants = {
    hidden: { 
      opacity: 0, 
      x: mode === 'login' ? -20 : 20 
    },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    },
    exit: { 
      opacity: 0, 
      x: mode === 'login' ? 20 : -20,
      transition: {
        duration: 0.2
      }
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{
          background: 'linear-gradient(135deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.9) 100%)',
          backdropFilter: 'blur(8px)'
        }}
        onClick={onClose}
      >
        <motion.div
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="relative w-full max-w-md"
          onClick={(e) => e.stopPropagation()}
        >
          <Button
            variant="ghost"
            size="icon"
            className="absolute -top-12 right-0 text-white hover:bg-white/10 z-10"
            onClick={onClose}
          >
            <X className="h-6 w-6" />
          </Button>

          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >              {mode === 'login' ? (
                <LoginForm
                  onSwitchToSignup={() => setMode('signup')}
                  onForgotPassword={() => setMode('forgot-password')}
                  onClose={onClose}
                />
              ) : mode === 'signup' ? (
                <SignupForm
                  onSwitchToLogin={() => setMode('login')}
                  onClose={onClose}
                />
              ) : (
                <ForgotPasswordForm
                  onBack={() => setMode('login')}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
