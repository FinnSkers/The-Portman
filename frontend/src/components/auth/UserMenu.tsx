import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  User, 
  Settings, 
  FileText, 
  BarChart3, 
  LogOut, 
  ChevronDown,
  Shield
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/contexts/AuthContext'

export const UserMenu: React.FC = () => {
  const { user, logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  if (!user) return null

  const menuItems = [
    {
      icon: User,
      label: 'Profile',
      href: '/profile',
    },
    {
      icon: FileText,
      label: 'My CVs',
      href: '/dashboard/cvs',
    },
    {
      icon: BarChart3,
      label: 'Analytics',
      href: '/dashboard/analytics',
    },
    {
      icon: Settings,
      label: 'Settings',
      href: '/settings',
    },
  ]

  if (user.is_admin) {
    menuItems.splice(3, 0, {
      icon: Shield,
      label: 'Admin Panel',
      href: '/admin',
    })
  }

  const handleLogout = () => {
    logout()
    setIsOpen(false)
  }

  const menuVariants = {
    hidden: {
      opacity: 0,
      scale: 0.95,
      y: -10,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.2,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: -10,
      transition: {
        duration: 0.15,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 },
  }

  return (
    <div className="relative">
      <Button
        variant="ghost"
        className="flex items-center space-x-2 text-white hover:bg-white/10"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium text-sm">
          {user.username.charAt(0).toUpperCase()}
        </div>
        <span className="hidden md:block">{user.username}</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Menu */}
            <motion.div
              variants={menuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="absolute right-0 top-full mt-2 w-64 z-50"
            >
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl overflow-hidden">
                {/* User Info */}
                <div className="p-4 border-b border-white/10">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium truncate">{user.username}</p>
                      <p className="text-gray-300 text-sm truncate">{user.email}</p>
                    </div>
                  </div>
                  {user.is_admin && (
                    <div className="mt-2 inline-flex items-center px-2 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-medium">
                      <Shield className="w-3 h-3 mr-1" />
                      Admin
                    </div>
                  )}
                </div>

                {/* Menu Items */}
                <motion.div
                  className="p-2"
                  initial="hidden"
                  animate="visible"
                  variants={{
                    visible: {
                      transition: {
                        staggerChildren: 0.05,
                      },
                    },
                  }}
                >
                  {menuItems.map((item, index) => (
                    <motion.a
                      key={item.href}
                      href={item.href}
                      variants={itemVariants}
                      className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </motion.a>
                  ))}
                  
                  <div className="border-t border-white/10 mt-2 pt-2">
                    <motion.button
                      variants={itemVariants}
                      className="flex items-center space-x-3 px-3 py-2 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors w-full"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign Out</span>
                    </motion.button>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
