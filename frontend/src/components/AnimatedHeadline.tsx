import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const headlines = [
  "AI-Powered CV Parsing",
  "Instant Portfolio Generation",
  "Professional Benchmarking",
  "Modern, Responsive Templates",
  "Live Preview & Customization",
  "Export & Share Instantly"
];

export default function AnimatedHeadline() {
  const [index, setIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [typing, setTyping] = useState(true);
  const [show, setShow] = useState(true);
  const typingTimeout = useRef<NodeJS.Timeout | null>(null);
  const fadeTimeout = useRef<NodeJS.Timeout | null>(null);

  // Typing animation
  useEffect(() => {
    if (!show) return;
    if (typing) {
      if (displayed.length < headlines[index].length) {
        typingTimeout.current = setTimeout(() => {
          setDisplayed(headlines[index].slice(0, displayed.length + 1));
        }, 40);
      } else {
        // Pause, then start fade out
        fadeTimeout.current = setTimeout(() => {
          setTyping(false);
        }, 1200);
      }
    } else {
      // Fade out, then switch headline
      fadeTimeout.current = setTimeout(() => {
        setShow(false);
        setTimeout(() => {
          setIndex((prev) => (prev + 1) % headlines.length);
          setDisplayed("");
          setTyping(true);
          setShow(true);
        }, 350);
      }, 200);
    }
    return () => {
      if (typingTimeout.current) clearTimeout(typingTimeout.current);
      if (fadeTimeout.current) clearTimeout(fadeTimeout.current);
    };
    // eslint-disable-next-line
  }, [displayed, typing, show, index]);

  return (
    <span className="inline-block min-h-[3rem] relative">
      <AnimatePresence mode="wait">
        {show && (
          <motion.span
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35 }}
            className="absolute left-0 w-full text-indigo-500 dark:text-indigo-300 font-semibold text-3xl md:text-4xl tracking-tight whitespace-nowrap"
            aria-live="polite"
            style={{ fontFamily: 'Fira Mono, Menlo, monospace' }}
          >
            {displayed}
            <span className="inline-block animate-pulse">|</span>
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}
