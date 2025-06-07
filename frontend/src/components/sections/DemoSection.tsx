"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, FileText, Download, Eye, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'

const demoSteps = [
  {
    id: 'upload',
    title: 'Upload Your CV',
    description: 'Drop your CV in any format - PDF, DOC, TXT',
    icon: Upload,
    color: 'from-blue-500 to-cyan-500',
    demo: 'Drag & drop or click to select your CV file',
  },
  {
    id: 'analyze',
    title: 'AI Analysis',
    description: 'Our AI analyzes and extracts key information',
    icon: FileText,
    color: 'from-purple-500 to-pink-500',
    demo: 'AI is processing your professional data...',
  },
  {
    id: 'insights',
    title: 'Get Insights',
    description: 'Receive detailed analytics and recommendations',
    icon: Eye,
    color: 'from-green-500 to-emerald-500',
    demo: 'Skills gap analysis, market positioning, improvement suggestions',
  },
  {
    id: 'portfolio',
    title: 'Generate Portfolio',
    description: 'Create stunning professional portfolios instantly',
    icon: Download,
    color: 'from-orange-500 to-red-500',
    demo: 'Beautiful portfolio ready for download',
  },
]

export default function DemoSection() {
  const [activeStep, setActiveStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  const handleStepClick = (index: number) => {
    setActiveStep(index)
  }

  const startDemo = () => {
    setIsPlaying(true)
    setActiveStep(0)
    
    // Auto-advance through steps
    const interval = setInterval(() => {
      setActiveStep((prev) => {
        if (prev >= demoSteps.length - 1) {
          clearInterval(interval)
          setIsPlaying(false)
          return 0
        }
        return prev + 1
      })
    }, 2000)
  }

  return (
    <section className="py-20 bg-gradient-to-br from-muted/30 to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            See PORTMAN in{" "}
            <span className="gradient-text">Action</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Experience the power of AI-driven career transformation in just four simple steps.
          </p>
          <Button 
            variant="cyber" 
            size="lg"
            onClick={startDemo}
            disabled={isPlaying}
            className="rounded-full px-8"
          >
            {isPlaying ? 'Demo Running...' : 'Start Interactive Demo'}
            <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Steps Navigation */}
          <div className="space-y-6">
            {demoSteps.map((step, index) => {
              const Icon = step.icon
              const isActive = activeStep === index
              
              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className={`cursor-pointer p-6 rounded-2xl border transition-all duration-300 ${
                    isActive 
                      ? 'border-blue-500/50 bg-blue-50/50 dark:bg-blue-950/20 shadow-lg' 
                      : 'border-border hover:border-border/50 hover:bg-muted/50'
                  }`}
                  onClick={() => handleStepClick(index)}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${step.color} flex-shrink-0`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className={`text-sm font-medium ${
                          isActive ? 'text-blue-500' : 'text-muted-foreground'
                        }`}>
                          Step {index + 1}
                        </span>
                        {isActive && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-2 h-2 bg-blue-500 rounded-full"
                          />
                        )}
                      </div>
                      <h3 className={`text-xl font-semibold mb-2 ${
                        isActive ? 'text-foreground' : 'text-muted-foreground'
                      }`}>
                        {step.title}
                      </h3>
                      <p className="text-muted-foreground">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Demo Visualization */}
          <div className="relative">
            <div className="relative h-96 rounded-3xl glass-morphism border border-border/50 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStep}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.2 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 flex items-center justify-center p-8"
                >
                  <div className="text-center">
                    <div className={`w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r ${demoSteps[activeStep].color} flex items-center justify-center`}>
                      {React.createElement(demoSteps[activeStep].icon, { 
                        className: "h-12 w-12 text-white" 
                      })}
                    </div>
                    <h3 className="text-2xl font-bold mb-4">
                      {demoSteps[activeStep].title}
                    </h3>
                    <p className="text-muted-foreground text-lg">
                      {demoSteps[activeStep].demo}
                    </p>
                    
                    {/* Progress indicator */}
                    <div className="mt-8 flex justify-center space-x-2">
                      {demoSteps.map((_, index) => (
                        <div
                          key={index}
                          className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                            index === activeStep ? 'bg-blue-500' : 'bg-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
              
              {/* Animated Background Elements */}
              <div className="absolute top-4 right-4 w-20 h-20 bg-blue-500/10 rounded-full animate-float" />
              <div className="absolute bottom-4 left-4 w-16 h-16 bg-purple-500/10 rounded-full animate-float" style={{animationDelay: '1s'}} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
