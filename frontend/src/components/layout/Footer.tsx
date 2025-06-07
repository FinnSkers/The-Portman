'use client'

import { motion } from 'framer-motion'
import { 
  Github, 
  Twitter, 
  Linkedin, 
  Instagram, 
  Mail, 
  MapPin, 
  Phone, 
  ChevronRight,
  Heart,
  Globe,
  Shield,
  Zap
} from 'lucide-react'
import Link from 'next/link'

const Footer = () => {
  const footerLinks = {
    product: [
      { name: 'Features', href: '/features' },
      { name: 'Pricing', href: '/pricing' },
      { name: 'API', href: '/api' },
      { name: 'Integrations', href: '/integrations' },
      { name: 'Changelog', href: '/changelog' }
    ],
    company: [
      { name: 'About Us', href: '/about' },
      { name: 'Careers', href: '/careers' },
      { name: 'Blog', href: '/blog' },
      { name: 'Press Kit', href: '/press' },
      { name: 'Contact', href: '/contact' }
    ],
    resources: [
      { name: 'Documentation', href: '/docs' },
      { name: 'Help Center', href: '/help' },
      { name: 'Community', href: '/community' },
      { name: 'Templates', href: '/templates' },
      { name: 'Webinars', href: '/webinars' }
    ],
    legal: [
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Cookie Policy', href: '/cookies' },
      { name: 'Security', href: '/security' },
      { name: 'GDPR', href: '/gdpr' }
    ]
  }

  const socialLinks = [
    { name: 'Twitter', icon: Twitter, href: 'https://twitter.com/portman', color: 'hover:text-blue-400' },
    { name: 'LinkedIn', icon: Linkedin, href: 'https://linkedin.com/company/portman', color: 'hover:text-blue-600' },
    { name: 'GitHub', icon: Github, href: 'https://github.com/portman', color: 'hover:text-gray-300' },
    { name: 'Instagram', icon: Instagram, href: 'https://instagram.com/portman', color: 'hover:text-pink-400' }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  }

  return (
    <footer className="relative bg-black border-t border-gray-800">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-black" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(59,130,246,0.05),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(139,92,246,0.05),transparent_50%)]" />

      <div className="relative">
        {/* Main Footer Content */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          className="max-w-7xl mx-auto px-6 pt-20 pb-12"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12">
            {/* Brand Section */}
            <motion.div variants={itemVariants} className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-white">PORTMAN</span>
              </div>
              
              <p className="text-gray-400 mb-6 max-w-sm">
                AI-powered career platform helping professionals unlock their potential and accelerate their career growth.
              </p>

              {/* Contact Info */}
              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3 text-gray-400">
                  <MapPin className="w-4 h-4 text-blue-400" />
                  <span className="text-sm">San Francisco, CA</span>
                </div>
                <div className="flex items-center gap-3 text-gray-400">
                  <Mail className="w-4 h-4 text-blue-400" />
                  <a href="mailto:hello@portman.ai" className="text-sm hover:text-white transition-colors">
                    hello@portman.ai
                  </a>
                </div>
                <div className="flex items-center gap-3 text-gray-400">
                  <Phone className="w-4 h-4 text-blue-400" />
                  <span className="text-sm">+1 (555) 123-4567</span>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex items-center gap-4">
                {socialLinks.map((social) => {
                  const Icon = social.icon
                  return (
                    <motion.a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className={`w-10 h-10 rounded-xl bg-gray-800/50 border border-gray-700/50 flex items-center justify-center text-gray-400 transition-all duration-300 hover:border-blue-500/50 ${social.color}`}
                    >
                      <Icon className="w-5 h-5" />
                    </motion.a>
                  )
                })}
              </div>
            </motion.div>

            {/* Product Links */}
            <motion.div variants={itemVariants}>
              <h3 className="text-white font-semibold mb-6 flex items-center gap-2">
                <Zap className="w-4 h-4 text-blue-400" />
                Product
              </h3>
              <ul className="space-y-3">
                {footerLinks.product.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center gap-2 group"
                    >
                      <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <span className="text-sm">{link.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Company Links */}
            <motion.div variants={itemVariants}>
              <h3 className="text-white font-semibold mb-6 flex items-center gap-2">
                <Globe className="w-4 h-4 text-purple-400" />
                Company
              </h3>
              <ul className="space-y-3">
                {footerLinks.company.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center gap-2 group"
                    >
                      <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <span className="text-sm">{link.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Resources Links */}
            <motion.div variants={itemVariants}>
              <h3 className="text-white font-semibold mb-6 flex items-center gap-2">
                <Heart className="w-4 h-4 text-pink-400" />
                Resources
              </h3>
              <ul className="space-y-3">
                {footerLinks.resources.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center gap-2 group"
                    >
                      <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <span className="text-sm">{link.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Legal Links */}
            <motion.div variants={itemVariants}>
              <h3 className="text-white font-semibold mb-6 flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-400" />
                Legal
              </h3>
              <ul className="space-y-3">
                {footerLinks.legal.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center gap-2 group"
                    >
                      <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <span className="text-sm">{link.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </motion.div>

        {/* Newsletter Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="border-t border-gray-800"
        >
          <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Stay updated with PORTMAN
                </h3>
                <p className="text-gray-400">
                  Get the latest updates, career tips, and exclusive insights delivered to your inbox.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                <div className="relative">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full md:w-80 px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700/50 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 transition-colors"
                  />
                </div>
                <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium hover:from-blue-600 hover:to-purple-600 transition-all duration-300 flex items-center gap-2">
                  Subscribe
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="border-t border-gray-800"
        >
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-6 text-sm text-gray-400">
                <span>© 2024 PORTMAN. All rights reserved.</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span>All systems operational</span>
                </div>
              </div>
              
              <div className="flex items-center gap-6 text-sm text-gray-400">
                <span className="flex items-center gap-2">
                  Made with <Heart className="w-4 h-4 text-red-400" /> in San Francisco
                </span>
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  <span>English (US)</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}

export default Footer
