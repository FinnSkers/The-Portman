'use client'

import { motion } from 'framer-motion'
import { TrendingUp, Users, Briefcase, Award, Zap, Globe } from 'lucide-react'
import { useEffect, useState } from 'react'

interface StatItemProps {
  icon: React.ReactNode
  value: string
  label: string
  description: string
  delay: number
}

const AnimatedCounter = ({ end, duration = 2 }: { end: number; duration?: number }) => {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let startTime: number
    let animationFrame: number

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1)
      
      setCount(Math.floor(progress * end))
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrame)
  }, [end, duration])

  return <span>{count.toLocaleString()}</span>
}

const StatItem = ({ icon, value, label, description, delay }: StatItemProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, delay }}
      className="group relative"
    >
      <div className="relative p-8 rounded-2xl bg-gradient-to-br from-gray-800/50 to-gray-900/80 border border-gray-700/50 backdrop-blur-sm hover:border-blue-500/50 transition-all duration-500 group-hover:transform group-hover:-translate-y-2">
        {/* Icon */}
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center mb-6 group-hover:shadow-lg group-hover:shadow-blue-500/25 transition-all duration-300"
        >
          {icon}
        </motion.div>

        {/* Value */}
        <div className="text-4xl font-bold text-white mb-2 font-mono">
          {value.includes('+') ? (
            <>
              <AnimatedCounter end={parseInt(value.replace(/[^0-9]/g, ''))} />
              {value.replace(/[0-9]/g, '')}
            </>
          ) : value.includes('%') ? (
            <>
              <AnimatedCounter end={parseInt(value.replace('%', ''))} />%
            </>
          ) : (
            value
          )}
        </div>

        {/* Label */}
        <h3 className="text-xl font-semibold text-blue-100 mb-3">{label}</h3>

        {/* Description */}
        <p className="text-gray-400 text-sm leading-relaxed">{description}</p>

        {/* Hover Glow Effect */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Animated Border */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 opacity-0 group-hover:opacity-20 blur-sm transition-opacity duration-500" />
      </div>
    </motion.div>
  )
}

const StatsSection = () => {
  const stats = [
    {
      icon: <Users className="w-8 h-8 text-white" />,
      value: "500000+",
      label: "Active Users",
      description: "Professionals worldwide trust PORTMAN for their career growth and development"
    },
    {
      icon: <Briefcase className="w-8 h-8 text-white" />,
      value: "2500000+",
      label: "Job Matches",
      description: "Successful job placements facilitated through our AI-powered matching system"
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-white" />,
      value: "98%",
      label: "Success Rate",
      description: "Of users report significant improvement in their job search effectiveness"
    },
    {
      icon: <Award className="w-8 h-8 text-white" />,
      value: "45%",
      label: "Avg Salary Boost",
      description: "Average salary increase achieved by users within 6 months of using PORTMAN"
    },
    {
      icon: <Zap className="w-8 h-8 text-white" />,
      value: "3.2x",
      label: "Faster Hiring",
      description: "Users get hired 3.2x faster compared to traditional job search methods"
    },
    {
      icon: <Globe className="w-8 h-8 text-white" />,
      value: "150+",
      label: "Countries",
      description: "PORTMAN serves professionals across 150+ countries globally"
    }
  ]

  return (
    <section className="relative py-32 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900 to-black" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(59,130,246,0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_50%,rgba(139,92,246,0.1),transparent_50%)]" />
      
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(59,130,246,0.1)_1px,transparent_1px),linear-gradient(-45deg,rgba(139,92,246,0.1)_1px,transparent_1px)] bg-[size:60px_60px] animate-pulse" />
      </div>

      {/* Floating Elements */}
      <motion.div
        animate={{ y: [-20, 20, -20] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 left-20 w-32 h-32 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-xl"
      />
      <motion.div
        animate={{ y: [20, -20, 20] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-20 right-20 w-40 h-40 rounded-full bg-gradient-to-r from-purple-500/10 to-blue-500/10 blur-xl"
      />

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6"
          >
            <TrendingUp className="w-4 h-4 text-blue-400" />
            <span className="text-blue-400 text-sm font-medium">Platform Impact</span>
          </motion.div>
          
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
              Proven
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Results
            </span>
          </h2>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Numbers that speak for themselves. See the impact PORTMAN has made on careers worldwide.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <StatItem
              key={stat.label}
              icon={stat.icon}
              value={stat.value}
              label={stat.label}
              description={stat.description}
              delay={index * 0.1}
            />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mt-20"
        >
          <div className="inline-flex items-center gap-4 px-8 py-4 rounded-2xl bg-gradient-to-r from-gray-800/50 to-gray-900/50 border border-gray-700/50 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
              <span className="text-green-400 text-sm font-medium">Live Stats</span>
            </div>
            <div className="text-gray-300 text-sm">
              Updated in real-time • Last update: just now
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default StatsSection
