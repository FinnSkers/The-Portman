'use client'

import { motion } from 'framer-motion'
import { Check, X, Zap, Crown, Rocket, Star } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useState } from 'react'

interface PricingTier {
  id: string
  name: string
  description: string
  price: {
    monthly: number
    annual: number
  }
  features: string[]
  limitations: string[]
  badge?: string
  popular?: boolean
  icon: React.ReactNode
  gradient: string
}

const PricingCard = ({ tier, isAnnual, delay }: { tier: PricingTier; isAnnual: boolean; delay: number }) => {
  const price = isAnnual ? tier.price.annual : tier.price.monthly
  const savings = isAnnual ? Math.round(((tier.price.monthly * 12) - tier.price.annual) / (tier.price.monthly * 12) * 100) : 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, delay }}
      className={`relative group ${tier.popular ? 'md:-mt-8' : ''}`}
    >
      {/* Popular Badge */}
      {tier.popular && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: delay + 0.3 }}
          className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10"
        >
          <div className="px-4 py-2 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 text-black text-sm font-bold flex items-center gap-2">
            <Star className="w-4 h-4" />
            Most Popular
          </div>
        </motion.div>
      )}

      {/* Badge */}
      {tier.badge && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: delay + 0.2 }}
          className="absolute top-6 right-6 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-400 text-xs font-medium"
        >
          {tier.badge}
        </motion.div>
      )}

      <div className={`relative h-full p-8 rounded-3xl backdrop-blur-sm border transition-all duration-500 group-hover:-translate-y-2 ${
        tier.popular 
          ? 'bg-gradient-to-br from-blue-500/20 to-purple-500/20 border-blue-500/50 shadow-2xl shadow-blue-500/20' 
          : 'bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700/50 hover:border-blue-500/30'
      }`}>
        
        {/* Icon */}
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          className={`w-16 h-16 rounded-2xl ${tier.gradient} flex items-center justify-center mb-6 group-hover:shadow-lg transition-all duration-300`}
        >
          {tier.icon}
        </motion.div>

        {/* Header */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-white mb-2">{tier.name}</h3>
          <p className="text-gray-400 text-sm">{tier.description}</p>
        </div>

        {/* Price */}
        <div className="mb-8">
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-4xl font-bold text-white">${price}</span>
            <span className="text-gray-400">/{isAnnual ? 'year' : 'month'}</span>
          </div>
          {isAnnual && savings > 0 && (
            <div className="text-green-400 text-sm font-medium">
              Save {savings}% with annual billing
            </div>
          )}
        </div>

        {/* Features */}
        <div className="mb-8 space-y-4">
          {tier.features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: delay + index * 0.1 }}
              className="flex items-center gap-3"
            >
              <div className="w-5 h-5 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center flex-shrink-0">
                <Check className="w-3 h-3 text-green-400" />
              </div>
              <span className="text-gray-300 text-sm">{feature}</span>
            </motion.div>
          ))}
          
          {tier.limitations.map((limitation, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: delay + (tier.features.length + index) * 0.1 }}
              className="flex items-center gap-3 opacity-60"
            >
              <div className="w-5 h-5 rounded-full bg-gray-500/20 border border-gray-500/30 flex items-center justify-center flex-shrink-0">
                <X className="w-3 h-3 text-gray-500" />
              </div>
              <span className="text-gray-500 text-sm">{limitation}</span>
            </motion.div>
          ))}
        </div>

        {/* CTA Button */}
        <Button
          variant={tier.popular ? "cyber" : "neon"}
          size="lg"
          className="w-full"
        >
          {tier.price.monthly === 0 ? 'Get Started Free' : 'Start Free Trial'}
        </Button>

        {/* Hover Glow Effect */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
    </motion.div>
  )
}

const PricingSection = () => {
  const [isAnnual, setIsAnnual] = useState(false)

  const tiers: PricingTier[] = [
    {
      id: 'starter',
      name: 'Starter',
      description: 'Perfect for job seekers getting started',
      price: { monthly: 0, annual: 0 },
      features: [
        'Basic CV analysis',
        'Up to 5 job applications',
        'Basic skill recommendations',
        'Standard portfolio templates',
        'Email support'
      ],
      limitations: [
        'Advanced AI insights',
        'Premium templates',
        'Priority support',
        'Custom branding'
      ],
      icon: <Zap className="w-8 h-8 text-white" />,
      gradient: 'bg-gradient-to-br from-gray-600 to-gray-700'
    },
    {
      id: 'professional',
      name: 'Professional',
      description: 'Advanced features for serious professionals',
      price: { monthly: 29, annual: 290 },
      features: [
        'Advanced AI CV optimization',
        'Unlimited job applications',
        'Skill benchmarking & gap analysis',
        'Premium portfolio templates',
        'Interview preparation tools',
        'Salary insights & negotiation tips',
        'Priority email support',
        'Career roadmap planning'
      ],
      limitations: [
        'White-label solutions',
        'API access',
        'Dedicated account manager'
      ],
      popular: true,
      badge: 'Best Value',
      icon: <Crown className="w-8 h-8 text-white" />,
      gradient: 'bg-gradient-to-br from-blue-500 to-purple-500'
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      description: 'Complete solution for organizations',
      price: { monthly: 99, annual: 990 },
      features: [
        'Everything in Professional',
        'White-label solutions',
        'API access & integrations',
        'Custom branding & themes',
        'Dedicated account manager',
        'Advanced analytics dashboard',
        'Team collaboration tools',
        'Custom integrations',
        'SLA guarantee',
        '24/7 priority support'
      ],
      limitations: [],
      badge: 'Enterprise',
      icon: <Rocket className="w-8 h-8 text-white" />,
      gradient: 'bg-gradient-to-br from-purple-500 to-pink-500'
    }
  ]

  return (
    <section className="relative py-32 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-black to-gray-900" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(59,130,246,0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(139,92,246,0.1),transparent_50%)]" />

      {/* Animated Background Grid */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.1)_1px,transparent_1px)] bg-[size:40px_40px] animate-pulse" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6"
          >
            <Crown className="w-4 h-4 text-blue-400" />
            <span className="text-blue-400 text-sm font-medium">Pricing Plans</span>
          </motion.div>
          
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
              Choose Your
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Career Path
            </span>
          </h2>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Unlock your potential with the right plan. Start free and upgrade as you grow.
          </p>

          {/* Billing Toggle */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="inline-flex items-center p-1 rounded-full bg-gray-800/50 border border-gray-700/50"
          >
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                !isAnnual 
                  ? 'bg-blue-500 text-white shadow-lg' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                isAnnual 
                  ? 'bg-blue-500 text-white shadow-lg' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Annual
              <span className="ml-2 px-2 py-1 rounded-full bg-green-500/20 text-green-400 text-xs">
                Save 17%
              </span>
            </button>
          </motion.div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {tiers.map((tier, index) => (
            <PricingCard
              key={tier.id}
              tier={tier}
              isAnnual={isAnnual}
              delay={index * 0.2}
            />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center mt-20"
        >
          <div className="inline-flex flex-col md:flex-row items-center gap-4 p-6 rounded-2xl bg-gradient-to-r from-gray-800/50 to-gray-900/50 border border-gray-700/50 backdrop-blur-sm">
            <div className="text-center md:text-left">
              <h3 className="text-white font-semibold mb-1">Need a custom solution?</h3>
              <p className="text-gray-400 text-sm">Contact our sales team for enterprise pricing and custom features.</p>
            </div>
            <Button variant="outline" size="sm">
              Contact Sales
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default PricingSection
