"use client"

import { motion } from 'framer-motion'
import { Upload, BarChart3, Target, Briefcase, Brain, Zap, Shield, Rocket } from 'lucide-react'

const features = [
  {
    icon: Upload,
    title: 'Intelligent CV Upload',
    description: 'Upload your CV in any format. Our AI instantly parses and analyzes your professional data with 99.9% accuracy.',
    gradient: 'from-blue-500 to-cyan-500',
    delay: 0.1,
  },
  {
    icon: BarChart3,
    title: 'Advanced Analytics',
    description: 'Get deep insights into your career trajectory, skill gaps, and market positioning with AI-powered analytics.',
    gradient: 'from-purple-500 to-pink-500',
    delay: 0.2,
  },
  {
    icon: Target,
    title: 'Professional Benchmarking',
    description: 'Compare your profile against industry standards and top performers in your field for strategic career planning.',
    gradient: 'from-green-500 to-emerald-500',
    delay: 0.3,
  },
  {
    icon: Briefcase,
    title: 'Portfolio Generation',
    description: 'Create stunning, professional portfolios that showcase your skills and achievements to potential employers.',
    gradient: 'from-orange-500 to-red-500',
    delay: 0.4,
  },
  {
    icon: Brain,
    title: 'AI Career Coach',
    description: 'Receive personalized career advice and recommendations based on your goals and market trends.',
    gradient: 'from-indigo-500 to-purple-500',
    delay: 0.5,
  },
  {
    icon: Zap,
    title: 'Real-time Optimization',
    description: 'Continuously optimize your profile and applications based on the latest industry requirements.',
    gradient: 'from-yellow-500 to-orange-500',
    delay: 0.6,
  },
  {
    icon: Shield,
    title: 'Privacy Protection',
    description: 'Your data is encrypted and secure. We respect your privacy and give you full control over your information.',
    gradient: 'from-gray-500 to-slate-500',
    delay: 0.7,
  },
  {
    icon: Rocket,
    title: 'Career Acceleration',
    description: 'Fast-track your career growth with AI-driven insights and personalized strategies.',
    gradient: 'from-teal-500 to-blue-500',
    delay: 0.8,
  },
]

export default function FeaturesSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  }

  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <motion.h2 
            variants={itemVariants}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4"
          >
            Powerful AI Features for{" "}
            <span className="gradient-text">Modern Professionals</span>
          </motion.h2>
          <motion.p 
            variants={itemVariants}
            className="text-xl text-muted-foreground max-w-3xl mx-auto"
          >            Discover how PORTMAN&apos;s cutting-edge AI technology can transform your career journey 
            and unlock new opportunities in today&apos;s competitive job market.
          </motion.p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                className="group relative"
              >
                <div className="relative p-6 rounded-2xl bg-card border border-border hover:border-border/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 hover:-translate-y-1">
                  {/* Icon */}
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${feature.gradient} mb-4`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold mb-3 group-hover:text-blue-500 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Hover Effect */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mt-20"
        >
          <div className="inline-flex items-center space-x-2 bg-blue-100 dark:bg-blue-900/30 px-6 py-3 rounded-full mb-6">
            <Brain className="h-5 w-5 text-blue-500" />
            <span className="text-blue-700 dark:text-blue-300 font-medium">
              Ready to transform your career?
            </span>
          </div>
          <h3 className="text-2xl font-bold mb-4">
            Join thousands of professionals already using PORTMAN
          </h3>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Start your journey today and discover how AI can accelerate your career growth.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
