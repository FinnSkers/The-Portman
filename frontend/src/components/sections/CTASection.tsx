'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Sparkles, Users, Award, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/Button'

const CTASection = () => {
  const stats = [
    {
      icon: Users,
      value: '50,000+',
      label: 'Active Users',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Award,
      value: '95%',
      label: 'Success Rate',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: TrendingUp,
      value: '3x',
      label: 'Career Growth',
      gradient: 'from-green-500 to-emerald-500'
    }
  ]

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-700 to-indigo-800">
        <div className="absolute inset-0 opacity-20 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
      </div>
      
      <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white/10 rounded-full blur-xl animate-float"></div>
      <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-cyan-400/20 rounded-full blur-xl animate-float"></div>
      <div className="absolute bottom-1/4 left-1/3 w-20 h-20 bg-purple-400/20 rounded-full blur-xl animate-float"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-center mb-6"
          >
            <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-white/20">
              <Sparkles className="h-5 w-5 text-cyan-300" />
              <span className="text-white font-medium">Join the AI Revolution</span>
            </div>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            viewport={{ once: true }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
          >
            Ready to Transform{" "}
            <span className="bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">
              Your Career?
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
            className="text-xl text-blue-100 mb-12 max-w-3xl mx-auto"
          >
            Join thousands of professionals who have already accelerated their careers with PORTMAN AI.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            <Button 
              size="lg"
              className="bg-white text-blue-600 hover:bg-blue-50 rounded-full px-8 py-6 text-lg font-semibold group shadow-2xl"
            >
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10 rounded-full px-8 py-6 text-lg backdrop-blur-md"
            >
              Schedule Demo
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto"
          >
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center group"
                >
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:border-white/30 transition-all duration-300 group-hover:scale-105">
                    <div className={`inline-flex p-4 rounded-xl bg-gradient-to-r ${stat.gradient} mb-4`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <div className="text-3xl font-bold text-white mb-2">
                      {stat.value}
                    </div>
                    <div className="text-blue-200">
                      {stat.label}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            viewport={{ once: true }}
            className="mt-16 text-center"
          >
            <p className="text-blue-200 text-sm mb-4">Trusted by professionals worldwide</p>
            <div className="flex items-center justify-center space-x-8 opacity-60">
              <div className="text-white font-semibold">Microsoft</div>
              <div className="text-white font-semibold">Google</div>
              <div className="text-white font-semibold">Amazon</div>
              <div className="text-white font-semibold">Meta</div>
              <div className="text-white font-semibold">Apple</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default CTASection
