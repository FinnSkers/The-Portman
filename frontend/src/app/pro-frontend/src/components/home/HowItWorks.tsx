"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';
import { AnimatedButton } from '@/components/ui';
import Link from 'next/link';

// Steps in the process
const steps = [
  {
    title: 'Upload Your CV',
    description: 'Upload your CV in PDF, Word, or plain text format.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
      </svg>
    ),
  },
  {
    title: 'AI Analysis',
    description: 'Our AI extracts and analyzes your skills, experience, and achievements.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
  },
  {
    title: 'Choose Template',
    description: 'Select from our collection of professional portfolio templates.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
      </svg>
    ),
  },
  {
    title: 'Customize & Preview',
    description: 'Personalize colors, sections, and content to match your style.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
      </svg>
    ),
  },
  {
    title: 'Publish & Share',
    description: 'Publish your portfolio with a custom URL and share with employers.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
      </svg>
    ),
  },
];

export const HowItWorks: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, margin: "-100px" });
  const controls = useAnimation();
  const [activeStep, setActiveStep] = useState(0);

  // Start animation when section is in view
  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [isInView, controls]);

  // Auto-cycle through steps
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);
  return (
    <section ref={ref} id="how-it-works" className="py-20 bg-gray-800">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-16"
          initial="hidden"
          animate={controls}
          variants={{
            hidden: { opacity: 0 },
            visible: { 
              opacity: 1,
              transition: { staggerChildren: 0.2 }
            }
          }}
        >
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-4 text-white"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
            }}
          >
            How It Works
          </motion.h2>
          <motion.p 
            className="text-lg text-gray-300"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
            }}
          >
            Create your professional portfolio in three simple steps. No coding or design skills required.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Steps list */}
          <motion.div 
            className="space-y-10"
            initial="hidden"
            animate={controls}
            variants={{
              hidden: { opacity: 0 },
              visible: { 
                opacity: 1,
                transition: { staggerChildren: 0.1, delayChildren: 0.3 }
              }
            }}
          >
            {steps.map((step, index) => (
              <motion.div
                key={index}
                className={`flex items-start ${
                  activeStep === index ? "opacity-100" : "opacity-60"
                } transition-opacity duration-300`}
                variants={{
                  hidden: { opacity: 0, x: -20 },
                  visible: { opacity: 1, x: 0, transition: { duration: 0.5 } }
                }}
                onClick={() => setActiveStep(index)}
              >                <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                  activeStep === index ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300"
                } transition-colors duration-300`}>
                  {step.icon}
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-semibold text-white">{step.title}</h3>
                  <p className="mt-1 text-gray-300">{step.description}</p>
                </div>
              </motion.div>
            ))}

            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.5 } }
              }}
            >
              <Link href="/auth/register">
                <AnimatedButton 
                  variant="primary" 
                  size="lg" 
                  animationVariant="pulse"
                >
                  Get Started Free
                </AnimatedButton>
              </Link>
            </motion.div>
          </motion.div>

          {/* Visual representation */}
          <motion.div 
            className="relative h-96 lg:h-auto"
            initial="hidden"
            animate={controls}
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { duration: 0.8, delay: 0.5 } }
            }}
          >            <div className="bg-gray-700 rounded-lg h-full w-full overflow-hidden">
              <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                {/* Animation placeholder - in a real app, show a visual representation of each step */}
                <div className="relative w-full max-w-md">
                  {/* Browser frame */}
                  <div className="bg-gray-800 rounded-lg shadow-2xl overflow-hidden border border-gray-600">
                    {/* Browser header */}
                    <div className="bg-gray-700 px-4 py-2 border-b border-gray-600 flex items-center">
                      <div className="flex space-x-2">
                        <div className="w-3 h-3 rounded-full bg-red-400"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                        <div className="w-3 h-3 rounded-full bg-green-400"></div>
                      </div>
                      <div className="ml-4 flex-grow">
                        <div className="bg-gray-600 rounded-full h-6 w-full max-w-xs mx-auto overflow-hidden">
                          <div className="h-full w-full flex items-center justify-center text-xs text-gray-300">
                            yourname.portman.app
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Browser content */}
                    <div className="p-4 h-64">
                      {/* Step visualization */}
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                          <div className="text-6xl mb-4 text-blue-500 flex justify-center">
                            {steps[activeStep].icon}
                          </div>                          <h3 className="text-xl font-semibold text-white">{steps[activeStep].title}</h3>
                          <p className="text-gray-300 mt-2">{steps[activeStep].description}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Progress indicator */}
                  <div className="flex justify-center mt-4 space-x-2">
                    {steps.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveStep(idx)}                        className={`w-2.5 h-2.5 rounded-full ${
                          activeStep === idx ? "bg-blue-400" : "bg-gray-500"
                        }`}
                        aria-label={`Go to step ${idx + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
