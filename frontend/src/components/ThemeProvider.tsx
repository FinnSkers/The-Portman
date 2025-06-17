'use client';

import { createContext, useContext, useEffect, useState } from 'react';

interface ThemeContextType {
  isProfessional: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isProfessional, setIsProfessional] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('portman-theme');
    // Default to professional mode (dark theme)
    if (!saved || saved === 'professional') {
      setIsProfessional(true);
      document.documentElement.classList.add('professional-mode');
      localStorage.setItem('portman-theme', 'professional');
    } else {
      setIsProfessional(false);
      document.documentElement.classList.remove('professional-mode');
    }
  }, []);

  const toggleTheme = () => {
    const newMode = !isProfessional;
    setIsProfessional(newMode);
    
    if (newMode) {
      document.documentElement.classList.add('professional-mode');
      localStorage.setItem('portman-theme', 'professional');
    } else {
      document.documentElement.classList.remove('professional-mode');
      localStorage.setItem('portman-theme', 'fun');
    }
  };

  return (
    <ThemeContext.Provider value={{ isProfessional, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
