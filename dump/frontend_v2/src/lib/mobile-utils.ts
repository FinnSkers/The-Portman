// Mobile utilities for responsive design
import { useState, useEffect } from 'react';

export type BreakpointSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export const breakpoints = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

export function useBreakpoint(size: BreakpointSize = 'md') {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const query = `(min-width: ${breakpoints[size]}px)`;
    const media = window.matchMedia(query);
    
    const updateMatch = () => setMatches(media.matches);
    updateMatch();
    
    media.addEventListener('change', updateMatch);
    return () => media.removeEventListener('change', updateMatch);
  }, [size]);

  return matches;
}

export function useIsMobile() {
  return !useBreakpoint('md');
}

export function useIsTablet() {
  const isMd = useBreakpoint('md');
  const isLg = useBreakpoint('lg');
  return isMd && !isLg;
}

export function useIsDesktop() {
  return useBreakpoint('lg');
}

// Mobile-first grid system
export const mobileGrid = {
  container: "px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto",
  grid: "grid grid-cols-1 gap-4 sm:gap-6 lg:gap-8",
  "grid-2": "grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6",
  "grid-3": "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6",
  "grid-4": "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6",
} as const;

// Mobile-optimized spacing
export const mobileSpacing = {
  section: "py-8 sm:py-12 lg:py-16",
  card: "p-4 sm:p-6 lg:p-8",
  stack: "space-y-4 sm:space-y-6 lg:space-y-8",
} as const;

// Touch-friendly sizes
export const touchTarget = {
  button: "min-h-[44px] min-w-[44px]", // Apple's recommended minimum
  interactive: "min-h-[48px]", // Material Design recommendation
} as const;

// Mobile typography
export const mobileTypography = {
  hero: "text-2xl sm:text-3xl lg:text-4xl xl:text-5xl",
  heading: "text-xl sm:text-2xl lg:text-3xl",
  subheading: "text-lg sm:text-xl lg:text-2xl",
  body: "text-sm sm:text-base",
  caption: "text-xs sm:text-sm",
} as const;

// Safe area utilities for mobile
export const safeArea = {
  top: "pt-safe-top",
  bottom: "pb-safe-bottom",
  left: "pl-safe-left", 
  right: "pr-safe-right",
  x: "px-safe-x",
  y: "py-safe-y",
  all: "p-safe",
} as const;

// Mobile-optimized animations
export const mobileAnimations = {
  fadeInUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  },
  slideInLeft: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 }
  },
  scale: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 }
  }
} as const;

// Device detection utilities
export function isTouchDevice() {
  if (typeof window === 'undefined') return false;
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

export function isIOSDevice() {
  if (typeof navigator === 'undefined') return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
}

export function isAndroidDevice() {
  if (typeof navigator === 'undefined') return false;
  return /Android/.test(navigator.userAgent);
}

// Mobile-specific event handlers
export function useTouchEvents() {
  const isMobile = useIsMobile();
  const isTouch = isTouchDevice();
  
  return {
    isMobile,
    isTouch,
    eventType: isMobile || isTouch ? 'touch' : 'mouse',
  };
}
