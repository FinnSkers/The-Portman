'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface ThemeToggleProps {
  onThemeChange?: (isProfessional: boolean) => void;
}

export default function ThemeToggle({ onThemeChange }: ThemeToggleProps) {
  const [isProfessional, setIsProfessional] = useState(false);

  useEffect(() => {
    // Check if there's a saved theme preference
    const savedTheme = localStorage.getItem('portman-theme');
    if (savedTheme) {
      const isProf = savedTheme === 'professional';
      setIsProfessional(isProf);
      document.documentElement.classList.toggle('professional-mode', isProf);
      onThemeChange?.(isProf);
    }
  }, [onThemeChange]);

  const toggleTheme = () => {
    const newIsProfessional = !isProfessional;
    setIsProfessional(newIsProfessional);
    
    // Save to localStorage
    localStorage.setItem('portman-theme', newIsProfessional ? 'professional' : 'fun');
    
    // Toggle class on document
    document.documentElement.classList.toggle('professional-mode', newIsProfessional);
    
    // Notify parent component
    onThemeChange?.(newIsProfessional);
  };

  return (
    <motion.div 
      className="flex items-center gap-2"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <span className={`text-xs transition-all duration-300 hidden sm:inline ${
        isProfessional 
          ? 'text-gray-400' 
          : 'text-green-400 font-8bit'
      }`}>
        Fun
      </span>
      
      <motion.label 
        className="relative cursor-pointer"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <input
          type="checkbox"
          checked={isProfessional}
          onChange={toggleTheme}
          className="sr-only"
          aria-label="Toggle between Fun and Professional mode"
        />
        <motion.div
          className="w-12 h-6 rounded-full shadow-inner transition-all duration-300 relative"
          animate={{
            backgroundColor: isProfessional ? '#6366f1' : '#10b981'
          }}
        >
          <motion.div
            className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md"
            animate={{
              x: isProfessional ? 24 : 0
            }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 25
            }}
          />
        </motion.div>
      </motion.label>
      
      <span className={`text-xs transition-all duration-300 hidden sm:inline ${
        isProfessional 
          ? 'text-indigo-600 font-medium' 
          : 'text-green-400/50 font-8bit'
      }`}>
        Pro
      </span>
    </motion.div>
  );
}
