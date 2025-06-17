"use client";

import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { AnimatedButton } from '@/components/ui';
import Link from 'next/link';

const PARTICLE_COUNT = 20;

function getRandomParticle() {
  return {
    left: Math.random() * 100,
    top: Math.random() * 100,
    x1: Math.random() * 100,
    x2: Math.random() * 100,
    y1: Math.random() * 100,
    y2: Math.random() * 100,
    duration: Math.random() * 10 + 10,
  };
}

export const Hero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start']
  });
  
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, 100]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);

  const [particles, setParticles] = useState<Array<ReturnType<typeof getRandomParticle>>>([]);

  useEffect(() => {
    // Only run on client
    setParticles(Array.from({ length: PARTICLE_COUNT }, getRandomParticle));
  }, []);

  return (
    <motion.div 
      ref={containerRef}
      className="relative overflow-hidden py-16 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-900"
      style={{ opacity, y, scale }}
    >
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute right-0 top-0 -translate-y-1/4 translate-x-1/4 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-blue-600/20 to-purple-600/30 blur-2xl" />
        <div className="absolute left-0 bottom-0 translate-y-1/4 -translate-x-1/4 w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-blue-400/20 to-teal-400/30 blur-xl" />
        
        {/* Floating particles */}
        <div className="absolute inset-0">
          {particles.map((p, i) => (
            <motion.div
              key={i}
              className="absolute h-2 w-2 rounded-full bg-blue-600/20"
              animate={{
                x: [ `${p.x1}%`, `${p.x2}%` ],
                y: [ `${p.y1}%`, `${p.y2}%` ],
              }}
              transition={{
                duration: p.duration,
                repeat: Infinity,
                repeatType: 'reverse',
              }}
              style={{
                left: `${p.left}%`,
                top: `${p.top}%`,
              }}
            />
          ))}
        </div>
      </div>

      <div className="container mx-auto relative z-10 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              Transform Your CV into a Stunning Portfolio
            </h1>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <p className="text-lg md:text-xl text-gray-700 mb-8 mx-auto max-w-3xl">
              Effortlessly create beautiful, professional portfolio websites from your resume in minutes. 
              Showcase your skills, experience, and achievements to stand out from the crowd.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/auth/register">
              <AnimatedButton 
                variant="primary" 
                size="lg" 
                animationVariant="pulse"
              >
                Start for Free
              </AnimatedButton>
            </Link>
            <Link href="/#demo">
              <AnimatedButton 
                variant="outline" 
                size="lg" 
                animationVariant="bounce"
              >
                View Demo
              </AnimatedButton>
            </Link>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-4 text-sm text-gray-500"
          >
            No credit card required. Free forever.
          </motion.div>
        </div>
        
        {/* Hero image placeholder */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-12 md:mt-16 relative mx-auto max-w-5xl"
        >
          <div className="aspect-video relative rounded-xl overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
              <p className="text-white text-lg font-medium">
                Portfolio demo image placeholder
              </p>
              {/* Replace with actual image: */}
              {/* <Image
                src="/images/portfolio-demo.jpg"
                alt="Portfolio Demo"
                fill
                className="object-cover"
              /> */}
            </div>
          </div>
          
          {/* Floating UI elements for visual appeal */}
          <motion.div
            className="absolute -right-4 -top-10 bg-white rounded-lg shadow-xl p-4 w-44"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <div className="h-1.5 w-8 bg-green-500 rounded-full mb-2"></div>
            <div className="h-2 w-32 bg-gray-200 rounded-full mb-1"></div>
            <div className="h-2 w-20 bg-gray-200 rounded-full"></div>
          </motion.div>
          
          <motion.div
            className="absolute -left-4 -bottom-6 bg-white rounded-lg shadow-xl p-4 w-52"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 1 }}
          >
            <div className="h-1.5 w-8 bg-blue-500 rounded-full mb-2"></div>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-blue-100"></div>
              <div>
                <div className="h-2.5 w-24 bg-gray-200 rounded-full mb-1"></div>
                <div className="h-2 w-16 bg-gray-200 rounded-full"></div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};
