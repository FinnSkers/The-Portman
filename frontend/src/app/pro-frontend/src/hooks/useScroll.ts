"use client";

import { useState, useEffect } from 'react';

/**
 * Hook for tracking scroll position
 * Useful for implementing scroll animations, sticky headers, etc.
 */
export function useScrollPosition() {
  const [scrollPosition, setScrollPosition] = useState({
    x: 0,
    y: 0,
  });
  
  const [direction, setDirection] = useState<'up' | 'down' | null>(null);
  const [lastYPosition, setLastYPosition] = useState(0);
  
  useEffect(() => {
    // Skip if not in browser environment
    if (typeof window === 'undefined') return;
    
    const handleScroll = () => {
      const currentYPosition = window.scrollY;
      
      setScrollPosition({
        x: window.scrollX,
        y: currentYPosition,
      });
      
      // Determine scroll direction
      if (currentYPosition > lastYPosition) {
        setDirection('down');
      } else if (currentYPosition < lastYPosition) {
        setDirection('up');
      }
      
      setLastYPosition(currentYPosition);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastYPosition]);
  
  return { ...scrollPosition, direction };
}

/**
 * Hook for implementing scroll-based animations
 * @param threshold The percentage of element visibility required to trigger (0-1)
 */
export function useScrollIntoView(threshold: number = 0.2) {
  const [ref, setRef] = useState<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    if (!ref || typeof IntersectionObserver === 'undefined') return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold,
      }
    );
    
    observer.observe(ref);
    
    return () => {
      observer.disconnect();
    };
  }, [ref, threshold]);
  
  return { ref: setRef, isVisible };
}
