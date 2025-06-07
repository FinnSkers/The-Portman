'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Plus, HelpCircle, MessageCircle, Mail } from 'lucide-react'
import { useState } from 'react'

interface FAQItem {
  id: string
  question: string
  answer: string
  category: 'general' | 'pricing' | 'features' | 'technical'
}

const faqData: FAQItem[] = [
  {
    id: '1',
    category: 'general',
    question: 'What is PORTMAN and how does it work?',
    answer: 'PORTMAN is an AI-powered career platform that helps professionals optimize their job search, benchmark their skills, and create stunning portfolios. Our advanced algorithms analyze your CV, match you with relevant opportunities, and provide personalized career insights to accelerate your professional growth.'
  },
  {
    id: '2',
    category: 'features',
    question: 'How accurate is the AI-powered CV analysis?',
    answer: 'Our AI analysis is built on millions of successful CVs and hiring patterns. It achieves 95%+ accuracy in identifying key improvements and skill gaps. The system continuously learns from real hiring outcomes to provide increasingly precise recommendations.'
  },
  {
    id: '3',
    category: 'pricing',
    question: 'Can I cancel my subscription anytime?',
    answer: 'Yes, you can cancel your subscription at any time with no questions asked. Your account will remain active until the end of your current billing period, and you\'ll continue to have access to all features during that time.'
  },
  {
    id: '4',
    category: 'features',
    question: 'What makes the 3D portfolio feature unique?',
    answer: 'Our 3D portfolio feature creates immersive, interactive showcases of your work that stand out to recruiters. Unlike traditional portfolios, it allows for dynamic presentations with animations, interactive elements, and modern web technologies that demonstrate your technical sophistication.'
  },
  {
    id: '5',
    category: 'technical',
    question: 'Is my data secure and private?',
    answer: 'Absolutely. We use enterprise-grade encryption, comply with GDPR and SOC 2 standards, and never share your personal information with third parties. Your data is stored securely and you have full control over your privacy settings.'
  },
  {
    id: '6',
    category: 'general',
    question: 'How long does it take to see results?',
    answer: 'Most users see immediate improvements in their CV quality and job match accuracy. On average, users receive 3x more interview invitations within the first month and land new positions 60% faster than traditional job search methods.'
  },
  {
    id: '7',
    category: 'features',
    question: 'Do you support international job markets?',
    answer: 'Yes, PORTMAN supports job markets in 150+ countries with localized insights for salary benchmarking, industry trends, and cultural hiring practices. Our AI adapts recommendations based on your target market and location preferences.'
  },
  {
    id: '8',
    category: 'pricing',
    question: 'What\'s included in the free plan?',
    answer: 'The free plan includes basic CV analysis, up to 5 job applications per month, standard portfolio templates, basic skill recommendations, and email support. It\'s perfect for getting started and experiencing our core features.'
  },
  {
    id: '9',
    category: 'technical',
    question: 'Can I integrate PORTMAN with other tools?',
    answer: 'Yes, our Professional and Enterprise plans include API access and integrations with popular tools like LinkedIn, GitHub, ATS systems, and major job boards. We also offer custom integrations for enterprise clients.'
  },
  {
    id: '10',
    category: 'general',
    question: 'Do you offer customer support?',
    answer: 'We provide comprehensive support including email support for all users, priority support for Professional users, and 24/7 dedicated support for Enterprise clients. Our team typically responds within 2-4 hours during business hours.'
  }
]

const categories = [
  { id: 'all', name: 'All Questions', icon: HelpCircle },
  { id: 'general', name: 'General', icon: MessageCircle },
  { id: 'features', name: 'Features', icon: HelpCircle },
  { id: 'pricing', name: 'Pricing', icon: Mail },
  { id: 'technical', name: 'Technical', icon: HelpCircle }
]

const FAQItem = ({ faq, index }: { faq: FAQItem; index: number }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group"
    >
      <div className="rounded-2xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50 backdrop-blur-sm hover:border-blue-500/30 transition-all duration-300">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full p-6 text-left flex items-center justify-between group-hover:bg-gray-800/20 rounded-2xl transition-all duration-300"
        >
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-blue-100 transition-colors">
              {faq.question}
            </h3>
            <div className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
              faq.category === 'general' ? 'bg-blue-500/20 text-blue-400' :
              faq.category === 'features' ? 'bg-purple-500/20 text-purple-400' :
              faq.category === 'pricing' ? 'bg-green-500/20 text-green-400' :
              'bg-orange-500/20 text-orange-400'
            }`}>
              {faq.category}
            </div>
          </div>
          <motion.div
            animate={{ rotate: isOpen ? 45 : 0 }}
            transition={{ duration: 0.2 }}
            className="ml-4 p-2 rounded-full bg-gray-700/50 group-hover:bg-blue-500/20 transition-all duration-300"
          >
            <Plus className="w-5 h-5 text-gray-400 group-hover:text-blue-400 transition-colors" />
          </motion.div>
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="px-6 pb-6">
                <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent mb-4" />
                <p className="text-gray-300 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

const FAQSection = () => {
  const [activeCategory, setActiveCategory] = useState('all')

  const filteredFAQs = activeCategory === 'all' 
    ? faqData 
    : faqData.filter(faq => faq.category === activeCategory)

  return (
    <section className="relative py-32 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900 to-black" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(59,130,246,0.1),transparent_70%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,rgba(139,92,246,0.1),transparent_70%)]" />

      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[linear-gradient(30deg,rgba(59,130,246,0.1)_1px,transparent_1px),linear-gradient(120deg,rgba(139,92,246,0.1)_1px,transparent_1px)] bg-[size:50px_50px] animate-pulse" />
      </div>

      <div className="relative max-w-6xl mx-auto px-6">
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
            <HelpCircle className="w-4 h-4 text-blue-400" />
            <span className="text-blue-400 text-sm font-medium">FAQ</span>
          </motion.div>
          
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
              Frequently Asked
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Questions
            </span>
          </h2>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Get answers to the most common questions about PORTMAN and how it can transform your career.
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {categories.map((category) => {
            const Icon = category.icon
            return (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeCategory === category.id
                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                    : 'bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700/50 border border-gray-700/50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {category.name}
              </button>
            )
          })}
        </motion.div>

        {/* FAQ Items */}
        <motion.div layout className="space-y-4">
          <AnimatePresence mode="wait">
            {filteredFAQs.map((faq, index) => (
              <FAQItem key={faq.id} faq={faq} index={index} />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mt-16"
        >
          <div className="inline-flex flex-col md:flex-row items-center gap-6 p-8 rounded-2xl bg-gradient-to-r from-gray-800/50 to-gray-900/50 border border-gray-700/50 backdrop-blur-sm">
            <div className="text-center md:text-left">
              <h3 className="text-xl font-semibold text-white mb-2">Still have questions?</h3>
              <p className="text-gray-400">
                Our support team is here to help you succeed. Get in touch and we&apos;ll respond within 24 hours.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button className="px-6 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-medium transition-colors duration-300 flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                Live Chat
              </button>
              <button className="px-6 py-3 rounded-xl border border-gray-600 hover:border-blue-500 text-gray-300 hover:text-white font-medium transition-all duration-300 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Support
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default FAQSection
