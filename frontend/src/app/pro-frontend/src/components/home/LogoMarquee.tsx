"use client";

import React, { useRef, useEffect } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';

// Brand logos
const brands = [
  { name: 'Google', logo: 'G' },
  { name: 'Microsoft', logo: 'M' },
  { name: 'Airbnb', logo: 'A' },
  { name: 'Uber', logo: 'U' },
  { name: 'Slack', logo: 'S' },
  { name: 'Amazon', logo: 'A' },
  { name: 'Netflix', logo: 'N' },
  { name: 'Dropbox', logo: 'D' },
  { name: 'Twitter', logo: 'T' },
  { name: 'Meta', logo: 'M' },
];

export const LogoMarquee: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: false, margin: "-100px" });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [isInView, controls]);

  return (
    <motion.div
      ref={containerRef}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { 
          opacity: 1, 
          y: 0,
          transition: { 
            duration: 0.6,
            staggerChildren: 0.1 
          } 
        }
      }}
      className="py-14 bg-white"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <motion.p 
            className="text-gray-600 text-lg"
            variants={{
              hidden: { opacity: 0, y: 10 },
              visible: { opacity: 1, y: 0 }
            }}
          >
            Trusted by professionals from companies like
          </motion.p>
        </div>

        <div className="relative flex overflow-hidden">
          {/* First set of logos */}
          <div className="flex animate-marquee whitespace-nowrap">
            {brands.map((brand, index) => (
              <div 
                key={`${brand.name}-1-${index}`} 
                className="flex items-center justify-center mx-8"
              >
                <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center text-xl font-semibold text-gray-700">
                  {brand.logo}
                </div>
                <span className="ml-3 font-medium text-gray-800">{brand.name}</span>
              </div>
            ))}
          </div>
          
          {/* Duplicated set for continuous scroll */}
          <div className="absolute top-0 flex animate-marquee2 whitespace-nowrap">
            {brands.map((brand, index) => (
              <div 
                key={`${brand.name}-2-${index}`} 
                className="flex items-center justify-center mx-8"
              >
                <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center text-xl font-semibold text-gray-700">
                  {brand.logo}
                </div>
                <span className="ml-3 font-medium text-gray-800">{brand.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
