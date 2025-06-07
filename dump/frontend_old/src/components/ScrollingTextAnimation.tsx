"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef, RefObject } from "react";

interface ScrollingTextAnimationProps {
  dynamicTexts: string[];
  duration?: number;
  className?: string;
  titleRef?: RefObject<Element>;
}

export default function ScrollingTextAnimation({ 
  dynamicTexts, 
  duration = 3000,
  className = "",
  titleRef
}: ScrollingTextAnimationProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [subtitleWidth, setSubtitleWidth] = useState<string | undefined>(undefined);
  const [fontSize, setFontSize] = useState<string>("2.2rem");
  const subtitleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateWidth = () => {
      if (titleRef?.current) {
        const width = (titleRef.current as HTMLElement).offsetWidth;
        setSubtitleWidth(width ? `${width}px` : undefined);
        // Dynamically adjust font size based on width
        if (width < 400) setFontSize("1.2rem");
        else if (width < 600) setFontSize("1.7rem");
        else if (width < 900) setFontSize("2.2rem");
        else setFontSize("2.7rem");
      } else {
        setSubtitleWidth(undefined);
        setFontSize("2.2rem");
      }
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, [titleRef]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % dynamicTexts.length);
    }, duration);
    return () => clearInterval(interval);
  }, [dynamicTexts.length, duration]);

  return (
    <div
      className={`flex items-center justify-center w-full z-20 ${className}`}
      style={{ minHeight: '3.5rem' }}
      aria-live="polite"
    >
      <div
        ref={subtitleRef}
        className="relative flex flex-col justify-center items-center overflow-hidden bg-transparent rounded"
        style={{
          width: subtitleWidth,
          minWidth: 180,
          transition: 'width 0.3s cubic-bezier(.4,2,.6,1)',
        }}
        tabIndex={0}
        aria-label="Dynamic subtitle text"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 32, scale: 0.98, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -32, scale: 0.98, filter: "blur(8px)" }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="w-full text-center font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent whitespace-pre-line leading-tight shadow-sm"
            style={{
              backgroundSize: "200% 200%",
              animation: "gradient-shift 4s ease-in-out infinite",
              lineHeight: '1.15',
              fontSize: fontSize,
              margin: 0,
              padding: 0,
              color: 'rgba(60,60,80,0.98)',
              zIndex: 20,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '3.5rem',
              maxWidth: '100%',
            }}
          >
            {dynamicTexts[currentIndex]}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
