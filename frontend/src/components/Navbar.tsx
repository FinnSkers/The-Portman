"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import ThemeToggle from "./ThemeToggle";

export default function Navbar({ onSignInClick, onSettingsClick }: { onSignInClick: () => void; onSettingsClick: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isProfessionalMode, setIsProfessionalMode] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    // Check initial theme
    const checkTheme = () => {
      setIsProfessionalMode(document.documentElement.classList.contains('professional-mode'));
    };
    
    // Create observer for theme changes
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    
    window.addEventListener("scroll", handleScroll);
    checkTheme(); // Initial check
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, []);

  return (
    <header className={`navbar w-full fixed top-0 left-0 z-50 transition-all duration-500 ${
      isProfessionalMode 
        ? `border-b ${scrolled ? 'bg-white/95 shadow-lg py-2' : 'bg-white/90 py-3'}` 
        : `border-b border-green-400/20 ${scrolled ? "bg-black/95 glass shadow-md py-1" : "bg-black/70 py-2"}`
    }`}>
      <div className="w-full max-w-7xl mx-auto px-4 flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2"
        >
          <div className="relative h-7 w-7 animate-float">
            <Image src="/8bitlogo.svg" alt="Portman Logo" fill className="object-contain" />
          </div>
          <span className={`tracking-wider transition-all duration-300 ${
            isProfessionalMode 
              ? 'navbar-brand text-blue-600 font-bold text-lg' 
              : 'font-8bit text-green-400 text-sm glow-text'
          }`}>
            Portman
          </span>
        </motion.div>
        
        {/* Desktop Navigation */}
        <motion.nav
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="hidden md:flex items-center gap-2"
        >
          <Link href="/" className={`nav-link transition-all duration-300 px-2 py-1 rounded text-xs focus:outline-none focus:ring-2 ${
            isProfessionalMode 
              ? 'text-slate-600 hover:text-blue-600 focus:ring-blue-400' 
              : 'font-8bit text-green-400 hover:text-pink-400 focus:ring-pink-400'
          }`}>Home</Link>
          <Link href="#features" className={`nav-link transition-all duration-300 px-2 py-1 rounded text-xs focus:outline-none focus:ring-2 ${
            isProfessionalMode 
              ? 'text-slate-600 hover:text-blue-600 focus:ring-blue-400' 
              : 'font-8bit text-green-400 hover:text-pink-400 focus:ring-pink-400'
          }`}>Features</Link>
          <Link href="#testimonials" className={`nav-link transition-all duration-300 px-2 py-1 rounded text-xs focus:outline-none focus:ring-2 ${
            isProfessionalMode 
              ? 'text-slate-600 hover:text-blue-600 focus:ring-blue-400' 
              : 'font-8bit text-green-400 hover:text-pink-400 focus:ring-pink-400'
          }`}>Testimonials</Link>
          <Link href="#portfolios" className={`nav-link transition-all duration-300 px-2 py-1 rounded text-xs focus:outline-none focus:ring-2 ${
            isProfessionalMode 
              ? 'text-slate-600 hover:text-blue-600 focus:ring-blue-400' 
              : 'font-8bit text-green-400 hover:text-pink-400 focus:ring-pink-400'
          }`}>Portfolios</Link>
          <Link href="#dashboard" className={`nav-link transition-all duration-300 px-2 py-1 rounded text-xs focus:outline-none focus:ring-2 ${
            isProfessionalMode 
              ? 'text-slate-600 hover:text-blue-600 focus:ring-blue-400' 
              : 'font-8bit text-green-400 hover:text-pink-400 focus:ring-pink-400'
          }`}>Dashboard</Link>
          
          {/* Theme Toggle */}
          <div className={`mx-3 px-3 border-l transition-all duration-300 ${
            isProfessionalMode ? 'border-slate-200' : 'border-green-400/30'
          }`}>
            <ThemeToggle />
          </div>
            {/* Login/Register Buttons */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`btn-secondary transition-all duration-300 px-2 py-1 rounded text-xs focus:outline-none focus:ring-2 ${
              isProfessionalMode 
                ? 'text-slate-600 border border-slate-300 hover:bg-slate-50 hover:text-blue-600 focus:ring-blue-400' 
                : 'font-8bit text-green-400 border border-green-400 hover:bg-green-400 hover:text-black focus:ring-pink-400'
            }`}
            onClick={onSignInClick}
          >
            Login
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`btn-primary transition-all duration-300 px-2 py-1 rounded text-xs focus:outline-none focus:ring-2 ${
              isProfessionalMode 
                ? 'text-white bg-blue-600 border border-blue-600 hover:bg-blue-700 focus:ring-blue-400' 
                : 'font-8bit text-black bg-green-400 border border-green-500 hover:bg-green-500 focus:ring-pink-400'
            }`}
            onClick={onSignInClick}
          >
            Sign Up
          </motion.button>
          
          {/* Settings Icon */}
          <motion.button
            whileHover={{ scale: 1.1, rotate: isProfessionalMode ? 15 : 90 }}
            whileTap={{ scale: 0.9 }}
            className={`p-2 rounded transition-all duration-300 focus:outline-none focus:ring-2 ${
              isProfessionalMode 
                ? 'hover:bg-slate-100 text-slate-600 focus:ring-blue-400' 
                : 'hover:bg-green-400/20 text-green-400 focus:ring-pink-400'
            }`}
            onClick={onSettingsClick}
            aria-label="Settings"
          >
            {isProfessionalMode ? (
              // Professional settings icon
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M12 1v6m0 8v6m11-7h-6m-8 0H1m17-4a4 4 0 0 0-8 0m8 8a4 4 0 0 0-8 0"></path>
              </svg>
            ) : (
              // 8-bit gear/settings icon
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="text-current">
                <rect x="6" y="6" width="6" height="6" fill="currentColor"/>
                <rect x="8" y="2" width="2" height="4" fill="currentColor"/>
                <rect x="8" y="12" width="2" height="4" fill="currentColor"/>
                <rect x="2" y="8" width="4" height="2" fill="currentColor"/>
                <rect x="12" y="8" width="4" height="2" fill="currentColor"/>
                <rect x="12" y="4" width="2" height="2" fill="currentColor"/>
                <rect x="4" y="4" width="2" height="2" fill="currentColor"/>
                <rect x="12" y="12" width="2" height="2" fill="currentColor"/>
                <rect x="4" y="12" width="2" height="2" fill="currentColor"/>
                <rect x="8" y="8" width="2" height="2" fill="#000000"/>
              </svg>            )}
          </motion.button>
        </motion.nav>
        
        {/* Mobile Menu Button */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden font-8bit text-green-400 border border-green-400 px-2 py-1 rounded text-xs"
          aria-label="Toggle mobile menu"
        >
          {mobileMenuOpen ? 'Close' : 'Menu'}
        </motion.button>
      </div>
      
      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-black/95 glass border-t border-green-400/30"
        >
          <div className="flex flex-col items-center gap-3 py-4">
            <Link href="/" className="font-8bit text-green-400 hover:text-pink-400 transition-colors px-3 py-2 text-xs" onClick={() => setMobileMenuOpen(false)}>Home</Link>
            <Link href="#features" className="font-8bit text-green-400 hover:text-pink-400 transition-colors px-3 py-2 text-xs" onClick={() => setMobileMenuOpen(false)}>Features</Link>
            <Link href="#testimonials" className="font-8bit text-green-400 hover:text-pink-400 transition-colors px-3 py-2 text-xs" onClick={() => setMobileMenuOpen(false)}>Testimonials</Link>            <Link href="#portfolios" className="font-8bit text-green-400 hover:text-pink-400 transition-colors px-3 py-2 text-xs" onClick={() => setMobileMenuOpen(false)}>Portfolios</Link>
            <Link href="#dashboard" className="font-8bit text-green-400 hover:text-pink-400 transition-colors px-3 py-2 text-xs" onClick={() => setMobileMenuOpen(false)}>Dashboard</Link>
            
            {/* Mobile Theme Toggle */}
            <div className="my-2 py-2 border-t border-green-400/30">
              <ThemeToggle />
            </div>
            
            <div className="flex gap-2 mt-2">
              <button
                className="font-8bit text-green-400 border border-green-400 hover:bg-green-400 hover:text-black transition-colors px-3 py-1 rounded text-xs"
                onClick={() => { onSignInClick(); setMobileMenuOpen(false); }}
              >
                Login
              </button>
              <button
                className="font-8bit text-black bg-green-400 border border-green-500 hover:bg-green-500 transition-colors px-3 py-1 rounded text-xs"
                onClick={() => { onSignInClick(); setMobileMenuOpen(false); }}
              >
                Sign Up
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </header>
  );
}
