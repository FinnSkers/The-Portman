"use client";

import CVUpload from "@/components/CVUpload";
import ScrollingTextAnimation from "@/components/ScrollingTextAnimation";
import { useState, useEffect, useMemo, useRef } from "react";
import { useTheme } from "next-themes";
import {
  ArrowDownTrayIcon,
  UserCircleIcon,
  SparklesIcon,
  Cog6ToothIcon,
  SunIcon,
  MoonIcon,
  RocketLaunchIcon,
  ShieldCheckIcon,
  BoltIcon,
  StarIcon,
  CheckIcon,
  PlayIcon
} from "@heroicons/react/24/solid";
import { useCVStore } from "@/store/useCVStore";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useInView } from 'react-intersection-observer';
import FloatingChatTip, { FloatingProTip } from "@/components/FloatingChatTip";
import Lottie from "lottie-react";
import processUploadAnim from "@/../public/process-upload.json";

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const heroTitleRef = useRef(null);
  const { setTheme } = useTheme();

  useEffect(() => {
    setTheme(
      window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
    );
  }, [setTheme]);

  // Section refs for animations
  const { ref: statsRef, inView: statsInView } = useInView({ triggerOnce: true, threshold: 0.2 });
  const { ref: featuresRef, inView: featuresInView } = useInView({ triggerOnce: true, threshold: 0.2 });
  const { ref: processRef, inView: processInView } = useInView({ triggerOnce: true, threshold: 0.2 });
  const { ref: pricingRef, inView: pricingInView } = useInView({ triggerOnce: true, threshold: 0.2 });
  const { ref: testimonialsRef, inView: testimonialsInView } = useInView({ triggerOnce: true, threshold: 0.2 });

  // Scroll progress
  const { scrollY } = useScroll();
  const heroParallax = useTransform(scrollY, [0, 600], [0, -200]);
  const heroScale = useTransform(scrollY, [0, 600], [1, 1.1]);

  // Generate random positions for particles only on the client to avoid hydration mismatch
  const particlePositions = useMemo(() =>
    Array.from({ length: 20 }).map(() => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: 6 + Math.random() * 4,
      delay: Math.random() * 5,
    })),
    []
  );

  return (
    <main className="relative w-full min-h-screen overflow-x-hidden" aria-label="PORTMAN landing page">
      {/* Floating Chat and Pro Tip Buttons (best-practice placement) */}
      <FloatingChatTip />
      <FloatingProTip />
      {/* Full-width bordered container with minimal margin */}
      <div className="w-full min-h-screen border border-indigo-200/40 dark:border-indigo-800/40 bg-gradient-to-br from-indigo-50/90 via-white/95 to-blue-50/90 dark:from-gray-900/95 dark:via-gray-950/98 dark:to-indigo-950/95 relative rounded-md">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Glowing orbs */}
          <motion.div
            className="absolute -top-20 -left-20 w-96 h-96 bg-gradient-to-br from-indigo-400/20 to-purple-600/20 rounded-full blur-3xl"
            animate={{ x: [0, 100, 0], y: [0, 50, 0], scale: [1, 1.2, 1] }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute top-1/3 -right-32 w-80 h-80 bg-gradient-to-br from-pink-400/20 to-blue-500/20 rounded-full blur-3xl"
            animate={{ x: [0, -80, 0], y: [0, 80, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 5 }}
          />
          <motion.div
            className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-cyan-400/20 to-indigo-500/20 rounded-full blur-3xl"
            animate={{ x: [0, 60, 0], y: [0, -40, 0], scale: [1, 1.3, 1] }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 10 }}
          />
          {/* Floating particles - use stable positions */}
          {particlePositions.map((pos, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-indigo-400/40 rounded-full"
              style={{ left: `${pos.left}%`, top: `${pos.top}%` }}
              animate={{ y: [-20, 20, -20], x: [-10, 10, -10], opacity: [0.3, 0.8, 0.3] }}
              transition={{ duration: pos.duration, repeat: Infinity, ease: "easeInOut", delay: pos.delay }}
            />
          ))}
        </div>

        {/* Hero Section - Stunning Starting Screen */}
        <section 
          className="relative min-h-screen flex flex-col items-center justify-center px-6 py-20 text-center overflow-hidden"
          aria-label="Hero section: AI-powered portfolio creation"
        >
          <motion.div
            className="absolute inset-0"
            style={{ y: heroParallax, scale: heroScale }}
          >
            {/* Large gradient background */}
            <div className="absolute inset-0 bg-gradient-radial from-indigo-200/20 via-transparent to-transparent blur-3xl" />
          </motion.div>

          {/* Animated title - Industry Standard */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1, ease: 'easeOut' }}
            className="relative z-10 mb-4"
          >
            <motion.h1
              id="hero-title"
              ref={heroTitleRef as any}
              className="text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight leading-tight text-center select-none"
              style={{
                fontFamily: 'Inter, Space Grotesk, Segoe UI, Arial, sans-serif',
                letterSpacing: '-0.03em',
                lineHeight: 1.08,
                background: 'linear-gradient(90deg, #6366f1 0%, #818cf8 40%, #a5b4fc 60%, #818cf8 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                WebkitTextFillColor: 'transparent',
                animation: 'gradient-shift 6s ease-in-out infinite',
                backgroundSize: '200% 200%',
                filter: 'drop-shadow(0 2px 12px rgba(99,102,241,0.10))'
              }}
            >
              THE PORTMAN
            </motion.h1>
          </motion.div>

          {/* Subtitle - Only scrolling text, big and centered, width matches title */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
            className="relative z-10 mb-10"
          >
            <div className="w-full flex justify-center items-center min-h-[3.5rem] md:min-h-[4.5rem] px-2">
              <ScrollingTextAnimation
                dynamicTexts={[
                  "Transform your CV into stunning websites",
                  "Analyze your skills with AI precision", 
                  "Benchmark you against industry leaders",
                  "Deploy your portfolio in minutes",
                  "Optimize your career trajectory",
                  "Showcase your talents beautifully"
                ]}
                duration={3200}
                className="w-full max-w-full"
                titleRef={heroTitleRef as any}
              />
            </div>
          </motion.div>

          {/* Centralized Upload UI */}
          <div className="relative z-10 flex justify-center items-center min-h-[420px]">
            <CVUpload />
          </div>
        </section>
        {/* Stats Section */}
        <section className="py-20 px-6" aria-label="Platform statistics">
          <h2 id="stats-title" className="sr-only">Platform Statistics</h2>
          <motion.div
            ref={statsRef}
            initial={{ opacity: 0, y: 50 }}
            animate={statsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="max-w-6xl mx-auto"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { number: "2M+", label: "CVs Processed", color: "text-indigo-600" },
                { number: "98%", label: "Success Rate", color: "text-green-600" },
                { number: "4.9/5", label: "User Rating", color: "text-yellow-600" },
                { number: "<30s", label: "Processing Time", color: "text-blue-600" }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={statsInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group"
                >
                  <div className="text-4xl md:text-5xl font-black mb-2 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    {stat.number}
                  </div>
                  <div className="text-gray-600 dark:text-gray-300 font-medium">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-6 bg-gradient-to-r from-white/60 to-indigo-50/60 dark:from-gray-900/60 dark:to-indigo-950/60 backdrop-blur-sm" aria-label="Key features">
          <h2 id="features-title" className="sr-only">Key Features</h2>
          <motion.div
            ref={featuresRef}
            initial={{ opacity: 0, y: 50 }}
            animate={featuresInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="max-w-7xl mx-auto"
          >
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-6xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">
                Why Choose PORTMAN?
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Experience the future of professional branding with AI-powered portfolio creation
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: <SparklesIcon className="w-12 h-12" />,
                  title: "AI-Powered Parsing",
                  description: "Advanced AI extracts and structures your experience, skills, and achievements with precision",
                  gradient: "from-indigo-500 to-purple-600"
                },
                {
                  icon: <RocketLaunchIcon className="w-12 h-12" />,
                  title: "Instant Generation",
                  description: "Transform your CV into a stunning portfolio website in under 30 seconds",
                  gradient: "from-purple-500 to-pink-600"
                },
                {
                  icon: <UserCircleIcon className="w-12 h-12" />,
                  title: "Professional Benchmarking",
                  description: "Compare your profile with industry leaders and get actionable insights",
                  gradient: "from-pink-500 to-red-600"
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={featuresInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className="group relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-2xl blur-xl" />
                  <div className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-xl group-hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-2">
                    <div className={`text-white bg-gradient-to-r ${feature.gradient} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      {feature.icon}
                    </div>
                    <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Process Section */}
        <section className="py-20 px-6" aria-label="How it works: process steps">
          <h2 id="process-title" className="sr-only">How It Works</h2>
          <motion.div
            ref={processRef}
            initial={{ opacity: 0, y: 50 }}
            animate={processInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="max-w-6xl mx-auto"
          >
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-6xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-6">
                How It Works
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                From CV to professional portfolio in 4 simple steps
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-8">
              {[
                {
                  step: "01",
                  title: "Upload",
                  description: "Drop your CV in any format - PDF, DOCX, or TXT",
                  icon: <Lottie animationData={processUploadAnim} loop={true} style={{ width: 64, height: 64 }} aria-label="Animated upload arrow" />
                },
                {
                  step: "02", 
                  title: "AI Analysis",
                  description: "Our AI extracts and structures your professional data",
                  icon: <span className="text-6xl" role="img" aria-label="AI Robot">🤖</span>
                },
                {
                  step: "03",
                  title: "Customize",
                  description: "Choose from stunning templates and personalize your brand",
                  icon: <span className="text-6xl" role="img" aria-label="Palette">🎨</span>
                },
                {
                  step: "04",
                  title: "Launch",
                  description: "Deploy your portfolio and start impressing employers",
                  icon: <span className="text-6xl" role="img" aria-label="Rocket">🚀</span>
                }
              ].map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -50 }}
                  animate={processInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className="relative group focus-within:ring-4 focus-within:ring-indigo-300 rounded-2xl outline-none"
                  tabIndex={0}
                  aria-label={`Step ${step.step}: ${step.title}. ${step.description}`}
                >
                  {index < 3 && (
                    <div className="hidden md:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-indigo-300 to-transparent -translate-y-1/2 z-0" />
                  )}
                  <div className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg group-hover:shadow-xl transition-all duration-300 text-center">
                    <div className="mb-4 flex justify-center items-center">{step.icon}</div>
                    <div className="text-sm font-bold text-indigo-600 mb-2">STEP {step.step}</div>
                    <h3 className="text-xl font-bold mb-3 text-gray-800 dark:text-gray-100">{step.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Pricing Section */}
        <section className="py-20 px-6 bg-gradient-to-r from-indigo-50/60 to-purple-50/60 dark:from-indigo-950/60 dark:to-purple-950/60" aria-label="Pricing plans">
          <h2 id="pricing-title" className="sr-only">Pricing Plans</h2>
          <motion.div
            ref={pricingRef}
            initial={{ opacity: 0, y: 50 }}
            animate={pricingInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="max-w-6xl mx-auto"
          >
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-6xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
                Simple Pricing
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Choose the plan that fits your professional needs
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  name: "Free",
                  price: "$0",
                  period: "forever",
                  features: ["Basic CV parsing", "3 template options", "Standard portfolio", "Community support"],
                  popular: false,
                  gradient: "from-gray-500 to-gray-600"
                },
                {
                  name: "Pro",
                  price: "$19",
                  period: "per month",
                  features: ["Advanced AI parsing", "50+ premium templates", "Custom domains", "Analytics dashboard", "Priority support", "AI benchmarking"],
                  popular: true,
                  gradient: "from-indigo-500 to-purple-600"
                },
                {
                  name: "Enterprise",
                  price: "$99",
                  period: "per month",
                  features: ["Unlimited parsing", "White-label solution", "API access", "Custom integrations", "Dedicated support", "Advanced analytics"],
                  popular: false,
                  gradient: "from-purple-500 to-pink-600"
                }
              ].map((plan, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={pricingInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className={`relative group ${plan.popular ? 'scale-105 z-10' : ''}`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                      Most Popular
                    </div>
                  )}
                  <div className={`relative bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-2xl p-8 border ${plan.popular ? 'border-indigo-300 shadow-2xl' : 'border-white/20 shadow-lg'} group-hover:shadow-xl transition-all duration-300`}>
                    <div className="text-center mb-8">
                      <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">{plan.name}</h3>
                      <div className="flex items-baseline justify-center gap-2 mb-2">
                        <span className="text-4xl font-black text-gray-800 dark:text-gray-100">{plan.price}</span>
                        <span className="text-gray-600 dark:text-gray-300">/{plan.period}</span>
                      </div>
                    </div>
                    
                    <ul className="space-y-4 mb-8">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center gap-3">
                          <CheckIcon className="w-5 h-5 text-green-500 flex-shrink-0" />
                          <span className="text-gray-600 dark:text-gray-300">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full py-4 rounded-xl font-bold text-white transition-all duration-300 ${
                        plan.popular 
                          ? 'bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg hover:shadow-xl' 
                          : 'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600'
                      }`}
                    >
                      {plan.name === 'Free' ? 'Get Started' : 'Upgrade Now'}
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 px-6" aria-labelledby="testimonials-title">
          <h2 id="testimonials-title" className="sr-only">User Testimonials</h2>
          <motion.div
            ref={testimonialsRef}
            initial={{ opacity: 0, y: 50 }}
            animate={testimonialsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="max-w-6xl mx-auto"
          >
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-6xl font-black bg-gradient-to-r from-pink-600 to-red-600 bg-clip-text text-transparent mb-6">
                Success Stories
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Join thousands of professionals who've transformed their careers
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  name: "Sarah Chen",
                  role: "Software Engineer",
                  company: "Google",
                  image: "👩‍💻",
                  quote: "PORTMAN helped me land my dream job at Google. The AI insights were spot-on!"
                },
                {
                  name: "Marcus Johnson",
                  role: "Product Designer",
                  company: "Apple", 
                  image: "👨‍🎨",
                  quote: "The portfolio templates are stunning. Got 3x more interview requests!"
                },
                {
                  name: "Elena Rodriguez",
                  role: "Marketing Director",
                  company: "Microsoft",
                  image: "👩‍💼",
                  quote: "Professional benchmarking showed me exactly where to improve. Amazing tool!"
                }
              ].map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={testimonialsInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className="group"
                >
                  <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-lg group-hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="text-4xl">{testimonial.image}</div>
                      <div>
                        <h4 className="font-bold text-gray-800 dark:text-gray-100">{testimonial.name}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{testimonial.role} at {testimonial.company}</p>
                      </div>
                    </div>
                    <blockquote className="text-gray-600 dark:text-gray-300 italic leading-relaxed">
                      "{testimonial.quote}"
                    </blockquote>
                    <div className="flex mt-4">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <CheckIcon key={i} className="w-5 h-5 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-6xl font-black mb-6">
                Ready to Transform Your Career?
              </h2>
              <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
                Join over 2 million professionals who've created stunning portfolios with PORTMAN
              </p>
              <motion.button
                whileHover={{ scale: 1.08, boxShadow: "0 0 32px 8px rgba(99,102,241,0.18)" }}
                whileTap={{ scale: 0.97 }}
                onClick={() => heroRef.current?.scrollIntoView({ behavior: 'smooth' })}
                className="cta-glow bg-white text-indigo-600 px-12 py-6 rounded-full font-black text-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center gap-4 mx-auto focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-400/60 neural-pulse"
                aria-label="Start building your portfolio now for free"
              >
                <PlayIcon className="w-7 h-7 animate-bounce-slow" />
                Start Building Now – It&apos;s Free!
              </motion.button>
            </motion.div>
          </div>
        </section>
      </div>
    </main>
  );
}
