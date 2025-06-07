"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

interface TypingAnimationProps {
  texts: string[];
  speed?: number;
  pause?: number;
  className?: string;
}

export default function TypingAnimation({ 
  texts, 
  speed = 100, 
  pause = 2000, 
  className = "" 
}: TypingAnimationProps) {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    const fullText = texts[currentTextIndex];
    
    const timeout = setTimeout(() => {
      if (isTyping && !isDeleting) {
        // Typing
        if (currentText.length < fullText.length) {
          setCurrentText(fullText.slice(0, currentText.length + 1));
        } else {
          // Finished typing, start pause before fading/deleting
          setIsTyping(false);
          setTimeout(() => {
            setIsDeleting(true);
          }, pause);
        }
      } else if (isDeleting) {
        // Deleting/Fading
        if (currentText.length > 0) {
          setCurrentText(currentText.slice(0, -1));
        } else {
          // Finished deleting, move to next text
          setIsDeleting(false);
          setIsTyping(true);
          setCurrentTextIndex((prev) => (prev + 1) % texts.length);
        }
      }
    }, isTyping ? speed : speed / 3); // Delete faster than type

    return () => clearTimeout(timeout);
  }, [currentText, currentTextIndex, isTyping, isDeleting, texts, speed, pause]);

  return (
    <div className={`inline-block ${className}`}>
      <AnimatePresence mode="wait">
        <motion.span
          key={`${currentTextIndex}-${isDeleting ? 'deleting' : 'typing'}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ 
            opacity: isDeleting ? [1, 0.8, 0.6, 0.3, 0] : [0, 0.3, 0.6, 0.8, 1],
            y: isDeleting ? [0, -5, -10] : [10, 5, 0],
            filter: isDeleting ? ["blur(0px)", "blur(0.5px)", "blur(1px)"] : ["blur(1px)", "blur(0.5px)", "blur(0px)"]
          }}
          exit={{ 
            opacity: 0, 
            y: -10,
            filter: "blur(2px)",
            transition: { duration: 0.3 }
          }}
          transition={{ 
            duration: isDeleting ? 0.6 : 0.8,
            ease: "easeInOut"
          }}
          className="inline-block"
        >
          {currentText}
        </motion.span>
      </AnimatePresence>
      <motion.span
        animate={{ 
          opacity: showCursor ? [0, 1, 0] : 0,
          scaleY: [1, 1.1, 1]
        }}
        transition={{ 
          opacity: { duration: 1, repeat: Infinity, ease: "easeInOut" },
          scaleY: { duration: 0.5, repeat: Infinity, ease: "easeInOut" }
        }}
        className="inline-block w-0.5 h-6 md:h-8 bg-gradient-to-b from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 ml-1 align-middle rounded-full"
        style={{ filter: "drop-shadow(0 0 4px rgba(99, 102, 241, 0.5))" }}
      />
    </div>
  );
}
