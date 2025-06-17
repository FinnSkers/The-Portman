"use client";

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { AnimatedButton } from '@/components/ui';
import Link from 'next/link';

const features = [
  'Unlimited portfolios',
  'AI-powered CV parsing & analysis',
  'All portfolio templates included',
  'Custom domain support',
  'SEO optimization',
  'Analytics dashboard',
  'Community & priority support',
  'No credit card required',
];

export const Pricing: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start']
  });
  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);

  return (
    <section id="pricing" ref={containerRef} className="py-20 bg-gradient-to-br from-blue-50 via-purple-50 to-white dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 relative">
      {/* Background gradient blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 0.7, scale: 1 }}
          transition={{ duration: 1 }}
          className="absolute -top-40 -right-40 w-96 h-96 bg-blue-400/30 rounded-full blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 0.7, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-400/30 rounded-full blur-3xl"
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600"
          >
            Portman is <span className="inline-block">100% Free</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-lg text-gray-700 dark:text-gray-200"
          >
            Enjoy all features, templates, and AI tools at no cost. Build your professional portfolio and resume with no limits, forever.
          </motion.p>
        </div>

        <motion.div
          style={{ y }}
          className="max-w-2xl mx-auto bg-white/80 dark:bg-gray-900/80 rounded-2xl shadow-xl p-8 md:p-12 backdrop-blur-lg border border-gray-200 dark:border-gray-800"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col items-center">
            <div className="text-6xl font-extrabold text-blue-600 mb-2">$0</div>
            <div className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-6">Forever. For everyone.</div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mb-8">
              {features.map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <Link href="/auth/register">
              <AnimatedButton variant="primary" size="lg" animationVariant="pulse" fullWidth>
                Get Started Free
              </AnimatedButton>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
