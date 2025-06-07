'use client'

import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'

const testimonials = [
  {
    id: 1,
    name: "Sarah Chen",
    role: "Software Engineer",
    company: "Google",
    avatar: "/api/placeholder/64/64",
    rating: 5,
    text: "PORTMAN transformed my career search completely. The AI-powered CV optimization and skill benchmarking helped me land my dream job at Google. The 3D portfolio showcase was a game-changer!",
    highlight: "Landed dream job at Google"
  },
  {
    id: 2,
    name: "Marcus Rodriguez",
    role: "UX Designer",
    company: "Apple",
    avatar: "/api/placeholder/64/64",
    rating: 5,
    text: "The personalized recommendations and skill gap analysis were incredibly accurate. PORTMAN's AI understood my career goals better than I did and guided me to the perfect opportunities.",
    highlight: "Perfect career guidance"
  },
  {
    id: 3,
    name: "Emily Johnson",
    role: "Data Scientist",
    company: "Microsoft",
    avatar: "/api/placeholder/64/64",
    rating: 5,
    text: "I was impressed by the real-time market insights and salary benchmarking. PORTMAN helped me negotiate a 40% salary increase and transition into a senior role seamlessly.",
    highlight: "40% salary increase"
  },
  {
    id: 4,
    name: "David Kim",
    role: "Product Manager",
    company: "Meta",
    avatar: "/api/placeholder/64/64",
    rating: 5,
    text: "The 3D portfolio generation feature is revolutionary. It helped me showcase my projects in a way that really impressed recruiters. The AI-powered interview prep was also fantastic.",
    highlight: "Revolutionary portfolio"
  },
  {
    id: 5,
    name: "Lisa Thompson",
    role: "DevOps Engineer",
    company: "Amazon",
    avatar: "/api/placeholder/64/64",
    rating: 5,
    text: "PORTMAN's skill benchmarking showed me exactly where I stood in the market and what skills to develop. The personalized learning paths accelerated my career growth significantly.",
    highlight: "Accelerated career growth"
  },
  {
    id: 6,
    name: "Alex Chen",
    role: "AI Researcher",
    company: "OpenAI",
    avatar: "/api/placeholder/64/64",
    rating: 5,
    text: "As someone in AI, I appreciate the sophisticated algorithms behind PORTMAN. The career predictions were remarkably accurate, and the automated application process saved me hours weekly.",
    highlight: "Sophisticated AI algorithms"
  }
]

const TestimonialsSection = () => {
  return (
    <section className="relative py-32 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-black to-gray-900" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_70%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(139,92,246,0.1),transparent_70%)]" />
      
      {/* Animated Background Grid */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.1)_1px,transparent_1px)] bg-[size:50px_50px] animate-pulse" />
      </div>

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
            <Star className="w-4 h-4 text-blue-400" />
            <span className="text-blue-400 text-sm font-medium">Success Stories</span>
          </motion.div>
          
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
              Trusted by
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Industry Leaders
            </span>
          </h2>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Join thousands of professionals who&apos;ve transformed their careers with PORTMAN&apos;s AI-powered platform
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <div className="relative h-full p-8 rounded-2xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50 backdrop-blur-sm hover:border-blue-500/50 transition-all duration-500 group-hover:transform group-hover:-translate-y-2">
                {/* Quote Icon */}
                <div className="absolute top-6 right-6 opacity-20 group-hover:opacity-40 transition-opacity">
                  <Quote className="w-8 h-8 text-blue-400" />
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                {/* Testimonial Text */}                <p className="text-gray-300 mb-6 leading-relaxed">
                  &ldquo;{testimonial.text}&rdquo;
                </p>

                {/* Highlight Badge */}
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6">
                  <span className="text-blue-400 text-xs font-medium">
                    {testimonial.highlight}
                  </span>
                </div>

                {/* Author Info */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">{testimonial.name}</h4>
                    <p className="text-gray-400 text-sm">{testimonial.role} at {testimonial.company}</p>
                  </div>
                </div>

                {/* Hover Glow Effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 pt-20 border-t border-gray-800"
        >
          {[
            { label: "Success Rate", value: "98%", icon: "📈" },
            { label: "Avg Salary Increase", value: "35%", icon: "💰" },
            { label: "Time to Hire", value: "2.3 weeks", icon: "⚡" },
            { label: "User Satisfaction", value: "4.9/5", icon: "⭐" }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="text-2xl mb-2">{stat.icon}</div>
              <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-gray-400 text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default TestimonialsSection
